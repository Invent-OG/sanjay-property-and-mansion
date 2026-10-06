import React, { useState, useEffect, useMemo } from 'react';
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
  Bed,
} from 'lucide-react';
import type { WesternStayOccupantRecord } from '../../../types/database';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { DataTablePagination } from '../../ui/pagination';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

export function WesternStayOccupants() {
  const { data: occupants, isLoading, refetch } = useWesternStayOccupantsQuery();
  const { data: rooms } = useWesternStayRoomsQuery();
  const createOccupant = useCreateOccupant();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<string>('active');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterActive]);

  const totalOccupants = filteredOccupants?.length || 0;
  const totalPages = Math.ceil(totalOccupants / pageSize) || 1;
  const paginatedOccupants = useMemo(() => {
    if (!filteredOccupants) return [];
    const start = (currentPage - 1) * pageSize;
    return filteredOccupants.slice(start, start + pageSize);
  }, [filteredOccupants, currentPage, pageSize]);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#FFCC00]" />
            Occupants & Resident Directory
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Private management of active PG residents, room assignments, monthly rent dues, and check-in/out records.
          </p>
        </div>

        <Button
          onClick={() => {
            if (availableRooms.length > 0) {
              setRoomId(availableRooms[0].id);
              setMonthlyRent(availableRooms[0].monthly_price);
            }
            setIsAddModalOpen(true);
          }}
          className="font-bold text-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Check In Resident
        </Button>
      </div>

      {/* Filters Bar */}
      <Card className="bg-neutral-900/60 border-neutral-800">
        <CardContent className="p-3 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <Input
              placeholder="Search residents by name, phone, or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={filterActive === 'active' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setFilterActive('active')}
              className="h-9 text-xs"
            >
              Active Residents
            </Button>
            <Button
              variant={filterActive === 'all' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setFilterActive('all')}
              className="h-9 text-xs"
            >
              All Records
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Residents Table */}
      {isLoading ? (
        <div className="py-16 text-center text-neutral-400 text-xs animate-pulse">
          Loading resident records...
        </div>
      ) : filteredOccupants?.length === 0 ? (
        <Card className="text-center p-12 bg-neutral-900/40 border-dashed border-neutral-800">
          <CardContent className="space-y-3 p-0">
            <Users className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No resident records found</h3>
            <p className="text-xs text-neutral-400">Try adjusting your search criteria or register a new resident.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden border-neutral-800 bg-neutral-900/60">
          <Table>
            <TableHeader className="bg-neutral-950/70 border-b border-neutral-800">
              <TableRow className="border-neutral-800 hover:bg-transparent">
                <TableHead className="text-neutral-400 font-semibold text-xs">Resident</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Contact</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Assigned Room</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Check-In Date</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Monthly Rent</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Deposit</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Status</TableHead>
                <TableHead className="text-right text-neutral-400 font-semibold text-xs pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-neutral-800/60">
              {paginatedOccupants.map((occ) => (
                <TableRow key={occ.id} className="hover:bg-neutral-800/30 transition-colors border-neutral-800/60">
                  <TableCell className="font-semibold text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#FFCC00]/10 border border-[#FFCC00]/30 flex items-center justify-center text-[#FFCC00] font-bold text-xs shrink-0">
                        {occ.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-xs">{occ.name}</div>
                        <div className="text-[11px] text-neutral-400">{occ.occupancy_type}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-neutral-300 font-mono text-xs">
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
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs font-semibold border-neutral-700 bg-neutral-950/60">
                      <Bed className="w-3 h-3 text-[#FFCC00] mr-1.5" />
                      Room {occ.room_number}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-neutral-300 font-mono text-xs">
                    {occ.check_in_date}
                  </TableCell>
                  <TableCell className="font-bold text-emerald-400 text-xs">
                    ₹{occ.monthly_rent.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="text-neutral-400 text-xs">
                    ₹{occ.security_deposit.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell>
                    {occ.is_active ? (
                      <Badge variant="success">Active Resident</Badge>
                    ) : (
                      <Badge variant="outline">Checked Out</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    {occ.is_active && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCheckout(occ)}
                        className="text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs"
                      >
                        Check Out
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalOccupants}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[10, 25, 50, 100]}
          />
        </Card>
      )}

      {/* Check In Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg bg-neutral-900 border-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Plus className="w-5 h-5 text-[#FFCC00]" />
              Check In Resident
            </DialogTitle>
            <DialogDescription className="text-neutral-400 text-xs">
              Assign an available PG room and record resident contact and tenancy details.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Resident Full Name *</label>
                <Input
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Phone Number *</label>
                <Input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Email Address</label>
                <Input
                  type="email"
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Assign Room *</label>
                <Select
                  value={roomId}
                  onValueChange={(val) => {
                    setRoomId(val);
                    const sel = rooms?.find((r) => r.id === val);
                    if (sel) setMonthlyRent(sel.monthly_price);
                  }}
                >
                  <SelectTrigger className="w-full h-9 bg-neutral-950/70 border-neutral-700/80">
                    <SelectValue placeholder={availableRooms.length === 0 ? "No available rooms" : "Select a room"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRooms.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        Room {r.room_number} ({r.room_type_name} • ₹{r.monthly_price}/mo)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Check-In Date *</label>
                <Input
                  type="date"
                  required
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Expected Check-Out Date</label>
                <Input
                  type="date"
                  value={expectedCheckOutDate}
                  onChange={(e) => setExpectedCheckOutDate(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Monthly Rent (₹) *</label>
                <Input
                  type="number"
                  required
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="h-9"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Security Deposit (₹)</label>
                <Input
                  type="number"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                  className="h-9"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Notes / Occupation</label>
              <Input
                placeholder="e.g. Software engineer at KCT Tech Park, college student..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-9"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="font-bold">
                Confirm Check-In
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
