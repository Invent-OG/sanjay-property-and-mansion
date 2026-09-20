import React, { useState, useEffect } from 'react';
import { HeroSection } from './HeroSection';
import { AboutStories } from './AboutStories';
import { MetricsCards } from './MetricsCards';
import { CraftingHomes } from './CraftingHomes';
import { BrandPartners } from './BrandPartners';
import { ExcellencePartner } from './ExcellencePartner';
import { SanjayMansionSection } from './SanjayMansionSection';
import { AestheticRoomStack } from './AestheticRoomStack';
import { DiscoverSection } from './DiscoverSection';
import { CustomerTestimonial } from './CustomerTestimonial';
import { LocationMap } from './LocationMap';
import { FaqSection } from './FaqSection';
import { BrighterDaysBanner } from './BrighterDaysBanner';
import { Footer } from './Footer';
import { EnquiryFab } from './EnquiryFab';
import { EnquiryModal, ScheduleVisitModal, SearchModal, DetailModal } from './Modals';
import { initGsapAnimations } from '../scripts/animations';

export function InteractiveHome() {
  const [activeNav, setActiveNav] = useState('hero');
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<{ title: string; image?: string; subtitle?: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize GSAP scroll animations
  useEffect(() => {
    const cleanup = initGsapAnimations();
    return () => {
      cleanup?.();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navigateToMansion = () => {
    window.location.href = '/sanjay-mansion';
  };

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectDetail = (title: string, imageOrSubtitle?: string) => {
    setSelectedDetail({
      title,
      image: imageOrSubtitle && imageOrSubtitle.startsWith('http') ? imageOrSubtitle : undefined,
      subtitle: imageOrSubtitle && !imageOrSubtitle.startsWith('http') ? imageOrSubtitle : undefined
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#111213] selection:bg-[#d2f831] selection:text-black flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-neutral-900 text-white px-5 py-3 rounded-full shadow-2xl border border-neutral-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#d2f831]" />
          {toastMessage}
        </div>
      )}

      {/* SECTION 01 & 02: HERO & FLOATING NAVIGATION */}
      <div id="hero">
        <HeroSection
          onOpenEnquiry={() => setIsEnquiryOpen(true)}
          onOpenSchedule={() => setIsScheduleOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onNavigateToMansion={navigateToMansion}
        />
      </div>

      {/* SECTION 03: ABOUT SANJAY PROPERTIES */}
      <AboutStories />

      {/* SECTION 04: PROJECT INFORMATION CARDS */}
      <MetricsCards />

      {/* SECTION 05: PROJECT STORY AND IMAGE SHOWCASE */}
      <CraftingHomes onSelectProperty={handleSelectDetail} />

      {/* SECTION 06: PARTNERS / TRUSTED NETWORK */}
      <BrandPartners />

      {/* SECTION 07: TRUSTED PROPERTY SECTION */}
      <ExcellencePartner
        onExploreProject={() => {
          handleNavClick('sanjay-garden');
          showToast('Navigating to Sanjay Garden details.');
        }}
        onRequestDocs={() => {
          setIsEnquiryOpen(true);
        }}
      />

      {/* SECTION 08: NEW WESTERN STAY – SANJAY MANSION PROPERTY SECTION */}
      <SanjayMansionSection onNavigateToMansion={navigateToMansion} />

      {/* SECTION 09: ARCHITECTURAL EDITORIAL SHOWCASE */}
      <AestheticRoomStack
        onSearch={() => setIsSearchOpen(true)}
        onSelectCard={(title) => handleSelectDetail(title)}
      />

      {/* SECTION 10: DISCOVER SANJAY GARDEN */}
      <DiscoverSection
        onSelectItem={(title, subtitle) => handleSelectDetail(title, subtitle)}
      />

      {/* SECTION 11: CUSTOMER TESTIMONIALS */}
      <CustomerTestimonial />

      {/* SECTION 12: SARAVANAMPATTI ACCESSIBILITY & LOCATION MAP */}
      <LocationMap
        onOpenSchedule={() => setIsScheduleOpen(true)}
        onOpenEnquiry={() => setIsEnquiryOpen(true)}
      />

      {/* SECTION 13: FAQ */}
      <FaqSection onOpenEnquiry={() => setIsEnquiryOpen(true)} />

      {/* SECTION 14: FINAL CINEMATIC CTA & CONTACT STRIP */}
      <BrighterDaysBanner
        onExploreProject={() => handleNavClick('sanjay-garden')}
        onScheduleVisit={() => setIsScheduleOpen(true)}
        onOpenEnquiry={() => setIsEnquiryOpen(true)}
      />

      {/* SECTION 15: FOOTER */}
      <Footer
        onNavClick={handleNavClick}
        onOpenEnquiry={() => setIsEnquiryOpen(true)}
        onOpenSchedule={() => setIsScheduleOpen(true)}
        onNavigateToMansion={navigateToMansion}
      />

      {/* Persistent Quick Enquiry Floating Action Button */}
      <EnquiryFab onClick={() => setIsEnquiryOpen(true)} />

      {/* Modals */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />

      <ScheduleVisitModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTopic={(topic) => {
          handleSelectDetail(topic);
        }}
      />

      <DetailModal
        item={selectedDetail}
        onClose={() => setSelectedDetail(null)}
        onEnquire={() => {
          setSelectedDetail(null);
          setIsEnquiryOpen(true);
        }}
      />
    </div>
  );
}

export default InteractiveHome;
