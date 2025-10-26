import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixItinerarySlugs() {
  try {
    console.log('🔧 Fixing problematic itinerary slugs...\n');

    const slugUpdates = [
      {
        currentSlug: 'arrival-at-cairo-airport-assistance-and-our-representative-will-take-you-to-the-hotel-check-in-and-overnight-in-cairo',
        newSlug: '15-days-egypt-dahabiya-experience',
        newName: '15 Days Super Egypt Dahabiya Experience'
      },
      {
        currentSlug: 'day-1-arrival',
        newSlug: '12-days-egypt-dahabiya-red-sea',
        newName: '12 Days Egypt Dahabiya & Red Sea'
      },
      {
        currentSlug: 'day-1-arrival-cairo',
        newSlug: '8-days-egypt-classic-under-sail',
        newName: '8 Days Egypt Classic Under Sail'
      },
      {
        currentSlug: 'luxor-city-karnak',
        newSlug: '6-days-dahabiya-luxor-adventure',
        newName: '6 Days Dahabiya & Luxor Adventure'
      },
      {
        currentSlug: 'esna-el-hegz-island',
        newSlug: '5-days-dahabiya-esna-aswan',
        newName: '5 Days Dahabiya Cruise - Esna to Aswan'
      }
    ];

    for (const { currentSlug, newSlug, newName } of slugUpdates) {
      try {
        // Check if the current slug exists
        const itinerary = await prisma.itinerary.findUnique({
          where: { slug: currentSlug }
        });

        if (itinerary) {
          // Update the itinerary with the new slug
          const updated = await prisma.itinerary.update({
            where: { slug: currentSlug },
            data: {
              slug: newSlug,
              name: newName,
              updatedAt: new Date()
            }
          });
          
          console.log(`✅ Updated slug: ${currentSlug} → ${newSlug}`);
          console.log(`   📝 Name: ${updated.name}`);
        } else {
          console.log(`⚠️  Slug '${currentSlug}' not found`);
        }
      } catch (error) {
        console.log(`❌ Error updating slug '${currentSlug}':`, error);
      }
    }

    // Check the final results
    console.log('\n📊 Final slug status:\n');
    
    const allItineraries = await prisma.itinerary.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        durationDays: true,
        featured: true,
        isActive: true
      },
      orderBy: { durationDays: 'asc' }
    });

    allItineraries.forEach((itinerary, index) => {
      console.log(`${index + 1}. 🏺 ${itinerary.name}`);
      console.log(`   🔗 Slug: ${itinerary.slug}`);
      console.log(`   📅 Duration: ${itinerary.durationDays} days`);
      console.log(`   ⭐ Featured: ${itinerary.featured ? 'Yes' : 'No'}`);
      console.log(`   ✅ Status: ${itinerary.isActive ? 'Active' : 'Inactive'}\n`);
    });

    console.log('🎉 Slug fixes complete!');
    console.log('💡 Your itinerary URLs should now work properly!');
    
  } catch (error) {
    console.error('❌ Error fixing slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixItinerarySlugs();
