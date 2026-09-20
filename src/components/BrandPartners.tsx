import React from 'react';
import { LOCATION_NETWORK_PILLS } from '../data/sanjayGarden';
import { GraduationCap, HeartPulse, Laptop, ShoppingBag, Radio, Navigation, Bus, Home, Trees, Store } from 'lucide-react';

export const BrandPartners: React.FC = () => {
  const getPillIcon = (id: string) => {
    switch (id) {
      case '1':
        return <GraduationCap className="w-4 h-4 text-neutral-700" />;
      case '2':
        return <HeartPulse className="w-4 h-4 text-neutral-700" />;
      case '3':
        return <Laptop className="w-4 h-4 text-neutral-700" />;
      case '4':
        return <ShoppingBag className="w-4 h-4 text-neutral-700" />;
      case '5':
        return <Radio className="w-4 h-4 text-neutral-700" />;
      case '6':
        return <Navigation className="w-4 h-4 text-neutral-700" />;
      case '7':
        return <Bus className="w-4 h-4 text-neutral-700" />;
      case '8':
        return <Home className="w-4 h-4 text-neutral-700" />;
      case '9':
        return <Trees className="w-4 h-4 text-neutral-700" />;
      case '10':
        return <Store className="w-4 h-4 text-neutral-700" />;
      default:
        return <Navigation className="w-4 h-4 text-neutral-700" />;
    }
  };

  return (
    <section id="location" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight text-center text-neutral-900 max-w-xl mx-auto mb-8 sm:mb-10 gsap-fade">
        Connected to the places
        <br />
        that matter.
      </h2>

      {/* Pill Badges Grid - Restrained location & connectivity network */}
      <div className="flex flex-col gap-3 sm:gap-4 max-w-4xl mx-auto items-center">
        {LOCATION_NETWORK_PILLS.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 w-full"
          >
            {row.map((item) => (
              <div
                key={item.id}
                className="h-10 sm:h-12 px-3.5 sm:px-6 rounded-xl sm:rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex items-center justify-center gap-2 text-neutral-800 hover:border-neutral-400 hover:shadow-xs transition-all cursor-default"
                title={item.category}
              >
                {getPillIcon(item.id)}
                <span className="text-xs sm:text-sm font-semibold tracking-tight text-neutral-900">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};
