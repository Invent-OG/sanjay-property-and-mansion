import React, { useState, useEffect, useMemo } from 'react';
import {
  useWesternStayEnquiriesQuery,
  useUpdateEnquiryStatus
} from '../../../hooks/useWesternStayQuery';
import {
  MessageSquare,
  Phone,
  Bed,
  Search,
  Filter,
} from 'lucide-react';
import type { WesternStayEnquiryStatus } from '../../../types/database';
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

export function WesternStayEnquiries() {
  const { data: enquiries, isLoading } = useWesternStayEnquiriesQuery();
  const updateStatus = useUpdateEnquiryStatus();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = useMemo(() => {
    return enquiries?.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.room_type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || (item.status || '').toUpperCase() === statusFilter.toUpperCase();
      return matchesSearch && matchesStatus;
    }) || [];
  }, [enquiries, searchQuery, statusFilter]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const totalEnquiries = filtered.length;
  const totalPages = Math.ceil(totalEnquiries / pageSize) || 1;
  const paginatedEnquiries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const renderStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'NEW':
        return <Badge variant="warning">New</Badge>;
      case 'CONTACTED':
        return <Badge variant="info">Contacted</Badge>;
      case 'FOLLOW-UP':
        return <Badge variant="warning" className="bg-amber-500/15 text-amber-400 border border-amber-500/30">Follow-up</Badge>;
      case 'BOOKED':
        return <Badge variant="success" className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Booked</Badge>;
      case 'CONVERTED':
        return <Badge variant="success">Converted</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline">Cancelled</Badge>;
      case 'CLOSED':
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-[#FFCC00]" />
            Western Stay Room Enquiries
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Real-time leads and booking enquiries submitted by visitors for Western Stay hostel accommodations.
          </p>
        </div>

        <Badge variant="outline" className="px-3 py-1.5 text-xs font-semibold self-start sm:self-auto border-neutral-700">
          Total Enquiries: <span className="text-[#FFCC00] font-bold ml-1.5">{totalEnquiries}</span>
        </Badge>
      </div>

      <Card className="bg-neutral-900/60 border-neutral-800">
        <CardContent className="p-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <Input
              placeholder="Search enquiries by guest name, phone, room type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <div className="w-[145px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 bg-neutral-900 border-neutral-700/80">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="CONTACTED">Contacted</SelectItem>
                  <SelectItem value="FOLLOW-UP">Follow-up</SelectItem>
                  <SelectItem value="BOOKED">Booked</SelectItem>
                  <SelectItem value="CONVERTED">Converted</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="py-16 text-center text-neutral-400 text-xs animate-pulse">
          Loading enquiries...
        </div>
      ) : filtered.length === 0 ? (
        <Card className="text-center p-12 bg-neutral-900/40 border-dashed border-neutral-800">
          <CardContent className="space-y-3 p-0">
            <MessageSquare className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No room enquiries found</h3>
            <p className="text-xs text-neutral-400">Try adjusting your search query or filter.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden border-neutral-800 bg-neutral-900/60">
          <Table>
            <TableHeader className="bg-neutral-950/70 border-b border-neutral-800">
              <TableRow className="border-neutral-800 hover:bg-transparent">
                <TableHead className="text-neutral-400 font-semibold text-xs">Guest</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Contact</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Preferred Accommodation</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Preferred Date</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Message / Notes</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Enquiry Status</TableHead>
                <TableHead className="py-3 px-4 text-right text-neutral-400 font-semibold text-xs pr-6">Instant Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-neutral-800/60">
              {paginatedEnquiries.map((enq) => {
                const cleanPhone = enq.phone.replace(/[^0-9]/g, '');
                const waNumber = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

                return (
                  <TableRow key={enq.id} className="hover:bg-neutral-800/30 transition-colors border-neutral-800/60">
                    <TableCell className="font-bold text-white text-xs">
                      {enq.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-mono text-neutral-300 text-xs">
                        <Phone className="w-3 h-3 text-[#FFCC00]" />
                        <a href={`tel:${enq.phone}`} className="hover:underline">
                          {enq.phone}
                        </a>
                      </div>
                      {enq.email && (
                        <div className="text-[11px] text-neutral-500 mt-0.5">{enq.email}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-neutral-700 text-xs">
                        <Bed className="w-3 h-3 mr-1 text-[#FFCC00]" />
                        {enq.room_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-neutral-400 text-xs">
                      {enq.preferred_date || 'Immediate'}
                    </TableCell>
                    <TableCell className="text-neutral-400 text-xs max-w-xs truncate">
                      {enq.message || '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {renderStatusBadge(enq.status)}
                        <Select
                          value={enq.status}
                          onValueChange={(val) =>
                            updateStatus.mutate({
                              id: enq.id,
                              status: val as WesternStayEnquiryStatus
                            })
                          }
                        >
                          <SelectTrigger className="h-7 text-[11px] w-[125px] bg-neutral-900 border-neutral-700/80">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NEW">New</SelectItem>
                            <SelectItem value="CONTACTED">Contacted</SelectItem>
                            <SelectItem value="FOLLOW-UP">Follow-up</SelectItem>
                            <SelectItem value="BOOKED">Booked</SelectItem>
                            <SelectItem value="CONVERTED">Converted</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            <SelectItem value="CLOSED">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="secondary"
                          asChild
                          className="h-7 text-[11px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                        >
                          <a
                            href={`https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(
                              enq.name
                            )},%20thank%20you%20for%20enquiring%20about%20Western%20Stay%20-%20Sanjay%20Mansion!`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            WhatsApp
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          asChild
                          className="h-7 text-[11px]"
                        >
                          <a href={`tel:${enq.phone}`}>
                            Call
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalEnquiries}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[10, 25, 50, 100]}
          />
        </Card>
      )}
    </div>
  );
}
