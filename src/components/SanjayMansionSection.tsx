import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Wifi,
  Sun,
  ShieldCheck,
  Droplets,
  Bike,
  Sparkles,
  ArrowUpRight,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { SANJAY_MANSION_DATA } from '../data/sanjayMansion';
import { propertyService, getDefaultSanjayMansionFullData } from '../services/propertyService';
import type { FullPropertyData } from '../types/database';

interface SanjayMansionSectionProps {
  onNavigateToMansion: () => void;
}

const HIGHLIGHT_FACILITIES = [
  { label: 'Free 60GB Wi-Fi', icon: <Wifi className="w-3.5 h-3.5" /> },
  { label: 'Solar Hot Water', icon: <Sun className="w-3.5 h-3.5" /> },
  { label: 'Attached Bathrooms', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { label: 'RO Treated Water', icon: <Droplets className="w-3.5 h-3.5" /> },
  { label: 'Covered Bike Parking', icon: <Bike className="w-3.5 h-3.5" /> },
  { label: '24×7 CCTV Security', icon: <ShieldCheck className="w-3.5 h-3.5" /> }
];

export const SanjayMansionSection: React.FC<SanjayMansionSectionProps> = ({
  onNavigateToMansion
}) => {
  const [data, setData] = useState<FullPropertyData>(getDefaultSanjayMansionFullData());

  useEffect(() => {
    propertyService.getFullPropertyBySlug('sanjay-mansion').then((res) => {
      if (res) setData(res);
    });
  }, []);

  const prop = data.property;

  // If property is marked inactive or not featured, don't show on homepage
  if (prop.status === 'inactive' || !prop.is_featured_homepage) {
    return null;
  }

  const heroImg = prop.hero_image_url || data.images[0]?.url || SANJAY_MANSION_DATA.gallery[0].url;
  const thumbnails = data.images.slice(1, 4);

  return (
    <section
      id="sanjay-mansion-section"
      aria-label="Western Stay – Sanjay Mansion Introduction"
      className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-18"
    >
      <div className="bg-white rounded-[28px] sm:rounded-[40px] border border-neutral-200/90 p-5 sm:p-10 lg:p-12 shadow-xs overflow-hidden">
        {/* Section Header Eyebrow */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 sm:mb-10 pb-6 border-b border-neutral-100">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-300 bg-neutral-50 text-neutral-900 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#FFCC00]" />
            <span>SANJAY PROPERTIES PORTFOLIO</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
            <MapPin className="w-4 h-4 text-neutral-800" />
            <span>{prop.area}, {prop.city} · {prop.address_line2 || 'Opp. KCT Tech Park'}</span>
          </div>
        </div>

        {/* Main 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Property Visual Media */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[480px] rounded-[24px] sm:rounded-[32px] overflow-hidden bg-neutral-900 group shadow-sm">
              <img
                src={heroImg}
                alt={prop.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Top Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#FFCC00] text-[11px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFCC00] animate-pulse" />
                  Western Stay Residence
                </span>
              </div>

              {/* Bottom Caption on Image */}
              <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                <p className="text-xs uppercase tracking-widest text-[#FFCC00] font-bold mb-1">
                  Coimbatore North · Saravanampatti
                </p>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Modern Architecture & Peaceful Living
                </h3>
              </div>
            </div>

            {/* Small Thumbnails Row */}
            <div className="grid grid-cols-3 gap-2.5">
              {thumbnails.map((thumb, idx) => (
                <div
                  key={thumb.id || idx}
                  className="relative h-20 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/80"
                >
                  <img
                    src={thumb.url}
                    alt={thumb.title || 'Mansion Photo'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white drop-shadow-sm truncate pr-1">
                    {thumb.category || (idx === 0 ? 'Exterior' : idx === 1 ? 'Rooms' : 'Interiors')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Detailed Description & CTAs */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Supporting Subtitle */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs sm:text-sm font-bold tracking-wider text-neutral-500 uppercase">
                  SANJAY PROPERTIES PRESENTS
                </span>
              </div>

              {/* Section Headings */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 tracking-tight leading-[1.1] mb-2">
                {prop.name || 'WESTERN STAY – SANJAY MANSION'}
              </h2>

              {prop.tagline && (
                <p className="text-sm sm:text-base font-semibold text-neutral-800 italic mb-4">
                  &ldquo;{prop.tagline}&rdquo;
                </p>
              )}

              {/* Short Description */}
              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed mb-6">
                {prop.description || 'A peaceful and comfortable stay in Saravanampatti, Coimbatore, designed with essential facilities, clean surroundings and convenient accommodation options.'}
              </p>

              {/* Location Badge Card */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 mb-6 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-900 mt-0.5">
                  <MapPin className="w-4 h-4 text-black" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">
                    Prime Location in {prop.area}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5 leading-relaxed">
                    {prop.full_address || `${prop.address_line1}, ${prop.address_line2 || ''}, ${prop.area}, ${prop.city} – ${prop.pincode}`}
                  </p>
                </div>
              </div>

              {/* Key Facilities Chips */}
              <div className="mb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2.5">
                  Key Amenities & Facilities
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {HIGHLIGHT_FACILITIES.map((fac, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 border border-neutral-200/70 text-neutral-800 text-[11px] font-semibold"
                    >
                      <span className="text-neutral-900">{fac.icon}</span>
                      <span className="truncate">{fac.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Callout */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#fffbe6] border border-[#FFCC00]/60 mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 block">
                    Accommodation Pricing
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs text-neutral-600 font-medium">Starting from</span>
                    <span className="text-xl sm:text-2xl font-black text-neutral-950">
                      {prop.pricing_start || '₹4,900'}
                    </span>
                    <span className="text-xs text-neutral-500 font-medium">/ month</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-800 bg-white px-2.5 py-1 rounded-full border border-neutral-200">
                    <CheckCircle2 className="w-3 h-3 text-[#65a30d]" />
                    Single, 2 & 4 Sharing
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onNavigateToMansion}
                className="flex-1 py-3 px-6 rounded-full bg-neutral-950 text-white font-bold text-xs sm:text-sm hover:bg-neutral-800 active:scale-95 transition-all shadow-xs flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>VIEW {prop.short_name.toUpperCase()}</span>
                <ArrowUpRight className="w-4 h-4 text-[#FFCC00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <a
                href={`tel:${prop.primary_phone || '8056889900'}`}
                className="py-3 px-6 rounded-full bg-[#FFCC00] text-black font-extrabold text-xs sm:text-sm hover:bg-neutral-900 hover:text-white active:scale-95 transition-all shadow-xs flex items-center justify-center gap-2 text-center cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 stroke-[2.4]" />
                <span>CALL FOR BOOKING</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
