import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle2,
  Trash2,
  Eye,
  Send,
  Calendar,
  Building2,
  ArrowUpDown,
} from 'lucide-react';
import { useLeads, useUpdateLeadStatus, useAddLeadNote, useDeleteLead } from '../../hooks/useLeadsQuery';
import type { Lead, LeadStatus } from '../../types/database';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { DataTablePagination } from '../ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

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
    // Strictly isolate website leads from Justdial leads
    let result = rawLeads.filter((l) => (l.source as string)?.toLowerCase() !== 'justdial');

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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sourceFilter, sortBy]);

  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  const renderStatusBadge = (status: LeadStatus | string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'new':
        return <Badge variant="warning">New</Badge>;
      case 'contacted':
        return <Badge variant="info">Contacted</Badge>;
      case 'in discussion':
        return <Badge variant="secondary">In Discussion</Badge>;
      case 'visit scheduled':
        return <Badge variant="success">Visit Scheduled</Badge>;
      case 'converted':
        return <Badge variant="default">Converted</Badge>;
      case 'lost':
        return <Badge variant="outline" className="text-rose-400 border-rose-500/30 bg-rose-500/10">Lost</Badge>;
      case 'closed':
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status ? status.charAt(0).toUpperCase() + status.slice(1) : ''}</Badge>;
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
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-neutral-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#FFCC00]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#FFCC00]" />
            Website Leads & Enquiries
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Manage prospective tenant and real estate buyer inquiries with real-time status tracking
          </p>
        </div>

        <Badge variant="outline" className="px-3 py-1.5 text-xs font-semibold self-start sm:self-auto border-neutral-700">
          Total Enquiries: <span className="text-[#FFCC00] font-bold ml-1.5">{filteredLeads.length}</span>
        </Badge>
      </div>

      {/* Search & Filter Toolbar */}
      <Card className="bg-neutral-900/60 border-neutral-800">
        <CardContent className="p-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search by prospect name, phone, email or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Source Filter */}
              <div className="w-[140px]">
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="h-9 bg-neutral-900 border-neutral-700/80">
                    <SelectValue placeholder="All Sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="Sanjay Mansion">Sanjay Mansion</SelectItem>
                    <SelectItem value="Western Stay">Western Stay</SelectItem>
                    <SelectItem value="Sanjay Properties">Sanjay Properties</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="w-[140px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 bg-neutral-900 border-neutral-700/80">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="In Discussion">In Discussion</SelectItem>
                    <SelectItem value="Visit Scheduled">Visit Scheduled</SelectItem>
                    <SelectItem value="Converted">Converted</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="w-[130px]">
                <Select value={sortBy} onValueChange={(val) => setSortBy(val as 'newest' | 'oldest')}>
                  <SelectTrigger className="h-9 bg-neutral-900 border-neutral-700/80">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-neutral-400 animate-pulse">
          Loading CRM leads from database...
        </div>
      ) : filteredLeads.length === 0 ? (
        <Card className="text-center p-12 bg-neutral-900/40 border-dashed border-neutral-800">
          <CardContent className="space-y-3 p-0">
            <Users className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No leads match criteria</h3>
            <p className="text-xs text-neutral-400">Try clearing your search or status filter.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden border-neutral-800 bg-neutral-900/60">
          <Table>
            <TableHeader className="bg-neutral-950/70 border-b border-neutral-800">
              <TableRow className="border-neutral-800 hover:bg-transparent">
                <TableHead className="w-[240px] text-neutral-400 font-semibold text-xs">Prospect Details</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Source & Category</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Preferences</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Date</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Status</TableHead>
                <TableHead className="text-right text-neutral-400 font-semibold text-xs pr-6">Quick Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-neutral-800/60">
              {paginatedLeads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-neutral-800/30 transition-colors border-neutral-800/60">
                  <TableCell className="font-medium">
                    <div className="font-bold text-sm text-white">{lead.name}</div>
                    <div className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
                      <a href={`tel:${lead.phone}`} className="hover:text-[#FFCC00] font-medium transition-colors">
                        {lead.phone}
                      </a>
                      {lead.email && <span>· {lead.email}</span>}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={lead.source === 'Sanjay Mansion' ? 'secondary' : 'default'}
                      className="text-[10px] font-semibold"
                    >
                      {lead.source}
                    </Badge>
                    <div className="text-[11px] text-neutral-400 mt-1 truncate max-w-[180px]">
                      {lead.enquiry_type}
                    </div>
                  </TableCell>

                  <TableCell className="text-neutral-300">
                    {lead.preferred_accommodation ? (
                      <div className="font-medium text-white">{lead.preferred_accommodation}</div>
                    ) : (
                      <div className="text-neutral-500">—</div>
                    )}
                    {lead.preferred_date && (
                      <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-neutral-500" />
                        <span>Move-in: {lead.preferred_date}</span>
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="text-neutral-400 text-xs">
                    {new Date(lead.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      {renderStatusBadge(lead.status as LeadStatus)}
                      <Select
                        value={lead.status}
                        onValueChange={(val) => handleStatusChange(lead.id, val as LeadStatus)}
                      >
                        <SelectTrigger className="h-7 text-[11px] w-[125px] bg-neutral-900 border-neutral-700/80">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Contacted">Contacted</SelectItem>
                          <SelectItem value="In Discussion">In Discussion</SelectItem>
                          <SelectItem value="Visit Scheduled">Visit Scheduled</SelectItem>
                          <SelectItem value="Converted">Converted</SelectItem>
                          <SelectItem value="Lost">Lost</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => setSelectedLead(lead)}
                        className="h-8 w-8"
                        title="View Full Profile & Notes"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        asChild
                        className="h-8 w-8 text-[#FFCC00] hover:text-[#FFCC00]"
                      >
                        <a href={`tel:${lead.phone}`} title="Call Phone">
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        asChild
                        className="h-8 w-8 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20"
                      >
                        <a
                          href={generateWhatsAppUrl(lead.phone, lead.name, lead.source)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => setDeleteConfirmId(lead.id)}
                        className="h-8 w-8 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredLeads.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[10, 25, 50, 100]}
          />
        </Card>
      )}

      {/* Lead Detail & Internal Notes Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        {selectedLead && (
          <DialogContent className="max-w-2xl bg-neutral-900 border-neutral-800 text-white">
            <DialogHeader className="border-b border-neutral-800 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold text-[#FFCC00] border-[#FFCC00]/30 mb-1">
                    Lead Profile · {selectedLead.source}
                  </Badge>
                  <DialogTitle className="text-xl font-bold">{selectedLead.name}</DialogTitle>
                </div>
              </div>
            </DialogHeader>

            <div className="py-3 space-y-4 text-xs">
              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-neutral-950/60 border border-neutral-800">
                <div>
                  <span className="text-neutral-500 block text-[11px]">Phone</span>
                  <a href={`tel:${selectedLead.phone}`} className="font-semibold text-white hover:text-[#FFCC00]">
                    {selectedLead.phone}
                  </a>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Email</span>
                  <span className="font-semibold text-neutral-200">{selectedLead.email || 'None'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px] mb-1">Status</span>
                  {renderStatusBadge(selectedLead.status as LeadStatus)}
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Category</span>
                  <span className="font-semibold text-neutral-200">{selectedLead.enquiry_type}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Room Preference</span>
                  <span className="font-semibold text-neutral-200">{selectedLead.preferred_accommodation || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Move-in Date</span>
                  <span className="font-semibold text-neutral-200">{selectedLead.preferred_date || 'Flexible'}</span>
                </div>
              </div>

              {selectedLead.message && (
                <div className="p-3.5 rounded-lg bg-neutral-950/60 border border-neutral-800">
                  <span className="text-neutral-500 block text-[11px] mb-1">Customer Enquiry Message</span>
                  <p className="text-neutral-200 italic leading-relaxed">
                    "{selectedLead.message}"
                  </p>
                </div>
              )}

              {/* Internal Notes History */}
              <div className="space-y-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block">
                  Staff Notes Timeline
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(!selectedLead.notes || selectedLead.notes.length === 0) ? (
                    <p className="text-neutral-500 italic text-xs">No notes added yet.</p>
                  ) : (
                    selectedLead.notes.map((note) => (
                      <div key={note.id} className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800 text-xs">
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
                <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                  <Input
                    placeholder="Add an internal follow-up note..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 h-9 text-xs"
                  />
                  <Button type="submit" size="sm" className="h-9 font-semibold">
                    <Send className="w-3.5 h-3.5 mr-1" />
                    <span>Add</span>
                  </Button>
                </form>
              </div>
            </div>

            <DialogFooter className="border-t border-neutral-800 pt-3 flex flex-wrap gap-2">
              <Button asChild variant="secondary" size="sm">
                <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#FFCC00]" />
                  <span>Call Phone</span>
                </a>
              </Button>
              <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
                <a
                  href={generateWhatsAppUrl(selectedLead.phone, selectedLead.name, selectedLead.source)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Open WhatsApp</span>
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(selectedLead.id, 'Contacted')}
              >
                Mark Contacted
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleStatusChange(selectedLead.id, 'Closed')}
                className="text-neutral-400 hover:text-white"
              >
                Close Lead
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="max-w-md bg-neutral-900 border-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle>Delete Enquiry Record?</DialogTitle>
            <DialogDescription className="text-neutral-400 text-xs">
              Are you sure you want to permanently delete this lead? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
