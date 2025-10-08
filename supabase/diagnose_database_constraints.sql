-- Comprehensive database constraint analysis
-- Find out what's blocking user deletion with generic "Database error"

-- 1. Check for ALL foreign keys pointing TO auth.users
SELECT
    'FOREIGN KEYS TO auth.users' as constraint_type,
    tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule AS on_delete_action
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND ccu.table_schema = 'auth'
    AND ccu.table_name = 'users'
ORDER BY tc.table_schema, tc.table_name;

-- 2. Check for DELETE triggers on auth.users
SELECT
    'DELETE TRIGGERS' as constraint_type,
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
    AND event_object_table = 'users'
    AND event_manipulation = 'DELETE'
ORDER BY action_timing, trigger_name;

-- 3. Check RLS policies on auth.users
SELECT
    'RLS POLICIES' as constraint_type,
    policyname,
    permissive,
    roles,
    cmd,
    qual AS policy_condition
FROM pg_policies
WHERE schemaname = 'auth'
    AND tablename = 'users'
ORDER BY cmd, policyname;

-- 4. Check if RLS is enabled on auth.users
SELECT
    'RLS STATUS' as constraint_type,
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'auth'
    AND tablename = 'users';

-- 5. List all tables in public schema (to see what might reference users)
SELECT
    'PUBLIC SCHEMA TABLES' as info_type,
    table_name
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 6. Check current user count (to confirm users exist)
SELECT
    'CURRENT USER COUNT' as info_type,
    COUNT(*) as total_users,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users
FROM auth.users;

-- 7. Show actual users (if any)
SELECT
    'EXISTING USERS' as info_type,
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users
ORDER BY created_at DESC;
