import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { justdialLeadService, type JustdialLeadFilters } from '../services/justdialLeadService';
import type { JustdialLeadRecord } from '../db/schema';

export const JUSTDIAL_LEADS_QUERY_KEY = ['justdial-leads'];

export function useJustdialLeads(filters: JustdialLeadFilters = {}) {
  return useQuery<JustdialLeadRecord[]>({
    queryKey: [...JUSTDIAL_LEADS_QUERY_KEY, filters],
    queryFn: async () => {
      return await justdialLeadService.getLeads(filters);
    },
    refetchInterval: 15000, // Refresh automatically every 15 seconds for incoming live leads
  });
}

export function useJustdialLeadStats() {
  return useQuery({
    queryKey: ['justdial-lead-stats'],
    queryFn: async () => {
      return await justdialLeadService.getLeadStats();
    },
    refetchInterval: 30000,
  });
}

export function useUpdateJustdialLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const ok = await justdialLeadService.updateLeadStatus(id, status);
      if (!ok) throw new Error('Failed to update lead status');
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JUSTDIAL_LEADS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['justdial-lead-stats'] });
    },
  });
}

export function useDeleteJustdialLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const ok = await justdialLeadService.deleteLead(id);
      if (!ok) throw new Error('Failed to delete lead');
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JUSTDIAL_LEADS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['justdial-lead-stats'] });
    },
  });
}
