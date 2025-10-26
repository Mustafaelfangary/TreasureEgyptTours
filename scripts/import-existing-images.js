import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

// Get all image files from a directory recursively
function getAllImageFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllImageFiles(filePath, arrayOfFiles);
    } else {
      // Check if it's an image file
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'].includes(ext)) {
        arrayOfFiles.push(filePath);
      }
    }
  });

  return arrayOfFiles;
}

// Get file size
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

// Get MIME type from extension
function getMimeType(ext) {
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.bmp': 'image/bmp'
  };
  return mimeTypes[ext.toLowerCase()] || 'image/jpeg';
}

async function importImages() {
  try {
    console.log('🚀 Starting image import...');
    
    // Get the public/images directory
    const publicDir = path.join(process.cwd(), 'public', 'images');
    
    if (!fs.existsSync(publicDir)) {
      console.error('❌ Public images directory not found:', publicDir);
      return;
    }

    console.log('📂 Scanning directory:', publicDir);
    
    // Get all image files
    const imageFiles = getAllImageFiles(publicDir);
    console.log(`📸 Found ${imageFiles.length} images`);

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const filePath of imageFiles) {
      try {
        // Get relative path from public directory
        const relativePath = path.relative(path.join(process.cwd(), 'public'), filePath);
        const url = '/' + relativePath.replace(/\\/g, '/');
        
        // Check if already exists
        const existing = await prisma.mediaAsset.findFirst({
          where: { url }
        });

        if (existing) {
          skipped++;
          continue;
        }

        // Get file info
        const filename = path.basename(filePath);
        const ext = path.extname(filename);
        const size = getFileSize(filePath);
        const mimeType = getMimeType(ext);

        // Create media asset
        await prisma.mediaAsset.create({
          data: {
            filename: filename,
            originalName: filename,
            mimeType: mimeType,
            size: size,
            url: url,
            type: 'IMAGE',  // MediaType enum value
            caption: filename.replace(ext, '').replace(/[-_]/g, ' ')
          }
        });

        imported++;
        
        if (imported % 50 === 0) {
          console.log(`✅ Imported ${imported} images...`);
        }
      } catch (error) {
        errors++;
        console.error(`❌ Error importing ${filePath}:`, error.message);
      }
    }

    console.log('\n📊 Import Summary:');
    console.log(`✅ Successfully imported: ${imported}`);
    console.log(`⏭️  Skipped (already exists): ${skipped}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📸 Total images found: ${imageFiles.length}`);

  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importImages();
