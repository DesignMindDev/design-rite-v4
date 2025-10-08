-- Check current state of plisk account after all our deletion attempts

-- Check auth.users
SELECT 'auth.users' as table_name, id, email, created_at
FROM auth.users
WHERE email = 'plisk@design-rite.com';

-- Check auth.identities (might have been deleted!)
SELECT 'auth.identities' as table_name, id, user_id, provider
FROM auth.identities
WHERE user_id = 'b707a8c1-a298-485f-aed3-aac56bbc9880';

-- Check auth.sessions
SELECT 'auth.sessions' as table_name, id, user_id
FROM auth.sessions
WHERE user_id = 'b707a8c1-a298-485f-aed3-aac56bbc9880';

-- Summary
SELECT
    CASE
        WHEN (SELECT COUNT(*) FROM auth.users WHERE email = 'plisk@design-rite.com') = 0
        THEN '✅ User deleted from auth.users'
        WHEN (SELECT COUNT(*) FROM auth.identities WHERE user_id = 'b707a8c1-a298-485f-aed3-aac56bbc9880') = 0
        THEN '⚠️ User exists but has NO identity (broken state - Auth API can''t see it)'
        ELSE '❌ User still fully exists'
    END as current_state;
