import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settingsService';
import type { SiteSettingsRecord } from '../types/database';

export const SETTINGS_QUERY_KEY = ['siteSettings'];

export function useSiteSettings() {
  return useQuery<SiteSettingsRecord>({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const data = await settingsService.getSettings();
      return data;
    },
  });
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<SiteSettingsRecord>) => {
      const { success, error } = await settingsService.updateSettings(settings);
      if (!success) throw new Error(error || 'Failed to update settings');
      return settings;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(SETTINGS_QUERY_KEY, (old: any) => ({ ...old, ...updated }));
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
    },
  });
}
