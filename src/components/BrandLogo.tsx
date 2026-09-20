import React from 'react';

interface BrandLogoProps {
  variant?: 'white' | 'black';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'vertical' | 'horizontal';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'white',
  size = 'md',
  layout = 'vertical',
  className = ''
}) => {
  const isWhite = variant === 'white';
  const logoSrc = isWhite ? '/logo/logo-white.png' : '/logo/logo-black.png';
  const textColor = isWhite ? 'text-white' : 'text-neutral-900';

  if (layout === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <img
          src={logoSrc}
          alt="Sanjay Properties"
          className="h-8 w-auto object-contain shrink-0"
        />
        <div className="flex flex-col items-start leading-tight">
          <span className={`font-bold tracking-[0.24em] pl-[0.24em] uppercase text-xs sm:text-sm ${textColor}`}>
            SANJAY
          </span>
          <span className={`font-semibold tracking-[0.34em] pl-[0.34em] uppercase text-[8px] sm:text-[9px] mt-0.5 ${isWhite ? 'text-white/85' : 'text-neutral-700'}`}>
            PROPERTIES
          </span>
        </div>
      </div>
    );
  }

  // Vertical stacked lockup matching the exact reference image
  const sizeConfig = {
    sm: {
      img: 'h-6 sm:h-7',
      sanjay: 'text-[11px] sm:text-xs tracking-[0.26em] pl-[0.26em]',
      properties: 'text-[7px] sm:text-[8px] tracking-[0.34em] pl-[0.34em]',
      gap: 'gap-1'
    },
    md: {
      img: 'h-8 sm:h-10 md:h-11',
      sanjay: 'text-sm sm:text-base md:text-lg tracking-[0.28em] pl-[0.28em]',
      properties: 'text-[8px] sm:text-[10px] md:text-[11px] tracking-[0.36em] pl-[0.36em]',
      gap: 'gap-1.5'
    },
    lg: {
      img: 'h-12 sm:h-14 md:h-16',
      sanjay: 'text-lg sm:text-xl md:text-2xl tracking-[0.3em] pl-[0.3em]',
      properties: 'text-[10px] sm:text-xs md:text-sm tracking-[0.38em] pl-[0.38em]',
      gap: 'gap-2'
    },
    xl: {
      img: 'h-16 sm:h-20',
      sanjay: 'text-2xl sm:text-3xl tracking-[0.32em] pl-[0.32em]',
      properties: 'text-xs sm:text-base tracking-[0.4em] pl-[0.4em]',
      gap: 'gap-2.5'
    }
  };

  const cfg = sizeConfig[size] || sizeConfig.md;

  return (
    <div className={`inline-flex flex-col items-center justify-center text-center select-none ${cfg.gap} ${className}`}>
      <img
        src={logoSrc}
        alt="Sanjay Properties"
        className={`${cfg.img} w-auto object-contain drop-shadow-sm`}
      />
      <div className="flex flex-col items-center justify-center leading-none text-center">
        <span className={`font-bold uppercase whitespace-nowrap block ${cfg.sanjay} ${textColor}`}>
          SANJAY
        </span>
        <span className={`font-semibold uppercase whitespace-nowrap block mt-1 ${cfg.properties} ${isWhite ? 'text-white/90' : 'text-neutral-800'}`}>
          PROPERTIES
        </span>
      </div>
    </div>
  );
};
