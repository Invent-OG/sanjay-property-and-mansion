import { getSupabaseClient } from '../lib/supabase';
import type {
  PropertyRecord,
  PropertyImageRecord,
  AccommodationRecord,
  FacilityRecord,
  MealPlanRecord,
  MealSubscriptionRateRecord,
  WeeklyMenuRecord,
  FullPropertyData
} from '../types/database';
import { SANJAY_MANSION_DATA } from '../data/sanjayMansion';

// Default in-memory seed generator for fallback when Supabase is offline or unseeded
export function getDefaultSanjayMansionFullData(): FullPropertyData {
  const propertyId = 'sanjay-mansion-uuid-101';

  const property: PropertyRecord = {
    id: propertyId,
    slug: 'sanjay-mansion',
    name: SANJAY_MANSION_DATA.propertyName,
    short_name: SANJAY_MANSION_DATA.shortTitle,
    tagline: SANJAY_MANSION_DATA.tagline,
    description: SANJAY_MANSION_DATA.description,
    long_description: SANJAY_MANSION_DATA.longDescription,
    address_line1: SANJAY_MANSION_DATA.location.addressLine1,
    address_line2: SANJAY_MANSION_DATA.location.landmark,
    area: SANJAY_MANSION_DATA.location.area,
    city: SANJAY_MANSION_DATA.location.city,
    pincode: SANJAY_MANSION_DATA.location.pincode,
    full_address: SANJAY_MANSION_DATA.location.fullAddress,
    google_maps_url: SANJAY_MANSION_DATA.location.googleMapsUrl,
    embed_map_url: SANJAY_MANSION_DATA.location.embedMapUrl,
    primary_phone: '8056889900',
    secondary_phone: '8110889900',
    whatsapp_number: '918056889900',
    email: 'enquiries@sanjayproperties.in',
    hero_title: 'WESTERN STAY – SANJAY MANSION',
    hero_subtitle: 'Your Home Away From Home',
    hero_description: 'A peaceful and comfortable stay in Saravanampatti, Coimbatore, with quality accommodation, modern amenities and clean surroundings.',
    hero_image_url: SANJAY_MANSION_DATA.gallery[0]?.url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
    pricing_start: SANJAY_MANSION_DATA.pricingStart,
    status: 'active',
    is_featured_homepage: true,
    seo_title: 'Western Stay – Sanjay Mansion | Saravanampatti, Coimbatore',
    seo_description: 'Western Stay – Sanjay Mansion in Saravanampatti, Coimbatore offers comfortable accommodation with Wi-Fi, solar hot water, attached bathrooms, RO drinking water, laundry access, parking and 24×7 CCTV surveillance.',
    og_image_url: SANJAY_MANSION_DATA.gallery[0]?.url,
    canonical_url: 'https://sanjayproperties.in/sanjay-mansion',
    keywords: 'Sanjay Mansion, Western Stay, Hostel in Saravanampatti, PG in Coimbatore',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const images: PropertyImageRecord[] = SANJAY_MANSION_DATA.gallery.map((g, idx) => ({
    id: `img-${idx + 1}`,
    property_id: propertyId,
    url: g.url,
    title: g.title,
    category: (g.category as any) || 'Exterior',
    alt_text: g.title,
    sort_order: idx + 1,
    is_featured: !!g.featured,
    created_at: new Date().toISOString()
  }));

  const accommodations: AccommodationRecord[] = SANJAY_MANSION_DATA.accommodations.map((a, idx) => ({
    id: `acc-${a.id}`,
    property_id: propertyId,
    name: a.name,
    badge: a.badge || null,
    price_monthly: parseFloat(a.priceMonthly.replace(/[^0-9]/g, '')) || 5000,
    price_display: a.priceMonthly,
    price_note: a.priceNote || 'per month',
    features: a.features,
    is_recommended: !!a.recommended,
    sort_order: idx + 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  const facilities: FacilityRecord[] = SANJAY_MANSION_DATA.facilities.map((f, idx) => ({
    id: `fac-${f.id}`,
    property_id: propertyId,
    title: f.title,
    description: f.description,
    icon_name: f.iconName,
    sort_order: idx + 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  const mealPlans: MealPlanRecord[] = SANJAY_MANSION_DATA.mealsSummary.map((m, idx) => ({
    id: `meal-${idx + 1}`,
    property_id: propertyId,
    frequency: m.frequency,
    duration_days: m.days,
    price_approx: m.priceApprox,
    daily_rate_approx: m.dailyRateApprox || null,
    description: m.description,
    sort_order: idx + 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  const mealSubscriptionRates: MealSubscriptionRateRecord[] = SANJAY_MANSION_DATA.basicMealPlanPlans.map((r, idx) => ({
    id: `rate-${idx + 1}`,
    property_id: propertyId,
    plan_type: r.type as 'VEG' | 'NON-VEG',
    monthly_price: r.monthly,
    weekly_price: r.weekly,
    tag: r.tag,
    sort_order: idx + 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  const weeklyMenu: WeeklyMenuRecord[] = SANJAY_MANSION_DATA.weeklyMenu.map((wm, idx) => ({
    id: `menu-${idx + 1}`,
    property_id: propertyId,
    day_of_week: wm.day as any,
    breakfast: wm.breakfast,
    lunch: wm.lunch,
    dinner: wm.dinner,
    is_holiday: !!wm.isHoliday,
    sort_order: idx + 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  return {
    property,
    images,
    accommodations,
    facilities,
    mealPlans,
    mealSubscriptionRates,
    weeklyMenu
  };
}

export const propertyService = {
  // Alias for getProperties
  async getProperties(): Promise<{ data: PropertyRecord[]; error: string | null }> {
    const list = await this.getAllProperties();
    return { data: list, error: null };
  },

  // Alias for getPropertyById
  async getPropertyById(idOrSlug: string): Promise<{ data: any | null; error: string | null }> {
    const full = await this.getFullPropertyBySlug(idOrSlug);
    return { data: full, error: null };
  },

  // Alias for saveProperty
  async saveProperty(propertyData: Partial<PropertyRecord>): Promise<{ data: PropertyRecord | null; error: string | null }> {
    if (propertyData.id && propertyData.id !== 'new') {
      return await this.updateProperty(propertyData.id, propertyData);
    }
    return await this.createProperty(propertyData as any);
  },

  // Fetch all properties (Admin list)
  async getAllProperties(): Promise<PropertyRecord[]> {
    const client = getSupabaseClient();
    if (!client) {
      return [getDefaultSanjayMansionFullData().property];
    }

    try {
      const { data, error } = await client
        .from('properties')
        .select('*')
        .order('created_at', { ascending: true });

      if (error || !data || data.length === 0) {
        return [getDefaultSanjayMansionFullData().property];
      }
      return data as PropertyRecord[];
    } catch (err) {
      console.error('Error fetching properties from Supabase:', err);
      return [getDefaultSanjayMansionFullData().property];
    }
  },

  // Fetch active featured properties for Homepage
  async getHomepageFeaturedProperties(): Promise<PropertyRecord[]> {
    const client = getSupabaseClient();
    if (!client) {
      return [getDefaultSanjayMansionFullData().property];
    }

    try {
      const { data, error } = await client
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .eq('is_featured_homepage', true)
        .order('created_at', { ascending: true });

      if (error || !data || data.length === 0) {
        return [getDefaultSanjayMansionFullData().property];
      }
      return data as PropertyRecord[];
    } catch (err) {
      console.error('Error getting featured properties:', err);
      return [getDefaultSanjayMansionFullData().property];
    }
  },

  // Fetch full property by slug or id
  async getFullPropertyBySlug(slug: string = 'sanjay-mansion'): Promise<FullPropertyData> {
    const defaultData = getDefaultSanjayMansionFullData();
    const client = getSupabaseClient();
    if (!client) {
      return defaultData;
    }

    try {
      // 1. Fetch Property by UUID or slug
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
      let query = client.from('properties').select('*');
      if (isUuid) {
        query = query.eq('id', slug);
      } else {
        query = query.eq('slug', slug);
      }
      let { data: prop, error: propError } = await query.maybeSingle();

      if (!prop && slug !== 'sanjay-mansion') {
        const fallback = await client.from('properties').select('*').eq('slug', 'sanjay-mansion').maybeSingle();
        prop = fallback.data;
      }

      if (propError || !prop) {
        return defaultData;
      }

      const propertyId = prop.id;

      // 2. Fetch parallel relations
      const [
        { data: images },
        { data: accommodations },
        { data: facilities },
        { data: mealPlans },
        { data: mealSubscriptionRates },
        { data: weeklyMenu }
      ] = await Promise.all([
        client.from('property_images').select('*').eq('property_id', propertyId).order('sort_order', { ascending: true }),
        client.from('accommodations').select('*').eq('property_id', propertyId).order('sort_order', { ascending: true }),
        client.from('facilities').select('*').eq('property_id', propertyId).order('sort_order', { ascending: true }),
        client.from('meal_plans').select('*').eq('property_id', propertyId).order('sort_order', { ascending: true }),
        client.from('meal_subscription_rates').select('*').eq('property_id', propertyId).order('sort_order', { ascending: true }),
        client.from('weekly_menu').select('*').eq('property_id', propertyId).order('sort_order', { ascending: true })
      ]);

      return {
        property: prop as PropertyRecord,
        images: images && images.length > 0 ? (images as PropertyImageRecord[]) : defaultData.images,
        accommodations: accommodations && accommodations.length > 0 ? (accommodations as AccommodationRecord[]) : defaultData.accommodations,
        facilities: facilities && facilities.length > 0 ? (facilities as FacilityRecord[]) : defaultData.facilities,
        mealPlans: mealPlans && mealPlans.length > 0 ? (mealPlans as MealPlanRecord[]) : defaultData.mealPlans,
        mealSubscriptionRates: mealSubscriptionRates && mealSubscriptionRates.length > 0 ? (mealSubscriptionRates as MealSubscriptionRateRecord[]) : defaultData.mealSubscriptionRates,
        weeklyMenu: weeklyMenu && weeklyMenu.length > 0 ? (weeklyMenu as WeeklyMenuRecord[]) : defaultData.weeklyMenu
      };
    } catch (err) {
      console.error('Error in getFullPropertyBySlug:', err);
      return defaultData;
    }
  },

  // Save / Update complete property
  async updateProperty(id: string, updates: Partial<PropertyRecord>): Promise<{ data: PropertyRecord | null; error: string | null }> {
    const client = getSupabaseClient();
    if (!client) {
      return { data: null, error: 'Supabase client is not configured.' };
    }

    try {
      const { data, error } = await client
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as PropertyRecord, error: null };
    } catch (err: any) {
      return { data: null, error: err.message || 'Failed to update property' };
    }
  },

  // Create new property
  async createProperty(property: Omit<PropertyRecord, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: PropertyRecord | null; error: string | null }> {
    const client = getSupabaseClient();
    if (!client) {
      return { data: null, error: 'Supabase client is not configured.' };
    }

    try {
      const { data, error } = await client
        .from('properties')
        .insert(property)
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data: data as PropertyRecord, error: null };
    } catch (err: any) {
      return { data: null, error: err.message || 'Failed to create property' };
    }
  },

  // Delete property
  async deleteProperty(id: string): Promise<{ success: boolean; error: string | null }> {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, error: 'Supabase client is not configured.' };
    }

    try {
      const { error } = await client.from('properties').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete property' };
    }
  },

  // Accommodation CRUD
  async saveAccommodations(propertyId: string, items: Partial<AccommodationRecord>[]): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      // Upsert accommodation records
      for (const item of items) {
        if (item.id && !item.id.startsWith('temp-') && !item.id.startsWith('acc-')) {
          await client.from('accommodations').update(item).eq('id', item.id);
        } else {
          const { id, ...rest } = item;
          await client.from('accommodations').insert({ ...rest, property_id: propertyId });
        }
      }
      return true;
    } catch (err) {
      console.error('Error saving accommodations:', err);
      return false;
    }
  },

  async deleteAccommodation(id: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    const { error } = await client.from('accommodations').delete().eq('id', id);
    return !error;
  },

  // Facilities CRUD
  async saveFacilities(propertyId: string, items: Partial<FacilityRecord>[]): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      for (const item of items) {
        if (item.id && !item.id.startsWith('temp-') && !item.id.startsWith('fac-')) {
          await client.from('facilities').update(item).eq('id', item.id);
        } else {
          const { id, ...rest } = item;
          await client.from('facilities').insert({ ...rest, property_id: propertyId });
        }
      }
      return true;
    } catch (err) {
      console.error('Error saving facilities:', err);
      return false;
    }
  },

  async deleteFacility(id: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    const { error } = await client.from('facilities').delete().eq('id', id);
    return !error;
  },

  // Meal Plans CRUD
  async saveMealPlans(propertyId: string, items: Partial<MealPlanRecord>[]): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      for (const item of items) {
        if (item.id && !item.id.startsWith('temp-') && !item.id.startsWith('meal-')) {
          await client.from('meal_plans').update(item).eq('id', item.id);
        } else {
          const { id, ...rest } = item;
          await client.from('meal_plans').insert({ ...rest, property_id: propertyId });
        }
      }
      return true;
    } catch (err) {
      console.error('Error saving meal plans:', err);
      return false;
    }
  },

  async deleteMealPlan(id: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    const { error } = await client.from('meal_plans').delete().eq('id', id);
    return !error;
  },

  // Meal Subscription Rates CRUD
  async saveMealSubscriptionRates(propertyId: string, items: Partial<MealSubscriptionRateRecord>[]): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      for (const item of items) {
        if (item.id && !item.id.startsWith('temp-') && !item.id.startsWith('rate-')) {
          await client.from('meal_subscription_rates').update(item).eq('id', item.id);
        } else {
          const { id, ...rest } = item;
          await client.from('meal_subscription_rates').insert({ ...rest, property_id: propertyId });
        }
      }
      return true;
    } catch (err) {
      console.error('Error saving meal rates:', err);
      return false;
    }
  },

  // Weekly Menu CRUD
  async saveWeeklyMenu(propertyId: string, menuItems: Partial<WeeklyMenuRecord>[]): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      for (const item of menuItems) {
        if (item.id && !item.id.startsWith('temp-') && !item.id.startsWith('menu-')) {
          await client.from('weekly_menu').update(item).eq('id', item.id);
        } else {
          const { id, ...rest } = item;
          await client.from('weekly_menu').insert({ ...rest, property_id: propertyId });
        }
      }
      return true;
    } catch (err) {
      console.error('Error saving weekly menu:', err);
      return false;
    }
  },

  // Property Images CRUD
  async savePropertyImages(propertyId: string, images: Partial<PropertyImageRecord>[]): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      for (const img of images) {
        if (img.id && !img.id.startsWith('temp-') && !img.id.startsWith('img-')) {
          await client.from('property_images').update(img).eq('id', img.id);
        } else {
          const { id, ...rest } = img;
          await client.from('property_images').insert({ ...rest, property_id: propertyId });
        }
      }
      return true;
    } catch (err) {
      console.error('Error saving property images:', err);
      return false;
    }
  },

  async deletePropertyImage(id: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    const { error } = await client.from('property_images').delete().eq('id', id);
    return !error;
  }
};
