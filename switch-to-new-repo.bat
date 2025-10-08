@echo off
REM Script to switch local repo to new GitHub repo
REM Run this AFTER creating the new design-rite-v4 repo on GitHub

echo ==========================================
echo Switching to New V4 Repository
echo ==========================================
echo.

REM Show current remote
echo Current remote:
git remote -v
echo.

REM Save old remote
for /f "tokens=*" %%i in ('git remote get-url origin') do set OLD_REMOTE=%%i
echo Old remote saved: %OLD_REMOTE%
echo.

REM Ask for confirmation
set /p CONFIRM="Have you created the NEW design-rite-v4 repo on GitHub? (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo Cancelled. Create the repo first, then run this script again.
    exit /b 1
)

REM Update remote to new repo
set NEW_REMOTE=https://github.com/DesignMindDev/design-rite-v4.git
echo Updating remote to: %NEW_REMOTE%
git remote set-url origin %NEW_REMOTE%
echo Remote updated!
echo.

REM Verify
echo New remote:
git remote -v
echo.

REM Push all branches
echo Pushing all branches to new repo...
echo.

echo Pushing staging branch...
git push -u origin staging
echo Staging pushed!
echo.

echo Pushing develop branch...
git push -u origin develop
echo Develop pushed!
echo.

echo Pushing main branch...
git push -u origin main
echo Main pushed!
echo.

echo ==========================================
echo SUCCESS! All branches pushed to new repo
echo ==========================================
echo.
echo Next steps:
echo 1. Update Render staging service to use new repo
echo 2. Update Render production service to use new repo
echo 3. Verify deployments still work
echo.
echo Old repo URL (now renamed to v3): %OLD_REMOTE%
echo New repo URL: %NEW_REMOTE%
echo.
pause
