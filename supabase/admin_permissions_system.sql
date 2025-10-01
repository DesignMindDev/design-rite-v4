-- Design-Rite v3 - Granular Admin Permission System
-- Allows fine-grained control over admin features per user
-- Created: 2025-10-01
-- Run this in Supabase SQL Editor

-- ==============================================
-- TABLE: admin_permissions
-- Stores granular permissions for each user
-- ==============================================

CREATE TABLE IF NOT EXISTS admin_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,

  -- Content Management Permissions
  can_manage_team boolean DEFAULT false,           -- Team members page
  can_manage_blog boolean DEFAULT false,           -- Blog posts
  can_manage_videos boolean DEFAULT false,         -- Video content
  can_manage_settings boolean DEFAULT false,       -- Site settings (logos, etc.)

  -- User Management Permissions
  can_create_users boolean DEFAULT false,          -- Create new users
  can_edit_users boolean DEFAULT false,            -- Edit existing users
  can_delete_users boolean DEFAULT false,          -- Delete/suspend users
  can_assign_permissions boolean DEFAULT false,    -- Assign permissions to others

  -- Data & Analytics Permissions
  can_view_activity boolean DEFAULT false,         -- View activity logs
  can_export_data boolean DEFAULT false,           -- Export data/backups
  can_view_analytics boolean DEFAULT false,        -- Platform analytics

  -- System Permissions
  can_access_admin_panel boolean DEFAULT false,    -- Access /admin at all
  can_manage_integrations boolean DEFAULT false,   -- System Surveyor, etc.

  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),

  UNIQUE(user_id)
);

-- Index for fast lookups
CREATE INDEX idx_admin_permissions_user_id ON admin_permissions(user_id);

-- ==============================================
-- TABLE: admin_access_logs
-- Tracks all admin page access attempts
-- ==============================================

CREATE TABLE IF NOT EXISTS admin_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,

  -- Access Details
  path_accessed varchar(500) NOT NULL,             -- /admin/team, /admin/blog, etc.
  permission_checked varchar(100),                 -- can_manage_team, etc.
  access_allowed boolean NOT NULL,                 -- true = granted, false = denied

  -- Request Details
  ip_address varchar(50),
  user_agent text,
  method varchar(10),                              -- GET, POST, etc.

  -- Context
  details jsonb,                                   -- Additional context
  timestamp timestamp DEFAULT now()
);

-- Indexes for fast queries
CREATE INDEX idx_admin_access_logs_user_id ON admin_access_logs(user_id);
CREATE INDEX idx_admin_access_logs_timestamp ON admin_access_logs(timestamp DESC);
CREATE INDEX idx_admin_access_logs_allowed ON admin_access_logs(access_allowed);
CREATE INDEX idx_admin_access_logs_path ON admin_access_logs(path_accessed);

-- ==============================================
-- DEFAULT PERMISSIONS FOR EXISTING USERS
-- Run this after creating tables
-- ==============================================

-- Super Admin: Full access to everything
INSERT INTO admin_permissions (
  user_id,
  can_manage_team,
  can_manage_blog,
  can_manage_videos,
  can_manage_settings,
  can_create_users,
  can_edit_users,
  can_delete_users,
  can_assign_permissions,
  can_view_activity,
  can_export_data,
  can_view_analytics,
  can_access_admin_panel,
  can_manage_integrations
)
SELECT
  id,
  true, true, true, true,  -- Content management
  true, true, true, true,  -- User management
  true, true, true,        -- Data & analytics
  true, true               -- System
FROM users
WHERE role = 'super_admin'
ON CONFLICT (user_id) DO UPDATE SET
  can_manage_team = true,
  can_manage_blog = true,
  can_manage_videos = true,
  can_manage_settings = true,
  can_create_users = true,
  can_edit_users = true,
  can_delete_users = true,
  can_assign_permissions = true,
  can_view_activity = true,
  can_export_data = true,
  can_view_analytics = true,
  can_access_admin_panel = true,
  can_manage_integrations = true,
  updated_at = now();

-- Admin: Content management + limited user management
INSERT INTO admin_permissions (
  user_id,
  can_manage_team,
  can_manage_blog,
  can_manage_videos,
  can_manage_settings,
  can_create_users,
  can_edit_users,
  can_delete_users,
  can_assign_permissions,
  can_view_activity,
  can_export_data,
  can_view_analytics,
  can_access_admin_panel,
  can_manage_integrations
)
SELECT
  id,
  true, true, true, true,  -- Full content management
  true, true, false, false,  -- Can create/edit users, not delete or assign perms
  true, true, true,        -- Can view activity and export
  true, false              -- Can access admin, not integrations
FROM users
WHERE role = 'admin'
ON CONFLICT (user_id) DO UPDATE SET
  can_manage_team = true,
  can_manage_blog = true,
  can_manage_videos = true,
  can_manage_settings = true,
  can_create_users = true,
  can_edit_users = true,
  can_view_activity = true,
  can_export_data = true,
  can_view_analytics = true,
  can_access_admin_panel = true,
  updated_at = now();

-- Manager/User/Guest: No admin access by default
INSERT INTO admin_permissions (user_id, can_access_admin_panel)
SELECT id, false
FROM users
WHERE role IN ('manager', 'user', 'guest')
ON CONFLICT (user_id) DO NOTHING;

-- ==============================================
-- HELPER FUNCTIONS
-- ==============================================

-- Function to check if user has a specific permission
CREATE OR REPLACE FUNCTION check_admin_permission(
  p_user_id uuid,
  p_permission varchar
)
RETURNS boolean AS $$
DECLARE
  has_permission boolean;
BEGIN
  -- Super admins always have all permissions
  IF EXISTS (SELECT 1 FROM users WHERE id = p_user_id AND role = 'super_admin') THEN
    RETURN true;
  END IF;

  -- Check specific permission
  EXECUTE format('SELECT %I FROM admin_permissions WHERE user_id = $1', p_permission)
  INTO has_permission
  USING p_user_id;

  RETURN COALESCE(has_permission, false);
END;
$$ LANGUAGE plpgsql;

-- Function to log admin access
CREATE OR REPLACE FUNCTION log_admin_access(
  p_user_id uuid,
  p_path varchar,
  p_permission varchar,
  p_allowed boolean,
  p_ip_address varchar DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_method varchar DEFAULT 'GET',
  p_details jsonb DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO admin_access_logs (
    user_id,
    path_accessed,
    permission_checked,
    access_allowed,
    ip_address,
    user_agent,
    method,
    details
  ) VALUES (
    p_user_id,
    p_path,
    p_permission,
    p_allowed,
    p_ip_address,
    p_user_agent,
    p_method,
    p_details
  );
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================

-- Enable RLS on new tables
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_access_logs ENABLE ROW LEVEL SECURITY;

-- Admin Permissions RLS Policies
CREATE POLICY admin_permissions_super_admin_all ON admin_permissions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY admin_permissions_user_read_own ON admin_permissions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY admin_permissions_admin_read_managed ON admin_permissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u1
      WHERE u1.id = auth.uid()
      AND u1.role = 'admin'
      AND EXISTS (
        SELECT 1 FROM users u2
        WHERE u2.id = admin_permissions.user_id
        AND u2.created_by = auth.uid()
      )
    )
  );

-- Admin Access Logs RLS Policies
CREATE POLICY admin_access_logs_super_admin_all ON admin_access_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY admin_access_logs_user_read_own ON admin_access_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY admin_access_logs_admin_read_managed ON admin_access_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u1
      WHERE u1.id = auth.uid()
      AND u1.role = 'admin'
      AND EXISTS (
        SELECT 1 FROM users u2
        WHERE u2.id = admin_access_logs.user_id
        AND u2.created_by = auth.uid()
      )
    )
  );

-- ==============================================
-- VIEWS FOR EASY QUERYING
-- ==============================================

-- View: User permissions with user details
CREATE OR REPLACE VIEW v_user_permissions AS
SELECT
  u.id AS user_id,
  u.email,
  u.full_name,
  u.role,
  u.status,
  ap.can_manage_team,
  ap.can_manage_blog,
  ap.can_manage_videos,
  ap.can_manage_settings,
  ap.can_create_users,
  ap.can_edit_users,
  ap.can_delete_users,
  ap.can_assign_permissions,
  ap.can_view_activity,
  ap.can_export_data,
  ap.can_view_analytics,
  ap.can_access_admin_panel,
  ap.can_manage_integrations,
  ap.updated_at AS permissions_updated_at
FROM users u
LEFT JOIN admin_permissions ap ON u.id = ap.user_id
WHERE u.status != 'deleted';

-- View: Recent admin access attempts
CREATE OR REPLACE VIEW v_recent_admin_access AS
SELECT
  aal.id,
  aal.timestamp,
  u.email,
  u.full_name,
  u.role,
  aal.path_accessed,
  aal.permission_checked,
  aal.access_allowed,
  aal.ip_address,
  aal.method
FROM admin_access_logs aal
LEFT JOIN users u ON aal.user_id = u.id
ORDER BY aal.timestamp DESC
LIMIT 1000;

-- ==============================================
-- VERIFICATION QUERIES
-- ==============================================

-- Check permissions were created
-- SELECT COUNT(*) FROM admin_permissions;

-- View all permissions
-- SELECT * FROM v_user_permissions ORDER BY role, email;

-- Check access logs table is ready
-- SELECT COUNT(*) FROM admin_access_logs;

-- Test permission check function
-- SELECT check_admin_permission('[user_id]', 'can_manage_team');

COMMIT;
