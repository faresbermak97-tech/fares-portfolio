'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
}

export default function Modal({ trigger, title, children }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Restore focus when modal closes
  useEffect(() => {
    if (!isOpen && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [isOpen]);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    // Focus close button when modal opens
    closeButtonRef.current?.focus();

    // Handle ESC key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    // Handle Tab key for focus trap
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTab);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-label={`View details about ${title}`}
      >
        {trigger}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            ref={modalRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div
              className="relative w-full max-w-xl rounded-4xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glass Background */}
              <div className="absolute inset-0 bg-linear-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-3xl rounded-4xl border border-white/40" />
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 rounded-4xl opacity-40">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>

              {/* Close Button */}
              <button
                ref={closeButtonRef}
                onClick={() => setIsOpen(false)}
                aria-label="Close dialog"
                className="absolute top-6 right-6 z-20 p-3 rounded-full bg-black/70 hover:bg-black/80 backdrop-blur-lg border border-black/50 transition-all text-white hover:scale-110"
              >
                <X size={24} />
              </button>

              {/* Content */}
              <div className="relative z-10 p-8 md:p-12">
                <h2 id="modal-title" className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {title}
                </h2>
                <div className="h-1 w-24 bg-linear-to-r from-white/60 to-transparent rounded-full mb-6" />
                {children}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}