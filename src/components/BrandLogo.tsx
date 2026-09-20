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
      img: 'h-5 sm:h-6',
      sanjay: 'text-[10px] sm:text-[11px] tracking-[0.26em] pl-[0.26em]',
      properties: 'text-[6.5px] sm:text-[7.5px] tracking-[0.34em] pl-[0.34em]',
      gap: 'gap-0.5'
    },
    md: {
      img: 'h-6 sm:h-7 md:h-8',
      sanjay: 'text-xs sm:text-sm tracking-[0.28em] pl-[0.28em]',
      properties: 'text-[7.5px] sm:text-[8.5px] tracking-[0.36em] pl-[0.36em]',
      gap: 'gap-1'
    },
    lg: {
      img: 'h-10 sm:h-12 md:h-14',
      sanjay: 'text-base sm:text-lg md:text-xl tracking-[0.3em] pl-[0.3em]',
      properties: 'text-[9px] sm:text-xs md:text-sm tracking-[0.38em] pl-[0.38em]',
      gap: 'gap-1.5'
    },
    xl: {
      img: 'h-14 sm:h-18',
      sanjay: 'text-xl sm:text-2xl tracking-[0.32em] pl-[0.32em]',
      properties: 'text-xs sm:text-sm tracking-[0.4em] pl-[0.4em]',
      gap: 'gap-2'
    }
  };

  const cfg = sizeConfig[size] || sizeConfig.md;

  return (
    <div className={`inline-flex flex-col items-center justify-center text-center select-none ${cfg.gap} ${className}`}>
      <img
        src={logoSrc}
        alt="Sanjay Properties"
        className={`${cfg.img} w-auto object-contain drop-shadow-sm shrink-0`}
      />
      <div className="flex flex-col items-center justify-center leading-tight text-center">
        <span className={`font-bold uppercase whitespace-nowrap block ${cfg.sanjay} ${textColor}`}>
          SANJAY
        </span>
        <span className={`font-semibold uppercase whitespace-nowrap block mt-0.5 ${cfg.properties} ${isWhite ? 'text-white/90' : 'text-neutral-800'}`}>
          PROPERTIES
        </span>
      </div>
    </div>
  );
};
