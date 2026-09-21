import React, { useState } from 'react';
import {
  useWesternStayMealPlansQuery,
  useWesternStayMenuQuery
} from '../../../hooks/useWesternStayQuery';
import { westernStayService } from '../../../services/westernStayService';
import {
  Utensils,
  Plus,
  Edit2,
  Trash2,
  X,
  Calendar,
  DollarSign,
  Coffee,
  Check
} from 'lucide-react';
import type { WesternStayMealPlanRecord, WesternStayMenuRecord, DayOfWeek } from '../../../types/database';

export function WesternStayMeals() {
  const { data: mealPlans, isLoading: plansLoading, refetch: refetchPlans } = useWesternStayMealPlansQuery();
  const { data: menu, isLoading: menuLoading, refetch: refetchMenu } = useWesternStayMenuQuery();

  const [activeTab, setActiveTab] = useState<'plans' | 'menu'>('plans');
  const [editingPlan, setEditingPlan] = useState<WesternStayMealPlanRecord | null>(null);
  const [editingMenuDay, setEditingMenuDay] = useState<WesternStayMenuRecord | null>(null);

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    await westernStayService.updateMealPlan(editingPlan.id, {
      frequency: editingPlan.frequency,
      duration_days: editingPlan.duration_days,
      price_approx: editingPlan.price_approx,
      daily_rate_approx: editingPlan.daily_rate_approx,
      description: editingPlan.description
    });

    setEditingPlan(null);
    refetchPlans();
  };

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMenuDay) return;

    await westernStayService.updateMenuDay(editingMenuDay.id, {
      breakfast: editingMenuDay.breakfast,
      lunch: editingMenuDay.lunch,
      dinner: editingMenuDay.dinner
    });

    setEditingMenuDay(null);
    refetchMenu();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Utensils className="w-6 h-6 text-[#FFCC00]" />
            Meals & Dining Plans
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Configure homestyle meal subscription rates and the 7-day weekly menu served to residents.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 rounded-lg font-bold transition-colors ${
              activeTab === 'plans' ? 'bg-[#FFCC00] text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Meal Plans & Subscriptions
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-lg font-bold transition-colors ${
              activeTab === 'menu' ? 'bg-[#FFCC00] text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            7-Day Weekly Menu
          </button>
        </div>
      </div>

      {activeTab === 'plans' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plansLoading ? (
            <div className="col-span-3 py-16 text-center text-neutral-500 text-sm">
              Loading meal plans...
            </div>
          ) : (
            mealPlans?.map((plan) => (
              <div
                key={plan.id}
                className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
                    <span className="font-semibold uppercase tracking-wider">{plan.duration_days}</span>
                    {plan.daily_rate_approx && (
                      <span className="text-emerald-400 font-medium">{plan.daily_rate_approx}</span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white">{plan.frequency}</h3>
                  <div className="text-2xl font-extrabold text-[#FFCC00] mt-2 mb-2">
                    {plan.price_approx}
                  </div>
                  <p className="text-xs text-neutral-400">{plan.description || 'Homestyle cooked food'}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-800 flex justify-end">
                  <button
                    onClick={() => setEditingPlan(plan)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Tariff
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
          {menuLoading ? (
            <div className="py-16 text-center text-neutral-500 text-sm">
              Loading weekly menu...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-800/60 text-neutral-400 uppercase tracking-wider text-[11px] font-semibold border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4 w-32">Day of Week</th>
                    <th className="py-3 px-4">Breakfast</th>
                    <th className="py-3 px-4">Lunch</th>
                    <th className="py-3 px-4">Dinner</th>
                    <th className="py-3 px-4 text-right">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-200">
                  {menu?.map((m) => (
                    <tr key={m.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="py-4 px-4 font-bold text-white text-sm">
                        {m.day_of_week}
                      </td>
                      <td className="py-4 px-4 text-neutral-300 max-w-xs">{m.breakfast}</td>
                      <td className="py-4 px-4 text-neutral-300 max-w-xs">{m.lunch}</td>
                      <td className="py-4 px-4 text-neutral-300 max-w-xs">{m.dinner}</td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setEditingMenuDay(m)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Edit Meal Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-white">Edit Meal Plan</h3>
              <button onClick={() => setEditingPlan(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Plan Name / Frequency</label>
                <input
                  type="text"
                  required
                  value={editingPlan.frequency}
                  onChange={(e) => setEditingPlan({ ...editingPlan, frequency: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Price Display</label>
                  <input
                    type="text"
                    required
                    value={editingPlan.price_approx}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price_approx: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Daily Equivalent</label>
                  <input
                    type="text"
                    value={editingPlan.daily_rate_approx || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, daily_rate_approx: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Duration</label>
                <input
                  type="text"
                  value={editingPlan.duration_days}
                  onChange={(e) => setEditingPlan({ ...editingPlan, duration_days: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={editingPlan.description || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FFCC00] hover:bg-[#FFE066] text-black font-bold"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Menu Day Modal */}
      {editingMenuDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-white">
                Edit Menu for {editingMenuDay.day_of_week}
              </h3>
              <button onClick={() => setEditingMenuDay(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMenu} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Breakfast</label>
                <textarea
                  rows={2}
                  required
                  value={editingMenuDay.breakfast}
                  onChange={(e) => setEditingMenuDay({ ...editingMenuDay, breakfast: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Lunch</label>
                <textarea
                  rows={2}
                  required
                  value={editingMenuDay.lunch}
                  onChange={(e) => setEditingMenuDay({ ...editingMenuDay, lunch: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Dinner</label>
                <textarea
                  rows={2}
                  required
                  value={editingMenuDay.dinner}
                  onChange={(e) => setEditingMenuDay({ ...editingMenuDay, dinner: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingMenuDay(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FFCC00] hover:bg-[#FFE066] text-black font-bold"
                >
                  Update Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
