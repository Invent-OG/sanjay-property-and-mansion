import React from 'react';
import {
  useWesternStayStatsQuery,
  useWesternStayRoomsQuery,
  useWesternStayEnquiriesQuery,
  useUpdateRoomStatus
} from '../../../hooks/useWesternStayQuery';
import {
  Building2,
  Bed,
  CheckCircle2,
  AlertCircle,
  Clock,
  Wrench,
  DollarSign,
  Users,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Phone,
  Calendar
} from 'lucide-react';
import type { RoomStatus } from '../../../types/database';

export function WesternStayDashboard() {
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useWesternStayStatsQuery();
  const { data: rooms, isLoading: roomsLoading, refetch: refetchRooms } = useWesternStayRoomsQuery();
  const { data: enquiries } = useWesternStayEnquiriesQuery();
  const updateStatus = useUpdateRoomStatus();

  const handleRefresh = () => {
    refetchStats();
    refetchRooms();
  };

  const getStatusBadge = (status: RoomStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            AVAILABLE
          </span>
        );
      case 'OCCUPIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            OCCUPIED
          </span>
        );
      case 'RESERVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            RESERVED
          </span>
        );
      case 'MAINTENANCE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Wrench className="w-3 h-3" />
            MAINTENANCE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-500/10 text-neutral-400 border border-neutral-500/20">
            INACTIVE
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-neutral-900 to-neutral-900 border border-amber-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFCC00]/10 text-[#FFCC00] text-xs font-bold uppercase tracking-wider border border-[#FFCC00]/30">
              PG / Hostel Management
            </span>
            <span className="text-xs text-neutral-400">Live Operation</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-[#FFCC00]" />
            Western Stay – Sanjay Mansion
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Saravanampatti, Coimbatore • Real-time room occupancy, reservations, and resident billing
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <a
            href="/sanjay-mansion"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFCC00] hover:bg-[#FFE066] text-black text-xs font-bold transition-all shadow-md"
          >
            View Public Page
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Rooms */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-medium uppercase tracking-wider mb-2">
            <span>Total Rooms</span>
            <Bed className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {statsLoading ? '...' : stats?.totalRooms ?? 8}
          </div>
          <p className="text-xs text-neutral-500 mt-1">Active inventory</p>
        </div>

        {/* Available */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-medium uppercase tracking-wider mb-2">
            <span>Available</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {statsLoading ? '...' : stats?.availableRooms ?? 0}
          </div>
          <p className="text-xs text-neutral-500 mt-1">Ready for check-in</p>
        </div>

        {/* Occupied */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-rose-500/20 hover:border-rose-500/40 transition-colors">
          <div className="flex items-center justify-between text-rose-400 text-xs font-medium uppercase tracking-wider mb-2">
            <span>Occupied</span>
            <Users className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400">
            {statsLoading ? '...' : stats?.occupiedRooms ?? 0}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {stats?.occupancyRate ? `${stats.occupancyRate}% Occupancy` : 'Active occupants'}
          </p>
        </div>

        {/* Maintenance / Reserved */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-amber-500/20 hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between text-amber-400 text-xs font-medium uppercase tracking-wider mb-2">
            <span>Reserved / Maint.</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">
            {statsLoading
              ? '...'
              : (stats?.reservedRooms ?? 0) + (stats?.maintenanceRooms ?? 0)}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {stats?.reservedRooms ?? 0} Reserved • {stats?.maintenanceRooms ?? 0} Maint.
          </p>
        </div>
      </div>

      {/* Financial & Inquiries Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium uppercase tracking-wider">
              Current Monthly Revenue
            </div>
            <div className="text-xl font-bold text-white mt-0.5">
              {statsLoading ? '...' : `₹${(stats?.currentMonthlyRevenue ?? 0).toLocaleString('en-IN')}`}
            </div>
            <p className="text-xs text-neutral-500">From active rent collections</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium uppercase tracking-wider">
              New Room Enquiries
            </div>
            <div className="text-xl font-bold text-white mt-0.5">
              {statsLoading ? '...' : stats?.pendingEnquiries ?? 0}
            </div>
            <a
              href="/admin/western-stay/enquiries"
              className="text-xs text-[#FFCC00] hover:underline flex items-center gap-1 mt-0.5"
            >
              Open enquiries CRM <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium uppercase tracking-wider">
              Active Bookings
            </div>
            <div className="text-xl font-bold text-white mt-0.5">
              {statsLoading ? '...' : stats?.totalActiveBookings ?? 0}
            </div>
            <a
              href="/admin/western-stay/occupants"
              className="text-xs text-purple-400 hover:underline flex items-center gap-1 mt-0.5"
            >
              View resident directory <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Visual Room Availability Grid */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bed className="w-5 h-5 text-[#FFCC00]" />
              Live Room Availability Grid
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Click any room to quickly toggle its availability status. Reflects live on the public website.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Available
            </span>
            <span className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Occupied
            </span>
            <span className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Reserved
            </span>
            <span className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span> Maintenance
            </span>
          </div>
        </div>

        {roomsLoading ? (
          <div className="py-12 text-center text-neutral-500 text-sm">
            Loading room inventory...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3.5">
            {rooms?.map((room) => {
              const borderColors: Record<RoomStatus, string> = {
                AVAILABLE: 'border-emerald-500/30 hover:border-emerald-400 bg-emerald-500/5',
                OCCUPIED: 'border-rose-500/30 hover:border-rose-400 bg-rose-500/5',
                RESERVED: 'border-amber-500/30 hover:border-amber-400 bg-amber-500/5',
                MAINTENANCE: 'border-blue-500/30 hover:border-blue-400 bg-blue-500/5',
                INACTIVE: 'border-neutral-700 bg-neutral-800/40'
              };

              return (
                <div
                  key={room.id}
                  className={`p-4 rounded-xl border transition-all ${borderColors[room.status] || 'border-neutral-800'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold text-white font-mono">
                      Room {room.room_number}
                    </span>
                    {getStatusBadge(room.status)}
                  </div>

                  <div className="text-xs text-neutral-300 font-medium truncate">
                    {room.room_type_name}
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    {room.floor} • ₹{room.monthly_price.toLocaleString('en-IN')}/mo
                  </div>

                  {/* Status Toggle Quick Buttons */}
                  <div className="mt-3 pt-2.5 border-t border-neutral-800 flex items-center gap-1">
                    <select
                      value={room.status}
                      onChange={(e) =>
                        updateStatus.mutate({
                          roomId: room.id,
                          status: e.target.value as RoomStatus
                        })
                      }
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-[11px] text-neutral-200 focus:outline-none focus:border-[#FFCC00]"
                    >
                      <option value="AVAILABLE">Set Available</option>
                      <option value="OCCUPIED">Set Occupied</option>
                      <option value="RESERVED">Set Reserved</option>
                      <option value="MAINTENANCE">Set Maintenance</option>
                      <option value="INACTIVE">Set Inactive</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <a
            href="/admin/western-stay/rooms"
            className="text-xs font-semibold text-[#FFCC00] hover:underline flex items-center gap-1"
          >
            Manage Full Room Inventory & Pricing <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Quick Links to Western Stay Sub-sections */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <a
          href="/admin/western-stay/rooms"
          className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#FFCC00]/50 transition-colors group"
        >
          <Bed className="w-5 h-5 text-[#FFCC00] mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-sm font-semibold text-white">Room Inventory</div>
          <p className="text-xs text-neutral-400 mt-1">Add, edit and monitor rooms</p>
        </a>

        <a
          href="/admin/western-stay/room-types"
          className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#FFCC00]/50 transition-colors group"
        >
          <Building2 className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-sm font-semibold text-white">Room Types & Tariffs</div>
          <p className="text-xs text-neutral-400 mt-1">Single, 2 & 4 sharing tariffs</p>
        </a>

        <a
          href="/admin/western-stay/facilities"
          className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#FFCC00]/50 transition-colors group"
        >
          <CheckCircle2 className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-sm font-semibold text-white">Facilities & Amenities</div>
          <p className="text-xs text-neutral-400 mt-1">Wi-Fi, Solar hot water, RO</p>
        </a>

        <a
          href="/admin/western-stay/meals"
          className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#FFCC00]/50 transition-colors group"
        >
          <DollarSign className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-sm font-semibold text-white">Meals & 7-Day Menu</div>
          <p className="text-xs text-neutral-400 mt-1">Homestyle dining plans</p>
        </a>
      </div>
    </div>
  );
}
