@echo off
setlocal enabledelayedexpansion

echo ╔═══════════════════════════════════════════════════════╗
echo ║   Azure Infrastructure Query System - Quick Start   ║
echo ╚═══════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js found: %NODE_VERSION%
echo.

REM Start backend
echo 🔧 Starting Backend Server...
cd backend

if not exist "node_modules" (
    echo 📦 Installing backend dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install backend dependencies
        cd ..
        pause
        exit /b 1
    )
)

REM Check if port 3000 is in use
netstat -ano | findstr :3000 | findstr LISTENING >nul
if %ERRORLEVEL% EQU 0 (
    echo ⚠️  Port 3000 is already in use. Please stop the existing process.
    cd ..
    pause
    exit /b 1
)

REM Start backend in new window
start "Azure Infrastructure Backend" cmd /k "npm start"
echo ✓ Backend started on http://localhost:3000
echo   Check the Backend window for logs

REM Wait for backend to be ready
echo ⏳ Waiting for backend to be ready...
timeout /t 3 /nobreak >nul

REM Start frontend
cd ..\frontend
echo.
echo 🎨 Starting Frontend...

if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install frontend dependencies
        cd ..
        pause
        exit /b 1
    )
)

REM Check if port 5173 is in use
netstat -ano | findstr :5173 | findstr LISTENING >nul
if %ERRORLEVEL% EQU 0 (
    echo ⚠️  Port 5173 is already in use. Please stop the existing process.
    cd ..
    pause
    exit /b 1
)

REM Start frontend in new window
start "Azure Infrastructure Frontend" cmd /k "npm run dev"
echo ✓ Frontend started on http://localhost:5173
echo   Check the Frontend window for logs

cd ..

echo.
echo ╔═══════════════════════════════════════════════════════╗
echo ║              🎉 Application is Running! 🎉           ║
echo ╚═══════════════════════════════════════════════════════╝
echo.
echo 🌐 Open your browser: http://localhost:5173
echo 📊 Backend API:       http://localhost:3000/health
echo.
echo 💡 To stop the application: Close the Backend and Frontend windows
echo    or run stop.bat
echo.
echo ✨ Happy querying!
echo.
pause