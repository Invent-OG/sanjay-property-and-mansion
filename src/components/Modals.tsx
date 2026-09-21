import React, { useState } from 'react';
import { X, MapPin, Check, Phone, Calendar, Search, FileText, ArrowUpRight, Bed, Utensils, Clock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CONTACT_CONFIG } from '../data/contact';
import { BrandLogo } from './BrandLogo';
import { leadStore, type LeadSource } from '../services/leadStore';
import { leadService } from '../services/leadService';

// =========================================================================
// 1. GENERAL ENQUIRY MODAL (Supports both Sanjay Properties & Mansion)
// =========================================================================
interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  source?: LeadSource;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  initialTopic,
  source = 'Sanjay Properties'
}) => {
  const isMansion = source === 'Sanjay Mansion';
  const defaultTopic = initialTopic || (isMansion ? 'Mansion Room Booking' : 'General Enquiry');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    topic: defaultTopic,
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save lead to Supabase & CRM store
    leadService.submitLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      source: source,
      enquiry_type: formData.topic,
      message: formData.message,
      preferred_accommodation: isMansion ? formData.topic : undefined
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setFormData({
        name: '',
        phone: '',
        email: '',
        topic: defaultTopic,
        message: ''
      });
    }, 2400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
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
                  <h3 className="font-bold text-sm sm:text-base leading-tight">
                    {isMansion ? 'Mansion Enquiry Desk' : 'Property Enquiry Desk'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#FFCC00]">
                    {isMansion ? 'Western Stay · Saravanampatti' : 'Sanjay Garden · Saravanampatti'}
                  </p>
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
                    Thank you for reaching out to {source}. Your enquiry is recorded in our desk and our team will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Full Name *
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
                        Phone Number *
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
                      Enquiry Category
                    </label>
                    {isMansion ? (
                      <select
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                      >
                        <option value="Mansion Room Booking">Room Booking / Availability</option>
                        <option value="Single Room Enquiry">Single Room (Deluxe) Stay</option>
                        <option value="Sharing Room (2/3/4 Bed)">Sharing Room (2/3/4 Bed)</option>
                        <option value="Meal Plan Enquiry">Meal Plan & Dining Options</option>
                        <option value="Corporate / Group Stay">Corporate / Group Stay</option>
                        <option value="General Mansion Enquiry">General Enquiry</option>
                      </select>
                    ) : (
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
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Message / Requirement (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder={
                        isMansion
                          ? 'Specify your move-in date, room preference or special requests...'
                          : 'Specific requirements or questions about Sanjay Garden...'
                      }
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <a
                      href={
                        isMansion
                          ? `https://wa.me/918056889900?text=Hi%20Sanjay%20Mansion,%20I%20would%20like%20to%20enquire%20about%20Western%20Stay%20rooms`
                          : `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=Hi%20Sanjay%20Properties,%20I%20would%20like%20to%20enquire%20about%20Sanjay%20Garden`
                      }
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

// =========================================================================
// 2. SCHEDULE VISIT MODAL
// =========================================================================
interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: LeadSource;
}

export const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({
  isOpen,
  onClose,
  source = 'Sanjay Properties'
}) => {
  const isMansion = source === 'Sanjay Mansion';
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('Morning (10:00 AM - 1:00 PM)');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();

    leadService.submitLead({
      name,
      phone,
      source,
      enquiry_type: 'Site Visit Request',
      preferred_date: date,
      time_slot: timeSlot,
      message: `Scheduled visit for ${isMansion ? 'Sanjay Mansion hostel inspection' : 'Sanjay Garden layout walkthrough'}`
    });

    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      onClose();
      setName('');
      setPhone('');
      setDate('');
    }, 2400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
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
                  <h3 className="font-bold text-base">
                    {isMansion ? 'Schedule a Mansion Visit' : 'Schedule a Site Visit'}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {isMansion ? 'Opp. KCT Tech Park, Saravanampatti' : 'Sanjay Garden, Saravanampatti'}
                  </p>
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
                    {isMansion
                      ? 'Our team will meet you at Western Stay – Sanjay Mansion.'
                      : 'Our team will meet you at Sanjay Garden, PNT Colony, Saravanampatti.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBook} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Preferred Date *
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
                      Your Name *
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
                      Phone Number *
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

// =========================================================================
// 3. MANSION ROOM BOOKING MODAL (Tailored for Western Stay Room & Meals)
// =========================================================================
interface MansionBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoomType?: string;
}

export const MansionBookingModal: React.FC<MansionBookingModalProps> = ({
  isOpen,
  onClose,
  initialRoomType = 'Single Room (Deluxe)'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    roomType: initialRoomType,
    mealPlan: 'Veg Plan (Monthly)',
    checkInDate: '',
    occupation: 'Working Professional',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    leadService.submitLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      source: 'Sanjay Mansion',
      enquiry_type: 'Mansion Room Booking',
      preferred_accommodation: formData.roomType,
      meal_plan: formData.mealPlan,
      preferred_date: formData.checkInDate,
      message: `Booking Request: ${formData.roomType} | ${formData.mealPlan} | Occupation: ${formData.occupation}. Note: ${formData.notes || 'None'}`
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setFormData({
        name: '',
        phone: '',
        email: '',
        roomType: initialRoomType,
        mealPlan: 'Veg Plan (Monthly)',
        checkInDate: '',
        occupation: 'Working Professional',
        notes: ''
      });
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 flex flex-col max-h-[92vh]"
          >
            {/* Header */}
            <div className="bg-neutral-950 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FFCC00] text-black flex items-center justify-center font-bold">
                  <Bed className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base leading-tight">Reserve Room / Stay</h3>
                  <p className="text-[11px] sm:text-xs text-[#FFCC00]">Western Stay – Sanjay Mansion</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <div className="p-5 sm:p-6 bg-white overflow-y-auto">
              {submitted ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#FFCC00] text-black flex items-center justify-center mb-3 shadow-md">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="text-lg font-bold text-neutral-900">Booking Request Submitted!</h4>
                  <p className="text-xs sm:text-sm text-neutral-500 max-w-xs mt-1">
                    Thank you! The Sanjay Mansion manager will contact you with room availability and payment details.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 90000 00000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Room Type
                      </label>
                      <select
                        value={formData.roomType}
                        onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none"
                      >
                        <option value="Single Room (Deluxe)">Single Room (₹7,500 - ₹8,000/mo)</option>
                        <option value="2 Sharing Room">2 Sharing Room (₹6,000 - ₹6,500/mo)</option>
                        <option value="3 Sharing Room">3 Sharing Room (₹5,200 - ₹5,500/mo)</option>
                        <option value="4 Sharing Room">4 Sharing Room (₹4,900/mo)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Meal Plan
                      </label>
                      <select
                        value={formData.mealPlan}
                        onChange={(e) => setFormData({ ...formData, mealPlan: e.target.value })}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none"
                      >
                        <option value="Veg Plan (Monthly)">Veg Plan (₹3,600 / mo)</option>
                        <option value="Non-Veg Plan (Monthly)">Non-Veg Plan (₹3,800 / mo)</option>
                        <option value="Weekly Trial Plan">Weekly Trial Plan</option>
                        <option value="No Meal Plan">Room Only (No Food)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Expected Move-in Date
                      </label>
                      <input
                        type="date"
                        value={formData.checkInDate}
                        onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Resident Category
                      </label>
                      <select
                        value={formData.occupation}
                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none"
                      >
                        <option value="IT / Working Professional">IT / Working Professional</option>
                        <option value="College Student (KCT / SNS / Kumaraguru)">College Student</option>
                        <option value="Short Term / Business Visitor">Short Term Visitor</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Additional Requests / Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Need vehicle parking, ground floor preference, roommate preference..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-neutral-900 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <a
                      href="tel:8056889900"
                      className="text-xs font-semibold text-neutral-600 hover:text-black flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Desk: 8056889900</span>
                    </a>

                    <button
                      type="submit"
                      className="bg-[#FFCC00] text-black font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-full hover:bg-neutral-900 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      Confirm Booking Request
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

// =========================================================================
// 4. SEARCH MODAL
// =========================================================================
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
    { title: 'Western Stay – Sanjay Mansion Hostel & Rooms', tag: 'Opp. KCT Tech Park' },
    { title: 'PNT Colony, Saravanampatti Belt', tag: 'Location Connectivity' },
    { title: 'Residential Plots Dimensions', tag: 'Site Specifications' },
    { title: 'Coimbatore North Growth Corridor', tag: 'Regional Access' }
  ];

  const filtered = topics.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.tag.toLowerCase().includes(query.toLowerCase())
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

// =========================================================================
// 5. DETAIL MODAL
// =========================================================================
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
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
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
