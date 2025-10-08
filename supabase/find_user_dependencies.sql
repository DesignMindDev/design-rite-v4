-- Find ALL dependencies for your user account
-- Run this in Supabase SQL Editor to see what's blocking deletion

-- Step 1: Find YOUR user ID
SELECT id, email, created_at, raw_user_meta_data
FROM auth.users
WHERE email = 'plisk@design-rite.com' OR email = 'dan@design-rite.com';

-- Step 2: Check ALL tables that might reference this user
-- Replace YOUR_USER_ID with the ID from Step 1

DO $$
DECLARE
    user_uuid UUID := 'YOUR_USER_ID_HERE'; -- Replace with actual UUID
    table_record RECORD;
    sql_query TEXT;
    result_count INTEGER;
BEGIN
    -- Loop through all tables that have a 'user_id' column
    FOR table_record IN
        SELECT table_schema, table_name, column_name
        FROM information_schema.columns
        WHERE column_name IN ('user_id', 'id', 'created_by', 'owner_id')
          AND table_schema IN ('public', 'auth')
    LOOP
        sql_query := format('SELECT COUNT(*) FROM %I.%I WHERE %I = %L',
            table_record.table_schema,
            table_record.table_name,
            table_record.column_name,
            user_uuid
        );

        EXECUTE sql_query INTO result_count;

        IF result_count > 0 THEN
            RAISE NOTICE 'Table %.% has % records for user_id %',
                table_record.table_schema,
                table_record.table_name,
                result_count,
                user_uuid;
        END IF;
    END LOOP;
END $$;

-- Step 3: Manual check of common auth tables
-- Replace YOUR_USER_ID with actual UUID
SELECT 'user_roles' as table_name, COUNT(*) as count FROM user_roles WHERE user_id = 'YOUR_USER_ID_HERE'
UNION ALL
SELECT 'activity_logs', COUNT(*) FROM activity_logs WHERE user_id = 'YOUR_USER_ID_HERE'
UNION ALL
SELECT 'user_sessions', COUNT(*) FROM user_sessions WHERE user_id = 'YOUR_USER_ID_HERE'
UNION ALL
SELECT 'usage_tracking', COUNT(*) FROM usage_tracking WHERE user_id = 'YOUR_USER_ID_HERE'
UNION ALL
SELECT 'permissions', COUNT(*) FROM permissions WHERE user_id = 'YOUR_USER_ID_HERE';
