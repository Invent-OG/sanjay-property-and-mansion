import React, { useState, useMemo } from 'react';
import {
  PhoneCall,
  Search,
  Filter,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle2,
  Trash2,
  Eye,
  X,
  Calendar,
  Clock,
  MapPin,
  Building,
  Tag,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Code2,
  ChevronDown,
} from 'lucide-react';
import {
  useJustdialLeads,
  useJustdialLeadStats,
  useUpdateJustdialLeadStatus,
  useDeleteJustdialLead,
} from '../../hooks/useJustdialLeadsQuery';
import type { JustdialLeadRecord } from '../../db/schema';

const STATUS_OPTIONS = [
  { label: 'New', value: 'new', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { label: 'Contacted', value: 'contacted', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { label: 'Follow-up', value: 'follow-up', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  { label: 'Converted', value: 'converted', color: 'bg-[#FFCC00]/15 text-[#FFCC00] border-[#FFCC00]/40' },
  { label: 'Closed', value: 'closed', color: 'bg-neutral-800 text-neutral-400 border-neutral-700' },
];

export const AdminJustdialLeadsManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // React Query Hooks
  const { data: rawLeads = [], isLoading, refetch } = useJustdialLeads({
    status: statusFilter,
    search: searchQuery,
    sortBy,
  });

  const { data: stats } = useJustdialLeadStats();
  const updateStatusMutation = useUpdateJustdialLeadStatus();
  const deleteLeadMutation = useDeleteJustdialLead();

  // Selected Lead for Detail Modal
  const [selectedLead, setSelectedLead] = useState<JustdialLeadRecord | null>(null);
  const [showRawPayload, setShowRawPayload] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id: leadId, status: newStatus });
      showToast(`Status updated to ${newStatus.toUpperCase()}`);
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (leadId: string) => {
    try {
      await deleteLeadMutation.mutateAsync(leadId);
      showToast('Lead deleted successfully');
      setDeleteConfirmId(null);
      if (selectedLead?.id === leadId) setSelectedLead(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete lead');
    }
  };

  const getStatusBadge = (status: string | null) => {
    const s = (status || 'new').toLowerCase();
    const opt = STATUS_OPTIONS.find((o) => o.value === s) || STATUS_OPTIONS[0];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${opt.color}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {opt.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14161b] text-white px-5 py-3 rounded-2xl shadow-2xl border border-neutral-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#FFCC00]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#FFCC00]/20 text-[#FFCC00] text-xs font-bold uppercase tracking-wider">
              Automated Ingestion
            </span>
            <span className="text-xs text-neutral-400">Endpoint: /api/leads/justdial</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">Justdial Telephony &amp; CRM Pipeline</h2>
          <p className="text-xs text-neutral-400">
            Real-time webhook leads delivered via Justdial campaign integration with duplicate deduplication.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-all self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#FFCC00]" />
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* Stats Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-[#14161b] border border-neutral-800/80">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Total Justdial</span>
          <div className="text-2xl font-black text-white mt-1">{stats?.total ?? rawLeads.length}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#14161b] border border-neutral-800/80">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">New</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{stats?.newCount ?? 0}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#14161b] border border-neutral-800/80">
          <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">Contacted</span>
          <div className="text-2xl font-black text-blue-400 mt-1">{stats?.contactedCount ?? 0}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#14161b] border border-neutral-800/80">
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Follow-up</span>
          <div className="text-2xl font-black text-amber-400 mt-1">{stats?.followUpCount ?? 0}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#14161b] border border-neutral-800/80">
          <span className="text-[11px] font-semibold text-[#FFCC00] uppercase tracking-wider">Converted</span>
          <div className="text-2xl font-black text-[#FFCC00] mt-1">{stats?.convertedCount ?? 0}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#14161b] border border-neutral-800/80">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Closed</span>
          <div className="text-2xl font-black text-neutral-300 mt-1">{stats?.closedCount ?? 0}</div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#14161b] border border-neutral-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by lead ID, prospect name, phone, city, or category..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-700/80 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-[#FFCC00]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-700/80 shrink-0">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-neutral-200 focus:outline-hidden cursor-pointer"
            >
              <option value="all" className="bg-neutral-900 text-white">All Statuses</option>
              <option value="new" className="bg-neutral-900 text-white">New</option>
              <option value="contacted" className="bg-neutral-900 text-white">Contacted</option>
              <option value="follow-up" className="bg-neutral-900 text-white">Follow-up</option>
              <option value="converted" className="bg-neutral-900 text-white">Converted</option>
              <option value="closed" className="bg-neutral-900 text-white">Closed</option>
            </select>
          </div>

          {/* Sort Order */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-neutral-900 px-3 py-2 rounded-xl border border-neutral-700/80 text-xs text-neutral-200 focus:outline-hidden cursor-pointer shrink-0"
          >
            <option value="newest" className="bg-neutral-900 text-white">Newest First</option>
            <option value="oldest" className="bg-neutral-900 text-white">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl bg-[#14161b] border border-neutral-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0c0d0e] border-b border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-400 font-bold">
              <tr>
                <th className="py-3.5 px-4">Lead ID</th>
                <th className="py-3.5 px-4">Prospect</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Category &amp; Location</th>
                <th className="py-3.5 px-4">Lead Date / Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    <RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2 text-[#FFCC00]" />
                    <span>Loading Justdial leads...</span>
                  </td>
                </tr>
              ) : rawLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    <PhoneCall className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
                    <p className="font-semibold text-neutral-300">No Justdial leads found</p>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Incoming leads from GET /api/leads/justdial will automatically populate here.
                    </p>
                  </td>
                </tr>
              ) : (
                rawLeads.map((lead) => {
                  const hasMobile = Boolean(lead.mobile && lead.mobile.trim());
                  const hasPhone = Boolean(lead.phone && lead.phone.trim());
                  const primaryPhone = lead.mobile || lead.phone || '';
                  const cleanPhone = primaryPhone.replace(/\D/g, '');
                  const hasEmail = Boolean(lead.email && lead.email.trim());

                  return (
                    <tr key={lead.id} className="hover:bg-neutral-800/30 transition-colors">
                      {/* Lead ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-neutral-200">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#FFCC00] font-semibold">{lead.leadid}</span>
                        </div>
                        {lead.leadtype && (
                          <span className="text-[10px] text-neutral-500 block uppercase mt-0.5">
                            {lead.leadtype}
                          </span>
                        )}
                      </td>

                      {/* Prospect Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">
                          {lead.prefix ? `${lead.prefix} ` : ''}
                          {lead.name || 'Unnamed Prospect'}
                        </div>
                        {lead.company && (
                          <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                            <Building className="w-3 h-3 text-neutral-500" />
                            <span>{lead.company}</span>
                          </div>
                        )}
                      </td>

                      {/* Contact Info with DND indicators */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1">
                          {hasMobile && (
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-neutral-300 font-semibold">{lead.mobile}</span>
                              {lead.dncmobile === 1 ? (
                                <span
                                  className="inline-flex items-center text-[10px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30"
                                  title="DND Active on Mobile"
                                >
                                  DND
                                </span>
                              ) : (
                                <span
                                  className="inline-flex items-center text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                  title="Mobile clear for outreach"
                                >
                                  OK
                                </span>
                              )}
                            </div>
                          )}

                          {hasPhone && (
                            <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                              <span>Ph: {lead.phone}</span>
                              {lead.dncphone === 1 && (
                                <span className="text-[9px] text-rose-400">DND</span>
                              )}
                            </div>
                          )}

                          {hasEmail && (
                            <div className="text-[11px] text-neutral-400 truncate max-w-[180px]">
                              {lead.email}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Category & Location */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-neutral-200">
                          {lead.category || 'General'}
                        </div>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-neutral-500 shrink-0" />
                          <span>
                            {[lead.area, lead.city].filter(Boolean).join(', ') || 'Tamil Nadu'}
                            {lead.pincode ? ` - ${lead.pincode}` : ''}
                          </span>
                        </div>
                      </td>

                      {/* Lead Date / Time */}
                      <td className="py-3.5 px-4 text-neutral-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-neutral-500" />
                          <span>{lead.leadDate ? String(lead.leadDate).split('T')[0] : 'N/A'}</span>
                        </div>
                        {lead.leadTime && (
                          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{lead.leadTime}</span>
                          </div>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={(lead.status || 'new').toLowerCase()}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className="bg-neutral-900 border border-neutral-700/80 rounded-lg px-2.5 py-1 text-xs text-neutral-200 focus:outline-hidden focus:border-[#FFCC00] cursor-pointer"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="follow-up">Follow-up</option>
                          <option value="converted">Converted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Call Button */}
                          {cleanPhone && (
                            <a
                              href={`tel:${cleanPhone}`}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-emerald-500/20 hover:text-emerald-400 text-neutral-300 transition-colors"
                              title={`Call ${primaryPhone}`}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* WhatsApp Button */}
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`}?text=Hi%20${encodeURIComponent(lead.name || 'there')},%20greetings%20from%20Sanjay%20Properties.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-emerald-500/20 hover:text-emerald-400 text-neutral-300 transition-colors"
                              title="Send WhatsApp Message"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Email Button */}
                          {hasEmail && (
                            <a
                              href={`mailto:${lead.email}?subject=Sanjay%20Properties%20Enquiry`}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-blue-500/20 hover:text-blue-400 text-neutral-300 transition-colors"
                              title="Send Email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Inspect Detail Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLead(lead);
                              setShowRawPayload(false);
                            }}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-[#FFCC00]/20 hover:text-[#FFCC00] text-neutral-300 transition-colors"
                            title="View Full Lead Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Lead Button */}
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(lead.id)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-500/20 hover:text-rose-400 text-neutral-400 transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14161b] border border-neutral-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-base font-bold text-white">Delete Justdial Lead?</h3>
            <p className="text-xs text-neutral-400">
              This action cannot be undone. The lead record will be permanently removed from the Supabase database.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-xs font-semibold text-neutral-300 hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111216] border border-neutral-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-neutral-800/80 flex items-start justify-between gap-4 bg-gradient-to-r from-neutral-900 to-[#14161b]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFCC00]/20 text-[#FFCC00] text-[11px] font-bold uppercase tracking-wider">
                    Justdial Lead Detail
                  </span>
                  <span className="font-mono text-xs text-neutral-400">ID: {selectedLead.leadid}</span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedLead.prefix ? `${selectedLead.prefix} ` : ''}
                  {selectedLead.name || 'Unnamed Prospect'}
                </h3>
                {selectedLead.company && (
                  <p className="text-xs text-neutral-400 mt-0.5">{selectedLead.company}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center hover:bg-neutral-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content Scroll Area */}
            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
              {/* Quick Outreach Action Bar */}
              <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                {selectedLead.mobile && (
                  <a
                    href={`tel:${selectedLead.mobile.replace(/\D/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Mobile</span>
                  </a>
                )}

                {selectedLead.mobile && (
                  <a
                    href={`https://wa.me/${selectedLead.mobile.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(selectedLead.name || 'there')},%20greetings%20from%20Sanjay%20Properties.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black text-xs font-bold transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}

                {selectedLead.email && (
                  <a
                    href={`mailto:${selectedLead.email}?subject=Sanjay%20Properties%20Enquiry`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Email</span>
                  </a>
                )}

                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-neutral-400 font-medium">Status:</span>
                  <select
                    value={(selectedLead.status || 'new').toLowerCase()}
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                    className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-[#FFCC00]"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Data Grid: Complete Justdial Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Field 1: Lead ID & Type */}
                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                    Lead ID &amp; Type
                  </span>
                  <div className="text-neutral-200 font-mono font-semibold">{selectedLead.leadid}</div>
                  <div className="text-neutral-400 text-[11px] mt-0.5">Type: {selectedLead.leadtype || 'N/A'}</div>
                </div>

                {/* Field 2: Parent ID */}
                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                    Parent Campaign ID
                  </span>
                  <div className="text-neutral-200 font-mono">{selectedLead.parentid || 'N/A'}</div>
                </div>

                {/* Field 3: Mobile & DND */}
                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                    Mobile Number &amp; DND
                  </span>
                  <div className="text-neutral-200 font-mono font-bold text-sm">{selectedLead.mobile || 'N/A'}</div>
                  <div className="mt-1">
                    {selectedLead.dncmobile === 1 ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 font-semibold">
                        <ShieldAlert className="w-3 h-3" /> DND Registry Active (dncmobile=1)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                        <ShieldCheck className="w-3 h-3" /> Clear for Direct Calling (dncmobile=0)
                      </span>
                    )}
                  </div>
                </div>

                {/* Field 4: Phone & DND */}
                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                    Alternate Phone &amp; DND
                  </span>
                  <div className="text-neutral-200 font-mono">{selectedLead.phone || 'None provided'}</div>
                  <div className="mt-1">
                    {selectedLead.dncphone === 1 ? (
                      <span className="text-[10px] text-rose-400 font-semibold">DND Active (dncphone=1)</span>
                    ) : (
                      <span className="text-[10px] text-neutral-500">dncphone=0</span>
                    )}
                  </div>
                </div>

                {/* Field 5: Email */}
                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                    Email Address
                  </span>
                  <div className="text-neutral-200 break-all">{selectedLead.email || 'None provided'}</div>
                </div>

                {/* Field 6: Category */}
                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                    Enquired Category
                  </span>
                  <div className="text-[#FFCC00] font-bold">{selectedLead.category || 'N/A'}</div>
                </div>

                {/* Field 7: Location Area & City */}
                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                    Primary Area &amp; City
                  </span>
                  <div className="text-neutral-200">
                    {[selectedLead.area, selectedLead.city].filter(Boolean).join(', ') || 'N/A'}
                  </div>
                  {selectedLead.pincode && (
                    <div className="text-neutral-400 text-[11px] mt-0.5">Pincode: {selectedLead.pincode}</div>
                  )}
                </div>

                {/* Field 8: Branch Area & Pincode */}
                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                    Branch Area &amp; Pincode
                  </span>
                  <div className="text-neutral-200">{selectedLead.brancharea || 'None specified'}</div>
                  {selectedLead.branchpin && (
                    <div className="text-neutral-400 text-[11px] mt-0.5">Branch PIN: {selectedLead.branchpin}</div>
                  )}
                </div>

                {/* Field 9: Lead Submission Date & Time */}
                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                    Justdial Timestamp
                  </span>
                  <div className="text-neutral-200">
                    Date: {selectedLead.leadDate ? String(selectedLead.leadDate).split('T')[0] : 'N/A'}
                  </div>
                  <div className="text-neutral-400 text-[11px] mt-0.5">
                    Time: {selectedLead.leadTime || 'N/A'}
                  </div>
                </div>

                {/* Field 10: Ingested Timestamp */}
                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                    System Ingestion
                  </span>
                  <div className="text-neutral-200">
                    {new Date(selectedLead.createdAt).toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                    })}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">
                    Updated: {new Date(selectedLead.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </div>
                </div>
              </div>

              {/* Raw JSON Payload (Admin Protected Inspection) */}
              <div className="pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowRawPayload(!showRawPayload)}
                  className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-[#FFCC00] transition-colors cursor-pointer"
                >
                  <Code2 className="w-4 h-4" />
                  <span>{showRawPayload ? 'Hide' : 'View'} Raw Webhook Payload (Audit Trail)</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showRawPayload ? 'rotate-180' : ''}`} />
                </button>

                {showRawPayload && (
                  <pre className="mt-3 p-4 rounded-xl bg-black/90 border border-neutral-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-60 leading-relaxed">
                    {JSON.stringify(selectedLead.rawPayload, null, 2)}
                  </pre>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-neutral-800/80 bg-neutral-900/50 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500">
                Source: {selectedLead.source || 'justdial'} · Authenticated Administrator View
              </span>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
