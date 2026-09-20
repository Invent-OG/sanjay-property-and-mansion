import React, { useState } from 'react';
import { SanjayMansionPage } from './SanjayMansionPage';
import { EnquiryFab } from './EnquiryFab';
import { EnquiryModal, ScheduleVisitModal, MansionBookingModal } from './Modals';

export function InteractiveMansion() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState('Single Room (Deluxe)');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navigateToHome = () => {
    window.location.href = '/';
  };

  const handleOpenBooking = (roomType?: string) => {
    if (roomType) {
      setSelectedRoomType(roomType);
    }
    setIsBookingOpen(true);
  };

  return (
    <>
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-neutral-900 text-white px-5 py-3 rounded-full shadow-2xl border border-neutral-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#FFCC00]" />
          {toastMessage}
        </div>
      )}

      <SanjayMansionPage
        onBackToHome={navigateToHome}
        onOpenEnquiryModal={() => setIsEnquiryOpen(true)}
        onOpenScheduleModal={() => setIsScheduleOpen(true)}
        onOpenBookingModal={handleOpenBooking}
      />

      {/* Quick Enquiry Floating Action Button */}
      <EnquiryFab onClick={() => setIsEnquiryOpen(true)} />

      {/* Modals specifically configured with source="Sanjay Mansion" */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        source="Sanjay Mansion"
      />

      <ScheduleVisitModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        source="Sanjay Mansion"
      />

      <MansionBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialRoomType={selectedRoomType}
      />
    </>
  );
}

export default InteractiveMansion;
