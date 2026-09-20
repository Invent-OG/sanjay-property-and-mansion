import React, { useState, useEffect } from 'react';
import { Home, Search, ChevronLeft, ChevronRight, Menu, X, ArrowUpRight, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CONTACT_CONFIG } from '../data/contact';
import { BrandLogo } from './BrandLogo';

interface HeroSectionProps {
  onOpenEnquiry: () => void;
  onOpenSchedule: () => void;
  onOpenSearch: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  onNavigateToMansion?: () => void;
}

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85',
    tag: 'SANJAY PROPERTIES',
    locationLabel: 'SARAVANAMPATTI · COIMBATORE',
    titleLine1: 'A Better Address',
    titleLine2: 'Begins With Better Planning.',
    desc: 'Discover Sanjay Garden, a residential address in Saravanampatti, Coimbatore.'
  },
  {
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85',
    tag: 'SANJAY GARDEN',
    locationLabel: 'PNT COLONY · COIMBATORE NORTH',
    titleLine1: 'Peaceful Living',
    titleLine2: 'With Urban Connectivity.',
    desc: 'Thoughtfully planned residential layouts with expansive road networks, open spaces, and lasting value.'
  },
  {
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=85',
    tag: 'HISTORICAL REF: 42/2008',
    locationLabel: 'SARAVANAMPATTI · 641035',
    titleLine1: 'Crafting Places',
    titleLine2: 'For Lasting Memories.',
    desc: 'Connect with Sanjay Properties to explore layout records, site specifications, and current availability.'
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenEnquiry,
  onOpenSchedule,
  onOpenSearch,
  activeNav,
  setActiveNav,
  onNavigateToMansion
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  const scrollToSection = (id: string) => {
    setActiveNav(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header id="hero-section" className="w-full px-3 sm:px-6 lg:px-8 pt-3 sm:pt-5  mx-auto">
      {/* Outer Hero Card with rounded corners */}
      <div className="relative w-full rounded-[32px] sm:rounded-[44px] overflow-hidden min-h-[640px] sm:min-h-[720px] lg:min-h-[780px] flex flex-col justify-between shadow-2xl bg-neutral-950">
        {/* Background Image with Crossfade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.image}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0"
          >
            <img
              src={slide.image}
              alt="Sanjay Properties - Sanjay Garden Architectural Setting"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {/* Top & Bottom gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-black/80" />
          </motion.div>
        </AnimatePresence>

        {/* SECTION 01: FLOATING NAVIGATION */}
        <nav className="relative z-20 w-full max-w-full px-3 sm:px-6 lg:px-8 pt-3 sm:pt-5 pb-2 flex items-center justify-between gap-2 sm:gap-4 box-border">
          {/* Left Navigation Pill Capsule */}
          <div className="hidden xl:flex items-center bg-black/30 backdrop-blur-md border border-white/20 p-1 rounded-full shadow-lg shrink-0 gap-0.5">
            <button
              onClick={() => scrollToSection('hero')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${activeNav === 'hero'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-white/85 hover:text-white'
                }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => scrollToSection('about')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${activeNav === 'about'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-white/85 hover:text-white'
                }`}
            >
              About
            </button>

            <button
              onClick={() => scrollToSection('sanjay-garden')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${activeNav === 'sanjay-garden'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-white/85 hover:text-white'
                }`}
            >
              Sanjay Garden
            </button>

            <a
              href="/sanjay-mansion"
              onClick={(e) => {
                if (onNavigateToMansion) {
                  e.preventDefault();
                  onNavigateToMansion();
                }
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all text-white/85 hover:text-white hover:bg-white/10"
            >
              Sanjay Mansion
            </a>

            <button
              onClick={() => scrollToSection('location')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${activeNav === 'location'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-white/85 hover:text-white'
                }`}
            >
              Location
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${activeNav === 'contact'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-white/85 hover:text-white'
                }`}
            >
              Contact
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="xl:hidden shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/35 backdrop-blur-md border border-white/20 text-white flex items-center justify-center active:scale-95 transition-transform"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Center Brand Wordmark / Logo */}
          <div className="text-center pointer-events-auto flex-1 min-w-0 xl:flex-none xl:absolute xl:left-1/2 xl:-translate-x-1/2 px-2 flex items-center justify-center">
            <a
              href="#hero"
              className="hover:opacity-90 transition-opacity focus:outline-none inline-flex items-center justify-center py-0.5"
              aria-label={CONTACT_CONFIG.companyName}
            >
              <BrandLogo variant="white" size="md" layout="vertical" />
            </a>
          </div>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={onOpenSearch}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/50 transition-colors shadow-sm shrink-0"
              title="Search Layout & Project Details"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              onClick={onOpenEnquiry}
              className="bg-white text-black font-bold text-xs sm:text-sm px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full hover:bg-[#FFCC00] hover:text-black transition-all shadow-md active:scale-95 whitespace-nowrap shrink-0"
            >
              <span className="hidden sm:inline">Enquire Now</span>
              <span className="sm:hidden">Enquire</span>
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="xl:hidden absolute top-20 left-4 right-4 z-30 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col gap-2"
            >
              <div className="flex items-center justify-between pb-3 mb-1 border-b border-white/10 px-1">
                <BrandLogo variant="white" size="sm" layout="horizontal" />
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                  Menu
                </span>
              </div>
              <button
                onClick={() => scrollToSection('hero')}
                className="flex items-center gap-2 text-white font-medium p-3 rounded-xl hover:bg-white/10 text-left text-sm"
              >
                <Home className="w-4 h-4" /> Home
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-white font-medium p-3 rounded-xl hover:bg-white/10 text-left text-sm"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('sanjay-garden')}
                className="text-white font-medium p-3 rounded-xl hover:bg-white/10 text-left text-sm"
              >
                Sanjay Garden
              </button>
              <a
                href="/sanjay-mansion"
                onClick={(e) => {
                  if (onNavigateToMansion) {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    onNavigateToMansion();
                  }
                }}
                className="flex items-center justify-between text-white font-medium p-3 rounded-xl hover:bg-white/10 text-left text-sm"
              >
                <span>Sanjay Mansion</span>
                <span className="text-[10px] bg-[#FFCC00] text-black font-extrabold px-2 py-0.5 rounded-full">Stay</span>
              </a>
              <button
                onClick={() => scrollToSection('location')}
                className="text-white font-medium p-3 rounded-xl hover:bg-white/10 text-left text-sm"
              >
                Location
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-white font-medium p-3 rounded-xl hover:bg-white/10 text-left text-sm"
              >
                Contact
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SECTION 02: CINEMATIC HERO CONTENT */}
        <div className="relative z-10 px-6 sm:px-12 lg:px-16 pb-8 sm:pb-12 pt-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-3xl">
            {/* Small Eyebrow Label & Location Tag */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4 sm:mb-5">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-black/35 backdrop-blur-md border border-white/25 text-white text-xs font-semibold px-4 py-1.5 rounded-full"
              >
                <span className="w-2 h-2 rounded-full bg-[#FFCC00] animate-pulse" />
                <span className="tracking-wide uppercase">{slide.tag}</span>
              </motion.div>

              <div className="text-[11px] sm:text-xs font-bold tracking-widest text-white/75 uppercase px-2 py-1 bg-black/20 rounded-full backdrop-blur-xs border border-white/10">
                {slide.locationLabel}
              </div>
            </div>

            {/* Display Headline */}
            <motion.h1
              key={slide.titleLine1 + slide.titleLine2}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-5xl lg:text-[64px] font-extrabold text-white tracking-tight leading-[1.08]"
            >
              {slide.titleLine1}
              <br />
              {slide.titleLine2}
            </motion.h1>

            {/* Supporting Text */}
            <p className="text-white/85 text-sm sm:text-base lg:text-lg mt-4 max-w-xl font-normal leading-relaxed">
              {slide.desc}
            </p>

            {/* Primary & Secondary Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-6 sm:mt-8 max-w-md sm:max-w-none">
              <button
                onClick={() => scrollToSection('sanjay-garden')}
                className="bg-[#FFCC00] text-black font-bold text-xs sm:text-sm px-6 py-3.5 sm:py-3 rounded-full hover:bg-white hover:text-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Explore Sanjay Garden</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onClick={onOpenSchedule}
                className="bg-black/35 backdrop-blur-md border border-white/30 text-white font-semibold text-xs sm:text-sm px-5 sm:px-6 py-3.5 sm:py-3 rounded-full hover:bg-white hover:text-black transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule a Site Visit</span>
              </button>
            </div>
          </div>

          {/* Carousel Slider Controls */}
          <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 w-full md:w-auto pt-2 md:pt-0">
            {/* Slide Indicators Line */}
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-2 rounded-full border border-white/20">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 transition-all rounded-full ${currentSlide === idx ? 'w-7 sm:w-8 bg-[#FFCC00]' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Arrow Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))
                }
                className="w-10 h-10 rounded-full bg-black/35 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-95"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                className="w-10 h-10 rounded-full bg-black/35 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-[#FFCC00] hover:text-black transition-all active:scale-95"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
