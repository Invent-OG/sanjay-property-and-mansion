// Database and domain type definitions for Supabase, Sanjay Properties & Western Stay

// =============================================================================
// COMMON DOMAIN TYPES
// =============================================================================
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type LeadSource = 'Sanjay Properties' | 'Western Stay' | 'Sanjay Mansion';
export type LeadStatus = 'New' | 'Contacted' | 'In Discussion' | 'Visit Scheduled' | 'Converted' | 'Lost' | 'Closed';

// =============================================================================
// 1. SANJAY PROPERTIES (REAL ESTATE) TYPES
// =============================================================================
export type RealEstateType = 'Land / Plot' | 'Residential Villa' | 'Apartment' | 'Commercial' | 'New Project';
export type PropertyStatus = 'active' | 'draft' | 'inactive' | 'available' | 'under_negotiation' | 'sold' | 'upcoming';
export type RealEstateStatus = PropertyStatus;
export type ImageCategory = 'Exterior' | 'Rooms' | 'Interiors' | 'Campus' | 'Facilities' | 'Other';

export interface PropertyRecord {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  property_type: RealEstateType;
  status: PropertyStatus;
  tagline?: string | null;
  description?: string | null;
  long_description?: string | null;

  // Location
  address_line1: string;
  address_line2?: string | null;
  area: string;
  city: string;
  pincode: string;
  full_address?: string | null;
  google_maps_url?: string | null;
  embed_map_url?: string | null;

  // Hero Section
  hero_title?: string | null;
  hero_subtitle?: string | null;
  hero_description?: string | null;

  // Pricing & Specifications
  price_display?: string | null;
  price_numeric?: number | null;
  size_display?: string | null;
  highlights?: string[];
  pricing_start?: string | null;

  // Contact
  primary_phone: string;
  secondary_phone?: string | null;
  whatsapp_number?: string | null;
  email?: string | null;

  // Visuals & Flags
  hero_image_url?: string | null;
  is_featured: boolean;
  is_featured_homepage: boolean;

  // SEO
  seo_title?: string | null;
  seo_description?: string | null;
  og_image_url?: string | null;
  canonical_url?: string | null;
  keywords?: string | null;

  created_at: string;
  updated_at: string;
}

export interface PropertyImageRecord {
  id: string;
  property_id: string;
  url: string;
  storage_path?: string | null;
  title?: string | null;
  category?: ImageCategory | string | null;
  alt_text?: string | null;
  sort_order: number;
  is_featured: boolean;
  created_at: string;
}

export interface PropertyFeatureRecord {
  id: string;
  property_id: string;
  title: string;
  description?: string | null;
  icon_name: string;
  sort_order: number;
  created_at: string;
}

export interface PropertyEnquiryRecord {
  id: string;
  property_id?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  budget?: string | null;
  message?: string | null;
  status: 'NEW' | 'CONTACTED' | 'IN_DISCUSSION' | 'SITE_VISIT' | 'CLOSED';
  notes?: Array<{ id: string; date: string; text: string; author: string }>;
  created_at: string;
  updated_at: string;
}

export interface FullRealEstatePropertyData {
  property: PropertyRecord;
  images: PropertyImageRecord[];
  features: PropertyFeatureRecord[];
  enquiries?: PropertyEnquiryRecord[];
}

// =============================================================================
// 2. WESTERN STAY (PG / HOSTEL) TYPES
// =============================================================================
export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE' | 'INACTIVE';
export type WesternStayEnquiryStatus = 'NEW' | 'CONTACTED' | 'FOLLOW-UP' | 'BOOKED' | 'CLOSED';
export type WesternStayImageCategory = 'Exterior' | 'Rooms' | 'Facilities' | 'Campus' | 'Dining' | 'Other';

export interface WesternStaySettingsRecord {
  id: string;
  business_name: string;
  tagline?: string | null;
  description?: string | null;
  address_line1: string;
  address_line2?: string | null;
  area: string;
  city: string;
  pincode: string;
  full_address: string;
  primary_phone: string;
  secondary_phone?: string | null;
  whatsapp_number?: string | null;
  email?: string | null;
  google_maps_url: string;
  embed_map_url?: string | null;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  hero_description?: string | null;
  hero_image_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  updated_at: string;
}

export interface WesternStayRoomTypeRecord {
  id: string;
  name: string; // 'Single Occupancy' | '2 Sharing' | '4 Sharing'
  slug: string; // 'single-occupancy' | '2-sharing' | '4-sharing'
  description?: string | null;
  max_occupants: number;
  monthly_price: number;
  price_display: string; // '₹8,000'
  weekly_price?: string | null;
  daily_price?: string | null;
  security_deposit?: string | null;
  ac_available: boolean;
  ac_surcharge?: string | null;
  features: string[];
  is_recommended: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  // Calculated client/public availability fields
  totalRooms?: number;
  availableRooms?: number;
  occupiedRooms?: number;
  isFull?: boolean;

  // Backward compatibility fields for legacy UI components
  property_id?: string;
  badge?: string | null;
  price_monthly?: number | null;
  price_note?: string | null;
  sort_order?: number;
}

export interface WesternStayRoomRecord {
  id: string;
  room_number: string; // '101', '102', '201', etc.
  room_type_id: string;
  room_type_name?: string;
  floor: string; // 'Ground Floor' | '1st Floor' | '2nd Floor' | '3rd Floor'
  monthly_price: number;
  status: RoomStatus;
  notes?: string | null;
  images: string[];
  current_occupant_name?: string | null;
  created_at: string;
  updated_at: string;
}

export interface WesternStayOccupantRecord {
  id: string;
  room_id?: string | null;
  room_number?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  occupancy_type: string;
  check_in_date: string;
  expected_check_out_date?: string | null;
  monthly_rent: number;
  security_deposit: number;
  id_proof_type?: string | null;
  id_proof_number?: string | null;
  notes?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WesternStayBookingRecord {
  id: string;
  room_id?: string | null;
  room_type_id?: string | null;
  occupant_name: string;
  phone: string;
  email?: string | null;
  check_in_date: string;
  check_out_date?: string | null;
  advance_amount: number;
  status: 'confirmed' | 'active' | 'completed' | 'cancelled';
  notes?: string | null;
  created_at: string;
}

export interface WesternStayFacilityRecord {
  id: string;
  property_id?: string;
  title: string;
  description?: string | null;
  icon_name: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WesternStayMealPlanRecord {
  id: string;
  property_id?: string;
  frequency: string;
  duration_days: string;
  price_approx: string;
  daily_rate_approx?: string | null;
  description?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MealSubscriptionRateRecord {
  id: string;
  property_id?: string;
  plan_type: 'VEG' | 'NON-VEG';
  monthly_price: string;
  weekly_price: string;
  tag?: string | null;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WesternStayMenuRecord {
  id: string;
  day_of_week: DayOfWeek;
  breakfast: string;
  lunch: string;
  dinner: string;
  is_holiday: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WesternStayImageRecord {
  id: string;
  url: string;
  storage_path?: string | null;
  title?: string | null;
  category: WesternStayImageCategory;
  alt_text?: string | null;
  sort_order: number;
  is_featured: boolean;
  created_at: string;
}

export interface WesternStayEnquiryRecord {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  room_type: string;
  preferred_date?: string | null;
  message?: string | null;
  status: WesternStayEnquiryStatus;
  notes: Array<{ id: string; date: string; text: string; author: string }>;
  created_at: string;
  updated_at: string;
}

// Complete public Western Stay view
export interface PublicWesternStayData {
  settings: WesternStaySettingsRecord;
  roomTypes: WesternStayRoomTypeRecord[];
  facilities: WesternStayFacilityRecord[];
  mealPlans: WesternStayMealPlanRecord[];
  weeklyMenu: WesternStayMenuRecord[];
  gallery: WesternStayImageRecord[];
  availabilitySummary: {
    totalRooms: number;
    availableRooms: number;
    occupiedRooms: number;
    reservedRooms: number;
    maintenanceRooms: number;
    byType: Record<string, { name: string; available: number; total: number; isFull: boolean }>;
  };

  // Backward-compatibility properties for SanjayMansionPage.tsx and SanjayMansionSection.tsx
  property: {
    id?: string;
    slug?: string;
    name: string;
    short_name?: string | null;
    tagline?: string | null;
    description?: string | null;
    long_description?: string | null;
    address_line1?: string | null;
    address_line2?: string | null;
    area?: string | null;
    city?: string | null;
    pincode?: string | null;
    full_address?: string | null;
    primary_phone?: string | null;
    secondary_phone?: string | null;
    whatsapp_number?: string | null;
    email?: string | null;
    google_maps_url?: string | null;
    embed_map_url?: string | null;
    hero_title?: string | null;
    hero_subtitle?: string | null;
    hero_description?: string | null;
    hero_image_url?: string | null;
    pricing_start?: string | null;
    status?: string | null;
    is_featured_homepage?: boolean;
    seo_title?: string | null;
    seo_description?: string | null;
  };
  accommodations: WesternStayRoomTypeRecord[];
  mealSubscriptionRates: Array<{
    plan_type: 'VEG' | 'NON-VEG';
    duration?: string;
    rate?: number;
    price_display?: string;
    monthly_price?: string;
    weekly_price?: string;
  }>;
  images: Array<{
    id?: string;
    url: string;
    title?: string | null;
    alt_text?: string | null;
    category?: string | null;
  }>;
}

// Operational KPIs for Western Stay Admin
export interface WesternStayDashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  reservedRooms: number;
  maintenanceRooms: number;
  currentMonthlyRevenue: number;
  pendingEnquiries: number;
  totalActiveBookings: number;
  occupancyRate: number;
}

// =============================================================================
// 3. CRM & SITE SETTINGS
// =============================================================================
export interface LeadNoteItem {
  id: string;
  text: string;
  createdAt: string;
  author?: string;
}

export interface LeadRecord {
  id: string;
  property_id?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  source: LeadSource;
  enquiry_type: string;
  status: LeadStatus;
  message?: string | null;
  preferred_date?: string | null;
  time_slot?: string | null;
  preferred_accommodation?: string | null;
  meal_plan?: string | null;
  budget?: string | null;
  notes: LeadNoteItem[];
  created_at: string;
  updated_at: string;
}

export interface SiteSettingsRecord {
  id: string;
  company_name: string;
  project_name: string;
  tagline?: string | null;
  email: string;
  phone: string;
  secondary_phone?: string | null;
  whatsapp_number?: string | null;
  full_address: string;
  google_maps_url: string;
  default_seo_title: string;
  default_seo_description: string;
  default_og_image?: string | null;
  updated_at: string;
}

// Backward Compatibility Aliases
export type Property = PropertyRecord;
export type FullPropertyData = PublicWesternStayData;
export type Lead = LeadRecord;
export type SiteSettings = SiteSettingsRecord;
export type PropertyImage = PropertyImageRecord;
export type AccommodationRecord = WesternStayRoomTypeRecord;
export type FacilityRecord = WesternStayFacilityRecord;
export type MealPlanRecord = WesternStayMealPlanRecord;
export type WeeklyMenuRecord = WesternStayMenuRecord;
