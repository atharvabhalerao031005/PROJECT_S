@echo off
setlocal enabledelayedexpansion

title Multimodal Attendance & Engagement Telemetry
color 0F

echo ===============================================================================
echo     Multimodal Attendance & Engagement Telemetry - Unified Launcher
echo               Slow Morning Editorial Telemetry Platform
echo ===============================================================================
echo.

REM 1. Check Python installation
python --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Python is not installed or not in your system PATH.
    echo Please install Python 3.11+ from https://www.python.org/downloads/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('python --version') do set PYTHON_VER=%%i
echo [*] Detected %PYTHON_VER%

REM 2. Check Node.js and NPM installation
call npm.cmd --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Node.js / NPM not found via npm.cmd. Checking npm...
    call npm --version >nul 2>&1
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Node.js is not installed or not in your system PATH.
        echo Please install Node.js 18+ from https://nodejs.org/
        pause
        exit /b 1
    )
)
echo [*] Detected Node.js and NPM

REM 3. Virtual Environment Setup
set VENV_DIR=.venv
if not exist "%VENV_DIR%\Scripts\activate.bat" (
    echo [*] Virtual environment not found. Creating isolated environment in %VENV_DIR%...
    python -m venv %VENV_DIR%
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
    echo [*] Virtual environment created successfully.
)

echo [*] Activating virtual environment...
call "%VENV_DIR%\Scripts\activate.bat"

echo [*] Checking Python dependencies...
python -c "import fastapi, uvicorn, cv2, sqlalchemy, aiofiles" >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [*] Installing required backend packages from requirements.txt...
    python -m pip install --upgrade pip
    pip install -r requirements.txt
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Failed to install backend dependencies.
        pause
        exit /b 1
    )
) else (
    echo [OK] Backend dependencies are satisfied.
)

REM 4. Check Frontend build
cd frontend
if not exist "node_modules" (
    echo [*] Installing frontend npm dependencies...
    call npm.cmd install
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] npm install failed.
        cd ..
        pause
        exit /b 1
    )
)

if not exist "dist\index.html" (
    echo [*] Building production frontend bundle with Vite...
    call npm.cmd run build
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Frontend build failed.
        cd ..
        pause
        exit /b 1
    )
    echo [OK] Frontend built successfully.
) else (
    echo [OK] Built frontend distribution found at frontend\dist.
)
cd ..

REM 5. Launch mode check
if "%1"=="--dev" goto DEV_MODE

:PROD_MODE
echo.
echo ===============================================================================
echo [INFO] Starting Unified Production Telemetry Server on http://localhost:8000
echo        - API Endpoint:       http://localhost:8000/api/health
echo        - Interactive Docs:   http://localhost:8000/docs
echo        - Live Telemetry UI:  http://localhost:8000/
echo ===============================================================================
echo.

REM Automatically launch the browser after a brief delay
start "" http://localhost:8000/

cd backend
python -m uvicorn app:app --host 0.0.0.0 --port 8000
goto END

:DEV_MODE
echo.
echo ===============================================================================
echo [INFO] Starting in DUAL DEVELOPMENT MODE (Hot Reload)
echo        - Backend Server:   http://localhost:8000
echo        - Frontend Vite:    http://localhost:5173
echo ===============================================================================
echo.

start "Backend API Server" cmd /k "call %~dp0%VENV_DIR%\Scripts\activate.bat && cd /d %~dp0backend && python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload"
start "Frontend Vite Server" cmd /k "cd /d %~dp0frontend && npm.cmd run dev"
timeout /t 3 >nul
start "" http://localhost:5173/

:END
pause
