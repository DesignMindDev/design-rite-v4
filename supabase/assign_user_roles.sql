-- Assign user roles after creating accounts via Supabase Dashboard
-- Run this AFTER you've created users via Dashboard UI

-- Step 1: Get user IDs for the accounts you just created
SELECT
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- Copy the UUIDs from above, then run Step 2

-- Step 2: Assign roles to specific users
-- Replace the UUIDs below with actual values from Step 1

-- Phil Lisk - Super Admin
INSERT INTO public.user_roles (user_id, role, created_by)
VALUES (
    'PHIL_UUID_HERE',  -- Replace with Phil's actual UUID
    'super_admin',
    'system'
);

-- Dan Kozich - Super Admin
INSERT INTO public.user_roles (user_id, role, created_by)
VALUES (
    'DAN_UUID_HERE',   -- Replace with Dan's actual UUID
    'super_admin',
    'system'
);

-- Test User 1 - Standard User
INSERT INTO public.user_roles (user_id, role, created_by)
VALUES (
    'TEST1_UUID_HERE', -- Replace with test1's actual UUID
    'user',
    'system'
);

-- Test User 2 - Manager
INSERT INTO public.user_roles (user_id, role, created_by)
VALUES (
    'TEST2_UUID_HERE', -- Replace with test2's actual UUID
    'manager',
    'system'
);

-- Test User 3 - Admin
INSERT INTO public.user_roles (user_id, role, created_by)
VALUES (
    'TEST3_UUID_HERE', -- Replace with test3's actual UUID
    'admin',
    'system'
);

-- Step 3: Verify role assignments
SELECT
    u.email,
    ur.role,
    ur.created_at,
    ur.created_by
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY u.email;

-- ============================================
-- ROLE TYPES AVAILABLE:
-- ============================================
-- 'super_admin'  - Full platform control (you and Phil)
-- 'admin'        - Manage standard users, team activity logs
-- 'manager'      - Unlimited quotes/assessments, own projects only
-- 'user'         - Rate limited (10 quotes/day, 50/month, 5 AI assessments/day)
-- 'guest'        - Not used in database (handled by IP tracking)
