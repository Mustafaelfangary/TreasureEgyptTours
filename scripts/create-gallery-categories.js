import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createGalleryCategories() {
  console.log('Creating gallery categories...');
  
  const categories = [
    {
      name: 'Dahabiyat',
      slug: 'dahabiyat',
      description: 'Beautiful images of our luxury dahabiya fleet',
      order: 1
    },
    {
      name: 'Destinations',
      slug: 'destinations',
      description: 'Ancient temples, tombs, and archaeological sites',
      order: 2
    },
    {
      name: 'Experiences',
      slug: 'experiences',
      description: 'Memorable moments and activities on board',
      order: 3
    },
    {
      name: 'Landscapes',
      slug: 'landscapes',
      description: 'Scenic views along the Nile River',
      order: 4
    },
    {
      name: 'Culture',
      slug: 'culture',
      description: 'Local culture, people, and traditions',
      order: 5
    }
  ];

  try {
    for (const category of categories) {
      const existingCategory = await prisma.galleryCategory.findUnique({
        where: { slug: category.slug }
      });

      if (!existingCategory) {
        await prisma.galleryCategory.create({
          data: category
        });
        console.log(`✅ Created category: ${category.name}`);
      } else {
        console.log(`⏭️ Category already exists: ${category.name}`);
      }
    }
    
    console.log('🎉 Gallery categories setup completed!');
  } catch (error) {
    console.error('❌ Error creating gallery categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createGalleryCategories();