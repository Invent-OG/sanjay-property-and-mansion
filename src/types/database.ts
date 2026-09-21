// Database and domain type definitions for Supabase & Sanjay Properties Admin

export type PropertyStatus = 'active' | 'draft' | 'inactive';
export type ImageCategory = 'Exterior' | 'Rooms' | 'Interiors' | 'Campus' | 'Facilities' | 'Other';
export type MealPlanType = 'VEG' | 'NON-VEG';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type LeadSource = 'Sanjay Properties' | 'Sanjay Mansion';
export type LeadStatus = 'New' | 'Contacted' | 'In Discussion' | 'Visit Scheduled' | 'Converted' | 'Lost' | 'Closed';

export interface PropertyRecord {
  id: string;
  slug: string;
  name: string;
  short_name: string;
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
  
  // Contact
  primary_phone: string;
  secondary_phone?: string | null;
  whatsapp_number?: string | null;
  email?: string | null;
  
  // Hero
  hero_title?: string | null;
  hero_subtitle?: string | null;
  hero_description?: string | null;
  hero_image_url?: string | null;
  
  // Starting price
  pricing_start?: string | null;
  
  // Flags
  status: PropertyStatus;
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
  category: ImageCategory;
  alt_text?: string | null;
  sort_order: number;
  is_featured: boolean;
  created_at: string;
}

export interface AccommodationRecord {
  id: string;
  property_id: string;
  name: string;
  badge?: string | null;
  price_monthly: number;
  price_display: string;
  price_note?: string | null;
  features: string[];
  is_recommended: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FacilityRecord {
  id: string;
  property_id: string;
  title: string;
  description?: string | null;
  icon_name: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MealPlanRecord {
  id: string;
  property_id: string;
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
  property_id: string;
  plan_type: MealPlanType;
  monthly_price: string;
  weekly_price: string;
  tag?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WeeklyMenuRecord {
  id: string;
  property_id: string;
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

// Complete Property with all joined relations for public & admin views
export interface FullPropertyData {
  property: PropertyRecord;
  images: PropertyImageRecord[];
  accommodations: AccommodationRecord[];
  facilities: FacilityRecord[];
  mealPlans: MealPlanRecord[];
  mealSubscriptionRates: MealSubscriptionRateRecord[];
  weeklyMenu: WeeklyMenuRecord[];
}

// Convenient Aliases
export type Property = PropertyRecord;
export type PropertyDetails = FullPropertyData;
export type Lead = LeadRecord;
export type SiteSettings = SiteSettingsRecord;
export type PropertyImage = PropertyImageRecord;
export type Accommodation = AccommodationRecord;
export type Facility = FacilityRecord;
export type MealPlan = MealPlanRecord;
export type MealSubscriptionRate = MealSubscriptionRateRecord;
export type WeeklyMenu = WeeklyMenuRecord;

