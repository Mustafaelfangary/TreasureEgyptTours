#!/usr/bin/env pwsh
# Quick fix script for admin panel issues

Write-Host "🔧 Admin Panel Quick Fix Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop running processes
Write-Host "Step 1: Stopping Node.js processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "✓ Stopped $($nodeProcesses.Count) Node.js process(es)" -ForegroundColor Green
} else {
    Write-Host "✓ No Node.js processes running" -ForegroundColor Green
}
Start-Sleep -Seconds 1

# Step 2: Clear .next directory
Write-Host ""
Write-Host "Step 2: Clearing .next build cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    Write-Host "✓ Removed .next directory" -ForegroundColor Green
} else {
    Write-Host "✓ .next directory doesn't exist" -ForegroundColor Green
}

# Step 3: Clear node_modules cache
Write-Host ""
Write-Host "Step 3: Clearing node_modules cache..." -ForegroundColor Yellow
if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
    Write-Host "✓ Removed node_modules cache" -ForegroundColor Green
} else {
    Write-Host "✓ node_modules cache doesn't exist" -ForegroundColor Green
}

# Step 4: Verify files exist
Write-Host ""
Write-Host "Step 4: Verifying files..." -ForegroundColor Yellow
$files = @(
    "src\app\admin\page.tsx",
    "src\components\admin\AdminDataOverview.tsx",
    "src\app\api\admin\overview\route.ts"
)

$allExist = $true
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "✗ $file NOT FOUND!" -ForegroundColor Red
        $allExist = $false
    }
}

if (-not $allExist) {
    Write-Host ""
    Write-Host "⚠️  Some files are missing! Please check the files above." -ForegroundColor Red
    exit 1
}

# Step 5: Check file content
Write-Host ""
Write-Host "Step 5: Checking admin page layout..." -ForegroundColor Yellow
$adminPageContent = Get-Content "src\app\admin\page.tsx" -Raw
if ($adminPageContent -match "md:grid-cols-3") {
    Write-Host "✓ Grid layout is correct (md:grid-cols-3)" -ForegroundColor Green
} else {
    Write-Host "⚠️  Grid layout might be incorrect" -ForegroundColor Yellow
}

if ($adminPageContent -match "AdminDataOverview") {
    Write-Host "✓ AdminDataOverview component is imported" -ForegroundColor Green
} else {
    Write-Host "✗ AdminDataOverview component NOT imported!" -ForegroundColor Red
}

# Step 6: Instructions
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ Cache cleared successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm run dev" -ForegroundColor White
Write-Host "2. Open browser and navigate to /admin" -ForegroundColor White
Write-Host "3. Hard refresh: Ctrl+Shift+R or Ctrl+F5" -ForegroundColor White
Write-Host ""
Write-Host "If issues persist:" -ForegroundColor Yellow
Write-Host "- Try incognito/private mode" -ForegroundColor White
Write-Host "- Check browser console (F12) for errors" -ForegroundColor White
Write-Host "- Read TROUBLESHOOTING_ADMIN_PANEL.md" -ForegroundColor White
Write-Host ""
