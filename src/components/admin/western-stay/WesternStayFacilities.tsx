import React, { useState } from 'react';
import { useWesternStayFacilitiesQuery } from '../../../hooks/useWesternStayQuery';
import { westernStayService } from '../../../services/westernStayService';
import {
  CheckCircle2,
  Plus,
  Edit2,
  Trash2,
  X,
  Sparkles,
  Wifi,
  Sun,
  Droplets,
  Bed,
  ShieldCheck,
  Video,
  Bike,
  BookOpen
} from 'lucide-react';
import type { WesternStayFacilityRecord } from '../../../types/database';

export function WesternStayFacilities() {
  const { data: facilities, isLoading, refetch } = useWesternStayFacilitiesQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<WesternStayFacilityRecord | null>(null);

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [iconName, setIconName] = useState('sparkles');

  const icons = [
    { label: 'Sparkles / Quality', val: 'sparkles' },
    { label: 'High-Speed Wi-Fi', val: 'wifi' },
    { label: 'Solar Hot Water', val: 'sun' },
    { label: 'RO Purified Water', val: 'droplets' },
    { label: 'Bed & Furniture', val: 'bed' },
    { label: 'CCTV Surveillance', val: 'video' },
    { label: 'Covered Bike Parking', val: 'bike' },
    { label: 'Study & Workspace', val: 'book-open' },
    { label: 'Security & Safety', val: 'shield-check' }
  ];

  const handleOpenAdd = () => {
    setEditingFacility(null);
    setTitle('');
    setDesc('');
    setIconName('sparkles');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (f: WesternStayFacilityRecord) => {
    setEditingFacility(f);
    setTitle(f.title);
    setDesc(f.description || '');
    setIconName(f.icon_name || 'sparkles');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    if (editingFacility) {
      await westernStayService.updateFacility(editingFacility.id, {
        title,
        description: desc,
        icon_name: iconName
      });
    } else {
      await westernStayService.createFacility({
        title,
        description: desc,
        icon_name: iconName,
        sort_order: (facilities?.length || 0) + 1
      });
    }

    setIsModalOpen(false);
    refetch();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete facility "${name}"?`)) {
      await westernStayService.deleteFacility(id);
      refetch();
    }
  };

  const handleToggleActive = async (f: WesternStayFacilityRecord) => {
    await westernStayService.updateFacility(f.id, {
      is_active: !f.is_active
    });
    refetch();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <CheckCircle2 className="w-6 h-6 text-[#FFCC00]" />
            Western Stay Facilities & Amenities
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Manage the list of hostel amenities and facilities displayed on the public accommodation page.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFCC00] hover:bg-[#FFE066] text-black text-xs font-bold transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Facility
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-3 py-16 text-center text-neutral-500 text-sm">
            Loading facilities...
          </div>
        ) : (
          facilities?.map((f) => (
            <div
              key={f.id}
              className={`p-5 rounded-2xl bg-neutral-900 border transition-all flex flex-col justify-between ${
                f.is_active ? 'border-neutral-800 hover:border-neutral-700' : 'border-neutral-800/40 opacity-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFCC00]/10 border border-[#FFCC00]/20 flex items-center justify-center text-[#FFCC00]">
                    <Sparkles className="w-4 h-4" />
                  </div>

                  <button
                    onClick={() => handleToggleActive(f)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      f.is_active
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                    }`}
                  >
                    {f.is_active ? 'Active' : 'Hidden'}
                  </button>
                </div>

                <h3 className="text-sm font-bold text-white">{f.title}</h3>
                <p className="text-xs text-neutral-400 mt-1">{f.description || '—'}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(f)}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(f.id, f.title)}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-white">
                {editingFacility ? 'Edit Facility' : 'Add Facility'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Facility Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar Hot Water"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 24x7 hot water supply in all attached bathrooms"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Icon Category</label>
                <select
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                >
                  {icons.map((i) => (
                    <option key={i.val} value={i.val}>
                      {i.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FFCC00] hover:bg-[#FFE066] text-black font-bold"
                >
                  Save Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
