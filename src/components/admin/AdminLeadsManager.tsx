import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle2,
  Trash2,
  Eye,
  Send,
  X,
} from 'lucide-react';
import { useLeads, useUpdateLeadStatus, useAddLeadNote, useDeleteLead } from '../../hooks/useLeadsQuery';
import type { Lead, LeadStatus } from '../../types/database';

export const AdminLeadsManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // TanStack Query Hooks
  const { data: rawLeads = [], isLoading } = useLeads(statusFilter === 'all' ? undefined : statusFilter);
  const updateStatusMutation = useUpdateLeadStatus();
  const addNoteMutation = useAddLeadNote();
  const deleteLeadMutation = useDeleteLead();

  // Detail Modal & Notes
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: leadId, status: newStatus });
      showToast(`Status updated to ${newStatus}`);
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update status');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;

    try {
      const note = await addNoteMutation.mutateAsync({
        id: selectedLead.id,
        noteText: newNoteText.trim(),
        author: 'Admin',
      });
      if (note) {
        const updatedNotes = [...(selectedLead.notes || []), note];
        setSelectedLead({ ...selectedLead, notes: updatedNotes });
        setNewNoteText('');
        showToast('Note recorded.');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to add note');
    }
  };

  const handleDelete = async (leadId: string) => {
    try {
      await deleteLeadMutation.mutateAsync(leadId);
      showToast('Lead removed.');
      setDeleteConfirmId(null);
      if (selectedLead?.id === leadId) setSelectedLead(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete lead');
    }
  };

  const filteredLeads = useMemo(() => {
    let result = [...rawLeads];

    if (sourceFilter !== 'all') {
      result = result.filter((l) => l.source === sourceFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.phone.toLowerCase().includes(q) ||
          (l.email && l.email.toLowerCase().includes(q)) ||
          (l.message && l.message.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }

    return result;
  }, [rawLeads, searchQuery, sourceFilter, sortBy]);

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
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e222b] text-white px-5 py-3 rounded-2xl shadow-2xl border border-neutral-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#FFCC00]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Leads & Enquiry CRM</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Manage prospective tenant and real estate buyer enquiries in real time with TanStack Query
          </p>
        </div>

        <div className="text-xs font-semibold text-neutral-400 bg-[#14161c] px-4 py-2 rounded-xl border border-neutral-800">
          Total Enquiries: <span className="text-[#FFCC00] font-bold">{filteredLeads.length}</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-[#14161c] border border-neutral-800 p-3.5 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by prospect name, phone, email or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFCC00]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-[#0e1014] border border-neutral-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFCC00]"
          >
            <option value="all">All Sources</option>
            <option value="Sanjay Mansion">Sanjay Mansion</option>
            <option value="Sanjay Properties">Sanjay Properties</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0e1014] border border-neutral-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFCC00]"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="In Discussion">In Discussion</option>
            <option value="Visit Scheduled">Visit Scheduled</option>
            <option value="Converted">Converted</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
            className="bg-[#0e1014] border border-neutral-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFCC00]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-neutral-400 animate-pulse">
          Loading CRM leads from database...
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="py-20 text-center bg-[#14161c] border border-neutral-800 rounded-3xl p-8">
          <Users className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No leads match criteria</h3>
          <p className="text-xs text-neutral-400 mt-1">Try clearing your search or status filter.</p>
        </div>
      ) : (
        <div className="bg-[#14161c] border border-neutral-800 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider font-bold bg-[#111317]">
                  <th className="py-3.5 pl-5">Prospect Details</th>
                  <th className="py-3.5">Source & Category</th>
                  <th className="py-3.5">Preferences</th>
                  <th className="py-3.5">Date</th>
                  <th className="py-3.5">Status</th>
                  <th className="py-3.5 text-right pr-5">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-4 pl-5">
                      <div className="font-bold text-sm text-white">{lead.name}</div>
                      <div className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
                        <a href={`tel:${lead.phone}`} className="hover:text-[#FFCC00] font-medium">
                          {lead.phone}
                        </a>
                        {lead.email && <span>· {lead.email}</span>}
                      </div>
                    </td>

                    <td className="py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          lead.source === 'Sanjay Mansion'
                            ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {lead.source}
                      </span>
                      <div className="text-[11px] text-neutral-400 mt-1 truncate max-w-[180px]">
                        {lead.enquiry_type}
                      </div>
                    </td>

                    <td className="py-4 text-neutral-300">
                      {lead.preferred_accommodation ? (
                        <div className="font-medium text-white">{lead.preferred_accommodation}</div>
                      ) : (
                        <div className="text-neutral-500">—</div>
                      )}
                      {lead.preferred_date && (
                        <div className="text-[11px] text-neutral-400">Move-in: {lead.preferred_date}</div>
                      )}
                    </td>

                    <td className="py-4 text-neutral-400">
                      {new Date(lead.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>

                    <td className="py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        className={`px-2.5 py-1 rounded-full text-[11px] cursor-pointer focus:outline-none ${getStatusBadge(
                          lead.status as LeadStatus
                        )}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Discussion">In Discussion</option>
                        <option value="Visit Scheduled">Visit Scheduled</option>
                        <option value="Converted">Converted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    <td className="py-4 text-right pr-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white transition-colors cursor-pointer"
                          title="View Full Profile & Notes"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={`tel:${lead.phone}`}
                          className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[#FFCC00] transition-colors cursor-pointer"
                          title="Call"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={generateWhatsAppUrl(lead.phone, lead.name, lead.source)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 transition-colors cursor-pointer"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => setDeleteConfirmId(lead.id)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lead Detail & Internal Notes Drawer/Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#171a22] border border-neutral-700 rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0">
              <div>
                <span className="text-[10px] font-bold text-[#FFCC00] uppercase tracking-wider">
                  Lead Profile · {selectedLead.source}
                </span>
                <h3 className="text-xl font-extrabold mt-0.5">{selectedLead.name}</h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-5 space-y-5 text-xs">
              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#101217] border border-neutral-800">
                <div>
                  <span className="text-neutral-500 block">Phone</span>
                  <a href={`tel:${selectedLead.phone}`} className="font-bold text-white hover:text-[#FFCC00]">
                    {selectedLead.phone}
                  </a>
                </div>
                <div>
                  <span className="text-neutral-500 block">Email</span>
                  <span className="font-bold text-neutral-200">{selectedLead.email || 'None'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Status</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] ${getStatusBadge(selectedLead.status as LeadStatus)}`}>
                    {selectedLead.status}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Category</span>
                  <span className="font-semibold text-neutral-200">{selectedLead.enquiry_type}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Room Preference</span>
                  <span className="font-semibold text-neutral-200">{selectedLead.preferred_accommodation || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Move-in Date</span>
                  <span className="font-semibold text-neutral-200">{selectedLead.preferred_date || 'Flexible'}</span>
                </div>
              </div>

              {selectedLead.message && (
                <div className="p-4 rounded-2xl bg-[#101217] border border-neutral-800">
                  <span className="text-neutral-500 block mb-1">Customer Enquiry Message</span>
                  <p className="text-neutral-200 italic font-medium leading-relaxed">
                    "{selectedLead.message}"
                  </p>
                </div>
              )}

              {/* Internal Notes History */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
                  Staff Notes Timeline
                </span>
                <div className="space-y-2">
                  {(!selectedLead.notes || selectedLead.notes.length === 0) ? (
                    <p className="text-neutral-500 italic">No notes added yet.</p>
                  ) : (
                    selectedLead.notes.map((note) => (
                      <div key={note.id} className="p-3 rounded-xl bg-[#101217] border border-neutral-800 text-xs">
                        <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                          <span className="font-bold text-[#FFCC00]">{note.author || 'Admin'}</span>
                          <span>{new Date((note as any).createdAt || (note as any).date || Date.now()).toLocaleString()}</span>
                        </div>
                        <p className="text-neutral-200">{note.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add an internal follow-up note..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-[#101217] border border-neutral-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#FFCC00] text-black font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-neutral-800 flex flex-wrap gap-2.5 shrink-0">
              <a
                href={`tel:${selectedLead.phone}`}
                className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#FFCC00]" />
                <span>Call Phone</span>
              </a>

              <a
                href={generateWhatsAppUrl(selectedLead.phone, selectedLead.name, selectedLead.source)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open WhatsApp</span>
              </a>

              <button
                onClick={() => handleStatusChange(selectedLead.id, 'Contacted')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
              >
                Mark Contacted
              </button>

              <button
                onClick={() => handleStatusChange(selectedLead.id, 'Closed')}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white font-bold text-xs cursor-pointer"
              >
                Close Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#171a22] border border-neutral-700 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl">
            <h3 className="text-lg font-bold">Delete Enquiry?</h3>
            <p className="text-xs text-neutral-400 mt-2">
              Are you sure you want to remove this lead record permanently?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-xs text-neutral-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 font-bold text-xs text-white cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
