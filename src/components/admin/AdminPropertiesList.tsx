import React, { useState } from 'react';
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
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
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

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e222b] text-white px-5 py-3 rounded-2xl shadow-2xl border border-neutral-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#FFCC00]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Properties Portfolio</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Manage your real estate listings, hostels, and residential communities
          </p>
        </div>

        <a
          href="/admin/properties/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFCC00] hover:bg-[#e6b800] text-neutral-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#FFCC00]/15 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ ADD PROPERTY</span>
        </a>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-[#14161c] border border-neutral-800 p-3 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by property name, area or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFCC00]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0e1014] border border-neutral-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FFCC00]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Properties Table / Cards */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-neutral-400 animate-pulse">
          Loading properties with TanStack Query...
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="py-16 text-center bg-[#14161c] border border-neutral-800 rounded-3xl p-8">
          <Building2 className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No properties found</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or add a new property to get started.
          </p>
          <a
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-[#FFCC00] text-black font-bold text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Property</span>
          </a>
        </div>
      ) : (
        <div className="bg-[#14161c] border border-neutral-800 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider font-bold bg-[#111317]">
                  <th className="py-3.5 pl-5">Property</th>
                  <th className="py-3.5">Location</th>
                  <th className="py-3.5">Status</th>
                  <th className="py-3.5">Featured on Home</th>
                  <th className="py-3.5">Starting Price</th>
                  <th className="py-3.5">Last Updated</th>
                  <th className="py-3.5 text-right pr-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredProperties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-4 pl-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-700/80 overflow-hidden shrink-0">
                          {prop.hero_image_url ? (
                            <img
                              src={prop.hero_image_url}
                              alt={prop.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-600">
                              <Building2 className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#FFCC00] uppercase tracking-wider block">
                            {prop.short_name}
                          </span>
                          <span className="font-bold text-sm text-white leading-tight block">
                            {prop.name}
                          </span>
                          <span className="text-[11px] text-neutral-400">/{prop.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 text-neutral-300">
                      <div className="flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span>{prop.area}, {prop.city}</span>
                      </div>
                    </td>

                    <td className="py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          prop.status === 'active'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : prop.status === 'draft'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {prop.status}
                      </span>
                    </td>

                    <td className="py-4">
                      <button
                        onClick={() => handleToggleFeatured(prop)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                          prop.is_featured_homepage
                            ? 'bg-[#FFCC00]/20 text-[#FFCC00] border border-[#FFCC00]/40'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:text-white'
                        }`}
                        title="Click to toggle homepage featured status"
                      >
                        {prop.is_featured_homepage ? 'Yes (Featured)' : 'No'}
                      </button>
                    </td>

                    <td className="py-4 font-bold text-white">
                      {prop.pricing_start || '₹4,900'}
                    </td>

                    <td className="py-4 text-neutral-400">
                      {new Date(prop.updated_at || prop.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="py-4 text-right pr-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/admin/properties/${prop.id}`}
                          className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white transition-colors cursor-pointer"
                          title="Edit Property"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`/${prop.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-[#FFCC00] transition-colors cursor-pointer"
                          title="View Public Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => setDeleteConfirmId(prop.id)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                          title="Delete Property"
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#171a22] border border-neutral-700 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Delete Property?</h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Are you sure you want to delete this property? This will also remove its associated accommodations, facilities, meal plans, and gallery images.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-600/20 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
