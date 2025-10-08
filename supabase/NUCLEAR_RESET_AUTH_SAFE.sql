-- =====================================================
-- NUCLEAR AUTH RESET - SAFE VERSION
-- Created: 2025-10-08
-- Purpose: Delete ONLY auth-related tables to start fresh
-- PRESERVES: All business data, estimates, products, etc.
-- =====================================================

-- =====================================================
-- STEP 1: VERIFY WHAT WILL BE DELETED
-- Run this first to see what will be affected
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🔍 TABLES THAT WILL BE DELETED:';
  RAISE NOTICE '================================================';
END $$;

SELECT
  schemaname,
  tablename,
  '❌ WILL BE DELETED' as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles',
    'user_roles',
    'user_subscriptions',
    'subscribers',
    'activity_logs',
    'user_sessions',
    'user_themes',
    'login'
  )
ORDER BY tablename;

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ TABLES THAT WILL BE PRESERVED:';
  RAISE NOTICE '================================================';
END $$;

SELECT
  schemaname,
  tablename,
  '✅ SAFE - Will be kept' as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT IN (
    'profiles',
    'user_roles',
    'user_subscriptions',
    'subscribers',
    'activity_logs',
    'user_sessions',
    'user_themes',
    'login'
  )
ORDER BY tablename;

-- =====================================================
-- STEP 2: BACKUP CHECK
-- Verify you have a backup before proceeding
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  BACKUP CHECKPOINT ⚠️';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'Before proceeding, confirm:';
  RAISE NOTICE '  1. ✅ You have Supabase auto-backups enabled';
  RAISE NOTICE '  2. ✅ You confirmed no production users exist';
  RAISE NOTICE '  3. ✅ You are ready to delete all auth data';
  RAISE NOTICE '';
  RAISE NOTICE 'If ready, proceed to STEP 3 below.';
  RAISE NOTICE '================================================';
END $$;

-- =====================================================
-- STEP 3: DROP AUTH TABLES (CASCADE)
-- *** COMMENT OUT THIS SECTION UNTIL READY ***
-- *** UNCOMMENT WHEN YOU WANT TO EXECUTE ***
-- =====================================================

/*

-- Drop triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_profile_updated ON profiles;
DROP TRIGGER IF EXISTS set_user_subscription_defaults ON user_subscriptions;
DROP TRIGGER IF EXISTS sync_user_subscription_data ON profiles;
DROP TRIGGER IF EXISTS mirror_user_subscriptions_to_subscriptions ON user_subscriptions;
DROP TRIGGER IF EXISTS sync_stripe_subscription ON user_subscriptions;
DROP TRIGGER IF EXISTS queue_document_for_processing ON user_documents;
DROP TRIGGER IF EXISTS propagate_admin_settings_to_subscriptions ON admin_settings;
DROP TRIGGER IF EXISTS set_chat_message_defaults ON chat_messages;

-- Drop functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS handle_updated_at() CASCADE;
DROP FUNCTION IF EXISTS create_user_subscription() CASCADE;
DROP FUNCTION IF EXISTS sync_user_subscription_data() CASCADE;
DROP FUNCTION IF EXISTS mirror_user_subscriptions_to_subscriptions() CASCADE;
DROP FUNCTION IF EXISTS sync_stripe_subscription() CASCADE;
DROP FUNCTION IF EXISTS get_user_role(uuid) CASCADE;
DROP FUNCTION IF EXISTS is_admin(uuid) CASCADE;
DROP FUNCTION IF EXISTS is_super_admin(uuid) CASCADE;
DROP FUNCTION IF EXISTS log_activity(uuid, text, jsonb, boolean, text) CASCADE;
DROP FUNCTION IF EXISTS has_role(uuid, text) CASCADE;
DROP FUNCTION IF EXISTS get_user_subscription_status(uuid) CASCADE;

-- Drop tables (CASCADE will handle foreign keys)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS user_themes CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS user_subscriptions CASCADE;
DROP TABLE IF EXISTS subscribers CASCADE;
DROP TABLE IF EXISTS login CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Verification
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅✅✅ AUTH TABLES DELETED ✅✅✅';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'Next step: Run AUTH_SCHEMA_FRESH_2025.sql';
  RAISE NOTICE '================================================';
END $$;

*/

-- =====================================================
-- STEP 4: VERIFICATION (Run after STEP 3)
-- Check that auth tables are gone
-- =====================================================

/*

SELECT
  schemaname,
  tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles',
    'user_roles',
    'user_subscriptions',
    'subscribers',
    'activity_logs',
    'user_sessions',
    'user_themes',
    'login'
  );

-- If this returns 0 rows, you're ready for fresh schema!

*/

-- =====================================================
-- USAGE INSTRUCTIONS
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '📋 HOW TO USE THIS SCRIPT:';
  RAISE NOTICE '================================================';
  RAISE NOTICE '1. Run STEP 1 & 2 first (they are safe)';
  RAISE NOTICE '2. Review what will be deleted';
  RAISE NOTICE '3. Confirm backup exists';
  RAISE NOTICE '4. UNCOMMENT STEP 3 section';
  RAISE NOTICE '5. Run entire script again';
  RAISE NOTICE '6. Run AUTH_SCHEMA_FRESH_2025.sql';
  RAISE NOTICE '7. Create super admin account';
  RAISE NOTICE '8. Test user deletion!';
  RAISE NOTICE '================================================';
END $$;
