-- Check for lingering NextAuth tables that might block deletion
-- NextAuth uses these table names by default

-- List all tables in public schema
SELECT
    table_name,
    'EXISTS' as status
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN (
        'accounts',
        'sessions',
        'users',
        'verification_tokens',
        'verification_requests'
    )
ORDER BY table_name;

-- Check for any foreign keys from NextAuth tables to auth.users
SELECT
    tc.table_schema,
    tc.table_name,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
    AND tc.table_name IN ('accounts', 'sessions', 'users', 'verification_tokens')
    AND (ccu.table_name = 'users' AND ccu.table_schema = 'auth');

-- If NextAuth tables exist, check if plisk has data in them
SELECT 'Checking NextAuth accounts table' as check_name;
SELECT * FROM accounts WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'plisk@design-rite.com'
) LIMIT 5;

SELECT 'Checking NextAuth sessions table' as check_name;
SELECT * FROM sessions WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'plisk@design-rite.com'
) LIMIT 5;

-- If these exist, we need to delete from NextAuth tables too!
