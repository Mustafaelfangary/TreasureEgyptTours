const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CLEAN FIELD MAPPING - ONLY ACTUAL FIELDS USED IN THE WEBSITE
const VALID_CONTENT_KEYS = [
  // Homepage
  'hero_video_url', 'hero_video_poster', 'hero_video_title', 'hero_video_subtitle', 'hero_video_cta_text', 'hero_scroll_text',
  'dahabiyat_section_title', 'dahabiyat_section_subtitle', 'dahabiyat_view_all_text',
  'packages_section_title', 'packages_section_subtitle', 'packages_view_all_text', 'days_label', 'view_details_text',
  'what_is_dahabiya_title', 'what_is_dahabiya_content', 'what_is_dahabiya_image_1', 'what_is_dahabiya_image_2', 'what_is_dahabiya_image_3',
  'why_different_title', 'why_different_content', 'why_different_image_1', 'why_different_image_2', 'why_different_image_3',
  'our_story_title', 'our_story_content', 'our_story_paragraph_2', 'our_story_paragraph_3', 'our_story_paragraph_4',
  'founder_name', 'founder_title', 'founder_quote', 'founder_image',
  'share_memories_title', 'share_memories_content', 'share_memories_image_1', 'share_memories_image_2', 'share_memories_image_3',
  'gallery_section_title', 'gallery_section_subtitle', 'gallery_view_all_text',
  'blog_section_title', 'blog_section_subtitle', 'blog_view_all_text',
  'safety_title', 'safety_subtitle',
  'cta_title', 'cta_description', 'cta_book_text', 'cta_contact_text',
  'loading_text', 'read_more_text', 'read_less_text',
  
  // Dahabiyas Page
  'dahabiyas_hero_title', 'dahabiyas_hero_subtitle', 'dahabiyas_hero_description', 'dahabiyas_description',
  'dahabiyas_hero_background_image', 'dahabiyas_hero_background_video',
  'dahabiyas_cta_title', 'dahabiyas_cta_description', 'dahabiyas_cta_book_title', 'dahabiyas_cta_book_subtitle',
  'dahabiyas_cta_packages_title', 'dahabiyas_cta_packages_subtitle',
  'dahabiyas_feature_1_title', 'dahabiyas_feature_1_description', 'dahabiyas_feature_2_title', 'dahabiyas_feature_2_description',
  'dahabiyas_feature_3_title', 'dahabiyas_feature_3_description',
  
  // Packages Page
  'packages_hero_title', 'packages_hero_subtitle', 'packages_hero_description', 'packages_hero_image', 'packages_hero_video',
  'packages_cta_title', 'packages_cta_description', 'packages_cta_book_title', 'packages_cta_book_subtitle',
  'packages_cta_dahabiyas_title', 'packages_cta_dahabiyas_subtitle',
  
  // Schedule & Rates Page
  'page_title', 'page_subtitle', 'hero_background_image', 'intro_section_title', 'schedule_intro_text',
  'schedule_title', 'schedule_subtitle',
  
  // Contact Page
  'contact_hero_title', 'contact_hero_subtitle', 'contact_hero_image', 'contact_hero_video',
  'contact_phone_title', 'contact_phone', 'contact_email_title', 'contact_email', 'contact_location_title', 'contact_address',
  'contact_facebook', 'contact_instagram', 'contact_x', 'contact_youtube', 'contact_tiktok', 'contact_pinterest',
  'contact_tripadvisor', 'contact_whatsapp', 'contact_telegram', 'contact_wechat', 'contact_vk',
  'contact_loading_text',
  
  // About Page
  'about_hero_title', 'about_hero_subtitle', 'about_hero_image', 'about_loading_text',
  'about_story_title', 'about_story_content', 'about_story_image',
  'about_mission_title', 'about_mission_content', 'about_vision_title', 'about_vision_content',
  'about_values_title', 'about_values', 'about_team_title', 'about_team_description',
  'about_stat_years', 'about_stat_years_label', 'about_stat_guests', 'about_stat_guests_label',
  'about_stat_countries', 'about_stat_countries_label', 'about_stat_safety', 'about_stat_safety_label',
  'about_contact_title', 'about_contact_description', 'about_contact_phone', 'about_contact_email',
  'about_contact_address', 'about_egypt_label',
  
  // Footer
  'footer-title', 'footer-company-name', 'footer-description', 'footer-phone', 'footer-email', 'footer-address',
  'footer_quick_links_title', 'footer-link-home', 'footer-link-about', 'footer-link-dahabiyat',
  'footer-link-packages', 'footer-link-contact',
  'footer_follow_us_title', 'footer-facebook', 'footer-instagram', 'footer-twitter',
  'footer_newsletter_title', 'footer-newsletter-text', 'footer_subscribe_button_text',
  'footer_developer_logo', 'footer_developer_contact_text', 'footer_developer_contact_url',
  'footer_developer_phone', 'footer_developer_phone_url', 'footer_developer_contact_modal_title',
  'footer_loading_text',
  
  // Branding & Settings
  'site_name', 'site_logo', 'navbar_logo', 'footer_logo', 'site_favicon'
];

async function analyzeDatabase() {
  console.log('🔍 Analyzing database content fields...\n');

  try {
    // Get all content fields from database
    const allContent = await prisma.websiteContent.findMany({
      select: {
        key: true,
        title: true,
        page: true,
        section: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        key: 'asc'
      }
    });

    console.log(`📊 Total fields in database: ${allContent.length}`);
    console.log(`✅ Valid fields in mapping: ${VALID_CONTENT_KEYS.length}\n`);

    // Identify unused fields
    const unusedFields = allContent.filter(item => !VALID_CONTENT_KEYS.includes(item.key));
    const validFields = allContent.filter(item => VALID_CONTENT_KEYS.includes(item.key));

    console.log(`🗑️  Unused fields to be removed: ${unusedFields.length}`);
    console.log(`✅ Valid fields to keep: ${validFields.length}\n`);

    if (unusedFields.length > 0) {
      console.log('📋 UNUSED FIELDS LIST:');
      console.log('========================');
      unusedFields.forEach((field, index) => {
        console.log(`${index + 1}. ${field.key}`);
        console.log(`   └─ Title: ${field.title || 'No title'}`);
        console.log(`   └─ Page: ${field.page}`);
        console.log(`   └─ Section: ${field.section}`);
        console.log(`   └─ Created: ${field.createdAt.toLocaleDateString()}`);
        console.log(`   └─ Updated: ${field.updatedAt.toLocaleDateString()}\n`);
      });
    }

    // Check for missing fields (fields in mapping but not in database)
    const existingKeys = allContent.map(item => item.key);
    const missingFields = VALID_CONTENT_KEYS.filter(key => !existingKeys.includes(key));

    if (missingFields.length > 0) {
      console.log(`⚠️  Missing fields (in mapping but not in database): ${missingFields.length}`);
      console.log('📋 MISSING FIELDS LIST:');
      console.log('========================');
      missingFields.forEach((key, index) => {
        console.log(`${index + 1}. ${key}`);
      });
      console.log();
    }

    return {
      total: allContent.length,
      unused: unusedFields,
      valid: validFields,
      missing: missingFields
    };

  } catch (error) {
    console.error('❌ Error analyzing database:', error);
    throw error;
  }
}

async function cleanupDatabase(dryRun = true) {
  console.log(`🧹 ${dryRun ? 'DRY RUN:' : 'CLEANING:'} Removing unused content fields...\n`);

  try {
    const analysis = await analyzeDatabase();

    if (analysis.unused.length === 0) {
      console.log('✅ No unused fields found. Database is already clean!');
      return;
    }

    if (dryRun) {
      console.log(`🔍 DRY RUN: Would remove ${analysis.unused.length} unused fields.`);
      console.log('Run with --cleanup flag to actually remove them.\n');
      return analysis;
    }

    // Actually remove unused fields
    const unusedKeys = analysis.unused.map(field => field.key);

    const deleteResult = await prisma.websiteContent.deleteMany({
      where: {
        key: {
          in: unusedKeys
        }
      }
    });

    console.log(`✅ Successfully removed ${deleteResult.count} unused content fields!`);

    // Verify cleanup
    const remainingCount = await prisma.websiteContent.count();
    console.log(`📊 Remaining content fields in database: ${remainingCount}`);

    return analysis;

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
}

async function main() {
  try {
    const args = process.argv.slice(2);
    const shouldCleanup = args.includes('--cleanup');

    console.log('🚀 Website Content Database Cleanup Tool\n');
    console.log('=========================================\n');

    if (shouldCleanup) {
      // Confirm cleanup action
      console.log('⚠️  WARNING: This will permanently delete unused content fields from the database!');
      console.log('Make sure you have a database backup before proceeding.\n');
      
      // In a real scenario, you might want to add user confirmation here
      await cleanupDatabase(false);
    } else {
      await analyzeDatabase();
      console.log('\n💡 To actually remove unused fields, run: node scripts/cleanup-website-content.js --cleanup');
    }

  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  analyzeDatabase,
  cleanupDatabase,
  VALID_CONTENT_KEYS
};
