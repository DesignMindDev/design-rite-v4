-- Create Fresh Super Admin Account
-- Email: zclient@design-rite.com
-- This is a clean Supabase-only account with no NextAuth history

-- Step 1: Check if user already exists
SELECT
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
WHERE email = 'zclient@design-rite.com';

-- Step 2: If user exists, check current role
SELECT
  u.email,
  ur.role,
  ur.assigned_at
FROM user_roles ur
JOIN auth.users u ON ur.user_id = u.id
WHERE u.email = 'zclient@design-rite.com';

-- Step 3: Grant super_admin role to zclient@design-rite.com
-- (Works whether user exists or not - will need to create account first if doesn't exist)
INSERT INTO user_roles (user_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'zclient@design-rite.com'),
  'super_admin'
)
ON CONFLICT (user_id)
DO UPDATE SET role = 'super_admin';

-- Step 4: Verify the role was assigned
SELECT
  u.id,
  u.email,
  ur.role,
  ur.assigned_at,
  p.full_name,
  p.company
FROM auth.users u
JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email = 'zclient@design-rite.com';

-- Step 5: (Optional) List all super_admins to confirm
SELECT
  u.email,
  ur.role,
  ur.assigned_at,
  p.full_name
FROM user_roles ur
JOIN auth.users u ON ur.user_id = u.id
LEFT JOIN profiles p ON p.id = u.id
WHERE ur.role = 'super_admin'
ORDER BY ur.assigned_at DESC;

-- ============================================
-- INSTRUCTIONS
-- ============================================
--
-- 1. First, create the account at: https://portal.design-rite.com/auth
--    - Email: zclient@design-rite.com
--    - Set a strong password
--    - Verify the email
--
-- 2. Then run Step 3 above to grant super_admin role
--
-- 3. Test login at: http://localhost:3000/admin
--    - Should have full access immediately
--
-- 4. Once confirmed working, optionally remove old admin:
--    DELETE FROM user_roles WHERE user_id = (SELECT id FROM auth.users WHERE email = 'dan@design-rite.com');
--
-- ============================================
