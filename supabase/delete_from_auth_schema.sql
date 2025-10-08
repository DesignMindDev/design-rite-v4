-- Delete user from ALL Supabase Auth internal tables
-- These are the tables that block deletion
-- Run this in Supabase SQL Editor

DO $$
DECLARE
    target_user_id UUID;
    target_email TEXT := 'plisk@design-rite.com';
    rows_deleted INTEGER;
BEGIN
    -- Get user ID
    SELECT id INTO target_user_id FROM auth.users WHERE email = target_email;

    IF target_user_id IS NULL THEN
        RAISE NOTICE 'User % not found', target_email;
        RETURN;
    END IF;

    RAISE NOTICE 'Deleting user: % (ID: %)', target_email, target_user_id;

    -- Delete from Supabase Auth internal tables (in correct order)

    -- 1. MFA factors
    DELETE FROM auth.mfa_factors WHERE user_id = target_user_id;
    GET DIAGNOSTICS rows_deleted = ROW_COUNT;
    RAISE NOTICE 'Deleted % MFA factors', rows_deleted;

    -- 2. MFA challenges
    DELETE FROM auth.mfa_challenges WHERE factor_id IN (
        SELECT id FROM auth.mfa_factors WHERE user_id = target_user_id
    );
    GET DIAGNOSTICS rows_deleted = ROW_COUNT;
    RAISE NOTICE 'Deleted % MFA challenges', rows_deleted;

    -- 3. Sessions
    DELETE FROM auth.sessions WHERE user_id = target_user_id;
    GET DIAGNOSTICS rows_deleted = ROW_COUNT;
    RAISE NOTICE 'Deleted % sessions', rows_deleted;

    -- 4. Refresh tokens
    DELETE FROM auth.refresh_tokens WHERE user_id = target_user_id;
    GET DIAGNOSTICS rows_deleted = ROW_COUNT;
    RAISE NOTICE 'Deleted % refresh tokens', rows_deleted;

    -- 5. Identities (CRITICAL - this is usually what blocks deletion)
    DELETE FROM auth.identities WHERE user_id = target_user_id;
    GET DIAGNOSTICS rows_deleted = ROW_COUNT;
    RAISE NOTICE 'Deleted % identities', rows_deleted;

    -- 6. SAML providers
    DELETE FROM auth.saml_providers WHERE id IN (
        SELECT id FROM auth.saml_relay_states WHERE sso_provider_id IN (
            SELECT id FROM auth.sso_providers WHERE id IN (
                SELECT sso_provider_id FROM auth.saml_relay_states
                WHERE flow_state_id IN (
                    SELECT id FROM auth.flow_state WHERE user_id = target_user_id
                )
            )
        )
    );

    -- 7. SSO providers
    DELETE FROM auth.sso_providers WHERE id IN (
        SELECT sso_provider_id FROM auth.saml_relay_states
        WHERE flow_state_id IN (
            SELECT id FROM auth.flow_state WHERE user_id = target_user_id
        )
    );

    -- 8. Flow state
    DELETE FROM auth.flow_state WHERE user_id = target_user_id;
    GET DIAGNOSTICS rows_deleted = ROW_COUNT;
    RAISE NOTICE 'Deleted % flow states', rows_deleted;

    -- 9. Delete from public schema tables (if they exist)
    BEGIN
        DELETE FROM user_roles WHERE user_id = target_user_id;
        GET DIAGNOSTICS rows_deleted = ROW_COUNT;
        RAISE NOTICE 'Deleted % user roles', rows_deleted;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'Table user_roles does not exist';
    END;

    BEGIN
        DELETE FROM activity_logs WHERE user_id = target_user_id;
        GET DIAGNOSTICS rows_deleted = ROW_COUNT;
        RAISE NOTICE 'Deleted % activity logs', rows_deleted;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'Table activity_logs does not exist';
    END;

    BEGIN
        DELETE FROM user_sessions WHERE user_id = target_user_id;
        GET DIAGNOSTICS rows_deleted = ROW_COUNT;
        RAISE NOTICE 'Deleted % user sessions', rows_deleted;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'Table user_sessions does not exist';
    END;

    -- 10. Finally delete the user
    DELETE FROM auth.users WHERE id = target_user_id;
    GET DIAGNOSTICS rows_deleted = ROW_COUNT;

    IF rows_deleted > 0 THEN
        RAISE NOTICE '✅ SUCCESS! User % completely deleted', target_email;
    ELSE
        RAISE NOTICE '❌ Failed to delete user from auth.users';
    END IF;

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ ERROR: %', SQLERRM;
END $$;

-- Verify deletion
SELECT
    CASE
        WHEN EXISTS (SELECT 1 FROM auth.users WHERE email = 'plisk@design-rite.com')
        THEN '❌ User still exists'
        ELSE '✅ User successfully deleted'
    END as result;
