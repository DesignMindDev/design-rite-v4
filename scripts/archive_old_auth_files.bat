@echo off
REM =====================================================
REM Archive Old Auth SQL Files - Clean Repo
REM Moves old auth files to ARCHIVE folder instead of deleting
REM =====================================================

echo.
echo =====================================================
echo ARCHIVING OLD AUTH SQL FILES
echo =====================================================
echo.

REM Create archive directory
set ARCHIVE_DIR=C:\Users\dkozi\Projects\design-rite-v4\supabase\ARCHIVE_OLD_AUTH_2025-10-08
if not exist "%ARCHIVE_DIR%" mkdir "%ARCHIVE_DIR%"

echo Created archive directory: %ARCHIVE_DIR%
echo.
echo Moving files...
echo.

REM Move auth-related SQL files to archive
move "C:\Users\dkozi\Projects\design-rite-v4\supabase\auth_tables.sql" "%ARCHIVE_DIR%\" 2>nul && echo   ✓ auth_tables.sql
move "C:\Users\dkozi\Projects\design-rite-v4\supabase\auth_tables_safe.sql" "%ARCHIVE_DIR%\" 2>nul && echo   ✓ auth_tables_safe.sql
move "C:\Users\dkozi\Projects\design-rite-v4\supabase\admin_permissions_system.sql" "%ARCHIVE_DIR%\" 2>nul && echo   ✓ admin_permissions_system.sql

REM Move all delete diagnostic files
move "C:\Users\dkozi\Projects\design-rite-v4\supabase\delete_*.sql" "%ARCHIVE_DIR%\" 2>nul && echo   ✓ delete_*.sql files
move "C:\Users\dkozi\Projects\design-rite-v4\supabase\diagnose_*.sql" "%ARCHIVE_DIR%\" 2>nul && echo   ✓ diagnose_*.sql files
move "C:\Users\dkozi\Projects\design-rite-v4\supabase\check_*.sql" "%ARCHIVE_DIR%\" 2>nul && echo   ✓ check_*.sql files
move "C:\Users\dkozi\Projects\design-rite-v4\supabase\find_*.sql" "%ARCHIVE_DIR%\" 2>nul && echo   ✓ find_*.sql files
move "C:\Users\dkozi\Projects\design-rite-v4\supabase\force_*.sql" "%ARCHIVE_DIR%\" 2>nul && echo   ✓ force_*.sql files

REM Move user creation files
move "C:\Users\dkozi\Projects\design-rite-v4\supabase\create_test_users*.sql" "%ARCHIVE_DIR%\" 2>nul && echo   ✓ create_test_users*.sql
move "C:\Users\dkozi\Projects\design-rite-v4\supabase\CREATE_TEST_ACCOUNTS.sql" "%ARCHIVE_DIR%\" 2>nul && echo   ✓ CREATE_TEST_ACCOUNTS.sql
move "C:\Users\dkozi\Projects\design-rite-v4\supabase\add_phil_super_admin.sql" "%ARCHIVE_DIR%\" 2>nul && echo   ✓ add_phil_super_admin.sql
move "C:\Users\dkozi\Projects\design-rite-v4\supabase\assign_*.sql" "%ARCHIVE_DIR%\" 2>nul && echo   ✓ assign_*.sql files
move "C:\Users\dkozi\Projects\design-rite-v4\supabase\quick_assign_role.sql" "%ARCHIVE_DIR%\" 2>nul && echo   ✓ quick_assign_role.sql
move "C:\Users\dkozi\Projects\design-rite-v4\supabase\show_all_users.sql" "%ARCHIVE_DIR%\" 2>nul && echo   ✓ show_all_users.sql
move "C:\Users\dkozi\Projects\design-rite-v4\supabase\verify_current_state.sql" "%ARCHIVE_DIR%\" 2>nul && echo   ✓ verify_current_state.sql

REM Move old migration files
move "C:\Users\dkozi\Projects\design-rite-v4\supabase\migrations\001_unified_auth_schema.sql" "%ARCHIVE_DIR%\" 2>nul && echo   ✓ migrations/001_unified_auth_schema.sql
move "C:\Users\dkozi\Projects\design-rite-v4\supabase\migrations\SUPABASE_AUTH_001_unify_schema.sql" "%ARCHIVE_DIR%\" 2>nul && echo   ✓ migrations/SUPABASE_AUTH_001_unify_schema.sql
move "C:\Users\dkozi\Projects\design-rite-v4\supabase\migrations\add_module_permissions.sql" "%ARCHIVE_DIR%\" 2>nul && echo   ✓ migrations/add_module_permissions.sql
move "C:\Users\dkozi\Projects\design-rite-v4\supabase\migrations\add_dashboard_permissions.sql" "%ARCHIVE_DIR%\" 2>nul && echo   ✓ migrations/add_dashboard_permissions.sql

REM Move platform migration files
move "C:\Users\dkozi\Projects\design-rite-v4\supabase\COMPLETE_PLATFORM_MIGRATION*.sql" "%ARCHIVE_DIR%\" 2>nul && echo   ✓ COMPLETE_PLATFORM_MIGRATION*.sql files
move "C:\Users\dkozi\Projects\design-rite-v4\supabase\QUICK_ADD_DASHBOARD_PERMISSIONS.sql" "%ARCHIVE_DIR%\" 2>nul && echo   ✓ QUICK_ADD_DASHBOARD_PERMISSIONS.sql

echo.
echo =====================================================
echo ✅ ARCHIVE COMPLETE
echo =====================================================
echo.
echo All old auth files moved to:
echo %ARCHIVE_DIR%
echo.
echo Files can be recovered if needed.
echo.
pause
