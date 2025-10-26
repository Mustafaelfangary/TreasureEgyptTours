#!/usr/bin/env node

/**
 * Image Path Fixer Script
 * This script fixes all image paths in the database and components
 * to use the correct /images/ prefix
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively find all files with specific extensions
function findFiles(dir, extensions) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Skip node_modules and other irrelevant directories
      if (!['node_modules', '.git', '.next', 'dist', 'build'].includes(file)) {
        results = results.concat(findFiles(filePath, extensions));
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Function to fix image paths in a file
function fixImagePaths(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Patterns to fix
    const patterns = [
      // Fix paths like "/Royal Cleopatra/DSC_8735.jpg" to "/images/Royal Cleopatra/DSC_8735.jpg"
      {
        regex: /src=["']\/([^\/][^"']*\.(jpg|jpeg|png|gif|webp|svg))["']/g,
        replacement: (match, imagePath) => {
          modified = true;
          return `src="/images/${imagePath}"`;
        }
      },
      // Fix paths like "Royal Cleopatra/DSC_8735.jpg" to "/images/Royal Cleopatra/DSC_8735.jpg"
      {
        regex: /src=["']([^\/][^"']*\.(jpg|jpeg|png|gif|webp|svg))["']/g,
        replacement: (match, imagePath) => {
          modified = true;
          return `src="/images/${imagePath}"`;
        }
      },
      // Fix altavida-logo-1.png to /images/altavida-logo-1.png
      {
        regex: /src=["']altavida-logo-1\.png["']/g,
        replacement: () => {
          modified = true;
          return 'src="/images/images/altavida-logo-1.png"';
        }
      },
      // Fix other common image references
      {
        regex: /src=["']\/([^\/][^"']*\.(jpg|jpeg|png|gif|webp|svg))["']/g,
        replacement: (match, imagePath) => {
          if (!imagePath.startsWith('images/')) {
            modified = true;
            return `src="/images/${imagePath}"`;
          }
          return match;
        }
      }
    ];
    
    // Apply all patterns
    patterns.forEach(pattern => {
      content = content.replace(pattern.regex, pattern.replacement);
    });
    
    // Write back if modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed image paths in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
function main() {
  console.log('🔧 Starting image path fixer...');
  
  const projectRoot = process.cwd();
  const extensions = ['.tsx', '.ts', '.js', '.jsx', '.json'];
  
  console.log(`📁 Scanning project root: ${projectRoot}`);
  
  const files = findFiles(projectRoot, extensions);
  console.log(`📄 Found ${files.length} files to process`);
  
  let fixedCount = 0;
  
  files.forEach(file => {
    if (fixImagePaths(file)) {
      fixedCount++;
    }
  });
  
  console.log(`\n🎉 Image path fixing complete!`);
  console.log(`📊 Fixed ${fixedCount} files out of ${files.length} processed`);
  
  if (fixedCount > 0) {
    console.log('\n💡 Next steps:');
    console.log('1. Restart your development server');
    console.log('2. Clear browser cache');
    console.log('3. Test image loading');
  }
}

// Run the script
main();

export { fixImagePaths, findFiles };
