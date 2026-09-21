import React, { useState } from 'react';
import {
  Building2,
  Users,
  Bed,
  Sparkles,
  Plus,
  ArrowUpRight,
  ExternalLink,
  Phone,
  MessageSquare,
  Eye,
  Edit3,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Clock,
  DollarSign,
  TrendingUp,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { useProperties } from '../../hooks/usePropertiesQuery';
import { useLeads, useLeadStats, useUpdateLeadStatus } from '../../hooks/useLeadsQuery';
import { useWesternStayStatsQuery, useWesternStayRoomsQuery } from '../../hooks/useWesternStayQuery';
import type { Lead, LeadStatus } from '../../types/database';

export const AdminDashboardHome: React.FC = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // TanStack Query Hooks
  const { data: properties = [], isLoading: isLoadingProps } = useProperties();
  const { data: leads = [], isLoading: isLoadingLeads } = useLeads();
  const { data: statsData, isLoading: isLoadingStats } = useLeadStats();
  const { data: westernStayStats } = useWesternStayStatsQuery();
  const { data: westernStayRooms } = useWesternStayRoomsQuery();
  const updateStatusMutation = useUpdateLeadStatus();

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: leadId, status: newStatus });
      showToast(`Lead status updated to ${newStatus}`);
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update lead');
    }
  };

  const recentLeads = leads.slice(0, 6);

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold';
      case 'Contacted':
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/30 font-semibold';
      case 'In Discussion':
        return 'bg-purple-500/15 text-purple-400 border border-purple-500/30 font-semibold';
      case 'Visit Scheduled':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold';
      case 'Converted':
        return 'bg-[#FFCC00]/20 text-[#FFCC00] border border-[#FFCC00]/40 font-bold';
      case 'Closed':
      case 'Lost':
        return 'bg-neutral-800 text-neutral-400 border border-neutral-700';
      default:
        return 'bg-neutral-800 text-neutral-300';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e222b] text-white px-5 py-3 rounded-2xl shadow-2xl border border-neutral-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#FFCC00]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-[#161922] to-neutral-900 border border-neutral-800 p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFCC00]/10 border border-[#FFCC00]/30 text-[#FFCC00] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dual Enterprise Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Sanjay Properties & Western Stay Admin
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            Seamlessly control real estate property developments and Western Stay PG hostel operations from a unified portal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/admin/western-stay"
            className="px-4 py-2.5 rounded-xl bg-[#FFCC00] hover:bg-[#ffe066] text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <Bed className="w-4 h-4" />
            <span>Western Stay Hostel</span>
          </a>
          <a
            href="/admin/properties"
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors border border-neutral-700"
          >
            <Building2 className="w-4 h-4 text-[#FFCC00]" />
            <span>Real Estate Listings</span>
          </a>
        </div>
      </div>

      {/* Operational Highlights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Western Stay Hostel Box */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-[#FFCC00]/40 transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFCC00]/10 text-[#FFCC00] text-xs font-bold border border-[#FFCC00]/30 uppercase tracking-wider">
                PG / Hostel Operation
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Live Sync
              </span>
            </div>

            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Bed className="w-5 h-5 text-[#FFCC00]" />
              Western Stay – Sanjay Mansion
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Saravanampatti, Coimbatore • PG for working professionals & students
            </p>

            <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-neutral-800 text-center">
              <div className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-800">
                <div className="text-xs text-neutral-400">Total Rooms</div>
                <div className="text-xl font-bold text-white mt-1">
                  {westernStayStats?.totalRooms ?? 8}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-xs text-emerald-400">Available</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">
                  {westernStayStats?.availableRooms ?? 2}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-800">
                <div className="text-xs text-neutral-400">Occupancy</div>
                <div className="text-xl font-bold text-[#FFCC00] mt-1">
                  {westernStayStats?.occupancyRate ?? 75}%
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
            <span className="text-xs text-neutral-400">
              Monthly Rent Revenue: <strong className="text-white">₹{(westernStayStats?.currentMonthlyRevenue ?? 42300).toLocaleString('en-IN')}</strong>
            </span>
            <a
              href="/admin/western-stay"
              className="text-xs font-bold text-[#FFCC00] hover:underline flex items-center gap-1"
            >
              Manage Western Stay <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Sanjay Properties Real Estate Box */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-[#FFCC00]/40 transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/30 uppercase tracking-wider">
                Real Estate Development
              </span>
              <span className="text-xs text-neutral-400">Layouts & Plots</span>
            </div>

            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              Sanjay Properties
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Saravanampatti, Coimbatore • DTCP Approved Villa Plots & Real Estate
            </p>

            <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-neutral-800 text-center">
              <div className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-800">
                <div className="text-xs text-neutral-400">Listed Projects</div>
                <div className="text-xl font-bold text-white mt-1">
                  {properties.length || 1}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="text-xs text-blue-400">Active Layouts</div>
                <div className="text-xl font-bold text-blue-400 mt-1">
                  1 (Sanjay Gardens)
                </div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-800">
                <div className="text-xs text-neutral-400">Total Leads</div>
                <div className="text-xl font-bold text-[#FFCC00] mt-1">
                  {statsData?.total ?? leads.length}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
            <span className="text-xs text-neutral-400">
              Flagship Project: <strong className="text-white">Sanjay Gardens</strong>
            </span>
            <a
              href="/admin/properties"
              className="text-xs font-bold text-[#FFCC00] hover:underline flex items-center gap-1"
            >
              Manage Property Listings <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Recent Enquiries & Leads */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-white">Recent Customer Enquiries</h3>
            <p className="text-xs text-neutral-400">Across Sanjay Properties and Western Stay</p>
          </div>
          <a
            href="/admin/leads"
            className="text-xs font-bold text-[#FFCC00] hover:underline flex items-center gap-1"
          >
            <span>View All Enquiries</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {isLoadingLeads ? (
          <div className="py-12 text-center text-xs text-neutral-500 animate-pulse">
            Loading recent enquiries...
          </div>
        ) : recentLeads.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500">
            No customer enquiries recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-neutral-500 border-b border-neutral-800 pb-2 uppercase tracking-wider font-bold">
                  <th className="pb-3 pl-2">Prospect</th>
                  <th className="pb-3">Source / Property</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {recentLeads.map((lead) => {
                  const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
                  const waNumber = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

                  return (
                    <tr key={lead.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3.5 pl-2 font-semibold text-white">
                        <div>{lead.name}</div>
                        <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                          {lead.phone}
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          lead.source.includes('Mansion') || lead.source.includes('Western')
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                        }`}>
                          {lead.source}
                        </span>
                      </td>
                      <td className="py-3.5 text-neutral-400 font-mono">
                        {new Date(lead.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </td>
                      <td className="py-3.5">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                          className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-neutral-200 focus:outline-none focus:border-[#FFCC00]"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Discussion">In Discussion</option>
                          <option value="Visit Scheduled">Visit Scheduled</option>
                          <option value="Converted">Converted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td className="py-3.5 text-right pr-2 space-x-2">
                        <a
                          href={`https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(
                            lead.name
                          )},%20thank%20you%20for%20contacting%20us%20regarding%20${encodeURIComponent(
                            lead.source
                          )}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-colors"
                        >
                          WhatsApp
                        </a>
                        <a
                          href={`tel:${lead.phone}`}
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
};
