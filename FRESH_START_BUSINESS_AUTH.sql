-- =====================================================
-- FRESH START - Drop and recreate all business auth tables
-- Run this in Supabase SQL Editor
-- =====================================================
-- This will DELETE all existing data and start completely fresh
-- =====================================================

-- STEP 1: Drop all existing tables (in reverse dependency order)
DROP TABLE IF EXISTS module_permissions CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP FUNCTION IF EXISTS check_business_access(text, text, boolean);

-- =====================================================
-- STEP 2: Create user_roles table with domain control
-- =====================================================

CREATE TABLE user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) UNIQUE NOT NULL,
  role text CHECK (role IN ('super_admin', 'admin', 'manager', 'developer', 'contractor', 'user', 'guest')) DEFAULT 'user',

  -- Domain restriction override
  domain_override boolean DEFAULT false,
  override_reason text,
  override_granted_by uuid REFERENCES auth.users(id),
  override_granted_at timestamptz,

  -- User group (for contractors/teams)
  user_group text, -- 'internal', 'contractor', 'developer', 'partner'

  -- Assignment tracking
  assigned_by uuid REFERENCES auth.users(id),
  assigned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),

  -- Notes
  notes text
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);
CREATE INDEX idx_user_roles_group ON user_roles(user_group);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

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
-- STEP 3: Create module_permissions table
-- =====================================================

CREATE TABLE module_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Operations & Monitoring
  operations_dashboard boolean DEFAULT false,
  analytics boolean DEFAULT false,

  -- AI Tools
  ai_providers boolean DEFAULT false,
  ai_assistant_config boolean DEFAULT false,
  chatbot_config boolean DEFAULT false,

  -- Data Tools
  product_harvester boolean DEFAULT false,

  -- Marketing & Content
  team_management boolean DEFAULT false,
  creative_studio boolean DEFAULT false,
  spatial_studio boolean DEFAULT false,
  logo_management boolean DEFAULT false,
  video_management boolean DEFAULT false,
  blog_management boolean DEFAULT false,

  -- Business Tools
  subscriptions boolean DEFAULT false,
  demo_dashboard boolean DEFAULT false,
  testing_dashboard boolean DEFAULT false,

  -- About Us
  about_us_management boolean DEFAULT false,

  -- Super Admin Only
  user_management boolean DEFAULT false,
  permissions_management boolean DEFAULT false,
  activity_logs boolean DEFAULT false,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(user_id)
);

CREATE INDEX idx_module_permissions_user_id ON module_permissions(user_id);

ALTER TABLE module_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own permissions" ON module_permissions
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Super admins can view all permissions" ON module_permissions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage permissions" ON module_permissions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'super_admin'
    )
  );

-- =====================================================
-- STEP 4: Create profiles table
-- =====================================================

CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  company text,

  -- Business user info
  department text,
  job_title text,

  -- Subscription info
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text,
  subscription_tier text DEFAULT 'base' CHECK (subscription_tier IN ('base', 'pro', 'enterprise')),
  subscription_status text DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due')),

  -- SSO capability
  sso_enabled boolean DEFAULT false,
  sso_provider text, -- 'google', 'microsoft', 'okta'

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_stripe_customer ON profiles(stripe_customer_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Super admins can view all profiles" ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'super_admin'
    )
  );

-- =====================================================
-- STEP 5: Create domain validation function
-- =====================================================

CREATE OR REPLACE FUNCTION check_business_access(user_email text, user_role text, has_override boolean)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- Super admins always have access
  IF user_role = 'super_admin' THEN
    RETURN true;
  END IF;

  -- Users with domain override have access
  IF has_override = true THEN
    RETURN true;
  END IF;

  -- Check if email is @design-rite.com
  IF user_email LIKE '%@design-rite.com' THEN
    RETURN true;
  END IF;

  -- Otherwise, no access
  RETURN false;
END;
$$;

-- =====================================================
-- STEP 6: Verify tables created
-- =====================================================

SELECT 'user_roles' as table_name, COUNT(*) as count FROM user_roles
UNION ALL
SELECT 'module_permissions', COUNT(*) FROM module_permissions
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles;

-- =====================================================
-- EXPECTED RESULT: All counts should be 0
-- =====================================================
-- table_name          | count
-- --------------------|-------
-- user_roles          | 0
-- module_permissions  | 0
-- profiles            | 0
-- =====================================================

-- =====================================================
-- NEXT STEPS:
-- =====================================================
-- 1. Create user accounts in Supabase Auth (if they don't exist):
--    https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/auth/users
--    - dan@design-rite.com (super admin)
--    - plisk@design-rite.com (admin)
--
-- 2. Then run ASSIGN_DESIGN_RITE_ROLES.sql to assign roles
--
-- 3. Test login at http://localhost:3000/login
-- =====================================================
