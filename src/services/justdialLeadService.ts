import { getSupabaseClient } from '../lib/supabase';
import type { JustdialLeadRecord } from '../db/schema';

export interface JustdialLeadFilters {
  search?: string;
  status?: string;
  crmStatus?: string;
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
  // CRM Sync Status counts
  pendingCrmCount: number;
  syncedCrmCount: number;
  failedCrmCount: number;
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

      // Exclude synthetic test leads created during dev/testing (e.g. TEST001, TEST002 with mock website company details)
      query = query.not('leadid', 'ilike', 'TEST%');

      if (filters.status && filters.status !== 'all') {
        query = query.ilike('status', filters.status);
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

      let results = ((data || []) as any[]).map((item) => {
        const leadDate =
          item.leadDate ??
          item.lead_date ??
          item.raw_payload?.date ??
          (item.created_at ? String(item.created_at).split('T')[0] : null);

        const leadTime =
          item.leadTime ??
          item.lead_time ??
          item.raw_payload?.time ??
          null;

        const rawCrm = item.raw_payload?.crm_sync;
        const crmSyncStatus =
          item.crmSyncStatus ||
          item.crm_sync_status ||
          rawCrm?.status ||
          'pending';

        const crmLeadId =
          item.crmLeadId ||
          item.crm_lead_id ||
          rawCrm?.crm_lead_id ||
          null;

        const crmSyncedAt =
          item.crmSyncedAt ||
          item.crm_synced_at ||
          rawCrm?.synced_at ||
          null;

        const crmSyncError =
          item.crmSyncError ||
          item.crm_sync_error ||
          rawCrm?.error ||
          null;

        return {
          ...item,
          leadDate,
          leadTime,
          lead_date: leadDate,
          lead_time: leadTime,
          crmSyncStatus,
          crmLeadId,
          crmSyncedAt,
          crmSyncError,
          crm_sync_status: crmSyncStatus,
          crm_lead_id: crmLeadId,
          crm_synced_at: crmSyncedAt,
          crm_sync_error: crmSyncError,
          createdAt: item.createdAt ?? item.created_at,
          updatedAt: item.updatedAt ?? item.updated_at,
          rawPayload: item.rawPayload ?? item.raw_payload,
        };
      }).filter(
        (item) => !item.leadid?.toUpperCase().startsWith('TEST')
      ) as JustdialLeadRecord[];

      if (filters.crmStatus && filters.crmStatus !== 'all') {
        const targetCrm = filters.crmStatus.toLowerCase();
        results = results.filter((item: any) =>
          ((item.crmSyncStatus || item.crm_sync_status || 'pending').toLowerCase()) === targetCrm
        );
      }

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
          (item.company && item.company.toLowerCase().includes(q)) ||
          ((item as any).crmLeadId && (item as any).crmLeadId.toLowerCase().includes(q))
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

  // Retry CRM synchronization for a single lead via server-side endpoint
  async retryCrmSync(leadId: string): Promise<{ success: boolean; status: string; crmLeadId?: string; error?: string }> {
    try {
      const response = await fetch('/api/leads/justdial/retry-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadId }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok && !data.success) {
        return {
          success: false,
          status: data.status || 'failed',
          error: data.error || `HTTP ${response.status}: Failed to synchronize with Budget AI CRM`,
        };
      }

      return {
        success: data.success,
        status: data.status || 'synced',
        crmLeadId: data.crmLeadId,
        error: data.error,
      };
    } catch (err: any) {
      console.error('Exception retrying CRM sync:', err);
      return {
        success: false,
        status: 'failed',
        error: err?.message || 'Network error triggering CRM sync',
      };
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
      // CRM status counts
      pendingCrmCount: leads.filter((l: any) => (l.crmSyncStatus || l.crm_sync_status || 'pending').toLowerCase() === 'pending').length,
      syncedCrmCount: leads.filter((l: any) => (l.crmSyncStatus || l.crm_sync_status || '').toLowerCase() === 'synced').length,
      failedCrmCount: leads.filter((l: any) => (l.crmSyncStatus || l.crm_sync_status || '').toLowerCase() === 'failed').length,
    };
  },
};
