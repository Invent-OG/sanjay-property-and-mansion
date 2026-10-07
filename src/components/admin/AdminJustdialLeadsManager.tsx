import React, { useState, useMemo, useEffect } from 'react';
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
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
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';

const formatLeadDate = (dateVal?: string | Date | null, fallbackVal?: string | Date | null): string => {
  const val = dateVal || (fallbackVal ? String(fallbackVal).split('T')[0] : null);
  if (!val) return 'N/A';
  try {
    const str = String(val).trim();
    const parts = str.split('T')[0].split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      }
    }
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
    return str.split('T')[0];
  } catch {
    return String(val);
  }
};

const formatLeadTime = (timeVal?: string | null, fallbackVal?: string | Date | null): string => {
  if (timeVal) {
    const trimmed = String(timeVal).trim();
    const match = trimmed.match(/^([01]?\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/);
    if (match) {
      const hh = parseInt(match[1], 10);
      const mm = match[2];
      const ampm = hh >= 12 ? 'PM' : 'AM';
      const hour12 = hh % 12 || 12;
      return `${hour12}:${mm} ${ampm}`;
    }
    return trimmed;
  }
  if (fallbackVal) {
    try {
      const d = new Date(fallbackVal);
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata',
        });
      }
    } catch {}
  }
  return '';
};

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

  // Filter out any synthetic test leads with TEST prefix
  const displayLeads = useMemo(() => {
    return rawLeads.filter((l) => !l.leadid?.toUpperCase().startsWith('TEST'));
  }, [rawLeads]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortBy]);

  const totalPages = Math.ceil(displayLeads.length / pageSize) || 1;
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return displayLeads.slice(start, start + pageSize);
  }, [displayLeads, currentPage, pageSize]);

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
    switch (s) {
      case 'new':
        return <Badge variant="success">New</Badge>;
      case 'contacted':
        return <Badge variant="info">Contacted</Badge>;
      case 'follow-up':
        return <Badge variant="warning">Follow-up</Badge>;
      case 'converted':
        return <Badge variant="default">Converted</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="outline">{s}</Badge>;
    }
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
      <Card className="p-5 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-[11px] font-bold">
              Automated Ingestion
            </Badge>
            <span className="text-xs text-neutral-400">Endpoint: /api/leads/justdial</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">Justdial Telephony &amp; CRM Pipeline</h2>
          <p className="text-xs text-neutral-400">
            Real-time webhook leads delivered via Justdial campaign integration with duplicate deduplication.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="self-start sm:self-auto gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#FFCC00]" />
          <span>Refresh Leads</span>
        </Button>
      </Card>

      {/* Stats Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-4 bg-[#14161b] border-neutral-800">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Total Justdial</span>
          <div className="text-2xl font-black text-white mt-1">{stats?.total ?? displayLeads.length}</div>
        </Card>

        <Card className="p-4 bg-[#14161b] border-neutral-800">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">New</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{stats?.newCount ?? 0}</div>
        </Card>

        <Card className="p-4 bg-[#14161b] border-neutral-800">
          <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">Contacted</span>
          <div className="text-2xl font-black text-sky-400 mt-1">{stats?.contactedCount ?? 0}</div>
        </Card>

        <Card className="p-4 bg-[#14161b] border-neutral-800">
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Follow-up</span>
          <div className="text-2xl font-black text-amber-400 mt-1">{stats?.followUpCount ?? 0}</div>
        </Card>

        <Card className="p-4 bg-[#14161b] border-neutral-800">
          <span className="text-[11px] font-semibold text-[#FFCC00] uppercase tracking-wider">Converted</span>
          <div className="text-2xl font-black text-[#FFCC00] mt-1">{stats?.convertedCount ?? 0}</div>
        </Card>

        <Card className="p-4 bg-[#14161b] border-neutral-800">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Closed</span>
          <div className="text-2xl font-black text-neutral-300 mt-1">{stats?.closedCount ?? 0}</div>
        </Card>
      </div>

      {/* Filter and Search Controls */}
      <Card className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 bg-[#14161b] border-neutral-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by prospect name, phone, city, or category..."
            className="pl-9 bg-neutral-900 border-neutral-700/80"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Status Filter */}
          <div className="w-[140px] shrink-0">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 bg-neutral-900 border-neutral-700/80">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div className="w-[130px] shrink-0">
            <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
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
      </Card>

      {/* Leads Table */}
      <Card className="overflow-hidden border-neutral-800 bg-neutral-900/60">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prospect</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Category &amp; Location</TableHead>
            <TableHead>Lead Date / Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="py-12 text-center text-neutral-500">
                <RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2 text-[#FFCC00]" />
                <span>Loading Justdial leads...</span>
              </TableCell>
            </TableRow>
          ) : displayLeads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-12 text-center text-neutral-500">
                <PhoneCall className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
                <p className="font-semibold text-neutral-300">No Justdial leads found</p>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Incoming leads from GET /api/leads/justdial will automatically populate here.
                </p>
              </TableCell>
            </TableRow>
          ) : (
            paginatedLeads.map((lead) => {
              const hasMobile = Boolean(lead.mobile && lead.mobile.trim());
              const hasPhone = Boolean(lead.phone && lead.phone.trim());
              const primaryPhone = lead.mobile || lead.phone || '';
              const cleanPhone = primaryPhone.replace(/\D/g, '');
              const hasEmail = Boolean(lead.email && lead.email.trim());

              const displayDate = formatLeadDate(
                lead.leadDate || (lead as any).lead_date,
                lead.createdAt || (lead as any).created_at
              );
              const displayTime = formatLeadTime(
                lead.leadTime || (lead as any).lead_time,
                lead.createdAt || (lead as any).created_at
              );

              return (
                <TableRow key={lead.id}>
                  {/* Prospect Name */}
                  <TableCell>
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
                  </TableCell>

                  {/* Contact Info with DND indicators */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {hasMobile && (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-neutral-300 font-semibold">{lead.mobile}</span>
                          {lead.dncmobile === 1 ? (
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0 font-normal">
                              DND
                            </Badge>
                          ) : (
                            <Badge variant="success" className="text-[10px] px-1.5 py-0 font-normal">
                              OK
                            </Badge>
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
                  </TableCell>

                  {/* Category & Location */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-neutral-200">
                        {lead.category || 'General'}
                      </span>
                      {lead.leadtype && (
                        <Badge variant="outline" className="text-[9px] uppercase px-1.5 py-0 text-neutral-400 border-neutral-700">
                          {lead.leadtype}
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-neutral-500 shrink-0" />
                      <span>
                        {[lead.area, lead.city].filter(Boolean).join(', ') || 'Tamil Nadu'}
                        {lead.pincode ? ` - ${lead.pincode}` : ''}
                      </span>
                    </div>
                  </TableCell>

                  {/* Lead Date / Time */}
                  <TableCell className="text-neutral-300">
                    <div className="flex items-center gap-1.5 font-medium text-xs text-neutral-200">
                      <Calendar className="w-3.5 h-3.5 text-[#FFCC00]/90 shrink-0" />
                      <span>{displayDate}</span>
                    </div>
                    {displayTime && (
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mt-0.5">
                        <Clock className="w-3 h-3 text-neutral-500 shrink-0" />
                        <span>{displayTime}</span>
                      </div>
                    )}
                  </TableCell>

                  {/* Status Dropdown */}
                  <TableCell>
                    <Select
                      value={(lead.status || 'new').toLowerCase()}
                      onValueChange={(val) => handleStatusChange(lead.id, val)}
                    >
                      <SelectTrigger className="h-7 text-xs w-[120px] bg-neutral-900 border-neutral-700/80">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Quick Actions */}
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {/* Call Button */}
                      {cleanPhone && (
                        <Button
                          variant="secondary"
                          size="icon"
                          asChild
                          title={`Call ${primaryPhone}`}
                        >
                          <a href={`tel:${cleanPhone}`}>
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          </a>
                        </Button>
                      )}

                      {/* WhatsApp Button */}
                      {cleanPhone && (
                        <Button
                          variant="secondary"
                          size="icon"
                          asChild
                          title="Send WhatsApp Message"
                        >
                          <a
                            href={`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`}?text=Hi%20${encodeURIComponent(lead.name || 'there')},%20greetings%20from%20Sanjay%20Properties.`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                          </a>
                        </Button>
                      )}

                      {/* Email Button */}
                      {hasEmail && (
                        <Button
                          variant="secondary"
                          size="icon"
                          asChild
                          title="Send Email"
                        >
                          <a href={`mailto:${lead.email}?subject=Sanjay%20Properties%20Enquiry`}>
                            <Mail className="w-3.5 h-3.5 text-sky-400" />
                          </a>
                        </Button>
                      )}

                      {/* Inspect Detail Button */}
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => {
                          setSelectedLead(lead);
                          setShowRawPayload(false);
                        }}
                        title="View Full Lead Details"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#FFCC00]" />
                      </Button>

                      {/* Delete Lead Button */}
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setDeleteConfirmId(lead.id)}
                        className="hover:text-rose-400 hover:border-rose-500/30 text-neutral-400"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={displayLeads.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[10, 25, 50, 100]}
      />
    </Card>

      {/* Delete Confirmation Modal using shadcn Dialog */}
      <Dialog open={Boolean(deleteConfirmId)} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Justdial Lead?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The lead record will be permanently removed from the Supabase database.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteConfirmId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  {selectedLead.leadtype && (
                    <Badge variant="outline" className="text-[10px] uppercase text-neutral-400 border-neutral-700">
                      {selectedLead.leadtype}
                    </Badge>
                  )}
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
                  <Select
                    value={(selectedLead.status || 'new').toLowerCase()}
                    onValueChange={(val) => handleStatusChange(selectedLead.id, val)}
                  >
                    <SelectTrigger className="h-8 text-xs w-[130px] bg-neutral-800 border-neutral-700">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Data Grid: Complete Justdial Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Field 1: Campaign Channel & Type */}
                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                    Campaign Channel &amp; Type
                  </span>
                  <div className="text-neutral-200 font-semibold capitalize">{selectedLead.leadtype || 'Standard Lead'}</div>
                  <div className="text-neutral-400 text-[11px] mt-0.5">Source: {selectedLead.source || 'Justdial'}</div>
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
                  <div className="text-neutral-200 font-medium">
                    Date: {formatLeadDate(selectedLead.leadDate || (selectedLead as any).lead_date, selectedLead.createdAt || (selectedLead as any).created_at)}
                  </div>
                  <div className="text-neutral-400 text-[11px] mt-0.5">
                    Time: {formatLeadTime(selectedLead.leadTime || (selectedLead as any).lead_time, selectedLead.createdAt || (selectedLead as any).created_at) || 'N/A'}
                  </div>
                </div>

                {/* Field 10: Ingested Timestamp */}
                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                    System Ingestion
                  </span>
                  <div className="text-neutral-200">
                    {(() => {
                      const ts = selectedLead.createdAt || (selectedLead as any).created_at;
                      if (!ts) return 'N/A';
                      try {
                        return new Date(ts).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
                      } catch {
                        return String(ts);
                      }
                    })()}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">
                    Updated:{' '}
                    {(() => {
                      const ts = selectedLead.updatedAt || (selectedLead as any).updated_at;
                      if (!ts) return 'N/A';
                      try {
                        return new Date(ts).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
                      } catch {
                        return String(ts);
                      }
                    })()}
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
