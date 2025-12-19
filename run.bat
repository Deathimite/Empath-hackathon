@echo off
echo ===================================================
echo     Starting Empath.ai - Mental Health Companion
echo ===================================================

echo [1/2] Starting Backend Server (Port 5001)...
start "Empath Backend" cmd /k "cd backend && python app.py"

echo [2/2] Starting Frontend Interface (Port 5173)...
start "Empath Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo     Services Launched! 🚀
echo     - Backend: http://127.0.0.1:5001
echo     - Frontend: http://localhost:5173
echo ===================================================
echo.
echo Opening App in Browser...
timeout /t 5
start http://localhost:5173
