import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixLogoUrls() {
  console.log('🔧 Checking and fixing truncated logo URLs...\n');

  try {
    // Get all logo entries
    const logos = await prisma.websiteContent.findMany({
      where: {
        key: {
          in: ['site_logo', 'navbar_logo', 'footer_logo', 'site_favicon']
        }
      }
    });

    console.log('Current logo URLs:');
    logos.forEach(logo => {
      console.log(`  ${logo.key}: "${logo.content}"`);
    });

    // Fix truncated URLs
    const fixes = [];
    for (const logo of logos) {
      let fixedUrl = logo.content;
      let needsFix = false;

      // Check for common truncation issues
      if (logo.content?.includes('/images/lo.png')) {
        fixedUrl = '/images/logo.png';
        needsFix = true;
      } else if (logo.content?.includes('/images/lo.p')) {
        fixedUrl = '/images/logo.png';
        needsFix = true;
      } else if (logo.content?.includes('/images/lo.')) {
        fixedUrl = '/images/logo.png';
        needsFix = true;
      } else if (logo.content?.includes('/images/lo')) {
        fixedUrl = '/images/logo.png';
        needsFix = true;
      } else if (logo.content?.includes('/images/l')) {
        fixedUrl = '/images/logo.png';
        needsFix = true;
      }

      if (needsFix) {
        fixes.push({
          id: logo.id,
          key: logo.key,
          oldUrl: logo.content,
          newUrl: fixedUrl
        });
      }
    }

    if (fixes.length === 0) {
      console.log('\n✅ No truncated URLs found. All logos look good!');
      return;
    }

    console.log('\n🔨 Fixing truncated URLs:');
    for (const fix of fixes) {
      console.log(`  ${fix.key}: "${fix.oldUrl}" → "${fix.newUrl}"`);
      
      await prisma.websiteContent.update({
        where: { id: fix.id },
        data: { content: fix.newUrl }
      });
    }

    console.log(`\n✅ Fixed ${fixes.length} truncated logo URLs!`);
    
    // Verify the fixes
    console.log('\nVerifying fixes:');
    const updatedLogos = await prisma.websiteContent.findMany({
      where: {
        key: {
          in: ['site_logo', 'navbar_logo', 'footer_logo', 'site_favicon']
        }
      }
    });

    updatedLogos.forEach(logo => {
      console.log(`  ${logo.key}: "${logo.content}"`);
    });

  } catch (error) {
    console.error('❌ Error fixing logo URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixLogoUrls();
