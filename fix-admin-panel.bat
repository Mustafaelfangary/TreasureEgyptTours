@echo off
echo ========================================
echo Admin Panel Quick Fix Script
echo ========================================
echo.

echo Step 1: Stopping Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Stopped Node.js processes
) else (
    echo [OK] No Node.js processes running
)
echo.

echo Step 2: Clearing .next build cache...
if exist .next (
    rmdir /s /q .next
    echo [OK] Removed .next directory
) else (
    echo [OK] .next directory doesn't exist
)
echo.

echo Step 3: Clearing node_modules cache...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo [OK] Removed node_modules cache
) else (
    echo [OK] node_modules cache doesn't exist
)
echo.

echo ========================================
echo Cache cleared successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Run: npm run dev
echo 2. Open browser and navigate to /admin
echo 3. Hard refresh: Ctrl+Shift+R or Ctrl+F5
echo.
echo If issues persist:
echo - Try incognito/private mode
echo - Check browser console (F12) for errors
echo - Read TROUBLESHOOTING_ADMIN_PANEL.md
echo.
pause
