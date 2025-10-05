@echo off
REM AI Testing Workflow - Quick Setup Script

echo ========================================
echo   AI Agent Testing System - Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python not found! Please install Python 3.8+
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found! Please install Node.js
    pause
    exit /b 1
)

echo [1/4] Installing Python dependencies...
pip install openai requests
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install Python packages
    pause
    exit /b 1
)

echo.
echo [2/4] Checking OpenAI API key...
findstr /C:"OPENAI_API_KEY" ..\.env >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: OPENAI_API_KEY not found in .env file
    echo Please add: OPENAI_API_KEY=sk-your-key-here
    echo.
)

echo [3/4] Creating directories...
if not exist "issues" mkdir issues
if not exist "fixes" mkdir fixes
if not exist "final" mkdir final

echo [4/4] Verifying files...
if not exist "ai-test-agent.py" (
    echo ERROR: ai-test-agent.py not found
    pause
    exit /b 1
)
if not exist "file-watcher.js" (
    echo ERROR: file-watcher.js not found
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Ensure servers are running:
echo    - Main app: npm run dev (port 3000)
echo    - Super Agent: python -m uvicorn app.main:app --reload --port 9500
echo.
echo 2. Start file watcher:
echo    ^> node file-watcher.js
echo.
echo 3. Run tests:
echo    ^> python ai-test-agent.py
echo.
echo Read README.md for more information.
echo.
pause
