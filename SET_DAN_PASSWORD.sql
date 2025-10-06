-- =====================================================
-- MANUALLY SET PASSWORD FOR DAN
-- Run this in Supabase SQL Editor
-- =====================================================
-- This sets a test password: TestPassword123!
-- You can change it after logging in
-- =====================================================

-- Update Dan's password (Supabase will hash it automatically)
UPDATE auth.users
SET
  encrypted_password = crypt('TestPassword123!', gen_salt('bf')),
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  confirmed_at = COALESCE(confirmed_at, now()),
  updated_at = now()
WHERE email = 'dan@design-rite.com';

-- Verify the account is ready
SELECT
  email,
  email_confirmed_at IS NOT NULL as email_confirmed,
  confirmed_at IS NOT NULL as account_confirmed,
  last_sign_in_at,
  created_at
FROM auth.users
WHERE email = 'dan@design-rite.com';

-- =====================================================
-- EXPECTED RESULT:
-- =====================================================
-- email                | email_confirmed | account_confirmed | last_sign_in_at | created_at
-- ---------------------|-----------------|-------------------|-----------------|------------
-- dan@design-rite.com  | true            | true              | null or time    | timestamp
-- =====================================================

-- After running this, you can login with:
-- Email: dan@design-rite.com
-- Password: TestPassword123!
-- =====================================================
