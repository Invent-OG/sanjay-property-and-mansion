import React, { useState, useEffect } from 'react';
import {
  useWesternStaySettingsQuery,
  useUpdateWesternStaySettings
} from '../../../hooks/useWesternStayQuery';
import {
  Settings,
  Building2,
  Phone,
  Mail,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import type { WesternStaySettingsRecord } from '../../../types/database';

export function WesternStaySettings() {
  const { data: settings, isLoading } = useWesternStaySettingsQuery();
  const updateSettings = useUpdateWesternStaySettings();

  const [form, setForm] = useState<Partial<WesternStaySettingsRecord>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await updateSettings.mutateAsync(form);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-[#FFCC00]" />
            Western Stay Hostel Settings
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Update hostel contact phone numbers, reception details, address, and Google Maps embed location.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
            Changes Saved Successfully!
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-neutral-500 text-sm">
          Loading hostel settings...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Identity */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#FFCC00]" />
              Hostel Identity & Tagline
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Business Title</label>
                <input
                  type="text"
                  value={form.business_name || ''}
                  onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-[#FFCC00]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Tagline</label>
                <input
                  type="text"
                  value={form.tagline || ''}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-[#FFCC00]"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Overview Description</label>
              <textarea
                rows={3}
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-[#FFCC00]"
              />
            </div>
          </div>

          {/* Contact Numbers */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#FFCC00]" />
              Reception & Booking Phone Numbers
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Primary Calling Phone</label>
                <input
                  type="text"
                  value={form.primary_phone || ''}
                  onChange={(e) => setForm({ ...form, primary_phone: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Secondary Support Phone</label>
                <input
                  type="text"
                  value={form.secondary_phone || ''}
                  onChange={(e) => setForm({ ...form, secondary_phone: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">WhatsApp Booking Number</label>
                <input
                  type="text"
                  value={form.whatsapp_number || ''}
                  onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Official Email</label>
              <input
                type="email"
                value={form.email || ''}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          {/* Location & Maps */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FFCC00]" />
              Address & Google Maps
            </h2>

            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Full Physical Address</label>
              <input
                type="text"
                value={form.full_address || ''}
                onChange={(e) => setForm({ ...form, full_address: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Google Maps URL</label>
                <input
                  type="url"
                  value={form.google_maps_url || ''}
                  onChange={(e) => setForm({ ...form, google_maps_url: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Google Maps Embed URL</label>
                <input
                  type="url"
                  value={form.embed_map_url || ''}
                  onChange={(e) => setForm({ ...form, embed_map_url: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updateSettings.isPending}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FFCC00] hover:bg-[#FFE066] text-black text-xs font-bold transition-all shadow-md"
            >
              <Save className="w-4 h-4" />
              {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
