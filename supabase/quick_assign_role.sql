-- Quick role assignment - find your user and assign super_admin

-- Step 1: Find your user ID
SELECT
    'Your account details:' as info,
    id,
    email,
    created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Step 2: Assign super_admin role
-- Copy your UUID from above and replace USER_UUID_HERE

INSERT INTO public.user_roles (user_id, role, created_by)
VALUES (
    'USER_UUID_HERE',  -- Replace with your UUID from Step 1
    'super_admin',
    'system'
);

-- Step 3: Verify it worked
SELECT
    u.email,
    ur.role,
    ur.created_at
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY ur.created_at DESC;
