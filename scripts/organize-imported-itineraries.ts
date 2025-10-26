import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function organizeImportedItineraries() {
  try {
    console.log('🔧 Organizing imported itineraries...\n');

    // Define better titles and short descriptions for the imported itineraries
    const itineraryUpdates = [
      {
        slug: 'esna-el-hegz-island',
        updates: {
          name: '5 Days Dahabiya Cruise - Esna to Aswan',
          shortDescription: 'Discover the beauty of Upper Egypt on this 5-day dahabiya journey from Esna to Aswan, visiting El Hegz Island and experiencing authentic Nile navigation.',
          durationDays: 5,
          featured: true,
          price: 1850
        }
      },
      {
        slug: 'luxor-city-karnak',
        updates: {
          name: '6 Days Dahabiya & Luxor Adventure',
          shortDescription: 'Explore the magnificent temples of Luxor and enjoy a traditional dahabiya cruise experience on this comprehensive 6-day journey.',
          durationDays: 6,
          featured: true,
          price: 2200
        }
      },
      {
        slug: 'day-1-arrival-cairo',
        updates: {
          name: '8 Days Egypt Classic Under Sail',
          shortDescription: 'The complete Egyptian experience combining Cairo\'s ancient wonders with a luxurious dahabiya cruise along the timeless Nile River.',
          durationDays: 8,
          featured: true,
          price: 2800
        }
      },
      {
        slug: 'day-1-arrival',
        updates: {
          name: '12 Days Egypt Dahabiya & Red Sea',
          shortDescription: 'Ultimate Egypt adventure combining Nile cruise, historical sites, and Red Sea relaxation in Hurghada for the perfect Egyptian holiday.',
          durationDays: 12,
          featured: false,
          price: 3500
        }
      },
      {
        slug: 'arrival-at-cairo-airport-assistance-and-our-representative-will-take-you-to-the-hotel-check-in-and-overnight-in-cairo',
        updates: {
          name: '15 Days Super Egypt Dahabiya Experience',
          shortDescription: 'The ultimate Egyptian journey featuring comprehensive sightseeing, traditional dahabiya sailing, and cultural immersion across the land of pharaohs.',
          durationDays: 15,
          featured: false,
          price: 4200
        }
      }
    ];

    console.log('📝 Updating itinerary details...\n');

    for (const { slug, updates } of itineraryUpdates) {
      try {
        const updated = await prisma.itinerary.update({
          where: { slug },
          data: {
            ...updates,
            updatedAt: new Date()
          }
        });
        
        console.log(`✅ Updated: ${updated.name}`);
      } catch (error) {
        console.log(`⚠️  Could not update itinerary with slug: ${slug} - it may not exist`);
      }
    }

    console.log('\n🌟 Setting featured itineraries for homepage display...\n');

    // Get the updated itineraries to show the results
    const finalItineraries = await prisma.itinerary.findMany({
      include: {
        days: true,
        pricingTiers: true
      },
      orderBy: { durationDays: 'asc' }
    });

    console.log('📊 Final itinerary status:\n');

    finalItineraries.forEach((itinerary, index) => {
      console.log(`${index + 1}. 🏺 ${itinerary.name}`);
      console.log(`   📅 Duration: ${itinerary.durationDays} days`);
      console.log(`   💰 Price: $${itinerary.price || 'Not set'}`);
      console.log(`   ⭐ Featured: ${itinerary.featured ? 'Yes (will show on homepage)' : 'No'}`);
      console.log(`   📝 Short Description: ${itinerary.shortDescription || 'None'}`);
      console.log(`   📋 Days Details: ${itinerary.days.length} days configured\n`);
    });

    console.log('🎉 Organization complete!');
    console.log('\n💡 Next steps:');
    console.log('1. Visit /admin/itineraries to add images and further customize');
    console.log('2. Featured itineraries will appear on your homepage');
    console.log('3. Adjust pricing in the admin panel as needed');
    console.log('4. Add more highlights and included/excluded items through admin interface\n');

  } catch (error) {
    console.error('❌ Error organizing itineraries:', error);
  } finally {
    await prisma.$disconnect();
  }
}

organizeImportedItineraries();
