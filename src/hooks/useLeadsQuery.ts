import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService, type LeadFilters } from '../services/leadService';
import type { LeadRecord, LeadStatus } from '../types/database';

export const LEADS_QUERY_KEY = ['leads'];

export function useLeads(statusFilter?: string) {
  return useQuery<LeadRecord[]>({
    queryKey: statusFilter ? [...LEADS_QUERY_KEY, statusFilter] : LEADS_QUERY_KEY,
    queryFn: async () => {
      const filters: LeadFilters = statusFilter && statusFilter !== 'all' ? { status: statusFilter } : {};
      const data = await leadService.getLeads(filters);
      return data;
    },
  });
}

export function useLeadStats() {
  return useQuery({
    queryKey: ['lead-stats'],
    queryFn: async () => {
      const { data, error } = await leadService.getLeadStats();
      if (error) throw new Error(error);
      return data;
    },
  });
}

export function useSubmitLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (leadData: Parameters<typeof leadService.submitLead>[0]) => {
      const result = await leadService.submitLead(leadData);
      if (!result.success) throw new Error(result.error || 'Failed to submit lead');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
    },
  });
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: LeadStatus }) => {
      const success = await leadService.updateLeadStatus(id, status);
      if (!success) throw new Error('Failed to update lead status');
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
    },
  });
}

export function useAddLeadNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, noteText, author }: { id: string; noteText: string; author?: string }) => {
      const { data, error } = await leadService.addLeadNote(id, noteText, author);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const success = await leadService.deleteLead(id);
      if (!success) throw new Error('Failed to delete lead');
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
    },
  });
}
