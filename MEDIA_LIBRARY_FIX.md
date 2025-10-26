# Media Library Fix - Import Existing Images

## Problem

The media library is only showing 2 images even though the `public/images` folder contains 500+ images.

## Root Cause

The application uses a **database-driven media system**. Images must be registered in the database to appear in the media library. The 500+ images in your public folder are not in the database yet.

## Solution

I've created a script that will scan your `public/images` folder and import all existing images into the database.

## How to Run the Import Script

### Step 1: Fix the Nodemailer Dependency Issue

The nodemailer dependency conflict has been fixed. Run:

```bash
npm install
```

This should now work without errors.

### Step 2: Run the Image Import Script

```bash
npm run import-images
```

This will:
- ✅ Scan the entire `public/images` directory recursively
- ✅ Find all image files (.jpg, .jpeg, .png, .gif, .webp, .svg, .bmp)
- ✅ Import each image into the database
- ✅ Skip images that already exist in the database
- ✅ Show progress every 50 images
- ✅ Display a summary at the end

### Expected Output

```
🚀 Starting image import...
📂 Scanning directory: C:\Users\Mr_Lu\Development\Dahabiyat-Nile-Cruise\public\images
📸 Found 500 images
✅ Imported 50 images...
✅ Imported 100 images...
✅ Imported 150 images...
...
✅ Imported 500 images...

📊 Import Summary:
✅ Successfully imported: 498
⏭️  Skipped (already exists): 2
❌ Errors: 0
📸 Total images found: 500
```

## What the Script Does

1. **Scans recursively**: Finds all images in `public/images` and all subdirectories
2. **Checks for duplicates**: Won't import images that are already in the database
3. **Extracts metadata**:
   - Filename
   - File size
   - MIME type
   - URL path
   - Auto-generated caption from filename
4. **Creates database records**: Adds each image to the `MediaAsset` table

## Database Table

Images are stored in the `MediaAsset` table with the following fields:
- `id`: Unique identifier
- `filename`: Original filename
- `originalName`: Original filename
- `mimeType`: Image MIME type (image/jpeg, image/png, etc.)
- `size`: File size in bytes
- `url`: Public URL path (e.g., `/images/subfolder/image.jpg`)
- `caption`: Auto-generated from filename
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## After Import

Once the import is complete:
1. Refresh your media library page
2. All 500+ images should now be visible
3. You can filter, search, and select images
4. Images can be used in the admin panel for:
   - Gallery images
   - Package images
   - Dahabiya images
   - Blog post images
   - Any content that needs media

## Troubleshooting

### If the script fails:

1. **Check database connection**: Make sure your `.env` file has the correct `DATABASE_URL`
2. **Check Prisma**: Run `npx prisma generate` to ensure Prisma client is up to date
3. **Check permissions**: Make sure the script can read the `public/images` folder
4. **Check logs**: The script will show detailed error messages

### If images still don't show:

1. **Clear browser cache**: Hard refresh (Ctrl+Shift+R)
2. **Check API**: Visit `http://localhost:3000/api/admin/media` (must be logged in as admin)
3. **Check database**: Use Prisma Studio to verify images are in the database:
   ```bash
   npx prisma studio
   ```

## Re-running the Script

The script is **safe to run multiple times**:
- It checks for existing images before importing
- Won't create duplicates
- Will only import new images

## Manual Import Alternative

If you prefer to import images manually through the admin panel:
1. Go to Admin Dashboard → Media Library
2. Click "Upload" button
3. Select multiple images
4. Upload in batches

However, the script is **much faster** for bulk imports (500+ images).

## Script Location

The import script is located at:
- `scripts/import-existing-images.js` (JavaScript version - used by npm script)
- `scripts/import-existing-images.ts` (TypeScript version - for reference)

## Technical Details

### Supported Image Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- SVG (.svg)
- BMP (.bmp)

### Directory Structure
The script preserves the directory structure in the URL:
- `public/images/photo.jpg` → `/images/photo.jpg`
- `public/images/gallery/photo.jpg` → `/images/gallery/photo.jpg`
- `public/images/dahabiyas/luxury/photo.jpg` → `/images/dahabiyas/luxury/photo.jpg`

## Next Steps

After importing all images:
1. ✅ All images will be available in the media library
2. ✅ You can organize them into categories
3. ✅ You can add tags and descriptions through the admin panel
4. ✅ You can use them in your content (packages, dahabiyas, blog posts, etc.)

## Dependencies Fixed

Also fixed the nodemailer dependency conflict:
- Reverted from `nodemailer@7.0.9` to `nodemailer@6.9.0`
- This resolves the peer dependency conflict with `next-auth@4.24.11`
- Run `npm install` to apply the fix
