-- Check and grant admin access for your email
-- Run this in Supabase SQL Editor

-- 1. First, check if your user exists in auth.users
SELECT
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
WHERE email = 'YOUR_EMAIL@DOMAIN.COM'  -- Replace with your actual email
ORDER BY created_at DESC;

-- 2. Check if you have a profile
SELECT
  id,
  email,
  full_name,
  company,
  created_at
FROM profiles
WHERE email = 'YOUR_EMAIL@DOMAIN.COM'  -- Replace with your actual email
ORDER BY created_at DESC;

-- 3. Check your current role (if any)
SELECT
  ur.user_id,
  u.email,
  ur.role,
  ur.created_at
FROM user_roles ur
JOIN auth.users u ON ur.user_id = u.id
WHERE u.email = 'YOUR_EMAIL@DOMAIN.COM';  -- Replace with your actual email

-- 4. Grant super_admin role (EXECUTE THIS IF YOU DON'T HAVE ADMIN ACCESS)
-- First, get your user_id from step 1, then run:

INSERT INTO user_roles (user_id, role, created_at, updated_at)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@DOMAIN.COM'),  -- Replace with your actual email
  'super_admin',
  NOW(),
  NOW()
)
ON CONFLICT (user_id)
DO UPDATE SET
  role = 'super_admin',
  updated_at = NOW();

-- 5. Verify the role was assigned
SELECT
  ur.user_id,
  u.email,
  ur.role,
  ur.created_at
FROM user_roles ur
JOIN auth.users u ON ur.user_id = u.id
WHERE u.email = 'YOUR_EMAIL@DOMAIN.COM';  -- Replace with your actual email

-- 6. Check all current admin/super_admin users
SELECT
  u.email,
  ur.role,
  p.full_name,
  p.company
FROM user_roles ur
JOIN auth.users u ON ur.user_id = u.id
LEFT JOIN profiles p ON ur.user_id = p.id
WHERE ur.role IN ('super_admin', 'admin')
ORDER BY ur.role DESC, u.email;
