import React, { useState } from 'react';
import { X, MapPin, Check, Phone, Calendar, Search, FileText, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CONTACT_CONFIG } from '../data/contact';
import { BrandLogo } from './BrandLogo';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose, initialTopic }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    topic: initialTopic || 'General Enquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 flex flex-col max-h-[92vh]"
          >
            {/* Header */}
            <div className="bg-neutral-950 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <BrandLogo variant="white" size="sm" layout="horizontal" />
                <div className="h-6 w-px bg-white/20" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base leading-tight">Enquiry Desk</h3>
                  <p className="text-[11px] sm:text-xs text-[#FFCC00]">Sanjay Garden · Saravanampatti</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 bg-white overflow-y-auto">
              {submitted ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#FFCC00] text-black flex items-center justify-center mb-3 shadow-md">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="text-lg font-bold text-neutral-900">Enquiry Received</h4>
                  <p className="text-xs sm:text-sm text-neutral-500 max-w-xs mt-1">
                    Thank you for reaching out to Sanjay Properties. Our team will contact you regarding Sanjay Garden shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 90000 00000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="you@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Enquiry Topic
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                    >
                      <option value="General Enquiry">General Project Enquiry</option>
                      <option value="Plot Dimensions & Availability">Plot Dimensions & Availability</option>
                      <option value="Pricing & Commercial Terms">Pricing & Commercial Terms</option>
                      <option value="Layout Ref: 42/2008 & Survey Documents">Layout Ref: 42/2008 & Survey Documents</option>
                      <option value="Site Visit Request">Site Visit Request</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Message / Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specific requirements or questions about Sanjay Garden..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <a
                      href={`https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=Hi%20Sanjay%20Properties,%20I%20would%20like%20to%20enquire%20about%20Sanjay%20Garden`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-neutral-600 hover:text-black flex items-center gap-1.5"
                    >
                      <span>WhatsApp Direct</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="submit"
                      className="bg-[#FFCC00] text-black font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full hover:bg-neutral-900 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      Submit Enquiry
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({ isOpen, onClose }) => {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('Morning (10:00 AM - 1:00 PM)');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-200"
          >
            <div className="p-5 bg-neutral-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-[#FFCC00]" />
                <div>
                  <h3 className="font-bold text-base">Schedule a Site Visit</h3>
                  <p className="text-xs text-neutral-400">Sanjay Garden, Saravanampatti</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              {confirmed ? (
                <div className="py-6 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#FFCC00] text-black flex items-center justify-center mb-3">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="text-base font-bold text-neutral-900">Visit Scheduled</h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                    Our team will meet you at Sanjay Garden, PNT Colony, Saravanampatti.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBook} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Time Window
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 focus:outline-none"
                    >
                      <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                      <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                      <option value="Evening (4:00 PM - 6:30 PM)">Evening (4:00 PM - 6:30 PM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 90000 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#FFCC00] text-black font-bold text-xs sm:text-sm py-3 rounded-full hover:bg-neutral-900 hover:text-white transition-all shadow-sm active:scale-95 mt-2"
                  >
                    Confirm Site Visit
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topic: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectTopic }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const topics = [
    { title: 'Sanjay Garden Phase 1 Layout', tag: 'D.D.T.P / C.L.P.A No. 42/2008' },
    { title: 'Survey References: S.F. No. 402/2pt, 3pt, 4pt', tag: 'Cadastral Records' },
    { title: 'PNT Colony, Saravanampatti Belt', tag: 'Location Connectivity' },
    { title: 'Residential Plots Dimensions', tag: 'Site Specifications' },
    { title: 'Coimbatore North Growth Corridor', tag: 'Regional Access' }
  ];

  const filtered = topics.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase()) || t.tag.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/65 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-200"
      >
        <div className="p-4 border-b border-neutral-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search layout, survey records, or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 max-h-80 overflow-y-auto space-y-2">
          <div className="text-[11px] font-bold text-neutral-400 uppercase px-2 mb-1">
            Project Index
          </div>
          {filtered.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelectTopic(item.title);
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 text-left transition-colors text-xs sm:text-sm font-medium text-neutral-800"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-neutral-400" />
                <span>{item.title}</span>
              </div>
              <span className="text-[11px] text-[#65a30d] font-semibold">{item.tag}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

interface DetailModalProps {
  item: { title: string; image?: string; subtitle?: string } | null;
  onClose: () => void;
  onEnquire: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ item, onClose, onEnquire }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white rounded-[32px] overflow-hidden shadow-2xl border border-neutral-200 flex flex-col max-h-[90vh]"
      >
        {item.image && (
          <div className="relative h-60 sm:h-72 w-full bg-neutral-950">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="p-6 sm:p-8 overflow-y-auto">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFCC00] bg-black px-2.5 py-0.5 rounded-full inline-block mb-2">
                Sanjay Garden
              </span>
              <h3 className="text-2xl font-bold text-neutral-900">{item.title}</h3>
              {item.subtitle && <p className="text-xs sm:text-sm text-neutral-500 mt-1">{item.subtitle}</p>}
            </div>
            {!item.image && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5 p-4 rounded-2xl bg-[#f5f6f8] border border-neutral-200/60 text-center">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-bold">Location</span>
              <p className="text-xs sm:text-sm font-bold text-neutral-900">Saravanampatti</p>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-bold">Layout Ref</span>
              <p className="text-xs sm:text-sm font-bold text-neutral-900">42/2008</p>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-bold">Survey No</span>
              <p className="text-xs sm:text-sm font-bold text-neutral-900">402/2pt</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
            Sanjay Garden is a planned residential layout in Saravanampatti, Coimbatore North. Connect with Sanjay Properties to obtain comprehensive layout sheets, survey boundaries, and scheduling on-site visits.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => {
                onClose();
                onEnquire();
              }}
              className="w-full sm:flex-1 bg-[#FFCC00] text-black font-bold text-xs sm:text-sm py-3 rounded-full hover:bg-neutral-900 hover:text-white transition-all shadow-sm text-center"
            >
              Enquire About This Project
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-neutral-300 text-neutral-700 text-xs sm:text-sm font-semibold hover:bg-neutral-50 text-center"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
