import React, { useState } from 'react';
import {
  Building2,
  Users,
  Bed,
  Sparkles,
  ArrowUpRight,
  Phone,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useProperties } from '../../hooks/usePropertiesQuery';
import { useLeads, useLeadStats, useUpdateLeadStatus } from '../../hooks/useLeadsQuery';
import { useWesternStayStatsQuery, useWesternStayRoomsQuery } from '../../hooks/useWesternStayQuery';
import type { Lead, LeadStatus } from '../../types/database';

export const AdminDashboardHome: React.FC = () => {
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
    } catch (err: any) {
      showToast(err.message || 'Failed to update lead');
    }
  };

  const recentLeads = leads.slice(0, 6);

  const getStatusBadgeStyle = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Contacted':
        return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
      case 'In Discussion':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'Visit Scheduled':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Converted':
        return 'bg-[#FFCC00]/15 text-[#FFCC00] border border-[#FFCC00]/30 font-semibold';
      case 'Closed':
      case 'Lost':
        return 'bg-neutral-800 text-neutral-400 border border-neutral-700/60';
      default:
        return 'bg-neutral-800 text-neutral-300';
    }
  };

  const occupancyRate = westernStayStats?.occupancyRate ?? 75;
  const monthlyRevenue = westernStayStats?.currentMonthlyRevenue ?? 42300;
  const availableRoomsCount = westernStayStats?.availableRooms ?? 2;
  const totalRoomsCount = westernStayStats?.totalRooms ?? 8;

  return (
    <div className="space-y-7 animate-fade-in pb-12">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161922] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-neutral-700/80 text-xs font-medium flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#FFCC00]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Executive Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0E1015] border border-neutral-800/80 p-6 sm:p-7 shadow-sm">
        {/* Subtle accent glow in background */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#FFCC00]/5 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#FFCC00]/10 border border-[#FFCC00]/20 text-[#FFCC00] text-[11px] font-semibold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Unified Operations Console</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Enterprise Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl font-normal leading-relaxed">
              Monitoring real-time performance across Western Stay PG Hostel and Sanjay Properties real estate developments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="/admin/western-stay"
              className="px-3.5 py-2 rounded-lg bg-[#FFCC00] hover:bg-[#ffe066] text-black font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Bed className="w-3.5 h-3.5" />
              <span>Hostel Rooms</span>
            </a>
            <a
              href="/admin/properties"
              className="px-3.5 py-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 font-medium text-xs flex items-center gap-1.5 transition-colors border border-neutral-700/60"
            >
              <Building2 className="w-3.5 h-3.5 text-[#FFCC00]" />
              <span>Real Estate</span>
            </a>
            <a
              href="/admin/leads"
              className="px-3.5 py-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 font-medium text-xs flex items-center gap-1.5 transition-colors border border-neutral-700/60"
            >
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span>CRM Enquiries</span>
            </a>
          </div>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Occupancy */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#0E1015] border border-neutral-800/70 hover:border-neutral-700/80 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 mb-2.5">
            <span className="text-xs font-medium">Hostel Occupancy</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-[#FFCC00]">
              <Bed className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {occupancyRate}%
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-400">
            <span>{availableRoomsCount} rooms available</span>
            <span className="font-mono text-neutral-500">{totalRoomsCount} Total</span>
          </div>
          {/* Progress bar */}
          <div className="mt-2 w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FFCC00] rounded-full transition-all duration-500"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Monthly Rent Run-Rate */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#0E1015] border border-neutral-800/70 hover:border-neutral-700/80 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 mb-2.5">
            <span className="text-xs font-medium">Monthly Rental Rate</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            ₹{monthlyRevenue.toLocaleString('en-IN')}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-400">
            <span className="text-emerald-400 font-medium">Western Stay PG</span>
            <span className="text-neutral-500 font-mono">Monthly</span>
          </div>
          <div className="mt-2 w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full w-4/5" />
          </div>
        </div>

        {/* KPI 3: Real Estate Portfolio */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#0E1015] border border-neutral-800/70 hover:border-neutral-700/80 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 mb-2.5">
            <span className="text-xs font-medium">Real Estate Projects</span>
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {properties.length || 1}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-400">
            <span>Sanjay Gardens</span>
            <span className="text-sky-400 font-medium">DTCP Approved</span>
          </div>
          <div className="mt-2 w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-sky-400 rounded-full w-3/4" />
          </div>
        </div>

        {/* KPI 4: Inquiries CRM */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#0E1015] border border-neutral-800/70 hover:border-neutral-700/80 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 mb-2.5">
            <span className="text-xs font-medium">Total Inquiries</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {statsData?.total ?? leads.length}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-400">
            <span className="text-amber-400 font-medium">{statsData?.new ?? 1} New</span>
            <span className="text-neutral-500 font-mono">Real-time</span>
          </div>
          <div className="mt-2 w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-400 rounded-full w-2/3" />
          </div>
        </div>
      </div>

      {/* Operational Divisions: Western Stay & Sanjay Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Western Stay Hostel Box */}
        <div className="p-5 sm:p-6 rounded-xl bg-[#0E1015] border border-neutral-800/70 hover:border-neutral-700/80 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-[#FFCC00] border border-amber-500/20">
                Hospitality & PG
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </div>
            </div>

            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Bed className="w-4 h-4 text-[#FFCC00]" />
              Western Stay – Sanjay Mansion
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Saravanampatti, Coimbatore • Premium PG for professionals and students
            </p>

            <div className="grid grid-cols-3 gap-2.5 mt-5">
              <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800/80">
                <div className="text-[11px] text-neutral-400">Total Rooms</div>
                <div className="text-lg font-bold text-white mt-0.5">
                  {totalRoomsCount}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                <div className="text-[11px] text-emerald-400">Available</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">
                  {availableRoomsCount}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800/80">
                <div className="text-[11px] text-neutral-400">Occupancy</div>
                <div className="text-lg font-bold text-[#FFCC00] mt-0.5">
                  {occupancyRate}%
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-neutral-800/70 flex items-center justify-between">
            <span className="text-xs text-neutral-400">
              Run-Rate: <strong className="text-white font-medium">₹{monthlyRevenue.toLocaleString('en-IN')}/mo</strong>
            </span>
            <a
              href="/admin/western-stay"
              className="text-xs font-semibold text-[#FFCC00] hover:text-[#ffe066] inline-flex items-center gap-1 transition-colors"
            >
              <span>Manage Rooms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Sanjay Properties Box */}
        <div className="p-5 sm:p-6 rounded-xl bg-[#0E1015] border border-neutral-800/70 hover:border-neutral-700/80 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Real Estate Division
              </span>
              <span className="text-[11px] text-neutral-400 font-mono">Villa Plots & Layouts</span>
            </div>

            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-400" />
              Sanjay Properties
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Saravanampatti, Coimbatore • DTCP Approved gated villa plots & commercial lands
            </p>

            <div className="grid grid-cols-3 gap-2.5 mt-5">
              <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800/80">
                <div className="text-[11px] text-neutral-400">Listed Projects</div>
                <div className="text-lg font-bold text-white mt-0.5">
                  {properties.length || 1}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-sky-500/5 border border-sky-500/15">
                <div className="text-[11px] text-sky-400">Active Layouts</div>
                <div className="text-lg font-bold text-sky-400 mt-0.5 truncate">
                  Sanjay Gardens
                </div>
              </div>
              <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800/80">
                <div className="text-[11px] text-neutral-400">Buyer Leads</div>
                <div className="text-lg font-bold text-[#FFCC00] mt-0.5">
                  {statsData?.total ?? leads.length}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-neutral-800/70 flex items-center justify-between">
            <span className="text-xs text-neutral-400">
              Flagship: <strong className="text-white font-medium">Sanjay Gardens (DTCP)</strong>
            </span>
            <a
              href="/admin/properties"
              className="text-xs font-semibold text-[#FFCC00] hover:text-[#ffe066] inline-flex items-center gap-1 transition-colors"
            >
              <span>Manage Properties</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Recent Inquiries Table */}
      <div className="rounded-xl bg-[#0E1015] border border-neutral-800/70 overflow-hidden">
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-neutral-800/70">
          <div>
            <h2 className="text-sm font-bold text-white">Recent Customer Inquiries</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Prospects inquiring for hostel accommodation and property sales</p>
          </div>
          <a
            href="/admin/leads"
            className="text-xs font-semibold text-[#FFCC00] hover:text-[#ffe066] inline-flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {isLoadingLeads ? (
          <div className="py-12 text-center text-xs text-neutral-400 animate-pulse">
            Loading recent enquiries...
          </div>
        ) : recentLeads.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500">
            No customer inquiries found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#12141A] text-neutral-400 uppercase text-[10px] font-semibold tracking-wider border-b border-neutral-800/70">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Inquiry Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">CRM Status</th>
                  <th className="py-3 px-4 text-right">Quick Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {recentLeads.map((lead) => {
                  const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
                  const waNumber = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

                  return (
                    <tr key={lead.id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{lead.name}</div>
                        <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                          {lead.phone}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          lead.source.includes('Mansion') || lead.source.includes('Western')
                            ? 'bg-amber-500/10 text-[#FFCC00] border border-amber-500/20'
                            : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                        }`}>
                          {lead.source}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-400 font-mono text-[11px]">
                        {new Date(lead.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                          className="bg-[#14161C] border border-neutral-700/70 rounded-md px-2 py-1 text-[11px] text-neutral-200 focus:outline-none focus:border-[#FFCC00] cursor-pointer"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Discussion">In Discussion</option>
                          <option value="Visit Scheduled">Visit Scheduled</option>
                          <option value="Converted">Converted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <a
                          href={`https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(
                            lead.name
                          )},%20thank%20you%20for%20contacting%20us%20regarding%20${encodeURIComponent(
                            lead.source
                          )}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-medium border border-emerald-500/20 transition-colors"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                        <a
                          href={`tel:${lead.phone}`}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 text-[11px] font-medium border border-neutral-700/60 transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
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

