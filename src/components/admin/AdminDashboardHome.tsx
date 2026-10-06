import React, { useState } from 'react';
import {
  Building2,
  Users,
  Bed,
  Phone,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import { useProperties } from '../../hooks/usePropertiesQuery';
import { useLeads, useLeadStats, useUpdateLeadStatus } from '../../hooks/useLeadsQuery';
import { useWesternStayStatsQuery, useWesternStayRoomsQuery } from '../../hooks/useWesternStayQuery';
import type { LeadStatus } from '../../types/database';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export const AdminDashboardHome: React.FC = () => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // TanStack Query Hooks
  const { data: properties = [] } = useProperties();
  const { data: leads = [], isLoading: isLoadingLeads } = useLeads();
  const { data: statsData } = useLeadStats();
  const { data: westernStayStats } = useWesternStayStatsQuery();
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

  const occupancyRate = westernStayStats?.occupancyRate ?? 75;
  const monthlyRevenue = westernStayStats?.currentMonthlyRevenue ?? 42300;
  const availableRoomsCount = westernStayStats?.availableRooms ?? 2;
  const totalRoomsCount = westernStayStats?.totalRooms ?? 8;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-neutral-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#FFCC00]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Executive Header Banner */}
      <Card className="relative overflow-hidden bg-neutral-900/60 border-neutral-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#FFCC00]/5 blur-3xl pointer-events-none" />
        <CardContent className="p-6 relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <Badge variant="outline" className="text-[11px] font-semibold text-[#FFCC00] border-[#FFCC00]/30 gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Unified Operations Console
            </Badge>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Enterprise Overview
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
              Monitoring real-time performance across Western Stay PG Hostel and Sanjay Properties real estate developments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button size="sm" asChild className="font-bold text-xs h-9">
              <a href="/admin/western-stay">
                <Bed className="w-3.5 h-3.5 mr-1.5" />
                <span>Hostel Rooms</span>
              </a>
            </Button>
            <Button size="sm" variant="secondary" asChild className="font-semibold text-xs h-9">
              <a href="/admin/properties">
                <Building2 className="w-3.5 h-3.5 text-[#FFCC00] mr-1.5" />
                <span>Real Estate</span>
              </a>
            </Button>
            <Button size="sm" variant="secondary" asChild className="font-semibold text-xs h-9">
              <a href="/admin/leads">
                <Users className="w-3.5 h-3.5 text-sky-400 mr-1.5" />
                <span>CRM Enquiries</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Occupancy */}
        <Card className="bg-neutral-900/60 border-neutral-800">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Hostel Occupancy
            </CardTitle>
            <span className="p-1 rounded-md bg-amber-500/10 text-[#FFCC00]">
              <Bed className="w-4 h-4" />
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-white tracking-tight">
              {occupancyRate}%
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
              <span>{availableRoomsCount} rooms available</span>
              <span className="font-mono text-neutral-500">{totalRoomsCount} Total</span>
            </div>
            <div className="mt-2 w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FFCC00] rounded-full transition-all duration-500"
                style={{ width: `${occupancyRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Monthly Rent Run-Rate */}
        <Card className="bg-neutral-900/60 border-neutral-800">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Monthly Rental Rate
            </CardTitle>
            <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-white tracking-tight">
              ₹{monthlyRevenue.toLocaleString('en-IN')}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
              <span className="text-emerald-400 font-medium">Western Stay PG</span>
              <span className="text-neutral-500 font-mono">Monthly</span>
            </div>
            <div className="mt-2 w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full w-4/5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Real Estate Portfolio */}
        <Card className="bg-neutral-900/60 border-neutral-800">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Real Estate Projects
            </CardTitle>
            <span className="p-1 rounded-md bg-sky-500/10 text-sky-400">
              <Building2 className="w-4 h-4" />
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-white tracking-tight">
              {properties.length || 1}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Sanjay Gardens</span>
              <span className="text-sky-400 font-medium">DTCP Approved</span>
            </div>
            <div className="mt-2 w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-sky-400 rounded-full w-3/4" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Inquiries CRM */}
        <Card className="bg-neutral-900/60 border-neutral-800">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Total Inquiries
            </CardTitle>
            <span className="p-1 rounded-md bg-purple-500/10 text-purple-400">
              <Users className="w-4 h-4" />
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-white tracking-tight">
              {statsData?.total ?? leads.length}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
              <span className="text-amber-400 font-medium">{statsData?.new ?? 1} New</span>
              <span className="text-neutral-500 font-mono">Real-time</span>
            </div>
            <div className="mt-2 w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-400 rounded-full w-2/3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Divisions: Western Stay & Sanjay Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Western Stay Hostel Box */}
        <Card className="bg-neutral-900/60 border-neutral-800 flex flex-col justify-between">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="warning" className="text-[10px] font-semibold uppercase tracking-wider">
                  Hospitality & PG
                </Badge>
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

              <div className="grid grid-cols-3 gap-2.5 mt-4">
                <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800">
                  <div className="text-[11px] text-neutral-400">Total Rooms</div>
                  <div className="text-lg font-bold text-white mt-0.5">{totalRoomsCount}</div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <div className="text-[11px] text-emerald-400">Available</div>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">{availableRoomsCount}</div>
                </div>
                <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800">
                  <div className="text-[11px] text-neutral-400">Occupancy</div>
                  <div className="text-lg font-bold text-[#FFCC00] mt-0.5">{occupancyRate}%</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                Run-Rate: <strong className="text-white font-medium">₹{monthlyRevenue.toLocaleString('en-IN')}/mo</strong>
              </span>
              <Button variant="ghost" size="sm" asChild className="text-[#FFCC00] hover:text-[#FFCC00] text-xs font-semibold p-0 h-auto">
                <a href="/admin/western-stay" className="inline-flex items-center gap-1">
                  <span>Manage Rooms</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sanjay Properties Box */}
        <Card className="bg-neutral-900/60 border-neutral-800 flex flex-col justify-between">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="info" className="text-[10px] font-semibold uppercase tracking-wider">
                  Real Estate Division
                </Badge>
                <span className="text-[11px] text-neutral-400 font-mono">Villa Plots & Layouts</span>
              </div>

              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-400" />
                Sanjay Properties
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Saravanampatti, Coimbatore • DTCP Approved gated villa plots & commercial lands
              </p>

              <div className="grid grid-cols-3 gap-2.5 mt-4">
                <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800">
                  <div className="text-[11px] text-neutral-400">Listed Projects</div>
                  <div className="text-lg font-bold text-white mt-0.5">{properties.length || 1}</div>
                </div>
                <div className="p-3 rounded-lg bg-sky-500/5 border border-sky-500/20">
                  <div className="text-[11px] text-sky-400">Active Layouts</div>
                  <div className="text-lg font-bold text-sky-400 mt-0.5 truncate">Sanjay Gardens</div>
                </div>
                <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800">
                  <div className="text-[11px] text-neutral-400">Buyer Leads</div>
                  <div className="text-lg font-bold text-[#FFCC00] mt-0.5">{statsData?.total ?? leads.length}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                Flagship: <strong className="text-white font-medium">Sanjay Gardens (DTCP)</strong>
              </span>
              <Button variant="ghost" size="sm" asChild className="text-[#FFCC00] hover:text-[#FFCC00] text-xs font-semibold p-0 h-auto">
                <a href="/admin/properties" className="inline-flex items-center gap-1">
                  <span>Manage Properties</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Inquiries Table */}
      <Card className="bg-neutral-900/60 border-neutral-800 overflow-hidden">
        <CardHeader className="p-4 sm:p-5 flex flex-row items-center justify-between border-b border-neutral-800 space-y-0">
          <div>
            <CardTitle className="text-sm font-bold text-white">Recent Customer Inquiries</CardTitle>
            <CardDescription className="text-xs text-neutral-400 mt-0.5">
              Prospects inquiring for hostel accommodation and property sales
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-[#FFCC00] hover:text-[#FFCC00] text-xs font-semibold">
            <a href="/admin/leads" className="inline-flex items-center gap-1">
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </Button>
        </CardHeader>

        {isLoadingLeads ? (
          <div className="py-12 text-center text-xs text-neutral-400 animate-pulse">
            Loading recent enquiries...
          </div>
        ) : recentLeads.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500">
            No customer inquiries found.
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-neutral-950/70 border-b border-neutral-800">
              <TableRow className="border-neutral-800 hover:bg-transparent">
                <TableHead className="text-neutral-400 font-semibold text-xs">Customer</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Inquiry Category</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Date</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">CRM Status</TableHead>
                <TableHead className="text-right text-neutral-400 font-semibold text-xs pr-6">Quick Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-neutral-800/60">
              {recentLeads.map((lead) => {
                const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
                const waNumber = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

                return (
                  <TableRow key={lead.id} className="hover:bg-neutral-800/30 transition-colors border-neutral-800/60">
                    <TableCell>
                      <div className="font-semibold text-white text-xs">{lead.name}</div>
                      <div className="text-[11px] text-neutral-400 font-mono mt-0.5">{lead.phone}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={lead.source.includes('Mansion') || lead.source.includes('Western') ? 'default' : 'info'}
                        className="text-[10px]"
                      >
                        {lead.source}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-neutral-400 font-mono text-[11px]">
                      {new Date(lead.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={lead.status}
                        onValueChange={(val) => handleStatusChange(lead.id, val as LeadStatus)}
                      >
                        <SelectTrigger className="h-7 text-[11px] w-[130px] bg-neutral-900 border-neutral-700/80">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Contacted">Contacted</SelectItem>
                          <SelectItem value="In Discussion">In Discussion</SelectItem>
                          <SelectItem value="Visit Scheduled">Visit Scheduled</SelectItem>
                          <SelectItem value="Converted">Converted</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
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
                              lead.name
                            )},%20thank%20you%20for%20contacting%20us%20regarding%20${encodeURIComponent(
                              lead.source
                            )}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            <span>WhatsApp</span>
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          asChild
                          className="h-7 text-[11px]"
                        >
                          <a href={`tel:${lead.phone}`}>
                            <Phone className="w-3 h-3 mr-1 text-[#FFCC00]" />
                            <span>Call</span>
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};
