/**
 * Activity Logger Utility
 * Logs security events and user actions to activity_logs table
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

// Use service role client to bypass RLS for logging
const supabaseService = createClient(supabaseUrl, supabaseServiceKey)

export interface ActivityLogEntry {
  user_id?: string
  action: string
  resource_type?: string
  resource_id?: string
  ip_address?: string
  user_agent?: string
  details?: Record<string, any>
  success: boolean
  error_message?: string
}

/**
 * Log an activity event
 */
export async function logActivity(entry: ActivityLogEntry) {
  try {
    const { error } = await supabaseService
      .from('activity_logs')
      .insert({
        user_id: entry.user_id || null,
        action: entry.action,
        resource_type: entry.resource_type || null,
        resource_id: entry.resource_id || null,
        ip_address: entry.ip_address || null,
        user_agent: entry.user_agent || null,
        details: entry.details || null,
        success: entry.success,
        error_message: entry.error_message || null
        // created_at is auto-set by DEFAULT now()
      })

    if (error) {
      console.error('Failed to log activity:', error)
    }
  } catch (err) {
    console.error('Activity logging error:', err)
  }
}

/**
 * Log a login attempt
 */
export async function logLoginAttempt(
  email: string,
  success: boolean,
  userId?: string,
  errorMessage?: string,
  request?: Request
) {
  const ipAddress = request?.headers.get('x-forwarded-for') ||
                    request?.headers.get('x-real-ip') ||
                    'unknown'
  const userAgent = request?.headers.get('user-agent') || 'unknown'

  await logActivity({
    user_id: userId,
    action: 'login_attempt',
    resource_type: 'auth',
    details: { email },
    ip_address: ipAddress,
    user_agent: userAgent,
    success,
    error_message: errorMessage
  })
}

/**
 * Log a password reset request
 */
export async function logPasswordReset(
  email: string,
  success: boolean,
  request?: Request
) {
  const ipAddress = request?.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request?.headers.get('user-agent') || 'unknown'

  await logActivity({
    action: 'password_reset_request',
    resource_type: 'auth',
    details: { email },
    ip_address: ipAddress,
    user_agent: userAgent,
    success
  })
}

/**
 * Log a role change
 */
export async function logRoleChange(
  userId: string,
  oldRole: string,
  newRole: string,
  changedBy: string
) {
  await logActivity({
    user_id: userId,
    action: 'role_change',
    resource_type: 'user_roles',
    resource_id: userId,
    details: { oldRole, newRole, changedBy },
    success: true
  })
}

/**
 * Log account creation
 */
export async function logAccountCreation(
  userId: string,
  email: string,
  role: string,
  createdBy?: string
) {
  await logActivity({
    user_id: userId,
    action: 'account_created',
    resource_type: 'auth',
    resource_id: userId,
    details: { email, role, createdBy },
    success: true
  })
}

/**
 * Log permission change
 */
export async function logPermissionChange(
  userId: string,
  module: string,
  granted: boolean,
  changedBy: string
) {
  await logActivity({
    user_id: userId,
    action: 'permission_change',
    resource_type: 'module_permissions',
    resource_id: userId,
    details: { module, granted, changedBy },
    success: true
  })
}
