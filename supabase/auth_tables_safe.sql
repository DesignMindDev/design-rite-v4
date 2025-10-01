-- Design-Rite v3 - Admin Authentication & User Management System
-- SAFE Migration: Drops existing conflicting tables first
-- Created: 2025-10-01
-- Run this in Supabase SQL Editor to set up the admin system

-- ==============================================
-- SAFETY: Drop existing tables if they exist
-- WARNING: This will delete all existing user data!
-- ==============================================

DO $$
BEGIN
  RAISE NOTICE '⚠️  WARNING: This will drop existing users table if it exists';
  RAISE NOTICE 'Dropping existing tables...';
END $$;

-- Drop existing tables in correct order (due to foreign key constraints)
DROP TABLE IF EXISTS usage_tracking CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing views
DROP VIEW IF EXISTS v_active_users CASCADE;
DROP VIEW IF EXISTS v_user_activity_summary CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS increment_usage CASCADE;
DROP FUNCTION IF EXISTS reset_daily_usage CASCADE;
DROP FUNCTION IF EXISTS get_usage_count CASCADE;

-- ==============================================
-- TABLE 1: users
-- Stores all user accounts with role-based access
-- ==============================================

CREATE TABLE users (
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
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_access_code ON users(access_code);
CREATE INDEX idx_users_created_by ON users(created_by);

-- RLS Policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow service role to bypass RLS (needed for Next-Auth)
CREATE POLICY "Service role can manage all users" ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Super admins can see all users
CREATE POLICY "Super admins can view all users" ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid()
      AND u.role = 'super_admin'
      AND u.status = 'active'
    )
  );

-- Users can view their own record
CREATE POLICY "Users can view their own record" ON users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- ==============================================
-- TABLE 2: user_sessions
-- Tracks active login sessions and tokens
-- ==============================================

CREATE TABLE user_sessions (
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
CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);
CREATE INDEX idx_sessions_active ON user_sessions(is_active, expires_at);

-- RLS Policies for user_sessions table
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Service role can manage all sessions
CREATE POLICY "Service role can manage all sessions" ON user_sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Users can only see their own sessions
CREATE POLICY "Users can view their own sessions" ON user_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ==============================================
-- TABLE 3: activity_logs
-- Records all user actions for audit trail
-- ==============================================

CREATE TABLE activity_logs (
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
CREATE INDEX idx_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_logs_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX idx_logs_action ON activity_logs(action);
CREATE INDEX idx_logs_resource ON activity_logs(resource_type, resource_id);
CREATE INDEX idx_logs_success ON activity_logs(success);

-- RLS Policies for activity_logs table
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Service role can manage all logs
CREATE POLICY "Service role can manage all logs" ON activity_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Super admins can see all logs
CREATE POLICY "Super admins can view all logs" ON activity_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid()
      AND u.role = 'super_admin'
      AND u.status = 'active'
    )
  );

-- Users can view their own activity logs
CREATE POLICY "Users can view their own logs" ON activity_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ==============================================
-- TABLE 4: permissions
-- Defines what each role can do with each feature
-- ==============================================

CREATE TABLE permissions (
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
CREATE UNIQUE INDEX idx_permissions_role_feature ON permissions(role, feature);

-- Indexes
CREATE INDEX idx_permissions_role ON permissions(role);
CREATE INDEX idx_permissions_feature ON permissions(feature);

-- RLS Policies for permissions table
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;

-- Everyone can read permissions (needed for permission checks)
CREATE POLICY "Everyone can read permissions" ON permissions
  FOR SELECT
  USING (true);

-- Service role can manage permissions
CREATE POLICY "Service role can manage permissions" ON permissions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ==============================================
-- TABLE 5: usage_tracking
-- Tracks feature usage for rate limiting
-- ==============================================

CREATE TABLE usage_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  feature varchar(100) NOT NULL,
  usage_date date DEFAULT CURRENT_DATE,
  daily_count integer DEFAULT 0,
  monthly_count integer DEFAULT 0,
  last_reset timestamp DEFAULT now()
);

-- Unique constraint per user per feature per day
CREATE UNIQUE INDEX idx_usage_user_feature_date ON usage_tracking(user_id, feature, usage_date);

-- Indexes
CREATE INDEX idx_usage_user_id ON usage_tracking(user_id);
CREATE INDEX idx_usage_feature ON usage_tracking(feature);
CREATE INDEX idx_usage_date ON usage_tracking(usage_date);

-- RLS Policies for usage_tracking table
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Service role can manage all usage
CREATE POLICY "Service role can manage all usage" ON usage_tracking
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Users can view their own usage
CREATE POLICY "Users can view their own usage" ON usage_tracking
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

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
  ('super_admin', 'settings', true, true, true, true, true);

-- Admin: Manage team, view logs, unlimited features
INSERT INTO permissions (role, feature, can_read, can_create, can_update, can_delete, can_export)
VALUES
  ('admin', 'quotes', true, true, true, false, true),
  ('admin', 'ai_assessments', true, true, true, false, true),
  ('admin', 'system_surveyor', true, true, true, false, true),
  ('admin', 'users', true, true, true, false, true),
  ('admin', 'activity_logs', true, false, false, false, true),
  ('admin', 'settings', true, true, false, false, false);

-- Manager: Unlimited quotes and AI, own projects only
INSERT INTO permissions (role, feature, can_read, can_create, can_update, can_delete, can_export)
VALUES
  ('manager', 'quotes', true, true, true, false, true),
  ('manager', 'ai_assessments', true, true, true, false, true),
  ('manager', 'system_surveyor', true, true, true, false, true),
  ('manager', 'users', false, false, false, false, false),
  ('manager', 'activity_logs', false, false, false, false, false),
  ('manager', 'settings', true, true, false, false, false);

-- User: Rate-limited features
INSERT INTO permissions (role, feature, can_read, can_create, can_update, can_delete, can_export, daily_limit, monthly_limit)
VALUES
  ('user', 'quotes', true, true, true, false, true, 10, 50),
  ('user', 'ai_assessments', true, true, true, false, true, 5, NULL),
  ('user', 'system_surveyor', true, true, false, false, true, 2, NULL),
  ('user', 'users', false, false, false, false, false, NULL, NULL),
  ('user', 'activity_logs', false, false, false, false, false, NULL, NULL),
  ('user', 'settings', true, true, false, false, false, NULL, NULL);

-- Guest: Very limited access
INSERT INTO permissions (role, feature, can_read, can_create, can_update, can_delete, can_export, daily_limit, monthly_limit)
VALUES
  ('guest', 'quotes', false, false, false, false, false, NULL, NULL),
  ('guest', 'ai_assessments', false, false, false, false, false, NULL, NULL),
  ('guest', 'system_surveyor', false, false, false, false, false, NULL, NULL),
  ('guest', 'estimates', true, true, false, false, false, 3, NULL),
  ('guest', 'users', false, false, false, false, false, NULL, NULL),
  ('guest', 'activity_logs', false, false, false, false, false, NULL, NULL),
  ('guest', 'settings', false, false, false, false, false, NULL, NULL);

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
  RAISE NOTICE 'Next Step: Run create-admin-simple.mjs to create your admin account';
  RAISE NOTICE '';
END $$;
