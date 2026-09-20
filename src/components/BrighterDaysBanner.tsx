import React from 'react';
import { ArrowUpRight, Calendar, MapPin } from 'lucide-react';
import { CONTACT_CONFIG } from '../data/contact';

interface BrighterDaysBannerProps {
  onExploreProject: () => void;
  onScheduleVisit: () => void;
  onOpenEnquiry: () => void;
}

export const BrighterDaysBanner: React.FC<BrighterDaysBannerProps> = ({
  onExploreProject,
  onScheduleVisit,
  onOpenEnquiry
}) => {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* SECTION 12: FINAL CINEMATIC CTA */}
      <div className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden min-h-[380px] sm:min-h-[460px] flex items-center justify-center text-center p-8 sm:p-14 bg-neutral-950 shadow-xl">
        {/* Background Image with dusk lighting */}
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
          alt="Sanjay Properties - Sanjay Garden Architectural Vision"
          className="absolute inset-0 w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/80 backdrop-blur-[1px]" />

        {/* Banner Content */}
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FFCC00] mb-3">
            {CONTACT_CONFIG.companyName}
          </span>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
            Your next chapter
            <br />
            could begin here.
          </h2>

          <p className="text-white/85 text-xs sm:text-sm lg:text-base mt-4 max-w-lg leading-relaxed font-normal">
            Discover Sanjay Garden in Saravanampatti, Coimbatore.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
            <button
              onClick={onExploreProject}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFCC00] text-black text-xs sm:text-sm font-bold hover:bg-white transition-all shadow-md active:scale-95"
            >
              <span>Explore Sanjay Garden</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={onScheduleVisit}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs sm:text-sm font-semibold hover:bg-white hover:text-black transition-all shadow-md active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule a Site Visit</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 13: CONTACT STRIP */}
      <div className="bg-[#181a1c] text-white rounded-[26px] sm:rounded-[32px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 border border-white/10 shadow-lg">
        <div className="text-center sm:text-left">
          <div className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
            {CONTACT_CONFIG.companyName}
          </div>
          <div className="text-lg sm:text-2xl font-bold text-white mt-1">
            Let&apos;s talk about your next property.
          </div>
          <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5 justify-center sm:justify-start">
            <MapPin className="w-3 h-3 text-[#FFCC00]" />
            <span>Saravanampatti, Coimbatore – 641035</span>
          </div>
        </div>

        <button
          onClick={onOpenEnquiry}
          className="w-12 h-12 rounded-full bg-[#FFCC00] text-black flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform shrink-0"
          title="Start enquiry"
          aria-label="Enquire with Sanjay Properties"
        >
          <ArrowUpRight className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>
    </section>
  );
};
