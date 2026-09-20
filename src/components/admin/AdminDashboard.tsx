import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Building2,
  Home as HomeIcon,
  Calendar,
  Search,
  Plus,
  Download,
  Filter,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Trash2,
  Edit3,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  RotateCcw,
  Sparkles,
  Layers,
  Check,
  X,
  MapPin,
  Bed,
  Utensils,
  Tag,
  ShieldCheck,
  PieChart,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from '../BrandLogo';
import {
  leadStore,
  type Lead,
  type LeadSource,
  type LeadStatus,
  type LeadType
} from '../../services/leadStore';

export function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'properties' | 'mansion' | 'visits' | 'analytics'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  // Modal / Drawer States
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Lead Form State
  const [manualLead, setManualLead] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'Sanjay Properties' as LeadSource,
    type: 'Plot Dimensions & Availability',
    status: 'New' as LeadStatus,
    targetProperty: 'Sanjay Garden, Saravanampatti',
    message: '',
    preferredDate: '',
    timeSlot: 'Morning (10:00 AM - 1:00 PM)',
    roomType: 'Single Room (Deluxe)',
    mealPlan: 'Veg Plan (Monthly)',
    budget: ''
  });

  // Load leads on mount and listen to store updates
  useEffect(() => {
    setLeads(leadStore.getLeads());
    const unsubscribe = leadStore.subscribe(() => {
      setLeads(leadStore.getLeads());
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Status badge styling helper
  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case 'Contacted':
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
      case 'In Discussion':
        return 'bg-purple-500/15 text-purple-400 border border-purple-500/30';
      case 'Visit Scheduled':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'Converted':
        return 'bg-[#FFCC00]/20 text-[#FFCC00] border border-[#FFCC00]/40 font-bold';
      case 'Lost':
        return 'bg-rose-500/15 text-rose-400 border border-rose-500/30';
      default:
        return 'bg-neutral-800 text-neutral-300 border border-neutral-700';
    }
  };

  // Source badge helper
  const getSourceBadge = (source: LeadSource) => {
    if (source === 'Sanjay Properties') {
      return 'bg-amber-400/10 text-[#FFCC00] border border-[#FFCC00]/30';
    }
    return 'bg-indigo-400/10 text-indigo-300 border border-indigo-400/30';
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    const total = leads.length;
    const properties = leads.filter((l) => l.source === 'Sanjay Properties').length;
    const mansion = leads.filter((l) => l.source === 'Sanjay Mansion').length;
    const newCount = leads.filter((l) => l.status === 'New').length;
    const visits = leads.filter((l) => l.status === 'Visit Scheduled' || l.type === 'Site Visit Request').length;
    const converted = leads.filter((l) => l.status === 'Converted').length;
    const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;

    return { total, properties, mansion, newCount, visits, converted, conversionRate };
  }, [leads]);

  // Filtered & Sorted Leads
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        // Tab constraint
        if (activeTab === 'properties' && lead.source !== 'Sanjay Properties') return false;
        if (activeTab === 'mansion' && lead.source !== 'Sanjay Mansion') return false;
        if (activeTab === 'visits' && lead.status !== 'Visit Scheduled' && lead.type !== 'Site Visit Request') {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = lead.name.toLowerCase().includes(q);
          const matchPhone = lead.phone.toLowerCase().includes(q);
          const matchEmail = (lead.email || '').toLowerCase().includes(q);
          const matchId = lead.id.toLowerCase().includes(q);
          const matchMsg = (lead.details.message || '').toLowerCase().includes(q);
          const matchType = (lead.type || '').toLowerCase().includes(q);
          if (!matchName && !matchPhone && !matchEmail && !matchId && !matchMsg && !matchType) {
            return false;
          }
        }

        // Status filter
        if (statusFilter !== 'all' && lead.status !== statusFilter) return false;

        // Source filter
        if (sourceFilter !== 'all' && lead.source !== sourceFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [leads, activeTab, searchQuery, statusFilter, sourceFilter, sortBy]);

  // Handle status update
  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    const updated = leadStore.updateLead(leadId, { status: newStatus });
    if (updated) {
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(updated);
      }
      showToast(`Lead ${leadId} updated to "${newStatus}"`);
    }
  };

  // Handle add note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;

    const updated = leadStore.addNote(selectedLead.id, newNoteText.trim(), 'Admin');
    if (updated) {
      setSelectedLead(updated);
      setNewNoteText('');
      showToast('Internal note recorded.');
    }
  };

  // Handle delete lead
  const handleDeleteLead = (leadId: string) => {
    if (confirm(`Are you sure you want to delete lead ${leadId}?`)) {
      leadStore.deleteLead(leadId);
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(null);
      }
      showToast(`Lead ${leadId} removed.`);
    }
  };

  // Handle manual lead submit
  const handleManualLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualLead.name || !manualLead.phone) return;

    leadStore.saveLead({
      name: manualLead.name,
      phone: manualLead.phone,
      email: manualLead.email || undefined,
      source: manualLead.source,
      type: manualLead.type,
      status: manualLead.status,
      details: {
        targetProperty: manualLead.targetProperty,
        message: manualLead.message,
        preferredDate: manualLead.preferredDate || undefined,
        timeSlot: manualLead.timeSlot,
        roomType: manualLead.source === 'Sanjay Mansion' ? manualLead.roomType : undefined,
        mealPlan: manualLead.source === 'Sanjay Mansion' ? manualLead.mealPlan : undefined,
        budget: manualLead.budget || undefined
      }
    });

    setIsAddModalOpen(false);
    showToast('New lead added successfully.');
    setManualLead({
      name: '',
      phone: '',
      email: '',
      source: 'Sanjay Properties',
      type: 'Plot Dimensions & Availability',
      status: 'New',
      targetProperty: 'Sanjay Garden, Saravanampatti',
      message: '',
      preferredDate: '',
      timeSlot: 'Morning (10:00 AM - 1:00 PM)',
      roomType: 'Single Room (Deluxe)',
      mealPlan: 'Veg Plan (Monthly)',
      budget: ''
    });
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] text-neutral-100 flex flex-col font-sans selection:bg-[#FFCC00] selection:text-black">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-[#FFCC00] text-black font-extrabold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs sm:text-sm animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOP ADMIN HEADER BAR                                                     */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 bg-[#12161f]/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Brand & Admin Badge */}
          <div className="flex items-center gap-3">
            <BrandLogo variant="white" size="sm" layout="horizontal" />
            <div className="h-6 w-px bg-neutral-700 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFCC00]/20 text-[#FFCC00] border border-[#FFCC00]/30 text-[11px] font-black tracking-wider uppercase">
                ADMIN CRM
              </span>
              <span className="text-xs text-neutral-400 hidden md:inline">
                Lead Command Center
              </span>
            </div>
          </div>

          {/* Quick Search & Actions */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Search */}
            <div className="relative w-48 sm:w-64">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads, phone, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-700 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#FFCC00]"
              />
            </div>

            {/* Add Lead Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-1.5 rounded-full bg-[#FFCC00] text-black text-xs font-extrabold flex items-center gap-1.5 hover:bg-white active:scale-95 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Lead</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={() => {
                leadStore.exportCSV(filteredLeads);
                showToast(`Exported ${filteredLeads.length} leads to CSV.`);
              }}
              className="px-3.5 py-1.5 rounded-full bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-bold hover:bg-neutral-700 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* Live Website Navigation links */}
            <div className="flex items-center gap-1 pl-2 border-l border-neutral-700">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                title="View Sanjay Properties Website"
                className="p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 transition-colors text-xs flex items-center gap-1"
              >
                <HomeIcon className="w-3.5 h-3.5 text-[#FFCC00]" />
                <span className="hidden lg:inline text-[11px] font-semibold">Properties</span>
              </a>
              <a
                href="/sanjay-mansion"
                target="_blank"
                rel="noopener noreferrer"
                title="View Sanjay Mansion Website"
                className="p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 transition-colors text-xs flex items-center gap-1"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden lg:inline text-[11px] font-semibold">Mansion</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER                                                           */}
      {/* ========================================================================= */}
      <main className="max-w-[1500px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col gap-6">
        {/* ======================================================================= */}
        {/* 1. METRICS OVERVIEW STRIP                                              */}
        {/* ======================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {/* Total Leads */}
          <div className="p-4 rounded-2xl bg-[#141822] border border-neutral-800 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Leads</span>
              <Users className="w-4 h-4 text-[#FFCC00]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">{metrics.total}</span>
              <span className="text-[10px] text-neutral-500 font-medium">pipeline</span>
            </div>
          </div>

          {/* Sanjay Properties */}
          <div
            onClick={() => setActiveTab('properties')}
            className={`p-4 rounded-2xl bg-[#141822] border cursor-pointer transition-all ${
              activeTab === 'properties' ? 'border-[#FFCC00] ring-1 ring-[#FFCC00]/50' : 'border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFCC00]">Properties</span>
              <HomeIcon className="w-4 h-4 text-[#FFCC00]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">{metrics.properties}</span>
              <span className="text-[10px] text-neutral-500 font-medium">
                {metrics.total > 0 ? `${Math.round((metrics.properties / metrics.total) * 100)}%` : '0%'}
              </span>
            </div>
          </div>

          {/* Sanjay Mansion */}
          <div
            onClick={() => setActiveTab('mansion')}
            className={`p-4 rounded-2xl bg-[#141822] border cursor-pointer transition-all ${
              activeTab === 'mansion' ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Mansion</span>
              <Building2 className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">{metrics.mansion}</span>
              <span className="text-[10px] text-neutral-500 font-medium">
                {metrics.total > 0 ? `${Math.round((metrics.mansion / metrics.total) * 100)}%` : '0%'}
              </span>
            </div>
          </div>

          {/* New / Action Required */}
          <div className="p-4 rounded-2xl bg-[#141822] border border-amber-500/30 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">New Leads</span>
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-400">{metrics.newCount}</span>
              <span className="text-[10px] text-neutral-500 font-medium">uncontacted</span>
            </div>
          </div>

          {/* Scheduled Visits */}
          <div
            onClick={() => setActiveTab('visits')}
            className={`p-4 rounded-2xl bg-[#141822] border cursor-pointer transition-all ${
              activeTab === 'visits' ? 'border-emerald-500 ring-1 ring-emerald-500/50' : 'border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Site Visits</span>
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">{metrics.visits}</span>
              <span className="text-[10px] text-neutral-500 font-medium">scheduled</span>
            </div>
          </div>

          {/* Converted Leads */}
          <div className="p-4 rounded-2xl bg-[#141822] border border-neutral-800 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Conversion</span>
              <TrendingUp className="w-4 h-4 text-[#FFCC00]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-[#FFCC00]">{metrics.conversionRate}%</span>
              <span className="text-[10px] text-neutral-500 font-medium">({metrics.converted} won)</span>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 2. SECTION TABS & FILTER TOOLBAR                                       */}
        {/* ======================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#141822] p-3 sm:p-4 rounded-2xl border border-neutral-800">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setActiveTab('all');
                setSourceFilter('all');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'bg-[#FFCC00] text-black shadow-md'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Leads ({leads.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('properties');
                setSourceFilter('Sanjay Properties');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'properties'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <HomeIcon className="w-3.5 h-3.5" />
              <span>Sanjay Properties ({metrics.properties})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('mansion');
                setSourceFilter('Sanjay Mansion');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'mansion'
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Sanjay Mansion ({metrics.mansion})</span>
            </button>

            <button
              onClick={() => setActiveTab('visits')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'visits'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Site Visits ({metrics.visits})</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'analytics'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>
          </div>

          {/* Filters & Sorting */}
          {activeTab !== 'analytics' && (
            <div className="flex items-center flex-wrap gap-2.5">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#FFCC00]"
              >
                <option value="all">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In Discussion">In Discussion</option>
                <option value="Visit Scheduled">Visit Scheduled</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>

              {/* Sort Filter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#FFCC00]"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="name">Sort: Customer Name</option>
              </select>

              {/* Reset Data Shortcut */}
              <button
                onClick={() => {
                  if (confirm('Reset lead store to sample seed data?')) {
                    leadStore.resetSampleData();
                    showToast('Demo leads re-seeded.');
                  }
                }}
                title="Reset / Seed demo data"
                className="p-2 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors text-xs flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* ======================================================================= */}
        {/* 3. MAIN CONTENT: LEADS LIST OR ANALYTICS                               */}
        {/* ======================================================================= */}
        {activeTab === 'analytics' ? (
          /* ANALYTICS VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Source Breakdown */}
            <div className="p-6 rounded-2xl bg-[#141822] border border-neutral-800">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#FFCC00]" />
                <span>Lead Source Distribution</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-[#FFCC00]">Sanjay Properties (Sanjay Garden)</span>
                    <span className="text-neutral-300">
                      {metrics.properties} leads ({metrics.total > 0 ? Math.round((metrics.properties / metrics.total) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-neutral-900 overflow-hidden">
                    <div
                      className="h-full bg-[#FFCC00]"
                      style={{ width: `${metrics.total > 0 ? (metrics.properties / metrics.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-indigo-400">Sanjay Mansion (Western Stay)</span>
                    <span className="text-neutral-300">
                      {metrics.mansion} leads ({metrics.total > 0 ? Math.round((metrics.mansion / metrics.total) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-neutral-900 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500"
                      style={{ width: `${metrics.total > 0 ? (metrics.mansion / metrics.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-800 text-xs text-neutral-400 leading-relaxed">
                Both sources route instantly into this centralized dashboard. Inquiries made via web forms or phone bookings are logged with real-time notifications.
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="p-6 rounded-2xl bg-[#141822] border border-neutral-800">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Pipeline Status Breakdown</span>
              </h3>
              <div className="space-y-3">
                {(['New', 'Contacted', 'In Discussion', 'Visit Scheduled', 'Converted', 'Lost'] as LeadStatus[]).map((st) => {
                  const count = leads.filter((l) => l.status === st).length;
                  const pct = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
                  return (
                    <div key={st} className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getStatusBadge(st)}`}>
                        {st}
                      </span>
                      <span className="text-xs font-bold text-neutral-200">
                        {count} leads <span className="text-neutral-500 font-normal">({pct}%)</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions & Contact Summary */}
            <div className="p-6 rounded-2xl bg-[#141822] border border-neutral-800 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#FFCC00]" />
                  <span>Administrative Controls</span>
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                  Manage communications, export full lead sheets to Excel / CSV, and update follow-up notes for team sync.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => leadStore.exportCSV(leads)}
                    className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold flex items-center justify-between transition-colors"
                  >
                    <span>Download Complete CRM Export (.CSV)</span>
                    <Download className="w-4 h-4 text-[#FFCC00]" />
                  </button>

                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#FFCC00] hover:bg-white text-black text-xs font-extrabold flex items-center justify-between transition-colors shadow-sm"
                  >
                    <span>Add Offline / Phone Call Lead</span>
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800 text-[11px] text-neutral-500">
                Data persists in local client cache with auto synchronization.
              </div>
            </div>
          </div>
        ) : (
          /* LEADS DATA TABLE & CARDS */
          <div className="bg-[#141822] rounded-2xl border border-neutral-800 overflow-hidden shadow-xl flex flex-col">
            {/* Header info */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <span className="font-semibold">
                Showing <strong className="text-white">{filteredLeads.length}</strong> of {leads.length} recorded leads
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#FFCC00] hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>

            {filteredLeads.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center">
                <Users className="w-12 h-12 text-neutral-600 mb-3" />
                <h4 className="text-base font-bold text-neutral-300">No leads found</h4>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm">
                  {searchQuery
                    ? `No leads match "${searchQuery}". Try clearing filters or search terms.`
                    : 'No leads currently in this category. New web enquiries will appear here automatically.'}
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-4 px-4 py-2 rounded-full bg-[#FFCC00] text-black text-xs font-bold hover:bg-white transition-all"
                >
                  + Add First Lead
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-400 bg-neutral-900/60">
                      <th className="py-3.5 px-4 font-bold">Lead ID &amp; Source</th>
                      <th className="py-3.5 px-4 font-bold">Customer Details</th>
                      <th className="py-3.5 px-4 font-bold">Enquiry Type / Property</th>
                      <th className="py-3.5 px-4 font-bold">Key Specifications</th>
                      <th className="py-3.5 px-4 font-bold">Status</th>
                      <th className="py-3.5 px-4 font-bold">Created</th>
                      <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 text-xs">
                    {filteredLeads.map((lead) => {
                      const isMansion = lead.source === 'Sanjay Mansion';
                      const cleanPhone = lead.phone.replace(/[^0-9]/g, '');

                      return (
                        <tr
                          key={lead.id}
                          className="hover:bg-neutral-800/40 transition-colors group cursor-pointer"
                          onClick={() => setSelectedLead(lead)}
                        >
                          {/* 1. ID & Source */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1.5 items-start">
                              <span className="font-mono font-bold text-neutral-300 text-xs">
                                {lead.id}
                              </span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 ${getSourceBadge(
                                  lead.source
                                )}`}
                              >
                                {isMansion ? (
                                  <Building2 className="w-3 h-3" />
                                ) : (
                                  <HomeIcon className="w-3 h-3" />
                                )}
                                <span>{lead.source}</span>
                              </span>
                            </div>
                          </td>

                          {/* 2. Customer Details */}
                          <td className="py-4 px-4">
                            <div>
                              <h4 className="font-bold text-sm text-white group-hover:text-[#FFCC00] transition-colors">
                                {lead.name}
                              </h4>
                              <div className="flex items-center gap-3 mt-1 text-neutral-400 text-xs">
                                <a
                                  href={`tel:${lead.phone}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="hover:text-white flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3 text-neutral-500" />
                                  <span>{lead.phone}</span>
                                </a>
                                {lead.email && (
                                  <a
                                    href={`mailto:${lead.email}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="hover:text-white flex items-center gap-1 hidden sm:flex"
                                  >
                                    <Mail className="w-3 h-3 text-neutral-500" />
                                    <span>{lead.email}</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* 3. Type & Property */}
                          <td className="py-4 px-4">
                            <div>
                              <span className="font-semibold text-neutral-200 block">
                                {lead.type}
                              </span>
                              <span className="text-[11px] text-neutral-400 mt-0.5 block">
                                {lead.details.targetProperty || (isMansion ? 'Western Stay' : 'Sanjay Garden')}
                              </span>
                            </div>
                          </td>

                          {/* 4. Specifications (Room, Visit date, budget, etc.) */}
                          <td className="py-4 px-4 max-w-xs">
                            <div className="space-y-1 text-[11px]">
                              {lead.details.preferredDate && (
                                <div className="text-emerald-400 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>
                                    {lead.details.preferredDate} {lead.details.timeSlot ? `(${lead.details.timeSlot})` : ''}
                                  </span>
                                </div>
                              )}
                              {lead.details.roomType && (
                                <div className="text-indigo-300 flex items-center gap-1">
                                  <Bed className="w-3 h-3" />
                                  <span>{lead.details.roomType}</span>
                                </div>
                              )}
                              {lead.details.mealPlan && (
                                <div className="text-neutral-400 flex items-center gap-1">
                                  <Utensils className="w-3 h-3" />
                                  <span>{lead.details.mealPlan}</span>
                                </div>
                              )}
                              {lead.details.budget && (
                                <div className="text-[#FFCC00] font-semibold">
                                  Budget: {lead.details.budget}
                                </div>
                              )}
                              {lead.details.message && !lead.details.roomType && !lead.details.preferredDate && (
                                <p className="text-neutral-400 line-clamp-1 italic">
                                  &ldquo;{lead.details.message}&rdquo;
                                </p>
                              )}
                            </div>
                          </td>

                          {/* 5. Status Selector */}
                          <td className="py-4 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                              className={`text-[11px] font-bold rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer ${getStatusBadge(
                                lead.status
                              )}`}
                            >
                              <option value="New" className="bg-neutral-900 text-amber-400">New</option>
                              <option value="Contacted" className="bg-neutral-900 text-blue-400">Contacted</option>
                              <option value="In Discussion" className="bg-neutral-900 text-purple-400">In Discussion</option>
                              <option value="Visit Scheduled" className="bg-neutral-900 text-emerald-400">Visit Scheduled</option>
                              <option value="Converted" className="bg-neutral-900 text-[#FFCC00]">Converted</option>
                              <option value="Lost" className="bg-neutral-900 text-rose-400">Lost</option>
                            </select>
                          </td>

                          {/* 6. Created Time */}
                          <td className="py-4 px-4 whitespace-nowrap text-neutral-500 text-[11px]">
                            {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>

                          {/* 7. Action Shortcuts */}
                          <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              {/* WhatsApp Direct */}
                              <a
                                href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(
                                  lead.name
                                )},%20regarding%20your%20enquiry%20with%20${encodeURIComponent(lead.source)}:`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="WhatsApp Customer"
                                className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>

                              {/* Phone Direct */}
                              <a
                                href={`tel:${lead.phone}`}
                                title="Call Customer"
                                className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>

                              {/* Details */}
                              <button
                                onClick={() => setSelectedLead(lead)}
                                title="View Lead Details"
                                className="p-2 rounded-lg bg-[#FFCC00]/10 hover:bg-[#FFCC00]/20 text-[#FFCC00] transition-colors"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                title="Delete Lead"
                                className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 4. LEAD DETAIL DRAWER / MODAL                                            */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="w-full max-w-2xl bg-[#141822] rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Drawer Header */}
              <div className="p-5 sm:p-6 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                      selectedLead.source === 'Sanjay Properties'
                        ? 'bg-[#FFCC00] text-black'
                        : 'bg-indigo-500 text-white'
                    }`}
                  >
                    {selectedLead.source === 'Sanjay Properties' ? <HomeIcon className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{selectedLead.name}</h3>
                      <span className="text-xs font-mono text-neutral-400">({selectedLead.id})</span>
                    </div>
                    <span className="text-xs text-[#FFCC00] font-semibold">{selectedLead.source}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedLead(null)}
                  className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
                {/* Status & Quick Contact Strip */}
                <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Lead Pipeline Stage
                    </label>
                    <select
                      value={selectedLead.status}
                      onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as LeadStatus)}
                      className={`text-xs font-extrabold rounded-xl px-3 py-1.5 focus:outline-none ${getStatusBadge(
                        selectedLead.status
                      )}`}
                    >
                      <option value="New" className="bg-neutral-900 text-amber-400">New</option>
                      <option value="Contacted" className="bg-neutral-900 text-blue-400">Contacted</option>
                      <option value="In Discussion" className="bg-neutral-900 text-purple-400">In Discussion</option>
                      <option value="Visit Scheduled" className="bg-neutral-900 text-emerald-400">Visit Scheduled</option>
                      <option value="Converted" className="bg-neutral-900 text-[#FFCC00]">Converted</option>
                      <option value="Lost" className="bg-neutral-900 text-rose-400">Lost</option>
                    </select>
                  </div>

                  {/* Direct Contact Actions */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                        selectedLead.name
                      )},%20greeting%20from%20${encodeURIComponent(selectedLead.source)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 text-black font-extrabold text-xs flex items-center gap-1.5 hover:bg-emerald-400 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors border border-neutral-700"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#FFCC00]" />
                      <span>Call Desk</span>
                    </a>
                  </div>
                </div>

                {/* Lead Specifications Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                      Phone Number
                    </span>
                    <p className="text-sm font-bold text-white">{selectedLead.phone}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                      Email Address
                    </span>
                    <p className="text-sm font-bold text-white">{selectedLead.email || 'Not provided'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                      Enquiry Category
                    </span>
                    <p className="text-sm font-bold text-[#FFCC00]">{selectedLead.type}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                      Target Project / Asset
                    </span>
                    <p className="text-sm font-bold text-white">{selectedLead.details.targetProperty || 'General'}</p>
                  </div>

                  {selectedLead.details.preferredDate && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 sm:col-span-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                        Scheduled Visit Time
                      </span>
                      <p className="text-sm font-bold text-emerald-300">
                        {selectedLead.details.preferredDate} {selectedLead.details.timeSlot ? `· ${selectedLead.details.timeSlot}` : ''}
                      </p>
                    </div>
                  )}

                  {selectedLead.details.roomType && (
                    <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                        Room Preference
                      </span>
                      <p className="text-sm font-bold text-indigo-200">{selectedLead.details.roomType}</p>
                    </div>
                  )}

                  {selectedLead.details.mealPlan && (
                    <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                        Meal Plan
                      </span>
                      <p className="text-sm font-bold text-indigo-200">{selectedLead.details.mealPlan}</p>
                    </div>
                  )}
                </div>

                {/* Customer Message / Requirements */}
                {selectedLead.details.message && (
                  <div className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                      Customer Requirement Payload / Notes
                    </span>
                    <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                      {selectedLead.details.message}
                    </p>
                  </div>
                )}

                {/* Internal Team Notes Timeline */}
                <div className="border-t border-neutral-800 pt-5">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-[#FFCC00]" />
                    <span>Follow-up Timeline &amp; Notes</span>
                  </h4>

                  {/* Add Note Form */}
                  <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="Add follow-up update (e.g. Sent brochure on WhatsApp)..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#FFCC00]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#FFCC00] text-black text-xs font-extrabold hover:bg-white transition-colors"
                    >
                      Add Note
                    </button>
                  </form>

                  {/* Notes Feed */}
                  <div className="space-y-2.5 max-h-48 overflow-y-auto">
                    {selectedLead.notes && selectedLead.notes.length > 0 ? (
                      selectedLead.notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs"
                        >
                          <p className="text-neutral-200">{note.text}</p>
                          <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-1.5">
                            <span>Logged by {note.author || 'Admin'}</span>
                            <span>{new Date(note.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-neutral-500 italic">No notes logged yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between shrink-0">
                <button
                  onClick={() => handleDeleteLead(selectedLead.id)}
                  className="px-3.5 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Lead</span>
                </button>

                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 5. ADD MANUAL LEAD MODAL                                                 */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="w-full max-w-xl bg-[#141822] rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Header */}
              <div className="p-5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FFCC00] text-black flex items-center justify-center font-bold">
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Record New Lead</h3>
                    <p className="text-xs text-neutral-400">Log incoming phone inquiries or walk-ins</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleManualLeadSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
                {/* Source Selector */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Lead Source Target *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setManualLead({
                          ...manualLead,
                          source: 'Sanjay Properties',
                          type: 'Plot Dimensions & Availability',
                          targetProperty: 'Sanjay Garden, Saravanampatti'
                        })
                      }
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        manualLead.source === 'Sanjay Properties'
                          ? 'bg-[#FFCC00]/20 border-[#FFCC00] text-[#FFCC00]'
                          : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:bg-neutral-800'
                      }`}
                    >
                      <HomeIcon className="w-4 h-4" />
                      <span>Sanjay Properties</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setManualLead({
                          ...manualLead,
                          source: 'Sanjay Mansion',
                          type: 'Mansion Room Booking',
                          targetProperty: 'Western Stay – Sanjay Mansion'
                        })
                      }
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        manualLead.source === 'Sanjay Mansion'
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                          : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:bg-neutral-800'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Sanjay Mansion</span>
                    </button>
                  </div>
                </div>

                {/* Customer Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={manualLead.name}
                      onChange={(e) => setManualLead({ ...manualLead, name: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-neutral-100 focus:outline-none focus:border-[#FFCC00]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 90000 00000"
                      value={manualLead.phone}
                      onChange={(e) => setManualLead({ ...manualLead, phone: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-neutral-100 focus:outline-none focus:border-[#FFCC00]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="client@email.com"
                      value={manualLead.email}
                      onChange={(e) => setManualLead({ ...manualLead, email: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-neutral-100 focus:outline-none focus:border-[#FFCC00]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Initial Status
                    </label>
                    <select
                      value={manualLead.status}
                      onChange={(e) => setManualLead({ ...manualLead, status: e.target.value as LeadStatus })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-neutral-100 focus:outline-none focus:border-[#FFCC00]"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Discussion">In Discussion</option>
                      <option value="Visit Scheduled">Visit Scheduled</option>
                      <option value="Converted">Converted</option>
                    </select>
                  </div>
                </div>

                {/* Specifics by Source */}
                {manualLead.source === 'Sanjay Mansion' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-400 mb-1">
                        Room Preference
                      </label>
                      <select
                        value={manualLead.roomType}
                        onChange={(e) => setManualLead({ ...manualLead, roomType: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-neutral-200 focus:outline-none"
                      >
                        <option value="Single Room (Deluxe)">Single Room (Deluxe)</option>
                        <option value="2 Sharing Room">2 Sharing Room</option>
                        <option value="3 Sharing Room">3 Sharing Room</option>
                        <option value="4 Sharing Room">4 Sharing Room</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-400 mb-1">
                        Meal Option
                      </label>
                      <select
                        value={manualLead.mealPlan}
                        onChange={(e) => setManualLead({ ...manualLead, mealPlan: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-neutral-200 focus:outline-none"
                      >
                        <option value="Veg Plan (Monthly)">Veg Plan (Monthly)</option>
                        <option value="Non-Veg Plan (Monthly)">Non-Veg Plan (Monthly)</option>
                        <option value="Weekly Trial Plan">Weekly Trial Plan</option>
                        <option value="No Meal Plan">No Meal Plan</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#FFCC00] mb-1">
                        Enquiry Type
                      </label>
                      <select
                        value={manualLead.type}
                        onChange={(e) => setManualLead({ ...manualLead, type: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-neutral-200 focus:outline-none"
                      >
                        <option value="Plot Dimensions & Availability">Plot Dimensions & Availability</option>
                        <option value="Pricing & Commercial Terms">Pricing & Commercial Terms</option>
                        <option value="Layout Ref: 42/2008 & Survey Documents">Layout Ref: 42/2008 & Documents</option>
                        <option value="Site Visit Request">Site Visit Request</option>
                        <option value="General Enquiry">General Enquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#FFCC00] mb-1">
                        Target Budget
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ₹40L - ₹50L"
                        value={manualLead.budget}
                        onChange={(e) => setManualLead({ ...manualLead, budget: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-neutral-200 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Requirements / Notes */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Requirement Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Specific notes, customer requirements, or remarks from phone call..."
                    value={manualLead.message}
                    onChange={(e) => setManualLead({ ...manualLead, message: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-neutral-100 focus:outline-none focus:border-[#FFCC00] resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 rounded-full border border-neutral-700 text-neutral-400 text-xs font-semibold hover:bg-neutral-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#FFCC00] text-black text-xs font-extrabold hover:bg-white transition-all shadow-md active:scale-95"
                  >
                    Save Lead to CRM
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminDashboard;
