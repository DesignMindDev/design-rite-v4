-- Show ALL users currently in auth.users
SELECT
    id,
    email,
    created_at,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC;

-- Show ALL user_roles entries
SELECT
    ur.user_id,
    u.email,
    ur.role,
    ur.created_at,
    ur.created_by
FROM public.user_roles ur
LEFT JOIN auth.users u ON ur.user_id = u.id
ORDER BY ur.created_at DESC;

-- Find Phil's actual user ID and email
SELECT
    'Phil Lisk records' as search_results,
    id,
    email,
    created_at
FROM auth.users
WHERE email ILIKE '%plisk%' OR email ILIKE '%phil%'
UNION ALL
SELECT
    'Dan Kozich records',
    id,
    email,
    created_at
FROM auth.users
WHERE email ILIKE '%dan%' OR email ILIKE '%kozich%'
ORDER BY email;
