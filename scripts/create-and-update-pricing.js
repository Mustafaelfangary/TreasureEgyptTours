const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTablesAndUpdatePricing() {
  try {
    console.log('Creating schedule and rates tables...');

    // Create departure_schedule table
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

    // Create seasonal_rate table
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

    // Create inclusion_item table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS inclusion_item (
          id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
          category VARCHAR(50) NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          icon VARCHAR(10),
          sort_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('Tables created successfully. Inserting initial data...');

    // Insert sample data for departure schedules with updated pricing
    await prisma.$executeRaw`
      INSERT INTO departure_schedule (id, dahabiya, route, duration, departure, availability, price_from, description, sort_order) VALUES
      ('cleopatra-royal-luxor-aswan', 'Cleopatra Royal', 'Luxor - Aswan', '5 Days / 4 Nights', 'Every Monday', 'Available', 'From $1,900', 'Classic Nile journey from ancient Luxor to beautiful Aswan - Premium Category', 1),
      ('nile-goddess-aswan-luxor', 'Nile Goddess', 'Aswan - Luxor', '4 Days / 3 Nights', 'Every Friday', 'Limited', 'From $1,425', 'Reverse journey from Aswan to Luxor with temple visits - Premium Category', 2),
      ('pharaoh-dream-extended', 'Pharaoh Dream', 'Luxor - Aswan - Abu Simbel', '7 Days / 6 Nights', 'Every Saturday', 'Available', 'From $2,800', 'Extended journey including Abu Simbel temples - Luxury Category', 3)
      ON CONFLICT (id) DO UPDATE SET
        price_from = EXCLUDED.price_from,
        description = EXCLUDED.description,
        updated_at = CURRENT_TIMESTAMP;
    `;

    // Insert sample data for seasonal rates with updated pricing
    await prisma.$executeRaw`
      INSERT INTO seasonal_rate (id, season, period, cabin_type, single_occupancy, double_occupancy, suite_price, notes, sort_order) VALUES
      ('premium-3nights', 'Premium Category', '3 Nights Package', 'Premium Cabin', '$2,100', '$1,425', '$1,800', 'Premium category 3 nights standard pricing', 1),
      ('premium-4nights', 'Premium Category', '4 Nights Package', 'Premium Cabin', '$2,800', '$1,900', '$2,400', 'Premium category 4 nights standard pricing', 2),
      ('luxury-3nights', 'Luxury Category', '3 Nights Package', 'Luxury Cabin', '$3,100', '$2,100', '$2,600', 'Luxury category 3 nights standard pricing', 3),
      ('luxury-4nights', 'Luxury Category', '4 Nights Package', 'Luxury Cabin', '$4,200', '$2,800', '$3,500', 'Luxury category 4 nights standard pricing', 4),
      ('high-season-standard', 'High Season', 'October - April', 'Standard Cabin', '$2,800', '$1,900', '$2,400', 'Peak season rates with full service', 5),
      ('low-season-standard', 'Low Season', 'May - September', 'Standard Cabin', '$2,100', '$1,425', '$1,800', 'Summer season with special offers', 6),
      ('christmas-new-year', 'Holiday Season', 'December 20 - January 5', 'Standard Cabin', '$2,800', '$2,100', '$3,200', 'Christmas and New Year premium rates', 7)
      ON CONFLICT (id) DO UPDATE SET
        single_occupancy = EXCLUDED.single_occupancy,
        double_occupancy = EXCLUDED.double_occupancy,
        suite_price = EXCLUDED.suite_price,
        notes = EXCLUDED.notes,
        updated_at = CURRENT_TIMESTAMP;
    `;

    // Insert sample data for inclusions
    await prisma.$executeRaw`
      INSERT INTO inclusion_item (id, category, title, description, icon, sort_order) VALUES
      ('included-meals', 'Included', 'Full Board Meals', 'All meals including breakfast, lunch, dinner, and afternoon tea', '🍽️', 1),
      ('included-guide', 'Included', 'Expert Egyptologist Guide', 'Professional qualified guide for all historical sites and temples', '🏛️', 2),
      ('included-transport', 'Included', 'All Transportation', 'Airport transfers and transportation to all sites included', '🚐', 3),
      ('included-entrance', 'Included', 'Entrance Fees', 'All temple and site entrance fees included in the price', '🎫', 4),
      ('excluded-flights', 'Excluded', 'International Flights', 'International flights to and from Egypt not included', '✈️', 5),
      ('excluded-visa', 'Excluded', 'Egypt Visa', 'Tourist visa for Egypt (available on arrival)', '📋', 6),
      ('excluded-tips', 'Excluded', 'Tips and Gratuities', 'Personal tips for crew and guides not included', '💰', 7),
      ('optional-balloon', 'Optional', 'Hot Air Balloon', 'Optional hot air balloon ride over Luxor Valley', '🎈', 8)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        updated_at = CURRENT_TIMESTAMP;
    `;

    console.log('Pricing update completed successfully!');
    console.log('Updated pricing structure:');
    console.log('- Premium Category: 3 nights $1,425, 4 nights $1,900');
    console.log('- Luxury Category: 3 nights $2,100, 4 nights $2,800');
    console.log('');
    console.log('Tables created and populated:');
    console.log('- departure_schedule: Contains dahabiya schedules with updated pricing');
    console.log('- seasonal_rate: Contains seasonal pricing for different cabin categories');
    console.log('- inclusion_item: Contains what is included/excluded in packages');

  } catch (error) {
    console.error('Error creating tables and updating pricing:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
createTablesAndUpdatePricing()
  .then(() => {
    console.log('Setup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
