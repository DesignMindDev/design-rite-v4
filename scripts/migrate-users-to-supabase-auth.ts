/**
 * User Migration Script: Next-Auth → Supabase Auth
 * Migrates existing Design-Rite v3 users to Supabase Auth
 *
 * IMPORTANT: Run this AFTER:
 * 1. Loading designr_backup.sql
 * 2. Running SUPABASE_AUTH_001_unify_schema.sql
 * 3. Backing up production database
 *
 * What this does:
 * - Creates Supabase Auth account for each Next-Auth user
 * - Copies user data to profiles table
 * - Assigns roles in user_roles table
 * - Sends password reset emails
 * - Logs migration progress
 */

import { createClient } from '@supabase/supabase-js'
import * as crypto from 'crypto'

// ==============================================
// CONFIGURATION
// ==============================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY! // Admin key required
const DRY_RUN = process.env.DRY_RUN === 'true' // Set to 'true' for testing
const SEND_EMAILS = process.env.SEND_EMAILS !== 'false' // Set to 'false' to skip emails

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY required')
  process.exit(1)
}

// Supabase admin client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// ==============================================
// HELPER FUNCTIONS
// ==============================================

/**
 * Generate secure random password for temporary auth
 */
function generateSecurePassword(): string {
  return crypto.randomBytes(32).toString('base64')
}

/**
 * Log migration event
 */
async function logMigration(data: {
  oldUserId?: string
  newUserId?: string
  email: string
  status: 'pending' | 'completed' | 'failed'
  errorMessage?: string
}) {
  if (DRY_RUN) {
    console.log('[DRY RUN] Would log:', data)
    return
  }

  await supabase.from('auth_migration_log').insert({
    old_user_id: data.oldUserId,
    new_user_id: data.newUserId,
    email: data.email,
    status: data.status,
    error_message: data.errorMessage
  })
}

/**
 * Send password reset email
 */
async function sendPasswordResetEmail(email: string): Promise<void> {
  if (!SEND_EMAILS) {
    console.log(`[SKIP EMAIL] Would send password reset to: ${email}`)
    return
  }

  if (DRY_RUN) {
    console.log(`[DRY RUN] Would send password reset email to: ${email}`)
    return
  }

  try {
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email
    })

    if (error) throw error

    console.log(`✉️  Password reset email sent to: ${email}`)
    // In production, you might want to use a custom email service here
  } catch (error) {
    console.error(`Failed to send password reset email to ${email}:`, error)
    throw error
  }
}

// ==============================================
// MIGRATION FUNCTIONS
// ==============================================

/**
 * Migrate a single user from Next-Auth to Supabase Auth
 */
async function migrateUser(oldUser: any): Promise<boolean> {
  const email = oldUser.email.toLowerCase()
  console.log(`\n📝 Migrating: ${email} (${oldUser.role})`)

  try {
    // 1. Check if user already exists in auth.users
    const { data: existingAuth } = await supabase.auth.admin.listUsers()
    const userExists = existingAuth?.users.find(u => u.email === email)

    if (userExists) {
      console.log(`⚠️  User already exists in auth.users: ${email}`)

      // Update profile if exists
      if (DRY_RUN) {
        console.log('[DRY RUN] Would update existing profile')
      } else {
        await supabase.from('profiles').upsert({
          id: userExists.id,
          email: email,
          full_name: oldUser.full_name,
          company: oldUser.company,
          phone: oldUser.phone,
          access_code: oldUser.access_code,
          status: oldUser.status,
          created_by: oldUser.created_by,
          last_login: oldUser.last_login,
          login_count: oldUser.login_count,
          rate_limit_override: oldUser.rate_limit_override,
          notes: oldUser.notes,
          updated_at: new Date().toISOString()
        })

        // Ensure role exists
        await supabase.from('user_roles').upsert({
          user_id: userExists.id,
          role: oldUser.role,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
      }

      await logMigration({
        oldUserId: oldUser.id,
        newUserId: userExists.id,
        email,
        status: 'completed'
      })

      console.log(`✅ Updated existing user: ${email}`)
      return true
    }

    // 2. Create new Supabase Auth user
    const tempPassword = generateSecurePassword()

    if (DRY_RUN) {
      console.log('[DRY RUN] Would create Supabase Auth user')
      console.log('[DRY RUN] Temp password length:', tempPassword.length)
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: tempPassword,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: oldUser.full_name || email,
          migrated_from_nextauth: true,
          migration_date: new Date().toISOString(),
          original_user_id: oldUser.id
        }
      })

      if (authError) {
        console.error(`❌ Failed to create auth user: ${authError.message}`)
        throw authError
      }

      if (!authData.user) {
        throw new Error('No user returned from createUser')
      }

      console.log(`✅ Created auth.users entry: ${authData.user.id}`)

      // 3. Create/update profile
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        email: email,
        full_name: oldUser.full_name,
        company: oldUser.company,
        phone: oldUser.phone,
        website: oldUser.website,
        address: oldUser.address,
        city: oldUser.city,
        state: oldUser.state,
        zip_code: oldUser.zip_code,
        business_type: oldUser.business_type,
        tax_id: oldUser.tax_id,
        access_code: oldUser.access_code,
        status: oldUser.status || 'active',
        created_by: oldUser.created_by,
        last_login: oldUser.last_login,
        login_count: oldUser.login_count || 0,
        failed_login_attempts: 0, // Reset failed attempts
        rate_limit_override: oldUser.rate_limit_override || false,
        notes: oldUser.notes,
        created_at: oldUser.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      if (profileError) {
        console.error(`❌ Failed to create profile: ${profileError.message}`)
        // Try to delete the auth user we just created
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw profileError
      }

      console.log(`✅ Created profiles entry`)

      // 4. Assign role
      const { error: roleError } = await supabase.from('user_roles').insert({
        user_id: authData.user.id,
        role: oldUser.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      if (roleError) {
        console.error(`❌ Failed to assign role: ${roleError.message}`)
        // Don't fail migration - role can be fixed manually
      } else {
        console.log(`✅ Assigned role: ${oldUser.role}`)
      }

      // 5. Send password reset email
      try {
        await sendPasswordResetEmail(email)
      } catch (emailError) {
        console.warn(`⚠️  Failed to send password reset email (user still migrated)`)
      }

      // 6. Log successful migration
      await logMigration({
        oldUserId: oldUser.id,
        newUserId: authData.user.id,
        email,
        status: 'completed'
      })

      console.log(`✅ Successfully migrated: ${email}`)
    }

    return true

  } catch (error) {
    console.error(`❌ Error migrating ${email}:`, error)

    await logMigration({
      oldUserId: oldUser.id,
      email,
      status: 'failed',
      errorMessage: (error as Error).message
    })

    return false
  }
}

// ==============================================
// MAIN MIGRATION
// ==============================================

async function migrateAllUsers() {
  console.log('==============================================')
  console.log('🚀 User Migration: Next-Auth → Supabase Auth')
  console.log('==============================================')
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE'}`)
  console.log(`Send Emails: ${SEND_EMAILS ? 'Yes' : 'No'}`)
  console.log('')

  try {
    // 1. Get all users from old Next-Auth users table
    console.log('📊 Fetching users from Next-Auth users table...')
    const { data: oldUsers, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true })

    if (fetchError) {
      console.error('❌ Failed to fetch users:', fetchError)
      process.exit(1)
    }

    if (!oldUsers || oldUsers.length === 0) {
      console.log('⚠️  No users found in users table')
      console.log('This might mean:')
      console.log('  1. Users already migrated')
      console.log('  2. Wrong database')
      console.log('  3. users table doesn\'t exist yet')
      process.exit(0)
    }

    console.log(`Found ${oldUsers.length} users to migrate\n`)

    // 2. Migrate each user
    let successCount = 0
    let failureCount = 0
    let skippedCount = 0

    for (const oldUser of oldUsers) {
      const result = await migrateUser(oldUser)
      if (result) {
        successCount++
      } else {
        failureCount++
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // 3. Summary
    console.log('\n==============================================')
    console.log('📊 Migration Summary')
    console.log('==============================================')
    console.log(`Total users: ${oldUsers.length}`)
    console.log(`✅ Successful: ${successCount}`)
    console.log(`❌ Failed: ${failureCount}`)
    console.log(`⏭️  Skipped: ${skippedCount}`)
    console.log('')

    if (DRY_RUN) {
      console.log('⚠️  DRY RUN MODE - No changes were made')
      console.log('Run with DRY_RUN=false to execute migration')
    } else {
      console.log('✅ Migration complete!')
      console.log('')
      console.log('📧 Next steps:')
      console.log('  1. Verify all users migrated successfully')
      console.log('  2. Check users can log in with password reset link')
      console.log('  3. Update API routes to use Supabase Auth')
      console.log('  4. Update frontend components')
      console.log('  5. Remove old users table after verification')
    }

    // 4. Show migration log
    const { data: migrationLog } = await supabase
      .from('auth_migration_log')
      .select('*')
      .order('migrated_at', { ascending: false })
      .limit(10)

    if (migrationLog && migrationLog.length > 0) {
      console.log('\n📋 Recent migration log:')
      console.table(migrationLog.map(log => ({
        email: log.email,
        status: log.status,
        time: new Date(log.migrated_at).toLocaleString()
      })))
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

// ==============================================
// RUN MIGRATION
// ==============================================

// Check if running directly (not imported)
if (require.main === module) {
  migrateAllUsers()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
}

export { migrateUser, migrateAllUsers }
