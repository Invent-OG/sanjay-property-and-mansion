import React, { useState } from 'react';
import {
  Building2,
  Users,
  UserCheck,
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
  X
} from 'lucide-react';
import { useProperties } from '../../hooks/usePropertiesQuery';
import { useLeads, useLeadStats, useUpdateLeadStatus } from '../../hooks/useLeadsQuery';
import type { Lead, LeadStatus } from '../../types/database';

export const AdminDashboardHome: React.FC = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // TanStack Query Hooks
  const { data: properties = [], isLoading: isLoadingProps } = useProperties();
  const { data: leads = [], isLoading: isLoadingLeads } = useLeads();
  const { data: statsData, isLoading: isLoadingStats } = useLeadStats();
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

  const activePropertiesCount = properties.filter((p) => p.status === 'active').length;
  const recentLeads = leads.slice(0, 8);

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

  const generateWhatsAppUrl = (phone: string, leadName: string, source: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const text = encodeURIComponent(
      `Hello ${leadName}, thank you for contacting ${source} regarding your enquiry. How can we assist you today?`
    );
    return `https://wa.me/${formattedPhone}?text=${text}`;
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e222b] text-white px-5 py-3 rounded-2xl shadow-2xl border border-neutral-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#FFCC00]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-[#171a22] to-[#121419] border border-neutral-800 p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFCC00]/10 border border-[#FFCC00]/30 text-[#FFCC00] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TanStack Query & Drizzle ORM Active</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Central Management Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
            Manage properties, accommodation tariffs, facilities, meal menus, enquiry leads, and site SEO in real-time.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/admin/properties/new"
            className="px-4 py-2.5 rounded-xl bg-[#FFCC00] hover:bg-[#e6b800] text-black font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md shadow-[#FFCC00]/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </a>
          <a
            href="/admin/properties"
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors border border-neutral-700 cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-amber-400" />
            <span>Edit Properties</span>
          </a>
          <a
            href="/admin/media"
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors border border-neutral-700 cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-blue-400" />
            <span>Upload Media</span>
          </a>
        </div>
      </div>

      {/* KPI Stats Cards (Live TanStack Query) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Properties */}
        <div className="bg-[#14161c] border border-neutral-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">TOTAL PROPERTIES</span>
            <Building2 className="w-4 h-4 text-[#FFCC00]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {isLoadingProps ? <span className="animate-pulse">--</span> : properties.length}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1.5">
            <span className="text-emerald-400 font-semibold">{activePropertiesCount} Active</span> on website
          </div>
        </div>

        {/* Active Properties */}
        <div className="bg-[#14161c] border border-neutral-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">ACTIVE PROPERTIES</span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {isLoadingProps ? <span className="animate-pulse">--</span> : activePropertiesCount}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Western Stay – Sanjay Mansion
          </div>
        </div>

        {/* Total Leads */}
        <div className="bg-[#14161c] border border-neutral-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">TOTAL LEADS</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {isLoadingStats ? <span className="animate-pulse">--</span> : statsData?.total ?? leads.length}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Across Properties & Mansion
          </div>
        </div>

        {/* New Leads */}
        <div className="bg-[#14161c] border border-neutral-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">NEW LEADS</span>
            <UserCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
            {isLoadingStats ? <span className="animate-pulse">--</span> : statsData?.new ?? leads.filter(l => l.status === 'New').length}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Requires review</span>
          </div>
        </div>
      </div>

      {/* Main Content Split: Recent Leads Table & Properties Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Enquiries (2 cols on desktop) */}
        <div className="lg:col-span-2 bg-[#14161c] border border-neutral-800 rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-neutral-800/80">
            <div>
              <h3 className="text-base font-bold text-white">Recent Enquiries & Leads</h3>
              <p className="text-xs text-neutral-400">Cached and auto-synced via TanStack Query</p>
            </div>
            <a
              href="/admin/leads"
              className="text-xs font-bold text-[#FFCC00] hover:underline flex items-center gap-1"
            >
              <span>View All Leads</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {isLoadingLeads ? (
            <div className="py-12 text-center text-xs text-neutral-500 animate-pulse">
              Loading recent leads...
            </div>
          ) : recentLeads.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-neutral-300">No enquiries recorded yet</p>
              <p className="text-xs text-neutral-500 mt-1">
                Leads submitted through the public website will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-neutral-500 border-b border-neutral-800/60 pb-2 uppercase tracking-wider font-bold">
                    <th className="pb-3 pl-2">Prospect</th>
                    <th className="pb-3">Source</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/40">
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-neutral-800/30 transition-colors group">
                      <td className="py-3.5 pl-2">
                        <div className="font-bold text-white">{lead.name}</div>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
                          <span>{lead.phone}</span>
                          {lead.email && <span>· {lead.email}</span>}
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          lead.source === 'Sanjay Mansion'
                            ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}>
                          {lead.source}
                        </span>
                      </td>
                      <td className="py-3.5 text-neutral-400">
                        {new Date(lead.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] ${getStatusBadge(lead.status as LeadStatus)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right pr-2">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white cursor-pointer"
                            title="View Lead Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {lead.status === 'New' && (
                            <button
                              onClick={() => handleStatusChange(lead.id, 'Contacted')}
                              className="px-2 py-1 rounded-md bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[11px] font-semibold transition-colors cursor-pointer"
                              title="Mark as Contacted"
                            >
                              Contact
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Properties Overview (1 col) */}
        <div className="space-y-6">
          <div className="bg-[#14161c] border border-neutral-800 rounded-3xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800/80">
              <h3 className="text-base font-bold text-white">Active Properties</h3>
              <a href="/admin/properties" className="text-xs font-bold text-[#FFCC00] hover:underline">
                Manage
              </a>
            </div>

            <div className="space-y-4">
              {isLoadingProps ? (
                <div className="py-8 text-center text-xs text-neutral-500 animate-pulse">Loading properties...</div>
              ) : properties.map((prop) => (
                <div key={prop.id} className="p-4 rounded-2xl bg-[#0e1014] border border-neutral-800/80">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#FFCC00] tracking-wider block">
                        {prop.short_name}
                      </span>
                      <h4 className="text-sm font-bold text-white leading-tight mt-0.5">{prop.name}</h4>
                      <p className="text-[11px] text-neutral-400 mt-1">{prop.full_address || prop.address_line1}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                      {prop.status}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                    <div className="text-xs font-bold text-white">
                      From {prop.pricing_start || '₹4,900'}
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/admin/properties/${prop.id || 'sanjay-mansion'}`}
                        className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors cursor-pointer"
                      >
                        Edit
                      </a>
                      <a
                        href="/sanjay-mansion"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white cursor-pointer"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support Info Card */}
          <div className="bg-[#14161c] border border-neutral-800 rounded-3xl p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Website Contact Numbers
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">Primary Booking:</span>
                <span className="font-bold text-white">+91 80568 89900</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">Secondary Booking:</span>
                <span className="font-bold text-white">+91 81108 89900</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Location:</span>
                <span className="font-bold text-neutral-200 truncate max-w-[150px]">Saravanampatti, CBE</span>
              </div>
            </div>
            <a
              href="/admin/settings"
              className="mt-3 block text-center py-2 rounded-xl bg-neutral-800/70 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Update Contact Settings
            </a>
          </div>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#171a22] border border-neutral-700 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <span className="text-[10px] font-bold text-[#FFCC00] uppercase tracking-wider">
                  Lead Details · {selectedLead.source}
                </span>
                <h3 className="text-lg font-bold mt-0.5">{selectedLead.name}</h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#101217] border border-neutral-800">
                <div>
                  <span className="text-neutral-500 block">Phone</span>
                  <a href={`tel:${selectedLead.phone}`} className="font-bold text-white hover:text-[#FFCC00]">
                    {selectedLead.phone}
                  </a>
                </div>
                <div>
                  <span className="text-neutral-500 block">Email</span>
                  <span className="font-bold text-neutral-200">{selectedLead.email || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Enquiry Type</span>
                  <span className="font-bold text-neutral-200">{selectedLead.enquiry_type}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Status</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] ${getStatusBadge(selectedLead.status as LeadStatus)}`}>
                    {selectedLead.status}
                  </span>
                </div>
              </div>

              {selectedLead.preferred_accommodation && (
                <div className="p-3 rounded-xl bg-[#101217] border border-neutral-800">
                  <span className="text-neutral-500 block">Preferred Accommodation</span>
                  <span className="font-semibold text-white">{selectedLead.preferred_accommodation}</span>
                </div>
              )}

              {selectedLead.message && (
                <div className="p-3 rounded-xl bg-[#101217] border border-neutral-800">
                  <span className="text-neutral-500 block mb-1">Customer Message</span>
                  <p className="text-neutral-300 italic">"{selectedLead.message}"</p>
                </div>
              )}
            </div>

            {/* Quick Actions (Call & WhatsApp) */}
            <div className="pt-4 border-t border-neutral-800 flex flex-wrap gap-2.5">
              <a
                href={`tel:${selectedLead.phone}`}
                className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-[#FFCC00]" />
                <span>Call Lead</span>
              </a>
              <a
                href={generateWhatsAppUrl(selectedLead.phone, selectedLead.name, selectedLead.source)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <button
                onClick={() => handleStatusChange(selectedLead.id, 'Contacted')}
                className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Mark Contacted
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
