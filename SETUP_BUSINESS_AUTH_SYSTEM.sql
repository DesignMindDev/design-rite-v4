-- =====================================================
-- DESIGN-RITE BUSINESS AUTH SYSTEM
-- Run this in Supabase SQL Editor
-- Project: aeorianxnxpxveoxzhov
-- =====================================================
-- Features:
-- 1. @design-rite.com domain restriction for business side
-- 2. Super admin can override domain restriction
-- 3. Granular module permissions per user
-- 4. Developer/Contractor role support
-- 5. SSO capability for dual-access users
-- =====================================================

-- =====================================================
-- STEP 1: Create user_roles table with domain control
-- =====================================================

CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) UNIQUE NOT NULL,
  role text CHECK (role IN ('super_admin', 'admin', 'manager', 'developer', 'contractor', 'user', 'guest')) DEFAULT 'user',

  -- Domain restriction override
  domain_override boolean DEFAULT false,
  override_reason text,
  override_granted_by uuid REFERENCES auth.users(id),
  override_granted_at timestamptz,

  -- Assignment tracking
  assigned_by uuid REFERENCES auth.users(id),
  assigned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),

  -- User group (for contractors/teams)
  user_group text, -- 'internal', 'contractor', 'developer', 'partner'

  -- Notes
  notes text
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_group ON user_roles(user_group);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
DROP POLICY IF EXISTS "Super admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Super admins can manage roles" ON user_roles;

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
-- STEP 2: Create module_permissions table
-- =====================================================

CREATE TABLE IF NOT EXISTS module_permissions (
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

CREATE INDEX IF NOT EXISTS idx_module_permissions_user_id ON module_permissions(user_id);

ALTER TABLE module_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own permissions" ON module_permissions;
DROP POLICY IF EXISTS "Super admins can view all permissions" ON module_permissions;
DROP POLICY IF EXISTS "Super admins can manage permissions" ON module_permissions;

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
-- STEP 3: Create profiles table
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
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

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles;

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
-- STEP 4: Create domain validation function
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
-- STEP 5: Assign roles to Design-Rite team
-- =====================================================

-- Super Admin: dan@design-rite.com
INSERT INTO user_roles (user_id, role, user_group, assigned_at)
SELECT
  id,
  'super_admin',
  'internal',
  now()
FROM auth.users
WHERE email = 'dan@design-rite.com'
ON CONFLICT (user_id) DO UPDATE SET
  role = 'super_admin',
  user_group = 'internal';

-- Create profile for Dan
INSERT INTO profiles (id, email, full_name, company, department, job_title)
SELECT
  id,
  email,
  'Dan Kozich',
  'Design-Rite',
  'Leadership',
  'CEO / Founder'
FROM auth.users
WHERE email = 'dan@design-rite.com'
ON CONFLICT (id) DO UPDATE SET
  full_name = 'Dan Kozich',
  company = 'Design-Rite',
  department = 'Leadership',
  job_title = 'CEO / Founder';

-- Super admin gets ALL permissions
INSERT INTO module_permissions (
  user_id,
  operations_dashboard, analytics,
  ai_providers, ai_assistant_config, chatbot_config,
  product_harvester,
  team_management, creative_studio, spatial_studio, logo_management, video_management, blog_management,
  subscriptions, demo_dashboard, testing_dashboard,
  about_us_management,
  user_management, permissions_management, activity_logs
)
SELECT
  id,
  true, true,
  true, true, true,
  true,
  true, true, true, true, true, true,
  true, true, true,
  true,
  true, true, true
FROM auth.users
WHERE email = 'dan@design-rite.com'
ON CONFLICT (user_id) DO UPDATE SET
  operations_dashboard = true, analytics = true,
  ai_providers = true, ai_assistant_config = true, chatbot_config = true,
  product_harvester = true,
  team_management = true, creative_studio = true, spatial_studio = true,
  logo_management = true, video_management = true, blog_management = true,
  subscriptions = true, demo_dashboard = true, testing_dashboard = true,
  about_us_management = true,
  user_management = true, permissions_management = true, activity_logs = true;

-- Admin: plisk@design-rite.com
INSERT INTO user_roles (user_id, role, user_group, assigned_at)
SELECT
  id,
  'admin',
  'internal',
  now()
FROM auth.users
WHERE email = 'plisk@design-rite.com'
ON CONFLICT (user_id) DO UPDATE SET
  role = 'admin',
  user_group = 'internal';

-- Create profile for Phil
INSERT INTO profiles (id, email, full_name, company, department, job_title)
SELECT
  id,
  email,
  'Phil Lisk',
  'Design-Rite',
  'Operations',
  'Admin'
FROM auth.users
WHERE email = 'plisk@design-rite.com'
ON CONFLICT (id) DO UPDATE SET
  full_name = 'Phil Lisk',
  company = 'Design-Rite',
  department = 'Operations',
  job_title = 'Admin';

-- Admin gets most permissions (not super admin functions)
INSERT INTO module_permissions (
  user_id,
  operations_dashboard, analytics,
  ai_providers, ai_assistant_config, chatbot_config,
  product_harvester,
  team_management, creative_studio, spatial_studio, logo_management, video_management, blog_management,
  subscriptions, demo_dashboard, testing_dashboard,
  about_us_management,
  user_management, permissions_management, activity_logs
)
SELECT
  id,
  true, true,
  true, true, true,
  true,
  true, true, true, true, true, true,
  true, true, true,
  true,
  false, false, true
FROM auth.users
WHERE email = 'plisk@design-rite.com'
ON CONFLICT (user_id) DO UPDATE SET
  operations_dashboard = true, analytics = true,
  ai_providers = true, ai_assistant_config = true, chatbot_config = true,
  product_harvester = true,
  team_management = true, creative_studio = true, spatial_studio = true,
  logo_management = true, video_management = true, blog_management = true,
  subscriptions = true, demo_dashboard = true, testing_dashboard = true,
  about_us_management = true,
  user_management = false, permissions_management = false, activity_logs = true;

-- =====================================================
-- STEP 6: Verify setup
-- =====================================================

SELECT
  u.email,
  ur.role,
  ur.user_group,
  ur.domain_override,
  p.full_name,
  p.department,
  p.job_title
FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email IN ('dan@design-rite.com', 'plisk@design-rite.com')
ORDER BY ur.role;

-- =====================================================
-- EXPECTED RESULT:
-- =====================================================
-- email                 | role        | user_group | domain_override | full_name  | department | job_title
-- ----------------------|-------------|------------|-----------------|------------|------------|-------------
-- dan@design-rite.com   | super_admin | internal   | false           | Dan Kozich | Leadership | CEO / Founder
-- plisk@design-rite.com | admin       | internal   | false           | Phil Lisk  | Operations | Admin

-- =====================================================
-- CREATING USERS (if they don't exist yet):
-- =====================================================
-- 1. Go to: https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/auth/users
-- 2. Add user → Email: dan@design-rite.com
-- 3. Password: (strong password)
-- 4. ✅ Auto Confirm User
-- 5. Repeat for plisk@design-rite.com
-- 6. Run this script again

-- =====================================================
-- TO GRANT CONTRACTOR/DEVELOPER ACCESS:
-- =====================================================
-- Super admin can run this to grant domain override:
--
-- INSERT INTO user_roles (user_id, role, user_group, domain_override, override_reason, override_granted_by)
-- SELECT
--   id,
--   'developer',
--   'contractor',
--   true,
--   'External developer - needs access to admin portal',
--   (SELECT id FROM auth.users WHERE email = 'dan@design-rite.com')
-- FROM auth.users
-- WHERE email = 'contractor@example.com'
-- ON CONFLICT (user_id) DO UPDATE SET
--   domain_override = true,
--   override_granted_at = now();

-- =====================================================
-- ROLE HIERARCHY:
-- =====================================================
-- super_admin    → Full platform control (Dan)
-- admin          → Team management, no user/permission control (Phil)
-- manager        → Unlimited quotes/assessments, no admin access
-- developer      → Custom permissions, domain override required
-- contractor     → Custom permissions, domain override required
-- user           → Rate limited customer access
-- guest          → Public/trial access
