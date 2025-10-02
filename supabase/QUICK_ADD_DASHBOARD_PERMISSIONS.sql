-- Quick add dashboard visibility permissions to existing admin_permissions table
-- Run this in Supabase SQL Editor if admin_permissions table already exists

-- Add new columns for dashboard section visibility
ALTER TABLE admin_permissions
ADD COLUMN IF NOT EXISTS can_view_revenue BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS can_view_quick_stats BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS can_view_user_list BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS can_view_recent_activity BOOLEAN DEFAULT TRUE;

-- Set defaults for existing records
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

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Dashboard visibility permissions added successfully!';
END $$;
