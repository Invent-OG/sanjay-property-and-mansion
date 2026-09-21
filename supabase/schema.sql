-- =============================================================================
-- SANJAY PROPERTIES & SANJAY MANSION - SUPABASE DATABASE SCHEMA
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
-- INDEXES FOR MAXIMUM QUERY EFFICIENCY
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
-- AUTO UPDATE TIMESTAMP TRIGGER
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS tr_properties_updated_at ON properties;
CREATE TRIGGER tr_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_accommodations_updated_at ON accommodations;
CREATE TRIGGER tr_accommodations_updated_at BEFORE UPDATE ON accommodations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_facilities_updated_at ON facilities;
CREATE TRIGGER tr_facilities_updated_at BEFORE UPDATE ON facilities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_meal_plans_updated_at ON meal_plans;
CREATE TRIGGER tr_meal_plans_updated_at BEFORE UPDATE ON meal_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_weekly_menu_updated_at ON weekly_menu;
CREATE TRIGGER tr_weekly_menu_updated_at BEFORE UPDATE ON weekly_menu FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_leads_updated_at ON leads;
CREATE TRIGGER tr_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_site_settings_updated_at ON site_settings;
CREATE TRIGGER tr_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_subscription_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 1. PROPERTIES RLS
CREATE POLICY "Public can view active properties" ON properties
    FOR SELECT USING (status = 'active' OR auth.role() = 'authenticated');

CREATE POLICY "Admins full access on properties" ON properties
    FOR ALL USING (auth.role() = 'authenticated');

-- 2. PROPERTY IMAGES RLS
CREATE POLICY "Public can view property images" ON property_images
    FOR SELECT USING (true);

CREATE POLICY "Admins full access on property_images" ON property_images
    FOR ALL USING (auth.role() = 'authenticated');

-- 3. ACCOMMODATIONS RLS
CREATE POLICY "Public can view active accommodations" ON accommodations
    FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admins full access on accommodations" ON accommodations
    FOR ALL USING (auth.role() = 'authenticated');

-- 4. FACILITIES RLS
CREATE POLICY "Public can view active facilities" ON facilities
    FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admins full access on facilities" ON facilities
    FOR ALL USING (auth.role() = 'authenticated');

-- 5. MEAL PLANS RLS
CREATE POLICY "Public can view active meal_plans" ON meal_plans
    FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admins full access on meal_plans" ON meal_plans
    FOR ALL USING (auth.role() = 'authenticated');

-- 6. MEAL SUBSCRIPTION RATES RLS
CREATE POLICY "Public can view active meal rates" ON meal_subscription_rates
    FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admins full access on meal rates" ON meal_subscription_rates
    FOR ALL USING (auth.role() = 'authenticated');

-- 7. WEEKLY MENU RLS
CREATE POLICY "Public can view active weekly menu" ON weekly_menu
    FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admins full access on weekly menu" ON weekly_menu
    FOR ALL USING (auth.role() = 'authenticated');

-- 8. LEADS RLS
CREATE POLICY "Public can insert leads" ON leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view and manage leads" ON leads
    FOR ALL USING (auth.role() = 'authenticated');

-- 9. SITE SETTINGS RLS
CREATE POLICY "Public can view site settings" ON site_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins full access on site settings" ON site_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- =============================================================================
-- STORAGE BUCKET CONFIGURATION (property-images)
-- =============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public can view images
CREATE POLICY "Public can view property images storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Storage RLS: Authenticated admin users can upload images
CREATE POLICY "Admins can upload property images storage"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

-- Storage RLS: Authenticated admin users can delete images
CREATE POLICY "Admins can delete property images storage"
ON storage.objects FOR DELETE
USING (bucket_id = 'property-images' AND auth.role() = 'authenticated');
