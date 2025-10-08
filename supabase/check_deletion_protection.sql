-- Check what's protecting Dan and Phil from deletion

-- Check user_roles for special flags
SELECT
    'user_roles table' as source,
    u.email,
    ur.role,
    ur.created_at,
    ur.created_by,
    -- Look for any protection flags
    ur.*
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email IN ('dan@design-rite.com', 'plisk@design-rite.com', 'dkozich@design-rite.com')
ORDER BY u.email;

-- Check if there's a permissions table with deletion restrictions
SELECT
    'permissions table' as source,
    *
FROM public.permissions
WHERE role IN (
    SELECT role FROM public.user_roles ur
    JOIN auth.users u ON ur.user_id = u.id
    WHERE u.email IN ('dan@design-rite.com', 'plisk@design-rite.com', 'dkozich@design-rite.com')
)
ORDER BY role;

-- Check for any triggers on auth.users that might check user_roles
SELECT
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
    AND event_object_table = 'users'
    AND event_manipulation = 'DELETE'
ORDER BY action_timing, trigger_name;

-- Check for RLS policies that might restrict deletion by role
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual as policy_condition
FROM pg_policies
WHERE schemaname = 'auth'
    AND tablename = 'users'
    AND cmd IN ('DELETE', 'ALL')
ORDER BY policyname;

-- Check auth.users raw_app_meta_data for protection flags
SELECT
    'auth.users metadata' as source,
    email,
    raw_app_meta_data,
    raw_user_meta_data
FROM auth.users
WHERE email IN ('dan@design-rite.com', 'plisk@design-rite.com', 'dkozich@design-rite.com')
ORDER BY email;
