-- =============================================================================
-- SANJAY PROPERTIES & SANJAY MANSION - SEED INITIAL DATA
-- =============================================================================

DO $$
DECLARE
    mansion_id UUID;
BEGIN
    -- 1. INSERT WESTERN STAY – SANJAY MANSION PROPERTY
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
        'Sanjay Mansion, Western Stay, Hostel in Saravanampatti, PG in Coimbatore, KCT Tech park accommodation'
    )
    ON CONFLICT (slug) DO UPDATE 
    SET 
        name = EXCLUDED.name,
        short_name = EXCLUDED.short_name,
        tagline = EXCLUDED.tagline,
        primary_phone = EXCLUDED.primary_phone,
        secondary_phone = EXCLUDED.secondary_phone,
        google_maps_url = EXCLUDED.google_maps_url
    RETURNING id INTO mansion_id;

    -- 2. INSERT ACCOMMODATIONS
    DELETE FROM accommodations WHERE property_id = mansion_id;
    INSERT INTO accommodations (property_id, name, badge, price_monthly, price_display, price_note, features, is_recommended, sort_order, is_active)
    VALUES
    (
        mansion_id,
        'Single Occupancy',
        'Private & Quiet',
        8000,
        '₹8,000',
        'per month',
        '["Dedicated Private Room", "Individual Cot & Mattress", "Attached Private Bathroom", "Study Table & Chair", "Secure Cupboard Storage", "Free 60GB High-Speed Wi-Fi", "Solar Hot Water Facility"]'::jsonb,
        false,
        1,
        true
    ),
    (
        mansion_id,
        '2 Sharing',
        'Most Popular',
        5900,
        '₹5,900',
        'per person / month',
        '["Spacious Dual Room", "Two Individual Cots & Mattresses", "Attached Private Bathroom", "Dual Study Desks", "Individual Lockable Cupboards", "Free 60GB High-Speed Wi-Fi", "Solar Hot Water Facility"]'::jsonb,
        true,
        2,
        true
    ),
    (
        mansion_id,
        '4 Sharing',
        'Best Value',
        4900,
        '₹4,900',
        'per person / month',
        '["Well-Ventilated Quad Room", "Four Individual Cots & Mattresses", "Attached Private Bathroom", "Individual Secure Storage", "Free 60GB High-Speed Wi-Fi", "Solar Hot Water Facility", "Laundry & Parking Access"]'::jsonb,
        false,
        3,
        true
    );

    -- 3. INSERT FACILITIES
    DELETE FROM facilities WHERE property_id = mansion_id;
    INSERT INTO facilities (property_id, title, description, icon_name, sort_order, is_active)
    VALUES
    (mansion_id, 'Free Wi-Fi', 'Individual 60GB high-speed data access for work, study and streaming.', 'wifi', 1, true),
    (mansion_id, 'Solar Hot Water', 'Reliable, energy-efficient hot water facility round the clock.', 'sun', 2, true),
    (mansion_id, 'Attached Bathroom', 'Convenient, clean private bathroom facilities for every room.', 'shower-head', 3, true),
    (mansion_id, 'Regular Room Cleaning & Bedsheet Change', 'Regular professional room cleaning and clean bedsheet change.', 'sparkles', 4, true),
    (mansion_id, 'RO Purified Drinking Water', 'Multi-stage purified drinking water accessible on every floor.', 'droplets', 5, true),
    (mansion_id, 'Individual Cot', 'Personal sleeping arrangement with comfortable quality mattress.', 'bed', 6, true),
    (mansion_id, 'Study Table', 'Dedicated workspace for study, laptop usage and reading.', 'book-open', 7, true),
    (mansion_id, 'Secure Storage Cupboard', 'Individual lockable storage wardrobe for belongings.', 'shield-check', 8, true),
    (mansion_id, 'Free Laundry Washing Machine Access', 'Free convenient access to automatic washing machine.', 'waves', 9, true),
    (mansion_id, 'Covered Two-Wheeler Parking', 'Secure covered on-site parking facility for bikes and scooters.', 'bike', 10, true),
    (mansion_id, '24×7 CCTV Surveillance', 'Continuous security camera monitoring throughout common premises.', 'video', 11, true),
    (mansion_id, 'Peaceful, Clean & Natural Environment', 'Clean, serene and natural surroundings inside Sanjay Garden.', 'trees', 12, true);

    -- 4. INSERT MEAL PLANS
    DELETE FROM meal_plans WHERE property_id = mansion_id;
    INSERT INTO meal_plans (property_id, frequency, duration_days, price_approx, daily_rate_approx, description, sort_order, is_active)
    VALUES
    (mansion_id, '1 Time', '26 Days', '₹1,300 approx.', NULL, 'Ideal for residents needing only dinner or lunch daily.', 1, true),
    (mansion_id, '2 Times', '26 Days', '₹2,350 approx.', NULL, 'Includes two wholesome, freshly prepared meals per day.', 2, true),
    (mansion_id, '3 Times', '26 Days', '₹3,600 approx.', '₹140 per day approximately', 'Complete 3-meal plan covering breakfast, lunch and dinner.', 3, true);

    -- 5. INSERT MEAL SUBSCRIPTION RATES (Veg / Non-Veg)
    DELETE FROM meal_subscription_rates WHERE property_id = mansion_id;
    INSERT INTO meal_subscription_rates (property_id, plan_type, monthly_price, weekly_price, tag, sort_order, is_active)
    VALUES
    (mansion_id, 'VEG', '₹3,600', '₹900', 'Pure Vegetarian Meals', 1, true),
    (mansion_id, 'NON-VEG', '₹3,800', '₹950', 'Veg + Non-Veg Specials', 2, true);

    -- 6. INSERT WEEKLY MENU
    DELETE FROM weekly_menu WHERE property_id = mansion_id;
    INSERT INTO weekly_menu (property_id, day_of_week, breakfast, lunch, dinner, is_holiday, sort_order, is_active)
    VALUES
    (mansion_id, 'Monday', 'Idli (4), Sambar, Chutney', 'White Rice, Sambar, Poriyal, Rasam, Curd, Pulikulambu', 'Chapathi + Kurma', false, 1, true),
    (mansion_id, 'Tuesday', 'Dosa (3), Sambar, Chutney', 'Meals, Paneer / Mushroom Pulav', 'Paniyaram (12 pcs) + Chutney', false, 2, true),
    (mansion_id, 'Wednesday', 'Poori (3), Kurma', 'Meals, Veg Biryani / Chicken Biryani + Raita', 'Idli (4) + Chutney + Sambar', false, 3, true),
    (mansion_id, 'Thursday', 'Chapathi + Gravy', 'Rice, Sambar, Poriyal, Curd, Rasam', 'Variety Rice / Dosa', false, 4, true),
    (mansion_id, 'Friday', 'Sevai (Tomato / Lemon / Pudina / Coconut)', 'Rice, Sambar, Poriyal, Rasam, Curd, Pulikulambu, Payasam', 'Palak Chapathi', false, 5, true),
    (mansion_id, 'Saturday', 'Idli (4), Sambar, Chutney', 'Meals, 2 Variety Rice + Poriyal', 'Idiyappam + Kurma', false, 6, true),
    (mansion_id, 'Sunday', 'Holiday', 'Holiday', 'Holiday', true, 7, true);

    -- 7. INSERT GALLERY IMAGES
    DELETE FROM property_images WHERE property_id = mansion_id;
    INSERT INTO property_images (property_id, url, title, category, alt_text, sort_order, is_featured)
    VALUES
    (mansion_id, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85', 'Main Building Elevation', 'Exterior', 'Western Stay Sanjay Mansion building elevation', 1, true),
    (mansion_id, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85', 'Facade & Covered Parking', 'Exterior', 'Facade and covered two wheeler parking area', 2, false),
    (mansion_id, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85', 'Comfortable Individual Room', 'Rooms', 'Comfortable furnished room with cot and study desk', 3, false),
    (mansion_id, 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=85', 'Dedicated Study & Work Desk', 'Interiors', 'Study desk and storage cupboard for students and working professionals', 4, false),
    (mansion_id, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85', 'Peaceful Natural Surroundings', 'Campus', 'Natural green and peaceful atmosphere inside Sanjay Garden', 5, false),
    (mansion_id, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85', 'Attached Clean Bathroom', 'Facilities', 'Clean and modern attached bathroom facility', 6, false);

END $$;

-- 8. INSERT SITE SETTINGS
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
) ON CONFLICT (id) DO UPDATE
SET
    company_name = EXCLUDED.company_name,
    phone = EXCLUDED.phone,
    secondary_phone = EXCLUDED.secondary_phone,
    whatsapp_number = EXCLUDED.whatsapp_number;

-- 9. INSERT INITIAL SAMPLE LEADS FOR DEMONSTRATION
INSERT INTO leads (name, phone, email, source, enquiry_type, status, message, preferred_date, preferred_accommodation, meal_plan, created_at)
VALUES
('Karthik Subramanian', '9842155678', 'karthik.s@gmail.com', 'Sanjay Mansion', 'Mansion Room Booking', 'New', 'Looking for single occupancy room starting next month. Need Wi-Fi for WFH.', '2026-10-01', 'Single Occupancy', 'Veg Plan', NOW() - INTERVAL '2 hours'),
('Priya Sundaram', '9443211234', 'priya.sundar@yahoo.com', 'Sanjay Mansion', 'Mansion Room Booking', 'Contacted', '2 Sharing room enquiry for female software engineer working in KCT tech park.', '2026-09-28', '2 Sharing', '3 Times Plan', NOW() - INTERVAL '1 day'),
('Manojkumar R', '9894087654', 'manoj.r@outlook.com', 'Sanjay Properties', 'Plot Dimensions & Availability', 'New', 'Interested in Corner residential plot in Sanjay Garden.', '2026-10-05', NULL, NULL, NOW() - INTERVAL '3 days'),
('Rajesh V', '8903456789', 'rajesh.v@gmail.com', 'Sanjay Mansion', 'Meal Plan Enquiry', 'Closed', 'Enquired about monthly non-veg meal plan subscription and weekend menu options.', NULL, '4 Sharing', 'Non-Veg Plan', NOW() - INTERVAL '5 days');
