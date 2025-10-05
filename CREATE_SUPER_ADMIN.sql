-- =====================================================
-- CREATE SUPER ADMIN FOR dkozich65@gmail.com
-- Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: Check if user exists in auth.users
SELECT
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
WHERE email = 'dkozich65@gmail.com';

-- If user exists, copy the UUID from above and run Step 2
-- If user doesn't exist, create via Supabase Dashboard first:
--   Dashboard → Authentication → Users → Add user
--   Email: dkozich65@gmail.com
--   Password: (choose strong password)
--   ✅ Auto Confirm User

-- =====================================================
-- Step 2: Assign super_admin role
-- (Replace YOUR_USER_ID with the UUID from Step 1)
-- =====================================================

INSERT INTO user_roles (user_id, role, assigned_at)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'dkozich65@gmail.com'),
  'super_admin',
  now()
)
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

-- =====================================================
-- Step 3: Verify role assignment
-- =====================================================

SELECT
  u.id,
  u.email,
  ur.role,
  ur.assigned_at
FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
WHERE u.email = 'dkozich65@gmail.com';

-- =====================================================
-- EXPECTED RESULT:
-- =====================================================
-- id                                   | email                  | role        | assigned_at
-- -------------------------------------|------------------------|-------------|------------------------
-- xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | dkozich65@gmail.com    | super_admin | 2025-10-05 ...

-- =====================================================
-- IMPORTANT: After running this:
-- =====================================================
-- 1. Logout if currently logged in
-- 2. Clear browser cookies
-- 3. Login again at http://localhost:3000/login
-- 4. You will be redirected to http://localhost:3000/admin
