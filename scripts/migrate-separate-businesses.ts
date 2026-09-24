import * as dotenv from 'dotenv';
dotenv.config();

import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || '';
if (!connectionString) {
  console.error('DATABASE_URL is missing in .env');
  process.exit(1);
}

const sql = postgres(connectionString);

async function migrate() {
  console.log('🚀 Migrating database to separate Sanjay Properties & Western Stay...');

  // 1. PROPERTIES (REAL ESTATE)
  console.log('1. Setting up Real Estate properties tables...');
  await sql`
    CREATE TABLE IF NOT EXISTS properties (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      short_name TEXT NOT NULL,
      property_type TEXT NOT NULL DEFAULT 'Land / Plot',
      status TEXT NOT NULL DEFAULT 'available',
      tagline TEXT,
      description TEXT,
      long_description TEXT,
      address_line1 TEXT NOT NULL,
      address_line2 TEXT,
      area TEXT NOT NULL DEFAULT 'Saravanampatti',
      city TEXT NOT NULL DEFAULT 'Coimbatore',
      pincode TEXT NOT NULL DEFAULT '641 035',
      full_address TEXT,
      google_maps_url TEXT,
      embed_map_url TEXT,
      price_display TEXT DEFAULT '₹25 Lakhs onwards',
      price_numeric NUMERIC,
      size_display TEXT DEFAULT '1200 - 2400 sq.ft',
      highlights JSONB DEFAULT '[]'::jsonb,
      primary_phone TEXT NOT NULL DEFAULT '8056889900',
      secondary_phone TEXT DEFAULT '8110889900',
      whatsapp_number TEXT DEFAULT '918056889900',
      email TEXT DEFAULT 'enquiries@sanjayproperties.in',
      hero_image_url TEXT,
      is_featured BOOLEAN NOT NULL DEFAULT true,
      seo_title TEXT,
      seo_description TEXT,
      og_image_url TEXT,
      canonical_url TEXT,
      keywords TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql.unsafe(`
    ALTER TABLE properties ADD COLUMN IF NOT EXISTS property_type TEXT NOT NULL DEFAULT 'Land / Plot';
    ALTER TABLE properties ADD COLUMN IF NOT EXISTS price_display TEXT DEFAULT '₹25 Lakhs onwards';
    ALTER TABLE properties ADD COLUMN IF NOT EXISTS price_numeric NUMERIC;
    ALTER TABLE properties ADD COLUMN IF NOT EXISTS size_display TEXT DEFAULT '1200 - 2400 sq.ft';
    ALTER TABLE properties ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT true;
  `);

  await sql`
    CREATE TABLE IF NOT EXISTS property_images (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      url TEXT NOT NULL,
      storage_path TEXT,
      title TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_featured BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS property_features (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      icon_name TEXT NOT NULL DEFAULT 'check',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS property_enquiries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      budget TEXT,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'NEW',
      notes JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  // 2. WESTERN STAY (PG / HOSTEL DOMAIN)
  console.log('2. Setting up Western Stay PG / Hostel tables...');
  await sql`
    CREATE TABLE IF NOT EXISTS western_stay_settings (
      id TEXT PRIMARY KEY DEFAULT 'singleton',
      business_name TEXT NOT NULL DEFAULT 'WESTERN STAY – SANJAY MANSION',
      tagline TEXT DEFAULT 'Your Home Away From Home',
      description TEXT DEFAULT 'A peaceful and comfortable stay in Saravanampatti, Coimbatore, designed with essential facilities, clean surroundings and convenient accommodation options.',
      address_line1 TEXT NOT NULL DEFAULT 'No. 6, Sanjay Garden',
      address_line2 TEXT DEFAULT 'Opp. KCT Tech Park',
      area TEXT NOT NULL DEFAULT 'Saravanampatti',
      city TEXT NOT NULL DEFAULT 'Coimbatore',
      pincode TEXT NOT NULL DEFAULT '641 035',
      full_address TEXT DEFAULT 'No. 6, Sanjay Garden, Opp. KCT Tech Park, Saravanampatti, Coimbatore – 641 035',
      primary_phone TEXT NOT NULL DEFAULT '8056889900',
      secondary_phone TEXT DEFAULT '8110889900',
      whatsapp_number TEXT DEFAULT '918056889900',
      email TEXT DEFAULT 'enquiries@sanjayproperties.in',
      google_maps_url TEXT DEFAULT 'https://maps.app.goo.gl/AJSivYbLohUfKxEA7',
      embed_map_url TEXT DEFAULT 'https://maps.google.com/maps?q=11.0827,76.9942+(Western%20Stay%20-%20Sanjay%20Mansion)&t=&z=16&ie=UTF8&iwloc=&output=embed',
      hero_title TEXT DEFAULT 'WESTERN STAY – SANJAY MANSION',
      hero_subtitle TEXT DEFAULT 'Your Home Away From Home',
      hero_description TEXT DEFAULT 'A peaceful and comfortable stay in Saravanampatti, Coimbatore, with quality accommodation, modern amenities and clean surroundings.',
      hero_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
      seo_title TEXT DEFAULT 'Western Stay – Sanjay Mansion | Saravanampatti, Coimbatore',
      seo_description TEXT DEFAULT 'Western Stay – Sanjay Mansion in Saravanampatti, Coimbatore offers comfortable accommodation with Wi-Fi, solar hot water, attached bathrooms, RO drinking water, laundry access, parking and 24×7 CCTV surveillance.',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS western_stay_room_types (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      max_occupants INTEGER NOT NULL DEFAULT 1,
      monthly_price NUMERIC NOT NULL,
      price_display TEXT NOT NULL,
      weekly_price TEXT,
      daily_price TEXT,
      security_deposit TEXT DEFAULT '₹5,000',
      ac_available BOOLEAN NOT NULL DEFAULT false,
      ac_surcharge TEXT DEFAULT 'Available on request',
      features JSONB DEFAULT '[]'::jsonb,
      is_recommended BOOLEAN NOT NULL DEFAULT false,
      display_order INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS western_stay_rooms (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      room_number TEXT NOT NULL UNIQUE,
      room_type_id UUID NOT NULL REFERENCES western_stay_room_types(id) ON DELETE CASCADE,
      floor TEXT NOT NULL DEFAULT '1st Floor',
      monthly_price NUMERIC NOT NULL,
      status TEXT NOT NULL DEFAULT 'AVAILABLE',
      notes TEXT,
      images JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS western_stay_occupants (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      room_id UUID REFERENCES western_stay_rooms(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      occupancy_type TEXT NOT NULL DEFAULT 'Single',
      check_in_date TEXT NOT NULL,
      expected_check_out_date TEXT,
      monthly_rent NUMERIC NOT NULL,
      security_deposit NUMERIC DEFAULT 0,
      id_proof_type TEXT,
      id_proof_number TEXT,
      notes TEXT,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS western_stay_bookings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      room_id UUID REFERENCES western_stay_rooms(id) ON DELETE SET NULL,
      room_type_id UUID REFERENCES western_stay_room_types(id) ON DELETE SET NULL,
      occupant_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      check_in_date TEXT NOT NULL,
      check_out_date TEXT,
      advance_amount NUMERIC DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'confirmed',
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS western_stay_facilities (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT,
      icon_name TEXT NOT NULL DEFAULT 'sparkles',
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS western_stay_meal_plans (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      frequency TEXT NOT NULL,
      duration_days TEXT NOT NULL DEFAULT '26 Days',
      price_approx TEXT NOT NULL,
      daily_rate_approx TEXT,
      description TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS western_stay_menu (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      day_of_week TEXT NOT NULL,
      breakfast TEXT NOT NULL,
      lunch TEXT NOT NULL,
      dinner TEXT NOT NULL,
      is_holiday BOOLEAN NOT NULL DEFAULT false,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS western_stay_images (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      url TEXT NOT NULL,
      storage_path TEXT,
      title TEXT,
      category TEXT DEFAULT 'Exterior',
      alt_text TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_featured BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS western_stay_enquiries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      room_type TEXT NOT NULL DEFAULT 'Single Occupancy',
      preferred_date TEXT,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'NEW',
      notes JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  // 3. APPLY RLS POLICIES
  console.log('3. Applying Row Level Security (RLS) policies...');
  const publicTables = [
    'properties',
    'property_images',
    'property_features',
    'property_enquiries',
    'western_stay_settings',
    'western_stay_room_types',
    'western_stay_rooms',
    'western_stay_facilities',
    'western_stay_meal_plans',
    'western_stay_menu',
    'western_stay_images',
    'western_stay_enquiries',
    'western_stay_occupants',
    'western_stay_bookings',
    'site_settings',
    'leads'
  ];

  for (const t of publicTables) {
    await sql.unsafe(`ALTER TABLE ${t} ENABLE ROW LEVEL SECURITY;`);
    await sql.unsafe(`DROP POLICY IF EXISTS "Allow all ${t}" ON ${t};`);
    await sql.unsafe(`CREATE POLICY "Allow all ${t}" ON ${t} FOR ALL TO public USING (true) WITH CHECK (true);`);
  }

  // 4. SEED SAMPLE REAL ESTATE PROPERTY: SANJAY GARDENS
  console.log('4. Seeding Sanjay Properties Real Estate: Sanjay Gardens...');
  // Delete old western-stay entry from properties table if it exists
  await sql`DELETE FROM properties WHERE slug = 'sanjay-mansion';`;

  const [sanjayGardens] = await sql`
    INSERT INTO properties (
      slug, name, short_name, property_type, status, tagline, description, long_description,
      address_line1, address_line2, area, city, pincode, full_address, google_maps_url,
      price_display, price_numeric, size_display, highlights, primary_phone, secondary_phone,
      whatsapp_number, email, hero_image_url, is_featured, seo_title, seo_description
    ) VALUES (
      'sanjay-gardens',
      'SANJAY GARDENS',
      'Sanjay Gardens',
      'Land / Plot',
      'available',
      'Premium Villa Plots in Saravanampatti',
      'DTCP approved residential villa plots in a serene and fast-developing prime neighborhood of Saravanampatti, Coimbatore.',
      'Sanjay Gardens is a signature residential layout developed by Sanjay Properties in Saravanampatti, Coimbatore. Offering DTCP-approved residential plots with well-laid 30-feet tar roads, street lighting, 24x7 water connection, and clear legal titles.',
      'Sanjay Garden, PNT Colony',
      'Opp. KCT Tech Park',
      'Saravanampatti',
      'Coimbatore',
      '641 035',
      'Sanjay Garden, PNT Colony, Saravanampatti, Coimbatore – 641 035',
      'https://maps.app.goo.gl/AJSivYbLohUfKxEA7',
      '₹25 Lakhs onwards',
      2500000,
      '1,200 - 2,400 sq.ft',
      '["DTCP Approved Plots", "Clear Legal Title", "30ft Wide Tar Roads", "Street Lights & Electricity", "24x7 Potable Water", "Near Top IT Parks & Colleges"]'::jsonb,
      '8056889900',
      '8110889900',
      '918056889900',
      'enquiries@sanjayproperties.in',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85',
      true,
      'Sanjay Gardens | DTCP Villa Plots in Saravanampatti, Coimbatore',
      'Explore premium residential plots and villa sites at Sanjay Gardens, Saravanampatti, Coimbatore by Sanjay Properties.'
    )
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      property_type = EXCLUDED.property_type,
      updated_at = NOW()
    RETURNING id;
  `;

  // 5. SEED WESTERN STAY SETTINGS
  console.log('5. Seeding Western Stay Settings...');
  await sql`
    INSERT INTO western_stay_settings (
      id, business_name, tagline, description, address_line1, address_line2, area, city, pincode, full_address,
      primary_phone, secondary_phone, whatsapp_number, email, google_maps_url, embed_map_url,
      hero_title, hero_subtitle, hero_description, hero_image_url
    ) VALUES (
      'singleton',
      'WESTERN STAY – SANJAY MANSION',
      'Your Home Away From Home',
      'A peaceful and comfortable stay in Saravanampatti, Coimbatore, designed with essential facilities, clean surroundings and convenient accommodation options.',
      'No. 6, Sanjay Garden',
      'Opp. KCT Tech Park',
      'Saravanampatti',
      'Coimbatore',
      '641 035',
      'No. 6, Sanjay Garden, Opp. KCT Tech Park, Saravanampatti, Coimbatore – 641 035',
      '8056889900',
      '8110889900',
      '918056889900',
      'enquiries@sanjayproperties.in',
      'https://maps.app.goo.gl/AJSivYbLohUfKxEA7',
      'https://maps.google.com/maps?q=11.0827,76.9942+(Western%20Stay%20-%20Sanjay%20Mansion)&t=&z=16&ie=UTF8&iwloc=&output=embed',
      'WESTERN STAY – SANJAY MANSION',
      'Your Home Away From Home',
      'A peaceful and comfortable stay in Saravanampatti, Coimbatore, with quality accommodation, modern amenities and clean surroundings.',
      '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.20.jpeg'
    )
    ON CONFLICT (id) DO UPDATE SET
      business_name = EXCLUDED.business_name,
      updated_at = NOW();
  `;

  // 6. SEED WESTERN STAY ROOM TYPES
  console.log('6. Seeding Western Stay Room Types...');
  await sql`DELETE FROM western_stay_rooms;`;
  await sql`DELETE FROM western_stay_room_types;`;

  const roomTypesData = [
    {
      name: 'Single Occupancy',
      slug: 'single-occupancy',
      description: 'Private individual room with dedicated work desk and attached bathroom.',
      maxOccupants: 1,
      monthlyPrice: 8000,
      priceDisplay: '₹8,000',
      weeklyPrice: '₹2,200',
      dailyPrice: '₹450',
      securityDeposit: '₹5,000',
      acAvailable: true,
      acSurcharge: 'Available on request (₹1,500/mo)',
      features: JSON.stringify([
        'Private Single Cot & Quality Mattress',
        'Attached Private Bathroom & Geyser',
        'Study Table, Chair & Personal Wardrobe',
        'High-Speed Wi-Fi & Power Backup'
      ]),
      isRecommended: true,
      displayOrder: 1
    },
    {
      name: '2 Sharing',
      slug: '2-sharing',
      description: 'Comfortable twin sharing room with personal storage and attached bath.',
      maxOccupants: 2,
      monthlyPrice: 5900,
      priceDisplay: '₹5,900',
      weeklyPrice: '₹1,650',
      dailyPrice: '₹350',
      securityDeposit: '₹5,000',
      acAvailable: true,
      acSurcharge: 'Available on request',
      features: JSON.stringify([
        'Twin Beds with Storage Underneath',
        'Attached Bathroom with Hot Water',
        'Individual Wardrobes & Study Desks',
        'Regular Room Cleaning Included'
      ]),
      isRecommended: false,
      displayOrder: 2
    },
    {
      name: '4 Sharing',
      slug: '4-sharing',
      description: 'Budget-friendly 4 sharing room perfect for students and young professionals.',
      maxOccupants: 4,
      monthlyPrice: 4900,
      priceDisplay: '₹4,900',
      weeklyPrice: '₹1,350',
      dailyPrice: '₹300',
      securityDeposit: '₹4,000',
      acAvailable: false,
      acSurcharge: 'Not available',
      features: JSON.stringify([
        'Individual Bed & Locked Wardrobe',
        'Solar Heated 24×7 Hot Water',
        'High-Speed Wi-Fi Internet Included',
        'Clean Housekeeping & Filtered RO Water'
      ]),
      isRecommended: false,
      displayOrder: 3
    }
  ];

  const createdRoomTypes: Record<string, string> = {};
  for (const rt of roomTypesData) {
    const [row] = await sql`
      INSERT INTO western_stay_room_types (
        name, slug, description, max_occupants, monthly_price, price_display,
        weekly_price, daily_price, security_deposit, ac_available, ac_surcharge,
        features, is_recommended, display_order, is_active
      ) VALUES (
        ${rt.name}, ${rt.slug}, ${rt.description}, ${rt.maxOccupants}, ${rt.monthlyPrice}, ${rt.priceDisplay},
        ${rt.weeklyPrice}, ${rt.dailyPrice}, ${rt.securityDeposit}, ${rt.acAvailable}, ${rt.acSurcharge},
        ${rt.features}::jsonb, ${rt.isRecommended}, ${rt.displayOrder}, true
      ) RETURNING id, slug;
    `;
    createdRoomTypes[row.slug] = row.id;
  }

  // 7. SEED PHYSICAL ROOM INVENTORY
  console.log('7. Seeding Western Stay Physical Room Inventory (101, 102, 103, 104, 201, 202, 203, 204)...');
  const roomsData = [
    { roomNumber: '101', slug: 'single-occupancy', floor: '1st Floor', price: 8000, status: 'AVAILABLE', notes: 'East-facing window, garden view' },
    { roomNumber: '102', slug: '2-sharing', floor: '1st Floor', price: 5900, status: 'OCCUPIED', notes: 'Occupied by working professionals' },
    { roomNumber: '103', slug: '2-sharing', floor: '1st Floor', price: 5900, status: 'AVAILABLE', notes: 'Ready for immediate move-in' },
    { roomNumber: '104', slug: '4-sharing', floor: '1st Floor', price: 4900, status: 'MAINTENANCE', notes: 'Repainting and plumbing check underway' },
    { roomNumber: '201', slug: '4-sharing', floor: '2nd Floor', price: 4900, status: 'OCCUPIED', notes: 'Occupied by college students' },
    { roomNumber: '202', slug: '2-sharing', floor: '2nd Floor', price: 5900, status: 'AVAILABLE', notes: 'Spacious balcony access' },
    { roomNumber: '203', slug: 'single-occupancy', floor: '2nd Floor', price: 8000, status: 'RESERVED', notes: 'Reserved for move-in next week' },
    { roomNumber: '204', slug: '4-sharing', floor: '2nd Floor', price: 4900, status: 'OCCUPIED', notes: 'Full capacity' },
  ];

  const createdRooms: Record<string, string> = {};
  for (const r of roomsData) {
    const roomTypeId = createdRoomTypes[r.slug];
    const [row] = await sql`
      INSERT INTO western_stay_rooms (
        room_number, room_type_id, floor, monthly_price, status, notes
      ) VALUES (
        ${r.roomNumber}, ${roomTypeId}, ${r.floor}, ${r.price}, ${r.status}, ${r.notes}
      ) RETURNING id, room_number;
    `;
    createdRooms[row.room_number] = row.id;
  }

  // 8. SEED OCCUPANTS (ADMIN PRIVATE DATA)
  console.log('8. Seeding sample Western Stay occupants...');
  await sql`DELETE FROM western_stay_occupants;`;
  await sql`
    INSERT INTO western_stay_occupants (
      room_id, name, phone, email, occupancy_type, check_in_date, expected_check_out_date,
      monthly_rent, security_deposit, id_proof_type, id_proof_number, notes, is_active
    ) VALUES 
    (
      ${createdRooms['102']}, 'Rahul Sharma', '+91 80568 89901', 'rahul.s@techpark.com', '2 Sharing', '2026-01-10', '2026-12-31',
      5900, 5000, 'Aadhaar', 'XXXX-XXXX-1234', 'Software engineer at KCT Tech Park', true
    ),
    (
      ${createdRooms['201']}, 'Karthik Raja', '+91 98765 43210', 'karthik.raja@gmail.com', '4 Sharing', '2026-02-01', '2026-07-31',
      4900, 4000, 'College ID', 'KCT-ENG-2024', 'Final year engineering student', true
    ),
    (
      ${createdRooms['204']}, 'Ananya Sundaram', '+91 98432 10987', 'ananya.s@infotech.in', '4 Sharing', '2026-03-01', '2027-02-28',
      4900, 4000, 'Driving License', 'TN-38-2022', 'Data analyst at Cognizant Saravanampatti', true
    );
  `;

  // 9. SEED FACILITIES (12+ ITEMS)
  console.log('9. Seeding Western Stay Facilities...');
  await sql`DELETE FROM western_stay_facilities;`;
  const facilitiesList = [
    { title: 'High-Speed Wi-Fi', desc: 'Complimentary 60GB high-speed wireless internet across all floors', icon: 'wifi', sort: 1 },
    { title: 'Solar Hot Water', desc: 'Environment-friendly 24×7 solar-heated running hot water in all bathrooms', icon: 'sun', sort: 2 },
    { title: 'Attached Bathrooms', desc: 'Clean western sanitary ware with continuous running water & shower', icon: 'sparkles', sort: 3 },
    { title: 'Regular Room Cleaning', desc: 'Systematic housekeeping, floor disinfection and bedsheet changes', icon: 'sparkles', sort: 4 },
    { title: 'RO Purified Water', desc: 'Central multi-stage RO drinking water dispensing units on each floor', icon: 'droplets', sort: 5 },
    { title: 'Individual Cot & Bed', desc: 'Comfortable individual wooden cot with quality mattress and storage', icon: 'bed', sort: 6 },
    { title: 'Study Table & Chair', desc: 'Dedicated ergonomic workspace for remote work and study', icon: 'book-open', sort: 7 },
    { title: 'Secure Cupboards', desc: 'Personal lockable steel wardrobe storage for valuables', icon: 'shield-check', sort: 8 },
    { title: 'Free Laundry Washing Access', desc: 'Fully-automatic washing machines and drying terrace area', icon: 'waves', sort: 9 },
    { title: 'Covered Bike Parking', desc: 'Dedicated indoor covered two-wheeler parking for residents', icon: 'bike', sort: 10 },
    { title: '24×7 CCTV Surveillance', desc: 'Continuous camera surveillance covering all corridors and entries', icon: 'video', sort: 11 },
    { title: 'Peaceful Environment', desc: 'Quiet, breezy residential atmosphere away from city dust and noise', icon: 'trees', sort: 12 },
  ];

  for (const f of facilitiesList) {
    await sql`
      INSERT INTO western_stay_facilities (title, description, icon_name, sort_order, is_active)
      VALUES (${f.title}, ${f.desc}, ${f.icon}, ${f.sort}, true);
    `;
  }

  // 10. SEED MEAL PLANS
  console.log('10. Seeding Western Stay Meal Plans...');
  await sql`DELETE FROM western_stay_meal_plans;`;
  const mealPlansList = [
    { freq: '1 Time / 26 Days', duration: '26 Days', price: '₹1,300 approx.', daily: '₹50/meal', desc: 'Choose lunch or dinner homestyle meals', sort: 1 },
    { freq: '2 Times / 26 Days', duration: '26 Days', price: '₹2,350 approx.', daily: '₹90/day', desc: 'Breakfast + Dinner or Lunch + Dinner', sort: 2 },
    { freq: '3 Times / 26 Days', duration: '26 Days', price: '₹3,600 approx.', daily: '₹138/day', desc: 'Complete 3 meals every day (Breakfast, Lunch & Dinner)', sort: 3 },
    { freq: 'VEG Monthly Subscription', duration: '30 Days', price: '₹3,600', daily: '₹120/day', desc: 'Pure vegetarian homestyle menu (Weekly: ₹900)', sort: 4 },
    { freq: 'NON-VEG Monthly Subscription', duration: '30 Days', price: '₹3,800', daily: '₹127/day', desc: 'Includes non-veg specials twice a week (Weekly: ₹950)', sort: 5 },
  ];

  for (const m of mealPlansList) {
    await sql`
      INSERT INTO western_stay_meal_plans (frequency, duration_days, price_approx, daily_rate_approx, description, sort_order, is_active)
      VALUES (${m.freq}, ${m.duration}, ${m.price}, ${m.daily}, ${m.desc}, ${m.sort}, true);
    `;
  }

  // 11. SEED 7-DAY WEEKLY MENU
  console.log('11. Seeding 7-day Weekly Menu...');
  await sql`DELETE FROM western_stay_menu;`;
  const menuList = [
    { day: 'Monday', bf: 'Idli, Sambar & Coconut Chutney', lunch: 'Steamed Rice, Drumstick Sambar, Poriyal, Rasam & Curd', dinner: 'Chapathi with Mixed Veg Kurma', sort: 1 },
    { day: 'Tuesday', bf: 'Crispy Dosa, Tomato Chutney & Sambar', lunch: 'Rice, Karakuzhambu, Kootu, Appalam & Butter Milk', dinner: 'Variety Rice (Lemon / Tomato) with Crisps', sort: 2 },
    { day: 'Wednesday', bf: 'Ven Pongal, Medu Vada & Gothsu', lunch: 'Rice, Dal Tadka, Non-Veg Chicken Gravy / Veg Paneer Butter Masala, Rasam', dinner: 'Soft Parotta, Veg Salna & Raita', sort: 3 },
    { day: 'Thursday', bf: 'Puri Masala & Chana Curry', lunch: 'Rice, Mor Kuzhambu, Potato Fry, Rasam & Fresh Curd', dinner: 'Idiyappam with Vegetable Coconut Stew', sort: 4 },
    { day: 'Friday', bf: 'Rava Upma with Coconut Chutney & Kesari', lunch: 'Traditional South Indian Meals with 3 Curries & Sweet Payasam', dinner: 'Dosa / Onion Uthappam with Sambar & Chutney', sort: 5 },
    { day: 'Saturday', bf: 'Millet Idli / Poha with Mint Chutney', lunch: 'Vegetable Biryani / Fried Rice, Gobi Manchurian & Onion Raitha', dinner: 'Tawa Chapathi with Dal Fry & Salad', sort: 6 },
    { day: 'Sunday', bf: 'Masala Dosa with Sambar & 2 Chutneys', lunch: 'Sunday Special Chicken / Egg Biryani (Veg Paneer Biryani for vegetarians), Raitha, Sweet', dinner: 'Light Dinner: Tiffin Sambar Idli & Rasam Rice', sort: 7 }
  ];

  for (const item of menuList) {
    await sql`
      INSERT INTO western_stay_menu (day_of_week, breakfast, lunch, dinner, is_holiday, sort_order, is_active)
      VALUES (${item.day}, ${item.bf}, ${item.lunch}, ${item.dinner}, false, ${item.sort}, true);
    `;
  }

  // 12. SEED WESTERN STAY GALLERY
  console.log('12. Seeding Western Stay Gallery...');
  await sql`DELETE FROM western_stay_images;`;
  const galleryList = [
    { url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.20.jpeg', title: 'Main Building Elevation & Entrance Gate', cat: 'Exterior', sort: 1, feat: true },
    { url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.45.jpeg', title: 'Reception & Waiting Lounge', cat: 'Facilities', sort: 2, feat: true },
    { url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.47.jpeg', title: 'Spacious 2-Sharing Bedroom', cat: 'Rooms', sort: 3, feat: true },
    { url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.37.10.jpeg', title: 'Comfortable Multi-Sharing Room', cat: 'Rooms', sort: 4, feat: true },
    { url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.57.jpeg', title: 'Single Private Room with Study Desk', cat: 'Rooms', sort: 5, feat: false },
    { url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.37.12.jpeg', title: 'Spacious Dormitory with Bunk Beds', cat: 'Rooms', sort: 6, feat: false },
    { url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.43.jpeg', title: 'In-House Laundry Facility', cat: 'Facilities', sort: 7, feat: false },
    { url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.44.jpeg', title: 'Automated Washing Machines', cat: 'Facilities', sort: 8, feat: false },
    { url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.37.13.jpeg', title: 'Clean Granite Hallway & Corridors', cat: 'Facilities', sort: 9, feat: false },
    { url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.37.jpeg', title: 'Building Elevation & Frontage', cat: 'Exterior', sort: 10, feat: false },
    { url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.42.jpeg', title: 'Front Entrance Portico & Signboard', cat: 'Exterior', sort: 11, feat: false },
    { url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.35.jpeg', title: 'Avenue Trees & Two-Wheeler Parking', cat: 'Campus', sort: 12, feat: false }
  ];

  for (const g of galleryList) {
    await sql`
      INSERT INTO western_stay_images (url, title, category, alt_text, sort_order, is_featured)
      VALUES (${g.url}, ${g.title}, ${g.cat}, ${g.title}, ${g.sort}, ${g.feat});
    `;
  }

  // 13. SEED SAMPLE HOSTEL ENQUIRIES
  console.log('13. Seeding sample Western Stay room enquiries...');
  await sql`DELETE FROM western_stay_enquiries;`;
  await sql`
    INSERT INTO western_stay_enquiries (name, phone, email, room_type, preferred_date, message, status)
    VALUES
    ('Priya Natarajan', '+91 81108 89902', 'priya.n@zoho.com', 'Single Occupancy', '2026-04-01', 'Looking for a private single room with attached bath and high speed wifi.', 'NEW'),
    ('Harish Kumar', '+91 94432 12345', 'harish.k@tcs.com', '2 Sharing', '2026-03-25', 'Joining TCS Saravanampatti next week. Need double sharing room with food plan.', 'CONTACTED'),
    ('Vignesh Waran', '+91 97890 54321', 'vignesh.w@gmail.com', '4 Sharing', '2026-04-15', 'College student looking for budget accommodation with meal facility.', 'FOLLOW-UP');
  `;

  console.log('🎉 Migration & Seeding completed successfully!');
  await sql.end();
}

migrate().catch(async (err) => {
  console.error('Migration failed:', err);
  await sql.end();
  process.exit(1);
});
