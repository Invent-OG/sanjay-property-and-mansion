import React, { useState, useEffect } from 'react';
import {
  Save,
  Building,
  Phone,
  Globe,
  CheckCircle2,
  Shield,
} from 'lucide-react';
import { useSiteSettings, useUpdateSiteSettings } from '../../hooks/useSettingsQuery';
import { authService } from '../../services/authService';
import type { SiteSettings } from '../../types/database';

export const AdminSettings: React.FC = () => {
  const { data: serverSettings, isLoading } = useSiteSettings();
  const updateSettingsMutation = useUpdateSiteSettings();

  const [formSettings, setFormSettings] = useState<SiteSettings>({
    id: 'global',
    company_name: 'SANJAY PROPERTIES',
    project_name: 'SANJAY GARDEN',
    tagline: 'A Better Address Begins With Better Planning',
    email: 'enquiries@sanjayproperties.in',
    phone: '+91 80568 89900',
    secondary_phone: '+91 81108 89900',
    whatsapp_number: '918056889900',
    full_address: 'Sanjay Garden, PNT Colony, Saravanampatti, Coimbatore, Tamil Nadu – 641035',
    google_maps_url: 'https://maps.app.goo.gl/AJSivYbLohUfKxEA7',
    default_seo_title: 'Sanjay Properties | Sanjay Garden, Saravanampatti, Coimbatore',
    default_seo_description: 'Discover Sanjay Garden residential address and Western Stay Sanjay Mansion in Saravanampatti, Coimbatore by Sanjay Properties.',
    default_og_image: '/og-image.jpg',
    updated_at: new Date().toISOString()
  });

  const [adminUser, setAdminUser] = useState<any>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (serverSettings) {
      setFormSettings(serverSettings);
    }
    authService.getUser().then((user) => setAdminUser(user));
  }, [serverSettings]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettingsMutation.mutateAsync(formSettings);
      showToast('Settings updated successfully!');
    } catch (err: any) {
      alert('Error updating settings: ' + err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-xs text-neutral-400 animate-pulse">
        Loading site settings with TanStack Query...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e222b] text-white px-5 py-3 rounded-2xl shadow-2xl border border-neutral-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#FFCC00]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">System & Site Settings</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure global contact information, business identifiers and search engine metadata with TanStack Query
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={updateSettingsMutation.isPending}
          className="px-5 py-2.5 rounded-xl bg-[#FFCC00] hover:bg-[#e6b800] text-black font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-[#FFCC00]/15 disabled:opacity-60 cursor-pointer shrink-0"
        >
          {updateSettingsMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Business Information */}
        <div className="bg-[#14161c] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-800">
            <Building className="w-4 h-4 text-[#FFCC00]" />
            <h3 className="text-base font-bold text-white">Business Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Company / Brand Name
              </label>
              <input
                type="text"
                required
                value={formSettings.company_name}
                onChange={(e) => setFormSettings({ ...formSettings, company_name: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Flagship Project Name
              </label>
              <input
                type="text"
                required
                value={formSettings.project_name}
                onChange={(e) => setFormSettings({ ...formSettings, project_name: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Brand Tagline / Slogan
            </label>
            <input
              type="text"
              value={formSettings.tagline || ''}
              onChange={(e) => setFormSettings({ ...formSettings, tagline: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
            />
          </div>
        </div>

        {/* Section 2: Contact Numbers & Location */}
        <div className="bg-[#14161c] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-800">
            <Phone className="w-4 h-4 text-[#FFCC00]" />
            <h3 className="text-base font-bold text-white">Central Contact & Booking Numbers</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Primary Phone Number *
              </label>
              <input
                type="text"
                required
                value={formSettings.phone}
                onChange={(e) => setFormSettings({ ...formSettings, phone: e.target.value })}
                placeholder="+91 80568 89900"
                className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Secondary Phone Number
              </label>
              <input
                type="text"
                value={formSettings.secondary_phone || ''}
                onChange={(e) => setFormSettings({ ...formSettings, secondary_phone: e.target.value })}
                placeholder="+91 81108 89900"
                className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={formSettings.whatsapp_number || ''}
                onChange={(e) => setFormSettings({ ...formSettings, whatsapp_number: e.target.value })}
                placeholder="918056889900"
                className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Enquiry Email Address
              </label>
              <input
                type="email"
                required
                value={formSettings.email}
                onChange={(e) => setFormSettings({ ...formSettings, email: e.target.value })}
                placeholder="enquiries@sanjayproperties.in"
                className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Official Physical Address
            </label>
            <input
              type="text"
              value={formSettings.full_address || ''}
              onChange={(e) => setFormSettings({ ...formSettings, full_address: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Google Maps Location URL
            </label>
            <input
              type="text"
              value={formSettings.google_maps_url || ''}
              onChange={(e) => setFormSettings({ ...formSettings, google_maps_url: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
            />
          </div>
        </div>

        {/* Section 3: Default SEO Metadata */}
        <div className="bg-[#14161c] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-800">
            <Globe className="w-4 h-4 text-[#FFCC00]" />
            <h3 className="text-base font-bold text-white">Default Search Engine Metadata (SEO)</h3>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Default Site Title
            </label>
            <input
              type="text"
              value={formSettings.default_seo_title || ''}
              onChange={(e) => setFormSettings({ ...formSettings, default_seo_title: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Default Meta Description
            </label>
            <textarea
              rows={3}
              value={formSettings.default_seo_description || ''}
              onChange={(e) => setFormSettings({ ...formSettings, default_seo_description: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
            />
          </div>
        </div>

        {/* Section 4: Admin Profile */}
        <div className="bg-[#14161c] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-800">
            <Shield className="w-4 h-4 text-[#FFCC00]" />
            <h3 className="text-base font-bold text-white">Admin Account Profile</h3>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0e1014] border border-neutral-800">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-black font-bold flex items-center justify-center text-lg">
              {adminUser?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <div className="font-bold text-sm text-white">Administrator</div>
              <div className="text-xs text-neutral-400">{adminUser?.email || 'admin@sanjayproperties.in'}</div>
              <div className="text-[10px] text-emerald-400 font-semibold mt-1">Authenticated via Supabase</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
