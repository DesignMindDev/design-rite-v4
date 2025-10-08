-- Delete both Dan and Phil cleanly by removing dependent records first
-- UUIDs from query results:
-- dan@design-rite.com: 0a88a868-b3ec-4182-a60c-d698c0b9c986
-- plisk@design-rite.com: 5440cdad-7abc-429a-a952-805434ddc9e6

-- Step 1: Delete from all public schema tables that reference users
-- (This handles foreign key constraints)

DELETE FROM public.user_roles
WHERE user_id IN (
    '0a88a868-b3ec-4182-a60c-d698c0b9c986',
    '5440cdad-7abc-429a-a952-805434ddc9e6'
);

DELETE FROM public.user_sessions
WHERE user_id IN (
    '0a88a868-b3ec-4182-a60c-d698c0b9c986',
    '5440cdad-7abc-429a-a952-805434ddc9e6'
);

DELETE FROM public.activity_logs
WHERE user_id IN (
    '0a88a868-b3ec-4182-a60c-d698c0b9c986',
    '5440cdad-7abc-429a-a952-805434ddc9e6'
);

DELETE FROM public.usage_tracking
WHERE user_id IN (
    '0a88a868-b3ec-4182-a60c-d698c0b9c986',
    '5440cdad-7abc-429a-a952-805434ddc9e6'
);

-- Step 2: Delete from auth schema tables
DELETE FROM auth.sessions
WHERE user_id IN (
    '0a88a868-b3ec-4182-a60c-d698c0b9c986',
    '5440cdad-7abc-429a-a952-805434ddc9e6'
);

DELETE FROM auth.identities
WHERE user_id IN (
    '0a88a868-b3ec-4182-a60c-d698c0b9c986',
    '5440cdad-7abc-429a-a952-805434ddc9e6'
);

-- Step 3: Finally delete from auth.users
DELETE FROM auth.users
WHERE id IN (
    '0a88a868-b3ec-4182-a60c-d698c0b9c986',
    '5440cdad-7abc-429a-a952-805434ddc9e6'
)
RETURNING id, email, deleted_at;

-- Step 4: Verify deletion
SELECT
    CASE
        WHEN (SELECT COUNT(*) FROM auth.users WHERE email IN ('dan@design-rite.com', 'plisk@design-rite.com')) = 0
        THEN '✅ Both users successfully deleted!'
        ELSE '❌ Users still exist - check error messages above'
    END as deletion_status;

-- Show remaining users
SELECT 'Remaining users in database:' as info;
SELECT id, email, created_at
FROM auth.users
ORDER BY created_at DESC;
