-- Check what's preventing plisk deletion
-- Run this in Supabase SQL Editor

-- 1. Find plisk user ID
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'plisk@design-rite.com';

-- 2. Check for foreign key constraints referencing auth.users
SELECT
    tc.table_schema, 
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND ccu.table_name = 'users'
  AND ccu.table_schema = 'auth';

-- 3. Check if plisk has data in other tables
-- (Replace USER_ID with plisk's actual UUID from query 1)
-- SELECT * FROM public.profiles WHERE id = 'USER_ID';
-- SELECT * FROM public.activity_logs WHERE user_id = 'USER_ID';
