@echo off
echo === Build Nova Chat V2 ===
echo.

echo [1/5] Checking Node.js...
node -v >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js is not installed. Please install it from https://nodejs.org/
  pause
  exit /b 1
)

echo [2/5] Installing dependencies...
call npm install
if errorlevel 1 (
  echo ERROR: npm install failed
  pause
  exit /b 1
)

echo [3/5] Installing Electron + electron-builder + electron-updater...
call npm install --save-dev electron@^31.0.0 electron-builder@^24.13.3 electron-updater@^5.3.0
if errorlevel 1 (
  echo ERROR: electron install failed
  pause
  exit /b 1
)

echo [4/5] Configuring Next.js for static export...
copy /Y next.config-electron.js next.config.js >nul
if errorlevel 1 (
  echo ERROR: failed to copy next.config-electron.js
  pause
  exit /b 1
)

echo [5/5] Building V2 (Next.js + Electron)...
call npm run dist
if errorlevel 1 (
  echo ERROR: build failed
  pause
  exit /b 1
)

echo.
echo === Build V2 complete ===
echo Check the dist-electron folder for the Windows installer.
echo You can now upload it to GitHub Releases as v2.0.0.
pause
