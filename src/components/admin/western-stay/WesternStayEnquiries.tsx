import React, { useState } from 'react';
import {
  useWesternStayEnquiriesQuery,
  useUpdateEnquiryStatus
} from '../../../hooks/useWesternStayQuery';
import {
  MessageSquare,
  Phone,
  Calendar,
  Bed,
  CheckCircle2,
  Clock,
  UserCheck,
  Search,
  Filter,
  ExternalLink
} from 'lucide-react';
import type { WesternStayEnquiryStatus } from '../../../types/database';

export function WesternStayEnquiries() {
  const { data: enquiries, isLoading, refetch } = useWesternStayEnquiriesQuery();
  const updateStatus = useUpdateEnquiryStatus();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = enquiries?.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.room_type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-[#FFCC00]" />
            Western Stay Room Enquiries
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Real-time leads and booking enquiries submitted by visitors for Western Stay hostel accommodations.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search enquiries by guest name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFCC00]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-neutral-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-[#FFCC00]"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CONVERTED">Converted</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-neutral-500 text-sm">
            Loading enquiries...
          </div>
        ) : filtered?.length === 0 ? (
          <div className="py-16 text-center text-neutral-500 text-sm">
            No room enquiries found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-800/60 text-neutral-400 uppercase tracking-wider text-[11px] font-semibold border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Guest</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Preferred Accommodation</th>
                  <th className="py-3 px-4">Preferred Date</th>
                  <th className="py-3 px-4">Message / Notes</th>
                  <th className="py-3 px-4">Enquiry Status</th>
                  <th className="py-3 px-4 text-right">Instant Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-neutral-200">
                {filtered?.map((enq) => {
                  const cleanPhone = enq.phone.replace(/[^0-9]/g, '');
                  const waNumber = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

                  return (
                    <tr key={enq.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white text-sm">
                        {enq.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-neutral-300">
                          <Phone className="w-3 h-3 text-[#FFCC00]" />
                          <a href={`tel:${enq.phone}`} className="hover:underline">
                            {enq.phone}
                          </a>
                        </div>
                        {enq.email && (
                          <div className="text-[11px] text-neutral-500 mt-0.5">{enq.email}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFCC00]/10 text-[#FFCC00] font-semibold text-xs border border-[#FFCC00]/20">
                          <Bed className="w-3 h-3" />
                          {enq.room_type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-400">
                        {enq.preferred_date || 'Immediate'}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-400 max-w-xs truncate">
                        {enq.message || '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={enq.status}
                          onChange={(e) =>
                            updateStatus.mutate({
                              id: enq.id,
                              status: e.target.value as WesternStayEnquiryStatus
                            })
                          }
                          className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-neutral-200 focus:outline-none focus:border-[#FFCC00]"
                        >
                          <option value="NEW">🟡 New</option>
                          <option value="CONTACTED">🔵 Contacted</option>
                          <option value="CONVERTED">🟢 Converted</option>
                          <option value="CANCELLED">⚪ Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <a
                          href={`https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(
                            enq.name
                          )},%20thank%20you%20for%20enquiring%20about%20Western%20Stay%20-%20Sanjay%20Mansion!`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-colors"
                        >
                          WhatsApp
                        </a>
                        <a
                          href={`tel:${enq.phone}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors"
                        >
                          Call
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
