import { getSupabaseClient } from '../lib/supabase';
import type { SiteSettingsRecord } from '../types/database';
import { CONTACT_CONFIG } from '../data/contact';

const DEFAULT_SETTINGS: SiteSettingsRecord = {
  id: 'global',
  company_name: CONTACT_CONFIG.companyName || 'SANJAY PROPERTIES',
  project_name: CONTACT_CONFIG.projectName || 'SANJAY GARDEN',
  tagline: CONTACT_CONFIG.tagline || 'A Better Address Begins With Better Planning',
  email: CONTACT_CONFIG.email || 'enquiries@sanjayproperties.in',
  phone: CONTACT_CONFIG.phone || '+91 80568 89900',
  secondary_phone: '+91 81108 89900',
  whatsapp_number: CONTACT_CONFIG.whatsappNumber || '918056889900',
  full_address: CONTACT_CONFIG.location.fullAddress || 'Sanjay Garden, PNT Colony, Saravanampatti, Coimbatore, Tamil Nadu – 641035',
  google_maps_url: 'https://maps.app.goo.gl/AJSivYbLohUfKxEA7',
  default_seo_title: 'Sanjay Properties | Sanjay Garden, Saravanampatti, Coimbatore',
  default_seo_description: 'Discover Sanjay Garden residential address and Western Stay Sanjay Mansion in Saravanampatti, Coimbatore by Sanjay Properties.',
  default_og_image: '/og-image.jpg',
  updated_at: new Date().toISOString()
};

export const settingsService = {
  async getSettings(): Promise<SiteSettingsRecord> {
    const client = getSupabaseClient();
    if (!client) {
      return DEFAULT_SETTINGS;
    }

    try {
      const { data, error } = await client
        .from('site_settings')
        .select('*')
        .eq('id', 'global')
        .maybeSingle();

      if (error || !data) {
        return DEFAULT_SETTINGS;
      }

      return data as SiteSettingsRecord;
    } catch (err) {
      console.error('Error fetching settings:', err);
      return DEFAULT_SETTINGS;
    }
  },

  async updateSettings(updates: Partial<SiteSettingsRecord>): Promise<{ success: boolean; error: string | null }> {
    const client = getSupabaseClient();
    if (!client) {
      return { success: true, error: null };
    }

    try {
      const { error } = await client
        .from('site_settings')
        .upsert({ ...updates, id: 'global', updated_at: new Date().toISOString() });

      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update settings' };
    }
  }
};
