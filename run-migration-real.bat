@echo off
set DRY_RUN=false
set SEND_EMAILS=true
set NEXT_PUBLIC_SUPABASE_URL=https://ickwrbdpuorzdpzqbqpf.supabase.co
set SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlja3dyYmRwdW9yemRwenFicXBmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDk1MDc4MywiZXhwIjoyMDY2NTI2NzgzfQ.LGGTBZF3ADOZv7cW7rEGzUi_0JluWf59yw2jWLuOJHo

echo ============================================
echo User Migration - REAL RUN
echo ============================================
echo.
echo WARNING: This will update user profiles and roles
echo.
pause
echo.
npx tsx scripts/migrate-users-to-supabase-auth.ts
echo.
pause
