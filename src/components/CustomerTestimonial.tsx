import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TESTIMONIAL_SLIDES = [
  {
    quote:
      'Customer stories coming soon. Please connect with our team for verified project inquiries, layout inspections, and resident testimonials.',
    author: 'Sanjay Properties Enquiry Desk',
    role: 'Saravanampatti, Coimbatore',
    avatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80'
    ]
  },
  {
    quote:
      'Committed to providing transparent property information, clear documentation, and direct site coordination for Sanjay Garden.',
    author: 'Resident Relations Team',
    role: 'Coimbatore North',
    avatars: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80'
    ]
  }
];

export const CustomerTestimonial: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIAL_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIAL_SLIDES.length);
  };

  const current = TESTIMONIAL_SLIDES[currentIndex];

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto text-center relative">
        {/* Title */}
        <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-neutral-900 mb-6 sm:mb-10">
          What Our Customers Say
        </h2>

        {/* 3 Circular Avatars Cluster */}
        <div className="flex items-center justify-center -space-x-3 mb-6 sm:mb-8">
          <img
            src={current.avatars[0]}
            alt="Client avatar"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-xs z-10"
            referrerPolicy="no-referrer"
          />
          <img
            src={current.avatars[1]}
            alt="Client avatar"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-white shadow-md z-20"
            referrerPolicy="no-referrer"
          />
          <img
            src={current.avatars[2]}
            alt="Client avatar"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-xs z-10"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Quote Content with Side Navigation Buttons */}
        <div className="relative px-2 sm:px-16">
          {/* Desktop Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-neutral-200 bg-white text-neutral-700 items-center justify-center hover:bg-neutral-50 hover:border-neutral-300 active:scale-95 transition-all shadow-xs"
            aria-label="Previous story"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Desktop Right Arrow Button */}
          <button
            onClick={handleNext}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-neutral-200 bg-white text-neutral-700 items-center justify-center hover:bg-neutral-50 hover:border-neutral-300 active:scale-95 transition-all shadow-xs"
            aria-label="Next story"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <p className="text-neutral-700 text-sm sm:text-base lg:text-lg leading-relaxed font-normal">
                &ldquo;{current.quote}&rdquo;
              </p>

              {/* Author & Role */}
              <div className="mt-5 sm:mt-6">
                <h4 className="text-sm sm:text-base font-bold text-neutral-900 tracking-tight">
                  {current.author}
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">{current.role}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile Centered Arrow Controls */}
          <div className="flex sm:hidden items-center justify-center gap-3 mt-6">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-neutral-200 bg-white text-neutral-700 flex items-center justify-center hover:bg-neutral-50 active:scale-95 transition-all shadow-2xs"
              aria-label="Previous story"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-xs font-semibold text-neutral-400 px-2">
              {currentIndex + 1} / {TESTIMONIAL_SLIDES.length}
            </div>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-neutral-200 bg-white text-neutral-700 flex items-center justify-center hover:bg-neutral-50 active:scale-95 transition-all shadow-2xs"
              aria-label="Next story"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
