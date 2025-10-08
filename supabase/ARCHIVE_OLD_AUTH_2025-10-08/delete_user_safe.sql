-- Safe CASCADE deletion that handles missing tables
-- Run this in Supabase SQL Editor

DO $$
DECLARE
    target_user_id UUID;
    target_email TEXT := 'plisk@design-rite.com';
    rows_deleted INTEGER;
BEGIN
    -- Get the user ID
    SELECT id INTO target_user_id FROM auth.users WHERE email = target_email;

    IF target_user_id IS NULL THEN
        RAISE NOTICE '❌ User % not found', target_email;
        RETURN;
    END IF;

    RAISE NOTICE '✓ Found user % with ID %', target_email, target_user_id;

    -- Delete from each table, handling if table doesn't exist
    BEGIN
        DELETE FROM usage_tracking WHERE user_id = target_user_id;
        GET DIAGNOSTICS rows_deleted = ROW_COUNT;
        RAISE NOTICE '✓ Deleted % rows from usage_tracking', rows_deleted;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE '- Table usage_tracking does not exist';
    END;

    BEGIN
        DELETE FROM permissions WHERE user_id = target_user_id;
        GET DIAGNOSTICS rows_deleted = ROW_COUNT;
        RAISE NOTICE '✓ Deleted % rows from permissions', rows_deleted;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE '- Table permissions does not exist';
    END;

    BEGIN
        DELETE FROM activity_logs WHERE user_id = target_user_id;
        GET DIAGNOSTICS rows_deleted = ROW_COUNT;
        RAISE NOTICE '✓ Deleted % rows from activity_logs', rows_deleted;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE '- Table activity_logs does not exist';
    END;

    BEGIN
        DELETE FROM user_sessions WHERE user_id = target_user_id;
        GET DIAGNOSTICS rows_deleted = ROW_COUNT;
        RAISE NOTICE '✓ Deleted % rows from user_sessions', rows_deleted;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE '- Table user_sessions does not exist';
    END;

    BEGIN
        DELETE FROM user_roles WHERE user_id = target_user_id;
        GET DIAGNOSTICS rows_deleted = ROW_COUNT;
        RAISE NOTICE '✓ Deleted % rows from user_roles', rows_deleted;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE '- Table user_roles does not exist';
    END;

    -- Delete from auth.users (this should always work)
    DELETE FROM auth.users WHERE id = target_user_id;
    GET DIAGNOSTICS rows_deleted = ROW_COUNT;

    IF rows_deleted > 0 THEN
        RAISE NOTICE '✅ SUCCESS! User % deleted', target_email;
    ELSE
        RAISE NOTICE '❌ FAILED to delete user from auth.users';
    END IF;

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ ERROR: %', SQLERRM;
    RAISE NOTICE 'Error Detail: %', SQLSTATE;
END $$;

-- Verify
SELECT 'User still exists!' as status, email FROM auth.users WHERE email = 'plisk@design-rite.com'
UNION ALL
SELECT 'User deleted successfully!' as status, NULL WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'plisk@design-rite.com');
