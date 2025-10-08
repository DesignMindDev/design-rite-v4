@echo off
REM Check Render deployment status for staging
REM Usage: check-render-deploy.bat

echo Checking Render deployment status...
echo.

curl -s -H "Authorization: Bearer rnd_RXJST45Fkvff4PsRoym6WturD17c" https://api.render.com/v1/services/srv-d3hvbnjuibrs73b8hvs0/deploys?limit=1 | findstr "status"

echo.
echo Full deployment details:
curl -s -H "Authorization: Bearer rnd_RXJST45Fkvff4PsRoym6WturD17c" https://api.render.com/v1/services/srv-d3hvbnjuibrs73b8hvs0/deploys?limit=1

echo.
echo Dashboard: https://dashboard.render.com/web/srv-d3hvbnjuibrs73b8hvs0
echo Live Site: https://cak-end.onrender.com
