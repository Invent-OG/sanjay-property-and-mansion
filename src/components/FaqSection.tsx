import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SANJAY_FAQS } from '../data/sanjayGarden';

interface FaqSectionProps {
  onOpenEnquiry: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenEnquiry }) => {
  const [openFaq, setOpenFaq] = useState<string>('01');

  const toggleFaq = (id: string) => {
    setOpenFaq((prev) => (prev === id ? '' : id));
  };

  return (
    <section id="faq" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12">
        <div>
          <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-bold text-neutral-900 tracking-tight">
            Frequently Asked
            <br />
            Questions
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm mt-2">Have questions? We&apos;re here to help.</p>
        </div>

        <button
          onClick={onOpenEnquiry}
          className="self-start sm:self-auto px-5 py-2.5 rounded-full border border-neutral-300 bg-white text-neutral-900 text-xs sm:text-sm font-semibold hover:bg-neutral-50 active:scale-95 transition-all shadow-2xs"
        >
          Ask a Question
        </button>
      </div>

      {/* Grid: Left Dark Card & Right Accordion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Moody Dark Twilight Card */}
        <div className="lg:col-span-4 rounded-[24px] sm:rounded-[28px] overflow-hidden relative p-6 sm:p-10 flex flex-col justify-between min-h-[320px] sm:min-h-[380px] bg-neutral-950 shadow-md">
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
            alt="Modern architectural structure at dusk"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />

          {/* Card Content */}
          <div className="relative z-10">
            <span className="text-xs font-bold text-[#d2f831] uppercase tracking-wider mb-2 block">
              Sanjay Properties
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Your Question
              <br />
              Our Answer
            </h3>
            <p className="text-white/75 text-xs sm:text-sm mt-3 leading-relaxed">
              Find answers regarding Sanjay Garden, layout references, survey numbers, and scheduling site visits in Saravanampatti.
            </p>
          </div>

          <div className="relative z-10 pt-6 sm:pt-8">
            <button
              onClick={onOpenEnquiry}
              className="px-6 py-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs sm:text-sm font-semibold hover:bg-white hover:text-black transition-all shadow-sm active:scale-95"
            >
              Enquire With Us
            </button>
          </div>
        </div>

        {/* Right Column: Accordion List (all 8 factual items) */}
        <div className="lg:col-span-8 flex flex-col justify-center divide-y divide-neutral-200">
          {SANJAY_FAQS.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div key={faq.id} className="py-4 sm:py-5">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between text-left gap-3 sm:gap-4 group"
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-6 min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-neutral-400 shrink-0 mt-0.5 sm:mt-0">
                      {faq.id}
                    </span>
                    <span className="text-xs sm:text-base font-bold text-neutral-900 group-hover:text-black tracking-tight leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-700 group-hover:bg-neutral-100 transition-colors shrink-0">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed pl-6 sm:pl-11 pr-2 sm:pr-8 pt-3 pb-2 font-normal">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
