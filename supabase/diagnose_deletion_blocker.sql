-- Diagnose EXACTLY what's blocking plisk deletion
-- Run this to see the specific error

-- Step 1: Find the user and their data
SELECT
    'User Info' as section,
    id,
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at
FROM auth.users
WHERE email = 'plisk@design-rite.com';

-- Step 2: Check auth.identities (MOST COMMON BLOCKER)
SELECT
    'auth.identities' as section,
    id,
    user_id,
    identity_data,
    provider,
    created_at
FROM auth.identities
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'plisk@design-rite.com');

-- Step 3: Try to delete JUST from auth.identities
-- This will show us the exact error
DO $$
DECLARE
    target_user_id UUID;
BEGIN
    SELECT id INTO target_user_id FROM auth.users WHERE email = 'plisk@design-rite.com';

    RAISE NOTICE 'Attempting to delete identities for user: %', target_user_id;

    DELETE FROM auth.identities WHERE user_id = target_user_id;

    RAISE NOTICE '✅ Deleted identities successfully';

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ ERROR deleting identities: %', SQLERRM;
    RAISE NOTICE 'Error code: %', SQLSTATE;
END $$;

-- Step 4: Check what's still blocking us
SELECT
    tc.table_schema,
    tc.table_name,
    kcu.column_name,
    'Has foreign key to auth.users' as issue
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.referential_constraints rc
    ON tc.constraint_name = rc.constraint_name
JOIN information_schema.constraint_column_usage ccu
    ON rc.unique_constraint_name = ccu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND ccu.table_name = 'users'
    AND ccu.table_schema = 'auth';
