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
  Clock,
  Wrench,
  DollarSign,
  Users,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import type { RoomStatus } from '../../../types/database';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

export function WesternStayDashboard() {
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useWesternStayStatsQuery();
  const { data: rooms, isLoading: roomsLoading, refetch: refetchRooms } = useWesternStayRoomsQuery();
  const { data: enquiries } = useWesternStayEnquiriesQuery();
  const updateStatus = useUpdateRoomStatus();

  const handleRefresh = () => {
    refetchStats();
    refetchRooms();
  };

  const renderStatusBadge = (status: RoomStatus | string) => {
    switch ((status || '').toUpperCase()) {
      case 'AVAILABLE':
        return (
          <Badge variant="success" className="gap-1 px-2 py-0 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            AVAILABLE
          </Badge>
        );
      case 'OCCUPIED':
        return (
          <Badge variant="destructive" className="gap-1 px-2 py-0 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            OCCUPIED
          </Badge>
        );
      case 'RESERVED':
        return (
          <Badge variant="warning" className="gap-1 px-2 py-0 text-[10px]">
            <Clock className="w-2.5 h-2.5" />
            RESERVED
          </Badge>
        );
      case 'MAINTENANCE':
        return (
          <Badge variant="info" className="gap-1 px-2 py-0 text-[10px]">
            <Wrench className="w-2.5 h-2.5" />
            MAINTENANCE
          </Badge>
        );
      default:
        return <Badge variant="outline" className="text-[10px]">INACTIVE</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <Card className="bg-gradient-to-r from-amber-500/10 via-neutral-900 to-neutral-900 border-amber-500/20">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="default" className="text-[10px] font-bold uppercase tracking-wider">
                PG / Hostel Management
              </Badge>
              <span className="text-xs text-neutral-400">Live Operation</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Building2 className="w-6 h-6 text-[#FFCC00]" />
              Western Stay – Sanjay Mansion
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Saravanampatti, Coimbatore • Real-time room occupancy, reservations, and resident billing
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefresh}
              className="text-xs h-9"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Refresh
            </Button>
            <Button
              size="sm"
              asChild
              className="font-bold text-xs h-9"
            >
              <a href="/sanjay-mansion" target="_blank" rel="noopener noreferrer">
                <span>View Public Page</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Rooms */}
        <Card className="bg-neutral-900/60 border-neutral-800">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Total Rooms
            </CardTitle>
            <Bed className="w-4 h-4 text-neutral-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-white">
              {statsLoading ? '...' : stats?.totalRooms ?? 8}
            </div>
            <p className="text-xs text-neutral-500 mt-1">Active inventory</p>
          </CardContent>
        </Card>

        {/* Available */}
        <Card className="bg-neutral-900/60 border-emerald-500/20">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Available
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-emerald-400">
              {statsLoading ? '...' : stats?.availableRooms ?? 0}
            </div>
            <p className="text-xs text-neutral-500 mt-1">Ready for check-in</p>
          </CardContent>
        </Card>

        {/* Occupied */}
        <Card className="bg-neutral-900/60 border-rose-500/20">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              Occupied
            </CardTitle>
            <Users className="w-4 h-4 text-rose-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-rose-400">
              {statsLoading ? '...' : stats?.occupiedRooms ?? 0}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              {stats?.occupancyRate ? `${stats.occupancyRate}% Occupancy` : 'Active occupants'}
            </p>
          </CardContent>
        </Card>

        {/* Maintenance / Reserved */}
        <Card className="bg-neutral-900/60 border-amber-500/20">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Reserved / Maint.
            </CardTitle>
            <Clock className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-amber-400">
              {statsLoading
                ? '...'
                : (stats?.reservedRooms ?? 0) + (stats?.maintenanceRooms ?? 0)}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              {stats?.reservedRooms ?? 0} Reserved • {stats?.maintenanceRooms ?? 0} Maint.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial & Inquiries Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-neutral-900/60 border-neutral-800">
          <CardContent className="p-5 flex items-center gap-4">
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
          </CardContent>
        </Card>

        <Card className="bg-neutral-900/60 border-neutral-800">
          <CardContent className="p-5 flex items-center gap-4">
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
                className="text-xs text-[#FFCC00] hover:underline flex items-center gap-1 mt-0.5 font-medium"
              >
                Open enquiries CRM <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900/60 border-neutral-800">
          <CardContent className="p-5 flex items-center gap-4">
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
                className="text-xs text-purple-400 hover:underline flex items-center gap-1 mt-0.5 font-medium"
              >
                View resident directory <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Room Availability Grid */}
      <Card className="bg-neutral-900/60 border-neutral-800">
        <CardHeader className="p-5 pb-3 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Bed className="w-5 h-5 text-[#FFCC00]" />
              Live Room Availability Grid
            </CardTitle>
            <CardDescription className="text-xs text-neutral-400 mt-0.5">
              Click any room to quickly toggle its availability status. Reflects live on the public website.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Available
            </span>
            <span className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span> Occupied
            </span>
            <span className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Reserved
            </span>
            <span className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span> Maintenance
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          {roomsLoading ? (
            <div className="py-12 text-center text-neutral-400 text-xs animate-pulse">
              Loading room inventory...
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3">
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
                    className={`p-3.5 rounded-xl border transition-all ${borderColors[room.status] || 'border-neutral-800'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-white font-mono">
                        Room {room.room_number}
                      </span>
                      {renderStatusBadge(room.status)}
                    </div>

                    <div className="text-xs text-neutral-300 font-medium truncate">
                      {room.room_type_name}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      {room.floor} • ₹{room.monthly_price.toLocaleString('en-IN')}/mo
                    </div>

                    {/* Status Toggle Quick Buttons */}
                    <div className="mt-2.5 pt-2 border-t border-neutral-800/80">
                      <Select
                        value={(room.status || 'AVAILABLE').toUpperCase()}
                        onValueChange={(val) =>
                          updateStatus.mutate({
                            roomId: room.id,
                            status: val as RoomStatus
                          })
                        }
                      >
                        <SelectTrigger className="w-full h-7 text-[11px] bg-neutral-900 border-neutral-700/80">
                          <SelectValue placeholder="Set Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AVAILABLE">Available</SelectItem>
                          <SelectItem value="OCCUPIED">Occupied</SelectItem>
                          <SelectItem value="RESERVED">Reserved</SelectItem>
                          <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                          <SelectItem value="INACTIVE">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <Button variant="ghost" size="sm" asChild className="text-[#FFCC00] hover:text-[#FFCC00] hover:bg-neutral-800">
              <a href="/admin/western-stay/rooms" className="flex items-center gap-1.5 text-xs font-semibold">
                <span>Manage Full Room Inventory & Pricing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links to Western Stay Sub-sections */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <a
          href="/admin/western-stay/rooms"
          className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-[#FFCC00]/50 transition-colors group"
        >
          <Bed className="w-5 h-5 text-[#FFCC00] mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-sm font-semibold text-white">Room Inventory</div>
          <p className="text-xs text-neutral-400 mt-1">Add, edit and monitor rooms</p>
        </a>

        <a
          href="/admin/western-stay/room-types"
          className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-[#FFCC00]/50 transition-colors group"
        >
          <Building2 className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-sm font-semibold text-white">Room Types & Tariffs</div>
          <p className="text-xs text-neutral-400 mt-1">Single, 2 & 4 sharing tariffs</p>
        </a>

        <a
          href="/admin/western-stay/facilities"
          className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-[#FFCC00]/50 transition-colors group"
        >
          <CheckCircle2 className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-sm font-semibold text-white">Facilities & Amenities</div>
          <p className="text-xs text-neutral-400 mt-1">Wi-Fi, Solar hot water, RO</p>
        </a>

        <a
          href="/admin/western-stay/meals"
          className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-[#FFCC00]/50 transition-colors group"
        >
          <DollarSign className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-sm font-semibold text-white">Meals & 7-Day Menu</div>
          <p className="text-xs text-neutral-400 mt-1">Homestyle dining plans</p>
        </a>
      </div>
    </div>
  );
}
