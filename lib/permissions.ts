/**
 * Permission checking and rate limiting for Design-Rite v3
 * Server-side permission validation with Supabase backend
 */

import { getServerSession } from 'next-auth';
import { authOptions } from './auth-config';
import { createClient } from '@supabase/supabase-js';

// Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * Permission action types
 */
export type PermissionAction = 'read' | 'create' | 'update' | 'delete' | 'export';

/**
 * Feature types that can be permission-controlled
 */
export type Feature =
  | 'quotes'
  | 'ai_assessments'
  | 'system_surveyor'
  | 'users'
  | 'activity_logs'
  | 'settings'
  | 'estimates';

/**
 * Role types in the system
 */
export type Role = 'super_admin' | 'admin' | 'manager' | 'user' | 'guest';

/**
 * Rate limit result
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetDate?: Date;
}

/**
 * Check if current user has permission for an action on a feature
 * @param feature - Feature to check permission for
 * @param action - Action to perform (read, create, update, delete, export)
 * @returns Promise<boolean> - True if user has permission
 */
export async function checkPermission(
  feature: Feature,
  action: PermissionAction
): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role) {
      return false;
    }

    // Super admin has all permissions
    if (session.user.role === 'super_admin') {
      return true;
    }

    // Check permission in database
    const { data: permission, error } = await supabase
      .from('permissions')
      .select(`can_${action}`)
      .eq('role', session.user.role)
      .eq('feature', feature)
      .single();

    if (error) {
      console.error('Permission check error:', error);
      return false;
    }

    return permission?.[`can_${action}`] || false;
  } catch (error) {
    console.error('Permission check failed:', error);
    return false;
  }
}

/**
 * Check if user has exceeded rate limit for a feature
 * @param userId - User ID to check
 * @param feature - Feature to check rate limit for
 * @returns Promise<RateLimitResult> - Rate limit status
 */
export async function checkRateLimit(
  userId: string,
  feature: Feature
): Promise<RateLimitResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role) {
      return { allowed: false, remaining: 0, limit: 0 };
    }

    // Super admin and admin bypass rate limits
    if (session.user.role === 'super_admin' || session.user.role === 'admin') {
      return { allowed: true, remaining: -1, limit: -1 };
    }

    // Check if user has rate limit override
    const { data: user } = await supabase
      .from('users')
      .select('rate_limit_override')
      .eq('id', userId)
      .single();

    if (user?.rate_limit_override) {
      return { allowed: true, remaining: -1, limit: -1 };
    }

    // Get user's permission limits
    const { data: permission } = await supabase
      .from('permissions')
      .select('daily_limit, monthly_limit')
      .eq('role', session.user.role)
      .eq('feature', feature)
      .single();

    // If no daily limit, unlimited
    if (!permission?.daily_limit) {
      return { allowed: true, remaining: -1, limit: -1 };
    }

    // Get today's usage
    const today = new Date().toISOString().split('T')[0];
    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('daily_count')
      .eq('user_id', userId)
      .eq('feature', feature)
      .eq('usage_date', today)
      .single();

    const currentCount = usage?.daily_count || 0;
    const remaining = permission.daily_limit - currentCount;

    // Calculate reset date (midnight tonight)
    const resetDate = new Date();
    resetDate.setHours(24, 0, 0, 0);

    return {
      allowed: remaining > 0,
      remaining: Math.max(0, remaining),
      limit: permission.daily_limit,
      resetDate
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return { allowed: false, remaining: 0, limit: 0 };
  }
}

/**
 * Increment usage counter for a feature
 * @param userId - User ID
 * @param feature - Feature being used
 */
export async function incrementUsage(userId: string, feature: Feature): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Call Supabase function to increment usage
    const { error } = await supabase.rpc('increment_usage', {
      p_user_id: userId,
      p_feature: feature,
      p_usage_date: today
    });

    if (error) {
      console.error('Failed to increment usage:', error);
    }
  } catch (error) {
    console.error('Usage increment error:', error);
  }
}

/**
 * Get current usage count for a feature
 * @param userId - User ID
 * @param feature - Feature to check
 * @param period - 'daily' or 'monthly'
 * @returns Promise<number> - Current usage count
 */
export async function getUsageCount(
  userId: string,
  feature: Feature,
  period: 'daily' | 'monthly' = 'daily'
): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('get_usage_count', {
      p_user_id: userId,
      p_feature: feature,
      p_period: period
    });

    if (error) {
      console.error('Failed to get usage count:', error);
      return 0;
    }

    return data || 0;
  } catch (error) {
    console.error('Get usage count error:', error);
    return 0;
  }
}

/**
 * Log user activity to activity_logs table
 * @param userId - User ID performing the action
 * @param action - Action being performed
 * @param resourceType - Type of resource (optional)
 * @param resourceId - ID of resource (optional)
 * @param details - Additional details as JSON (optional)
 * @param success - Whether action was successful
 * @param errorMessage - Error message if action failed
 */
export async function logActivity(
  userId: string | null,
  action: string,
  options?: {
    resourceType?: string;
    resourceId?: string;
    ipAddress?: string;
    userAgent?: string;
    details?: any;
    success?: boolean;
    errorMessage?: string;
  }
): Promise<void> {
  try {
    const { error } = await supabase.from('activity_logs').insert({
      user_id: userId,
      action,
      resource_type: options?.resourceType,
      resource_id: options?.resourceId,
      ip_address: options?.ipAddress,
      user_agent: options?.userAgent,
      details: options?.details,
      success: options?.success ?? true,
      error_message: options?.errorMessage
    });

    if (error) {
      console.error('Failed to log activity:', error);
    }
  } catch (error) {
    console.error('Activity logging error:', error);
  }
}

/**
 * Check if current user has a specific role
 * @param requiredRole - Minimum role required
 * @returns Promise<boolean> - True if user has required role or higher
 */
export async function hasRole(requiredRole: Role): Promise<boolean> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role) {
    return false;
  }

  const roleHierarchy: Record<Role, number> = {
    super_admin: 5,
    admin: 4,
    manager: 3,
    user: 2,
    guest: 1
  };

  const userRoleLevel = roleHierarchy[session.user.role as Role] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

  return userRoleLevel >= requiredRoleLevel;
}

/**
 * Get current user's session data
 * @returns Promise<Session | null> - Current session or null
 */
export async function getCurrentUser() {
  return await getServerSession(authOptions);
}

/**
 * Require authentication for a route (throw if not authenticated)
 * @throws Error if user is not authenticated
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error('Unauthorized - Authentication required');
  }

  return session;
}

/**
 * Require specific role for a route (throw if insufficient permission)
 * @param requiredRole - Minimum role required
 * @throws Error if user doesn't have required role
 */
export async function requireRole(requiredRole: Role) {
  const session = await requireAuth();

  if (!(await hasRole(requiredRole))) {
    throw new Error(`Forbidden - ${requiredRole} role required`);
  }

  return session;
}

/**
 * Check if user can manage another user (based on role hierarchy)
 * @param targetUserId - ID of user being managed
 * @returns Promise<boolean> - True if current user can manage target user
 */
export async function canManageUser(targetUserId: string): Promise<boolean> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role) {
    return false;
  }

  // Super admin can manage anyone
  if (session.user.role === 'super_admin') {
    return true;
  }

  // Get target user's details
  const { data: targetUser } = await supabase
    .from('users')
    .select('role, created_by')
    .eq('id', targetUserId)
    .single();

  if (!targetUser) {
    return false;
  }

  // Admin can manage users they created (but not other admins/super admins)
  if (session.user.role === 'admin') {
    if (targetUser.role === 'super_admin' || targetUser.role === 'admin') {
      return false;
    }
    return targetUser.created_by === session.user.id;
  }

  return false;
}

/**
 * Get rate limit information for all features for current user
 * @param userId - User ID to check
 * @returns Promise<Record<Feature, RateLimitResult>> - Rate limits for all features
 */
export async function getAllRateLimits(
  userId: string
): Promise<Record<string, RateLimitResult>> {
  const features: Feature[] = ['quotes', 'ai_assessments', 'system_surveyor', 'estimates'];
  const limits: Record<string, RateLimitResult> = {};

  await Promise.all(
    features.map(async (feature) => {
      limits[feature] = await checkRateLimit(userId, feature);
    })
  );

  return limits;
}
