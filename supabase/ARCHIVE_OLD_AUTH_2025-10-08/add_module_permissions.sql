-- Module Permissions System
-- Allows super_admin to control which admin sections each user can access

-- Add module_permissions column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS module_permissions JSONB DEFAULT '{
  "operations_dashboard": false,
  "ai_management": false,
  "data_harvesting": false,
  "marketing_content": false,
  "about_us": false,
  "team_management": false,
  "logo_management": false,
  "video_management": false,
  "blog_management": false
}'::jsonb;

-- Update existing super_admin and admin users to have all permissions
UPDATE users
SET module_permissions = '{
  "operations_dashboard": true,
  "ai_management": true,
  "data_harvesting": true,
  "marketing_content": true,
  "about_us": true,
  "team_management": true,
  "logo_management": true,
  "video_management": true,
  "blog_management": true
}'::jsonb
WHERE role IN ('super_admin', 'admin');

-- Create a function to check if a user has access to a module
CREATE OR REPLACE FUNCTION has_module_permission(
  user_id UUID,
  module_name TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  permissions JSONB;
BEGIN
  -- Get user role and permissions
  SELECT role, module_permissions
  INTO user_role, permissions
  FROM users
  WHERE id = user_id;

  -- Super admins always have access to everything
  IF user_role = 'super_admin' THEN
    RETURN TRUE;
  END IF;

  -- Check if user has permission for the module
  RETURN COALESCE((permissions->module_name)::boolean, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create index for faster permission checks
CREATE INDEX IF NOT EXISTS idx_users_module_permissions ON users USING GIN (module_permissions);

-- Add comment explaining the module permissions structure
COMMENT ON COLUMN users.module_permissions IS 'JSON object with module access permissions. Keys: operations_dashboard, ai_management, data_harvesting, marketing_content, about_us, team_management, logo_management, video_management, blog_management';
