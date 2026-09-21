import { pgTable, uuid, text, boolean, integer, numeric, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// =============================================================================
// 1. PROPERTIES TABLE
// =============================================================================
export const properties = pgTable('properties', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  shortName: text('short_name').notNull(),
  tagline: text('tagline'),
  description: text('description'),
  longDescription: text('long_description'),

  // Address & Location
  addressLine1: text('address_line1').notNull(),
  addressLine2: text('address_line2'),
  area: text('area').notNull().default('Saravanampatti'),
  city: text('city').notNull().default('Coimbatore'),
  pincode: text('pincode').notNull().default('641 035'),
  fullAddress: text('full_address'),
  googleMapsUrl: text('google_maps_url'),
  embedMapUrl: text('embed_map_url'),

  // Contact Details
  primaryPhone: text('primary_phone').notNull().default('8056889900'),
  secondaryPhone: text('secondary_phone').default('8110889900'),
  whatsappNumber: text('whatsapp_number').default('918056889900'),
  email: text('email').default('enquiries@sanjayproperties.in'),

  // Hero Section
  heroTitle: text('hero_title'),
  heroSubtitle: text('hero_subtitle'),
  heroDescription: text('hero_description'),
  heroImageUrl: text('hero_image_url'),

  // Pricing Starting Display
  pricingStart: text('pricing_start').default('₹4,900'),

  // Status & Flags
  status: text('status').notNull().default('active'), // 'active' | 'draft' | 'inactive'
  isFeaturedHomepage: boolean('is_featured_homepage').notNull().default(true),

  // SEO Metadata
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  ogImageUrl: text('og_image_url'),
  canonicalUrl: text('canonical_url'),
  keywords: text('keywords'),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// =============================================================================
// 2. PROPERTY IMAGES TABLE
// =============================================================================
export const propertyImages = pgTable('property_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  storagePath: text('storage_path'),
  title: text('title'),
  category: text('category').default('Exterior'), // 'Exterior' | 'Rooms' | 'Interiors' | 'Campus' | 'Facilities' | 'Other'
  altText: text('alt_text'),
  sortOrder: integer('sort_order').notNull().default(0),
  isFeatured: boolean('is_featured').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// =============================================================================
// 3. ACCOMMODATION OPTIONS TABLE
// =============================================================================
export const accommodations = pgTable('accommodations', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  badge: text('badge'),
  priceMonthly: numeric('price_monthly').notNull(),
  priceDisplay: text('price_display').notNull(),
  priceNote: text('price_note').default('per month'),
  features: jsonb('features').notNull().$type<string[]>().default([]),
  isRecommended: boolean('is_recommended').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// =============================================================================
// 4. FACILITIES TABLE
// =============================================================================
export const facilities = pgTable('facilities', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  iconName: text('icon_name').notNull().default('sparkles'),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// =============================================================================
// 5. MEAL PLANS TABLE
// =============================================================================
export const mealPlans = pgTable('meal_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  frequency: text('frequency').notNull(),
  durationDays: text('duration_days').notNull().default('26 Days'),
  priceApprox: text('price_approx').notNull(),
  dailyRateApprox: text('daily_rate_approx'),
  description: text('description'),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// =============================================================================
// 6. MEAL SUBSCRIPTION RATES TABLE
// =============================================================================
export const mealSubscriptionRates = pgTable('meal_subscription_rates', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  planType: text('plan_type').notNull(), // 'VEG' | 'NON-VEG'
  monthlyPrice: text('monthly_price').notNull(),
  weeklyPrice: text('weekly_price').notNull(),
  tag: text('tag'),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// =============================================================================
// 7. WEEKLY MEAL MENU TABLE
// =============================================================================
export const weeklyMenu = pgTable('weekly_menu', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  dayOfWeek: text('day_of_week').notNull(),
  breakfast: text('breakfast').notNull(),
  lunch: text('lunch').notNull(),
  dinner: text('dinner').notNull(),
  isHoliday: boolean('is_holiday').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// =============================================================================
// 8. LEADS & ENQUIRIES TABLE
// =============================================================================
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
  notes: jsonb('notes').notNull().$type<Array<{ id: string; date: string; text: string; author: string }>>().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// =============================================================================
// 9. SITE SETTINGS TABLE
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

// =============================================================================
// RELATIONS
// =============================================================================
export const propertiesRelations = relations(properties, ({ many }) => ({
  images: many(propertyImages),
  accommodations: many(accommodations),
  facilities: many(facilities),
  mealPlans: many(mealPlans),
  mealSubscriptionRates: many(mealSubscriptionRates),
  weeklyMenu: many(weeklyMenu),
  leads: many(leads),
}));

export const propertyImagesRelations = relations(propertyImages, ({ one }) => ({
  property: one(properties, {
    fields: [propertyImages.propertyId],
    references: [properties.id],
  }),
}));

export const accommodationsRelations = relations(accommodations, ({ one }) => ({
  property: one(properties, {
    fields: [accommodations.propertyId],
    references: [properties.id],
  }),
}));

export const facilitiesRelations = relations(facilities, ({ one }) => ({
  property: one(properties, {
    fields: [facilities.propertyId],
    references: [properties.id],
  }),
}));

export const mealPlansRelations = relations(mealPlans, ({ one }) => ({
  property: one(properties, {
    fields: [mealPlans.propertyId],
    references: [properties.id],
  }),
}));

export const mealSubscriptionRatesRelations = relations(mealSubscriptionRates, ({ one }) => ({
  property: one(properties, {
    fields: [mealSubscriptionRates.propertyId],
    references: [properties.id],
  }),
}));

export const weeklyMenuRelations = relations(weeklyMenu, ({ one }) => ({
  property: one(properties, {
    fields: [weeklyMenu.propertyId],
    references: [properties.id],
  }),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  property: one(properties, {
    fields: [leads.propertyId],
    references: [properties.id],
  }),
}));

// Infer Types
export type PropertyRecord = typeof properties.$inferSelect;
export type NewPropertyRecord = typeof properties.$inferInsert;
export type PropertyImageRecord = typeof propertyImages.$inferSelect;
export type AccommodationRecord = typeof accommodations.$inferSelect;
export type FacilityRecord = typeof facilities.$inferSelect;
export type MealPlanRecord = typeof mealPlans.$inferSelect;
export type MealSubscriptionRateRecord = typeof mealSubscriptionRates.$inferSelect;
export type WeeklyMenuRecord = typeof weeklyMenu.$inferSelect;
export type LeadRecord = typeof leads.$inferSelect;
export type SiteSettingsRecord = typeof siteSettings.$inferSelect;
