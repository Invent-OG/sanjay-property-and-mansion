import React from 'react';
import { SunburstGraphic } from './Icons';

export const AboutStories: React.FC = () => {
  return (
    <section id="about" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Column: Pill & Sunset Villa Photo */}
        <div className="lg:col-span-4 flex flex-col items-start gsap-fade">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-200/90 bg-white text-neutral-900 text-xs sm:text-sm font-medium shadow-2xs mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
            <span>About Our Stories</span>
          </div>

          {/* Sunset Horizon Villa with Infinity Pool */}
          <div className="w-full max-w-[340px] rounded-[24px] overflow-hidden shadow-sm aspect-[4/3.2] relative group bg-neutral-100 border border-neutral-200/70">
            <img
              src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=85"
              alt="Modern dusk villa with infinity pool and panoramic sunset"
              className="gsap-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Right Column: Statement Typography & Sunburst Emblem */}
        <div className="lg:col-span-8 flex flex-col justify-between pt-2 lg:pt-4 relative gsap-fade">
          {/* Two-Tone Statement Typography matching sample image */}
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-4xl lg:text-[44px] font-normal leading-[1.26] tracking-[-0.02em]">
              <span className="text-neutral-950 font-medium">
                We connect people with properties buy &amp; Selling their dreams and{' '}
              </span>
              <span className="italic font-normal text-neutral-400">
                lifestyles because a home is more than just a place, it's where life happens.
              </span>
            </h2>
          </div>

          {/* Geometric 24-Point Starburst Emblem Centered Below */}
          <div className="flex justify-center pt-12 sm:pt-20">
            <div
              className="text-neutral-950 hover:rotate-90 transition-transform duration-700 ease-out cursor-pointer"
              title="Design Emblem"
            >
              <SunburstGraphic className="w-14 h-14 sm:w-16 sm:h-16" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
