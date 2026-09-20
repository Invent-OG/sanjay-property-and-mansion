import React, { useState } from 'react';
import { ArrowUpRight, Check, Copy, MapPin, Phone } from 'lucide-react';
import { CONTACT_CONFIG } from '../data/contact';

interface FooterProps {
  onNavClick: (id: string) => void;
  onOpenEnquiry: () => void;
  onOpenSchedule: () => void;
  onNavigateToMansion?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavClick,
  onOpenEnquiry,
  onOpenSchedule,
  onNavigateToMansion
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(CONTACT_CONFIG.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  return (
    <footer id="contact" className="w-full mt-12 bg-[#0c0d0e] text-white rounded-t-[32px] sm:rounded-t-[48px] overflow-hidden relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-12 lg:px-16 pt-12 sm:pt-20 pb-8 relative z-10">
        {/* Top Row: Email Ping & Newsletter Input */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-14">
          {/* Left Email Block */}
          <div>
            <span className="text-xs sm:text-sm text-neutral-400 font-semibold tracking-wider uppercase block mb-2">
              Ping us for project enquiries
            </span>
            <div
              onClick={handleCopyEmail}
              className="group flex flex-wrap items-center gap-2.5 sm:gap-3 cursor-pointer w-fit"
              title="Click to copy email address"
            >
              <h3 className="text-xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight group-hover:text-[#d2f831] transition-colors break-all sm:break-normal">
                {CONTACT_CONFIG.email}
              </h3>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:bg-[#d2f831] group-hover:text-black transition-all shrink-0">
                {copiedEmail ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </div>
            </div>
            {copiedEmail && (
              <span className="text-[11px] text-[#d2f831] font-semibold mt-1 block">
                Copied to clipboard!
              </span>
            )}
          </div>

          {/* Right Newsletter Input */}
          <div className="w-full md:w-auto">
            <span className="text-xs sm:text-sm text-neutral-400 font-semibold tracking-wider uppercase block mb-2">
              Stay Updated
            </span>
            <form
              onSubmit={handleSubscribe}
              className="flex items-center bg-[#18191b] border border-neutral-800 rounded-full p-1.5 pl-4 sm:pl-5 focus-within:border-neutral-600 transition-all w-full max-w-full sm:max-w-sm"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none w-full pr-2 font-medium"
              />
              <button
                type="submit"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#d2f831] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shrink-0"
                aria-label="Subscribe to updates"
              >
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
            {subscribed && (
              <span className="text-[11px] text-[#d2f831] font-medium mt-1.5 block">
                ✓ Thank you for connecting with Sanjay Properties!
              </span>
            )}
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-neutral-800/80 mb-10 sm:mb-12" />

        {/* Middle Row: Brand Info, Links & Office Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Brand Info & Description */}
          <div className="flex flex-col gap-3">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                onNavClick('hero');
              }}
              className="inline-block hover:opacity-90 transition-opacity"
            >
              <img
                src="/logo/logo-white.png"
                alt="Sanjay Properties"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </a>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mt-1">
              Building prime residential communities and managed living spaces in Saravanampatti, Coimbatore North.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Navigation
            </h4>
            <button
              onClick={() => onNavClick('hero')}
              className="text-xs sm:text-sm font-medium text-neutral-300 hover:text-[#d2f831] text-left transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => onNavClick('about')}
              className="text-xs sm:text-sm font-medium text-neutral-300 hover:text-[#d2f831] text-left transition-colors"
            >
              About Sanjay Properties
            </button>
            <button
              onClick={() => onNavClick('sanjay-garden')}
              className="text-xs sm:text-sm font-medium text-neutral-300 hover:text-[#d2f831] text-left transition-colors"
            >
              Sanjay Garden
            </button>
            <a
              href="/sanjay-mansion"
              onClick={(e) => {
                if (onNavigateToMansion) {
                  e.preventDefault();
                  onNavigateToMansion();
                }
              }}
              className="text-xs sm:text-sm font-medium text-neutral-300 hover:text-[#d2f831] text-left transition-colors flex items-center justify-between group"
            >
              <span>Sanjay Mansion</span>
              <span className="text-[10px] bg-[#d2f831] text-black font-extrabold px-1.5 py-0.5 rounded-sm">Stay</span>
            </a>
            <button
              onClick={() => onNavClick('location')}
              className="text-xs sm:text-sm font-medium text-neutral-300 hover:text-[#d2f831] text-left transition-colors"
            >
              Location Connectivity
            </button>
            <button
              onClick={() => onNavClick('faq')}
              className="text-xs sm:text-sm font-medium text-neutral-300 hover:text-[#d2f831] text-left transition-colors"
            >
              Frequently Asked Questions
            </button>
          </div>

          {/* Project Details */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Project Records
            </h4>
            <div className="text-xs text-neutral-300">
              <span className="text-neutral-500 block">Layout Reference:</span>
              <span className="font-semibold text-white">D.D.T.P / C.L.P.A No. 42/2008</span>
            </div>
            <div className="text-xs text-neutral-300">
              <span className="text-neutral-500 block">Survey References:</span>
              <span className="font-semibold text-white">S.F. No. 402/2pt, 402/3pt, 402/4pt</span>
            </div>
            <div className="text-xs text-neutral-300">
              <span className="text-neutral-500 block">Jurisdiction:</span>
              <span className="font-semibold text-white">Coimbatore North Corporation</span>
            </div>
          </div>

          {/* Office Address & Enquiries */}
          <div className="text-left flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Office Address
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              <strong className="text-white">Sanjay Properties</strong>
              <br />
              {CONTACT_CONFIG.location.fullAddress}
              <br />
              Landmark: {CONTACT_CONFIG.location.landmark}
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=Hi%20Sanjay%20Properties,%20I%20would%20like%20to%20enquire%20about%20Sanjay%20Garden`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-[#d2f831] hover:underline inline-flex items-center gap-1.5"
              >
                <span>WhatsApp Enquiry Desk</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Giant Artistic Watermark Typography across the lower footer */}
        <div className="select-none pointer-events-none w-full overflow-hidden flex justify-center sm:justify-start -mb-6 sm:-mb-10">
          <div className="text-[72px] sm:text-[140px] lg:text-[190px] font-black text-[#17191b] tracking-tighter leading-none whitespace-nowrap uppercase">
            SANJAY PROPERTIES
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} Sanjay Properties. All rights reserved.
          </div>
          <div>
            Layout Reference: 42/2008 · Saravanampatti, Coimbatore – 641035
          </div>
        </div>
      </div>
    </footer>
  );
};
