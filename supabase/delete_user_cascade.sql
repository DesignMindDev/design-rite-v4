-- Complete CASCADE deletion for your user account
-- This deletes from ALL related tables in the correct order
-- Run this in Supabase SQL Editor

-- =====================================================
-- STEP 1: Find your user ID first
-- =====================================================
SELECT id, email, created_at
FROM auth.users
WHERE email IN ('plisk@design-rite.com', 'dan@design-rite.com');

-- Copy the ID from above and replace YOUR_USER_ID_HERE below

-- =====================================================
-- STEP 2: Delete from all dependent tables (in order)
-- =====================================================

DO $$
DECLARE
    target_user_id UUID := 'YOUR_USER_ID_HERE'; -- Replace with actual UUID
BEGIN
    -- Delete from usage_tracking (no foreign keys)
    DELETE FROM usage_tracking WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted usage_tracking records';

    -- Delete from permissions (no foreign keys)
    DELETE FROM permissions WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted permissions records';

    -- Delete from activity_logs (no foreign keys)
    DELETE FROM activity_logs WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted activity_logs records';

    -- Delete from user_sessions (no foreign keys)
    DELETE FROM user_sessions WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted user_sessions records';

    -- Delete from user_roles (foreign key to auth.users)
    DELETE FROM user_roles WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted user_roles records';

    -- Delete from any other public schema tables with user_id
    -- Add more DELETE statements here if you find other tables

    -- Finally delete from auth.users
    DELETE FROM auth.users WHERE id = target_user_id;
    RAISE NOTICE 'Deleted user from auth.users';

    RAISE NOTICE '✅ User successfully deleted!';
END $$;

-- =====================================================
-- STEP 3: Verify deletion
-- =====================================================
SELECT email FROM auth.users
WHERE email IN ('plisk@design-rite.com', 'dan@design-rite.com');
-- Should return 0 rows
