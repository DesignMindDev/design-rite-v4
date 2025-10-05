/**
 * Business Access Control
 * Enforces @design-rite.com domain restriction with super admin override capability
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export interface BusinessAccessCheck {
  hasAccess: boolean;
  reason?: string;
  role?: string;
  domainOverride?: boolean;
}

/**
 * Check if user has access to business admin portal
 *
 * Rules:
 * 1. Super admins always have access
 * 2. Users with domain_override = true have access
 * 3. Users with @design-rite.com email have access
 * 4. All others are denied
 */
export async function checkBusinessAccess(userId?: string): Promise<BusinessAccessCheck> {
  const supabase = createClientComponentClient();

  if (!userId) {
    return { hasAccess: false, reason: 'Not authenticated' };
  }

  try {
    // Get user email
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { hasAccess: false, reason: 'User not found' };
    }

    const email = user.email || '';

    // Get user role and domain override status
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role, domain_override')
      .eq('user_id', userId)
      .single();

    if (roleError) {
      console.error('Error fetching user role:', roleError);
      return { hasAccess: false, reason: 'Could not verify access' };
    }

    const role = roleData?.role || 'user';
    const domainOverride = roleData?.domain_override || false;

    // Rule 1: Super admins always have access
    if (role === 'super_admin') {
      return { hasAccess: true, role, domainOverride };
    }

    // Rule 2: Users with domain override have access
    if (domainOverride === true) {
      return { hasAccess: true, role, domainOverride };
    }

    // Rule 3: Check if email is @design-rite.com
    if (email.endsWith('@design-rite.com')) {
      return { hasAccess: true, role, domainOverride };
    }

    // Rule 4: Deny access
    return {
      hasAccess: false,
      reason: 'Business admin access requires @design-rite.com email or domain override',
      role,
      domainOverride
    };

  } catch (error) {
    console.error('Error in checkBusinessAccess:', error);
    return { hasAccess: false, reason: 'Access check failed' };
  }
}

/**
 * Get user's module permissions
 */
export async function getModulePermissions(userId: string) {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from('module_permissions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching module permissions:', error);
    return null;
  }

  return data;
}

/**
 * Check if user has permission for specific module
 */
export async function hasModulePermission(userId: string, module: string): Promise<boolean> {
  const permissions = await getModulePermissions(userId);
  if (!permissions) return false;

  return permissions[module] === true;
}
