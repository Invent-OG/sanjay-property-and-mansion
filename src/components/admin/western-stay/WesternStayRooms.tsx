import React, { useState, useEffect, useMemo } from 'react';
import {
  useWesternStayRoomsQuery,
  useWesternStayRoomTypesQuery,
  useUpdateRoomStatus,
  useUpdateRoom
} from '../../../hooks/useWesternStayQuery';
import { westernStayService } from '../../../services/westernStayService';
import {
  Bed,
  Plus,
  Search,
  Filter,
  Layers,
  Clock,
  Wrench,
  Edit2,
  Trash2,
} from 'lucide-react';
import type { RoomStatus, WesternStayRoomRecord } from '../../../types/database';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { DataTablePagination } from '../../ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';

export function WesternStayRooms() {
  const { data: rooms, isLoading, refetch } = useWesternStayRoomsQuery();
  const { data: roomTypes } = useWesternStayRoomTypesQuery();
  const updateStatus = useUpdateRoomStatus();
  const updateRoom = useUpdateRoom();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [editingRoom, setEditingRoom] = useState<WesternStayRoomRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New room state
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomTypeId, setNewRoomTypeId] = useState('');
  const [newFloor, setNewFloor] = useState('1st Floor');
  const [newPrice, setNewPrice] = useState<number>(5900);
  const [newStatus, setNewStatus] = useState<RoomStatus>('AVAILABLE');
  const [newNotes, setNewNotes] = useState('');

  const floors = ['ALL', 'Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'];
  const statuses = ['ALL', 'AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE'];

  const filteredRooms = rooms?.filter((room) => {
    const matchesSearch =
      room.room_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.room_type_name && room.room_type_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (room.notes && room.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFloor = selectedFloor === 'ALL' || room.floor === selectedFloor;
    const matchesStatus = selectedStatus === 'ALL' || room.status === selectedStatus;

    return matchesSearch && matchesFloor && matchesStatus;
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFloor, selectedStatus]);

  const totalRooms = filteredRooms?.length || 0;
  const totalPages = Math.ceil(totalRooms / pageSize) || 1;
  const paginatedRooms = useMemo(() => {
    if (!filteredRooms) return [];
    const start = (currentPage - 1) * pageSize;
    return filteredRooms.slice(start, start + pageSize);
  }, [filteredRooms, currentPage, pageSize]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber || !newRoomTypeId) {
      alert('Please fill in room number and select a room type');
      return;
    }

    const created = await westernStayService.createRoom({
      room_number: newRoomNumber,
      room_type_id: newRoomTypeId,
      floor: newFloor,
      monthly_price: Number(newPrice),
      status: newStatus,
      notes: newNotes
    });

    if (created) {
      setIsAddModalOpen(false);
      setNewRoomNumber('');
      setNewNotes('');
      refetch();
    } else {
      alert('Failed to create room. Ensure the room number is unique.');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    const ok = await updateRoom.mutateAsync({
      roomId: editingRoom.id,
      updates: {
        room_number: editingRoom.room_number,
        room_type_id: editingRoom.room_type_id,
        floor: editingRoom.floor,
        monthly_price: Number(editingRoom.monthly_price),
        status: editingRoom.status,
        notes: editingRoom.notes
      }
    });

    if (ok) {
      setEditingRoom(null);
      refetch();
    }
  };

  const handleDeleteRoom = async (roomId: string, roomNum: string) => {
    if (confirm(`Are you sure you want to delete Room ${roomNum}?`)) {
      const ok = await westernStayService.deleteRoom(roomId);
      if (ok) refetch();
    }
  };

  const renderStatusBadge = (status: RoomStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <Badge variant="success" className="gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            AVAILABLE
          </Badge>
        );
      case 'OCCUPIED':
        return (
          <Badge variant="destructive" className="gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            OCCUPIED
          </Badge>
        );
      case 'RESERVED':
        return (
          <Badge variant="warning" className="gap-1.5">
            <Clock className="w-3 h-3" />
            RESERVED
          </Badge>
        );
      case 'MAINTENANCE':
        return (
          <Badge variant="info" className="gap-1.5">
            <Wrench className="w-3 h-3" />
            MAINTENANCE
          </Badge>
        );
      default:
        return <Badge variant="outline">INACTIVE</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Bed className="w-5 h-5 text-[#FFCC00]" />
            Room Inventory
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Manage physical rooms, floors, tariffs, and real-time availability. Changes reflect immediately across CRM and bookings.
          </p>
        </div>

        <Button
          onClick={() => {
            if (roomTypes && roomTypes.length > 0) {
              setNewRoomTypeId(roomTypes[0].id);
              setNewPrice(roomTypes[0].monthly_price);
            }
            setIsAddModalOpen(true);
          }}
          className="font-bold text-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Room
        </Button>
      </div>

      {/* Filters Bar */}
      <Card className="bg-neutral-900/60 border-neutral-800">
        <CardContent className="p-3 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <Input
              placeholder="Search by room #, type or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Floor filter */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <Layers className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-[11px] font-medium">Floor:</span>
              <div className="w-[135px]">
                <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                  <SelectTrigger className="h-9 bg-neutral-900 border-neutral-700/80">
                    <SelectValue placeholder="Floor" />
                  </SelectTrigger>
                  <SelectContent>
                    {floors.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <Filter className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-[11px] font-medium">Status:</span>
              <div className="w-[145px]">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="h-9 bg-neutral-900 border-neutral-700/80">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Table */}
      {isLoading ? (
        <div className="py-16 text-center text-neutral-400 text-xs animate-pulse">
          Loading room inventory...
        </div>
      ) : filteredRooms?.length === 0 ? (
        <Card className="text-center p-12 bg-neutral-900/40 border-dashed border-neutral-800">
          <CardContent className="space-y-3 p-0">
            <Bed className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No rooms found matching criteria</h3>
            <p className="text-xs text-neutral-400">Try adjusting your filters or click Add Room to register a unit.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden border-neutral-800 bg-neutral-900/60">
          <Table>
            <TableHeader className="bg-neutral-950/70 border-b border-neutral-800">
              <TableRow className="border-neutral-800 hover:bg-transparent">
                <TableHead className="text-neutral-400 font-semibold text-xs">Room #</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Accommodation Type</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Floor</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Monthly Tariff</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Availability Status</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Notes</TableHead>
                <TableHead className="text-right text-neutral-400 font-semibold text-xs pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-neutral-800/60">
              {paginatedRooms.map((room) => (
                <TableRow key={room.id} className="hover:bg-neutral-800/30 transition-colors border-neutral-800/60">
                  <TableCell className="font-mono font-bold text-white text-xs">
                    {room.room_number}
                  </TableCell>
                  <TableCell className="font-medium text-neutral-200 text-xs">
                    {room.room_type_name}
                  </TableCell>
                  <TableCell className="text-neutral-400 text-xs">{room.floor}</TableCell>
                  <TableCell className="font-semibold text-white text-xs">
                    ₹{room.monthly_price.toLocaleString('en-IN')}<span className="text-[10px] text-neutral-500 font-normal">/mo</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {renderStatusBadge(room.status)}
                      <select
                        value={room.status}
                        onChange={(e) =>
                          updateStatus.mutate({
                            roomId: room.id,
                            status: e.target.value as RoomStatus
                          })
                        }
                        className="bg-neutral-900 border border-neutral-700/80 rounded px-1.5 py-0.5 text-[11px] text-neutral-300 focus:outline-none focus:border-[#FFCC00] cursor-pointer"
                        title="Quick status change"
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="OCCUPIED">Occupied</option>
                        <option value="RESERVED">Reserved</option>
                        <option value="MAINTENANCE">Maintenance</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                  </TableCell>
                  <TableCell className="text-neutral-400 text-xs max-w-xs truncate">
                    {room.notes || '—'}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => setEditingRoom(room)}
                        className="h-8 w-8"
                        title="Edit Room"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDeleteRoom(room.id, room.room_number)}
                        className="h-8 w-8 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                        title="Delete Room"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalRooms}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[10, 25, 50, 100]}
          />
        </Card>
      )}

      {/* Add Room Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md bg-neutral-900 border-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Plus className="w-5 h-5 text-[#FFCC00]" />
              Add New Room
            </DialogTitle>
            <DialogDescription className="text-neutral-400 text-xs">
              Configure room details, floor location, and pricing tariff.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateRoom} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Room Number / ID *</label>
              <Input
                required
                placeholder="e.g. 105 or 301"
                value={newRoomNumber}
                onChange={(e) => setNewRoomNumber(e.target.value)}
                className="h-9"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Room Type *</label>
              <select
                value={newRoomTypeId}
                onChange={(e) => {
                  setNewRoomTypeId(e.target.value);
                  const selected = roomTypes?.find((rt) => rt.id === e.target.value);
                  if (selected) setNewPrice(selected.monthly_price);
                }}
                className="w-full h-9 bg-neutral-950/70 border border-neutral-700/80 rounded-md px-3 text-xs text-white focus:outline-none focus:border-[#FFCC00]"
              >
                {roomTypes?.map((rt) => (
                  <option key={rt.id} value={rt.id}>
                    {rt.name} ({rt.price_display}/mo)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Floor</label>
                <select
                  value={newFloor}
                  onChange={(e) => setNewFloor(e.target.value)}
                  className="w-full h-9 bg-neutral-950/70 border border-neutral-700/80 rounded-md px-3 text-xs text-white focus:outline-none focus:border-[#FFCC00]"
                >
                  <option value="Ground Floor">Ground Floor</option>
                  <option value="1st Floor">1st Floor</option>
                  <option value="2nd Floor">2nd Floor</option>
                  <option value="3rd Floor">3rd Floor</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Monthly Price (₹)</label>
                <Input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="h-9"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Initial Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as RoomStatus)}
                className="w-full h-9 bg-neutral-950/70 border border-neutral-700/80 rounded-md px-3 text-xs text-white focus:outline-none focus:border-[#FFCC00]"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="OCCUPIED">OCCUPIED</option>
                <option value="RESERVED">RESERVED</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Notes / Features</label>
              <Input
                placeholder="e.g. Garden facing, personal balcony..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="h-9"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="font-bold">
                Create Room
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Room Modal */}
      <Dialog open={!!editingRoom} onOpenChange={(open) => !open && setEditingRoom(null)}>
        {editingRoom && (
          <DialogContent className="max-w-md bg-neutral-900 border-neutral-800 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <Edit2 className="w-5 h-5 text-[#FFCC00]" />
                Edit Room {editingRoom.room_number}
              </DialogTitle>
              <DialogDescription className="text-neutral-400 text-xs">
                Update room type, floor assignment, and current status.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Room Number</label>
                <Input
                  required
                  value={editingRoom.room_number}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, room_number: e.target.value })
                  }
                  className="h-9"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Room Type</label>
                <select
                  value={editingRoom.room_type_id}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, room_type_id: e.target.value })
                  }
                  className="w-full h-9 bg-neutral-950/70 border border-neutral-700/80 rounded-md px-3 text-xs text-white focus:outline-none focus:border-[#FFCC00]"
                >
                  {roomTypes?.map((rt) => (
                    <option key={rt.id} value={rt.id}>
                      {rt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Floor</label>
                  <select
                    value={editingRoom.floor}
                    onChange={(e) =>
                      setEditingRoom({ ...editingRoom, floor: e.target.value })
                    }
                    className="w-full h-9 bg-neutral-950/70 border border-neutral-700/80 rounded-md px-3 text-xs text-white focus:outline-none focus:border-[#FFCC00]"
                  >
                    <option value="Ground Floor">Ground Floor</option>
                    <option value="1st Floor">1st Floor</option>
                    <option value="2nd Floor">2nd Floor</option>
                    <option value="3rd Floor">3rd Floor</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Monthly Price (₹)</label>
                  <Input
                    type="number"
                    required
                    value={editingRoom.monthly_price}
                    onChange={(e) =>
                      setEditingRoom({ ...editingRoom, monthly_price: Number(e.target.value) })
                    }
                    className="h-9"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Availability Status</label>
                <select
                  value={editingRoom.status}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, status: e.target.value as RoomStatus })
                  }
                  className="w-full h-9 bg-neutral-950/70 border border-neutral-700/80 rounded-md px-3 text-xs text-white focus:outline-none focus:border-[#FFCC00]"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="OCCUPIED">OCCUPIED</option>
                  <option value="RESERVED">RESERVED</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Notes</label>
                <Input
                  value={editingRoom.notes || ''}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, notes: e.target.value })
                  }
                  className="h-9"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setEditingRoom(null)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="font-bold">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
