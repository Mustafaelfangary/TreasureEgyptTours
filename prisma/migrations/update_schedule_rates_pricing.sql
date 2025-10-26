-- Update pricing for schedule and rates tables
-- Premium category: 3 nights $1,425, 4 nights $1,900
-- Luxury category: 3 nights $2,100, 4 nights $2,800

-- Update departure_schedule table with new premium pricing
UPDATE departure_schedule 
SET price_from = 'From $1,425'
WHERE duration LIKE '%3 Nights%' OR duration LIKE '%3 Days%';

UPDATE departure_schedule 
SET price_from = 'From $1,900'
WHERE duration LIKE '%4 Nights%' OR duration LIKE '%4 Days%';

UPDATE departure_schedule 
SET price_from = 'From $2,100'
WHERE duration LIKE '%5 Nights%' OR duration LIKE '%5 Days%';

UPDATE departure_schedule 
SET price_from = 'From $2,800'
WHERE duration LIKE '%6 Nights%' OR duration LIKE '%6 Days%' OR duration LIKE '%7 Days%';

-- Update seasonal_rate table with new premium and luxury pricing
-- Premium category (Standard Cabin) - 3 nights equivalent
UPDATE seasonal_rate 
SET double_occupancy = '$1,425',
    single_occupancy = '$2,100'
WHERE cabin_type = 'Standard Cabin' AND season = 'Low Season';

-- Premium category (Standard Cabin) - 4 nights equivalent  
UPDATE seasonal_rate 
SET double_occupancy = '$1,900',
    single_occupancy = '$2,800'
WHERE cabin_type = 'Standard Cabin' AND season = 'High Season';

-- Luxury category pricing for holiday season
UPDATE seasonal_rate 
SET double_occupancy = '$2,100',
    single_occupancy = '$2,800',
    suite_price = '$3,200'
WHERE cabin_type = 'Standard Cabin' AND season = 'Holiday Season';

-- Add new premium and luxury cabin types with proper pricing
INSERT INTO seasonal_rate (id, season, period, cabin_type, single_occupancy, double_occupancy, suite_price, notes, sort_order) VALUES
('premium-3nights', 'Premium Category', '3 Nights Package', 'Premium Cabin', '$2,100', '$1,425', '$1,800', 'Premium category 3 nights standard pricing', 10),
('premium-4nights', 'Premium Category', '4 Nights Package', 'Premium Cabin', '$2,800', '$1,900', '$2,400', 'Premium category 4 nights standard pricing', 11),
('luxury-3nights', 'Luxury Category', '3 Nights Package', 'Luxury Cabin', '$3,100', '$2,100', '$2,600', 'Luxury category 3 nights standard pricing', 12),
('luxury-4nights', 'Luxury Category', '4 Nights Package', 'Luxury Cabin', '$4,200', '$2,800', '$3,500', 'Luxury category 4 nights standard pricing', 13);

-- Update existing departure schedules to reflect new pricing structure
UPDATE departure_schedule 
SET 
    price_from = CASE 
        WHEN duration LIKE '%3%' THEN 'From $1,425'
        WHEN duration LIKE '%4%' THEN 'From $1,900'
        WHEN duration LIKE '%5%' THEN 'From $2,100'
        ELSE 'From $2,800'
    END,
    description = CONCAT(description, ' - Updated pricing for Premium/Luxury categories'),
    updated_at = CURRENT_TIMESTAMP;

-- Add timestamp for when this migration was applied
INSERT INTO departure_schedule (id, dahabiya, route, duration, departure, availability, price_from, description, sort_order) VALUES
('pricing-update-log', 'System Update', 'Pricing Migration', 'Applied on ' || datetime('now'), 'Migration Applied', 'Available', 'N/A', 'Pricing updated: Premium (3N: $1,425, 4N: $1,900), Luxury (3N: $2,100, 4N: $2,800)', 999);
