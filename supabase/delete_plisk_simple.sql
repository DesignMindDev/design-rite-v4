-- Simple CASCADE deletion using email (no UUID needed)
-- Run this in Supabase SQL Editor

-- Delete plisk@design-rite.com and all dependencies
DO $$
DECLARE
    target_user_id UUID;
    target_email TEXT := 'plisk@design-rite.com'; -- Change this if needed
BEGIN
    -- Get the user ID from email
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = target_email;

    IF target_user_id IS NULL THEN
        RAISE NOTICE 'User % not found', target_email;
        RETURN;
    END IF;

    RAISE NOTICE 'Found user % with ID %', target_email, target_user_id;

    -- Delete from all dependent tables (in order)
    DELETE FROM usage_tracking WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted usage_tracking records';

    DELETE FROM permissions WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted permissions records';

    DELETE FROM activity_logs WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted activity_logs records';

    DELETE FROM user_sessions WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted user_sessions records';

    DELETE FROM user_roles WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted user_roles records';

    -- Finally delete from auth.users
    DELETE FROM auth.users WHERE id = target_user_id;
    RAISE NOTICE '✅ User % successfully deleted!', target_email;

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Error: %', SQLERRM;
END $$;

-- Verify deletion
SELECT email FROM auth.users
WHERE email = 'plisk@design-rite.com';
-- Should return 0 rows
