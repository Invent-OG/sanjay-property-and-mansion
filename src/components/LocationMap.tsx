import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  ArrowUpRight,
  Clock,
  Car,
  Building2,
  GraduationCap,
  Plane,
  Train,
  CheckCircle2
} from 'lucide-react';
import { CONTACT_CONFIG } from '../data/contact';

interface LocationMapProps {
  onOpenSchedule?: () => void;
  onOpenEnquiry?: () => void;
}

interface LandmarkItem {
  id: string;
  name: string;
  category: string;
  distance: string;
  driveTime: string;
  icon: React.ReactNode;
}

const LANDMARKS: LandmarkItem[] = [
  {
    id: 'it-chil',
    name: 'CHIL SEZ & Keeranatham IT Belt',
    category: 'IT & Technology Hub',
    distance: '4.5 km',
    driveTime: '8 mins',
    icon: <Building2 className="w-4 h-4 text-emerald-600" />
  },
  {
    id: 'it-kgisl',
    name: 'KGISL Tech Park Campus',
    category: 'Corporate & Tech Park',
    distance: '3.2 km',
    driveTime: '6 mins',
    icon: <Building2 className="w-4 h-4 text-sky-600" />
  },
  {
    id: 'sathy-rd',
    name: 'Sathy Road (NH 209) Arterial',
    category: 'National Highway Transit',
    distance: '1.2 km',
    driveTime: '3 mins',
    icon: <Car className="w-4 h-4 text-amber-600" />
  },
  {
    id: 'edu-kct',
    name: 'Kumaraguru Tech Campus (KCT)',
    category: 'Higher Education',
    distance: '2.8 km',
    driveTime: '5 mins',
    icon: <GraduationCap className="w-4 h-4 text-indigo-600" />
  },
  {
    id: 'transit-airport',
    name: 'Coimbatore Intl Airport (CJB)',
    category: 'Aviation Access',
    distance: '13 km',
    driveTime: '25 mins',
    icon: <Plane className="w-4 h-4 text-blue-600" />
  },
  {
    id: 'transit-cbe-north',
    name: 'Coimbatore North Junction',
    category: 'Rail Connectivity',
    distance: '11 km',
    driveTime: '20 mins',
    icon: <Train className="w-4 h-4 text-rose-600" />
  }
];

export const LocationMap: React.FC<LocationMapProps> = ({
  onOpenSchedule,
  onOpenEnquiry
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'it' | 'transit'>('all');

  const filteredLandmarks = LANDMARKS.filter((item) => {
    if (activeFilter === 'it') return item.id.startsWith('it-');
    if (activeFilter === 'transit') return item.id.startsWith('transit-') || item.id === 'sathy-rd';
    return true;
  });

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Saravanampatti, Coimbatore, Tamil Nadu 641035'
  )}`;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    'Saravanampatti, Coimbatore, Tamil Nadu 641035'
  )}`;

  return (
    <section
      id="location-map"
      aria-label="Location and Accessibility Map"
      className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12 gsap-fade">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-300 bg-white text-neutral-900 text-xs sm:text-sm font-semibold shadow-2xs uppercase tracking-wide mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FFCC00]" />
            <span>ACCESSIBILITY & VICINITY MAP</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-bold text-neutral-900 tracking-tight leading-tight">
            Prime Saravanampatti
            <br className="hidden sm:block" /> Location & Connectivity.
          </h2>
        </div>

        <div className="max-w-md">
          <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed font-normal">
            Situated in Coimbatore&apos;s prominent IT and educational corridor, Sanjay Garden offers rapid
            arterial links to Sathy Road, PNT Colony, tech hubs, and healthcare facilities.
          </p>
        </div>
      </div>

      {/* Main Grid: Map Embed + Key Vicinity Hubs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Column (lg:col-span-8): The Interactive Map Card */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-[28px] sm:rounded-[36px] border border-neutral-200/90 p-3 sm:p-5 shadow-xs overflow-hidden">
          {/* Map Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 py-2 sm:px-3 sm:py-2.5 mb-3 bg-neutral-50 rounded-[20px] sm:rounded-full border border-neutral-200/80">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-neutral-900 text-[#FFCC00] flex items-center justify-center shrink-0 shadow-2xs">
                <MapPin className="w-4 h-4 stroke-[2.4]" />
              </div>
              <div className="truncate">
                <span className="text-xs sm:text-sm font-bold text-neutral-900 block truncate">
                  Saravanampatti, Coimbatore
                </span>
                <span className="text-[10px] sm:text-[11px] text-neutral-500 font-medium block truncate">
                  {CONTACT_CONFIG.location.locality} · Pin: {CONTACT_CONFIG.location.pincode}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFCC00] text-black text-xs font-bold hover:bg-neutral-900 hover:text-white transition-all active:scale-95 shadow-2xs"
                title="Get driving directions in Google Maps"
              >
                <Navigation className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Directions</span>
              </a>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-neutral-300 text-neutral-800 text-xs font-semibold hover:bg-neutral-100 transition-all active:scale-95 shadow-2xs"
                title="Open full Google Maps interface"
              >
                <span>Full Map</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Interactive Map Iframe Container */}
          <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[500px] rounded-[22px] sm:rounded-[28px] overflow-hidden bg-neutral-100 border border-neutral-200/70">
            <iframe
              id="saravanampatti-location-iframe"
              title="Saravanampatti Coimbatore Geographic Location Map"
              src="https://maps.google.com/maps?q=Saravanampatti%2C%20Coimbatore%2C%20Tamil%20Nadu&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Subtle Map Legend Floating Badge */}
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 pointer-events-none">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-sm text-neutral-800 text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#FFCC00] animate-pulse" />
                <span>Sanjay Garden · Saravanampatti Area</span>
              </div>
            </div>
          </div>

          {/* Map Footnote Details */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 px-2 text-[11px] text-neutral-500">
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-neutral-400" />
              <span>S.F. No. 402/2pt, 402/3pt, 402/4pt · D.D.T.P / C.L.P.A No. 42/2008</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#65a30d]" />
              <span>Direct Road Access to PNT Colony Arterial Network</span>
            </div>
          </div>
        </div>

        {/* Right Column (lg:col-span-4): Proximity Metrics & Quick Actions */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-5 bg-neutral-50 rounded-[28px] sm:rounded-[36px] border border-neutral-200/90 p-5 sm:p-6 shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
                Nearby Key Hubs
              </h3>
              <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-500 bg-white px-2.5 py-1 rounded-full border border-neutral-200/80">
                PROXIMITY
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 mb-4 bg-white p-1 rounded-full border border-neutral-200/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`flex-1 py-1 px-2.5 rounded-full transition-all text-center ${
                  activeFilter === 'all'
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('it')}
                className={`flex-1 py-1 px-2.5 rounded-full transition-all text-center ${
                  activeFilter === 'it'
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                IT Parks
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('transit')}
                className={`flex-1 py-1 px-2.5 rounded-full transition-all text-center ${
                  activeFilter === 'transit'
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Transit
              </button>
            </div>

            {/* Landmark List */}
            <div className="space-y-2.5">
              {filteredLandmarks.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-white rounded-2xl border border-neutral-200/80 hover:border-neutral-300 transition-all flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-neutral-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-neutral-500 truncate">
                        {item.category}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-extrabold text-neutral-900">
                      {item.distance}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-neutral-500 font-medium">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span>{item.driveTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Callouts */}
          <div className="pt-2 border-t border-neutral-200/70 space-y-2.5">
            {onOpenSchedule && (
              <button
                type="button"
                onClick={onOpenSchedule}
                className="w-full py-2.5 px-4 rounded-full bg-neutral-950 text-white font-bold text-xs sm:text-sm hover:bg-neutral-800 active:scale-95 transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <span>Schedule a Guided Site Visit</span>
                <ArrowUpRight className="w-4 h-4 text-[#FFCC00]" />
              </button>
            )}

            {onOpenEnquiry && (
              <button
                type="button"
                onClick={onOpenEnquiry}
                className="w-full py-2.5 px-4 rounded-full bg-white border border-neutral-300 text-neutral-800 font-semibold text-xs sm:text-sm hover:bg-neutral-100 active:scale-95 transition-all shadow-2xs text-center"
              >
                Enquire for Route & Plot Details
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
