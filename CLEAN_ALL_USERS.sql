-- =====================================================
-- CLEAN ALL USERS - Fresh Start for Testing
-- Run this in Supabase SQL Editor
-- =====================================================
-- WARNING: This will delete ALL users from the database
-- Only run this in development/testing environments!
-- =====================================================

-- Step 1: Delete from dependent tables first
DELETE FROM module_permissions;
DELETE FROM user_roles;
DELETE FROM profiles;

-- Step 2: Delete all users from Supabase Auth
-- This will cascade delete sessions and other auth-related data
DELETE FROM auth.users;

-- Step 3: Verify everything is clean
SELECT 'auth.users' as table_name, COUNT(*) as count FROM auth.users
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'user_roles', COUNT(*) FROM user_roles
UNION ALL
SELECT 'module_permissions', COUNT(*) FROM module_permissions;

-- =====================================================
-- EXPECTED RESULT: All counts should be 0
-- =====================================================
-- table_name          | count
-- --------------------|-------
-- auth.users          | 0
-- profiles            | 0
-- user_roles          | 0
-- module_permissions  | 0
-- =====================================================

-- After running this, you can create fresh users via:
-- 1. Signup page: http://localhost:3000/signup
-- 2. Supabase Dashboard: Authentication → Users → Add user
-- =====================================================
