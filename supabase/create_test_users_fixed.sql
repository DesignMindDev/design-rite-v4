-- Create Test Users for Staging Environment - FIXED VERSION
-- Run this in Supabase SQL Editor for project: ickwrbdpuorzdpzqbqpf
-- All passwords: TestPassword123!

-- ==============================================
-- DELETE EXISTING TEST USERS (if any)
-- ==============================================

DELETE FROM auth.users
WHERE email IN (
  'dan@design-rite.com',
  'test1@design-rite.com',
  'test2@design-rite.com',
  'test3@design-rite.com'
);

-- ==============================================
-- CREATE SUPABASE AUTH USERS WITH ALL REQUIRED FIELDS
-- ==============================================

-- Insert Dan Kozich (you)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'dan@design-rite.com',
  crypt('TestPassword123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Dan Kozich"}',
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);

-- Insert test1@design-rite.com
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'test1@design-rite.com',
  crypt('TestPassword123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Test User 1"}',
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);

-- Insert test2@design-rite.com
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'test2@design-rite.com',
  crypt('TestPassword123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Test User 2"}',
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);

-- Insert test3@design-rite.com
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'test3@design-rite.com',
  crypt('TestPassword123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Test User 3"}',
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);

-- ==============================================
-- VERIFICATION
-- ==============================================

-- Show all auth users
SELECT
  id,
  email,
  email_confirmed_at,
  created_at,
  raw_user_meta_data->>'full_name' as full_name,
  email_change,
  confirmation_token
FROM auth.users
WHERE email LIKE '%@design-rite.com'
ORDER BY created_at DESC;

-- ==============================================
-- SUCCESS MESSAGE
-- ==============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Test Users Created Successfully';
  RAISE NOTICE '';
  RAISE NOTICE 'Login Credentials:';
  RAISE NOTICE '  - dan@design-rite.com / TestPassword123!';
  RAISE NOTICE '  - test1@design-rite.com / TestPassword123!';
  RAISE NOTICE '  - test2@design-rite.com / TestPassword123!';
  RAISE NOTICE '  - test3@design-rite.com / TestPassword123!';
  RAISE NOTICE '';
  RAISE NOTICE 'All accounts are email-verified and ready to use!';
  RAISE NOTICE '';
  RAISE NOTICE 'Test login at: https://cak-end.onrender.com/login';
END $$;
