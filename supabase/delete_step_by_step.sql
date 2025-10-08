-- Delete step-by-step with detailed error reporting
-- This will show EXACTLY where it fails

-- STEP 1: Delete identity
DELETE FROM auth.identities
WHERE id = '25737536-442b-4624-92b6-0edc8480266e';

SELECT 'Step 1: Identity deleted' as status;

-- STEP 2: Delete sessions
DELETE FROM auth.sessions
WHERE user_id = 'b707a8c1-a298-485f-aed3-aac56bbc9880';

SELECT 'Step 2: Sessions deleted' as status;

-- STEP 3: Delete refresh tokens
DELETE FROM auth.refresh_tokens
WHERE user_id = 'b707a8c1-a298-485f-aed3-aac56bbc9880';

SELECT 'Step 3: Refresh tokens deleted' as status;

-- STEP 4: Try to delete the user
DELETE FROM auth.users
WHERE id = 'b707a8c1-a298-485f-aed3-aac56bbc9880';

SELECT 'Step 4: User deleted!' as status;

-- Final verification
SELECT
    CASE
        WHEN EXISTS (SELECT 1 FROM auth.users WHERE email = 'plisk@design-rite.com')
        THEN '❌ FAILED - User still exists'
        ELSE '✅ SUCCESS - User deleted!'
    END as final_result;
