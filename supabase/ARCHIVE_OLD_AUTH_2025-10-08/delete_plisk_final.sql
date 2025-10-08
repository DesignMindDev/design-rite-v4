-- Simple targeted deletion for plisk@design-rite.com
-- This will work now that we know the exact blocking record

DO $$
DECLARE
    user_uuid UUID := 'b707a8c1-a298-485f-aed3-aac56bbc9880';
BEGIN
    RAISE NOTICE 'Starting deletion for plisk@design-rite.com';
    RAISE NOTICE 'User ID: %', user_uuid;

    -- Delete the identity (this is what was blocking us!)
    DELETE FROM auth.identities WHERE user_id = user_uuid;
    RAISE NOTICE '✅ Deleted identity record';

    -- Delete sessions
    DELETE FROM auth.sessions WHERE user_id = user_uuid;
    RAISE NOTICE '✅ Deleted sessions';

    -- Delete refresh tokens
    DELETE FROM auth.refresh_tokens WHERE user_id = user_uuid;
    RAISE NOTICE '✅ Deleted refresh tokens';

    -- Delete from public tables if they exist
    BEGIN
        DELETE FROM user_roles WHERE user_id = user_uuid;
        RAISE NOTICE '✅ Deleted user_roles';
    EXCEPTION WHEN undefined_table THEN NULL;
    END;

    BEGIN
        DELETE FROM activity_logs WHERE user_id = user_uuid;
        RAISE NOTICE '✅ Deleted activity_logs';
    EXCEPTION WHEN undefined_table THEN NULL;
    END;

    -- Finally delete the user
    DELETE FROM auth.users WHERE id = user_uuid;
    RAISE NOTICE '✅ Deleted user from auth.users';

    RAISE NOTICE '🎉 SUCCESS! plisk@design-rite.com has been completely deleted';

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ ERROR: %', SQLERRM;
END $$;

-- Verify deletion
SELECT
    CASE
        WHEN EXISTS (SELECT 1 FROM auth.users WHERE email = 'plisk@design-rite.com')
        THEN '❌ User still exists - something went wrong'
        ELSE '✅ User successfully deleted!'
    END as result;
