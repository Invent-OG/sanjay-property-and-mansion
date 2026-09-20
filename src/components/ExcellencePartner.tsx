import React from 'react';
import { MapPin, FileCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface ExcellencePartnerProps {
  onExploreProject?: () => void;
  onRequestDocs?: () => void;
}

export const ExcellencePartner: React.FC<ExcellencePartnerProps> = ({
  onExploreProject,
  onRequestDocs
}) => {
  return (
    <section id="services" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Gradient Outer Container with Rounded Corners matching sample image */}
      <div className="relative overflow-hidden bg-[radial-gradient(120%_95%_at_85%_12%,#c4e1fb_0%,#f5faff_42%,#d4ebfc_82%,#c6e2fb_100%)] rounded-[28px] sm:rounded-[40px] p-6 sm:p-12 lg:p-16 border border-[#c6e1f9] shadow-xs">
        {/* Luminous Ambient Lighting matching reference composition */}
        <div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full bg-[#b5dbfc]/70 blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[360px] rounded-full bg-white/85 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-[460px] h-[460px] rounded-full bg-[#c5e2fc]/70 blur-3xl pointer-events-none" />

        {/* Centered Heading & Subtitle */}
        <div className="relative z-10 max-w-2xl mx-auto text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-bold text-neutral-900 tracking-tight leading-tight">
            A clearer way to
            <br />
            explore property.
          </h2>
          <p className="text-neutral-600 text-xs sm:text-base mt-3 sm:mt-4 font-normal leading-relaxed">
            Discover Sanjay Garden in Saravanampatti and contact Sanjay Properties for information
            about the project, its location, and current availability.
          </p>

          {/* Pill Button */}
          <div className="mt-6 sm:mt-7">
            <button
              onClick={onExploreProject}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-neutral-900 text-xs sm:text-sm font-bold shadow-xs hover:shadow-md hover:bg-neutral-50 active:scale-95 transition-all"
            >
              Explore Sanjay Garden
            </button>
          </div>
        </div>

        {/* 2 White Rounded Feature Cards */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {/* Card 1: Understand the Location */}
          <motion.div
            whileHover={{ y: -3 }}
            onClick={onExploreProject}
            className="gsap-card bg-white rounded-[24px] sm:rounded-[28px] p-6 sm:p-10 shadow-xs border border-neutral-100 flex flex-col justify-between cursor-pointer"
          >
            <div>
              {/* Circular Lime Green Icon Badge */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FFCC00] flex items-center justify-center text-black mb-5 sm:mb-6 shadow-xs">
                <MapPin className="w-5 h-5 stroke-[2.2]" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight">
                Understand the
                <br />
                Location.
              </h3>

              <p className="text-neutral-500 text-xs sm:text-sm mt-3 leading-relaxed">
                Explore Sanjay Garden&apos;s location in Saravanampatti, Coimbatore, with direct access
                to PNT Colony and nearby tech corridors.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Get Project Information */}
          <motion.div
            whileHover={{ y: -3 }}
            onClick={onRequestDocs}
            className="gsap-card bg-white rounded-[24px] sm:rounded-[28px] p-6 sm:p-10 shadow-xs border border-neutral-100 flex flex-col justify-between cursor-pointer"
          >
            <div>
              {/* Circular Lime Green Icon Badge */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FFCC00] flex items-center justify-center text-black mb-5 sm:mb-6 shadow-xs">
                <FileCheck className="w-5 h-5 stroke-[2.2]" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight">
                Get Project
                <br />
                Information.
              </h3>

              <p className="text-neutral-500 text-xs sm:text-sm mt-3 leading-relaxed">
                Contact Sanjay Properties to request current property details, survey references, and
                layout documentation.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
