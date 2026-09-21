import React, { useState, useEffect } from 'react';
import {
  Building2,
  Save,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Bed,
  Sparkles,
  Utensils,
  MapPin,
  Globe,
  Check,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Eye,
  Info
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { propertyService } from '../../services/propertyService';
import { mediaService } from '../../services/mediaService';
import { PROPERTIES_QUERY_KEY, propertyQueryKey } from '../../hooks/usePropertiesQuery';
import type {
  PropertyRecord,
  PropertyImageRecord,
  AccommodationRecord,
  FacilityRecord,
  MealPlanRecord,
  MealSubscriptionRateRecord,
  WeeklyMenuRecord,
  FullPropertyData,
  DayOfWeek,
  PropertyStatus
} from '../../types/database';

interface AdminPropertyEditorProps {
  propertyId?: string; // If 'new' or undefined, create mode
}

type TabType =
  | 'general'
  | 'hero'
  | 'images'
  | 'accommodations'
  | 'facilities'
  | 'meals'
  | 'menu'
  | 'location'
  | 'seo';

export const AdminPropertyEditor: React.FC<AdminPropertyEditorProps> = ({ propertyId }) => {
  const queryClient = useQueryClient();
  const isNew = !propertyId || propertyId === 'new';

  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Property Form State
  const [property, setProperty] = useState<PropertyRecord>({
    id: '',
    slug: 'sanjay-mansion',
    name: 'WESTERN STAY – SANJAY MANSION',
    short_name: 'Sanjay Mansion',
    tagline: 'Your Home Away From Home',
    description: 'A peaceful and comfortable stay in Saravanampatti, Coimbatore.',
    long_description: 'Western Stay – Sanjay Mansion offers a peaceful and comfortable accommodation experience in Saravanampatti, Coimbatore.',
    address_line1: 'No. 6, Sanjay Garden',
    address_line2: 'Opp. KCT Tech Park',
    area: 'Saravanampatti',
    city: 'Coimbatore',
    pincode: '641 035',
    full_address: 'No. 6, Sanjay Garden, Opp. KCT Tech Park, Saravanampatti, Coimbatore – 641 035',
    google_maps_url: 'https://maps.app.goo.gl/AJSivYbLohUfKxEA7',
    embed_map_url: 'https://maps.google.com/maps?q=11.0827,76.9942+(Western%20Stay%20-%20Sanjay%20Mansion)&t=&z=16&ie=UTF8&iwloc=&output=embed',
    primary_phone: '8056889900',
    secondary_phone: '8110889900',
    whatsapp_number: '918056889900',
    email: 'enquiries@sanjayproperties.in',
    hero_title: 'WESTERN STAY – SANJAY MANSION',
    hero_subtitle: 'Your Home Away From Home',
    hero_description: 'A peaceful and comfortable stay in Saravanampatti, Coimbatore, with quality accommodation, modern amenities and clean surroundings.',
    hero_image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
    pricing_start: '₹4,900',
    status: 'active',
    is_featured_homepage: true,
    seo_title: 'Western Stay – Sanjay Mansion | Saravanampatti, Coimbatore',
    seo_description: 'Western Stay – Sanjay Mansion in Saravanampatti, Coimbatore offers comfortable accommodation with Wi-Fi, solar hot water, attached bathrooms, RO drinking water, laundry access, parking and 24×7 CCTV surveillance.',
    og_image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    canonical_url: 'https://sanjayproperties.in/sanjay-mansion',
    keywords: 'Sanjay Mansion, Western Stay, Hostel in Saravanampatti, PG in Coimbatore',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Relation states
  const [images, setImages] = useState<PropertyImageRecord[]>([]);
  const [accommodations, setAccommodations] = useState<AccommodationRecord[]>([]);
  const [facilities, setFacilities] = useState<FacilityRecord[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlanRecord[]>([]);
  const [mealRates, setMealRates] = useState<MealSubscriptionRateRecord[]>([]);
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenuRecord[]>([]);

  // Image upload in progress state
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        if (!isNew) {
          const fullData = await propertyService.getFullPropertyBySlug('sanjay-mansion');
          setProperty(fullData.property);
          setImages(fullData.images);
          setAccommodations(fullData.accommodations);
          setFacilities(fullData.facilities);
          setMealPlans(fullData.mealPlans);
          setMealRates(fullData.mealSubscriptionRates);
          setWeeklyMenu(fullData.weeklyMenu);
        }
      } catch (err) {
        console.error('Error loading property for editor:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [propertyId, isNew]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      if (isNew) {
        const { data, error } = await propertyService.createProperty(property);
        if (error || !data) {
          alert('Failed to create property: ' + (error || 'Unknown error'));
          setIsSaving(false);
          return;
        }
        showToast('Property created successfully!');
        window.location.href = `/admin/properties/${data.id}`;
      } else {
        const propId = property.id || 'sanjay-mansion-uuid-101';

        // 1. Update property record
        await propertyService.updateProperty(propId, property);

        // 2. Save related arrays
        await Promise.all([
          propertyService.saveAccommodations(propId, accommodations),
          propertyService.saveFacilities(propId, facilities),
          propertyService.saveMealPlans(propId, mealPlans),
          propertyService.saveMealSubscriptionRates(propId, mealRates),
          propertyService.saveWeeklyMenu(propId, weeklyMenu),
          propertyService.savePropertyImages(propId, images)
        ]);

        queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
        if (property.id) {
          queryClient.invalidateQueries({ queryKey: propertyQueryKey(property.id) });
        }
        if (property.slug) {
          queryClient.invalidateQueries({ queryKey: propertyQueryKey(property.slug) });
        }
        showToast('All changes saved successfully!');
      }
    } catch (err: any) {
      alert('Error saving property: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await mediaService.uploadImage(file, property.id || 'sanjay-mansion-uuid-101', 'Exterior', file.name);
      if (res.error || !res.data) {
        alert(res.error || 'Image upload failed');
      } else {
        setImages([...images, res.data]);
        showToast('Image uploaded and added to gallery!');
      }
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // Add new accommodation room
  const handleAddAccommodation = () => {
    const newRoom: AccommodationRecord = {
      id: 'temp-' + Date.now(),
      property_id: property.id,
      name: 'New Room Option',
      badge: '',
      price_monthly: 5000,
      price_display: '₹5,000',
      price_note: 'per month',
      features: ['Furnished Room', 'Attached Bathroom', 'Wi-Fi Access'],
      is_recommended: false,
      sort_order: accommodations.length + 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setAccommodations([...accommodations, newRoom]);
  };

  // Add new facility
  const handleAddFacility = () => {
    const newFac: FacilityRecord = {
      id: 'temp-' + Date.now(),
      property_id: property.id,
      title: 'New Facility',
      description: 'Facility description...',
      icon_name: 'sparkles',
      sort_order: facilities.length + 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setFacilities([...facilities, newFac]);
  };

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'general', label: 'General Info', icon: Building2 },
    { id: 'hero', label: 'Hero Section', icon: Sparkles },
    { id: 'images', label: 'Images & Media', icon: ImageIcon },
    { id: 'accommodations', label: 'Rooms & Pricing', icon: Bed },
    { id: 'facilities', label: 'Facilities', icon: Sparkles },
    { id: 'meals', label: 'Meal Plans', icon: Utensils },
    { id: 'menu', label: 'Weekly Menu', icon: Utensils },
    { id: 'location', label: 'Location & Contact', icon: MapPin },
    { id: 'seo', label: 'SEO & Meta', icon: Globe }
  ];

  if (isLoading) {
    return (
      <div className="py-24 text-center text-xs text-neutral-400 animate-pulse">
        Loading property editor from Supabase...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e222b] text-white px-5 py-3 rounded-2xl shadow-2xl border border-neutral-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#FFCC00]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header & Save Button Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <a
            href="/admin/properties"
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
            title="Back to Properties"
          >
            <ArrowLeft className="w-4 h-4" />
          </a>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#FFCC00] uppercase tracking-wider">
                {isNew ? 'CREATE NEW PROPERTY' : 'EDITING PROPERTY'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                {property.status}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight leading-tight">
              {property.name || 'New Property'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href={`/${property.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-colors border border-neutral-700"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#FFCC00]" />
            <span>Preview Live</span>
          </a>

          <button
            onClick={() => handleSaveAll()}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-[#FFCC00] hover:bg-[#e6b800] text-black font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-[#FFCC00]/15 disabled:opacity-60 cursor-pointer"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-neutral-800/80 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-[#FFCC00] text-neutral-950 shadow-md shadow-[#FFCC00]/10'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Panels */}
      <div className="bg-[#14161c] border border-neutral-800 rounded-3xl p-6 sm:p-8">
        {/* =========================================================================
            TAB 1: GENERAL INFO
        ========================================================================= */}
        {activeTab === 'general' && (
          <div className="space-y-6 max-w-4xl">
            <h3 className="text-base font-bold text-white mb-4">Basic Property Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Full Property Name *
                </label>
                <input
                  type="text"
                  required
                  value={property.name}
                  onChange={(e) => setProperty({ ...property, name: e.target.value })}
                  placeholder="WESTERN STAY – SANJAY MANSION"
                  className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Short Name *
                </label>
                <input
                  type="text"
                  required
                  value={property.short_name}
                  onChange={(e) => setProperty({ ...property, short_name: e.target.value })}
                  placeholder="Sanjay Mansion"
                  className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={property.slug}
                  onChange={(e) => setProperty({ ...property, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  placeholder="sanjay-mansion"
                  className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Starting Price Display
                </label>
                <input
                  type="text"
                  value={property.pricing_start || ''}
                  onChange={(e) => setProperty({ ...property, pricing_start: e.target.value })}
                  placeholder="₹4,900"
                  className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Listing Status
                </label>
                <select
                  value={property.status}
                  onChange={(e) => setProperty({ ...property, status: e.target.value as PropertyStatus })}
                  className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="draft">Draft</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Tagline
              </label>
              <input
                type="text"
                value={property.tagline || ''}
                onChange={(e) => setProperty({ ...property, tagline: e.target.value })}
                placeholder="Your Home Away From Home"
                className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Short Overview Description
              </label>
              <textarea
                rows={2}
                value={property.description || ''}
                onChange={(e) => setProperty({ ...property, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Detailed / Long Description
              </label>
              <textarea
                rows={4}
                value={property.long_description || ''}
                onChange={(e) => setProperty({ ...property, long_description: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
              />
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: HERO SECTION
        ========================================================================= */}
        {activeTab === 'hero' && (
          <div className="space-y-6 max-w-4xl">
            <h3 className="text-base font-bold text-white mb-4">Homepage & Page Hero Configuration</h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Hero Title
              </label>
              <input
                type="text"
                value={property.hero_title || ''}
                onChange={(e) => setProperty({ ...property, hero_title: e.target.value })}
                placeholder="WESTERN STAY – SANJAY MANSION"
                className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Hero Subtitle
              </label>
              <input
                type="text"
                value={property.hero_subtitle || ''}
                onChange={(e) => setProperty({ ...property, hero_subtitle: e.target.value })}
                placeholder="Your Home Away From Home"
                className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Hero Description
              </label>
              <textarea
                rows={3}
                value={property.hero_description || ''}
                onChange={(e) => setProperty({ ...property, hero_description: e.target.value })}
                placeholder="A peaceful and comfortable stay in Saravanampatti, Coimbatore."
                className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Hero Image URL
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={property.hero_image_url || ''}
                  onChange={(e) => setProperty({ ...property, hero_image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                />
              </div>

              {property.hero_image_url && (
                <div className="mt-3 w-full h-48 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800">
                  <img
                    src={property.hero_image_url}
                    alt="Hero Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: IMAGES & MEDIA GALLERY
        ========================================================================= */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">Property Media Gallery</h3>
                <p className="text-xs text-neutral-400">
                  Upload photos, set featured image, reorder, and manage alt text.
                </p>
              </div>

              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFCC00] text-black font-bold text-xs cursor-pointer hover:bg-[#e6b800] transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img, index) => (
                <div
                  key={img.id || index}
                  className="p-3.5 rounded-2xl bg-[#0e1014] border border-neutral-800 flex flex-col justify-between gap-3 group"
                >
                  <div className="relative w-full h-40 rounded-xl overflow-hidden bg-neutral-900">
                    <img src={img.url} alt={img.title || 'Image'} className="w-full h-full object-cover" />
                    {img.is_featured && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#FFCC00] text-black text-[10px] font-bold">
                        FEATURED
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs">
                    <input
                      type="text"
                      value={img.title || ''}
                      onChange={(e) => {
                        const updated = [...images];
                        updated[index].title = e.target.value;
                        setImages(updated);
                      }}
                      placeholder="Image title..."
                      className="w-full px-2.5 py-1.5 bg-[#14161c] border border-neutral-700/80 rounded-lg text-white"
                    />

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = images.map((im, i) => ({
                            ...im,
                            is_featured: i === index
                          }));
                          setImages(updated);
                          if (img.url) {
                            setProperty({ ...property, hero_image_url: img.url });
                          }
                        }}
                        className={`text-[11px] font-bold ${
                          img.is_featured ? 'text-[#FFCC00]' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {img.is_featured ? '★ Featured' : 'Set as Featured'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setImages(images.filter((_, i) => i !== index));
                        }}
                        className="text-rose-400 hover:text-rose-300 p-1"
                        title="Delete Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: ACCOMMODATION / ROOMS
        ========================================================================= */}
        {activeTab === 'accommodations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Accommodation & Room Pricing</h3>
                <p className="text-xs text-neutral-400">
                  Manage Single Occupancy, 2 Sharing, 4 Sharing, badges, and features.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddAccommodation}
                className="px-3.5 py-2 rounded-xl bg-[#FFCC00] text-black font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Room Option</span>
              </button>
            </div>

            <div className="space-y-4">
              {accommodations.map((room, index) => (
                <div
                  key={room.id || index}
                  className="p-5 rounded-2xl bg-[#0e1014] border border-neutral-800 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                          Room Name
                        </label>
                        <input
                          type="text"
                          value={room.name}
                          onChange={(e) => {
                            const upd = [...accommodations];
                            upd[index].name = e.target.value;
                            setAccommodations(upd);
                          }}
                          className="w-full px-3 py-2 bg-[#14161c] border border-neutral-700/80 rounded-xl text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                          Monthly Price Display
                        </label>
                        <input
                          type="text"
                          value={room.price_display}
                          onChange={(e) => {
                            const upd = [...accommodations];
                            upd[index].price_display = e.target.value;
                            upd[index].price_monthly = parseFloat(e.target.value.replace(/[^0-9]/g, '')) || 0;
                            setAccommodations(upd);
                          }}
                          placeholder="₹8,000"
                          className="w-full px-3 py-2 bg-[#14161c] border border-neutral-700/80 rounded-xl text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                          Badge Label
                        </label>
                        <input
                          type="text"
                          value={room.badge || ''}
                          onChange={(e) => {
                            const upd = [...accommodations];
                            upd[index].badge = e.target.value;
                            setAccommodations(upd);
                          }}
                          placeholder="Most Popular / Private & Quiet"
                          className="w-full px-3 py-2 bg-[#14161c] border border-neutral-700/80 rounded-xl text-xs text-white"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAccommodations(accommodations.filter((_, i) => i !== index))}
                      className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                      title="Remove Room"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                      Features (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={room.features.join(', ')}
                      onChange={(e) => {
                        const upd = [...accommodations];
                        upd[index].features = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                        setAccommodations(upd);
                      }}
                      className="w-full px-3 py-2 bg-[#14161c] border border-neutral-700/80 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: FACILITIES
        ========================================================================= */}
        {activeTab === 'facilities' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Facilities & Amenities</h3>
                <p className="text-xs text-neutral-400">
                  Manage amenities such as Wi-Fi, Solar Hot Water, CCTV, Washing machine, RO water.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddFacility}
                className="px-3.5 py-2 rounded-xl bg-[#FFCC00] text-black font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Facility</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {facilities.map((fac, index) => (
                <div
                  key={fac.id || index}
                  className="p-4 rounded-2xl bg-[#0e1014] border border-neutral-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={fac.title}
                      onChange={(e) => {
                        const upd = [...facilities];
                        upd[index].title = e.target.value;
                        setFacilities(upd);
                      }}
                      placeholder="Facility title"
                      className="font-bold text-sm text-white bg-[#14161c] px-3 py-1.5 rounded-lg border border-neutral-700 flex-1 mr-2"
                    />

                    <button
                      type="button"
                      onClick={() => setFacilities(facilities.filter((_, i) => i !== index))}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={fac.description || ''}
                    onChange={(e) => {
                      const upd = [...facilities];
                      upd[index].description = e.target.value;
                      setFacilities(upd);
                    }}
                    placeholder="Description of facility..."
                    className="w-full px-3 py-2 bg-[#14161c] border border-neutral-700/80 rounded-xl text-xs text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: MEALS & SUBSCRIPTIONS
        ========================================================================= */}
        {activeTab === 'meals' && (
          <div className="space-y-8 max-w-4xl">
            {/* Meal Frequency Plans */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Daily Meal Plans (1 Time, 2 Times, 3 Times)</h3>
              <div className="space-y-3">
                {mealPlans.map((m, index) => (
                  <div key={m.id || index} className="p-4 rounded-2xl bg-[#0e1014] border border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Frequency</span>
                      <input
                        type="text"
                        value={m.frequency}
                        onChange={(e) => {
                          const upd = [...mealPlans];
                          upd[index].frequency = e.target.value;
                          setMealPlans(upd);
                        }}
                        className="w-full mt-1 px-3 py-1.5 bg-[#14161c] border border-neutral-700 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Price (approx)</span>
                      <input
                        type="text"
                        value={m.price_approx}
                        onChange={(e) => {
                          const upd = [...mealPlans];
                          upd[index].price_approx = e.target.value;
                          setMealPlans(upd);
                        }}
                        className="w-full mt-1 px-3 py-1.5 bg-[#14161c] border border-neutral-700 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Description</span>
                      <input
                        type="text"
                        value={m.description || ''}
                        onChange={(e) => {
                          const upd = [...mealPlans];
                          upd[index].description = e.target.value;
                          setMealPlans(upd);
                        }}
                        className="w-full mt-1 px-3 py-1.5 bg-[#14161c] border border-neutral-700 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Veg / Non-Veg Rates */}
            <div className="space-y-4 pt-6 border-t border-neutral-800">
              <h3 className="text-base font-bold text-white">Veg & Non-Veg Subscriptions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mealRates.map((rate, index) => (
                  <div key={rate.id || index} className="p-4 rounded-2xl bg-[#0e1014] border border-neutral-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#FFCC00] uppercase tracking-wider">
                        {rate.plan_type} PLAN
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-neutral-400 block">Monthly Rate</span>
                        <input
                          type="text"
                          value={rate.monthly_price}
                          onChange={(e) => {
                            const upd = [...mealRates];
                            upd[index].monthly_price = e.target.value;
                            setMealRates(upd);
                          }}
                          placeholder="₹3,600"
                          className="w-full mt-1 px-3 py-1.5 bg-[#14161c] border border-neutral-700 rounded-lg text-xs text-white"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-neutral-400 block">Weekly Rate</span>
                        <input
                          type="text"
                          value={rate.weekly_price}
                          onChange={(e) => {
                            const upd = [...mealRates];
                            upd[index].weekly_price = e.target.value;
                            setMealRates(upd);
                          }}
                          placeholder="₹900"
                          className="w-full mt-1 px-3 py-1.5 bg-[#14161c] border border-neutral-700 rounded-lg text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: WEEKLY MENU
        ========================================================================= */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white">Day-by-Day Weekly Meal Menu</h3>

            <div className="space-y-4">
              {weeklyMenu.map((item, index) => (
                <div
                  key={item.id || index}
                  className="p-4 rounded-2xl bg-[#0e1014] border border-neutral-800 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <span className="font-bold text-sm text-[#FFCC00]">{item.day_of_week}</span>
                    <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.is_holiday}
                        onChange={(e) => {
                          const upd = [...weeklyMenu];
                          upd[index].is_holiday = e.target.checked;
                          if (e.target.checked) {
                            upd[index].breakfast = 'Holiday';
                            upd[index].lunch = 'Holiday';
                            upd[index].dinner = 'Holiday';
                          }
                          setWeeklyMenu(upd);
                        }}
                      />
                      <span>Mark as Holiday (e.g. Sunday)</span>
                    </label>
                  </div>

                  {!item.is_holiday ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-neutral-400 block mb-1">Breakfast</span>
                        <input
                          type="text"
                          value={item.breakfast}
                          onChange={(e) => {
                            const upd = [...weeklyMenu];
                            upd[index].breakfast = e.target.value;
                            setWeeklyMenu(upd);
                          }}
                          className="w-full px-3 py-2 bg-[#14161c] border border-neutral-700/80 rounded-xl text-white"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-neutral-400 block mb-1">Lunch</span>
                        <input
                          type="text"
                          value={item.lunch}
                          onChange={(e) => {
                            const upd = [...weeklyMenu];
                            upd[index].lunch = e.target.value;
                            setWeeklyMenu(upd);
                          }}
                          className="w-full px-3 py-2 bg-[#14161c] border border-neutral-700/80 rounded-xl text-white"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-neutral-400 block mb-1">Dinner</span>
                        <input
                          type="text"
                          value={item.dinner}
                          onChange={(e) => {
                            const upd = [...weeklyMenu];
                            upd[index].dinner = e.target.value;
                            setWeeklyMenu(upd);
                          }}
                          className="w-full px-3 py-2 bg-[#14161c] border border-neutral-700/80 rounded-xl text-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-neutral-900/60 rounded-xl text-xs text-neutral-400 text-center italic">
                      Mess closed / Kitchen Holiday for {item.day_of_week}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 8: LOCATION & CONTACT
        ========================================================================= */}
        {activeTab === 'location' && (
          <div className="space-y-6 max-w-4xl">
            <h3 className="text-base font-bold text-white mb-4">Location & Direct Booking Numbers</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Primary Booking Number *
                </label>
                <input
                  type="text"
                  required
                  value={property.primary_phone}
                  onChange={(e) => setProperty({ ...property, primary_phone: e.target.value })}
                  placeholder="8056889900"
                  className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Secondary Booking Number
                </label>
                <input
                  type="text"
                  value={property.secondary_phone || ''}
                  onChange={(e) => setProperty({ ...property, secondary_phone: e.target.value })}
                  placeholder="8110889900"
                  className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  WhatsApp Contact Number
                </label>
                <input
                  type="text"
                  value={property.whatsapp_number || ''}
                  onChange={(e) => setProperty({ ...property, whatsapp_number: e.target.value })}
                  placeholder="918056889900"
                  className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={property.email || ''}
                  onChange={(e) => setProperty({ ...property, email: e.target.value })}
                  placeholder="enquiries@sanjayproperties.in"
                  className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Address Line 1
              </label>
              <input
                type="text"
                value={property.address_line1}
                onChange={(e) => setProperty({ ...property, address_line1: e.target.value })}
                placeholder="No. 6, Sanjay Garden"
                className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Area / Locality
                </label>
                <input
                  type="text"
                  value={property.area}
                  onChange={(e) => setProperty({ ...property, area: e.target.value })}
                  placeholder="Saravanampatti"
                  className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={property.city}
                  onChange={(e) => setProperty({ ...property, city: e.target.value })}
                  placeholder="Coimbatore"
                  className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={property.pincode}
                  onChange={(e) => setProperty({ ...property, pincode: e.target.value })}
                  placeholder="641 035"
                  className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Google Maps URL
              </label>
              <input
                type="text"
                value={property.google_maps_url || ''}
                onChange={(e) => setProperty({ ...property, google_maps_url: e.target.value })}
                placeholder="https://maps.app.goo.gl/AJSivYbLohUfKxEA7"
                className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
              />
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 9: SEO & HOMEPAGE FEATURED
        ========================================================================= */}
        {activeTab === 'seo' && (
          <div className="space-y-6 max-w-4xl">
            <h3 className="text-base font-bold text-white mb-4">Search Engine Optimization (SEO) & Visibility</h3>

            <div className="p-4 rounded-2xl bg-[#0e1014] border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-white block">Feature on Homepage</span>
                <span className="text-xs text-neutral-400">
                  When enabled, this property appears in the featured showcase on the main homepage.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={property.is_featured_homepage}
                  onChange={(e) => setProperty({ ...property, is_featured_homepage: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFCC00]" />
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                SEO Title Tag
              </label>
              <input
                type="text"
                value={property.seo_title || ''}
                onChange={(e) => setProperty({ ...property, seo_title: e.target.value })}
                placeholder="Western Stay – Sanjay Mansion | Saravanampatti, Coimbatore"
                className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                SEO Meta Description
              </label>
              <textarea
                rows={3}
                value={property.seo_description || ''}
                onChange={(e) => setProperty({ ...property, seo_description: e.target.value })}
                placeholder="Western Stay – Sanjay Mansion in Saravanampatti, Coimbatore offers comfortable accommodation with Wi-Fi..."
                className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Keywords (Comma-separated)
              </label>
              <input
                type="text"
                value={property.keywords || ''}
                onChange={(e) => setProperty({ ...property, keywords: e.target.value })}
                placeholder="Sanjay Mansion, PG in Saravanampatti, Hostel Coimbatore"
                className="w-full px-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFCC00]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
