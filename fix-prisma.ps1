# Fix Prisma Generation Issues
Write-Host "Stopping any running Node processes..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

Write-Host "Waiting for processes to close..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

Write-Host "Generating Prisma Client..." -ForegroundColor Green
npx prisma generate

Write-Host "Done! You can now restart your development server." -ForegroundColor Green
