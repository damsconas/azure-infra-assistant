@echo off
echo 🛑 Stopping Azure Infrastructure Query System...
echo.

REM Kill processes on port 3000 (Backend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Stopping Backend (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ✓ Backend stopped
    )
)

REM Kill processes on port 5173 (Frontend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    echo Stopping Frontend (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ✓ Frontend stopped
    )
)

echo.
echo ✅ Application stopped successfully!
echo.
pause