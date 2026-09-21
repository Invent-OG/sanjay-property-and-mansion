-- =============================================================================
-- SANJAY PROPERTIES & SANJAY MANSION - FULL DATABASE MIGRATION & SEED
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    long_description TEXT,
    
    -- Address & Location
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    area TEXT NOT NULL DEFAULT 'Saravanampatti',
    city TEXT NOT NULL DEFAULT 'Coimbatore',
    pincode TEXT NOT NULL DEFAULT '641 035',
    full_address TEXT,
    google_maps_url TEXT,
    embed_map_url TEXT,
    
    -- Contact Details
    primary_phone TEXT NOT NULL DEFAULT '8056889900',
    secondary_phone TEXT DEFAULT '8110889900',
    whatsapp_number TEXT DEFAULT '918056889900',
    email TEXT DEFAULT 'enquiries@sanjayproperties.in',
    
    -- Hero Section
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_description TEXT,
    hero_image_url TEXT,
    
    -- Pricing starting display
    pricing_start TEXT DEFAULT '₹4,900',
    
    -- Status & Flags
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'inactive')),
    is_featured_homepage BOOLEAN NOT NULL DEFAULT true,
    
    -- SEO Metadata
    seo_title TEXT,
    seo_description TEXT,
    og_image_url TEXT,
    canonical_url TEXT,
    keywords TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PROPERTY IMAGES TABLE
CREATE TABLE IF NOT EXISTS property_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    storage_path TEXT,
    title TEXT,
    category TEXT DEFAULT 'Exterior' CHECK (category IN ('Exterior', 'Rooms', 'Interiors', 'Campus', 'Facilities', 'Other')),
    alt_text TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ACCOMMODATION OPTIONS TABLE
CREATE TABLE IF NOT EXISTS accommodations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    badge TEXT,
    price_monthly NUMERIC NOT NULL,
    price_display TEXT NOT NULL,
    price_note TEXT DEFAULT 'per month',
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_recommended BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. FACILITIES TABLE
CREATE TABLE IF NOT EXISTS facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    icon_name TEXT NOT NULL DEFAULT 'sparkles',
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. MEAL PLANS TABLE
CREATE TABLE IF NOT EXISTS meal_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    frequency TEXT NOT NULL,
    duration_days TEXT NOT NULL DEFAULT '26 Days',
    price_approx TEXT NOT NULL,
    daily_rate_approx TEXT,
    description TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. MEAL SUBSCRIPTION RATES TABLE (Veg / Non-Veg)
CREATE TABLE IF NOT EXISTS meal_subscription_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('VEG', 'NON-VEG')),
    monthly_price TEXT NOT NULL,
    weekly_price TEXT NOT NULL,
    tag TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. WEEKLY MEAL MENU TABLE
CREATE TABLE IF NOT EXISTS weekly_menu (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    breakfast TEXT NOT NULL,
    lunch TEXT NOT NULL,
    dinner TEXT NOT NULL,
    is_holiday BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. LEADS & ENQUIRIES TABLE (CRM)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    source TEXT NOT NULL DEFAULT 'Sanjay Properties' CHECK (source IN ('Sanjay Properties', 'Sanjay Mansion')),
    enquiry_type TEXT NOT NULL DEFAULT 'General Enquiry',
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Discussion', 'Visit Scheduled', 'Converted', 'Lost')),
    message TEXT,
    preferred_date TEXT,
    time_slot TEXT,
    preferred_accommodation TEXT,
    meal_plan TEXT,
    budget TEXT,
    notes JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. SITE SETTINGS TABLE (Singleton)
CREATE TABLE IF NOT EXISTS site_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    company_name TEXT NOT NULL DEFAULT 'SANJAY PROPERTIES',
    project_name TEXT NOT NULL DEFAULT 'SANJAY GARDEN',
    tagline TEXT DEFAULT 'A Better Address Begins With Better Planning',
    email TEXT NOT NULL DEFAULT 'enquiries@sanjayproperties.in',
    phone TEXT NOT NULL DEFAULT '+91 80568 89900',
    secondary_phone TEXT DEFAULT '+91 81108 89900',
    whatsapp_number TEXT DEFAULT '918056889900',
    full_address TEXT DEFAULT 'Sanjay Garden, PNT Colony, Saravanampatti, Coimbatore, Tamil Nadu – 641035',
    google_maps_url TEXT DEFAULT 'https://maps.app.goo.gl/AJSivYbLohUfKxEA7',
    default_seo_title TEXT DEFAULT 'Sanjay Properties | Sanjay Garden, Saravanampatti, Coimbatore',
    default_seo_description TEXT DEFAULT 'Discover Sanjay Garden residential address and Western Stay Sanjay Mansion in Saravanampatti, Coimbatore by Sanjay Properties.',
    default_og_image TEXT DEFAULT '/og-image.jpg',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(is_featured_homepage);
CREATE INDEX IF NOT EXISTS idx_property_images_prop_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_accommodations_prop_id ON accommodations(property_id);
CREATE INDEX IF NOT EXISTS idx_facilities_prop_id ON facilities(property_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_prop_id ON meal_plans(property_id);
CREATE INDEX IF NOT EXISTS idx_weekly_menu_prop_id ON weekly_menu(property_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_subscription_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to prevent conflicts
DROP POLICY IF EXISTS "Public can view active properties" ON properties;
DROP POLICY IF EXISTS "Admins full access on properties" ON properties;
DROP POLICY IF EXISTS "Public can view property images" ON property_images;
DROP POLICY IF EXISTS "Admins full access on property_images" ON property_images;
DROP POLICY IF EXISTS "Public can view active accommodations" ON accommodations;
DROP POLICY IF EXISTS "Admins full access on accommodations" ON accommodations;
DROP POLICY IF EXISTS "Public can view active facilities" ON facilities;
DROP POLICY IF EXISTS "Admins full access on facilities" ON facilities;
DROP POLICY IF EXISTS "Public can view active meal_plans" ON meal_plans;
DROP POLICY IF EXISTS "Admins full access on meal_plans" ON meal_plans;
DROP POLICY IF EXISTS "Public can view active meal rates" ON meal_subscription_rates;
DROP POLICY IF EXISTS "Admins full access on meal rates" ON meal_subscription_rates;
DROP POLICY IF EXISTS "Public can view active weekly menu" ON weekly_menu;
DROP POLICY IF EXISTS "Admins full access on weekly menu" ON weekly_menu;
DROP POLICY IF EXISTS "Public can insert leads" ON leads;
DROP POLICY IF EXISTS "Admins can view and manage leads" ON leads;
DROP POLICY IF EXISTS "Public can view site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins full access on site settings" ON site_settings;

-- Create RLS Policies
CREATE POLICY "Public can view active properties" ON properties FOR SELECT USING (status = 'active' OR auth.role() = 'authenticated');
CREATE POLICY "Admins full access on properties" ON properties FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view property images" ON property_images FOR SELECT USING (true);
CREATE POLICY "Admins full access on property_images" ON property_images FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view active accommodations" ON accommodations FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Admins full access on accommodations" ON accommodations FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view active facilities" ON facilities FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Admins full access on facilities" ON facilities FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view active meal_plans" ON meal_plans FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Admins full access on meal_plans" ON meal_plans FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view active meal rates" ON meal_subscription_rates FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Admins full access on meal rates" ON meal_subscription_rates FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view active weekly menu" ON weekly_menu FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Admins full access on weekly menu" ON weekly_menu FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can insert leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view and manage leads" ON leads FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admins full access on site settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- =============================================================================
-- STORAGE BUCKET CONFIGURATION (property-images)
-- =============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view property images storage" ON storage.objects;
CREATE POLICY "Public can view property images storage" ON storage.objects FOR SELECT USING (bucket_id = 'property-images');

DROP POLICY IF EXISTS "Admins can upload property images storage" ON storage.objects;
CREATE POLICY "Admins can upload property images storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can delete property images storage" ON storage.objects;
CREATE POLICY "Admins can delete property images storage" ON storage.objects FOR DELETE USING (bucket_id = 'property-images' AND auth.role() = 'authenticated');

-- =============================================================================
-- SEED INITIAL DATA
-- =============================================================================
DO $$
DECLARE
    mansion_id UUID;
BEGIN
    -- 1. Insert Property
    INSERT INTO properties (
        slug,
        name,
        short_name,
        tagline,
        description,
        long_description,
        address_line1,
        address_line2,
        area,
        city,
        pincode,
        full_address,
        google_maps_url,
        embed_map_url,
        primary_phone,
        secondary_phone,
        whatsapp_number,
        email,
        hero_title,
        hero_subtitle,
        hero_description,
        hero_image_url,
        pricing_start,
        status,
        is_featured_homepage,
        seo_title,
        seo_description,
        og_image_url,
        canonical_url,
        keywords
    ) VALUES (
        'sanjay-mansion',
        'WESTERN STAY – SANJAY MANSION',
        'Sanjay Mansion',
        'Your Home Away From Home',
        'A peaceful and comfortable stay in Saravanampatti, Coimbatore, designed with essential facilities, clean surroundings and convenient accommodation options.',
        'Western Stay – Sanjay Mansion offers a peaceful and comfortable accommodation experience in Saravanampatti, Coimbatore. Located near KCT Tech Park, the property is designed for convenient living with essential facilities, individual accommodation options, clean surroundings and a secure environment.',
        'No. 6, Sanjay Garden',
        'Opp. KCT Tech Park',
        'Saravanampatti',
        'Coimbatore',
        '641 035',
        'No. 6, Sanjay Garden, Opp. KCT Tech Park, Saravanampatti, Coimbatore – 641 035',
        'https://maps.app.goo.gl/AJSivYbLohUfKxEA7',
        'https://maps.google.com/maps?q=11.0827,76.9942+(Western%20Stay%20-%20Sanjay%20Mansion)&t=&z=16&ie=UTF8&iwloc=&output=embed',
        '8056889900',
        '8110889900',
        '918056889900',
        'enquiries@sanjayproperties.in',
        'WESTERN STAY – SANJAY MANSION',
        'Your Home Away From Home',
        'A peaceful and comfortable stay in Saravanampatti, Coimbatore, with quality accommodation, modern amenities and clean surroundings.',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
        '₹4,900',
        'active',
        true,
        'Western Stay – Sanjay Mansion | Saravanampatti, Coimbatore',
        'Western Stay – Sanjay Mansion in Saravanampatti, Coimbatore offers comfortable accommodation with Wi-Fi, solar hot water, attached bathrooms, RO drinking water, laundry access, parking and 24×7 CCTV surveillance.',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        'https://sanjayproperties.in/sanjay-mansion',
        'Sanjay Mansion, Western Stay, Hostel in Saravanampatti, PG in Coimbatore'
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        updated_at = NOW()
    RETURNING id INTO mansion_id;

    -- Clean old child relations if updating
    DELETE FROM accommodations WHERE property_id = mansion_id;
    DELETE FROM facilities WHERE property_id = mansion_id;
    DELETE FROM meal_plans WHERE property_id = mansion_id;
    DELETE FROM meal_subscription_rates WHERE property_id = mansion_id;
    DELETE FROM weekly_menu WHERE property_id = mansion_id;
    DELETE FROM property_images WHERE property_id = mansion_id;

    -- 2. Insert Accommodations
    INSERT INTO accommodations (property_id, name, badge, price_monthly, price_display, price_note, features, is_recommended, sort_order)
    VALUES
        (mansion_id, 'Four Sharing Room', 'Budget Friendly', 4900, '₹4,900', 'per person / month', '["Individual Bed & Storage Wardrobe", "Solar Heated 24×7 Hot Water", "High-Speed Wi-Fi Internet Included", "Clean Regular Housekeeping Included"]'::jsonb, false, 1),
        (mansion_id, 'Double Sharing Room', 'Most Popular', 6500, '₹6,500', 'per person / month', '["Spacious Double Bed Configuration", "Attached Clean Restroom", "Study Desk Space & Power Points", "Peaceful & Quiet Environment"]'::jsonb, true, 2),
        (mansion_id, 'Single Private Room', 'Maximum Privacy', 9500, '₹9,500', 'per month', '["Complete Single Private Room", "Dedicated Workspace & Storage", "Premium Natural Ventilation", "Full Access to All Mansion Amenities"]'::jsonb, false, 3);

    -- 3. Insert Facilities
    INSERT INTO facilities (property_id, title, description, icon_name, sort_order)
    VALUES
        (mansion_id, 'High-Speed Wi-Fi', 'Fast and reliable high-speed internet access across rooms and common areas.', 'wifi', 1),
        (mansion_id, 'Solar Hot Water', 'Eco-friendly solar powered 24×7 hot water system for all attached bathrooms.', 'sun', 2),
        (mansion_id, 'Attached Bathrooms', 'Modern, well-maintained and hygienic attached restrooms in every room.', 'shower-head', 3),
        (mansion_id, 'RO Drinking Water', 'Clean and purified multi-stage reverse osmosis mineral drinking water on all floors.', 'droplets', 4),
        (mansion_id, 'Daily Housekeeping', 'Regular cleaning and sanitation of rooms, corridors and common living zones.', 'sparkles', 5),
        (mansion_id, 'CCTV Surveillance', 'Round-the-clock 24×7 security surveillance for safety and peace of mind.', 'shield-check', 6),
        (mansion_id, 'Vehicle Parking', 'Dedicated and secure parking space for two-wheelers and resident vehicles.', 'bike', 7),
        (mansion_id, 'Spacious Balconies', 'Open, airy balconies and rooftop area with green surrounding campus views.', 'trees', 8);

    -- 4. Insert Meal Subscription Rates
    INSERT INTO meal_subscription_rates (property_id, plan_type, monthly_price, weekly_price, tag, sort_order)
    VALUES
        (mansion_id, 'VEG', '₹3,500', '₹950', 'Pure Veg Homestyle', 1),
        (mansion_id, 'NON-VEG', '₹4,200', '₹1,150', 'Includes Non-Veg Specials', 2);

    -- 5. Insert Meal Plans
    INSERT INTO meal_plans (property_id, frequency, duration_days, price_approx, daily_rate_approx, description, sort_order)
    VALUES
        (mansion_id, '1 Time / Day (Lunch or Dinner)', '26 Days', '₹1,500 – ₹1,800', '₹60 – ₹70/day', 'Flexible single meal plan suitable for working professionals.', 1),
        (mansion_id, '2 Times / Day (Lunch & Dinner)', '26 Days', '₹3,000 – ₹3,500', '₹115 – ₹135/day', 'Balanced standard meal plan with authentic home-cooked taste.', 2),
        (mansion_id, '3 Times / Day (Full Day Mess)', '26 Days', '₹3,800 – ₹4,200', '₹145 – ₹160/day', 'Complete daily nutrition covering breakfast, lunch and dinner.', 3);

    -- 6. Insert Weekly Menu
    INSERT INTO weekly_menu (property_id, day_of_week, breakfast, lunch, dinner, sort_order)
    VALUES
        (mansion_id, 'Monday', 'Idli, Sambar, Coconut Chutney, Tea / Coffee', 'Rice, Sambar, Poriyal, Kootu, Rasam, Curd, Appalam', 'Chapati, Dal Tadka, Veg Curry, Rice', 1),
        (mansion_id, 'Tuesday', 'Puri Masala, Chana Gravy, Tea / Coffee', 'Rice, Karakuzhambu, Aviyal, Rasam, Butter Milk, Appalam', 'Dosa, Tomato Chutney, Sambar, Rice', 2),
        (mansion_id, 'Wednesday', 'Pongal, Medu Vada, Coconut Chutney, Sambar', 'Rice, Non-Veg Chicken Gravy / Veg Paneer Butter Masala, Rasam, Curd', 'Parotta, Veg / Chicken Salna, Rice', 3),
        (mansion_id, 'Thursday', 'Semiya Upma / Rava Kichadi, Chutney, Sambar', 'Rice, Mor Kuzhambu, Beetroot Poriyal, Rasam, Curd', 'Variety Rice / Fried Rice, Gobi Manchurian', 4),
        (mansion_id, 'Friday', 'Idiyappam, Coconut Milk / Kurma, Tea / Coffee', 'South Indian Special Meals, Payasam, Vada, Curd', 'Chapati, Mixed Veg Kurma, Jeera Rice', 5),
        (mansion_id, 'Saturday', 'Rava Dosa, Sambar, Mint Chutney, Tea / Coffee', 'Vegetable Pulao / Briyani, Onion Raitha, Poriyal, Rasam', 'Idli, Chutney, Tiffin Sambar, Rice', 6),
        (mansion_id, 'Sunday', 'Poori / Aloo Paratha, Curd, Pickle, Tea', 'Special Sunday Chicken Briyani / Paneer Dum Briyani, Raitha, Egg, Dessert', 'Light Dinner: Phulka, Paneer Gravy, Curd Rice', 7);

    -- 7. Insert Initial Gallery Images
    INSERT INTO property_images (property_id, url, title, category, sort_order, is_featured)
    VALUES
        (mansion_id, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', 'Mansion Exterior Architecture', 'Exterior', 1, true),
        (mansion_id, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', 'Clean & Spacious Bed Room', 'Rooms', 2, false),
        (mansion_id, 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80', 'Single & Double Accommodation', 'Rooms', 3, false),
        (mansion_id, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80', 'Modern Attached Restrooms', 'Interiors', 4, false);

    -- 8. Insert Site Settings
    INSERT INTO site_settings (
        id,
        company_name,
        project_name,
        tagline,
        email,
        phone,
        secondary_phone,
        whatsapp_number,
        full_address,
        google_maps_url,
        default_seo_title,
        default_seo_description,
        default_og_image
    ) VALUES (
        'global',
        'SANJAY PROPERTIES',
        'SANJAY GARDEN',
        'A Better Address Begins With Better Planning',
        'enquiries@sanjayproperties.in',
        '+91 80568 89900',
        '+91 81108 89900',
        '918056889900',
        'Sanjay Garden, PNT Colony, Saravanampatti, Coimbatore, Tamil Nadu – 641035',
        'https://maps.app.goo.gl/AJSivYbLohUfKxEA7',
        'Sanjay Properties | Sanjay Garden, Saravanampatti, Coimbatore',
        'Discover Sanjay Garden residential address and Western Stay Sanjay Mansion in Saravanampatti, Coimbatore by Sanjay Properties.',
        '/og-image.jpg'
    ) ON CONFLICT (id) DO UPDATE SET
        company_name = EXCLUDED.company_name,
        updated_at = NOW();

END $$;
