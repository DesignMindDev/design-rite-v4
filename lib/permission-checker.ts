import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export type Permission =
  | 'can_manage_team'
  | 'can_manage_blog'
  | 'can_manage_videos'
  | 'can_manage_settings'
  | 'can_create_users'
  | 'can_edit_users'
  | 'can_delete_users'
  | 'can_assign_permissions'
  | 'can_view_activity'
  | 'can_export_data'
  | 'can_view_analytics'
  | 'can_access_admin_panel'
  | 'can_manage_integrations'
  | 'can_view_revenue'
  | 'can_view_quick_stats'
  | 'can_view_user_list'
  | 'can_view_recent_activity';

export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Check if a user has a specific permission
 */
export async function checkPermission(
  userId: string,
  permission: Permission
): Promise<PermissionCheckResult> {
  try {
    // Get user's role
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('role, status')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return { allowed: false, reason: 'User not found' };
    }

    // Check if user is active
    if (user.status !== 'active') {
      return { allowed: false, reason: 'User account is not active' };
    }

    // Super admins always have all permissions
    if (user.role === 'super_admin') {
      return { allowed: true };
    }

    // Get user's specific permissions
    const { data: permissions, error: permError } = await supabase
      .from('admin_permissions')
      .select(permission)
      .eq('user_id', userId)
      .single();

    if (permError) {
      // If no permissions record exists, deny access
      return { allowed: false, reason: 'No permissions assigned' };
    }

    const hasPermission = permissions?.[permission] === true;

    return {
      allowed: hasPermission,
      reason: hasPermission ? undefined : 'Permission denied',
    };
  } catch (error) {
    console.error('Error checking permission:', error);
    return { allowed: false, reason: 'Error checking permission' };
  }
}

/**
 * Log admin access attempt
 */
export async function logAdminAccess(
  userId: string,
  path: string,
  permission: Permission | null,
  allowed: boolean,
  ipAddress?: string,
  userAgent?: string,
  method: string = 'GET',
  details?: any
): Promise<void> {
  try {
    await supabase.from('admin_access_logs').insert({
      user_id: userId,
      path_accessed: path,
      permission_checked: permission,
      access_allowed: allowed,
      ip_address: ipAddress,
      user_agent: userAgent,
      method,
      details,
    });
  } catch (error) {
    console.error('Error logging admin access:', error);
    // Don't throw error - logging failure shouldn't break the app
  }
}

/**
 * Check multiple permissions at once
 */
export async function checkPermissions(
  userId: string,
  permissions: Permission[]
): Promise<Record<Permission, boolean>> {
  const results: Record<string, boolean> = {};

  for (const permission of permissions) {
    const result = await checkPermission(userId, permission);
    results[permission] = result.allowed;
  }

  return results as Record<Permission, boolean>;
}

/**
 * Require a specific permission - throws error if not allowed
 */
export async function requirePermission(
  userId: string,
  permission: Permission,
  path?: string
): Promise<void> {
  const result = await checkPermission(userId, permission);

  if (path) {
    await logAdminAccess(userId, path, permission, result.allowed);
  }

  if (!result.allowed) {
    throw new Error(result.reason || 'Permission denied');
  }
}

/**
 * Get all permissions for a user
 */
export async function getUserPermissions(userId: string): Promise<Record<Permission, boolean> | null> {
  try {
    // Get user's role
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (!user) {
      return null;
    }

    // Super admins have all permissions
    if (user.role === 'super_admin') {
      return {
        can_manage_team: true,
        can_manage_blog: true,
        can_manage_videos: true,
        can_manage_settings: true,
        can_create_users: true,
        can_edit_users: true,
        can_delete_users: true,
        can_assign_permissions: true,
        can_view_activity: true,
        can_export_data: true,
        can_view_analytics: true,
        can_access_admin_panel: true,
        can_manage_integrations: true,
        can_view_revenue: true,
        can_view_quick_stats: true,
        can_view_user_list: true,
        can_view_recent_activity: true,
      };
    }

    // Get specific permissions
    const { data: permissions } = await supabase
      .from('admin_permissions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!permissions) {
      // Return all false if no permissions exist
      return {
        can_manage_team: false,
        can_manage_blog: false,
        can_manage_videos: false,
        can_manage_settings: false,
        can_create_users: false,
        can_edit_users: false,
        can_delete_users: false,
        can_assign_permissions: false,
        can_view_activity: false,
        can_export_data: false,
        can_view_analytics: false,
        can_access_admin_panel: false,
        can_manage_integrations: false,
        can_view_revenue: false,
        can_view_quick_stats: false,
        can_view_user_list: false,
        can_view_recent_activity: false,
      };
    }

    return {
      can_manage_team: permissions.can_manage_team,
      can_manage_blog: permissions.can_manage_blog,
      can_manage_videos: permissions.can_manage_videos,
      can_manage_settings: permissions.can_manage_settings,
      can_create_users: permissions.can_create_users,
      can_edit_users: permissions.can_edit_users,
      can_delete_users: permissions.can_delete_users,
      can_assign_permissions: permissions.can_assign_permissions,
      can_view_activity: permissions.can_view_activity,
      can_export_data: permissions.can_export_data,
      can_view_analytics: permissions.can_view_analytics,
      can_access_admin_panel: permissions.can_access_admin_panel,
      can_manage_integrations: permissions.can_manage_integrations,
      can_view_revenue: permissions.can_view_revenue ?? false,
      can_view_quick_stats: permissions.can_view_quick_stats ?? true,
      can_view_user_list: permissions.can_view_user_list ?? true,
      can_view_recent_activity: permissions.can_view_recent_activity ?? true,
    };
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return null;
  }
}
