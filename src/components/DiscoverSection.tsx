import React, { useState } from 'react';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { SANJAY_DISCOVER_ITEMS } from '../data/sanjayGarden';

interface DiscoverSectionProps {
  onSelectItem?: (title: string, subtitle: string) => void;
}

export const DiscoverSection: React.FC<DiscoverSectionProps> = ({ onSelectItem }) => {
  // Index 1 (Card 2) is active by default to match the sample image on initial render
  const [activeHoverIndex, setActiveHoverIndex] = useState<number>(1);

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Header matching sample image exactly */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <h2 className="text-4xl sm:text-6xl lg:text-[72px] font-normal text-neutral-950 tracking-tight leading-none">
          Discover
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-sm sm:text-right font-normal leading-relaxed">
          Trusted real estate platform committed to making property ownership and investment easy and transparent.
        </p>
      </div>

      {/* Thin Horizontal Divider below Header */}
      <div className="w-full h-[1px] bg-neutral-200/80 mt-6 sm:mt-8 mb-10 sm:mb-14" />

      {/* 4 Cards Row with Dynamic Hover Enlargement */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-5 lg:gap-6 w-full">
        {SANJAY_DISCOVER_ITEMS.map((item, index) => {
          const isEnlarged = activeHoverIndex === index;

          return (
            <motion.div
              key={item.id}
              layout
              onMouseEnter={() => setActiveHoverIndex(index)}
              onClick={() => {
                setActiveHoverIndex(index);
                onSelectItem?.(item.title, item.subtitle);
              }}
              className={`transition-all duration-500 ease-out cursor-pointer flex flex-col group ${
                isEnlarged
                  ? 'flex-[1.7] sm:flex-[1.5] lg:flex-[1.6]'
                  : 'flex-1'
              }`}
            >
              {/* Card Container */}
              <div
                className={`w-full transition-all duration-500 ease-out overflow-hidden rounded-[22px] sm:rounded-[26px] ${
                  isEnlarged
                    ? 'p-2 sm:p-2.5 bg-[#eaf1f8]/70 shadow-lg border border-[#d3e2f2]'
                    : 'bg-transparent'
                }`}
              >
                {/* Image Container */}
                <div
                  className={`w-full overflow-hidden relative rounded-[18px] sm:rounded-[22px] bg-neutral-100 transition-all duration-500 ease-out ${
                    isEnlarged
                      ? 'h-80 sm:h-96 lg:h-[430px]'
                      : 'h-64 sm:h-72 lg:h-[310px]'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* Gradient Overlay for enlarged image */}
                  {isEnlarged && (
                    <div className="absolute inset-0 bg-black/10 transition-opacity pointer-events-none" />
                  )}

                  {/* Center Circle Arrow Action Button - visible when enlarged / active */}
                  {isEnlarged && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform z-10"
                    >
                      <ArrowUpRight className="w-5 h-5 stroke-[2.2]" />
                    </motion.div>
                  )}
                </div>

                {/* Content Details when Enlarged */}
                {isEnlarged && (
                  <div className="pt-3.5 pb-2 px-1 sm:px-1.5 transition-all duration-300">
                    <h3 className="text-base sm:text-lg font-bold text-neutral-950 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 flex items-center gap-1.5 mt-1 font-normal">
                      <MapPin className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
                      <span>{item.location}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Content Details when Standard / Compact */}
              {!isEnlarged && (
                <div className="pt-3 px-1 transition-all duration-300">
                  <h3 className="text-sm sm:text-base font-medium text-neutral-900 leading-snug">
                    {item.title}
                  </h3>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Thin Horizontal Divider below Cards */}
      <div className="w-full h-[1px] bg-neutral-200/80 mt-12 sm:mt-16" />
    </section>
  );
};
