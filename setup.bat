@echo off
echo ========================================
echo MindfulChat - Setup Script
echo ========================================
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo [2/4] Installing Frontend Dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo   1. Run: start_backend.bat
echo   2. Run: start_frontend.bat
echo.
pause
