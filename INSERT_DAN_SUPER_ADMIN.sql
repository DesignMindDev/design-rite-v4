-- =====================================================
-- INSERT SUPER ADMIN ROLE FOR DAN
-- =====================================================

-- Insert super_admin role
INSERT INTO user_roles (user_id, role, user_group)
VALUES (
  '0a88a868-b3ec-4182-a60c-d698c0b9c986',
  'super_admin',
  'internal'
)
ON CONFLICT (user_id) DO UPDATE SET
  role = 'super_admin',
  user_group = 'internal';

-- Insert profile
INSERT INTO profiles (id, email, full_name, company, department, job_title)
VALUES (
  '0a88a868-b3ec-4182-a60c-d698c0b9c986',
  'dan@design-rite.com',
  'Dan Kozich',
  'Design-Rite',
  'Leadership',
  'CEO / Founder'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = 'Dan Kozich',
  company = 'Design-Rite',
  department = 'Leadership',
  job_title = 'CEO / Founder';

-- Insert ALL module permissions
INSERT INTO module_permissions (
  user_id,
  operations_dashboard, analytics,
  ai_providers, ai_assistant_config, chatbot_config,
  product_harvester,
  team_management, creative_studio, spatial_studio,
  logo_management, video_management, blog_management,
  subscriptions, demo_dashboard, testing_dashboard,
  about_us_management,
  user_management, permissions_management, activity_logs
)
VALUES (
  '0a88a868-b3ec-4182-a60c-d698c0b9c986',
  true, true,
  true, true, true,
  true,
  true, true, true, true, true, true,
  true, true, true,
  true,
  true, true, true
)
ON CONFLICT (user_id) DO UPDATE SET
  operations_dashboard = true, analytics = true,
  ai_providers = true, ai_assistant_config = true, chatbot_config = true,
  product_harvester = true,
  team_management = true, creative_studio = true, spatial_studio = true,
  logo_management = true, video_management = true, blog_management = true,
  subscriptions = true, demo_dashboard = true, testing_dashboard = true,
  about_us_management = true,
  user_management = true, permissions_management = true, activity_logs = true;

-- Verify
SELECT
  ur.role,
  ur.user_group,
  p.full_name,
  mp.user_management
FROM user_roles ur
LEFT JOIN profiles p ON p.id = ur.user_id
LEFT JOIN module_permissions mp ON mp.user_id = ur.user_id
WHERE ur.user_id = '0a88a868-b3ec-4182-a60c-d698c0b9c986';

-- =====================================================
-- EXPECTED RESULT:
-- =====================================================
-- role        | user_group | full_name  | user_management
-- ------------|------------|------------|----------------
-- super_admin | internal   | Dan Kozich | true
-- =====================================================
