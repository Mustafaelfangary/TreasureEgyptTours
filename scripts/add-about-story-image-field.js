const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addAboutStoryImageField() {
  try {
    console.log('🔧 Adding about_story_image field to admin panel...');

    // Add the about_story_image field
    const result = await prisma.websiteContent.upsert({
      where: {
        key: 'about_story_image'
      },
      update: {
        title: 'Our Story Image',
        content: '/images/about/our-story.jpg',
        contentType: 'IMAGE',
        section: 'story',
        page: 'about',
        order: 156
      },
      create: {
        key: 'about_story_image',
        title: 'Our Story Image',
        content: '/images/about/our-story.jpg',
        contentType: 'IMAGE',
        section: 'story',
        page: 'about',
        order: 156
      }
    });

    console.log('✅ Successfully added about_story_image field:', result);

    // Also add other missing about page image fields for completeness
    const additionalFields = [
      {
        key: 'about_hero_image',
        title: 'About Hero Background Image',
        content: '/images/about-hero.png',
        contentType: 'IMAGE',
        section: 'hero',
        page: 'about',
        order: 69
      },
      {
        key: 'about_team_member_1_image',
        title: 'Team Member 1 Image',
        content: '/images/about/team-1.jpg',
        contentType: 'IMAGE',
        section: 'team',
        page: 'about',
        order: 191
      },
      {
        key: 'about_team_member_2_image',
        title: 'Team Member 2 Image',
        content: '/images/about/team-2.jpg',
        contentType: 'IMAGE',
        section: 'team',
        page: 'about',
        order: 192
      },
      {
        key: 'about_team_member_3_image',
        title: 'Team Member 3 Image',
        content: '/images/about/team-3.jpg',
        contentType: 'IMAGE',
        section: 'team',
        page: 'about',
        order: 193
      }
    ];

    for (const field of additionalFields) {
      const fieldResult = await prisma.websiteContent.upsert({
        where: {
          key: field.key
        },
        update: field,
        create: field
      });
      console.log(`✅ Added/updated ${field.key}:`, fieldResult.key);
    }

    console.log('🎉 All about page image fields have been added to the admin panel!');
    console.log('📝 You can now control these images from the admin panel:');
    console.log('   - Our Story Image (about_story_image)');
    console.log('   - Hero Background Image (about_hero_image)');
    console.log('   - Team Member Images (about_team_member_1_image, etc.)');

  } catch (error) {
    console.error('❌ Error adding about story image field:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addAboutStoryImageField();
