import React, { useState } from 'react';
import {
  useWesternStayRoomTypesQuery,
  useUpdateRoomType,
  useCreateRoomType,
  useDeleteRoomType
} from '../../../hooks/useWesternStayQuery';
import {
  Building2,
  DollarSign,
  Edit2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  X,
  Users,
  Check,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';
import type { WesternStayRoomTypeRecord } from '../../../types/database';

function ensureArray(features: any): string[] {
  if (!features) return [];
  if (Array.isArray(features)) {
    return features.flatMap((item) => {
      if (typeof item === 'string' && item.trim().startsWith('[') && item.trim().endsWith(']')) {
        try {
          const parsed = JSON.parse(item);
          return Array.isArray(parsed) ? parsed : [item];
        } catch {
          return [item];
        }
      }
      return typeof item === 'string' ? [item] : [];
    });
  }
  if (typeof features === 'string') {
    try {
      const parsed = JSON.parse(features);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return features.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

export function WesternStayRoomTypes() {
  const { data: roomTypes, isLoading, refetch } = useWesternStayRoomTypesQuery();
  const updateRoomType = useUpdateRoomType();
  const createRoomType = useCreateRoomType();
  const deleteRoomType = useDeleteRoomType();

  const [editingType, setEditingType] = useState<WesternStayRoomTypeRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New room type state
  const [newName, setNewName] = useState('');
  const [newMonthlyPrice, setNewMonthlyPrice] = useState<number>(6000);
  const [newPriceDisplay, setNewPriceDisplay] = useState('₹6,000');
  const [newWeeklyPrice, setNewWeeklyPrice] = useState('₹1,800');
  const [newDailyPrice, setNewDailyPrice] = useState('₹350');
  const [newDeposit, setNewDeposit] = useState('₹5,000');
  const [newMaxOccupants, setNewMaxOccupants] = useState<number>(2);
  const [newDescription, setNewDescription] = useState('');
  const [newAcAvailable, setNewAcAvailable] = useState(false);
  const [newAcSurcharge, setNewAcSurcharge] = useState('₹1,500 / month');
  const [newFeatures, setNewFeatures] = useState<string[]>([
    'Individual Cot & Mattress',
    'Attached Bathroom with Geyser',
    'Study Table & Chair',
    'High-Speed Wi-Fi'
  ]);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [newIsRecommended, setNewIsRecommended] = useState(false);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const handleOpenEdit = (rt: WesternStayRoomTypeRecord) => {
    setEditingType({
      ...rt,
      features: ensureArray(rt.features)
    });
    setFeatureInput('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingType) return;

    try {
      const ok = await updateRoomType.mutateAsync({
        id: editingType.id,
        updates: {
          name: editingType.name,
          description: editingType.description,
          max_occupants: Number(editingType.max_occupants) || 1,
          monthly_price: Number(editingType.monthly_price),
          price_display: editingType.price_display,
          weekly_price: editingType.weekly_price,
          daily_price: editingType.daily_price,
          security_deposit: editingType.security_deposit,
          ac_available: editingType.ac_available,
          ac_surcharge: editingType.ac_surcharge,
          features: ensureArray(editingType.features),
          is_recommended: editingType.is_recommended,
          is_active: editingType.is_active
        }
      });

      if (ok) {
        showStatus('success', `Tariff for "${editingType.name}" updated successfully.`);
        setEditingType(null);
        refetch();
      } else {
        showStatus('error', 'Failed to update room type tariff.');
      }
    } catch (err: any) {
      showStatus('error', err?.message || 'Error updating room type.');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert('Please enter a room type name.');
      return;
    }

    try {
      const created = await createRoomType.mutateAsync({
        name: newName.trim(),
        monthly_price: Number(newMonthlyPrice),
        price_display: newPriceDisplay,
        weekly_price: newWeeklyPrice,
        daily_price: newDailyPrice,
        security_deposit: newDeposit,
        max_occupants: Number(newMaxOccupants),
        description: newDescription,
        ac_available: newAcAvailable,
        ac_surcharge: newAcAvailable ? newAcSurcharge : undefined,
        features: newFeatures,
        is_recommended: newIsRecommended,
        is_active: true
      });

      if (created) {
        showStatus('success', `Room type "${newName}" created successfully.`);
        setIsAddModalOpen(false);
        setNewName('');
        setNewDescription('');
        refetch();
      } else {
        showStatus('error', 'Failed to create room type.');
      }
    } catch (err: any) {
      showStatus('error', err?.message || 'Error creating room type.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      try {
        const ok = await deleteRoomType.mutateAsync(id);
        if (ok) {
          showStatus('success', `Room type "${name}" was deleted.`);
          refetch();
        } else {
          showStatus('error', 'Failed to delete room type.');
        }
      } catch (err: any) {
        showStatus('error', err?.message || 'Error deleting room type.');
      }
    }
  };

  const addEditFeature = () => {
    if (!featureInput.trim() || !editingType) return;
    setEditingType({
      ...editingType,
      features: [...ensureArray(editingType.features), featureInput.trim()]
    });
    setFeatureInput('');
  };

  const removeEditFeature = (idx: number) => {
    if (!editingType) return;
    setEditingType({
      ...editingType,
      features: ensureArray(editingType.features).filter((_, i) => i !== idx)
    });
  };

  const addNewFeature = () => {
    if (!newFeatureInput.trim()) return;
    setNewFeatures([...newFeatures, newFeatureInput.trim()]);
    setNewFeatureInput('');
  };

  const removeNewFeature = (idx: number) => {
    setNewFeatures(newFeatures.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold animate-fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-[#FFCC00]" />
            Room Types & Tariffs
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Configure baseline pricing cards, security deposits, AC options, and included amenities. Changes are instantly published on the public website.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFCC00] hover:bg-[#FFE066] text-black text-xs font-bold transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Room Type
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-16 text-center text-neutral-500 text-sm">
            Loading accommodation tariffs...
          </div>
        ) : !roomTypes || roomTypes.length === 0 ? (
          <div className="col-span-full py-16 text-center text-neutral-500 text-sm">
            No accommodation types found. Click "Add Room Type" to create one.
          </div>
        ) : (
          roomTypes.map((rt) => {
            const features = ensureArray(rt.features);
            return (
              <div
                key={rt.id}
                className={`rounded-2xl p-6 bg-neutral-900 border transition-all flex flex-col justify-between ${
                  rt.is_recommended
                    ? 'border-[#FFCC00]/50 shadow-lg shadow-[#FFCC00]/5 ring-1 ring-[#FFCC00]/20'
                    : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-xs font-semibold flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-neutral-400" />
                      Max {rt.max_occupants || 1} {rt.max_occupants === 1 ? 'Person' : 'People'}
                    </span>
                    {rt.is_recommended && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FFCC00]/10 text-[#FFCC00] text-xs font-bold border border-[#FFCC00]/30">
                        Popular Choice
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white">{rt.name}</h3>
                  <p className="text-xs text-neutral-400 mt-1 min-h-[36px] line-clamp-2">
                    {rt.description || 'Modern furnished accommodation room.'}
                  </p>

                  {/* Pricing Summary */}
                  <div className="mt-4 pt-4 border-t border-neutral-800">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-white">
                        {rt.price_display || `₹${(rt.monthly_price || 0).toLocaleString('en-IN')}`}
                      </span>
                      <span className="text-xs text-neutral-400">/ month</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-neutral-800/60 text-xs text-neutral-400">
                      <div>
                        <span className="text-neutral-500">Weekly:</span>{' '}
                        <span className="text-neutral-200 font-medium">{rt.weekly_price || '—'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">Daily:</span>{' '}
                        <span className="text-neutral-200 font-medium">{rt.daily_price || '—'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">Deposit:</span>{' '}
                        <span className="text-neutral-200 font-medium">{rt.security_deposit || '—'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">AC:</span>{' '}
                        <span className="text-neutral-200 font-medium">
                          {rt.ac_available ? 'Available' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="mt-4 pt-4 border-t border-neutral-800 space-y-1.5">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                      Included Amenities ({features.length})
                    </div>
                    {features.length === 0 ? (
                      <p className="text-xs text-neutral-500 italic">No amenities specified</p>
                    ) : (
                      features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(rt)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-800 hover:bg-[#FFCC00] text-neutral-200 hover:text-black text-xs font-bold transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Tariffs & Details
                  </button>
                  <button
                    onClick={() => handleDelete(rt.id, rt.name)}
                    className="p-2.5 rounded-xl bg-neutral-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors"
                    title="Delete Room Type"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Tariff Modal */}
      {editingType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#FFCC00]" />
                Edit {editingType.name}
              </h3>
              <button
                onClick={() => setEditingType(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Type Name *</label>
                  <input
                    type="text"
                    required
                    value={editingType.name}
                    onChange={(e) => setEditingType({ ...editingType, name: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Monthly Price Display *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹8,000"
                    value={editingType.price_display}
                    onChange={(e) => {
                      const val = e.target.value;
                      const num = Number(val.replace(/[^0-9]/g, '')) || 0;
                      setEditingType({ ...editingType, price_display: val, monthly_price: num });
                    }}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Weekly Price</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹2,200"
                    value={editingType.weekly_price || ''}
                    onChange={(e) => setEditingType({ ...editingType, weekly_price: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Daily Price</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹450"
                    value={editingType.daily_price || ''}
                    onChange={(e) => setEditingType({ ...editingType, daily_price: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Deposit</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹5,000"
                    value={editingType.security_deposit || ''}
                    onChange={(e) => setEditingType({ ...editingType, security_deposit: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Max Occupants</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editingType.max_occupants || 1}
                    onChange={(e) => setEditingType({ ...editingType, max_occupants: Number(e.target.value) })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Badge / Highlight</label>
                  <label className="flex items-center gap-2 mt-2 text-neutral-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingType.is_recommended || false}
                      onChange={(e) => setEditingType({ ...editingType, is_recommended: e.target.checked })}
                      className="rounded border-neutral-700 text-[#FFCC00] focus:ring-0"
                    />
                    <span>Highlight as Popular</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={editingType.description || ''}
                  onChange={(e) => setEditingType({ ...editingType, description: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                />
              </div>

              {/* AC Details */}
              <div className="p-3.5 rounded-xl bg-neutral-800/60 border border-neutral-700/60 space-y-2">
                <label className="flex items-center gap-2 text-neutral-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingType.ac_available || false}
                    onChange={(e) => setEditingType({ ...editingType, ac_available: e.target.checked })}
                    className="rounded border-neutral-700 text-[#FFCC00] focus:ring-0"
                  />
                  <span>Air Conditioning (AC) Available</span>
                </label>

                {editingType.ac_available && (
                  <div>
                    <label className="block text-neutral-400 mb-1">AC Surcharge / Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Available on request (₹1,500/month)"
                      value={editingType.ac_surcharge || ''}
                      onChange={(e) => setEditingType({ ...editingType, ac_surcharge: e.target.value })}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                )}
              </div>

              {/* Features Builder */}
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Included Features</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a feature (e.g. Solar Hot Water)..."
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addEditFeature();
                      }
                    }}
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                  <button
                    type="button"
                    onClick={addEditFeature}
                    className="px-3.5 py-2 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white font-semibold"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1 max-h-36 overflow-y-auto">
                  {ensureArray(editingType.features).map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => removeEditFeature(idx)}
                        className="text-neutral-500 hover:text-rose-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingType(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateRoomType.isPending}
                  className="px-5 py-2 rounded-xl bg-[#FFCC00] hover:bg-[#FFE066] text-black text-xs font-bold disabled:opacity-50"
                >
                  {updateRoomType.isPending ? 'Saving...' : 'Save Tariffs'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Room Type Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#FFCC00]" />
                Add New Accommodation Type
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Type Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3 Sharing or Studio Single"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Monthly Price Display *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹5,500"
                    value={newPriceDisplay}
                    onChange={(e) => {
                      const val = e.target.value;
                      const num = Number(val.replace(/[^0-9]/g, '')) || 0;
                      setNewPriceDisplay(val);
                      setNewMonthlyPrice(num);
                    }}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Weekly Price</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹1,800"
                    value={newWeeklyPrice}
                    onChange={(e) => setNewWeeklyPrice(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Daily Price</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹350"
                    value={newDailyPrice}
                    onChange={(e) => setNewDailyPrice(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Deposit</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹5,000"
                    value={newDeposit}
                    onChange={(e) => setNewDeposit(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Max Occupants</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newMaxOccupants}
                    onChange={(e) => setNewMaxOccupants(Number(e.target.value))}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Highlight / Popular</label>
                  <label className="flex items-center gap-2 mt-2 text-neutral-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsRecommended}
                      onChange={(e) => setNewIsRecommended(e.target.checked)}
                      className="rounded border-neutral-700 text-[#FFCC00] focus:ring-0"
                    />
                    <span>Popular Choice Badge</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the room amenities, privacy, and target occupants..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                />
              </div>

              {/* AC Details */}
              <div className="p-3.5 rounded-xl bg-neutral-800/60 border border-neutral-700/60 space-y-2">
                <label className="flex items-center gap-2 text-neutral-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAcAvailable}
                    onChange={(e) => setNewAcAvailable(e.target.checked)}
                    className="rounded border-neutral-700 text-[#FFCC00] focus:ring-0"
                  />
                  <span>Air Conditioning (AC) Available</span>
                </label>

                {newAcAvailable && (
                  <div>
                    <label className="block text-neutral-400 mb-1">AC Surcharge / Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Available on request (₹1,500/month)"
                      value={newAcSurcharge}
                      onChange={(e) => setNewAcSurcharge(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                )}
              </div>

              {/* Features Builder */}
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Included Features</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a feature (e.g. High-Speed Wi-Fi)..."
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addNewFeature();
                      }
                    }}
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                  <button
                    type="button"
                    onClick={addNewFeature}
                    className="px-3.5 py-2 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white font-semibold"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1 max-h-36 overflow-y-auto">
                  {newFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => removeNewFeature(idx)}
                        className="text-neutral-500 hover:text-rose-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createRoomType.isPending}
                  className="px-5 py-2 rounded-xl bg-[#FFCC00] hover:bg-[#FFE066] text-black text-xs font-bold disabled:opacity-50"
                >
                  {createRoomType.isPending ? 'Creating...' : 'Create Room Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
