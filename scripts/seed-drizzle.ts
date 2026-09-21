import * as dotenv from 'dotenv';
dotenv.config();

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../src/db/schema';
import {
  properties,
  propertyImages,
  accommodations,
  facilities,
  mealPlans,
  mealSubscriptionRates,
  weeklyMenu,
  leads,
  siteSettings,
} from '../src/db/schema';

const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || '';

if (!connectionString) {
  console.error('DATABASE_URL is missing from .env');
  process.exit(1);
}

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client, { schema });

async function seed() {
  console.log('🌱 Seeding database via Drizzle ORM...');

  // 1. Insert Site Settings (Singleton)
  console.log('1. Seeding Site Settings...');
  await db
    .insert(siteSettings)
    .values({
      id: 'global',
      companyName: 'SANJAY PROPERTIES',
      projectName: 'SANJAY GARDEN',
      tagline: 'A Better Address Begins With Better Planning',
      email: 'enquiries@sanjayproperties.in',
      phone: '+91 80568 89900',
      secondaryPhone: '+91 81108 89900',
      whatsappNumber: '918056889900',
      fullAddress: 'Sanjay Garden, PNT Colony, Saravanampatti, Coimbatore, Tamil Nadu – 641035',
      googleMapsUrl: 'https://maps.app.goo.gl/AJSivYbLohUfKxEA7',
      defaultSeoTitle: 'Sanjay Properties | Sanjay Garden, Saravanampatti, Coimbatore',
      defaultSeoDescription:
        'Discover Sanjay Garden residential address and Western Stay Sanjay Mansion in Saravanampatti, Coimbatore by Sanjay Properties.',
      defaultOgImage: '/og-image.jpg',
    })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: {
        companyName: 'SANJAY PROPERTIES',
        updatedAt: new Date(),
      },
    });

  // 2. Insert Western Stay – Sanjay Mansion
  console.log('2. Seeding Properties...');
  const [mansionProp] = await db
    .insert(properties)
    .values({
      slug: 'sanjay-mansion',
      name: 'WESTERN STAY – SANJAY MANSION',
      shortName: 'Sanjay Mansion',
      tagline: 'Your Home Away From Home',
      description:
        'A peaceful and comfortable stay in Saravanampatti, Coimbatore, designed with essential facilities, clean surroundings and convenient accommodation options.',
      longDescription:
        'Western Stay – Sanjay Mansion offers a peaceful and comfortable accommodation experience in Saravanampatti, Coimbatore. Located near KCT Tech Park, the property is designed for convenient living with essential facilities, individual accommodation options, clean surroundings and a secure environment.',
      addressLine1: 'No. 6, Sanjay Garden',
      addressLine2: 'Opp. KCT Tech Park',
      area: 'Saravanampatti',
      city: 'Coimbatore',
      pincode: '641 035',
      fullAddress: 'No. 6, Sanjay Garden, Opp. KCT Tech Park, Saravanampatti, Coimbatore – 641 035',
      googleMapsUrl: 'https://maps.app.goo.gl/AJSivYbLohUfKxEA7',
      embedMapUrl:
        'https://maps.google.com/maps?q=11.0827,76.9942+(Western%20Stay%20-%20Sanjay%20Mansion)&t=&z=16&ie=UTF8&iwloc=&output=embed',
      primaryPhone: '8056889900',
      secondaryPhone: '8110889900',
      whatsappNumber: '918056889900',
      email: 'enquiries@sanjayproperties.in',
      heroTitle: 'WESTERN STAY – SANJAY MANSION',
      heroSubtitle: 'Your Home Away From Home',
      heroDescription:
        'A peaceful and comfortable stay in Saravanampatti, Coimbatore, with quality accommodation, modern amenities and clean surroundings.',
      heroImageUrl:
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
      pricingStart: '₹4,900',
      status: 'active',
      isFeaturedHomepage: true,
      seoTitle: 'Western Stay – Sanjay Mansion | Saravanampatti, Coimbatore',
      seoDescription:
        'Western Stay – Sanjay Mansion in Saravanampatti, Coimbatore offers comfortable accommodation with Wi-Fi, solar hot water, attached bathrooms, RO drinking water, laundry access, parking and 24×7 CCTV surveillance.',
      ogImageUrl:
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      canonicalUrl: 'https://sanjayproperties.in/sanjay-mansion',
      keywords: 'Sanjay Mansion, Western Stay, Hostel in Saravanampatti, PG in Coimbatore',
    })
    .onConflictDoUpdate({
      target: properties.slug,
      set: {
        name: 'WESTERN STAY – SANJAY MANSION',
        updatedAt: new Date(),
      },
    })
    .returning();

  const mansionId = mansionProp.id;

  // 3. Clear old child entities for clean seed
  console.log('3. Refreshing child relational tables...');
  await db.delete(propertyImages);
  await db.delete(accommodations);
  await db.delete(facilities);
  await db.delete(mealPlans);
  await db.delete(mealSubscriptionRates);
  await db.delete(weeklyMenu);

  // 4. Property Images
  console.log('4. Seeding Property Images...');
  await db.insert(propertyImages).values([
    {
      propertyId: mansionId,
      url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      title: 'Mansion Exterior Architecture',
      category: 'Exterior',
      sortOrder: 1,
      isFeatured: true,
    },
    {
      propertyId: mansionId,
      url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      title: 'Clean & Spacious Bed Room',
      category: 'Rooms',
      sortOrder: 2,
      isFeatured: false,
    },
    {
      propertyId: mansionId,
      url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
      title: 'Single & Double Accommodation',
      category: 'Rooms',
      sortOrder: 3,
      isFeatured: false,
    },
    {
      propertyId: mansionId,
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
      title: 'Modern Attached Restrooms',
      category: 'Interiors',
      sortOrder: 4,
      isFeatured: false,
    },
  ]);

  // 5. Accommodations
  console.log('5. Seeding Accommodations...');
  await db.insert(accommodations).values([
    {
      propertyId: mansionId,
      name: 'Four Sharing Room',
      badge: 'Budget Friendly',
      priceMonthly: '4900',
      priceDisplay: '₹4,900',
      priceNote: 'per person / month',
      features: [
        'Individual Bed & Storage Wardrobe',
        'Solar Heated 24×7 Hot Water',
        'High-Speed Wi-Fi Internet Included',
        'Clean Regular Housekeeping Included',
      ],
      isRecommended: false,
      sortOrder: 1,
      isActive: true,
    },
    {
      propertyId: mansionId,
      name: 'Double Sharing Room',
      badge: 'Most Popular',
      priceMonthly: '6500',
      priceDisplay: '₹6,500',
      priceNote: 'per person / month',
      features: [
        'Spacious Double Bed Configuration',
        'Attached Clean Restroom',
        'Study Desk Space & Power Points',
        'Peaceful & Quiet Environment',
      ],
      isRecommended: true,
      sortOrder: 2,
      isActive: true,
    },
    {
      propertyId: mansionId,
      name: 'Single Private Room',
      badge: 'Maximum Privacy',
      priceMonthly: '9500',
      priceDisplay: '₹9,500',
      priceNote: 'per month',
      features: [
        'Complete Single Private Room',
        'Dedicated Workspace & Storage',
        'Premium Natural Ventilation',
        'Full Access to All Mansion Amenities',
      ],
      isRecommended: false,
      sortOrder: 3,
      isActive: true,
    },
  ]);

  // 6. Facilities
  console.log('6. Seeding Facilities...');
  await db.insert(facilities).values([
    {
      propertyId: mansionId,
      title: 'High-Speed Wi-Fi',
      description: 'Fast and reliable high-speed internet access across rooms and common areas.',
      iconName: 'wifi',
      sortOrder: 1,
      isActive: true,
    },
    {
      propertyId: mansionId,
      title: 'Solar Hot Water',
      description: 'Eco-friendly solar powered 24×7 hot water system for all attached bathrooms.',
      iconName: 'sun',
      sortOrder: 2,
      isActive: true,
    },
    {
      propertyId: mansionId,
      title: 'Attached Bathrooms',
      description: 'Modern, well-maintained and hygienic attached restrooms in every room.',
      iconName: 'shower-head',
      sortOrder: 3,
      isActive: true,
    },
    {
      propertyId: mansionId,
      title: 'RO Drinking Water',
      description: 'Clean and purified multi-stage reverse osmosis mineral drinking water on all floors.',
      iconName: 'droplets',
      sortOrder: 4,
      isActive: true,
    },
    {
      propertyId: mansionId,
      title: 'Daily Housekeeping',
      description: 'Regular cleaning and sanitation of rooms, corridors and common living zones.',
      iconName: 'sparkles',
      sortOrder: 5,
      isActive: true,
    },
    {
      propertyId: mansionId,
      title: 'CCTV Surveillance',
      description: 'Round-the-clock 24×7 security surveillance for safety and peace of mind.',
      iconName: 'shield-check',
      sortOrder: 6,
      isActive: true,
    },
    {
      propertyId: mansionId,
      title: 'Vehicle Parking',
      description: 'Dedicated and secure parking space for two-wheelers and resident vehicles.',
      iconName: 'bike',
      sortOrder: 7,
      isActive: true,
    },
    {
      propertyId: mansionId,
      title: 'Spacious Balconies',
      description: 'Open, airy balconies and rooftop area with green surrounding campus views.',
      iconName: 'trees',
      sortOrder: 8,
      isActive: true,
    },
  ]);

  // 7. Meal Plans & Subscription Rates
  console.log('7. Seeding Meal Plans & Subscription Rates...');
  await db.insert(mealSubscriptionRates).values([
    {
      propertyId: mansionId,
      planType: 'VEG',
      monthlyPrice: '₹3,500',
      weeklyPrice: '₹950',
      tag: 'Pure Veg Homestyle',
      sortOrder: 1,
      isActive: true,
    },
    {
      propertyId: mansionId,
      planType: 'NON-VEG',
      monthlyPrice: '₹4,200',
      weeklyPrice: '₹1,150',
      tag: 'Includes Non-Veg Specials',
      sortOrder: 2,
      isActive: true,
    },
  ]);

  await db.insert(mealPlans).values([
    {
      propertyId: mansionId,
      frequency: '1 Time / Day (Lunch or Dinner)',
      durationDays: '26 Days',
      priceApprox: '₹1,500 – ₹1,800',
      dailyRateApprox: '₹60 – ₹70/day',
      description: 'Flexible single meal plan suitable for working professionals.',
      sortOrder: 1,
      isActive: true,
    },
    {
      propertyId: mansionId,
      frequency: '2 Times / Day (Lunch & Dinner)',
      durationDays: '26 Days',
      priceApprox: '₹3,000 – ₹3,500',
      dailyRateApprox: '₹115 – ₹135/day',
      description: 'Balanced standard meal plan with authentic home-cooked taste.',
      sortOrder: 2,
      isActive: true,
    },
    {
      propertyId: mansionId,
      frequency: '3 Times / Day (Full Day Mess)',
      durationDays: '26 Days',
      priceApprox: '₹3,800 – ₹4,200',
      dailyRateApprox: '₹145 – ₹160/day',
      description: 'Complete daily nutrition covering breakfast, lunch and dinner.',
      sortOrder: 3,
      isActive: true,
    },
  ]);

  // 8. Weekly Menu
  console.log('8. Seeding Weekly Menu...');
  await db.insert(weeklyMenu).values([
    {
      propertyId: mansionId,
      dayOfWeek: 'Monday',
      breakfast: 'Idli, Sambar, Coconut Chutney, Tea / Coffee',
      lunch: 'Rice, Sambar, Poriyal, Kootu, Rasam, Curd, Appalam',
      dinner: 'Chapati, Dal Tadka, Veg Curry, Rice',
      sortOrder: 1,
      isActive: true,
    },
    {
      propertyId: mansionId,
      dayOfWeek: 'Tuesday',
      breakfast: 'Puri Masala, Chana Gravy, Tea / Coffee',
      lunch: 'Rice, Karakuzhambu, Aviyal, Rasam, Butter Milk, Appalam',
      dinner: 'Dosa, Tomato Chutney, Sambar, Rice',
      sortOrder: 2,
      isActive: true,
    },
    {
      propertyId: mansionId,
      dayOfWeek: 'Wednesday',
      breakfast: 'Pongal, Medu Vada, Coconut Chutney, Sambar',
      lunch: 'Rice, Non-Veg Chicken Gravy / Veg Paneer Butter Masala, Rasam, Curd',
      dinner: 'Parotta, Veg / Chicken Salna, Rice',
      sortOrder: 3,
      isActive: true,
    },
    {
      propertyId: mansionId,
      dayOfWeek: 'Thursday',
      breakfast: 'Semiya Upma / Rava Kichadi, Chutney, Sambar',
      lunch: 'Rice, Mor Kuzhambu, Beetroot Poriyal, Rasam, Curd',
      dinner: 'Variety Rice / Fried Rice, Gobi Manchurian',
      sortOrder: 4,
      isActive: true,
    },
    {
      propertyId: mansionId,
      dayOfWeek: 'Friday',
      breakfast: 'Idiyappam, Coconut Milk / Kurma, Tea / Coffee',
      lunch: 'South Indian Special Meals, Payasam, Vada, Curd',
      dinner: 'Chapati, Mixed Veg Kurma, Jeera Rice',
      sortOrder: 5,
      isActive: true,
    },
    {
      propertyId: mansionId,
      dayOfWeek: 'Saturday',
      breakfast: 'Rava Dosa, Sambar, Mint Chutney, Tea / Coffee',
      lunch: 'Vegetable Pulao / Briyani, Onion Raitha, Poriyal, Rasam',
      dinner: 'Idli, Chutney, Tiffin Sambar, Rice',
      sortOrder: 6,
      isActive: true,
    },
    {
      propertyId: mansionId,
      dayOfWeek: 'Sunday',
      breakfast: 'Poori / Aloo Paratha, Curd, Pickle, Tea',
      lunch: 'Special Sunday Chicken Briyani / Paneer Dum Briyani, Raitha, Egg, Dessert',
      dinner: 'Light Dinner: Phulka, Paneer Gravy, Curd Rice',
      sortOrder: 7,
      isActive: true,
    },
  ]);

  // 9. CRM Leads Sample Data
  console.log('9. Seeding CRM Enquiries...');
  await db.delete(leads);
  await db.insert(leads).values([
    {
      propertyId: mansionId,
      name: 'Karthik Subramanian',
      phone: '9840123456',
      email: 'karthik.s@gmail.com',
      source: 'Sanjay Mansion',
      enquiryType: 'Double Sharing Room',
      status: 'New',
      preferredAccommodation: 'Double Sharing Room',
      preferredDate: '2026-10-01',
      mealPlan: '2 Times / Day (Lunch & Dinner)',
      message: 'Looking for accommodation near KCT Tech Park starting from 1st of next month.',
      notes: [
        {
          id: 'note-1',
          date: new Date().toISOString(),
          text: 'Enquiry received via website. Software engineer at Bosch.',
          author: 'Admin',
        },
      ],
    },
    {
      propertyId: mansionId,
      name: 'Praveen Kumar',
      phone: '9789123456',
      email: 'praveen.k@outlook.com',
      source: 'Sanjay Mansion',
      enquiryType: 'Single Private Room',
      status: 'Contacted',
      preferredAccommodation: 'Single Private Room',
      preferredDate: '2026-09-28',
      mealPlan: '3 Times / Day (Full Day Mess)',
      message: 'Need a single room with attached bathroom and fast Wi-Fi for work from home.',
      notes: [
        {
          id: 'note-2',
          date: new Date().toISOString(),
          text: 'Called client. Scheduled in-person room visit for Saturday 11 AM.',
          author: 'Admin',
        },
      ],
    },
    {
      name: 'Arunachalam S',
      phone: '9443123456',
      email: 'arun.property@gmail.com',
      source: 'Sanjay Properties',
      enquiryType: 'Residential Plot Enquiry',
      status: 'In Discussion',
      message: 'Interested in Sanjay Garden villa plots in Saravanampatti. Please share brochure and layout pricing.',
      budget: '₹40 - ₹60 Lakhs',
      notes: [
        {
          id: 'note-3',
          date: new Date().toISOString(),
          text: 'Sent Sanjay Garden master plan PDF on WhatsApp. Discussing plot dimensions.',
          author: 'Admin',
        },
      ],
    },
    {
      propertyId: mansionId,
      name: 'Vigneshwaran R',
      phone: '8870123456',
      email: 'vicky.r@gmail.com',
      source: 'Sanjay Mansion',
      enquiryType: 'Four Sharing Room',
      status: 'Converted',
      preferredAccommodation: 'Four Sharing Room',
      message: 'College student at Kumaraguru. Joining with 2 friends.',
      notes: [
        {
          id: 'note-4',
          date: new Date().toISOString(),
          text: 'Advance paid. Room 204 allocated.',
          author: 'Admin',
        },
      ],
    },
  ]);

  console.log('✅ Successfully seeded all tables in Supabase via Drizzle ORM!');
  await client.end();
}

seed().catch(async (e) => {
  console.error('❌ Seed failed:', e);
  await client.end();
  process.exit(1);
});
