import React from 'react';
import { PROJECT_STAT_CARDS } from '../data/sanjayGarden';
import { MapPin, FolderCheck, FileText } from 'lucide-react';
import { motion } from 'motion/react';

export const MetricsCards: React.FC = () => {
  const getIcon = (icon: string) => {
    switch (icon) {
      case 'location':
        return <MapPin className="w-5 h-5 text-neutral-800" />;
      case 'folder':
        return <FolderCheck className="w-5 h-5 text-neutral-900" />;
      case 'document':
        return <FileText className="w-5 h-5 text-neutral-800" />;
      default:
        return <MapPin className="w-5 h-5 text-neutral-800" />;
    }
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {PROJECT_STAT_CARDS.map((card) => (
          <div
            key={card.id}
            className={`stat-card ${
              card.isAccent ? 'bg-[#d2f831]' : 'bg-[#f0f2f4]'
            } rounded-[28px] p-7 sm:p-8 flex flex-col justify-between h-[185px] sm:h-[200px] relative transition-all duration-300 shadow-sm border border-black/5 hover:-translate-y-1 group`}
          >
            {/* Top Right Icon Badge */}
            <div className="flex justify-end">
              <div className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                {getIcon(card.icon)}
              </div>
            </div>

            {/* Bottom Card Title and Subtitle */}
            <div>
              <div
                className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${
                  card.isAccent ? 'text-black' : 'text-neutral-950'
                }`}
              >
                {card.title}
              </div>
              <div
                className={`text-[11px] sm:text-xs font-bold tracking-wider uppercase mt-2 ${
                  card.isAccent ? 'text-neutral-900/80' : 'text-neutral-500'
                }`}
              >
                {card.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
