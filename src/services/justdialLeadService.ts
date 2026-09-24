import { getSupabaseClient } from '../lib/supabase';
import type { JustdialLeadRecord } from '../db/schema';

export interface JustdialLeadFilters {
  search?: string;
  status?: string;
  category?: string;
  city?: string;
  sortBy?: 'newest' | 'oldest';
}

export interface JustdialLeadStats {
  total: number;
  newCount: number;
  contactedCount: number;
  followUpCount: number;
  convertedCount: number;
  closedCount: number;
}

export const justdialLeadService = {
  // Fetch Justdial leads with optional filtering
  async getLeads(filters: JustdialLeadFilters = {}): Promise<JustdialLeadRecord[]> {
    const client = getSupabaseClient();
    if (!client) {
      console.warn('Supabase client not initialized');
      return [];
    }

    try {
      let query = client
        .from('justdial_leads')
        .select('*');

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status.toLowerCase());
      }

      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters.city && filters.city !== 'all') {
        query = query.eq('city', filters.city);
      }

      const ascending = filters.sortBy === 'oldest';
      query = query.order('created_at', { ascending });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching Justdial leads:', error.message);
        return [];
      }

      let results = (data || []) as JustdialLeadRecord[];

      if (filters.search && filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        results = results.filter((item) =>
          (item.name && item.name.toLowerCase().includes(q)) ||
          (item.mobile && item.mobile.toLowerCase().includes(q)) ||
          (item.phone && item.phone.toLowerCase().includes(q)) ||
          (item.email && item.email.toLowerCase().includes(q)) ||
          (item.leadid && item.leadid.toLowerCase().includes(q)) ||
          (item.category && item.category.toLowerCase().includes(q)) ||
          (item.city && item.city.toLowerCase().includes(q)) ||
          (item.area && item.area.toLowerCase().includes(q)) ||
          (item.company && item.company.toLowerCase().includes(q))
        );
      }

      return results;
    } catch (err) {
      console.error('Failed to query Justdial leads:', err);
      return [];
    }
  },

  // Update lead status (new, contacted, follow-up, converted, closed)
  async updateLeadStatus(id: string, status: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      const normalizedStatus = status.toLowerCase();
      const { error } = await client
        .from('justdial_leads')
        .update({
          status: normalizedStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('Failed to update Justdial lead status:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error updating Justdial lead status:', err);
      return false;
    }
  },

  // Delete lead
  async deleteLead(id: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      const { error } = await client
        .from('justdial_leads')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Failed to delete Justdial lead:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error deleting Justdial lead:', err);
      return false;
    }
  },

  // Aggregate stats across Justdial leads
  async getLeadStats(): Promise<JustdialLeadStats> {
    const leads = await this.getLeads();
    return {
      total: leads.length,
      newCount: leads.filter((l) => (l.status || '').toLowerCase() === 'new').length,
      contactedCount: leads.filter((l) => (l.status || '').toLowerCase() === 'contacted').length,
      followUpCount: leads.filter((l) => (l.status || '').toLowerCase() === 'follow-up').length,
      convertedCount: leads.filter((l) => (l.status || '').toLowerCase() === 'converted').length,
      closedCount: leads.filter((l) => (l.status || '').toLowerCase() === 'closed').length,
    };
  },
};
