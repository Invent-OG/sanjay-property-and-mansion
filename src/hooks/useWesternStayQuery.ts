import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { westernStayService } from '../services/westernStayService';
import type {
  RoomStatus,
  WesternStayRoomRecord,
  WesternStayRoomTypeRecord,
  WesternStayOccupantRecord,
  WesternStayFacilityRecord,
  WesternStayMealPlanRecord,
  WesternStayMenuRecord,
  WesternStaySettingsRecord,
  WesternStayEnquiryStatus
} from '../types/database';

export const WESTERN_STAY_KEYS = {
  all: ['westernStay'] as const,
  publicData: () => [...WESTERN_STAY_KEYS.all, 'public'] as const,
  stats: () => [...WESTERN_STAY_KEYS.all, 'stats'] as const,
  rooms: () => [...WESTERN_STAY_KEYS.all, 'rooms'] as const,
  roomTypes: () => [...WESTERN_STAY_KEYS.all, 'roomTypes'] as const,
  occupants: () => [...WESTERN_STAY_KEYS.all, 'occupants'] as const,
  bookings: () => [...WESTERN_STAY_KEYS.all, 'bookings'] as const,
  facilities: () => [...WESTERN_STAY_KEYS.all, 'facilities'] as const,
  mealPlans: () => [...WESTERN_STAY_KEYS.all, 'mealPlans'] as const,
  weeklyMenu: () => [...WESTERN_STAY_KEYS.all, 'weeklyMenu'] as const,
  gallery: () => [...WESTERN_STAY_KEYS.all, 'gallery'] as const,
  enquiries: () => [...WESTERN_STAY_KEYS.all, 'enquiries'] as const,
  settings: () => [...WESTERN_STAY_KEYS.all, 'settings'] as const,
};

// 1. Public Data Query (for /sanjay-mansion)
export function useWesternStayPublicQuery() {
  return useQuery({
    queryKey: WESTERN_STAY_KEYS.publicData(),
    queryFn: () => westernStayService.getPublicWesternStayData(),
    staleTime: 1000 * 30, // 30s
  });
}

// 2. Dashboard Operational Stats
export function useWesternStayStatsQuery() {
  return useQuery({
    queryKey: WESTERN_STAY_KEYS.stats(),
    queryFn: () => westernStayService.getDashboardStats(),
    refetchInterval: 1000 * 60, // 1 min
  });
}

// 3. Room Inventory
export function useWesternStayRoomsQuery() {
  return useQuery({
    queryKey: WESTERN_STAY_KEYS.rooms(),
    queryFn: () => westernStayService.getRooms(),
  });
}

// 4. Room Types
export function useWesternStayRoomTypesQuery() {
  return useQuery({
    queryKey: WESTERN_STAY_KEYS.roomTypes(),
    queryFn: () => westernStayService.getRoomTypes(),
  });
}

// 5. Occupants
export function useWesternStayOccupantsQuery() {
  return useQuery({
    queryKey: WESTERN_STAY_KEYS.occupants(),
    queryFn: () => westernStayService.getOccupants(),
  });
}

// 6. Bookings
export function useWesternStayBookingsQuery() {
  return useQuery({
    queryKey: WESTERN_STAY_KEYS.bookings(),
    queryFn: () => westernStayService.getBookings(),
  });
}

// 7. Facilities
export function useWesternStayFacilitiesQuery() {
  return useQuery({
    queryKey: WESTERN_STAY_KEYS.facilities(),
    queryFn: () => westernStayService.getFacilities(),
  });
}

// 8. Meal Plans
export function useWesternStayMealPlansQuery() {
  return useQuery({
    queryKey: WESTERN_STAY_KEYS.mealPlans(),
    queryFn: () => westernStayService.getMealPlans(),
  });
}

// 9. Weekly Menu
export function useWesternStayMenuQuery() {
  return useQuery({
    queryKey: WESTERN_STAY_KEYS.weeklyMenu(),
    queryFn: () => westernStayService.getWeeklyMenu(),
  });
}

// 10. Gallery
export function useWesternStayGalleryQuery() {
  return useQuery({
    queryKey: WESTERN_STAY_KEYS.gallery(),
    queryFn: () => westernStayService.getGallery(),
  });
}

// 11. Enquiries
export function useWesternStayEnquiriesQuery() {
  return useQuery({
    queryKey: WESTERN_STAY_KEYS.enquiries(),
    queryFn: () => westernStayService.getEnquiries(),
  });
}

// 12. Settings
export function useWesternStaySettingsQuery() {
  return useQuery({
    queryKey: WESTERN_STAY_KEYS.settings(),
    queryFn: () => westernStayService.getSettings(),
  });
}

// =============================================================================
// MUTATION HOOKS
// =============================================================================

export function useUpdateRoomStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId, status }: { roomId: string; status: RoomStatus }) =>
      westernStayService.updateRoomStatus(roomId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: WESTERN_STAY_KEYS.rooms() });
      qc.invalidateQueries({ queryKey: WESTERN_STAY_KEYS.stats() });
      qc.invalidateQueries({ queryKey: WESTERN_STAY_KEYS.publicData() });
    },
  });
}

export function useUpdateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId, updates }: { roomId: string; updates: Partial<WesternStayRoomRecord> }) =>
      westernStayService.updateRoom(roomId, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: WESTERN_STAY_KEYS.rooms() });
      qc.invalidateQueries({ queryKey: WESTERN_STAY_KEYS.stats() });
      qc.invalidateQueries({ queryKey: WESTERN_STAY_KEYS.publicData() });
    },
  });
}

export function useUpdateRoomType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<WesternStayRoomTypeRecord> }) =>
      westernStayService.updateRoomType(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: WESTERN_STAY_KEYS.roomTypes() });
      qc.invalidateQueries({ queryKey: WESTERN_STAY_KEYS.publicData() });
      qc.invalidateQueries({ queryKey: WESTERN_STAY_KEYS.rooms() });
    },
  });
}

export function useCreateRoomType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (newType: Parameters<typeof westernStayService.createRoomType>[0]) =>
      westernStayService.createRoomType(newType),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: WESTERN_STAY_KEYS.roomTypes() });
      qc.invalidateQueries({ queryKey: WESTERN_STAY_KEYS.publicData() });
      qc.invalidateQueries({ queryKey: WESTERN_STAY_KEYS.rooms() });
    },
  });
}

export function useDeleteRoomType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => westernStayService.deleteRoomType(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: WESTERN_STAY_KEYS.roomTypes() });
      qc.invalidateQueries({ queryKey: WESTERN_STAY_KEYS.publicData() });
      qc.invalidateQueries({ queryKey: WESTERN_STAY_KEYS.rooms() });
    },
  });
}

export function useCreateOccupant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (occ: {
      room_id?: string;
      name: string;
      phone: string;
      email?: string;
      occupancy_type: string;
      check_in_date: string;
      expected_check_out_date?: string;
      monthly_rent: number;
      security_deposit?: number;
      notes?: string;
    }) => westernStayService.createOccupant(occ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: WESTERN_STAY_KEYS.occupants() });
      qc.invalidateQueries({ queryKey: WESTERN_STAY_KEYS.rooms() });
      qc.invalidateQueries({ queryKey: WESTERN_STAY_KEYS.stats() });
    },
  });
}

export function useUpdateEnquiryStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: WesternStayEnquiryStatus }) =>
      westernStayService.updateEnquiryStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: WESTERN_STAY_KEYS.enquiries() });
      qc.invalidateQueries({ queryKey: WESTERN_STAY_KEYS.stats() });
    },
  });
}

export function useUpdateWesternStaySettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<WesternStaySettingsRecord>) =>
      westernStayService.updateSettings(updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: WESTERN_STAY_KEYS.settings() });
      qc.invalidateQueries({ queryKey: WESTERN_STAY_KEYS.publicData() });
    },
  });
}
