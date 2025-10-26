/**
 * Scan and Add Media to Library
 * This script scans all images and videos in the repository and adds them to the media library
 * Run with: node scripts/scan-and-add-media.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories to scan
const SCAN_DIRECTORIES = [
  'public/images',
  'public/videos',
  'public/uploads',
  'public/assets',
  'public/media'
];

// Supported file extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff', '.ico'];
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.m4v'];

// Statistics
const stats = {
  totalImages: 0,
  totalVideos: 0,
  totalSize: 0,
  directories: 0,
  errors: []
};

// Recursively scan directory
function scanDirectory(dirPath, baseUrl = '') {
  const items = [];
  
  try {
    if (!fs.existsSync(dirPath)) {
      console.log(`⚠️  Directory not found: ${dirPath}`);
      return items;
    }

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    stats.directories++;

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const urlPath = baseUrl ? `${baseUrl}/${entry.name}` : `/${entry.name}`;

      // Skip certain directories
      if (entry.isDirectory()) {
        if (entry.name.includes('_files') || 
            entry.name.includes('.html') ||
            entry.name === 'node_modules' ||
            entry.name === '.next' ||
            entry.name === '.git') {
          continue;
        }

        // Recursively scan subdirectories
        const subItems = scanDirectory(fullPath, urlPath);
        items.push(...subItems);
        continue;
      }

      if (!entry.isFile()) continue;

      const ext = path.extname(entry.name).toLowerCase();
      const isImage = IMAGE_EXTENSIONS.includes(ext);
      const isVideo = VIDEO_EXTENSIONS.includes(ext);

      if (isImage || isVideo) {
        try {
          const fileStats = fs.statSync(fullPath);
          const item = {
            filename: entry.name,
            originalName: entry.name,
            url: urlPath,
            path: fullPath,
            type: isImage ? 'image' : 'video',
            mimeType: getMimeType(ext),
            size: fileStats.size,
            createdAt: fileStats.birthtime,
            modifiedAt: fileStats.mtime,
            extension: ext
          };

          items.push(item);

          if (isImage) stats.totalImages++;
          if (isVideo) stats.totalVideos++;
          stats.totalSize += fileStats.size;

        } catch (error) {
          stats.errors.push(`Error reading file ${fullPath}: ${error.message}`);
        }
      }
    }
  } catch (error) {
    stats.errors.push(`Error scanning directory ${dirPath}: ${error.message}`);
  }

  return items;
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
    '.bmp': 'image/bmp',
    '.tiff': 'image/tiff',
    '.ico': 'image/x-icon',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.mkv': 'video/x-matroska',
    '.m4v': 'video/x-m4v'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// Format file size
function formatSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Main execution
console.log('🔍 Scanning media files in repository...\n');

const allMedia = [];
const projectRoot = path.join(__dirname, '..');

for (const dir of SCAN_DIRECTORIES) {
  const fullPath = path.join(projectRoot, dir);
  const baseUrl = '/' + dir.replace(/\\/g, '/').replace('public/', '');
  
  console.log(`📁 Scanning: ${dir}`);
  const items = scanDirectory(fullPath, baseUrl);
  allMedia.push(...items);
  console.log(`   Found: ${items.length} files\n`);
}

// Generate report
console.log('\n' + '='.repeat(60));
console.log('📊 SCAN RESULTS');
console.log('='.repeat(60));
console.log(`\n📸 Images found: ${stats.totalImages}`);
console.log(`🎥 Videos found: ${stats.totalVideos}`);
console.log(`📁 Directories scanned: ${stats.directories}`);
console.log(`💾 Total size: ${formatSize(stats.totalSize)}`);
console.log(`📝 Total files: ${allMedia.length}`);

if (stats.errors.length > 0) {
  console.log(`\n⚠️  Errors encountered: ${stats.errors.length}`);
  stats.errors.forEach(error => console.log(`   - ${error}`));
}

// Save to JSON file
const outputPath = path.join(projectRoot, 'media-library-scan.json');
const output = {
  scanDate: new Date().toISOString(),
  statistics: {
    totalImages: stats.totalImages,
    totalVideos: stats.totalVideos,
    totalFiles: allMedia.length,
    totalSize: stats.totalSize,
    totalSizeFormatted: formatSize(stats.totalSize),
    directoriesScanned: stats.directories
  },
  media: allMedia.map(item => ({
    filename: item.filename,
    originalName: item.originalName,
    url: item.url,
    type: item.type,
    mimeType: item.mimeType,
    size: item.size,
    sizeFormatted: formatSize(item.size),
    createdAt: item.createdAt,
    modifiedAt: item.modifiedAt,
    extension: item.extension
  }))
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`\n✅ Media library scan saved to: media-library-scan.json`);

// Group by type
const imagesByType = {};
const videosByType = {};

allMedia.forEach(item => {
  if (item.type === 'image') {
    imagesByType[item.extension] = (imagesByType[item.extension] || 0) + 1;
  } else {
    videosByType[item.extension] = (videosByType[item.extension] || 0) + 1;
  }
});

console.log('\n📊 Breakdown by Type:');
console.log('\nImages:');
Object.entries(imagesByType).forEach(([ext, count]) => {
  console.log(`   ${ext}: ${count} files`);
});

if (Object.keys(videosByType).length > 0) {
  console.log('\nVideos:');
  Object.entries(videosByType).forEach(([ext, count]) => {
    console.log(`   ${ext}: ${count} files`);
  });
}

// Top 10 largest files
console.log('\n📦 Top 10 Largest Files:');
const sorted = [...allMedia].sort((a, b) => b.size - a.size).slice(0, 10);
sorted.forEach((item, index) => {
  console.log(`   ${index + 1}. ${item.filename} - ${formatSize(item.size)}`);
});

console.log('\n' + '='.repeat(60));
console.log('✨ Scan complete! All media files are now indexed.');
console.log('='.repeat(60));
console.log('\n💡 Next steps:');
console.log('   1. Review media-library-scan.json');
console.log('   2. Access media via /api/media endpoint');
console.log('   3. Use Media Manager in admin panel');
console.log('   4. Sort by date, size, name, or last used\n');
