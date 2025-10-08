-- Check for triggers on auth.users that might block deletion

SELECT
    trigger_name,
    event_manipulation,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
    AND event_object_table = 'users'
ORDER BY trigger_name;

-- Also check for any constraints we missed
SELECT
    con.conname AS constraint_name,
    con.contype AS constraint_type,
    CASE con.contype
        WHEN 'f' THEN 'FOREIGN KEY'
        WHEN 'p' THEN 'PRIMARY KEY'
        WHEN 'u' THEN 'UNIQUE'
        WHEN 'c' THEN 'CHECK'
        WHEN 't' THEN 'TRIGGER'
        ELSE con.contype::text
    END AS constraint_type_desc
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE nsp.nspname = 'auth'
    AND rel.relname = 'users';

-- Try a hard DELETE with CASCADE
-- This should force deletion of any dependent records
DELETE FROM auth.users
WHERE id = 'b707a8c1-a298-485f-aed3-aac56bbc9880'
RETURNING id, email, deleted_at;
