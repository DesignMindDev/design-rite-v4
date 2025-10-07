-- Assign Dan Kozich super_admin role in PRODUCTION database
-- Run this in: https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/sql/new

-- Your user ID (from console logs): 5ecb3404-d02a-4c2c-9545-cb0c9dd69216
-- Your email: dan@design-rite.com

-- Step 1: Verify your account exists in production
SELECT
    'Your production account:' as info,
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users
WHERE id = '5ecb3404-d02a-4c2c-9545-cb0c9dd69216';

-- Step 2: Check if user_roles table exists
SELECT
    'user_roles table structure:' as info,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name = 'user_roles'
ORDER BY ordinal_position;

-- Step 3: Assign super_admin role
INSERT INTO public.user_roles (user_id, role)
VALUES (
    '5ecb3404-d02a-4c2c-9545-cb0c9dd69216',
    'super_admin'
)
ON CONFLICT (user_id)
DO UPDATE SET role = 'super_admin';

-- Step 4: Verify it worked
SELECT
    u.email,
    ur.role,
    ur.created_at
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.id = '5ecb3404-d02a-4c2c-9545-cb0c9dd69216';

-- Expected result: dan@design-rite.com | super_admin | [timestamp]
