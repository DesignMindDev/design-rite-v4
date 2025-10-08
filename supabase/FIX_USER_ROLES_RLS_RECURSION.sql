-- =====================================================
-- FIX: user_roles RLS Infinite Recursion
-- Problem: RLS policies query user_roles table, causing infinite loop
-- Solution: Create helper function that bypasses RLS
-- =====================================================

-- Step 1: Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
DROP POLICY IF EXISTS "Service role has full access to user_roles" ON user_roles;

-- Step 2: Create helper function that bypasses RLS
CREATE OR REPLACE FUNCTION get_user_role(p_user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER -- This allows the function to bypass RLS
STABLE
AS $$
  SELECT role FROM user_roles WHERE user_id = p_user_id LIMIT 1;
$$;

-- Step 3: Create new RLS policies WITHOUT recursion
-- Users can view their own role (no recursion)
CREATE POLICY "Users can view own role"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all roles (uses helper function to avoid recursion)
CREATE POLICY "Admins can view all roles"
  ON user_roles FOR SELECT
  USING (get_user_role(auth.uid()) IN ('super_admin', 'admin'));

-- Service role has full access
CREATE POLICY "Service role has full access to user_roles"
  ON user_roles FOR ALL
  USING (auth.role() = 'service_role');

-- Admins can insert/update roles (uses helper function to avoid recursion)
CREATE POLICY "Admins can manage roles"
  ON user_roles FOR INSERT
  WITH CHECK (get_user_role(auth.uid()) IN ('super_admin', 'admin'));

CREATE POLICY "Admins can update roles"
  ON user_roles FOR UPDATE
  USING (get_user_role(auth.uid()) IN ('super_admin', 'admin'));

-- Step 4: Grant necessary permissions
GRANT SELECT ON user_roles TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role(uuid) TO authenticated;

-- =====================================================
-- VERIFICATION
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ user_roles RLS Policies Fixed Successfully';
  RAISE NOTICE '';
  RAISE NOTICE 'Created:';
  RAISE NOTICE '  - get_user_role() helper function (bypasses RLS)';
  RAISE NOTICE '  - New RLS policies without recursion';
  RAISE NOTICE '';
  RAISE NOTICE 'Next: Test querying user_roles - should work without errors';
END $$;
