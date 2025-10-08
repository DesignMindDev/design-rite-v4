-- Diagnose what's blocking ALL user deletions systemwide

-- 1. Check for triggers on auth.users (these can prevent deletions)
SELECT
    'TRIGGERS ON auth.users' as check_type,
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
    AND event_object_table = 'users'
    AND event_manipulation = 'DELETE';

-- 2. Check for BEFORE DELETE triggers specifically
SELECT
    'BEFORE DELETE TRIGGERS' as check_type,
    tgname as trigger_name,
    proname as function_name,
    prosrc as function_code
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
LEFT JOIN pg_proc p ON t.tgfoid = p.oid
WHERE n.nspname = 'auth'
    AND c.relname = 'users'
    AND tgtype & 2 = 2  -- BEFORE trigger
    AND tgtype & 8 = 8; -- DELETE trigger

-- 3. Check RLS policies on auth.users
SELECT
    'RLS POLICIES' as check_type,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'auth'
    AND tablename = 'users';

-- 4. Try to identify which table has a foreign key blocking us
-- by checking all public schema tables
DO $$
DECLARE
    r RECORD;
    v_count INTEGER;
    user_uuid UUID := (SELECT id FROM auth.users WHERE email = 'plisk@design-rite.com');
BEGIN
    RAISE NOTICE 'Checking all tables for references to user: %', user_uuid;

    FOR r IN
        SELECT table_schema, table_name, column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
            AND column_name LIKE '%user%'
            AND column_name NOT LIKE '%username%'
    LOOP
        BEGIN
            EXECUTE format('SELECT COUNT(*) FROM %I.%I WHERE %I = $1',
                r.table_schema, r.table_name, r.column_name)
            INTO v_count
            USING user_uuid;

            IF v_count > 0 THEN
                RAISE NOTICE 'Found % records in %.% (column: %)',
                    v_count, r.table_schema, r.table_name, r.column_name;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            -- Skip tables where query fails
            NULL;
        END;
    END LOOP;
END $$;
