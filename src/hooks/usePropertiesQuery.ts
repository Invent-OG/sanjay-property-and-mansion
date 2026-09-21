import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '../services/propertyService';
import type { PropertyRecord, FullPropertyData } from '../types/database';

export const PROPERTIES_QUERY_KEY = ['properties'];
export const propertyQueryKey = (idOrSlug: string) => ['property', idOrSlug];

export function useProperties() {
  return useQuery<PropertyRecord[]>({
    queryKey: PROPERTIES_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await propertyService.getProperties();
      if (error) throw new Error(error);
      return data;
    },
  });
}

export function useProperty(idOrSlug: string | undefined) {
  return useQuery<FullPropertyData | null>({
    queryKey: propertyQueryKey(idOrSlug || ''),
    queryFn: async () => {
      if (!idOrSlug) return null;
      const { data, error } = await propertyService.getPropertyById(idOrSlug);
      if (error) throw new Error(error);
      return data;
    },
    enabled: Boolean(idOrSlug),
  });
}

export function useSaveProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyData: Partial<PropertyRecord>) => {
      const { data, error } = await propertyService.saveProperty(propertyData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (savedData) => {
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
      if (savedData?.id) {
        queryClient.invalidateQueries({ queryKey: propertyQueryKey(savedData.id) });
      }
      if (savedData?.slug) {
        queryClient.invalidateQueries({ queryKey: propertyQueryKey(savedData.slug) });
      }
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await propertyService.deleteProperty(id);
      if (typeof res === 'object' && res.error) throw new Error(res.error);
      if (res === false) throw new Error('Failed to delete property');
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
      queryClient.removeQueries({ queryKey: propertyQueryKey(deletedId) });
    },
  });
}
