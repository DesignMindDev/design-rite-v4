-- =====================================================
-- COMPLETE AUTH SETUP 2025 - Production Ready
-- =====================================================
-- This script sets up a complete auth system with:
-- - CASCADE deletion on ALL user-related tables
-- - Profiles, user_roles, activity_logs
-- - Helper functions for role checking
-- - RLS policies for security
--
-- Run this on a fresh Supabase project, or after cleaning up old auth
-- =====================================================

-- =====================================================
-- PART 1: CLEANUP (Optional - only if migrating)
-- =====================================================

-- Uncomment these if you need to drop old stuff first:
/*
DROP FUNCTION IF EXISTS public.get_user_role(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_super_admin(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.log_activity(uuid, text, jsonb, boolean, text) CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TYPE IF EXISTS app_role CASCADE;
*/

-- =====================================================
-- PART 2: CREATE TRIGGER FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PART 3: CREATE PROFILES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  company text,
  phone text,
  avatar_url text,
  website text,
  address text,
  city text,
  state text,
  zip_code text,
  business_type text,
  tax_id text,
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text,
  subscription_tier text DEFAULT 'starter',
  subscription_status text DEFAULT 'inactive',
  token_usage bigint DEFAULT 0,
  has_free_access boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role has full access to profiles"
  ON profiles FOR ALL USING (auth.role() = 'service_role');

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;

-- =====================================================
-- PART 4: CREATE USER_ROLES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('super_admin', 'admin', 'manager', 'user', 'guest')),
  assigned_at timestamptz DEFAULT now(),
  assigned_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  PRIMARY KEY (user_id)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own role"
  ON user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON user_roles FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
  );

CREATE POLICY "Service role has full access to user_roles"
  ON user_roles FOR ALL USING (auth.role() = 'service_role');

GRANT SELECT ON user_roles TO authenticated;

-- =====================================================
-- PART 5: CREATE ACTIVITY_LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  details jsonb,
  ip_address inet,
  user_agent text,
  success boolean DEFAULT true,
  error_message text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity"
  ON activity_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity"
  ON activity_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
  );

CREATE POLICY "Service role can insert activity logs"
  ON activity_logs FOR INSERT WITH CHECK (auth.role() = 'service_role');

GRANT SELECT ON activity_logs TO authenticated;

-- =====================================================
-- PART 6: CREATE HELPER FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS text AS $$
  SELECT role FROM user_roles WHERE user_id = user_uuid;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean AS $$
  SELECT EXISTS (SELECT 1 FROM user_roles WHERE user_id = user_uuid AND role IN ('super_admin', 'admin', 'manager'));
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_super_admin(user_uuid uuid)
RETURNS boolean AS $$
  SELECT EXISTS (SELECT 1 FROM user_roles WHERE user_id = user_uuid AND role = 'super_admin');
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.log_activity(
  p_user_id uuid,
  p_action text,
  p_details jsonb DEFAULT NULL,
  p_success boolean DEFAULT true,
  p_error_message text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO activity_logs (user_id, action, details, success, error_message)
  VALUES (p_user_id, p_action, p_details, p_success, p_error_message);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅✅✅ AUTH SETUP COMPLETE ✅✅✅';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'Tables created:';
  RAISE NOTICE '  ✅ profiles (with CASCADE)';
  RAISE NOTICE '  ✅ user_roles (with CASCADE)';
  RAISE NOTICE '  ✅ activity_logs (with CASCADE)';
  RAISE NOTICE '';
  RAISE NOTICE 'RLS policies: ✅ Enabled';
  RAISE NOTICE 'Triggers: ✅ Created';
  RAISE NOTICE 'Helper functions: ✅ Created';
  RAISE NOTICE '';
  RAISE NOTICE 'Next: Run FIX_ALL_CASCADE.sql to fix existing tables';
  RAISE NOTICE '================================================';
END $$;
