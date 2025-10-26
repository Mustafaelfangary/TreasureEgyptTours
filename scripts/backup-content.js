const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function backupWebsiteContent() {
  try {
    console.log('🔄 Creating backup of website content...');
    
    // Get all website content
    const websiteContent = await prisma.websiteContent.findMany({
      orderBy: {
        key: 'asc'
      }
    });

    const timestamp = new Date().toISOString().slice(0, 16).replace(/:/g, '-');
    const backupDir = 'backups';
    const backupFile = path.join(backupDir, `website-content-backup-${timestamp}.json`);

    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
      console.log(`📁 Created backups directory`);
    }

    // Write backup file
    fs.writeFileSync(backupFile, JSON.stringify(websiteContent, null, 2));
    
    console.log(`✅ Backup created successfully!`);
    console.log(`📄 File: ${backupFile}`);
    console.log(`📊 Records backed up: ${websiteContent.length}`);
    console.log(`💾 File size: ${(fs.statSync(backupFile).size / 1024).toFixed(2)} KB`);
    
    return backupFile;
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  backupWebsiteContent();
}

module.exports = { backupWebsiteContent };
