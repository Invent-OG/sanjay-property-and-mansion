import React, { useState } from 'react';
import { useWesternStayGalleryQuery } from '../../../hooks/useWesternStayQuery';
import { westernStayService } from '../../../services/westernStayService';
import {
  Image,
  Plus,
  Trash2,
  X,
  Sparkles,
  Layers,
  Check
} from 'lucide-react';
import type { WesternStayImageRecord } from '../../../types/database';

export function WesternStayGallery() {
  const { data: gallery, isLoading, refetch } = useWesternStayGalleryQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Exterior');

  const categories = ['Exterior', 'Rooms', 'Campus', 'Dining'];

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !title) return;

    await westernStayService.uploadGalleryImage({
      url,
      title,
      category,
      sort_order: (gallery?.length || 0) + 1
    });

    setIsModalOpen(false);
    setUrl('');
    setTitle('');
    refetch();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Remove photo "${name}"?`)) {
      await westernStayService.deleteGalleryImage(id);
      refetch();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Image className="w-6 h-6 text-[#FFCC00]" />
            Hostel Photo Gallery
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Manage high-resolution property elevation, room interior, dining, and campus photos displayed on the public website.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFCC00] hover:bg-[#FFE066] text-black text-xs font-bold transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Photo
        </button>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-neutral-500 text-sm">
          Loading gallery photos...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {gallery?.map((img) => (
            <div
              key={img.id}
              className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden group hover:border-[#FFCC00]/40 transition-all flex flex-col justify-between"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-800 relative">
                <img
                  src={img.url}
                  alt={img.title || 'Hostel Photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {img.category && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white uppercase">
                    {img.category}
                  </span>
                )}
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-white truncate max-w-[140px]">
                  {img.title || 'Hostel Photo'}
                </span>

                <button
                  onClick={() => handleDelete(img.id, img.title || 'Untitled')}
                  className="p-1 rounded-lg bg-neutral-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-white">Add Gallery Photo</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Caption / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spacious 2-Sharing Bedroom"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
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
                  Add Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
