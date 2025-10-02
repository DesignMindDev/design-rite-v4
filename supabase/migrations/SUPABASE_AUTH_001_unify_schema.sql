-- ==============================================
-- SUPABASE AUTH MIGRATION 001: Unify Schema
-- Merges Design-Rite v3 + Document AI schemas
-- ==============================================
-- Purpose: Extend Document AI profiles table with Design-Rite fields
-- Target: Unified platform under Supabase Auth
-- Run after: Loading designr_backup.sql
-- ==============================================

-- ==============================================
-- STEP 1: Extend profiles table with Design-Rite fields
-- ==============================================

-- Add Design-Rite user management fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS access_code text UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login timestamp with time zone;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_count integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS failed_login_attempts integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rate_limit_override boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notes text;

-- Add subscription fields (already exist in backup, but ensure compatibility)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'base';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'inactive';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

-- Add constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_status_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_status_check
      CHECK (status IN ('active', 'suspended', 'deleted', 'pending'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_subscription_tier_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_tier_check
      CHECK (subscription_tier IN ('base', 'pro', 'enterprise'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_subscription_status_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_status_check
      CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due'));
  END IF;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_access_code ON profiles(access_code);
CREATE INDEX IF NOT EXISTS idx_profiles_created_by ON profiles(created_by);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);

COMMENT ON TABLE profiles IS 'Unified user profile combining Design-Rite v3 + Document AI features';

-- ==============================================
-- STEP 2: Extend app_role enum with 5-tier system
-- ==============================================

-- Add new roles to existing enum (super_admin, manager, guest)
DO $$
BEGIN
  -- Check and add super_admin
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'super_admin' AND enumtypid = 'app_role'::regtype) THEN
    ALTER TYPE app_role ADD VALUE 'super_admin';
  END IF;

  -- Check and add manager
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'manager' AND enumtypid = 'app_role'::regtype) THEN
    ALTER TYPE app_role ADD VALUE 'manager';
  END IF;

  -- Check and add guest
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'guest' AND enumtypid = 'app_role'::regtype) THEN
    ALTER TYPE app_role ADD VALUE 'guest';
  END IF;
END $$;

-- Result: app_role = (admin, moderator, user, super_admin, manager, guest)

COMMENT ON TYPE app_role IS 'Unified role system: super_admin > admin > manager = moderator > user > guest';

-- ==============================================
-- STEP 3: Create Design-Rite specific tables
-- ==============================================

-- Activity logs (audit trail for all actions)
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  success boolean DEFAULT true,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

COMMENT ON TABLE activity_logs IS 'Comprehensive audit trail of all user actions';

-- Permissions (feature-based access control with rate limits)
CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  feature text NOT NULL,
  can_create boolean DEFAULT false,
  can_read boolean DEFAULT false,
  can_update boolean DEFAULT false,
  can_delete boolean DEFAULT false,
  daily_limit integer,
  monthly_limit integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(role, feature)
);

CREATE INDEX IF NOT EXISTS idx_permissions_role ON permissions(role);
CREATE INDEX IF NOT EXISTS idx_permissions_feature ON permissions(feature);

COMMENT ON TABLE permissions IS 'Feature-based permissions with rate limiting per role';

-- Usage tracking (for rate limiting)
CREATE TABLE IF NOT EXISTS usage_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature text NOT NULL,
  usage_count integer DEFAULT 0,
  last_reset timestamp with time zone DEFAULT now(),
  period text NOT NULL CHECK (period IN ('daily', 'monthly')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, feature, period)
);

CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_feature ON usage_tracking(user_id, feature);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_period ON usage_tracking(period);

COMMENT ON TABLE usage_tracking IS 'Tracks feature usage for rate limiting';

-- User sessions (optional - for session management)
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  last_activity timestamp with time zone DEFAULT now(),
  ip_address inet,
  user_agent text
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

COMMENT ON TABLE user_sessions IS 'Tracks active user sessions for security monitoring';

-- ==============================================
-- STEP 4: Create unified role helper functions
-- ==============================================

-- Get user's role (highest priority if multiple roles)
CREATE OR REPLACE FUNCTION get_user_role(user_uuid uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM user_roles
  WHERE user_id = user_uuid
  ORDER BY
    CASE role
      WHEN 'super_admin' THEN 1
      WHEN 'admin' THEN 2
      WHEN 'manager' THEN 3
      WHEN 'moderator' THEN 3
      WHEN 'user' THEN 4
      WHEN 'guest' THEN 5
    END
  LIMIT 1;
$$;

COMMENT ON FUNCTION get_user_role IS 'Returns highest priority role for user';

-- Check if user has required role level (hierarchical)
CREATE OR REPLACE FUNCTION has_role_level(user_uuid uuid, required_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    CASE get_user_role(user_uuid)
      WHEN 'super_admin' THEN true
      WHEN 'admin' THEN required_role IN ('admin', 'manager', 'moderator', 'user', 'guest')
      WHEN 'manager' THEN required_role IN ('manager', 'user', 'guest')
      WHEN 'moderator' THEN required_role IN ('moderator', 'user', 'guest')
      WHEN 'user' THEN required_role IN ('user', 'guest')
      WHEN 'guest' THEN required_role = 'guest'
      ELSE false
    END;
$$;

COMMENT ON FUNCTION has_role_level IS 'Checks if user has required role level (hierarchical)';

-- Get user permissions for a feature
CREATE OR REPLACE FUNCTION get_user_permissions(user_uuid uuid, feature_name text)
RETURNS TABLE (
  can_create boolean,
  can_read boolean,
  can_update boolean,
  can_delete boolean,
  daily_limit integer,
  monthly_limit integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    p.can_create,
    p.can_read,
    p.can_update,
    p.can_delete,
    p.daily_limit,
    p.monthly_limit
  FROM permissions p
  WHERE p.role = get_user_role(user_uuid)
    AND p.feature = feature_name
  LIMIT 1;
$$;

COMMENT ON FUNCTION get_user_permissions IS 'Gets user permissions for specific feature';

-- Increment usage counter (with automatic reset)
CREATE OR REPLACE FUNCTION increment_usage(user_uuid uuid, feature_name text, period_type text DEFAULT 'daily')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  reset_interval interval;
  current_usage record;
BEGIN
  -- Determine reset interval
  reset_interval := CASE period_type
    WHEN 'daily' THEN interval '1 day'
    WHEN 'monthly' THEN interval '1 month'
    ELSE interval '1 day'
  END;

  -- Get current usage
  SELECT * INTO current_usage
  FROM usage_tracking
  WHERE user_id = user_uuid
    AND feature = feature_name
    AND period = period_type;

  -- Check if reset is needed
  IF current_usage IS NULL THEN
    -- Create new usage record
    INSERT INTO usage_tracking (user_id, feature, usage_count, period, last_reset)
    VALUES (user_uuid, feature_name, 1, period_type, now());
  ELSIF current_usage.last_reset + reset_interval < now() THEN
    -- Reset counter
    UPDATE usage_tracking
    SET usage_count = 1, last_reset = now(), updated_at = now()
    WHERE id = current_usage.id;
  ELSE
    -- Increment counter
    UPDATE usage_tracking
    SET usage_count = usage_count + 1, updated_at = now()
    WHERE id = current_usage.id;
  END IF;
END;
$$;

COMMENT ON FUNCTION increment_usage IS 'Increments usage counter with automatic reset';

-- Check rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(user_uuid uuid, feature_name text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  user_perms record;
  daily_usage integer;
  monthly_usage integer;
  has_override boolean;
BEGIN
  -- Check if user has rate limit override
  SELECT rate_limit_override INTO has_override
  FROM profiles
  WHERE id = user_uuid;

  IF has_override THEN
    RETURN true;
  END IF;

  -- Get permissions
  SELECT * INTO user_perms
  FROM get_user_permissions(user_uuid, feature_name);

  -- If no limits set, allow
  IF user_perms.daily_limit IS NULL AND user_perms.monthly_limit IS NULL THEN
    RETURN true;
  END IF;

  -- Check daily limit
  IF user_perms.daily_limit IS NOT NULL THEN
    SELECT usage_count INTO daily_usage
    FROM usage_tracking
    WHERE user_id = user_uuid
      AND feature = feature_name
      AND period = 'daily'
      AND last_reset + interval '1 day' > now();

    IF daily_usage >= user_perms.daily_limit THEN
      RETURN false;
    END IF;
  END IF;

  -- Check monthly limit
  IF user_perms.monthly_limit IS NOT NULL THEN
    SELECT usage_count INTO monthly_usage
    FROM usage_tracking
    WHERE user_id = user_uuid
      AND feature = feature_name
      AND period = 'monthly'
      AND last_reset + interval '1 month' > now();

    IF monthly_usage >= user_perms.monthly_limit THEN
      RETURN false;
    END IF;
  END IF;

  RETURN true;
END;
$$;

COMMENT ON FUNCTION check_rate_limit IS 'Checks if user has exceeded rate limits for feature';

-- ==============================================
-- STEP 5: Seed default permissions
-- ==============================================

-- Clear existing permissions (if re-running migration)
TRUNCATE TABLE permissions;

-- Super Admin (unlimited everything)
INSERT INTO permissions (role, feature, can_create, can_read, can_update, can_delete, daily_limit, monthly_limit) VALUES
  ('super_admin', 'quick_estimates', true, true, true, true, NULL, NULL),
  ('super_admin', 'ai_assessments', true, true, true, true, NULL, NULL),
  ('super_admin', 'quotes', true, true, true, true, NULL, NULL),
  ('super_admin', 'bom_generation', true, true, true, true, NULL, NULL),
  ('super_admin', 'document_upload', true, true, true, true, NULL, NULL),
  ('super_admin', 'ai_chat', true, true, true, true, NULL, NULL),
  ('super_admin', 'generated_documents', true, true, true, true, NULL, NULL),
  ('super_admin', 'user_management', true, true, true, true, NULL, NULL);

-- Admin (unlimited platform features)
INSERT INTO permissions (role, feature, can_create, can_read, can_update, can_delete, daily_limit, monthly_limit) VALUES
  ('admin', 'quick_estimates', true, true, true, true, NULL, NULL),
  ('admin', 'ai_assessments', true, true, true, true, NULL, NULL),
  ('admin', 'quotes', true, true, true, true, NULL, NULL),
  ('admin', 'bom_generation', true, true, true, true, NULL, NULL),
  ('admin', 'document_upload', true, true, true, true, NULL, NULL),
  ('admin', 'ai_chat', true, true, true, true, NULL, NULL),
  ('admin', 'generated_documents', true, true, true, true, NULL, NULL),
  ('admin', 'user_management', true, true, false, false, NULL, NULL); -- Can't delete users

-- Manager (unlimited work, no admin)
INSERT INTO permissions (role, feature, can_create, can_read, can_update, can_delete, daily_limit, monthly_limit) VALUES
  ('manager', 'quick_estimates', true, true, true, true, NULL, NULL),
  ('manager', 'ai_assessments', true, true, true, true, NULL, NULL),
  ('manager', 'quotes', true, true, true, true, NULL, NULL),
  ('manager', 'bom_generation', true, true, true, true, NULL, NULL),
  ('manager', 'document_upload', true, true, true, false, NULL, NULL),
  ('manager', 'ai_chat', true, true, false, false, NULL, NULL),
  ('manager', 'generated_documents', true, true, true, false, NULL, NULL);

-- Moderator (same as manager for Document AI features)
INSERT INTO permissions (role, feature, can_create, can_read, can_update, can_delete, daily_limit, monthly_limit) VALUES
  ('moderator', 'quick_estimates', true, true, true, true, NULL, NULL),
  ('moderator', 'ai_assessments', true, true, true, true, NULL, NULL),
  ('moderator', 'quotes', true, true, true, true, NULL, NULL),
  ('moderator', 'bom_generation', true, true, true, true, NULL, NULL),
  ('moderator', 'document_upload', true, true, true, false, NULL, NULL),
  ('moderator', 'ai_chat', true, true, false, false, NULL, NULL),
  ('moderator', 'generated_documents', true, true, true, false, NULL, NULL);

-- User (rate limited)
INSERT INTO permissions (role, feature, can_create, can_read, can_update, can_delete, daily_limit, monthly_limit) VALUES
  ('user', 'quick_estimates', true, true, true, false, 10, 50),
  ('user', 'ai_assessments', true, true, true, false, 5, 20),
  ('user', 'quotes', true, true, true, false, 10, 50),
  ('user', 'bom_generation', true, true, false, false, 10, 50),
  ('user', 'document_upload', true, true, false, false, 5, 20),
  ('user', 'ai_chat', true, true, false, false, 50, 200),
  ('user', 'generated_documents', true, true, false, false, 10, 40);

-- Guest (very limited)
INSERT INTO permissions (role, feature, can_create, can_read, can_update, can_delete, daily_limit, monthly_limit) VALUES
  ('guest', 'quick_estimates', true, true, false, false, 3, 10),
  ('guest', 'ai_assessments', false, false, false, false, 0, 0),
  ('guest', 'quotes', false, true, false, false, 3, 10),
  ('guest', 'document_upload', false, false, false, false, 0, 0),
  ('guest', 'ai_chat', false, false, false, false, 0, 0),
  ('guest', 'generated_documents', false, false, false, false, 0, 0);

-- ==============================================
-- STEP 6: Update RLS policies for unified schema
-- ==============================================

-- Update profiles RLS to include Design-Rite access patterns
-- (Existing policies from backup will remain, we add new ones)

-- Super admins can manage all profiles
CREATE POLICY IF NOT EXISTS "Super admins can manage all profiles" ON profiles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Admins can view profiles they created
CREATE POLICY IF NOT EXISTS "Admins can view created profiles" ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
    AND (created_by = auth.uid() OR id = auth.uid())
  );

-- Enable RLS on new tables
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Activity logs: Users can view their own, admins can view all
CREATE POLICY "Users can view own activity" ON activity_logs
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all activity" ON activity_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- Permissions: Everyone can read, only admins can modify
CREATE POLICY "Everyone can read permissions" ON permissions
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage permissions" ON permissions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- Usage tracking: Users can view own, system can modify
CREATE POLICY "Users can view own usage" ON usage_tracking
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can manage usage" ON usage_tracking
  FOR ALL
  USING (true); -- Backend will manage this

-- User sessions: Users can view own sessions
CREATE POLICY "Users can view own sessions" ON user_sessions
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can manage sessions" ON user_sessions
  FOR ALL
  USING (true);

-- ==============================================
-- VERIFICATION QUERIES
-- ==============================================

-- Run these to verify migration success:

/*
-- Check profiles table has new columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('phone', 'access_code', 'status', 'subscription_tier');

-- Check app_role enum has all roles
SELECT enumlabel FROM pg_enum
WHERE enumtypid = 'app_role'::regtype
ORDER BY enumsortorder;

-- Check permissions seeded
SELECT role, feature, can_create, daily_limit
FROM permissions
ORDER BY role, feature;

-- Check functions created
SELECT proname FROM pg_proc
WHERE proname IN ('get_user_role', 'has_role_level', 'check_rate_limit', 'increment_usage');
*/

-- ==============================================
-- MIGRATION COMPLETE
-- ==============================================

-- Next steps:
-- 1. Verify queries above return expected results
-- 2. Run user migration script to move Next-Auth users to Supabase Auth
-- 3. Update API routes to use Supabase Auth
-- 4. Update frontend components
-- 5. Test thoroughly on staging

COMMENT ON SCHEMA public IS 'Unified Design-Rite v3 + Document AI schema with Supabase Auth';
