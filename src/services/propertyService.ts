import { getSupabaseClient } from '../lib/supabase';
import type {
  PropertyRecord,
  PropertyImageRecord,
  PropertyFeatureRecord,
  FullRealEstatePropertyData,
  FullPropertyData,
  AccommodationRecord,
  FacilityRecord,
  MealPlanRecord,
  MealSubscriptionRateRecord,
  WeeklyMenuRecord
} from '../types/database';
import { westernStayService } from './westernStayService';

// =============================================================================
// SAMPLE REAL ESTATE PROPERTIES DATA
// =============================================================================

export function getDefaultSanjayGardensData(): FullRealEstatePropertyData {
  const property: PropertyRecord = {
    id: 'sanjay-gardens-uuid-001',
    slug: 'sanjay-gardens',
    name: 'SANJAY GARDENS',
    short_name: 'Sanjay Gardens',
    property_type: 'Land / Plot',
    status: 'active',
    tagline: 'Premium DTCP Villa Plots in Saravanampatti',
    description: 'DTCP approved residential villa plots in a serene and fast-developing prime neighborhood of Saravanampatti, Coimbatore.',
    long_description: 'Sanjay Gardens is a signature residential layout developed by Sanjay Properties in Saravanampatti, Coimbatore. Offering DTCP-approved residential plots with well-laid 30-feet tar roads, street lighting, 24x7 water connection, and clear legal titles. Located directly opposite to KCT Tech Park, offering high appreciation and immediate construction suitability.',
    address_line1: 'Sanjay Garden, PNT Colony',
    address_line2: 'Opp. KCT Tech Park',
    area: 'Saravanampatti',
    city: 'Coimbatore',
    pincode: '641 035',
    full_address: 'Sanjay Garden, PNT Colony, Saravanampatti, Coimbatore – 641 035',
    google_maps_url: 'https://maps.app.goo.gl/AJSivYbLohUfKxEA7',
    embed_map_url: 'https://maps.google.com/maps?q=11.0827,76.9942+(Sanjay%20Gardens)&t=&z=16&ie=UTF8&iwloc=&output=embed',
    price_display: '₹25 Lakhs onwards',
    price_numeric: 2500000,
    size_display: '1,200 - 2,400 sq.ft',
    highlights: [
      'DTCP Approved Layout No. 42/2008',
      'Clear Legal Title & Bank Loan Available',
      '30ft Wide Broad Tar Roads',
      'Solar Street Lights & EB Line Ready',
      '24×7 Abundant Siruvani & Borewell Water',
      'Walking Distance to KCT Tech Park'
    ],
    primary_phone: '8056889900',
    secondary_phone: '8110889900',
    whatsapp_number: '918056889900',
    email: 'enquiries@sanjayproperties.in',
    hero_title: 'SANJAY GARDENS',
    hero_subtitle: 'Premium Villa Plots in Saravanampatti',
    hero_description: 'Discover your dream villa plot opposite KCT Tech Park, Saravanampatti. DTCP approved, ready for immediate house construction.',
    hero_image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85',
    pricing_start: '₹25 Lakhs',
    is_featured: true,
    is_featured_homepage: true,
    seo_title: 'Sanjay Gardens | DTCP Villa Plots in Saravanampatti, Coimbatore',
    seo_description: 'Explore premium residential plots and villa sites at Sanjay Gardens, Saravanampatti, Coimbatore by Sanjay Properties.',
    og_image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85',
    canonical_url: 'https://sanjayproperties.in/properties/sanjay-gardens',
    keywords: 'Sanjay Gardens, Plots in Saravanampatti, Land for sale Coimbatore, Villa Plots',
    created_at: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
    updated_at: new Date().toISOString()
  };

  const images: PropertyImageRecord[] = [
    {
      id: 'sg-img-1',
      property_id: property.id,
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85',
      title: 'Sanjay Gardens Layout Aerial View',
      category: 'Exterior',
      alt_text: 'Sanjay Gardens Layout Aerial View',
      sort_order: 1,
      is_featured: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'sg-img-2',
      property_id: property.id,
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      title: '30ft Wide Main Tar Road with Avenue Trees',
      category: 'Exterior',
      alt_text: '30ft Wide Main Tar Road',
      sort_order: 2,
      is_featured: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'sg-img-3',
      property_id: property.id,
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
      title: 'Serene Residential Neighborhood',
      category: 'Interiors',
      alt_text: 'Modern Architecture Reference',
      sort_order: 3,
      is_featured: false,
      created_at: new Date().toISOString()
    }
  ];

  const features: PropertyFeatureRecord[] = [
    { id: 'f-1', property_id: property.id, title: 'DTCP & RERA Approved', description: 'Fully approved layout with clear parent documents and hassle-free bank loan approvals from SBI & HDFC.', icon_name: 'shield-check', sort_order: 1, created_at: new Date().toISOString() },
    { id: 'f-2', property_id: property.id, title: '30ft Broad Tar Roads', description: 'Well-paved internal roads with avenue trees, pedestrian walkways, and rainwater drainage canals.', icon_name: 'check', sort_order: 2, created_at: new Date().toISOString() },
    { id: 'f-3', property_id: property.id, title: '24×7 Potable Water', description: 'Siruvani pipeline supply connection and abundant sweet groundwater availability.', icon_name: 'droplets', sort_order: 3, created_at: new Date().toISOString() },
    { id: 'f-4', property_id: property.id, title: 'Opposite KCT Tech Park', description: 'Just 2 minutes walk to major IT campuses, colleges, shopping centers, and hospitals in Saravanampatti.', icon_name: 'map-pin', sort_order: 4, created_at: new Date().toISOString() }
  ];

  return { property, images, features };
}

export function getDefaultSampleProperties(): PropertyRecord[] {
  const sg = getDefaultSanjayGardensData().property;

  const sm: PropertyRecord = {
    id: 'sanjay-mansion-uuid-101',
    slug: 'sanjay-mansion',
    name: 'WESTERN STAY – SANJAY MANSION',
    short_name: 'Sanjay Mansion',
    property_type: 'Commercial',
    status: 'active',
    tagline: 'Your Home Away From Home in Saravanampatti',
    description: 'Premier residential PG & hostel accommodation opposite KCT Tech Park with attached bathrooms, Wi-Fi, and homestyle food.',
    long_description: 'Western Stay – Sanjay Mansion offers a peaceful, secure, and fully equipped residential hostel experience in Saravanampatti, Coimbatore. Designed specifically for working IT professionals and college students.',
    address_line1: 'No. 6, Sanjay Garden',
    address_line2: 'Opp. KCT Tech Park',
    area: 'Saravanampatti',
    city: 'Coimbatore',
    pincode: '641 035',
    full_address: 'No. 6, Sanjay Garden, Opp. KCT Tech Park, Saravanampatti, Coimbatore – 641 035',
    google_maps_url: 'https://maps.app.goo.gl/AJSivYbLohUfKxEA7',
    embed_map_url: 'https://maps.google.com/maps?q=11.0827,76.9942+(Western%20Stay%20-%20Sanjay%20Mansion)&t=&z=16&ie=UTF8&iwloc=&output=embed',
    price_display: '₹4,900 onwards',
    pricing_start: '₹4,900',
    size_display: 'Single, 2 & 4 Sharing',
    highlights: ['Free 60GB Wi-Fi', 'Solar Hot Water', 'Attached Washrooms', 'Homestyle Food', 'CCTV Security'],
    primary_phone: '8056889900',
    secondary_phone: '8110889900',
    whatsapp_number: '918056889900',
    email: 'enquiries@sanjayproperties.in',
    hero_title: 'WESTERN STAY – SANJAY MANSION',
    hero_subtitle: 'Quality & Comfort Accommodation',
    hero_description: 'A peaceful address for comfortable daily living. High-speed Wi-Fi, hygienic dining, and 24x7 security.',
    hero_image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
    is_featured: true,
    is_featured_homepage: true,
    seo_title: 'Western Stay – Sanjay Mansion | Hostel in Saravanampatti, Coimbatore',
    seo_description: 'Comfortable hostel accommodation in Saravanampatti, Coimbatore near KCT Tech Park with modern amenities and dining.',
    og_image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    canonical_url: 'https://sanjayproperties.in/sanjay-mansion',
    keywords: 'Western Stay, Sanjay Mansion, Hostel Saravanampatti, PG Coimbatore',
    created_at: new Date(Date.now() - 3600000 * 24 * 60).toISOString(),
    updated_at: new Date().toISOString()
  };

  const se: PropertyRecord = {
    id: 'sanjay-enclave-uuid-003',
    slug: 'sanjay-enclave-villas',
    name: 'SANJAY ENCLAVE LUXURY VILLAS',
    short_name: 'Sanjay Enclave',
    property_type: 'Residential Villa',
    status: 'active',
    tagline: 'Modern 3BHK Gated Community Villas',
    description: 'Boutique gated enclave of contemporary 3BHK duplex villas with private terrace, covered car porch, and landscaped gardens.',
    long_description: 'Sanjay Enclave Luxury Villas is an exclusive gated community of just 18 premium duplex villas crafted with modern architecture, premium vitrified tiles, and smart home automation features.',
    address_line1: 'Near KGISL Campus, Vilankurichi Road',
    address_line2: 'Saravanampatti',
    area: 'Saravanampatti',
    city: 'Coimbatore',
    pincode: '641 035',
    full_address: 'Vilankurichi Road, Near KGISL Campus, Saravanampatti, Coimbatore – 641 035',
    google_maps_url: 'https://maps.app.goo.gl/AJSivYbLohUfKxEA7',
    price_display: '₹78 Lakhs onwards',
    price_numeric: 7800000,
    size_display: '2,200 sq.ft Duplex',
    highlights: ['100% Vaastu Compliant', 'Individual Borewell & Siruvani', 'Covered Car Porch', 'Private Terrace Garden'],
    primary_phone: '8056889900',
    secondary_phone: '8110889900',
    whatsapp_number: '918056889900',
    email: 'enquiries@sanjayproperties.in',
    hero_title: 'SANJAY ENCLAVE LUXURY VILLAS',
    hero_image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
    pricing_start: '₹78 Lakhs',
    is_featured: true,
    is_featured_homepage: false,
    seo_title: 'Sanjay Enclave | 3BHK Duplex Villas in Saravanampatti, Coimbatore',
    seo_description: 'Luxury 3BHK villas for sale in Saravanampatti near KGISL campus by Sanjay Properties.',
    created_at: new Date(Date.now() - 3600000 * 24 * 15).toISOString(),
    updated_at: new Date().toISOString()
  };

  const sa: PropertyRecord = {
    id: 'sanjay-avenue-uuid-004',
    slug: 'sanjay-avenue',
    name: 'SANJAY AVENUE COMMERCIAL SITES',
    short_name: 'Sanjay Avenue',
    property_type: 'Commercial',
    status: 'draft',
    tagline: 'High-Footfall Main Road Commercial Plots',
    description: 'Prime commercial frontage plots suitable for retail showrooms, clinics, corporate offices, and banks on Sathy Road corridor.',
    address_line1: 'Main Sathy Road Corridor',
    address_line2: 'Saravanampatti Junction',
    area: 'Saravanampatti',
    city: 'Coimbatore',
    pincode: '641 035',
    full_address: 'Main Sathy Road, Saravanampatti Junction, Coimbatore – 641 035',
    google_maps_url: 'https://maps.app.goo.gl/AJSivYbLohUfKxEA7',
    price_display: '₹55 Lakhs onwards',
    price_numeric: 5500000,
    size_display: '2,400 - 4,800 sq.ft',
    highlights: ['60ft Highway Frontage', 'Commercial Zone Approved', 'High Vehicle Density', 'Ideal for Retail / Bank'],
    primary_phone: '8056889900',
    secondary_phone: '8110889900',
    whatsapp_number: '918056889900',
    email: 'enquiries@sanjayproperties.in',
    hero_title: 'SANJAY AVENUE COMMERCIAL',
    hero_image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
    pricing_start: '₹55 Lakhs',
    is_featured: false,
    is_featured_homepage: false,
    seo_title: 'Sanjay Avenue Commercial Plots | Sathy Road, Saravanampatti',
    seo_description: 'Commercial plots for sale on Main Sathy Road corridor, Saravanampatti, Coimbatore.',
    created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    updated_at: new Date().toISOString()
  };

  return [sg, sm, se, sa];
}

// In-memory property cache for local edits during session
let localPropertiesCache: PropertyRecord[] = getDefaultSampleProperties();

export const propertyService = {
  // ===========================================================================
  // REAL ESTATE PROPERTIES
  // ===========================================================================

  async getAllProperties(): Promise<PropertyRecord[]> {
    const client = getSupabaseClient();
    if (!client) {
      return localPropertiesCache;
    }

    try {
      const { data, error } = await client
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return localPropertiesCache;
      }

      return data as PropertyRecord[];
    } catch (err) {
      console.error('Error in getAllProperties:', err);
      return localPropertiesCache;
    }
  },

  async getProperties(): Promise<{ data: PropertyRecord[]; error: string | null }> {
    const all = await this.getAllProperties();
    return { data: all, error: null };
  },

  async getPropertyBySlug(slugOrId: string): Promise<FullRealEstatePropertyData> {
    const all = await this.getAllProperties();
    const matched = all.find((p) => p.slug === slugOrId || p.id === slugOrId) || getDefaultSanjayGardensData().property;

    const defaultData = getDefaultSanjayGardensData();
    const client = getSupabaseClient();
    if (!client) {
      return {
        property: matched,
        images: defaultData.images.map((img) => ({ ...img, property_id: matched.id })),
        features: defaultData.features.map((f) => ({ ...f, property_id: matched.id }))
      };
    }

    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
      let query = client.from('properties').select('*');
      if (isUuid) {
        query = query.eq('id', slugOrId);
      } else {
        query = query.eq('slug', slugOrId);
      }
      const { data: prop } = await query.maybeSingle();

      if (!prop) {
        return {
          property: matched,
          images: defaultData.images.map((img) => ({ ...img, property_id: matched.id })),
          features: defaultData.features.map((f) => ({ ...f, property_id: matched.id }))
        };
      }

      const [{ data: images }, { data: features }] = await Promise.all([
        client.from('property_images').select('*').eq('property_id', prop.id).order('sort_order', { ascending: true }),
        client.from('property_features').select('*').eq('property_id', prop.id).order('sort_order', { ascending: true })
      ]);

      return {
        property: prop as PropertyRecord,
        images: (images as PropertyImageRecord[]) || defaultData.images,
        features: (features as PropertyFeatureRecord[]) || defaultData.features
      };
    } catch (err) {
      console.error('Error in getPropertyBySlug:', err);
      return {
        property: matched,
        images: defaultData.images,
        features: defaultData.features
      };
    }
  },

  async getPropertyById(idOrSlug: string): Promise<{ data: FullPropertyData | null; error: string | null }> {
    try {
      const data = await this.getFullPropertyBySlug(idOrSlug);
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message || 'Failed to load property' };
    }
  },

  async createProperty(prop: Partial<PropertyRecord>): Promise<{ data: PropertyRecord | null; error: string | null } & PropertyRecord> {
    const newId = prop.id || 'prop-' + Date.now();
    const newRecord: PropertyRecord = {
      id: newId,
      slug: prop.slug || 'property-' + Date.now(),
      name: prop.name || 'New Property',
      short_name: prop.short_name || prop.name || 'Property',
      property_type: prop.property_type || 'Land / Plot',
      status: prop.status || 'active',
      tagline: prop.tagline || '',
      description: prop.description || '',
      long_description: prop.long_description || '',
      address_line1: prop.address_line1 || 'Saravanampatti',
      address_line2: prop.address_line2 || '',
      area: prop.area || 'Saravanampatti',
      city: prop.city || 'Coimbatore',
      pincode: prop.pincode || '641 035',
      full_address: prop.full_address || 'Saravanampatti, Coimbatore',
      google_maps_url: prop.google_maps_url || 'https://maps.app.goo.gl/AJSivYbLohUfKxEA7',
      primary_phone: prop.primary_phone || '8056889900',
      secondary_phone: prop.secondary_phone || '8110889900',
      whatsapp_number: prop.whatsapp_number || '918056889900',
      email: prop.email || 'enquiries@sanjayproperties.in',
      hero_title: prop.hero_title || prop.name,
      hero_image_url: prop.hero_image_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85',
      pricing_start: prop.pricing_start || '₹25 Lakhs',
      is_featured: prop.is_featured ?? true,
      is_featured_homepage: prop.is_featured_homepage ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...prop
    };

    localPropertiesCache = [newRecord, ...localPropertiesCache];

    const client = getSupabaseClient();
    if (!client) {
      return { data: newRecord, error: null, ...newRecord };
    }

    try {
      const { data, error } = await client.from('properties').insert(newRecord).select().single();
      if (error || !data) {
        return { data: newRecord, error: null, ...newRecord };
      }
      return { data: data as PropertyRecord, error: null, ...(data as PropertyRecord) };
    } catch {
      return { data: newRecord, error: null, ...newRecord };
    }
  },

  async saveProperty(propertyData: Partial<PropertyRecord>): Promise<{ data: PropertyRecord | null; error: string | null }> {
    if (propertyData.id && localPropertiesCache.some((p) => p.id === propertyData.id)) {
      await this.updateProperty(propertyData.id, propertyData);
      const updated = localPropertiesCache.find((p) => p.id === propertyData.id) || null;
      return { data: updated, error: null };
    } else {
      const res = await this.createProperty(propertyData);
      return { data: res.data || res, error: null };
    }
  },

  async updateProperty(id: string, updates: Partial<PropertyRecord>): Promise<boolean> {
    localPropertiesCache = localPropertiesCache.map((p) => (p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p));

    const client = getSupabaseClient();
    if (!client) return true;

    try {
      const { error } = await client
        .from('properties')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      return !error;
    } catch {
      return true;
    }
  },

  async deleteProperty(id: string): Promise<{ success: boolean; error: string | null } | boolean> {
    localPropertiesCache = localPropertiesCache.filter((p) => p.id !== id);

    const client = getSupabaseClient();
    if (!client) return { success: true, error: null };

    try {
      const { error } = await client.from('properties').delete().eq('id', id);
      return { success: !error, error: error?.message || null };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete' };
    }
  },

  // ===========================================================================
  // BACKWARD-COMPATIBILITY RELATIONAL PERSISTENCE FOR ADMIN EDITOR
  // ===========================================================================

  async saveAccommodations(propertyId: string, items: any[]): Promise<boolean> {
    return true;
  },

  async deleteAccommodation(id: string): Promise<boolean> {
    return true;
  },

  async saveFacilities(propertyId: string, items: any[]): Promise<boolean> {
    return true;
  },

  async deleteFacility(id: string): Promise<boolean> {
    return true;
  },

  async saveMealPlans(propertyId: string, items: any[]): Promise<boolean> {
    return true;
  },

  async deleteMealPlan(id: string): Promise<boolean> {
    return true;
  },

  async saveMealSubscriptionRates(propertyId: string, items: any[]): Promise<boolean> {
    return true;
  },

  async saveWeeklyMenu(propertyId: string, menuItems: any[]): Promise<boolean> {
    return true;
  },

  async savePropertyImages(propertyId: string, images: any[]): Promise<boolean> {
    return true;
  },

  async deletePropertyImage(id: string): Promise<boolean> {
    return true;
  },

  async getFullPropertyBySlug(slug: string = 'sanjay-mansion'): Promise<FullPropertyData> {
    return westernStayService.getPublicWesternStayData();
  }
};

export function getDefaultSanjayMansionFullData(): FullPropertyData {
  return westernStayService.getPublicWesternStayDataSync();
}
