@echo off
echo === Build Nova Chat V2 ===

echo.
echo [1/5] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found
    pause
    exit /b 1
)
node --version
echo Node.js found:

REM Step 2: Install dependencies
echo.
echo [2/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

REM Step 3: Install Electron + electron-builder + electron-updater
echo.
echo [3/5] Installing Electron + electron-builder + electron-updater...
call npm install --save-dev electron electron-builder electron-updater
if %errorlevel% neq 0 (
    echo ERROR: electron install failed
    pause
    exit /b 1
)

REM Step 4: Create Next.js config for Electron
echo.
echo [4/5] Next.js config already created (next.config.js)

REM Step 5: Build V2 (Next.js + Electron)
echo.
echo [5/5] Building V2 (Next.js + Electron)...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: build failed
    pause
    exit /b 1
)

echo.
echo === Build complete ===
echo Output in .next/

REM Build Electron exe
echo.
echo [6/6] Building Electron exe...
call npm run electron:build
if %errorlevel% neq 0 (
    echo ERROR: electron build failed
    pause
    exit /b 1
)

echo.
echo === All done ===
echo Exe in dist/
pause
