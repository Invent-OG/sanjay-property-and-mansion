import React, { useState } from 'react';
import {
  useWesternStayOccupantsQuery,
  useWesternStayRoomsQuery,
  useCreateOccupant
} from '../../../hooks/useWesternStayQuery';
import { westernStayService } from '../../../services/westernStayService';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Shield,
  FileText,
  UserCheck,
  UserX,
  X,
  Bed,
  Check
} from 'lucide-react';
import type { WesternStayOccupantRecord } from '../../../types/database';

export function WesternStayOccupants() {
  const { data: occupants, isLoading, refetch } = useWesternStayOccupantsQuery();
  const { data: rooms } = useWesternStayRoomsQuery();
  const createOccupant = useCreateOccupant();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<string>('active');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOccupant, setEditingOccupant] = useState<WesternStayOccupantRecord | null>(null);

  // New occupant form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [roomId, setRoomId] = useState('');
  const [occupancyType, setOccupancyType] = useState('2 Sharing');
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedCheckOutDate, setExpectedCheckOutDate] = useState('');
  const [monthlyRent, setMonthlyRent] = useState<number>(5900);
  const [securityDeposit, setSecurityDeposit] = useState<number>(5000);
  const [idProofType, setIdProofType] = useState('Aadhaar');
  const [idProofNumber, setIdProofNumber] = useState('');
  const [notes, setNotes] = useState('');

  const availableRooms = rooms?.filter((r) => r.status === 'AVAILABLE') || [];

  const filteredOccupants = occupants?.filter((occ) => {
    const matchesSearch =
      occ.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      occ.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (occ.room_number && occ.room_number.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesActive =
      filterActive === 'all' || (filterActive === 'active' ? occ.is_active : !occ.is_active);

    return matchesSearch && matchesActive;
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Please fill in resident name and phone');
      return;
    }

    const ok = await createOccupant.mutateAsync({
      name,
      phone,
      email: email || undefined,
      room_id: roomId || undefined,
      occupancy_type: occupancyType,
      check_in_date: checkInDate,
      expected_check_out_date: expectedCheckOutDate || undefined,
      monthly_rent: Number(monthlyRent),
      security_deposit: Number(securityDeposit),
      notes: notes || undefined
    });

    if (ok) {
      setIsAddModalOpen(false);
      setName('');
      setPhone('');
      setEmail('');
      setNotes('');
      refetch();
    }
  };

  const handleCheckout = async (occ: WesternStayOccupantRecord) => {
    if (confirm(`Check out resident ${occ.name}? This will mark their status inactive.`)) {
      await westernStayService.updateOccupant(occ.id, {
        is_active: false,
        expected_check_out_date: new Date().toISOString().split('T')[0]
      });
      if (occ.room_id) {
        await westernStayService.updateRoomStatus(occ.room_id, 'AVAILABLE');
      }
      refetch();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#FFCC00]" />
            Occupants & Resident Directory
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Private management of active PG residents, room assignments, monthly rent dues, and check-in/out records.
          </p>
        </div>

        <button
          onClick={() => {
            if (availableRooms.length > 0) {
              setRoomId(availableRooms[0].id);
              setMonthlyRent(availableRooms[0].monthly_price);
            }
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFCC00] hover:bg-[#FFE066] text-black text-xs font-bold transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Check In Resident
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search residents by name, phone, or room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFCC00]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setFilterActive('active')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterActive === 'active'
                ? 'bg-[#FFCC00] text-black font-bold'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            Active Residents
          </button>
          <button
            onClick={() => setFilterActive('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterActive === 'all'
                ? 'bg-[#FFCC00] text-black font-bold'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            All Records
          </button>
        </div>
      </div>

      {/* Residents Table */}
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-neutral-500 text-sm">
            Loading resident records...
          </div>
        ) : filteredOccupants?.length === 0 ? (
          <div className="py-16 text-center text-neutral-500 text-sm">
            No resident records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-800/60 text-neutral-400 uppercase tracking-wider text-[11px] font-semibold border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Resident</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Assigned Room</th>
                  <th className="py-3 px-4">Check-In Date</th>
                  <th className="py-3 px-4">Monthly Rent</th>
                  <th className="py-3 px-4">Deposit</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-neutral-200">
                {filteredOccupants?.map((occ) => (
                  <tr key={occ.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#FFCC00]/10 border border-[#FFCC00]/30 flex items-center justify-center text-[#FFCC00] font-bold text-xs">
                          {occ.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold">{occ.name}</div>
                          <div className="text-[11px] text-neutral-400">{occ.occupancy_type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-neutral-300 font-mono">
                        <Phone className="w-3 h-3 text-[#FFCC00]" />
                        <a href={`tel:${occ.phone}`} className="hover:underline">
                          {occ.phone}
                        </a>
                      </div>
                      {occ.email && (
                        <div className="flex items-center gap-1.5 text-neutral-500 text-[11px] mt-0.5">
                          <Mail className="w-3 h-3" />
                          <span>{occ.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-mono font-bold text-white px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700">
                        <Bed className="w-3 h-3 text-[#FFCC00]" />
                        Room {occ.room_number}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300 font-mono">
                      {occ.check_in_date}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      ₹{occ.monthly_rent.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400">
                      ₹{occ.security_deposit.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      {occ.is_active ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
                          Active Resident
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 text-[11px] font-semibold">
                          Checked Out
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {occ.is_active && (
                        <button
                          onClick={() => handleCheckout(occ)}
                          className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-rose-500/20 text-neutral-300 hover:text-rose-400 font-medium transition-colors"
                        >
                          Check Out
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Check In Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#FFCC00]" />
                Check In Resident
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Resident Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    placeholder="rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Assign Room *</label>
                  <select
                    value={roomId}
                    onChange={(e) => {
                      setRoomId(e.target.value);
                      const sel = rooms?.find((r) => r.id === e.target.value);
                      if (sel) setMonthlyRent(sel.monthly_price);
                    }}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  >
                    {availableRooms.length === 0 ? (
                      <option value="">No available rooms</option>
                    ) : (
                      availableRooms.map((r) => (
                        <option key={r.id} value={r.id}>
                          Room {r.room_number} ({r.room_type_name} • ₹{r.monthly_price}/mo)
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Check-In Date *</label>
                  <input
                    type="date"
                    required
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Expected Check-Out Date</label>
                  <input
                    type="date"
                    value={expectedCheckOutDate}
                    onChange={(e) => setExpectedCheckOutDate(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Monthly Rent (₹) *</label>
                  <input
                    type="number"
                    required
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Notes / Occupation</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Software engineer at KCT Tech Park, college student..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                  Confirm Check-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
