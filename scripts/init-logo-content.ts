import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initializeLogoContent() {
  console.log('🚀 Initializing logo content entries...');

  const logoEntries = [
    {
      key: 'site_logo',
      title: 'Main Site Logo',
      content: '/images/logo.png',
      contentType: 'IMAGE',
      page: 'branding_settings',
      section: 'branding',
      order: 1,
      isActive: true
    },
    {
      key: 'navbar_logo',
      title: 'Navigation Logo',
      content: '/images/logo.png',
      contentType: 'IMAGE',
      page: 'branding_settings',
      section: 'branding',
      order: 2,
      isActive: true
    },
    {
      key: 'footer_logo',
      title: 'Footer Logo',
      content: '/images/logo.png',
      contentType: 'IMAGE',
      page: 'branding_settings',
      section: 'branding',
      order: 3,
      isActive: true
    },
    {
      key: 'site_favicon',
      title: 'Site Favicon',
      content: '/favicon.ico',
      contentType: 'IMAGE',
      page: 'branding_settings',
      section: 'branding',
      order: 4,
      isActive: true
    }
  ];

  let created = 0;
  let updated = 0;

  for (const entry of logoEntries) {
    try {
      const existing = await prisma.websiteContent.findUnique({
        where: { key: entry.key }
      });

      if (existing) {
        await prisma.websiteContent.update({
          where: { key: entry.key },
          data: entry
        });
        updated++;
        console.log(`✅ Updated: ${entry.key}`);
      } else {
        await prisma.websiteContent.create({
          data: entry
        });
        created++;
        console.log(`✅ Created: ${entry.key}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${entry.key}:`, error);
    }
  }

  console.log(`\n📊 SUMMARY:`);
  console.log(`✅ Created: ${created} entries`);
  console.log(`🔄 Updated: ${updated} entries`);
  console.log(`📄 Total: ${logoEntries.length} entries processed`);
}

async function main() {
  try {
    await initializeLogoContent();
  } catch (error) {
    console.error('Error initializing logo content:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
