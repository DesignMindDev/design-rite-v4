-- =====================================================
-- FIX RLS TO ALLOW ANON ROLE TO READ user_roles
-- This allows login page to query roles immediately after auth
-- =====================================================

-- Drop existing policy
DROP POLICY IF EXISTS "user_roles_read_authenticated" ON user_roles;

-- Create new policy that allows both authenticated AND anon roles
-- (anon key is used during login before session is fully established)
CREATE POLICY "user_roles_read_all" ON user_roles
  FOR SELECT
  USING (true);  -- Allow anyone to read roles (not sensitive data)

-- Verify policy is active
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'user_roles';

-- Test that query works now
SELECT role, user_group
FROM user_roles
WHERE user_id = '0a88a868-b3ec-4182-a60c-d698c0b9c986';

-- =====================================================
-- EXPECTED RESULT:
-- =====================================================
-- role        | user_group
-- ------------|------------
-- super_admin | internal
-- =====================================================
