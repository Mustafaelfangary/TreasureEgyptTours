const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupContent() {
  console.log('🧹 Starting content cleanup...');

  try {
    // Step 1: Check current state
    console.log('📊 Checking current content state...');
    
    const settingsCount = await prisma.setting.count();
    const websiteContentCount = await prisma.websiteContent.count();
    
    console.log(`📋 Settings table: ${settingsCount} entries`);
    console.log(`📋 WebsiteContent table: ${websiteContentCount} entries`);

    // Step 2: Get all settings that look like content
    const contentSettings = await prisma.setting.findMany({
      where: {
        OR: [
          { key: { contains: 'homepage' } },
          { key: { contains: 'about' } },
          { key: { contains: 'hero' } },
          { key: { contains: 'section' } },
          { key: { contains: 'title' } },
          { key: { contains: 'text' } },
          { key: { contains: 'image' } },
          { key: { contains: 'background' } },
          { key: { contains: 'blog' } },
          { key: { contains: 'boat' } },
          { key: { contains: 'tour' } },
          { key: { contains: 'testimonial' } },
          { key: { contains: 'contact' } },
          { key: { contains: 'footer' } },
          { key: { contains: 'cta' } }
        ]
      }
    });

    console.log(`🔍 Found ${contentSettings.length} content-related settings`);

    // Step 3: Remove duplicate/old content from settings
    if (contentSettings.length > 0) {
      console.log('🗑️ Removing old content from settings table...');
      
      const settingsToDelete = contentSettings.map(s => s.id);
      
      await prisma.setting.deleteMany({
        where: {
          id: { in: settingsToDelete }
        }
      });
      
      console.log(`✅ Removed ${settingsToDelete.length} old content entries from settings`);
    }

    // Step 4: Check if websiteContent has the current homepage content
    const homepageContent = await prisma.websiteContent.findMany({
      where: { page: 'homepage' }
    });

    console.log(`📄 Current homepage content entries: ${homepageContent.length}`);

    // Step 5: If websiteContent is empty or has old content, create fresh content
    if (homepageContent.length === 0 || homepageContent.some(c => c.key.includes('About section'))) {
      console.log('🆕 Creating fresh homepage content...');
      
      // Remove old homepage content
      await prisma.websiteContent.deleteMany({
        where: { page: 'homepage' }
      });

      // Create modern homepage content structure
      const modernContent = [
        // Hero Section
        {
          key: 'hero_headline',
          title: 'Hero Headline',
          content: 'Discover the Magic of the Nile',
          contentType: 'TEXT',
          page: 'homepage',
          section: 'hero',
          order: 1
        },
        {
          key: 'hero_subheadline',
          title: 'Hero Subheadline',
          content: 'Experience luxury and adventure on our premium Nile cruises',
          contentType: 'TEXT',
          page: 'homepage',
          section: 'hero',
          order: 2
        },
        {
          key: 'hero_background_image',
          title: 'Hero Background Image',
          content: '/images/home_tours3_image.png',
          contentType: 'IMAGE',
          page: 'homepage',
          section: 'hero',
          order: 3
        },
        {
          key: 'hero_background_video',
          title: 'Hero Background Video',
          content: '/videos/55ecb18d-209a-4aba-8273-a95aed5ac223.mp4',
          contentType: 'VIDEO',
          page: 'homepage',
          section: 'hero',
          order: 4
        },

        // Featured Section
        {
          key: 'featured_cruises_title',
          title: 'Featured Cruises Title',
          content: 'Our Featured Cruises',
          contentType: 'TEXT',
          page: 'homepage',
          section: 'featured',
          order: 10
        },
        {
          key: 'featured_cruises_subtitle',
          title: 'Featured Cruises Subtitle',
          content: 'Explore our most popular Nile cruise packages',
          contentType: 'TEXT',
          page: 'homepage',
          section: 'featured',
          order: 11
        },

        // How It Works Section
        {
          key: 'how_it_works_title',
          title: 'How It Works Title',
          content: 'How it works',
          contentType: 'TEXT',
          page: 'homepage',
          section: 'how_it_works',
          order: 20
        },
        {
          key: 'how_it_works_step1_title',
          title: 'Step 1 Title',
          content: 'Explore',
          contentType: 'TEXT',
          page: 'homepage',
          section: 'how_it_works',
          order: 21
        },
        {
          key: 'how_it_works_step1_description',
          title: 'Step 1 Description',
          content: 'Browse our cruises and find your perfect journey.',
          contentType: 'TEXT',
          page: 'homepage',
          section: 'how_it_works',
          order: 22
        },
        {
          key: 'how_it_works_step1_icon',
          title: 'Step 1 Icon',
          content: '/images/icons/explore.png',
          contentType: 'IMAGE',
          page: 'homepage',
          section: 'how_it_works',
          order: 23
        },

        // Testimonials Section
        {
          key: 'testimonials_title',
          title: 'Testimonials Title',
          content: 'What Our Guests Say',
          contentType: 'TEXT',
          page: 'homepage',
          section: 'testimonials',
          order: 30
        },
        {
          key: 'testimonials_subtitle',
          title: 'Testimonials Subtitle',
          content: 'Read about experiences from our satisfied guests',
          contentType: 'TEXT',
          page: 'homepage',
          section: 'testimonials',
          order: 31
        },
        {
          key: 'testimonials_background_image',
          title: 'Testimonials Background Image',
          content: '/images/testimonials-bg.jpg',
          contentType: 'IMAGE',
          page: 'homepage',
          section: 'testimonials',
          order: 32
        },

        // Footer Section
        {
          key: 'home_footer_background',
          title: 'Footer Background Image',
          content: '/images/home_tours3_image.png',
          contentType: 'IMAGE',
          page: 'homepage',
          section: 'footer',
          order: 40
        }
      ];

      // Insert new content
      for (const content of modernContent) {
        await prisma.websiteContent.create({
          data: content
        });
      }

      console.log(`✅ Created ${modernContent.length} modern homepage content entries`);
    }

    // Step 6: Clean up any duplicate entries
    console.log('🔍 Checking for duplicate entries...');
    
    const duplicates = await prisma.$queryRaw`
      SELECT key, COUNT(*) as count 
      FROM website_content 
      GROUP BY key 
      HAVING COUNT(*) > 1
    `;

    if (duplicates.length > 0) {
      console.log(`🗑️ Found ${duplicates.length} duplicate keys, cleaning up...`);
      
      for (const dup of duplicates) {
        // Keep the most recent entry, delete others
        const entries = await prisma.websiteContent.findMany({
          where: { key: dup.key },
          orderBy: { updatedAt: 'desc' }
        });
        
        if (entries.length > 1) {
          const toDelete = entries.slice(1); // Keep first (most recent), delete rest
          await prisma.websiteContent.deleteMany({
            where: {
              id: { in: toDelete.map(e => e.id) }
            }
          });
          console.log(`  ✅ Cleaned up ${toDelete.length} duplicates for key: ${dup.key}`);
        }
      }
    }

    // Step 7: Final verification
    console.log('✅ Final verification...');
    
    const finalSettingsCount = await prisma.setting.count();
    const finalWebsiteContentCount = await prisma.websiteContent.count();
    const finalHomepageCount = await prisma.websiteContent.count({
      where: { page: 'homepage' }
    });

    console.log('\n📊 CLEANUP SUMMARY:');
    console.log(`📋 Settings entries: ${settingsCount} → ${finalSettingsCount}`);
    console.log(`📋 WebsiteContent entries: ${websiteContentCount} → ${finalWebsiteContentCount}`);
    console.log(`📄 Homepage content entries: ${finalHomepageCount}`);
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Refresh the admin panel');
    console.log('2. Check that old duplicate fields are gone');
    console.log('3. Verify homepage content matches the live site');
    console.log('4. Update any content as needed');

  } catch (error) {
    console.error('❌ Error during content cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
if (require.main === module) {
  cleanupContent()
    .then(() => {
      console.log('🎉 Content cleanup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Content cleanup failed:', error);
      process.exit(1);
    });
}

module.exports = { cleanupContent };
