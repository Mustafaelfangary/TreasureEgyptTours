@echo off
setlocal enabledelayedexpansion

echo Building Dahabiyat User Android App...
echo.

REM Determine build type from first arg (debug by default)
set BUILD_TYPE=%1
if /I "%BUILD_TYPE%"=="release" (
  set BT=Release
  set BTF=release
) else (
  set BT=Debug
  set BTF=debug
)

echo Selected build type: !BT!
echo.

echo Stopping Gradle daemons...
call gradlew --stop

echo Cleaning project...
call gradlew clean || goto :error

echo Assembling user !BT! APK...
call gradlew assembleUser!BT! || goto :error

echo.
echo ✅ Build successful!
echo Look for the APK here:
echo   app\build\outputs\apk\user\!BTF!\
for %%f in (app\build\outputs\apk\user\!BTF!\*.apk) do (
  echo   %%f
)
echo.
goto :end

:error
echo.
echo ❌ Build failed. See errors above.
echo.
:end
pause
