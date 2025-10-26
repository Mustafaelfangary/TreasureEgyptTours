-- Create departure schedules table
CREATE TABLE departure_schedule (
    id VARCHAR(255) PRIMARY KEY DEFAULT (LOWER(HEX(RANDOMBLOB(16)))),
    dahabiya VARCHAR(255) NOT NULL,
    route VARCHAR(255) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    departure VARCHAR(255) NOT NULL,
    availability ENUM('Available', 'Limited', 'Full') DEFAULT 'Available',
    price_from VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_active (is_active),
    INDEX idx_sort_order (sort_order)
);

-- Create seasonal rates table
CREATE TABLE seasonal_rate (
    id VARCHAR(255) PRIMARY KEY DEFAULT (LOWER(HEX(RANDOMBLOB(16)))),
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_active (is_active),
    INDEX idx_season (season),
    INDEX idx_sort_order (sort_order)
);

-- Create inclusion items table
CREATE TABLE inclusion_item (
    id VARCHAR(255) PRIMARY KEY DEFAULT (LOWER(HEX(RANDOMBLOB(16)))),
    category ENUM('Included', 'Excluded', 'Optional') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_active (is_active),
    INDEX idx_category (category),
    INDEX idx_sort_order (sort_order)
);

-- Insert some sample data for departure schedules
INSERT INTO departure_schedule (id, dahabiya, route, duration, departure, availability, price_from, description, sort_order) VALUES
('cleopatra-royal-luxor-aswan', 'Cleopatra Royal', 'Luxor - Aswan', '5 Days / 4 Nights', 'Every Monday', 'Available', 'From $1,350', 'Classic Nile journey from ancient Luxor to beautiful Aswan', 1),
('nile-goddess-aswan-luxor', 'Nile Goddess', 'Aswan - Luxor', '4 Days / 3 Nights', 'Every Friday', 'Limited', 'From $1,050', 'Reverse journey from Aswan to Luxor with temple visits', 2),
('pharaoh-dream-extended', 'Pharaoh Dream', 'Luxor - Aswan - Abu Simbel', '7 Days / 6 Nights', 'Every Saturday', 'Available', 'From $2,200', 'Extended journey including Abu Simbel temples', 3);

-- Insert sample data for seasonal rates
INSERT INTO seasonal_rate (id, season, period, cabin_type, single_occupancy, double_occupancy, suite_price, notes, sort_order) VALUES
('high-season-standard', 'High Season', 'October - April', 'Standard Cabin', '$2,100', '$1,350', '$1,850', 'Peak season rates with full service', 1),
('low-season-standard', 'Low Season', 'May - September', 'Standard Cabin', '$1,600', '$1,050', '$1,450', 'Summer season with special offers', 2),
('christmas-new-year', 'Holiday Season', 'December 20 - January 5', 'Standard Cabin', '$2,800', '$1,950', '$2,400', 'Christmas and New Year premium rates', 3);

-- Insert sample data for inclusions
INSERT INTO inclusion_item (id, category, title, description, icon, sort_order) VALUES
('included-meals', 'Included', 'Full Board Meals', 'All meals including breakfast, lunch, dinner, and afternoon tea', '🍽️', 1),
('included-guide', 'Included', 'Expert Egyptologist Guide', 'Professional qualified guide for all historical sites and temples', '🏛️', 2),
('included-transport', 'Included', 'All Transportation', 'Airport transfers and transportation to all sites included', '🚐', 3),
('included-entrance', 'Included', 'Entrance Fees', 'All temple and site entrance fees included in the price', '🎫', 4),
('excluded-flights', 'Excluded', 'International Flights', 'International flights to and from Egypt not included', '✈️', 5),
('excluded-visa', 'Excluded', 'Egypt Visa', 'Tourist visa for Egypt (available on arrival)', '📋', 6),
('excluded-tips', 'Excluded', 'Tips and Gratuities', 'Personal tips for crew and guides not included', '💰', 7),
('optional-balloon', 'Optional', 'Hot Air Balloon', 'Optional hot air balloon ride over Luxor Valley', '🎈', 8);
