-- =====================================================
-- SETUP AUTHENTICATION + CREATE SUPER ADMIN
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

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Enable Row Level Security
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own role
CREATE POLICY IF NOT EXISTS "Users can view own role" ON user_roles
  FOR SELECT
  USING (user_id = auth.uid());

-- RLS Policy: Super admins can view all roles
CREATE POLICY IF NOT EXISTS "Super admins can view all roles" ON user_roles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'super_admin'
    )
  );

-- RLS Policy: Super admins can manage all roles
CREATE POLICY IF NOT EXISTS "Super admins can manage roles" ON user_roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'super_admin'
    )
  );

-- =====================================================
-- STEP 2: Create profiles table (if needed)
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

-- Create index
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own profile
CREATE POLICY IF NOT EXISTS "Users can view own profile" ON profiles
  FOR SELECT
  USING (id = auth.uid());

-- RLS Policy: Users can update their own profile
CREATE POLICY IF NOT EXISTS "Users can update own profile" ON profiles
  FOR UPDATE
  USING (id = auth.uid());

-- =====================================================
-- STEP 3: Check if your user exists
-- =====================================================

DO $$
DECLARE
  user_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'dkozich65@gmail.com'
  ) INTO user_exists;

  IF user_exists THEN
    RAISE NOTICE 'User dkozich65@gmail.com exists';
  ELSE
    RAISE NOTICE 'User dkozich65@gmail.com does NOT exist - create via Dashboard first!';
  END IF;
END $$;

-- =====================================================
-- STEP 4: Assign super_admin role
-- (Only works if user exists in auth.users)
-- =====================================================

-- If user exists, this will assign super_admin role
INSERT INTO user_roles (user_id, role, assigned_at)
SELECT
  id,
  'super_admin',
  now()
FROM auth.users
WHERE email = 'dkozich65@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

-- =====================================================
-- STEP 5: Create profile for user (if not exists)
-- =====================================================

INSERT INTO profiles (id, email, full_name)
SELECT
  id,
  email,
  email
FROM auth.users
WHERE email = 'dkozich65@gmail.com'
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STEP 6: Verify everything
-- =====================================================

SELECT
  u.id,
  u.email,
  u.created_at,
  u.email_confirmed_at,
  ur.role,
  ur.assigned_at
FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
WHERE u.email = 'dkozich65@gmail.com';

-- =====================================================
-- EXPECTED RESULT:
-- =====================================================
-- id                                   | email               | created_at | email_confirmed_at | role        | assigned_at
-- -------------------------------------|---------------------|------------|--------------------|--------------|--------------
-- xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | dkozich65@gmail.com | ...        | ...                | super_admin | ...

-- =====================================================
-- IF USER DOESN'T EXIST:
-- =====================================================
-- 1. Go to: https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/auth/users
-- 2. Click "Add user" → "Create new user"
-- 3. Email: dkozich65@gmail.com
-- 4. Password: (choose strong password)
-- 5. ✅ Auto Confirm User (IMPORTANT!)
-- 6. Run this script again

-- =====================================================
-- AFTER RUNNING THIS SCRIPT:
-- =====================================================
-- 1. Logout if currently logged in
-- 2. Clear browser cookies/cache
-- 3. Login at: http://localhost:3000/login
-- 4. You will be redirected to: http://localhost:3000/admin ✅
