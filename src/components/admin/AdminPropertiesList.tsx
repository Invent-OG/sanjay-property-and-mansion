import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  MapPin
} from 'lucide-react';
import { useProperties, useDeleteProperty, useSaveProperty } from '../../hooks/usePropertiesQuery';
import type { Property } from '../../types/database';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { DataTablePagination } from '../ui/pagination';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export const AdminPropertiesList: React.FC = () => {
  const { data: properties = [], isLoading } = useProperties();
  const deletePropertyMutation = useDeleteProperty();
  const savePropertyMutation = useSaveProperty();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePropertyMutation.mutateAsync(id);
      showToast('Property deleted successfully.');
      setDeleteConfirmId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete property.');
    }
  };

  const handleToggleFeatured = async (prop: Property) => {
    const updated = !prop.is_featured_homepage;
    try {
      await savePropertyMutation.mutateAsync({
        id: prop.id,
        is_featured_homepage: updated,
      });
      showToast(`Homepage featured status updated.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update property.');
    }
  };

  const filteredProperties = properties.filter((p) => {
    if (statusFilter !== 'all' && (p.status || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.short_name.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredProperties.length / pageSize) || 1;
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProperties.slice(start, start + pageSize);
  }, [filteredProperties, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-neutral-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#FFCC00]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-[#FFCC00]" />
            Properties Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Manage real estate listings, gated villa plots, and residential communities
          </p>
        </div>

        <Button asChild className="font-bold text-xs h-9">
          <a href="/admin/properties/new">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Add Property</span>
          </a>
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <Card className="bg-neutral-900/60 border-neutral-800">
        <CardContent className="p-3 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search by property name, area or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[140px] bg-neutral-900 border-neutral-700/80">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table / Cards */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-neutral-400 animate-pulse">
          Loading properties portfolio...
        </div>
      ) : filteredProperties.length === 0 ? (
        <Card className="text-center p-12 bg-neutral-900/40 border-dashed border-neutral-800">
          <CardContent className="space-y-3 p-0">
            <Building2 className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No properties found</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Try adjusting your search query or add a new property listing to get started.
            </p>
            <div className="pt-2">
              <Button asChild size="sm" className="font-bold text-xs">
                <a href="/admin/properties/new">
                  <Plus className="w-4 h-4 mr-1.5" />
                  <span>Create First Property</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden border-neutral-800 bg-neutral-900/60">
          <Table>
            <TableHeader className="bg-neutral-950/70 border-b border-neutral-800">
              <TableRow className="border-neutral-800 hover:bg-transparent">
                <TableHead className="w-[280px] text-neutral-400 font-semibold text-xs">Property</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Location</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Status</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Homepage Feature</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Starting Price</TableHead>
                <TableHead className="text-neutral-400 font-semibold text-xs">Last Updated</TableHead>
                <TableHead className="text-right text-neutral-400 font-semibold text-xs pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-neutral-800/60">
              {paginatedProperties.map((prop) => (
                <TableRow key={prop.id} className="hover:bg-neutral-800/30 transition-colors border-neutral-800/60">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg bg-neutral-950 border border-neutral-800 overflow-hidden shrink-0">
                        {prop.hero_image_url ? (
                          <img
                            src={prop.hero_image_url}
                            alt={prop.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-600">
                            <Building2 className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#FFCC00] uppercase tracking-wider block">
                          {prop.short_name}
                        </span>
                        <span className="font-bold text-xs text-white leading-tight block">
                          {prop.name}
                        </span>
                        <span className="text-[11px] text-neutral-400">/{prop.slug}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-neutral-300">
                    <div className="flex items-center gap-1.5 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span>{prop.area}, {prop.city}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        prop.status === 'active'
                          ? 'success'
                          : prop.status === 'draft'
                          ? 'warning'
                          : 'outline'
                      }
                      className="text-[10px] uppercase font-bold"
                    >
                      {prop.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Button
                      size="sm"
                      variant={prop.is_featured_homepage ? 'default' : 'outline'}
                      onClick={() => handleToggleFeatured(prop)}
                      className="h-7 text-[11px] font-semibold"
                      title="Click to toggle homepage featured status"
                    >
                      {prop.is_featured_homepage ? 'Featured' : 'Standard'}
                    </Button>
                  </TableCell>

                  <TableCell className="font-bold text-white text-xs">
                    {prop.pricing_start || '₹4,900'}
                  </TableCell>

                  <TableCell className="text-neutral-400 text-xs font-mono">
                    {new Date(prop.updated_at || prop.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="icon"
                        variant="secondary"
                        asChild
                        className="h-8 w-8"
                        title="Edit Property"
                      >
                        <a href={`/admin/properties/${prop.slug || prop.id}`}>
                          <Edit3 className="w-3.5 h-3.5" />
                        </a>
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        asChild
                        className="h-8 w-8 text-neutral-400 hover:text-[#FFCC00]"
                        title="View Public Page"
                      >
                        <a href={`/${prop.slug}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => setDeleteConfirmId(prop.id)}
                        className="h-8 w-8 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                        title="Delete Property"
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
            totalItems={filteredProperties.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[5, 10, 20]}
          />
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="max-w-md bg-neutral-900 border-neutral-800 text-white">
          <DialogHeader>
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-2">
              <AlertCircle className="w-5 h-5" />
            </div>
            <DialogTitle>Delete Property Listing?</DialogTitle>
            <DialogDescription className="text-neutral-400 text-xs">
              Are you sure you want to delete this property? This will also remove its associated accommodations, facilities, meal plans, and gallery images.
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
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
