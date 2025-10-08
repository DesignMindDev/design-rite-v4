-- Force delete user bypassing RLS and foreign key constraints
-- This must be run as service_role (Supabase SQL Editor has this by default)

-- User to delete: plisk@design-rite.com
-- UUID: b707a8c1-a298-485f-aed3-aac56bbc9880

-- Step 1: Temporarily disable RLS on auth.users
-- (Supabase SQL Editor runs as service_role which bypasses RLS anyway, but being explicit)
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- Step 2: Delete from dependent tables first (foreign key constraints)
-- Delete from user_roles (this was blocking us earlier)
DELETE FROM public.user_roles
WHERE user_id = 'b707a8c1-a298-485f-aed3-aac56bbc9880';

-- Delete from user_sessions (if exists)
DELETE FROM public.user_sessions
WHERE user_id = 'b707a8c1-a298-485f-aed3-aac56bbc9880';

-- Delete from activity_logs (if exists)
DELETE FROM public.activity_logs
WHERE user_id = 'b707a8c1-a298-485f-aed3-aac56bbc9880';

-- Delete from usage_tracking (if exists)
DELETE FROM public.usage_tracking
WHERE user_id = 'b707a8c1-a298-485f-aed3-aac56bbc9880';

-- Step 3: Delete from auth.sessions
DELETE FROM auth.sessions
WHERE user_id = 'b707a8c1-a298-485f-aed3-aac56bbc9880';

-- Step 4: Delete from auth.identities (even though this user may not have one)
DELETE FROM auth.identities
WHERE user_id = 'b707a8c1-a298-485f-aed3-aac56bbc9880';

-- Step 5: Finally delete from auth.users
DELETE FROM auth.users
WHERE id = 'b707a8c1-a298-485f-aed3-aac56bbc9880'
RETURNING id, email, deleted_at;

-- Step 6: Re-enable RLS on auth.users
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Verification: Check if user is gone
SELECT
    CASE
        WHEN (SELECT COUNT(*) FROM auth.users WHERE email = 'plisk@design-rite.com') = 0
        THEN '✅ User successfully deleted!'
        ELSE '❌ User still exists - check error messages above'
    END as deletion_status;

-- Show any remaining references (should be empty)
SELECT 'Checking for remaining references...' as check_status;

SELECT 'auth.users' as table_name, COUNT(*) as remaining_records
FROM auth.users
WHERE id = 'b707a8c1-a298-485f-aed3-aac56bbc9880'
UNION ALL
SELECT 'auth.identities', COUNT(*)
FROM auth.identities
WHERE user_id = 'b707a8c1-a298-485f-aed3-aac56bbc9880'
UNION ALL
SELECT 'auth.sessions', COUNT(*)
FROM auth.sessions
WHERE user_id = 'b707a8c1-a298-485f-aed3-aac56bbc9880'
UNION ALL
SELECT 'user_roles', COUNT(*)
FROM public.user_roles
WHERE user_id = 'b707a8c1-a298-485f-aed3-aac56bbc9880';
