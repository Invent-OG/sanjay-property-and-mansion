import React, { useState } from 'react';
import { SanjayMansionPage } from './SanjayMansionPage';
import { EnquiryFab } from './EnquiryFab';
import { EnquiryModal, ScheduleVisitModal } from './Modals';

export function InteractiveMansion() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navigateToHome = () => {
    window.location.href = '/';
  };

  return (
    <>
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-neutral-900 text-white px-5 py-3 rounded-full shadow-2xl border border-neutral-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#d2f831]" />
          {toastMessage}
        </div>
      )}

      <SanjayMansionPage
        onBackToHome={navigateToHome}
        onOpenEnquiryModal={() => setIsEnquiryOpen(true)}
        onOpenScheduleModal={() => setIsScheduleOpen(true)}
      />

      {/* Quick Enquiry Floating Action Button */}
      <EnquiryFab onClick={() => setIsEnquiryOpen(true)} />

      {/* Modals */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />

      <ScheduleVisitModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
      />
    </>
  );
}

export default InteractiveMansion;
