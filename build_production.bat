@echo off
echo ========================================
echo MindfulChat - Production Build
echo ========================================
echo.

echo [1/3] Building Frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed
    pause
    exit /b 1
)

echo.
echo [2/3] Testing Backend...
cd backend
python -c "import app; print('Backend imports OK')"
if %errorlevel% neq 0 (
    echo ERROR: Backend has import errors
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [3/3] Build Complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Deploy frontend: vercel --prod
echo 2. Deploy backend: cd backend && railway up
echo 3. See PRODUCTION_GUIDE.md for details
echo ========================================
echo.
pause
