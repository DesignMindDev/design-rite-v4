-- Find ALL foreign keys that reference auth.users
-- This shows what's blocking deletion
-- Run this in Supabase SQL Editor

-- Find all foreign key constraints pointing to auth.users
SELECT
    tc.table_schema,
    tc.table_name,
    kcu.column_name,
    rc.update_rule,
    rc.delete_rule,
    'DELETE FROM ' || tc.table_schema || '.' || tc.table_name ||
    ' WHERE ' || kcu.column_name || ' = (SELECT id FROM auth.users WHERE email = ''plisk@design-rite.com'');' as delete_command
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.referential_constraints rc
    ON tc.constraint_name = rc.constraint_name
JOIN information_schema.constraint_column_usage ccu
    ON rc.unique_constraint_name = ccu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND ccu.table_name = 'users'
    AND ccu.table_schema = 'auth'
ORDER BY tc.table_schema, tc.table_name;
