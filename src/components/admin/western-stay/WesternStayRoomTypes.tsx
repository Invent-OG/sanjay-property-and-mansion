import React, { useState } from 'react';
import {
  useWesternStayRoomTypesQuery,
  useUpdateRoomType
} from '../../../hooks/useWesternStayQuery';
import { westernStayService } from '../../../services/westernStayService';
import {
  Building2,
  DollarSign,
  Edit2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  X,
  Users,
  Check
} from 'lucide-react';
import type { WesternStayRoomTypeRecord } from '../../../types/database';

export function WesternStayRoomTypes() {
  const { data: roomTypes, isLoading, refetch } = useWesternStayRoomTypesQuery();
  const updateRoomType = useUpdateRoomType();

  const [editingType, setEditingType] = useState<WesternStayRoomTypeRecord | null>(null);
  const [featureInput, setFeatureInput] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingType) return;

    const ok = await updateRoomType.mutateAsync({
      id: editingType.id,
      updates: {
        name: editingType.name,
        description: editingType.description,
        monthly_price: Number(editingType.monthly_price),
        price_display: editingType.price_display,
        weekly_price: editingType.weekly_price,
        daily_price: editingType.daily_price,
        security_deposit: editingType.security_deposit,
        ac_available: editingType.ac_available,
        ac_surcharge: editingType.ac_surcharge,
        features: editingType.features,
        is_active: editingType.is_active
      }
    });

    if (ok) {
      setEditingType(null);
      refetch();
    }
  };

  const addFeature = () => {
    if (!featureInput.trim() || !editingType) return;
    setEditingType({
      ...editingType,
      features: [...(editingType.features || []), featureInput.trim()]
    });
    setFeatureInput('');
  };

  const removeFeature = (idx: number) => {
    if (!editingType) return;
    setEditingType({
      ...editingType,
      features: (editingType.features || []).filter((_, i) => i !== idx)
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Building2 className="w-6 h-6 text-[#FFCC00]" />
          Room Types & Tariffs
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Configure baseline pricing cards, security deposits, AC options, and features for each accommodation type. Changes are instantly published on the public website.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 py-16 text-center text-neutral-500 text-sm">
            Loading accommodation tariffs...
          </div>
        ) : (
          roomTypes?.map((rt) => (
            <div
              key={rt.id}
              className={`rounded-2xl p-6 bg-neutral-900 border transition-all flex flex-col justify-between ${
                rt.is_recommended ? 'border-[#FFCC00]/40 shadow-lg shadow-[#FFCC00]/5' : 'border-neutral-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-xs font-semibold">
                    Max {rt.max_occupants} {rt.max_occupants === 1 ? 'Person' : 'People'}
                  </span>
                  {rt.is_recommended && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFCC00]/10 text-[#FFCC00] text-xs font-bold border border-[#FFCC00]/30">
                      Popular Choice
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white">{rt.name}</h3>
                <p className="text-xs text-neutral-400 mt-1 min-h-[32px]">{rt.description}</p>

                {/* Pricing Summary */}
                <div className="mt-4 pt-4 border-t border-neutral-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">{rt.price_display}</span>
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
                    Included Amenities
                  </div>
                  {rt.features?.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-neutral-800">
                <button
                  onClick={() => setEditingType(rt)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-800 hover:bg-[#FFCC00] text-neutral-200 hover:text-black text-xs font-bold transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Tariffs & Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Tariff Modal */}
      {editingType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 my-8">
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
                  <label className="block text-neutral-400 mb-1 font-medium">Type Name</label>
                  <input
                    type="text"
                    required
                    value={editingType.name}
                    onChange={(e) => setEditingType({ ...editingType, name: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Monthly Price Display</label>
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
                    checked={editingType.ac_available}
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
                        addFeature();
                      }
                    }}
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFCC00]"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-3.5 py-2 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white font-semibold"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1 max-h-36 overflow-y-auto">
                  {editingType.features?.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
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
                  className="px-5 py-2 rounded-xl bg-[#FFCC00] hover:bg-[#FFE066] text-black text-xs font-bold"
                >
                  Save Tariffs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
