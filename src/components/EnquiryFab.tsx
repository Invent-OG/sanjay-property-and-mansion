import React, { useState, useEffect } from 'react';
import { MessageSquareText, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EnquiryFabProps {
  onClick: () => void;
}

export const EnquiryFab: React.FC<EnquiryFabProps> = ({ onClick }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById('hero-section');
      if (heroEl) {
        const heroBottom = heroEl.getBoundingClientRect().bottom;
        // User has scrolled past the hero section when its bottom edge reaches or passes the top of viewport
        setShowScrollTop(heroBottom <= 80);
      } else {
        // Fallback if hero element is not detected
        setShowScrollTop(window.scrollY > 500);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div
      id="floating-action-group"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-none"
    >
      {/* Scroll to Top Button - Appears only after scrolling past hero section */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            id="scroll-to-top-button"
            type="button"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.75, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.75, y: 12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            aria-label="Scroll to top of page"
            title="Scroll to top"
            className="pointer-events-auto flex items-center justify-center w-11 h-11 rounded-full bg-white/95 hover:bg-neutral-950 text-neutral-800 hover:text-white shadow-[0_6px_20px_rgba(0,0,0,0.18)] border border-neutral-300 hover:border-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#d2f831] focus:ring-offset-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm group"
          >
            <ArrowUp className="w-4.5 h-4.5 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Persistent Quick Enquiry Floating Action Button */}
      <button
        id="fab-enquiry-button"
        type="button"
        onClick={onClick}
        aria-label="Open project enquiry and contact form"
        className="pointer-events-auto flex items-center gap-2.5 bg-neutral-950/95 hover:bg-black text-white pl-3 pr-4 py-2.5 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.3)] border border-neutral-800 hover:border-[#d2f831] focus:outline-hidden focus:ring-2 focus:ring-[#d2f831] focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm group"
      >
        <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-[#d2f831] text-black shrink-0">
          <MessageSquareText className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#d2f831] animate-ping opacity-75" />
        </span>
        <span className="text-xs font-semibold tracking-tight text-neutral-200 group-hover:text-white transition-colors whitespace-nowrap">
          Enquire
        </span>
      </button>
    </div>
  );
};
