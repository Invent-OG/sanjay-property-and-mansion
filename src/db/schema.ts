import { pgTable, uuid, text, boolean, integer, numeric, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// =============================================================================
// 1. SANJAY PROPERTIES (REAL ESTATE DOMAIN)
// =============================================================================

export const properties = pgTable('properties', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(), // e.g. "Sanjay Gardens"
  shortName: text('short_name').notNull(),
  propertyType: text('property_type').notNull().default('Land / Plot'), // 'Land / Plot' | 'Residential Villa' | 'Apartment' | 'Commercial' | 'New Project'
  status: text('status').notNull().default('available'), // 'available' | 'under_negotiation' | 'sold' | 'upcoming'
  tagline: text('tagline'),
  description: text('description'),
  longDescription: text('long_description'),

  // Location & Address
  addressLine1: text('address_line1').notNull(),
  addressLine2: text('address_line2'),
  area: text('area').notNull().default('Saravanampatti'),
  city: text('city').notNull().default('Coimbatore'),
  pincode: text('pincode').notNull().default('641 035'),
  fullAddress: text('full_address'),
  googleMapsUrl: text('google_maps_url'),
  embedMapUrl: text('embed_map_url'),

  // Pricing & Specifications
  priceDisplay: text('price_display').default('₹25 Lakhs onwards'),
  priceNumeric: numeric('price_numeric'),
  sizeDisplay: text('size_display').default('1200 - 2400 sq.ft'),
  highlights: jsonb('highlights').$type<string[]>().default([]),

  // Contact
  primaryPhone: text('primary_phone').notNull().default('8056889900'),
  secondaryPhone: text('secondary_phone').default('8110889900'),
  whatsappNumber: text('whatsapp_number').default('918056889900'),
  email: text('email').default('enquiries@sanjayproperties.in'),

  // Visuals & Flags
  heroImageUrl: text('hero_image_url'),
  isFeatured: boolean('is_featured').notNull().default(true),

  // SEO
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  ogImageUrl: text('og_image_url'),
  canonicalUrl: text('canonical_url'),
  keywords: text('keywords'),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const propertyImages = pgTable('property_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  storagePath: text('storage_path'),
  title: text('title'),
  sortOrder: integer('sort_order').notNull().default(0),
  isFeatured: boolean('is_featured').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const propertyFeatures = pgTable('property_features', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  iconName: text('icon_name').notNull().default('check'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const propertyEnquiries = pgTable('property_enquiries', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  budget: text('budget'),
  message: text('message'),
  status: text('status').notNull().default('NEW'), // 'NEW' | 'CONTACTED' | 'IN_DISCUSSION' | 'SITE_VISIT' | 'CLOSED'
  notes: jsonb('notes').$type<Array<{ id: string; date: string; text: string; author: string }>>().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// =============================================================================
// 2. WESTERN STAY (PG / HOSTEL ACCOMMODATION BUSINESS)
// =============================================================================

export const westernStaySettings = pgTable('western_stay_settings', {
  id: text('id').primaryKey().default('singleton'),
  businessName: text('business_name').notNull().default('WESTERN STAY – SANJAY MANSION'),
  tagline: text('tagline').default('Your Home Away From Home'),
  description: text('description').default(
    'A peaceful and comfortable stay in Saravanampatti, Coimbatore, with quality accommodation, modern amenities and clean surroundings.'
  ),
  addressLine1: text('address_line1').notNull().default('No. 6, Sanjay Garden'),
  addressLine2: text('address_line2').default('Opp. KCT Tech Park'),
  area: text('area').notNull().default('Saravanampatti'),
  city: text('city').notNull().default('Coimbatore'),
  pincode: text('pincode').notNull().default('641 035'),
  fullAddress: text('full_address').default(
    'No. 6, Sanjay Garden, Opp. KCT Tech Park, Saravanampatti, Coimbatore – 641 035'
  ),
  primaryPhone: text('primary_phone').notNull().default('8056889900'),
  secondaryPhone: text('secondary_phone').default('8110889900'),
  whatsappNumber: text('whatsapp_number').default('918056889900'),
  email: text('email').default('enquiries@sanjayproperties.in'),
  googleMapsUrl: text('google_maps_url').default('https://maps.app.goo.gl/AJSivYbLohUfKxEA7'),
  embedMapUrl: text('embed_map_url').default(
    'https://maps.google.com/maps?q=11.0827,76.9942+(Western%20Stay%20-%20Sanjay%20Mansion)&t=&z=16&ie=UTF8&iwloc=&output=embed'
  ),
  heroTitle: text('hero_title').default('WESTERN STAY – SANJAY MANSION'),
  heroSubtitle: text('hero_subtitle').default('Your Home Away From Home'),
  heroDescription: text('hero_description').default(
    'A peaceful and comfortable stay in Saravanampatti, Coimbatore, designed with essential facilities, clean surroundings and convenient accommodation options.'
  ),
  heroImageUrl: text('hero_image_url').default(
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85'
  ),
  seoTitle: text('seo_title').default('Western Stay – Sanjay Mansion | Saravanampatti, Coimbatore'),
  seoDescription: text('seo_description').default(
    'Western Stay – Sanjay Mansion in Saravanampatti, Coimbatore offers comfortable accommodation with Wi-Fi, solar hot water, attached bathrooms, RO drinking water, laundry access, parking and 24×7 CCTV surveillance.'
  ),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const westernStayRoomTypes = pgTable('western_stay_room_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(), // 'Single Occupancy' | '2 Sharing' | '4 Sharing'
  slug: text('slug').notNull().unique(), // 'single-occupancy' | '2-sharing' | '4-sharing'
  description: text('description'),
  maxOccupants: integer('max_occupants').notNull().default(1),
  monthlyPrice: numeric('monthly_price').notNull(),
  priceDisplay: text('price_display').notNull(), // '₹8,000', '₹5,900', '₹4,900'
  weeklyPrice: text('weekly_price'),
  dailyPrice: text('daily_price'),
  securityDeposit: text('security_deposit').default('₹5,000'),
  acAvailable: boolean('ac_available').notNull().default(false),
  acSurcharge: text('ac_surcharge').default('Available on request'),
  features: jsonb('features').$type<string[]>().default([]),
  isRecommended: boolean('is_recommended').notNull().default(false),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const westernStayRooms = pgTable('western_stay_rooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomNumber: text('room_number').notNull().unique(), // '101', '102', '201', etc.
  roomTypeId: uuid('room_type_id').notNull().references(() => westernStayRoomTypes.id, { onDelete: 'cascade' }),
  floor: text('floor').notNull().default('1st Floor'), // 'Ground Floor' | '1st Floor' | '2nd Floor' | '3rd Floor'
  monthlyPrice: numeric('monthly_price').notNull(),
  status: text('status').notNull().default('AVAILABLE'), // 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE' | 'INACTIVE'
  notes: text('notes'),
  images: jsonb('images').$type<string[]>().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const westernStayOccupants = pgTable('western_stay_occupants', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('room_id').references(() => westernStayRooms.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  occupancyType: text('occupancy_type').notNull().default('Single'),
  checkInDate: text('check_in_date').notNull(),
  expectedCheckOutDate: text('expected_check_out_date'),
  monthlyRent: numeric('monthly_rent').notNull(),
  securityDeposit: numeric('security_deposit').default('0'),
  idProofType: text('id_proof_type'),
  idProofNumber: text('id_proof_number'),
  notes: text('notes'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const westernStayBookings = pgTable('western_stay_bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('room_id').references(() => westernStayRooms.id, { onDelete: 'set null' }),
  roomTypeId: uuid('room_type_id').references(() => westernStayRoomTypes.id, { onDelete: 'set null' }),
  occupantName: text('occupant_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  checkInDate: text('check_in_date').notNull(),
  checkOutDate: text('check_out_date'),
  advanceAmount: numeric('advance_amount').default('0'),
  status: text('status').notNull().default('confirmed'), // 'confirmed' | 'active' | 'completed' | 'cancelled'
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const westernStayFacilities = pgTable('western_stay_facilities', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  iconName: text('icon_name').notNull().default('sparkles'),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const westernStayMealPlans = pgTable('western_stay_meal_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  frequency: text('frequency').notNull(), // '1 Time / 26 Days', '2 Times / 26 Days', '3 Times / 26 Days', 'VEG Monthly', 'NON-VEG Monthly'
  durationDays: text('duration_days').notNull().default('26 Days'),
  priceApprox: text('price_approx').notNull(),
  dailyRateApprox: text('daily_rate_approx'),
  description: text('description'),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const westernStayMenu = pgTable('western_stay_menu', {
  id: uuid('id').primaryKey().defaultRandom(),
  dayOfWeek: text('day_of_week').notNull(), // 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  breakfast: text('breakfast').notNull(),
  lunch: text('lunch').notNull(),
  dinner: text('dinner').notNull(),
  isHoliday: boolean('is_holiday').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const westernStayImages = pgTable('western_stay_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  url: text('url').notNull(),
  storagePath: text('storage_path'),
  title: text('title'),
  category: text('category').default('Exterior'), // 'Exterior' | 'Rooms' | 'Facilities' | 'Campus' | 'Dining'
  altText: text('alt_text'),
  sortOrder: integer('sort_order').notNull().default(0),
  isFeatured: boolean('is_featured').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const westernStayEnquiries = pgTable('western_stay_enquiries', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  roomType: text('room_type').notNull().default('Single Occupancy'),
  preferredDate: text('preferred_date'),
  message: text('message'),
  status: text('status').notNull().default('NEW'), // 'NEW' | 'CONTACTED' | 'FOLLOW-UP' | 'BOOKED' | 'CLOSED'
  notes: jsonb('notes').$type<Array<{ id: string; date: string; text: string; author: string }>>().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// =============================================================================
// 3. GLOBAL SITE SETTINGS & CRM
// =============================================================================

export const siteSettings = pgTable('site_settings', {
  id: text('id').primaryKey().default('global'),
  companyName: text('company_name').notNull().default('SANJAY PROPERTIES'),
  projectName: text('project_name').notNull().default('SANJAY GARDEN'),
  tagline: text('tagline').default('A Better Address Begins With Better Planning'),
  email: text('email').notNull().default('enquiries@sanjayproperties.in'),
  phone: text('phone').notNull().default('+91 80568 89900'),
  secondaryPhone: text('secondary_phone').default('+91 81108 89900'),
  whatsappNumber: text('whatsapp_number').default('918056889900'),
  fullAddress: text('full_address').default('Sanjay Garden, PNT Colony, Saravanampatti, Coimbatore, Tamil Nadu – 641035'),
  googleMapsUrl: text('google_maps_url').default('https://maps.app.goo.gl/AJSivYbLohUfKxEA7'),
  defaultSeoTitle: text('default_seo_title').default('Sanjay Properties | Sanjay Garden, Saravanampatti, Coimbatore'),
  defaultSeoDescription: text('default_seo_description').default('Discover Sanjay Garden residential address and Western Stay Sanjay Mansion in Saravanampatti, Coimbatore by Sanjay Properties.'),
  defaultOgImage: text('default_og_image').default('/og-image.jpg'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  source: text('source').notNull().default('Sanjay Properties'),
  enquiryType: text('enquiry_type').notNull().default('General Enquiry'),
  status: text('status').notNull().default('New'),
  message: text('message'),
  preferredDate: text('preferred_date'),
  timeSlot: text('time_slot'),
  preferredAccommodation: text('preferred_accommodation'),
  mealPlan: text('meal_plan'),
  budget: text('budget'),
  notes: jsonb('notes').$type<Array<{ id: string; date: string; text: string; author: string }>>().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Legacy backward-compatibility aliases (optional during migration)
export const accommodations = westernStayRoomTypes;
export const facilities = westernStayFacilities;
export const mealPlans = westernStayMealPlans;
export const mealSubscriptionRates = westernStayMealPlans;
export const weeklyMenu = westernStayMenu;

// =============================================================================
// RELATIONS
// =============================================================================

export const propertiesRelations = relations(properties, ({ many }) => ({
  images: many(propertyImages),
  features: many(propertyFeatures),
  enquiries: many(propertyEnquiries),
}));

export const propertyImagesRelations = relations(propertyImages, ({ one }) => ({
  property: one(properties, {
    fields: [propertyImages.propertyId],
    references: [properties.id],
  }),
}));

export const propertyFeaturesRelations = relations(propertyFeatures, ({ one }) => ({
  property: one(properties, {
    fields: [propertyFeatures.propertyId],
    references: [properties.id],
  }),
}));

export const westernStayRoomTypesRelations = relations(westernStayRoomTypes, ({ many }) => ({
  rooms: many(westernStayRooms),
  bookings: many(westernStayBookings),
}));

export const westernStayRoomsRelations = relations(westernStayRooms, ({ one, many }) => ({
  roomType: one(westernStayRoomTypes, {
    fields: [westernStayRooms.roomTypeId],
    references: [westernStayRoomTypes.id],
  }),
  occupants: many(westernStayOccupants),
  bookings: many(westernStayBookings),
}));

export const westernStayOccupantsRelations = relations(westernStayOccupants, ({ one }) => ({
  room: one(westernStayRooms, {
    fields: [westernStayOccupants.roomId],
    references: [westernStayRooms.id],
  }),
}));

export const westernStayBookingsRelations = relations(westernStayBookings, ({ one }) => ({
  room: one(westernStayRooms, {
    fields: [westernStayBookings.roomId],
    references: [westernStayRooms.id],
  }),
  roomType: one(westernStayRoomTypes, {
    fields: [westernStayBookings.roomTypeId],
    references: [westernStayRoomTypes.id],
  }),
}));

// Infer Types
export type PropertyRecord = typeof properties.$inferSelect;
export type NewPropertyRecord = typeof properties.$inferInsert;
export type PropertyImageRecord = typeof propertyImages.$inferSelect;
export type PropertyFeatureRecord = typeof propertyFeatures.$inferSelect;
export type PropertyEnquiryRecord = typeof propertyEnquiries.$inferSelect;

export type WesternStaySettingsRecord = typeof westernStaySettings.$inferSelect;
export type WesternStayRoomTypeRecord = typeof westernStayRoomTypes.$inferSelect;
export type WesternStayRoomRecord = typeof westernStayRooms.$inferSelect;
export type WesternStayOccupantRecord = typeof westernStayOccupants.$inferSelect;
export type WesternStayBookingRecord = typeof westernStayBookings.$inferSelect;
export type WesternStayFacilityRecord = typeof westernStayFacilities.$inferSelect;
export type WesternStayMealPlanRecord = typeof westernStayMealPlans.$inferSelect;
export type WesternStayMenuRecord = typeof westernStayMenu.$inferSelect;
export type WesternStayImageRecord = typeof westernStayImages.$inferSelect;
export type WesternStayEnquiryRecord = typeof westernStayEnquiries.$inferSelect;

export type SiteSettingsRecord = typeof siteSettings.$inferSelect;
export type LeadRecord = typeof leads.$inferSelect;
