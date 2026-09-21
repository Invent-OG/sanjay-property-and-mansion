import { getSupabaseClient } from '../lib/supabase';
import type { LeadRecord, LeadStatus, LeadSource, LeadNoteItem } from '../types/database';
import { leadStore } from './leadStore';

export interface LeadFilters {
  search?: string;
  source?: string;
  status?: string;
  sortBy?: 'newest' | 'oldest' | 'name';
}

export interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  closedLeads: number;
}

export const leadService = {
  // Public Lead Submission (saves to Supabase leads table + local leadStore fallback)
  async submitLead(payload: {
    name: string;
    phone: string;
    email?: string;
    source: LeadSource;
    enquiry_type?: string;
    message?: string;
    preferred_date?: string;
    time_slot?: string;
    preferred_accommodation?: string;
    meal_plan?: string;
    budget?: string;
    property_id?: string;
  }): Promise<{ success: boolean; id?: string; error?: string | null }> {
    // Also save in local leadStore for immediate UI reaction / fallback
    leadStore.saveLead({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      source: payload.source,
      type: payload.enquiry_type || 'General Enquiry',
      status: 'New',
      details: {
        message: payload.message,
        preferredDate: payload.preferred_date,
        timeSlot: payload.time_slot,
        roomType: payload.preferred_accommodation,
        mealPlan: payload.meal_plan,
        budget: payload.budget,
        targetProperty: payload.source === 'Sanjay Mansion' ? 'Western Stay – Sanjay Mansion' : 'Sanjay Garden, Saravanampatti'
      }
    });

    const client = getSupabaseClient();
    if (!client) {
      return { success: true, id: 'local-lead-' + Date.now() };
    }

    try {
      const { data, error } = await client
        .from('leads')
        .insert({
          name: payload.name.trim(),
          phone: payload.phone.trim(),
          email: payload.email?.trim() || null,
          source: payload.source,
          enquiry_type: payload.enquiry_type || 'General Enquiry',
          status: 'New',
          message: payload.message || null,
          preferred_date: payload.preferred_date || null,
          time_slot: payload.time_slot || null,
          preferred_accommodation: payload.preferred_accommodation || null,
          meal_plan: payload.meal_plan || null,
          budget: payload.budget || null,
          notes: []
        })
        .select()
        .single();

      if (error) {
        console.warn('Supabase lead submission error:', error);
        return { success: true, error: error.message };
      }

      return { success: true, id: data.id };
    } catch (err: any) {
      console.warn('Failed to insert lead to Supabase:', err);
      return { success: true };
    }
  },

  // Get all leads with optional filters
  async getLeads(filters: LeadFilters = {}): Promise<LeadRecord[]> {
    const client = getSupabaseClient();
    if (!client) {
      // Fallback: convert leadStore leads to LeadRecord format
      const localLeads = leadStore.getLeads();
      return localLeads.map((l) => ({
        id: l.id,
        name: l.name,
        phone: l.phone,
        email: l.email || null,
        source: l.source,
        enquiry_type: (l.type as string) || 'General Enquiry',
        status: (l.status === 'Lost' ? 'Closed' : l.status) as LeadStatus,
        message: l.details?.message || null,
        preferred_date: l.details?.preferredDate || null,
        time_slot: l.details?.timeSlot || null,
        preferred_accommodation: l.details?.roomType || null,
        meal_plan: l.details?.mealPlan || null,
        budget: l.details?.budget || null,
        notes: (l.notes || []).map((n) => ({ id: n.id, text: n.text, createdAt: n.createdAt, author: n.author })),
        created_at: l.createdAt,
        updated_at: l.updatedAt
      }));
    }

    try {
      let query = client.from('leads').select('*');

      if (filters.source && filters.source !== 'all') {
        query = query.eq('source', filters.source);
      }
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.sortBy === 'oldest') {
        query = query.order('created_at', { ascending: true });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error || !data) {
        return [];
      }

      let results = data as LeadRecord[];

      if (filters.search && filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        results = results.filter(
          (l) =>
            l.name.toLowerCase().includes(q) ||
            l.phone.toLowerCase().includes(q) ||
            (l.email && l.email.toLowerCase().includes(q)) ||
            (l.message && l.message.toLowerCase().includes(q))
        );
      }

      return results;
    } catch (err) {
      console.error('Error fetching leads:', err);
      return [];
    }
  },

  // Update lead status
  async updateLeadStatus(id: string, newStatus: LeadStatus): Promise<boolean> {
    leadStore.updateLead(id, { status: newStatus as any });

    const client = getSupabaseClient();
    if (!client) return true;

    try {
      const { error } = await client
        .from('leads')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      return !error;
    } catch (err) {
      console.error('Error updating lead status:', err);
      return false;
    }
  },

  // Add internal note to lead
  async addNote(id: string, noteText: string, author: string = 'Admin'): Promise<LeadNoteItem | null> {
    const newNote: LeadNoteItem = {
      id: 'note-' + Date.now(),
      text: noteText.trim(),
      createdAt: new Date().toISOString(),
      author
    };

    leadStore.addNote(id, noteText, author);

    const client = getSupabaseClient();
    if (!client) return newNote;

    try {
      const { data: currentLead } = await client.from('leads').select('notes').eq('id', id).single();
      const currentNotes = (currentLead?.notes || []) as LeadNoteItem[];
      const updatedNotes = [...currentNotes, newNote];

      await client.from('leads').update({ notes: updatedNotes, updated_at: new Date().toISOString() }).eq('id', id);

      return newNote;
    } catch (err) {
      console.error('Error adding note to lead:', err);
      return newNote;
    }
  },

  // Delete lead
  async deleteLead(id: string): Promise<boolean> {
    leadStore.deleteLead(id);

    const client = getSupabaseClient();
    if (!client) return true;

    try {
      const { error } = await client.from('leads').delete().eq('id', id);
      return !error;
    } catch (err) {
      console.error('Error deleting lead:', err);
      return false;
    }
  },

  // Add note alias
  async addLeadNote(id: string, noteText: string, author: string = 'Admin'): Promise<{ data: LeadNoteItem | null; error: string | null }> {
    const note = await this.addNote(id, noteText, author);
    return { data: note, error: null };
  },

  // Alias for getLeadStats
  async getLeadStats(): Promise<{ data: { total: number; new: number; contacted: number; closed: number }; error: string | null }> {
    const s = await this.getDashboardStats();
    return {
      data: {
        total: s.totalLeads,
        new: s.newLeads,
        contacted: s.contactedLeads,
        closed: s.closedLeads
      },
      error: null
    };
  },

  // Get aggregated dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    const client = getSupabaseClient();
    if (!client) {
      const localLeads = leadStore.getLeads();
      return {
        totalProperties: 1,
        activeProperties: 1,
        totalLeads: localLeads.length,
        newLeads: localLeads.filter((l) => l.status === 'New').length,
        contactedLeads: localLeads.filter((l) => l.status === 'Contacted').length,
        closedLeads: localLeads.filter((l) => l.status === 'Lost' || l.status === 'Converted').length
      };
    }

    try {
      const [{ data: props }, { data: leads }] = await Promise.all([
        client.from('properties').select('id, status'),
        client.from('leads').select('id, status')
      ]);

      const propList = props || [];
      const leadList = (leads || []) as { id: string; status: LeadStatus }[];

      return {
        totalProperties: propList.length || 1,
        activeProperties: propList.filter((p) => p.status === 'active').length || 1,
        totalLeads: leadList.length,
        newLeads: leadList.filter((l) => l.status === 'New').length,
        contactedLeads: leadList.filter((l) => l.status === 'Contacted' || l.status === 'In Discussion').length,
        closedLeads: leadList.filter((l) => l.status === 'Closed' || l.status === 'Converted' || l.status === 'Lost').length
      };
    } catch (err) {
      console.error('Error computing dashboard statistics:', err);
      return {
        totalProperties: 1,
        activeProperties: 1,
        totalLeads: 0,
        newLeads: 0,
        contactedLeads: 0,
        closedLeads: 0
      };
    }
  }
};
