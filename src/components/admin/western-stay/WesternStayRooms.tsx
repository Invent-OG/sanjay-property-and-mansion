import React, { useState } from 'react';
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
  CheckCircle2,
  Clock,
  Wrench,
  Edit2,
  Trash2,
  DollarSign,
  Layers,
  X,
  Check
} from 'lucide-react';
import type { RoomStatus, WesternStayRoomRecord } from '../../../types/database';

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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Bed className="w-6 h-6 text-[#FFCC00]" />
            Room Inventory
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Manage physical rooms, floors, tariffs, and real-time availability. Changes reflect immediately on the public website.
          </p>
        </div>

        <button
          onClick={() => {
            if (roomTypes && roomTypes.length > 0) {
              setNewRoomTypeId(roomTypes[0].id);
              setNewPrice(roomTypes[0].monthly_price);
            }
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFCC00] hover:bg-[#FFE066] text-black text-xs font-bold transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Room
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-3.5 rounded-xl bg-[#0E1015] border border-neutral-800/80 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by room #, type or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#14161C] border border-neutral-700/70 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFCC00] transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Floor filter */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Layers className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-[11px] font-medium">Floor:</span>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="bg-[#14161C] border border-neutral-700/70 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-[#FFCC00] cursor-pointer"
            >
              {floors.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Filter className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-[11px] font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#14161C] border border-neutral-700/70 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-[#FFCC00] cursor-pointer"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="rounded-xl bg-[#0E1015] border border-neutral-800/80 overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-neutral-400 text-xs animate-pulse">
            Loading room inventory...
          </div>
        ) : filteredRooms?.length === 0 ? (
          <div className="py-16 text-center text-neutral-500 text-xs">
            No rooms found matching the criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#12141A] text-neutral-400 uppercase text-[10px] font-semibold tracking-wider border-b border-neutral-800/70">
                <tr>
                  <th className="py-3 px-4">Room #</th>
                  <th className="py-3 px-4">Accommodation Type</th>
                  <th className="py-3 px-4">Floor</th>
                  <th className="py-3 px-4">Monthly Tariff</th>
                  <th className="py-3 px-4">Availability Status</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50 text-neutral-200">
                {filteredRooms?.map((room) => {
                  const getStatusClass = () => {
                    switch (room.status) {
                      case 'AVAILABLE':
                        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
                      case 'OCCUPIED':
                        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
                      case 'RESERVED':
                        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
                      case 'MAINTENANCE':
                        return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
                      default:
                        return 'text-neutral-400 bg-neutral-800 border-neutral-700';
                    }
                  };

                  return (
                    <tr key={room.id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-white text-xs">
                        {room.room_number}
                      </td>
                      <td className="py-3 px-4 font-medium text-neutral-300">
                        {room.room_type_name}
                      </td>
                      <td className="py-3 px-4 text-neutral-400 text-[11px]">{room.floor}</td>
                      <td className="py-3 px-4 font-semibold text-white">
                        ₹{room.monthly_price.toLocaleString('en-IN')}<span className="text-[10px] text-neutral-500 font-normal">/mo</span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={room.status}
                          onChange={(e) =>
                            updateStatus.mutate({
                              roomId: room.id,
                              status: e.target.value as RoomStatus
                            })
                          }
                          className={`rounded-md px-2.5 py-1 text-[11px] font-medium border focus:outline-none focus:ring-1 focus:ring-[#FFCC00] cursor-pointer ${getStatusClass()}`}
                        >
                          <option value="AVAILABLE" className="bg-[#14161C] text-emerald-400">Available</option>
                          <option value="OCCUPIED" className="bg-[#14161C] text-rose-400">Occupied</option>
                          <option value="RESERVED" className="bg-[#14161C] text-amber-400">Reserved</option>
                          <option value="MAINTENANCE" className="bg-[#14161C] text-sky-400">Maintenance</option>
                          <option value="INACTIVE" className="bg-[#14161C] text-neutral-400">Inactive</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-neutral-400 text-[11px] max-w-xs truncate">
                        {room.notes || '—'}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => setEditingRoom(room)}
                          className="p-1.5 rounded-md bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors border border-neutral-700/60"
                          title="Edit Room"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room.id, room.room_number)}
                          className="p-1.5 rounded-md bg-neutral-800/80 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors border border-neutral-700/60 hover:border-rose-500/30"
                          title="Delete Room"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Room Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#FFCC00]" />
                Add New Room
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Room Number / ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 105 or 301"
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Room Type *</label>
                <select
                  value={newRoomTypeId}
                  onChange={(e) => {
                    setNewRoomTypeId(e.target.value);
                    const selected = roomTypes?.find((rt) => rt.id === e.target.value);
                    if (selected) setNewPrice(selected.monthly_price);
                  }}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                >
                  {roomTypes?.map((rt) => (
                    <option key={rt.id} value={rt.id}>
                      {rt.name} ({rt.price_display}/mo)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Floor</label>
                  <select
                    value={newFloor}
                    onChange={(e) => setNewFloor(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  >
                    <option value="Ground Floor">Ground Floor</option>
                    <option value="1st Floor">1st Floor</option>
                    <option value="2nd Floor">2nd Floor</option>
                    <option value="3rd Floor">3rd Floor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Monthly Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Initial Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as RoomStatus)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="OCCUPIED">OCCUPIED</option>
                  <option value="RESERVED">RESERVED</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Notes / Features</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Garden facing, personal balcony..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FFCC00] hover:bg-[#FFE066] text-black text-xs font-bold"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#FFCC00]" />
                Edit Room {editingRoom.room_number}
              </h3>
              <button
                onClick={() => setEditingRoom(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Room Number</label>
                <input
                  type="text"
                  required
                  value={editingRoom.room_number}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, room_number: e.target.value })
                  }
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Room Type</label>
                <select
                  value={editingRoom.room_type_id}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, room_type_id: e.target.value })
                  }
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                >
                  {roomTypes?.map((rt) => (
                    <option key={rt.id} value={rt.id}>
                      {rt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Floor</label>
                  <select
                    value={editingRoom.floor}
                    onChange={(e) =>
                      setEditingRoom({ ...editingRoom, floor: e.target.value })
                    }
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  >
                    <option value="Ground Floor">Ground Floor</option>
                    <option value="1st Floor">1st Floor</option>
                    <option value="2nd Floor">2nd Floor</option>
                    <option value="3rd Floor">3rd Floor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Monthly Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingRoom.monthly_price}
                    onChange={(e) =>
                      setEditingRoom({ ...editingRoom, monthly_price: Number(e.target.value) })
                    }
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Availability Status</label>
                <select
                  value={editingRoom.status}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, status: e.target.value as RoomStatus })
                  }
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="OCCUPIED">OCCUPIED</option>
                  <option value="RESERVED">RESERVED</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Notes</label>
                <textarea
                  rows={2}
                  value={editingRoom.notes || ''}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, notes: e.target.value })
                  }
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FFCC00] hover:bg-[#FFE066] text-black text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
