@echo off
echo Starting VIET Admin Panel...
echo.

echo Step 1: Starting Backend Server...
cd server
start "VIET Backend Server" cmd /k "npm start"
timeout /t 3 /nobreak >nul

echo.
echo Step 2: Starting Frontend Server...
cd ..
start "VIET Frontend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo Admin Panel Starting...
echo ========================================
echo Backend: http://localhost:3001
echo Frontend: Check the terminal for the actual port (usually 8080, 8081, or 8082)
echo Admin Login: http://localhost:8081/admin/login (or 8082 if that's what's shown)
echo.
echo Default Credentials:
echo Username: admin
echo Password: admin123
echo.
echo Press any key to exit...
pause >nul

