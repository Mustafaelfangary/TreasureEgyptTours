import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkImportedItineraries() {
  try {
    console.log('📊 Checking imported itineraries...\n');

    const itineraries = await prisma.itinerary.findMany({
      include: {
        days: {
          orderBy: { dayNumber: 'asc' }
        },
        pricingTiers: {
          orderBy: { price: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`✅ Found ${itineraries.length} itineraries in the database:\n`);

    itineraries.forEach((itinerary, index) => {
      console.log(`${index + 1}. 🏺 ${itinerary.name}`);
      console.log(`   📅 Duration: ${itinerary.durationDays} days`);
      console.log(`   📝 Days: ${itinerary.days.length} detailed day(s)`);
      console.log(`   💰 Pricing Tiers: ${itinerary.pricingTiers.length}`);
      console.log(`   🌟 Highlights: ${itinerary.highlights.length}`);
      console.log(`   ✅ Status: ${itinerary.isActive ? 'Active' : 'Inactive'}`);
      console.log(`   ⭐ Featured: ${itinerary.featured ? 'Yes' : 'No'}`);
      console.log(`   🔗 Slug: ${itinerary.slug}`);
      console.log(`   📅 Created: ${itinerary.createdAt.toLocaleDateString()}\n`);
    });

    console.log('🎉 Import summary complete!');
    console.log('💡 You can now manage these itineraries in your admin panel at /admin/itineraries');
    
  } catch (error) {
    console.error('❌ Error checking itineraries:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkImportedItineraries();
