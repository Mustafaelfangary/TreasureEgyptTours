Param(
  [switch]$Release
)

$ErrorActionPreference = 'Stop'

# Resolve project root (script directory -> parent)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

# Gradle wrapper
$Gradlew = Join-Path $ProjectRoot 'gradlew.bat'
if (!(Test-Path $Gradlew)) {
  Write-Error "gradlew.bat not found at $Gradlew"
}

# Choose variant
$variant = if ($Release) { 'AdminRelease' } else { 'AdminDebug' }

# Build
Write-Host "Building $variant..." -ForegroundColor Cyan
& $Gradlew :app:assemble$variant

# Try install via Gradle first
$installTask = ":app:install$variant"
try {
  Write-Host "Installing via Gradle task $installTask..." -ForegroundColor Cyan
  & $Gradlew $installTask
  Write-Host "Installed via Gradle." -ForegroundColor Green
  exit 0
} catch {
  Write-Warning "Gradle install task failed or not available. Falling back to adb install..."
}

# Fallback to adb install
$apkPath = if ($Release) {
  Join-Path $ProjectRoot 'app\build\outputs\apk\admin\release\app-admin-release.apk'
} else {
  Join-Path $ProjectRoot 'app\build\outputs\apk\admin\debug\app-admin-debug.apk'
}

if (!(Test-Path $apkPath)) {
  Write-Error "APK not found at $apkPath"
}

# Ensure adb
$adb = 'adb'
try {
  $null = & $adb --version
} catch {
  Write-Error "adb not found in PATH. Please install Android platform-tools and add to PATH."
}

Write-Host "Installing APK: $apkPath" -ForegroundColor Cyan
& $adb install -r $apkPath
Write-Host "Install complete." -ForegroundColor Green
