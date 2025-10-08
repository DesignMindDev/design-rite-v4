-- Add dashboard visibility permissions to admin_permissions table

-- Add new columns if they don't exist
ALTER TABLE admin_permissions
ADD COLUMN IF NOT EXISTS can_view_revenue BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS can_view_quick_stats BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS can_view_user_list BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS can_view_recent_activity BOOLEAN DEFAULT TRUE;

-- Update comment on table
COMMENT ON TABLE admin_permissions IS 'Granular permissions for admin users including dashboard section visibility';

-- Set default permissions for existing admin users
-- (New dashboard sections default to visible except revenue)
UPDATE admin_permissions
SET
  can_view_revenue = COALESCE(can_view_revenue, FALSE),
  can_view_quick_stats = COALESCE(can_view_quick_stats, TRUE),
  can_view_user_list = COALESCE(can_view_user_list, TRUE),
  can_view_recent_activity = COALESCE(can_view_recent_activity, TRUE)
WHERE can_view_revenue IS NULL
   OR can_view_quick_stats IS NULL
   OR can_view_user_list IS NULL
   OR can_view_recent_activity IS NULL;
