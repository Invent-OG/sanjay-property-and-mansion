import React from 'react';

// Geometric multi-pointed starburst / sunburst icon from "About Our Stories"
export const SunburstGraphic: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => {
  const points = 24;
  const pathData = Array.from({ length: points * 2 })
    .map((_, i) => {
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const r = i % 2 === 0 ? 48 : 22; // outer tip and inner notch
      const x = 50 + r * Math.cos(angle);
      const y = 50 + r * Math.sin(angle);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ') + ' Z';

  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
      <path d={pathData} />
    </svg>
  );
};

// Brand Partner Logos
export const PartnerLogo: React.FC<{ type: string; className?: string }> = ({ type, className = 'w-4 h-4' }) => {
  switch (type) {
    case 'invert':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3 A9 9 0 0 1 12 21 Z" fill="currentColor" />
        </svg>
      );
    case 'compass':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="9" />
          <polygon points="12,7 15,12 12,17 9,12" fill="currentColor" />
        </svg>
      );
    case 'glossy':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <rect x="4" y="4" width="7" height="7" rx="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" opacity="0.6" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" opacity="0.6" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" />
        </svg>
      );
    case 'starburst':
      return <SunburstGraphic className={className} />;
    case 'hues':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="8" cy="8" r="4" fill="currentColor" opacity="0.8" />
          <circle cx="16" cy="8" r="4" fill="currentColor" opacity="0.5" />
          <circle cx="12" cy="15" r="4" fill="currentColor" opacity="0.3" />
        </svg>
      );
    case 'snowflake':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" strokeLinecap="round" />
        </svg>
      );
    case 'apex':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9z" />
          <path d="M12 2v18M4 6.5l8 4.5 8-4.5" />
        </svg>
      );
    case 'flash':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'flow':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M4 8c4-4 8 4 12 0s8 4 4 4" strokeLinecap="round" />
          <path d="M4 14c4-4 8 4 12 0s8 4 4 4" strokeLinecap="round" />
        </svg>
      );
    case 'luminous':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="7" stroke="currentColor" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
          <circle cx="12" cy="3" r="1" fill="currentColor" />
          <circle cx="12" cy="21" r="1" fill="currentColor" />
          <circle cx="3" cy="12" r="1" fill="currentColor" />
          <circle cx="21" cy="12" r="1" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
};
