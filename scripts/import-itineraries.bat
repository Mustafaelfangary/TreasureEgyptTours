@echo off
echo Dahabiyat Nile Cruise - Itinerary Import Tool
echo ===========================================
echo.
echo This tool helps you import Word document itineraries into your website database.
echo.
echo Usage:
echo   1. Place your Word files (.docx or .doc) in a folder
echo   2. Run: npm run import:itineraries "path/to/folder"
echo   3. Or import a single file: npm run import:itineraries "path/to/file.docx"
echo.
echo Example Word document structure expected:
echo   - Title (e.g., "Egypt Nile Cruise - 7 Days")
echo   - Description paragraph
echo   - Highlights section with bullet points
echo   - Included/Not Included sections
echo   - Day-by-day itinerary (Day 1: Title, Day 2: Title, etc.)
echo   - Optional pricing section
echo.
if "%~1"=="" (
    echo ERROR: Please provide a file or directory path
    echo Example: %~nx0 "C:\Documents\Itineraries"
    pause
    exit /b 1
)

echo Processing: %1
echo.
tsx scripts/import-word-itineraries.ts "%1"
echo.
echo Import complete! Check your admin panel to manage the imported itineraries.
pause
