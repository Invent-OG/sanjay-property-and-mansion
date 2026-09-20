import React, { useState } from 'react';
import { Layers, MapPin, Compass, Image as ImageIcon, ArrowUpRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SANJAY_GARDEN_CATEGORIES, type ProjectCategory } from '../data/sanjayGarden';

interface CraftingHomesProps {
  onSelectProperty?: (title: string, image: string) => void;
}

export const CraftingHomes: React.FC<CraftingHomesProps> = ({ onSelectProperty }) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('overview');
  const [slideIndex, setSlideIndex] = useState<number>(0);

  const activeCategory: ProjectCategory =
    SANJAY_GARDEN_CATEGORIES.find((c) => c.id === activeCategoryId) || SANJAY_GARDEN_CATEGORIES[0];

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'overview':
        return <Layers className="w-4 h-4" />;
      case 'location':
        return <MapPin className="w-4 h-4" />;
      case 'layout':
        return <Compass className="w-4 h-4" />;
      case 'gallery':
        return <ImageIcon className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  const handleNextSlide = () => {
    const currentIndex = SANJAY_GARDEN_CATEGORIES.findIndex((c) => c.id === activeCategoryId);
    const nextIndex = (currentIndex + 1) % SANJAY_GARDEN_CATEGORIES.length;
    setActiveCategoryId(SANJAY_GARDEN_CATEGORIES[nextIndex].id);
    setSlideIndex(nextIndex);
  };

  const handlePrevSlide = () => {
    const currentIndex = SANJAY_GARDEN_CATEGORIES.findIndex((c) => c.id === activeCategoryId);
    const prevIndex = (currentIndex === 0 ? SANJAY_GARDEN_CATEGORIES.length - 1 : currentIndex - 1);
    setActiveCategoryId(SANJAY_GARDEN_CATEGORIES[prevIndex].id);
    setSlideIndex(prevIndex);
  };

  return (
    <section id="sanjay-garden" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12 gsap-fade">
        <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-bold text-neutral-900 tracking-tight leading-tight">
          Crafting places where
          <br className="hidden sm:block" /> new beginnings take shape.
        </h2>

        <div className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full border border-neutral-300 bg-white text-neutral-900 text-xs sm:text-sm font-semibold shadow-2xs uppercase tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
          <span>SANJAY GARDEN</span>
        </div>
      </div>

      {/* 3-Column Grid matching the exact design */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Category Pills Stack */}
        <div className="lg:col-span-3 flex flex-col justify-center gap-2.5 sm:gap-3">
          {SANJAY_GARDEN_CATEGORIES.map((cat, idx) => {
            const isActive = cat.id === activeCategoryId;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategoryId(cat.id);
                  setSlideIndex(idx);
                }}
                className={`w-full rounded-full p-1.5 sm:p-2 pl-4 sm:pl-5 pr-2 sm:pr-2.5 flex items-center justify-between transition-all duration-300 text-left group ${
                  isActive
                    ? 'bg-[#d2f831] text-black font-semibold shadow-sm'
                    : 'bg-white border border-neutral-200/90 text-neutral-800 font-medium hover:border-neutral-300 hover:bg-neutral-50/80 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                  <span className={`text-xs font-bold shrink-0 ${isActive ? 'text-black' : 'text-neutral-400'}`}>
                    {cat.num}
                  </span>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`shrink-0 ${isActive ? 'text-black' : 'text-neutral-500'}`}>
                      {getCategoryIcon(cat.id)}
                    </span>
                    <span className="text-xs sm:text-sm tracking-tight truncate">{cat.label}</span>
                  </div>
                </div>

                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 shrink-0 ${
                    isActive
                      ? 'bg-white text-black shadow-xs'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {isActive ? <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Middle Column: Large Architectural Image Card */}
        <div className="lg:col-span-5 relative group">
          <div className="w-full h-full min-h-[300px] sm:min-h-[420px] rounded-[24px] sm:rounded-[28px] overflow-hidden relative shadow-sm border border-neutral-200/60 bg-neutral-900">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeCategory.imageMain}
                src={activeCategory.imageMain}
                alt={activeCategory.title}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

            {/* Center Circle Action Button */}
            <button
              onClick={() =>
                onSelectProperty?.(activeCategory.title, activeCategory.imageMain)
              }
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 backdrop-blur-xs text-neutral-900 flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all z-10"
              aria-label="View property details"
            >
              <ArrowUpRight className="w-5 h-5 stroke-[2.2]" />
            </button>

            {/* Bottom info */}
            <div className="absolute bottom-5 left-6 right-6 z-10 text-white">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#d2f831]">
                SANJAY GARDEN · {activeCategory.label.toUpperCase()}
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">{activeCategory.title}</h3>
              <p className="text-xs text-white/85 mt-0.5">{activeCategory.specs}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Secondary Card & Slider Navigation */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          <div className="w-full h-[280px] sm:h-[340px] rounded-[28px] overflow-hidden relative shadow-sm border border-neutral-200/60 bg-neutral-900 group">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeCategory.imageSecondary}
                src={activeCategory.imageSecondary}
                alt="Sanjay Garden Residential Environment"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Caption in secondary image */}
            <div className="absolute bottom-4 left-5 right-5 text-white z-10">
              <p className="text-xs font-medium text-white/90 drop-shadow-sm">
                {activeCategory.description}
              </p>
            </div>
          </div>

          {/* Bottom Slider Bar: 01/04 counter & prev/next buttons */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="text-sm font-semibold tracking-wide text-neutral-600">
              <span className="text-neutral-950 font-bold">
                0{slideIndex + 1}
              </span>
              /04
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevSlide}
                className="w-10 h-10 rounded-full border border-neutral-300 bg-white text-neutral-800 flex items-center justify-center hover:bg-neutral-50 active:scale-95 transition-all shadow-2xs"
                aria-label="Previous Category"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNextSlide}
                className="w-10 h-10 rounded-full bg-neutral-950 text-white flex items-center justify-center hover:bg-neutral-800 active:scale-95 transition-all shadow-sm"
                aria-label="Next Category"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
