import React, { useState } from 'react';
import { Search, Plus, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { EDITORIAL_STACK_CARDS } from '../data/sanjayGarden';

interface AestheticRoomStackProps {
  onSearch?: (query: string) => void;
  onSelectCard?: (title: string) => void;
}

export const AestheticRoomStack: React.FC<AestheticRoomStackProps> = ({ onSearch, onSelectCard }) => {
  const [activeTab, setActiveTab] = useState<string>('house');
  const [cardsOrder, setCardsOrder] = useState([0, 1, 2]);
  const [searchQuery, setSearchQuery] = useState('');

  const cycleCards = (targetIndex: number) => {
    if (targetIndex === 0) return;
    setCardsOrder((prev) => {
      const newOrder = [...prev];
      const clicked = newOrder.splice(targetIndex, 1)[0];
      newOrder.unshift(clicked);
      return newOrder;
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const card1 = EDITORIAL_STACK_CARDS[cardsOrder[0]];
  const card2 = EDITORIAL_STACK_CARDS[cardsOrder[1]];
  const card3 = EDITORIAL_STACK_CARDS[cardsOrder[2]];

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative overflow-hidden bg-white/40">
      {/* Top Header Row matching sample image */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 sm:mb-14">
        {/* Left: Filter Pills + Arrow Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {[
            { id: 'house', label: 'House' },
            { id: 'appartement', label: 'Appartement' },
            { id: 'pesidential', label: 'Pesidential' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white border border-neutral-300 text-neutral-950 font-semibold shadow-xs'
                  : 'bg-white/70 border border-neutral-200 text-neutral-600 hover:text-neutral-950 hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}

          {/* Lime Circle Arrow Button */}
          <button
            onClick={() => cycleCards(1)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FFCC00] text-black flex items-center justify-center font-bold hover:scale-105 active:scale-95 transition-transform shadow-xs shrink-0"
            title="Next Property Card"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Right: AGENTS label */}
        <div className="text-xs sm:text-sm font-bold tracking-[0.18em] text-neutral-900 uppercase">
          AGENTS
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start relative">
        {/* Left Column: Big Headline + 3 Overlapping Cascading Cards */}
        <div className="lg:col-span-7 flex flex-col justify-start">
          {/* Main Headline matching site-wide font family and weight */}
          <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-bold text-neutral-900 tracking-tight leading-[1.1] mb-10 sm:mb-14 font-sans">
            Looking for a astenthic<br />
            Comportable room
          </h2>

          {/* Overlapping 3-Cards Horizontal Stacking Stage */}
          <div className="relative w-full min-h-[380px] sm:min-h-[440px] pb-6">
            {/* CARD 3: Background Layer (furthest right & back) */}
            <motion.div
              layout
              onClick={() => cycleCards(2)}
              className="absolute left-[62%] sm:left-[330px] md:left-[380px] top-12 sm:top-16 z-10 w-[38%] sm:w-[190px] md:w-[220px] bg-white rounded-[24px] sm:rounded-[28px] p-2.5 sm:p-3 shadow-md border border-neutral-200/70 cursor-pointer hover:translate-y-[-4px] transition-all"
              title="Click to bring to front"
            >
              <div className="w-full h-28 sm:h-36 md:h-40 rounded-[18px] sm:rounded-[22px] overflow-hidden bg-neutral-100 mb-2 sm:mb-3">
                <img
                  src={card3.image}
                  alt={card3.addressLine1}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[9px] sm:text-[10px] text-neutral-400 font-medium whitespace-nowrap truncate">
                  Today, 9 hours ago
                </span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#7c8088] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
            </motion.div>

            {/* CARD 2: Middle Layer (peeking between card 1 and 3) */}
            <motion.div
              layout
              onClick={() => cycleCards(1)}
              className="absolute left-[36%] sm:left-[230px] md:left-[270px] top-6 sm:top-8 z-20 w-[48%] sm:w-[230px] md:w-[260px] bg-white rounded-[26px] sm:rounded-[30px] p-3 sm:p-3.5 shadow-lg border border-neutral-200/80 cursor-pointer hover:translate-y-[-4px] transition-all"
              title="Click to bring to front"
            >
              <div className="w-full h-34 sm:h-44 md:h-48 rounded-[20px] sm:rounded-[24px] overflow-hidden bg-neutral-100 mb-2 sm:mb-3">
                <img
                  src={card2.image}
                  alt={card2.addressLine1}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] text-neutral-400 font-medium whitespace-nowrap truncate">
                  Today, 9 hours ago
                </span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#232427] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
            </motion.div>

            {/* CARD 1: Foreground Layer (main prominent card) */}
            <motion.div
              layout
              className="relative z-30 w-[74%] max-w-[310px] sm:max-w-[380px] bg-white rounded-[28px] sm:rounded-[32px] p-3.5 sm:p-4 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.1)] border border-neutral-200/90 cursor-pointer"
              onClick={() => onSelectCard?.(card1.addressLine1)}
            >
              {/* Card Photo with Cantilever Architecture & Palms */}
              <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-[22px] sm:rounded-[24px] overflow-hidden relative mb-3 sm:mb-4 bg-neutral-100">
                <img
                  src={card1.image}
                  alt={card1.addressLine1}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Address / Property Title */}
              <div className="mb-3 sm:mb-4">
                <h4 className="text-xs sm:text-sm md:text-base font-bold text-neutral-900 leading-snug">
                  1802 (From 1082 to 1899 Odd) Forest City RD,Forest City TWP, ME
                </h4>
                <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 font-medium">
                  {card1.addressLine1} · {card1.addressLine2}
                </p>
              </div>

              {/* Bottom Row: Date & Neon Lime Button with Plus */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] sm:text-[11px] text-neutral-400 font-normal">
                  Today, 9 hours ago
                </span>

                {/* Neon Lime Circle Button with Plus */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    cycleCards(1);
                  }}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FFCC00] text-black font-extrabold flex items-center justify-center shadow-xs hover:scale-110 active:scale-95 transition-transform"
                  aria-label="Next card"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Column: Giant 01 Watermark + Search Pill + Paragraph */}
        <div className="lg:col-span-5 flex flex-col justify-start relative pt-4 sm:pt-10 lg:pt-20">
          {/* Giant '01' watermark numeral spanning background */}
          <div className="absolute right-0 sm:right-6 lg:right-10 -top-8 sm:-top-16 select-none pointer-events-none text-[150px] sm:text-[240px] lg:text-[300px] font-bold text-neutral-200/40 leading-none tracking-tighter z-0">
            01
          </div>

          {/* Search Location Input Pill + Standalone Lime Button */}
          <form onSubmit={handleSearchSubmit} className="relative z-10 flex items-center gap-2.5 sm:gap-3 w-full max-w-md mb-8 sm:mb-12 mt-6 sm:mt-14">
            <div className="flex-1 bg-[#f4f5f7] border border-neutral-200/70 rounded-full py-2.5 sm:py-3 px-5 sm:px-6 shadow-2xs focus-within:border-neutral-400 focus-within:bg-white transition-all">
              <input
                type="text"
                placeholder="Search Location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none font-medium"
              />
            </div>
            <button
              type="submit"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FFCC00] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shrink-0 shadow-xs"
              aria-label="Search"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Editorial Paragraph matching site-wide font family and weight */}
          <div className="relative z-10 max-w-md">
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal font-sans">
              <strong className="font-semibold text-neutral-900">with its square floor plan</strong>, cubist shape and impressive 216 m of living space, Held not only offers amazing views over the Rhine, but also anexceptionally harmonious room layout.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
