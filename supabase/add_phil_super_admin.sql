-- Add Phil Lisk as super_admin after his account is created

-- Step 1: Verify Phil's account exists and get his UUID
SELECT
    'Phil Lisk account:' as info,
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users
WHERE email = 'plisk@design-rite.com';

-- If Phil's account doesn't exist yet, create it via Supabase Dashboard first:
-- https://supabase.com/dashboard/project/ickwrbdpuorzdpzqbqpf/auth/users
-- Email: plisk@design-rite.com
-- Password: (Phil will change on first login)
-- ✅ Auto Confirm User

-- Step 2: Assign super_admin role to Phil
-- Replace PHIL_UUID_HERE with the UUID from Step 1
INSERT INTO public.user_roles (user_id, role, created_by)
VALUES (
    'PHIL_UUID_HERE',  -- Replace with Phil's UUID from Step 1
    'super_admin',
    'system'
);

-- Step 3: Verify both super admins exist
SELECT
    u.email,
    ur.role,
    ur.created_at
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'super_admin'
ORDER BY u.email;

-- Expected result: Dan and Phil both with super_admin role
