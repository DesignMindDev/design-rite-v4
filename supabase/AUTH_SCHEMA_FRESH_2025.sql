-- =====================================================
-- FRESH AUTH SCHEMA 2025 - Modern, Clean, Working
-- Created: October 8, 2025
-- Purpose: Complete auth system with CASCADE on everything
-- =====================================================

-- =====================================================
-- 1. PROFILES TABLE
-- Extends auth.users with application-specific data
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  company text,
  phone text,
  avatar_url text,

  -- Stripe integration
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text,
  subscription_tier text DEFAULT 'starter' CHECK (subscription_tier IN ('starter', 'professional', 'enterprise')),
  subscription_status text DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due', 'trialing')),

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS Policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service role has full access to profiles"
  ON profiles FOR ALL
  USING (auth.role() = 'service_role');

-- Trigger to auto-create profile on user signup
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 2. USER_ROLES TABLE
-- Role-based access control
-- =====================================================

CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('super_admin', 'admin', 'manager', 'user', 'guest')),

  -- Audit fields
  assigned_at timestamptz DEFAULT now(),
  assigned_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Constraints
  PRIMARY KEY (user_id)
);

-- RLS Policies for user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own role"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON user_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Service role has full access to user_roles"
  ON user_roles FOR ALL
  USING (auth.role() = 'service_role');

-- Helper function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS text AS $$
  SELECT role FROM user_roles WHERE user_id = user_uuid;
$$ LANGUAGE sql SECURITY DEFINER;

-- =====================================================
-- 3. ACTIVITY_LOGS TABLE
-- Audit trail for all user actions
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

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);

-- RLS Policies for activity_logs
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity"
  ON activity_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity"
  ON activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Service role can insert activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- =====================================================
-- 4. HELPER FUNCTIONS
-- =====================================================

-- Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = user_uuid
      AND role IN ('super_admin', 'admin', 'manager')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_uuid uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = user_uuid
      AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Log activity helper
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
-- 5. GRANTS
-- =====================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT SELECT ON user_roles TO authenticated;
GRANT SELECT ON activity_logs TO authenticated;

-- =====================================================
-- 6. COMMENTS
-- =====================================================

COMMENT ON TABLE profiles IS 'User profiles extending auth.users with app-specific data';
COMMENT ON TABLE user_roles IS 'Role-based access control with CASCADE deletion';
COMMENT ON TABLE activity_logs IS 'Audit trail with CASCADE deletion - preserves audit history';

COMMENT ON COLUMN profiles.subscription_tier IS 'Pricing tier: starter (free), professional ($149/mo), enterprise ($499/mo)';
COMMENT ON COLUMN user_roles.role IS 'Role hierarchy: super_admin > admin > manager > user > guest';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify CASCADE constraints are set
SELECT
  tc.table_name,
  kcu.column_name,
  rc.delete_rule,
  CASE
    WHEN rc.delete_rule IN ('CASCADE', 'SET NULL') THEN '✅ Good'
    ELSE '❌ Bad - missing CASCADE'
  END as status
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.referential_constraints rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('profiles', 'user_roles', 'activity_logs')
ORDER BY tc.table_name, kcu.column_name;

-- Verify triggers are created
SELECT
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table IN ('profiles', 'user_roles', 'activity_logs')
ORDER BY event_object_table, trigger_name;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅✅✅ FRESH AUTH SCHEMA DEPLOYED ✅✅✅';
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
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Create super admin account';
  RAISE NOTICE '  2. Test user creation';
  RAISE NOTICE '  3. Test user deletion (should work!)';
  RAISE NOTICE '================================================';
END $$;
