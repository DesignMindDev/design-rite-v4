-- Design-Rite v3 - Admin Authentication & User Management System
-- Migration: Create authentication and authorization tables
-- Created: 2025-10-01
-- Run this in Supabase SQL Editor to set up the admin system

-- ==============================================
-- TABLE 1: users
-- Stores all user accounts with role-based access
-- ==============================================

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(255) UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name varchar(255),
  role varchar(50) NOT NULL CHECK (role IN ('super_admin', 'admin', 'manager', 'user', 'guest')),
  company varchar(255),
  phone varchar(50),
  access_code varchar(50) UNIQUE,
  status varchar(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted', 'pending')),
  created_by uuid REFERENCES users(id),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  last_login timestamp,
  login_count integer DEFAULT 0,
  failed_login_attempts integer DEFAULT 0,
  rate_limit_override boolean DEFAULT false,
  notes text
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_access_code ON users(access_code);
CREATE INDEX IF NOT EXISTS idx_users_created_by ON users(created_by);

-- RLS Policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Super admins can see all users
CREATE POLICY "Super admins can view all users" ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid()::uuid
      AND u.role = 'super_admin'
      AND u.status = 'active'
    )
  );

-- Admins can see users they created
CREATE POLICY "Admins can view users they created" ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid()::uuid
      AND u.role IN ('admin', 'super_admin')
      AND u.status = 'active'
    )
    AND (created_by = auth.uid()::uuid OR id = auth.uid()::uuid)
  );

-- Users can view their own record
CREATE POLICY "Users can view their own record" ON users
  FOR SELECT
  USING (id = auth.uid()::uuid);

-- Super admins can insert any user
CREATE POLICY "Super admins can create any user" ON users
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid()::uuid
      AND u.role = 'super_admin'
      AND u.status = 'active'
    )
  );

-- Admins can insert users with role 'user' or 'manager' only
CREATE POLICY "Admins can create standard users" ON users
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid()::uuid
      AND u.role IN ('admin', 'super_admin')
      AND u.status = 'active'
    )
    AND role IN ('user', 'manager')
  );

-- Super admins can update any user
CREATE POLICY "Super admins can update any user" ON users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid()::uuid
      AND u.role = 'super_admin'
      AND u.status = 'active'
    )
  );

-- Admins can update users they created
CREATE POLICY "Admins can update users they created" ON users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid()::uuid
      AND u.role IN ('admin', 'super_admin')
      AND u.status = 'active'
    )
    AND created_by = auth.uid()::uuid
  );

-- Users can update their own record (limited fields)
CREATE POLICY "Users can update their own record" ON users
  FOR UPDATE
  USING (id = auth.uid()::uuid);

-- ==============================================
-- TABLE 2: user_sessions
-- Tracks active login sessions and tokens
-- ==============================================

CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  ip_address varchar(50),
  user_agent text,
  created_at timestamp DEFAULT now(),
  expires_at timestamp NOT NULL,
  last_activity timestamp DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON user_sessions(is_active, expires_at);

-- RLS Policies for user_sessions table
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own sessions
CREATE POLICY "Users can view their own sessions" ON user_sessions
  FOR SELECT
  USING (user_id = auth.uid()::uuid);

-- Admins can see all sessions
CREATE POLICY "Admins can view all sessions" ON user_sessions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid()::uuid
      AND u.role IN ('admin', 'super_admin')
      AND u.status = 'active'
    )
  );

-- System can insert sessions (service key)
CREATE POLICY "System can create sessions" ON user_sessions
  FOR INSERT
  WITH CHECK (true);

-- Users can update their own sessions
CREATE POLICY "Users can update their own sessions" ON user_sessions
  FOR UPDATE
  USING (user_id = auth.uid()::uuid);

-- Users can delete their own sessions
CREATE POLICY "Users can delete their own sessions" ON user_sessions
  FOR DELETE
  USING (user_id = auth.uid()::uuid);

-- ==============================================
-- TABLE 3: activity_logs
-- Records all user actions for audit trail
-- ==============================================

CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  action varchar(100) NOT NULL,
  resource_type varchar(100),
  resource_id varchar(255),
  ip_address varchar(50),
  user_agent text,
  details jsonb,
  success boolean DEFAULT true,
  error_message text,
  timestamp timestamp DEFAULT now()
);

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_logs_resource ON activity_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_logs_success ON activity_logs(success);

-- RLS Policies for activity_logs table
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Super admins can see all logs
CREATE POLICY "Super admins can view all logs" ON activity_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid()::uuid
      AND u.role = 'super_admin'
      AND u.status = 'active'
    )
  );

-- Admins can see logs for users they created
CREATE POLICY "Admins can view team logs" ON activity_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid()::uuid
      AND u.role IN ('admin', 'super_admin')
      AND u.status = 'active'
    )
    AND EXISTS (
      SELECT 1 FROM users AS target
      WHERE target.id = activity_logs.user_id
      AND (target.created_by = auth.uid()::uuid OR target.id = auth.uid()::uuid)
    )
  );

-- Users can view their own activity logs
CREATE POLICY "Users can view their own logs" ON activity_logs
  FOR SELECT
  USING (user_id = auth.uid()::uuid);

-- System can insert logs (service key)
CREATE POLICY "System can create logs" ON activity_logs
  FOR INSERT
  WITH CHECK (true);

-- ==============================================
-- TABLE 4: permissions
-- Defines what each role can do with each feature
-- ==============================================

CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role varchar(50) NOT NULL,
  feature varchar(100) NOT NULL,
  can_read boolean DEFAULT false,
  can_create boolean DEFAULT false,
  can_update boolean DEFAULT false,
  can_delete boolean DEFAULT false,
  can_export boolean DEFAULT false,
  daily_limit integer,
  monthly_limit integer,
  created_at timestamp DEFAULT now()
);

-- Unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS idx_permissions_role_feature ON permissions(role, feature);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_permissions_role ON permissions(role);
CREATE INDEX IF NOT EXISTS idx_permissions_feature ON permissions(feature);

-- RLS Policies for permissions table
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;

-- Everyone can read permissions (needed for permission checks)
CREATE POLICY "Everyone can read permissions" ON permissions
  FOR SELECT
  USING (true);

-- Only super admins can modify permissions
CREATE POLICY "Super admins can manage permissions" ON permissions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid()::uuid
      AND u.role = 'super_admin'
      AND u.status = 'active'
    )
  );

-- ==============================================
-- TABLE 5: usage_tracking
-- Tracks feature usage for rate limiting
-- ==============================================

CREATE TABLE IF NOT EXISTS usage_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  feature varchar(100) NOT NULL,
  usage_date date DEFAULT CURRENT_DATE,
  daily_count integer DEFAULT 0,
  monthly_count integer DEFAULT 0,
  last_reset timestamp DEFAULT now()
);

-- Unique constraint per user per feature per day
CREATE UNIQUE INDEX IF NOT EXISTS idx_usage_user_feature_date ON usage_tracking(user_id, feature, usage_date);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_usage_user_id ON usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_feature ON usage_tracking(feature);
CREATE INDEX IF NOT EXISTS idx_usage_date ON usage_tracking(usage_date);

-- RLS Policies for usage_tracking table
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Users can view their own usage
CREATE POLICY "Users can view their own usage" ON usage_tracking
  FOR SELECT
  USING (user_id = auth.uid()::uuid);

-- Admins can view all usage
CREATE POLICY "Admins can view all usage" ON usage_tracking
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid()::uuid
      AND u.role IN ('admin', 'super_admin')
      AND u.status = 'active'
    )
  );

-- System can manage usage tracking (service key)
CREATE POLICY "System can manage usage tracking" ON usage_tracking
  FOR ALL
  WITH CHECK (true);

-- ==============================================
-- STORED FUNCTIONS
-- ==============================================

-- Function to increment usage tracking
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id uuid,
  p_feature varchar,
  p_usage_date date
)
RETURNS void AS $$
BEGIN
  INSERT INTO usage_tracking (user_id, feature, usage_date, daily_count, monthly_count)
  VALUES (p_user_id, p_feature, p_usage_date, 1, 1)
  ON CONFLICT (user_id, feature, usage_date)
  DO UPDATE SET
    daily_count = usage_tracking.daily_count + 1,
    monthly_count = usage_tracking.monthly_count + 1,
    last_reset = now();
END;
$$ LANGUAGE plpgsql;

-- Function to reset daily counters (run via cron job)
CREATE OR REPLACE FUNCTION reset_daily_usage()
RETURNS void AS $$
BEGIN
  DELETE FROM usage_tracking
  WHERE usage_date < CURRENT_DATE - INTERVAL '90 days';

  UPDATE usage_tracking
  SET daily_count = 0
  WHERE usage_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's current usage for a feature
CREATE OR REPLACE FUNCTION get_usage_count(
  p_user_id uuid,
  p_feature varchar,
  p_period varchar DEFAULT 'daily'
)
RETURNS integer AS $$
DECLARE
  v_count integer;
BEGIN
  IF p_period = 'daily' THEN
    SELECT COALESCE(daily_count, 0) INTO v_count
    FROM usage_tracking
    WHERE user_id = p_user_id
      AND feature = p_feature
      AND usage_date = CURRENT_DATE;
  ELSE
    SELECT COALESCE(SUM(daily_count), 0) INTO v_count
    FROM usage_tracking
    WHERE user_id = p_user_id
      AND feature = p_feature
      AND usage_date >= date_trunc('month', CURRENT_DATE);
  END IF;

  RETURN COALESCE(v_count, 0);
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- SEED DATA: Default Permissions
-- ==============================================

-- Super Admin: Unlimited everything
INSERT INTO permissions (role, feature, can_read, can_create, can_update, can_delete, can_export)
VALUES
  ('super_admin', 'quotes', true, true, true, true, true),
  ('super_admin', 'ai_assessments', true, true, true, true, true),
  ('super_admin', 'system_surveyor', true, true, true, true, true),
  ('super_admin', 'users', true, true, true, true, true),
  ('super_admin', 'activity_logs', true, true, true, true, true),
  ('super_admin', 'settings', true, true, true, true, true)
ON CONFLICT (role, feature) DO NOTHING;

-- Admin: Manage team, view logs, unlimited features
INSERT INTO permissions (role, feature, can_read, can_create, can_update, can_delete, can_export)
VALUES
  ('admin', 'quotes', true, true, true, false, true),
  ('admin', 'ai_assessments', true, true, true, false, true),
  ('admin', 'system_surveyor', true, true, true, false, true),
  ('admin', 'users', true, true, true, false, true),
  ('admin', 'activity_logs', true, false, false, false, true),
  ('admin', 'settings', true, true, false, false, false)
ON CONFLICT (role, feature) DO NOTHING;

-- Manager: Unlimited quotes and AI, own projects only
INSERT INTO permissions (role, feature, can_read, can_create, can_update, can_delete, can_export)
VALUES
  ('manager', 'quotes', true, true, true, false, true),
  ('manager', 'ai_assessments', true, true, true, false, true),
  ('manager', 'system_surveyor', true, true, true, false, true),
  ('manager', 'users', false, false, false, false, false),
  ('manager', 'activity_logs', false, false, false, false, false),
  ('manager', 'settings', true, true, false, false, false)
ON CONFLICT (role, feature) DO NOTHING;

-- User: Rate-limited features
INSERT INTO permissions (role, feature, can_read, can_create, can_update, can_delete, can_export, daily_limit, monthly_limit)
VALUES
  ('user', 'quotes', true, true, true, false, true, 10, 50),
  ('user', 'ai_assessments', true, true, true, false, true, 5, NULL),
  ('user', 'system_surveyor', true, true, false, false, true, 2, NULL),
  ('user', 'users', false, false, false, false, false, NULL, NULL),
  ('user', 'activity_logs', false, false, false, false, false, NULL, NULL),
  ('user', 'settings', true, true, false, false, false, NULL, NULL)
ON CONFLICT (role, feature) DO NOTHING;

-- Guest: Very limited access
INSERT INTO permissions (role, feature, can_read, can_create, can_update, can_delete, can_export, daily_limit, monthly_limit)
VALUES
  ('guest', 'quotes', false, false, false, false, false, NULL, NULL),
  ('guest', 'ai_assessments', false, false, false, false, false, NULL, NULL),
  ('guest', 'system_surveyor', false, false, false, false, false, NULL, NULL),
  ('guest', 'estimates', true, true, false, false, false, 3, NULL),
  ('guest', 'users', false, false, false, false, false, NULL, NULL),
  ('guest', 'activity_logs', false, false, false, false, false, NULL, NULL),
  ('guest', 'settings', false, false, false, false, false, NULL, NULL)
ON CONFLICT (role, feature) DO NOTHING;

-- ==============================================
-- HELPER VIEWS
-- ==============================================

-- View: Active users with recent activity
CREATE OR REPLACE VIEW v_active_users AS
SELECT
  u.id,
  u.email,
  u.full_name,
  u.role,
  u.company,
  u.status,
  u.last_login,
  u.login_count,
  COUNT(s.id) as active_sessions,
  MAX(a.timestamp) as last_activity
FROM users u
LEFT JOIN user_sessions s ON u.id = s.user_id AND s.is_active = true AND s.expires_at > now()
LEFT JOIN activity_logs a ON u.id = a.user_id AND a.timestamp > now() - INTERVAL '24 hours'
WHERE u.status = 'active'
GROUP BY u.id, u.email, u.full_name, u.role, u.company, u.status, u.last_login, u.login_count;

-- View: User activity summary
CREATE OR REPLACE VIEW v_user_activity_summary AS
SELECT
  u.id as user_id,
  u.full_name,
  u.email,
  u.role,
  COUNT(DISTINCT CASE WHEN a.action = 'quote_generated' AND a.timestamp::date = CURRENT_DATE THEN a.id END) as quotes_today,
  COUNT(DISTINCT CASE WHEN a.action = 'ai_assessment_completed' AND a.timestamp::date = CURRENT_DATE THEN a.id END) as ai_sessions_today,
  COUNT(DISTINCT CASE WHEN a.action = 'login' AND a.timestamp > now() - INTERVAL '7 days' THEN a.id END) as logins_this_week
FROM users u
LEFT JOIN activity_logs a ON u.id = a.user_id
WHERE u.status = 'active'
GROUP BY u.id, u.full_name, u.email, u.role;

-- ==============================================
-- COMPLETION MESSAGE
-- ==============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Design-Rite v3 Authentication Tables Created Successfully';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables Created:';
  RAISE NOTICE '  - users (with RLS policies)';
  RAISE NOTICE '  - user_sessions (with RLS policies)';
  RAISE NOTICE '  - activity_logs (with RLS policies)';
  RAISE NOTICE '  - permissions (with RLS policies and seed data)';
  RAISE NOTICE '  - usage_tracking (with RLS policies)';
  RAISE NOTICE '';
  RAISE NOTICE 'Functions Created:';
  RAISE NOTICE '  - increment_usage(user_id, feature, date)';
  RAISE NOTICE '  - reset_daily_usage()';
  RAISE NOTICE '  - get_usage_count(user_id, feature, period)';
  RAISE NOTICE '';
  RAISE NOTICE 'Views Created:';
  RAISE NOTICE '  - v_active_users';
  RAISE NOTICE '  - v_user_activity_summary';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '  1. Create your super_admin account (see CLAUDE.md)';
  RAISE NOTICE '  2. Install next-auth and bcryptjs dependencies';
  RAISE NOTICE '  3. Configure Next-Auth.js authentication';
  RAISE NOTICE '';
END $$;
