import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Building2,
  FolderOpen
} from 'lucide-react';
import { mediaService } from '../../services/mediaService';
import type { PropertyImageRecord, ImageCategory } from '../../types/database';

export const AdminMediaLibrary: React.FC = () => {
  const [mediaList, setMediaList] = useState<PropertyImageRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<PropertyImageRecord | null>(null);

  const loadMedia = async () => {
    setIsLoading(true);
    try {
      const data = await mediaService.getAllMedia();
      setMediaList(data);
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Image URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await mediaService.uploadImage(
        file,
        'sanjay-mansion-uuid-101',
        'Exterior',
        file.name
      );
      if (res.error || !res.data) {
        alert(res.error || 'Failed to upload image.');
      } else {
        showToast('Image uploaded successfully to Supabase Storage!');
        loadMedia();
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (item: PropertyImageRecord) => {
    const success = await mediaService.deleteMedia(item.id, item.storage_path);
    if (success) {
      showToast('Image deleted.');
      setDeleteConfirmItem(null);
      loadMedia();
    } else {
      alert('Failed to delete image.');
    }
  };

  const filteredMedia = mediaList.filter((item) => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.alt_text && item.alt_text.toLowerCase().includes(q)) ||
        item.url.toLowerCase().includes(q)
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Media & Asset Storage</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Cloud-hosted images stored in Supabase Storage (`property-images` bucket)
          </p>
        </div>

        <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFCC00] hover:bg-[#e6b800] text-black font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#FFCC00]/15 cursor-pointer shrink-0">
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-[#14161c] border border-neutral-800 p-3.5 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, filename or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFCC00]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#0e1014] border border-neutral-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFCC00]"
        >
          <option value="all">All Categories</option>
          <option value="Exterior">Exterior</option>
          <option value="Rooms">Rooms</option>
          <option value="Interiors">Interiors</option>
          <option value="Facilities">Facilities</option>
          <option value="Campus">Campus</option>
        </select>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-neutral-400 animate-pulse">
          Loading media assets from Supabase Storage...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="py-20 text-center bg-[#14161c] border border-neutral-800 rounded-3xl p-8">
          <FolderOpen className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No media files found</h3>
          <p className="text-xs text-neutral-400 mt-1">Upload images to populate the storage bucket.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="bg-[#14161c] border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-neutral-700 transition-colors"
            >
              <div className="relative aspect-video bg-neutral-900 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title || 'Property media'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                  {item.category}
                </span>
              </div>

              <div className="p-3.5 space-y-2 text-xs">
                <div className="font-bold text-white truncate" title={item.title || 'Untitled'}>
                  {item.title || 'Property Photo'}
                </div>

                <div className="text-[10px] text-neutral-400 flex items-center justify-between">
                  <span>Western Stay</span>
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleCopyUrl(item.url, item.id)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#0e1014] hover:bg-neutral-800 text-neutral-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-neutral-700/60"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-neutral-400" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-[#0e1014] hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700/60"
                    title="Open Full Image"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => setDeleteConfirmItem(item)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    title="Delete Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#171a22] border border-neutral-700 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl">
            <h3 className="text-lg font-bold">Delete Media Asset?</h3>
            <p className="text-xs text-neutral-400 mt-2">
              Are you sure you want to delete "{deleteConfirmItem.title || 'this image'}" from storage?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-xs text-neutral-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmItem)}
                className="px-4 py-2 rounded-xl bg-rose-600 font-bold text-xs text-white"
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
