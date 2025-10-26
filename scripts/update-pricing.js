const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updatePricing() {
  try {
    console.log('Starting pricing update...');

    // First, let's check if tables exist and create them if needed
    console.log('Ensuring tables exist...');
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS departure_schedule (
          id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
          dahabiya VARCHAR(255) NOT NULL,
          route VARCHAR(255) NOT NULL,
          duration VARCHAR(100) NOT NULL,
          departure VARCHAR(255) NOT NULL,
          availability VARCHAR(50) DEFAULT 'Available',
          price_from VARCHAR(100) NOT NULL,
          description TEXT,
          sort_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS seasonal_rate (
          id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
          season VARCHAR(255) NOT NULL,
          period VARCHAR(255) NOT NULL,
          cabin_type VARCHAR(255) NOT NULL,
          single_occupancy VARCHAR(100) NOT NULL,
          double_occupancy VARCHAR(100) NOT NULL,
          suite_price VARCHAR(100),
          notes TEXT,
          sort_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Clear existing data and insert fresh data with correct pricing
    console.log('Clearing and inserting fresh data with correct pricing...');
    
    await prisma.$executeRaw`DELETE FROM departure_schedule;`;
    await prisma.$executeRaw`DELETE FROM seasonal_rate;`;

    // Insert departure schedules with exact pricing requirements
    await prisma.$executeRaw`
      INSERT INTO departure_schedule (id, dahabiya, route, duration, departure, availability, price_from, description, sort_order) VALUES
      ('premium-3nights-schedule', 'Premium Dahabiya', 'Luxor - Aswan', '3 Nights', 'Daily', 'Available', 'From $1,425', 'Premium category 3 nights package', 1),
      ('premium-4nights-schedule', 'Premium Dahabiya', 'Aswan - Luxor', '4 Nights', 'Daily', 'Available', 'From $1,900', 'Premium category 4 nights package', 2),
      ('luxury-3nights-schedule', 'Luxury Dahabiya', 'Luxor - Aswan', '3 Nights', 'Daily', 'Available', 'From $2,100', 'Luxury category 3 nights package', 3),
      ('luxury-4nights-schedule', 'Luxury Dahabiya', 'Aswan - Luxor', '4 Nights', 'Daily', 'Available', 'From $2,800', 'Luxury category 4 nights package', 4);
    `;

    // Insert seasonal rates with exact pricing requirements
    await prisma.$executeRaw`
      INSERT INTO seasonal_rate (id, season, period, cabin_type, single_occupancy, double_occupancy, suite_price, notes, sort_order) VALUES
      ('premium-3nights-rate', 'Premium Category', '3 Nights Package', 'Premium Cabin', '$2,100', '$1,425', '$1,800', 'Premium category 3 nights - double occupancy $1,425', 1),
      ('premium-4nights-rate', 'Premium Category', '4 Nights Package', 'Premium Cabin', '$2,800', '$1,900', '$2,400', 'Premium category 4 nights - double occupancy $1,900', 2),
      ('luxury-3nights-rate', 'Luxury Category', '3 Nights Package', 'Luxury Cabin', '$3,100', '$2,100', '$2,600', 'Luxury category 3 nights - double occupancy $2,100', 3),
      ('luxury-4nights-rate', 'Luxury Category', '4 Nights Package', 'Luxury Cabin', '$4,200', '$2,800', '$3,500', 'Luxury category 4 nights - double occupancy $2,800', 4);
    `;

    console.log('Pricing update completed successfully!');
    console.log('Updated pricing (default double occupancy):');
    console.log('- Premium Category: 3 nights $1,425, 4 nights $1,900');
    console.log('- Luxury Category: 3 nights $2,100, 4 nights $2,800');

  } catch (error) {
    console.error('Error updating pricing:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updatePricing()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
