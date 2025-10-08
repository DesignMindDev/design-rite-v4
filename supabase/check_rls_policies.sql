-- Check if RLS policies are blocking deletion
-- RLS can prevent deletes even with correct permissions

-- Check RLS status on auth tables
SELECT
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'auth'
    AND tablename IN ('users', 'identities', 'sessions', 'refresh_tokens')
ORDER BY tablename;

-- Disable RLS temporarily to delete (requires superuser)
-- WARNING: Only do this in staging/dev, never in production!

ALTER TABLE auth.identities DISABLE ROW LEVEL SECURITY;
ALTER TABLE auth.sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE auth.refresh_tokens DISABLE ROW LEVEL SECURITY;

-- Now try the deletion again
DELETE FROM auth.identities WHERE id = '25737536-442b-4624-92b6-0edc8480266e';
DELETE FROM auth.sessions WHERE user_id = 'b707a8c1-a298-485f-aed3-aac56bbc9880';
DELETE FROM auth.refresh_tokens WHERE user_id = 'b707a8c1-a298-485f-aed3-aac56bbc9880';
DELETE FROM auth.users WHERE id = 'b707a8c1-a298-485f-aed3-aac56bbc9880';

-- Re-enable RLS
ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

-- Verify
SELECT
    CASE
        WHEN EXISTS (SELECT 1 FROM auth.users WHERE email = 'plisk@design-rite.com')
        THEN '❌ Still exists after RLS bypass'
        ELSE '✅ Deleted successfully!'
    END as result;
