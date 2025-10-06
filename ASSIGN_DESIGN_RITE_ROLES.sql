-- =====================================================
-- ASSIGN ROLES TO DESIGN-RITE TEAM
-- Run this AFTER creating user accounts in Supabase Auth
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
-- Verify setup
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
