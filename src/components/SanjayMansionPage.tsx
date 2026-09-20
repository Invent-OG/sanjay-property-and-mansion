import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Navigation,
  Check,
  CheckCircle2,
  ArrowUpRight,
  Wifi,
  Sun,
  ShowerHead,
  Sparkles,
  Droplets,
  Bed,
  BookOpen,
  ShieldCheck,
  Waves,
  Bike,
  Video,
  Trees,
  ArrowLeft,
  Calendar,
  X,
  Clock,
  Utensils,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SANJAY_MANSION_DATA } from '../data/sanjayMansion';
import { CONTACT_CONFIG } from '../data/contact';
import { Footer } from './Footer';
import { BrandLogo } from './BrandLogo';

interface SanjayMansionPageProps {
  onBackToHome: () => void;
  onOpenEnquiryModal: () => void;
  onOpenScheduleModal: () => void;
  onOpenBookingModal?: (roomType?: string) => void;
}

export const SanjayMansionPage: React.FC<SanjayMansionPageProps> = ({
  onBackToHome,
  onOpenEnquiryModal,
  onOpenScheduleModal,
  onOpenBookingModal
}) => {
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);
  const [activeMealPlanTab, setActiveMealPlanTab] = useState<'VEG' | 'NON-VEG'>('VEG');
  const [selectedMenuDay, setSelectedMenuDay] = useState<string>('Monday');

  // Sync document title and meta description for SEO
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Western Stay – Sanjay Mansion | Saravanampatti, Coimbatore';

    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDesc = metaDescription?.getAttribute('content') || '';
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Western Stay – Sanjay Mansion in Saravanampatti, Coimbatore. Comfortable accommodation with Wi-Fi, solar hot water, attached bathrooms, RO water, laundry access, CCTV surveillance and convenient stay options.'
      );
    }

    // Scroll to top when page opens
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Inject LodgingBusiness JSON-LD structured data
    const scriptId = 'sanjay-mansion-structured-data';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LodgingBusiness',
        name: 'Western Stay – Sanjay Mansion',
        description:
          'Comfortable and secure residential accommodation in Saravanampatti, Coimbatore near KCT Tech Park.',
        telephone: '+918056889900',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'No. 6, Sanjay Garden, Opp. KCT Tech Park',
          addressLocality: 'Saravanampatti, Coimbatore',
          addressRegion: 'Tamil Nadu',
          postalCode: '641035',
          addressCountry: 'IN'
        },
        amenityFeature: [
          { '@type': 'LocationFeatureSpecification', name: 'Free Wi-Fi', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Solar Hot Water', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Attached Bathrooms', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'RO Water', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'CCTV Surveillance', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Covered Parking', value: true }
        ],
        priceRange: '₹4,900 - ₹8,000'
      });
      document.head.appendChild(script);
    }

    return () => {
      document.title = originalTitle;
      if (metaDescription) {
        metaDescription.setAttribute('content', originalDesc);
      }
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  // Helper for rendering facility icons
  const renderFacilityIcon = (iconName: string) => {
    const props = { className: 'w-5 h-5 text-neutral-900 stroke-[2]' };
    switch (iconName) {
      case 'wifi':
        return <Wifi {...props} />;
      case 'sun':
        return <Sun {...props} />;
      case 'shower-head':
        return <ShowerHead {...props} />;
      case 'sparkles':
        return <Sparkles {...props} />;
      case 'droplets':
        return <Droplets {...props} />;
      case 'bed':
        return <Bed {...props} />;
      case 'book-open':
        return <BookOpen {...props} />;
      case 'shield-check':
        return <ShieldCheck {...props} />;
      case 'waves':
        return <Waves {...props} />;
      case 'bike':
        return <Bike {...props} />;
      case 'video':
        return <Video {...props} />;
      case 'trees':
        return <Trees {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  const activeDayMenu = SANJAY_MANSION_DATA.weeklyMenu.find(
    (m) => m.day === selectedMenuDay
  ) || SANJAY_MANSION_DATA.weeklyMenu[0];

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#111213] selection:bg-[#FFCC00] selection:text-black flex flex-col font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER NAVIGATION (Matching Sanjay Properties Visual Language)   */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-[#f5f6f8]/90 backdrop-blur-md border-b border-neutral-200/80">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-3">
          {/* Back Link & Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToHome}
              aria-label="Back to Sanjay Properties Home"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-neutral-800 text-xs font-bold hover:bg-neutral-100 active:scale-95 transition-all shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Sanjay Properties</span>
              <span className="sm:hidden">Home</span>
            </button>

            <div className="h-5 w-px bg-neutral-300 hidden sm:block" />

            <div className="flex items-center gap-3">
              <BrandLogo variant="black" size="sm" layout="horizontal" />
              <div className="h-6 w-px bg-neutral-300 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-normal tracking-wider uppercase text-neutral-900 leading-none">
                  SANJAY MANSION
                </span>
                <span className="text-[10px] text-neutral-500 font-normal tracking-wide">
                  Western Stay Residence
                </span>
              </div>
            </div>
          </div>

          {/* Quick Call & Actions */}
          <div className="flex items-center gap-2">
            <a
              href="tel:8056889900"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 text-xs font-bold text-neutral-900 hover:bg-neutral-50 active:scale-95 transition-all shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-neutral-700" />
              <span>8056889900</span>
            </a>

            <button
              type="button"
              onClick={() => onOpenBookingModal ? onOpenBookingModal() : onOpenEnquiryModal()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFCC00] text-black text-xs font-extrabold hover:bg-neutral-950 hover:text-white active:scale-95 transition-all shadow-2xs"
            >
              <span>Book Stay</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION                                                          */}
      {/* ========================================================================= */}
      <section className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative w-full rounded-[32px] sm:rounded-[44px] overflow-hidden min-h-[580px] sm:min-h-[660px] lg:min-h-[700px] flex flex-col justify-between shadow-2xl bg-neutral-950 p-6 sm:p-12 lg:p-16">
          {/* Background Image & Gradient */}
          <div className="absolute inset-0 z-0">
            <img
              src={SANJAY_MANSION_DATA.gallery[0].url}
              alt="Western Stay Sanjay Mansion Building"
              className="w-full h-full object-cover opacity-50 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/40" />
            <div className="absolute inset-0 bg-radial-at-t from-transparent via-transparent to-neutral-950/80" />
          </div>

          {/* Top Hero Badges */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#FFCC00] text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#FFCC00] animate-pulse" />
              <span>WESTERN STAY RESIDENCE · COIMBATORE</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#FFCC00]" />
              <span>Saravanampatti · Opp. KCT Tech Park</span>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="relative z-10 max-w-3xl my-auto py-8">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] uppercase">
              WESTERN STAY
              <br />
              <span className="text-[#FFCC00]">SANJAY MANSION</span>
            </h1>

            <p className="text-lg sm:text-2xl text-neutral-200 font-semibold mt-4 sm:mt-5 tracking-tight italic">
              &ldquo;{SANJAY_MANSION_DATA.tagline}&rdquo;
            </p>

            <p className="text-xs sm:text-sm lg:text-base text-neutral-300 font-normal mt-3 max-w-2xl leading-relaxed">
              Quality &amp; Comfort. A peaceful address for a comfortable stay. Wake up to nature.
            </p>

            {/* Address Banner */}
            <div className="mt-6 p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs sm:text-sm flex items-start gap-3 max-w-xl">
              <MapPin className="w-4 h-4 text-[#FFCC00] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-white">Location Address:</span>
                <span className="text-neutral-300">{SANJAY_MANSION_DATA.location.fullAddress}</span>
              </div>
            </div>

            {/* Hero CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8">
              <button
                type="button"
                onClick={() => onOpenBookingModal ? onOpenBookingModal('Single Room (Deluxe)') : onOpenEnquiryModal()}
                className="py-3 sm:py-3.5 px-6 sm:px-7 rounded-full bg-[#FFCC00] text-black font-extrabold text-xs sm:text-sm hover:bg-white active:scale-95 transition-all shadow-lg flex items-center gap-2"
              >
                <span>BOOK YOUR STAY</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <a
                href={SANJAY_MANSION_DATA.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 sm:py-3.5 px-6 sm:px-7 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white font-bold text-xs sm:text-sm hover:bg-white hover:text-black active:scale-95 transition-all shadow-md flex items-center gap-2"
              >
                <Navigation className="w-4 h-4 text-[#FFCC00]" />
                <span>GET DIRECTIONS</span>
              </a>

              <a
                href={SANJAY_MANSION_DATA.phones[0].href}
                className="py-3 sm:py-3.5 px-6 sm:px-7 rounded-full bg-neutral-900 border border-neutral-700 text-white font-bold text-xs sm:text-sm hover:bg-neutral-800 active:scale-95 transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#FFCC00]" />
                <span>CALL NOW</span>
              </a>
            </div>
          </div>

          {/* Bottom Hero Stats Strip */}
          <div className="relative z-10 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-white">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Pricing Starts</span>
              <span className="text-base sm:text-xl font-black text-[#FFCC00]">₹4,900 / mo</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Connectivity</span>
              <span className="text-base sm:text-xl font-bold">Opp. KCT Tech Park</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Wi-Fi Data</span>
              <span className="text-base sm:text-xl font-bold">60GB / Person</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Security</span>
              <span className="text-base sm:text-xl font-bold">24×7 CCTV</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PROPERTY INTRODUCTION: QUALITY & COMFORT                             */}
      {/* ========================================================================= */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="bg-white rounded-[28px] sm:rounded-[40px] border border-neutral-200/90 p-6 sm:p-12 lg:p-16 shadow-xs">
          <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-300 bg-neutral-50 text-neutral-900 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FFCC00]" />
              <span>SANJAY MANSION PHILOSOPHY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-950 tracking-tight leading-tight uppercase mb-4">
              QUALITY &amp; COMFORT
            </h2>

            <p className="text-neutral-700 text-sm sm:text-base lg:text-lg leading-relaxed font-normal">
              {SANJAY_MANSION_DATA.longDescription}
            </p>
          </div>

          {/* 4 Visual Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {SANJAY_MANSION_DATA.highlights.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="p-6 rounded-[24px] bg-neutral-50 border border-neutral-200/80 hover:border-neutral-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#FFCC00] text-black font-black flex items-center justify-center text-sm mb-4 shadow-xs">
                    0{idx + 1}
                  </div>
                  <h3 className="text-lg font-bold text-neutral-950 tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ACCOMMODATION OPTIONS (Pricing Cards)                                 */}
      {/* ========================================================================= */}
      <section id="accommodations" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-300 bg-white text-neutral-900 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FFCC00]" />
              <span>TRANSPARENT TARIFFS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 tracking-tight leading-tight uppercase">
              ACCOMMODATION OPTIONS
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-neutral-600 text-xs sm:text-sm font-normal leading-relaxed">
              Choose the stay option that suits you. Clean, well-ventilated rooms designed for working professionals and students.
            </p>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-8">
          {SANJAY_MANSION_DATA.accommodations.map((acc) => (
            <motion.div
              key={acc.id}
              whileHover={{ y: -6 }}
              className={`rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                acc.recommended
                  ? 'bg-neutral-950 text-white border-2 border-[#FFCC00] shadow-xl'
                  : 'bg-white text-neutral-950 border border-neutral-200/90 shadow-xs'
              }`}
            >
              {acc.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-[#FFCC00] text-black text-xs font-black uppercase tracking-wider shadow-sm">
                    {acc.badge}
                  </span>
                </div>
              )}

              <div>
                {!acc.recommended && (
                  <div className="mb-3">
                    <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-bold uppercase tracking-wider">
                      {acc.badge}
                    </span>
                  </div>
                )}

                <h3 className={`text-2xl font-black tracking-tight ${acc.recommended ? 'text-white' : 'text-neutral-950'}`}>
                  {acc.name}
                </h3>

                <div className="mt-4 mb-6 pb-6 border-b border-neutral-200/40">
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-3xl sm:text-4xl font-black tracking-tight ${acc.recommended ? 'text-[#FFCC00]' : 'text-neutral-950'}`}>
                      {acc.priceMonthly}
                    </span>
                    <span className={`text-xs ${acc.recommended ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {acc.priceNote}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {acc.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          acc.recommended ? 'text-[#FFCC00]' : 'text-[#65a30d]'
                        }`}
                      />
                      <span className={acc.recommended ? 'text-neutral-200' : 'text-neutral-700'}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Action */}
              <div>
                <button
                  type="button"
                  onClick={() => onOpenBookingModal ? onOpenBookingModal(acc.name) : onOpenEnquiryModal()}
                  className={`w-full py-3 px-4 rounded-full font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all text-center ${
                    acc.recommended
                      ? 'bg-[#FFCC00] text-black hover:bg-white'
                      : 'bg-neutral-950 text-white hover:bg-neutral-800'
                  }`}
                >
                  <span>Book {acc.name}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Accommodation Notes */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-100 border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-neutral-700 shrink-0" />
            <span>
              <strong>Special Note:</strong> {SANJAY_MANSION_DATA.accommodationNotes[0]}
            </span>
          </div>
          <div className="text-neutral-500 font-medium">
            {SANJAY_MANSION_DATA.accommodationNotes[1]}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FACILITIES SECTION: EVERYTHING YOU NEED FOR A COMFORTABLE STAY        */}
      {/* ========================================================================= */}
      <section id="facilities" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="bg-neutral-950 text-white rounded-[28px] sm:rounded-[40px] p-6 sm:p-12 lg:p-16 shadow-xl">
          <div className="max-w-2xl mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-700 bg-neutral-900 text-[#FFCC00] text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FFCC00]" />
              <span>COMPREHENSIVE AMENITIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase">
              EVERYTHING YOU NEED FOR A COMFORTABLE STAY
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-3 leading-relaxed">
              Designed with practical convenience in mind, allowing residents to focus on their professional and academic routines.
            </p>
          </div>

          {/* 12 Facility Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {SANJAY_MANSION_DATA.facilities.map((fac) => (
              <div
                key={fac.id}
                className="p-5 sm:p-6 rounded-[20px] sm:rounded-[24px] bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center mb-4 group-hover:bg-[#FFCC00] transition-colors shadow-sm">
                    {renderFacilityIcon(fac.iconName)}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mb-1.5">
                    {fac.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {fac.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. WHY SANJAY MANSION?                                                   */}
      {/* ========================================================================= */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-300 bg-white text-neutral-900 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FFCC00]" />
            <span>CORE ADVANTAGES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-950 tracking-tight uppercase">
            WHY SANJAY MANSION?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {SANJAY_MANSION_DATA.whyChooseUs.map((item, idx) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              className="p-6 sm:p-8 rounded-[24px] sm:rounded-[28px] bg-white border border-neutral-200/90 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#FFCC00] text-black font-extrabold flex items-center justify-center text-xs mb-5">
                  0{idx + 1}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-neutral-950 tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. MEALS SECTION: MEALS AVAILABLE                                       */}
      {/* ========================================================================= */}
      <section id="meals" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-18">
        <div className="bg-white rounded-[28px] sm:rounded-[40px] border border-neutral-200/90 p-6 sm:p-12 lg:p-16 shadow-xs">
          <div className="max-w-2xl mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-300 bg-neutral-50 text-neutral-900 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FFCC00]" />
              <span>NUTRITIOUS DINING OPTIONS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-950 tracking-tight uppercase leading-tight">
              MEALS AVAILABLE
            </h2>
            <p className="text-neutral-600 text-xs sm:text-sm mt-2">
              Optional meal plans are available for residents.
            </p>
          </div>

          {/* 3 Meal Option Frequency Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-8">
            {SANJAY_MANSION_DATA.mealsSummary.map((m, idx) => (
              <div
                key={idx}
                className="p-6 rounded-[24px] bg-neutral-50 border border-neutral-200/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-wider">
                      {m.frequency}
                    </span>
                    <span className="text-xs text-neutral-500 font-semibold">{m.days}</span>
                  </div>

                  <div className="mt-2 mb-4">
                    <span className="text-2xl sm:text-3xl font-black text-neutral-950">
                      {m.priceApprox}
                    </span>
                    {m.dailyRateApprox && (
                      <span className="text-xs text-neutral-600 block mt-1 font-medium">
                        {m.dailyRateApprox}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-500 flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-neutral-600" />
            <span>{SANJAY_MANSION_DATA.mealsDisclaimer}</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. BASIC MEAL PLAN & WEEKLY MENU PREVIEW                                 */}
      {/* ========================================================================= */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        <div className="bg-neutral-50 rounded-[28px] sm:rounded-[36px] border border-neutral-200/90 p-6 sm:p-10 lg:p-12 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight uppercase">
                BASIC MEAL PLAN
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                Choose between Vegetarian and Non-Vegetarian monthly or weekly packages.
              </p>
            </div>

            {/* Veg / Non-Veg Tabs */}
            <div className="inline-flex bg-white p-1 rounded-full border border-neutral-300 text-xs font-bold self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveMealPlanTab('VEG')}
                className={`px-5 py-2 rounded-full transition-all ${
                  activeMealPlanTab === 'VEG'
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                VEG PLAN
              </button>
              <button
                type="button"
                onClick={() => setActiveMealPlanTab('NON-VEG')}
                className={`px-5 py-2 rounded-full transition-all ${
                  activeMealPlanTab === 'NON-VEG'
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                NON-VEG PLAN
              </button>
            </div>
          </div>

          {/* Pricing Highlight for active tab */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                {activeMealPlanTab} Monthly Subscription
              </span>
              <div className="text-2xl font-black text-neutral-950">
                {activeMealPlanTab === 'VEG' ? '₹3,600' : '₹3,800'}
                <span className="text-xs text-neutral-500 font-normal"> / month (26 Days)</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                {activeMealPlanTab} Weekly Trial Plan
              </span>
              <div className="text-2xl font-black text-neutral-950">
                {activeMealPlanTab === 'VEG' ? '₹900' : '₹950'}
                <span className="text-xs text-neutral-500 font-normal"> / week</span>
              </div>
            </div>
          </div>

          {/* Weekly Menu Interactive Preview */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-8">
            <div className="flex items-center justify-between gap-3 mb-5">
              <h4 className="text-sm sm:text-base font-bold text-neutral-900 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-black" />
                <span>Weekly Meal Schedule (Breakfast · Lunch · Dinner)</span>
              </h4>
            </div>

            {/* Day Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
              {SANJAY_MANSION_DATA.weeklyMenu.map((m) => (
                <button
                  key={m.day}
                  type="button"
                  onClick={() => setSelectedMenuDay(m.day)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedMenuDay === m.day
                      ? 'bg-neutral-950 text-white shadow-2xs'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {m.day}
                  {m.isHoliday && <span className="ml-1 text-[10px] opacity-75">(Holiday)</span>}
                </button>
              ))}
            </div>

            {/* Day Menu Details */}
            {activeDayMenu.isHoliday ? (
              <div className="p-8 rounded-2xl bg-neutral-50 text-center border border-neutral-200/60">
                <p className="text-base font-bold text-neutral-800">Sunday Dining Holiday</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Residents explore local Saravanampatti restaurants and dining spots on Sundays.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Breakfast */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider">
                      BREAKFAST
                    </span>
                    <span className="text-[10px] text-neutral-500 font-medium">Morning</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-800 font-semibold leading-relaxed">
                    {activeDayMenu.breakfast}
                  </p>
                </div>

                {/* Lunch */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider">
                      LUNCH
                    </span>
                    <span className="text-[10px] text-neutral-500 font-medium">Afternoon</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-800 font-semibold leading-relaxed">
                    {activeDayMenu.lunch}
                  </p>
                </div>

                {/* Dinner */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider">
                      DINNER
                    </span>
                    <span className="text-[10px] text-neutral-500 font-medium">Evening</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-800 font-semibold leading-relaxed">
                    {activeDayMenu.dinner}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. IMAGE GALLERY                                                         */}
      {/* ========================================================================= */}
      <section id="gallery" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-18">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-300 bg-white text-neutral-900 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FFCC00]" />
              <span>PROPERTY VISUALS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-950 tracking-tight uppercase leading-tight">
              PROPERTY GALLERY
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
              Explore the main building architecture, exterior views, individual study rooms, and tranquil natural surroundings.
            </p>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {SANJAY_MANSION_DATA.gallery.map((img) => (
            <div
              key={img.id}
              onClick={() => setSelectedGalleryImg(img.url)}
              className="relative h-64 sm:h-72 rounded-[24px] overflow-hidden bg-neutral-900 cursor-pointer group shadow-2xs border border-neutral-200/80"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold text-[#FFCC00] uppercase tracking-wider block mb-0.5">
                  {img.category}
                </span>
                <h4 className="text-sm font-bold tracking-tight">{img.title}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedGalleryImg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGalleryImg(null)}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            >
              <div className="relative max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={selectedGalleryImg}
                  alt="Enlarged view"
                  className="w-full h-full object-contain max-h-[80vh]"
                />
                <button
                  type="button"
                  onClick={() => setSelectedGalleryImg(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ========================================================================= */}
      {/* 10. LOCATION SECTION: FIND SANJAY MANSION                                */}
      {/* ========================================================================= */}
      <section id="location" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-18">
        <div className="bg-white rounded-[28px] sm:rounded-[40px] border border-neutral-200/90 p-5 sm:p-10 lg:p-12 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Location Info */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-300 bg-neutral-50 text-neutral-900 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#FFCC00]" />
                  <span>LOCATION &amp; CONNECTIVITY</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-neutral-950 tracking-tight uppercase leading-tight mb-4">
                  FIND SANJAY MANSION
                </h2>

                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-neutral-900 shrink-0 mt-1" />
                    <div>
                      <h4 className="text-sm font-bold text-neutral-950">Property Address:</h4>
                      <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
                        {SANJAY_MANSION_DATA.location.addressLine1}
                        <br />
                        {SANJAY_MANSION_DATA.location.landmark}
                        <br />
                        {SANJAY_MANSION_DATA.location.area}, {SANJAY_MANSION_DATA.location.city} –{' '}
                        {SANJAY_MANSION_DATA.location.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-8 text-xs sm:text-sm text-neutral-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#65a30d]" />
                    <span>Directly opposite KCT Tech Park</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#65a30d]" />
                    <span>5 minutes to Sathy Road arterial highway</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#65a30d]" />
                    <span>Close to CHIL SEZ &amp; Keeranatham IT corridor</span>
                  </li>
                </ul>
              </div>

              <div>
                <a
                  href={SANJAY_MANSION_DATA.location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-full bg-neutral-950 text-white font-extrabold text-xs sm:text-sm hover:bg-[#FFCC00] hover:text-black active:scale-95 transition-all shadow-md"
                >
                  <Navigation className="w-4 h-4" />
                  <span>GET DIRECTIONS</span>
                </a>
              </div>
            </div>

            {/* Right Location Map Embed */}
            <div className="lg:col-span-7 h-[360px] sm:h-[420px] rounded-[24px] sm:rounded-[32px] overflow-hidden bg-neutral-100 border border-neutral-200/90 shadow-sm relative">
              <iframe
                title="Sanjay Mansion Location Map"
                src={SANJAY_MANSION_DATA.location.embedMapUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              <div className="absolute bottom-4 left-4 z-10">
                <div className="px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-neutral-200 text-neutral-800 text-xs font-bold shadow-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFCC00] animate-pulse" />
                  <span>Western Stay – Sanjay Mansion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. BOOKING CTA SECTION: READY TO FIND YOUR STAY?                        */}
      {/* ========================================================================= */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="relative rounded-[32px] sm:rounded-[44px] overflow-hidden bg-neutral-950 text-white p-8 sm:p-14 lg:p-18 text-center shadow-2xl">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-[#FFCC00]/20 to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#FFCC00] block mb-3">
              RESERVE YOUR ROOM TODAY
            </span>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase mb-4">
              READY TO FIND YOUR STAY?
            </h2>

            <p className="text-neutral-300 text-xs sm:text-base leading-relaxed mb-8">
              Contact us for availability, accommodation options and booking details.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <a
                href="tel:8056889900"
                className="py-3.5 px-6 sm:px-8 rounded-full bg-[#FFCC00] text-black font-extrabold text-xs sm:text-sm hover:bg-white active:scale-95 transition-all shadow-lg flex items-center gap-2"
              >
                <Phone className="w-4 h-4 stroke-[2.5]" />
                <span>CALL 8056889900</span>
              </a>

              <a
                href="tel:8110889900"
                className="py-3.5 px-6 sm:px-8 rounded-full bg-neutral-900 border border-neutral-700 text-white font-bold text-xs sm:text-sm hover:bg-neutral-800 active:scale-95 transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#FFCC00]" />
                <span>CALL 8110889900</span>
              </a>

              <a
                href={SANJAY_MANSION_DATA.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-6 sm:px-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xs sm:text-sm hover:bg-white hover:text-black active:scale-95 transition-all flex items-center gap-2"
              >
                <Navigation className="w-4 h-4 text-[#FFCC00]" />
                <span>GET DIRECTIONS</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. CONTACT INFORMATION CARD                                             */}
      {/* ========================================================================= */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-white rounded-[24px] sm:rounded-[32px] border border-neutral-200/90 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
          <div>
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
              DIRECT PROPERTY DESK
            </span>
            <h3 className="text-lg sm:text-xl font-black text-neutral-950">
              WESTERN STAY – SANJAY MANSION
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              No. 6, Sanjay Garden, Opp. KCT Tech Park, Saravanampatti, Coimbatore – 641 035
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:8056889900"
              className="px-5 py-2.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-800 hover:bg-neutral-200 transition-colors"
            >
              8056889900
            </a>
            <a
              href="tel:8110889900"
              className="px-5 py-2.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-800 hover:bg-neutral-200 transition-colors"
            >
              8110889900
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13. FOOTER (Reusing existing Sanjay Properties footer)                   */}
      {/* ========================================================================= */}
      <Footer
        onNavClick={() => onBackToHome()}
        onOpenEnquiry={onOpenEnquiryModal}
        onOpenSchedule={onOpenScheduleModal}
        onNavigateToMansion={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};
