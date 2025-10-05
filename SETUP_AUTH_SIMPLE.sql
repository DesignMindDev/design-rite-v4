-- =====================================================
-- SIMPLE AUTH SETUP + SUPER ADMIN
-- Run this in Supabase SQL Editor
-- Project: aeorianxnxpxveoxzhov
-- =====================================================

-- =====================================================
-- STEP 1: Create user_roles table
-- =====================================================

CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) UNIQUE NOT NULL,
  role text CHECK (role IN ('super_admin', 'admin', 'manager', 'user', 'guest')) DEFAULT 'user',
  assigned_by uuid REFERENCES auth.users(id),
  assigned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid errors)
DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
DROP POLICY IF EXISTS "Super admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Super admins can manage roles" ON user_roles;

-- Create RLS policies
CREATE POLICY "Users can view own role" ON user_roles
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Super admins can view all roles" ON user_roles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage roles" ON user_roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'super_admin'
    )
  );

-- =====================================================
-- STEP 2: Create profiles table
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  company text,
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text,
  subscription_tier text DEFAULT 'base' CHECK (subscription_tier IN ('base', 'pro', 'enterprise')),
  subscription_status text DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (id = auth.uid());

-- =====================================================
-- STEP 3: Assign super_admin to dkozich65@gmail.com
-- =====================================================

-- This will work if the user exists, otherwise it will do nothing
INSERT INTO user_roles (user_id, role, assigned_at)
SELECT
  id,
  'super_admin',
  now()
FROM auth.users
WHERE email = 'dkozich65@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

-- Create profile
INSERT INTO profiles (id, email, full_name)
SELECT
  id,
  email,
  email
FROM auth.users
WHERE email = 'dkozich65@gmail.com'
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STEP 4: Verify
-- =====================================================

SELECT
  u.id,
  u.email,
  u.email_confirmed_at,
  ur.role,
  ur.assigned_at
FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
WHERE u.email = 'dkozich65@gmail.com';

-- =====================================================
-- EXPECTED RESULT:
-- If you see a row with role = 'super_admin', SUCCESS! ✅
-- If you see NULL for role, user doesn't exist yet.
--
-- To create user:
-- 1. Go to: https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/auth/users
-- 2. Add user → Email: dkozich65@gmail.com
-- 3. ✅ Auto Confirm User
-- 4. Run this script again
-- =====================================================
