@echo off
echo Building Dahabiyat Nile Cruise Android App...
echo.

REM Stop any existing Gradle daemons to avoid JVM conflicts
echo Stopping Gradle daemons...
gradlew --stop

REM Clean the project
echo Cleaning project...
gradlew clean

REM Build debug APK
echo Building debug APK...
gradlew assembleDebug

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Build successful!
    echo APK location: app\build\outputs\apk\debug\app-debug.apk
    echo.
    pause
) else (
    echo.
    echo ❌ Build failed! Check the error messages above.
    echo.
    pause
)