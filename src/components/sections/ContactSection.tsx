'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { useCurrentTime } from '@/hooks/useCurrentTime';
import { CONTACT_INFO } from '@/lib/constants';
import type { FormStatus, Position } from '@/types';

export default function ContactSection() {
  const [formStatus, setFormStatus] = useState<FormStatus>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lineAnimated, setLineAnimated] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<Position>({ x: 0, y: 0 });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const currentTime = useCurrentTime();

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.style.transform = `translate(${buttonPosition.x}px, ${buttonPosition.y}px) translateY(-50%)`;
    }
  }, [buttonPosition]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setLineAnimated(true);
        });
      },
      { threshold: 0.3 }
    );

    const contactSection = document.getElementById('contact');
    if (contactSection) observer.observe(contactSection);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const contactData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormStatus({ type: 'error', message: data.error || 'Failed to send your message.' });
      } else {
        setFormStatus({ type: 'success', message: data.message || 'Message sent successfully!' });
        e.currentTarget.reset();
        setTimeout(() => {
          setIsFormOpen(false);
          document.body.style.overflow = 'auto';
        }, 2000);
      }
    } catch {
      setFormStatus({ type: 'error', message: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openForm = () => {
    setIsFormOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeForm = () => {
    setIsFormOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <section id="contact" className="relative bg-[#141414] text-white px-2 md:px-6 lg:px-8 pt-8 md:pt-16 pb-2">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-6 md:mb-8">
            <div className="mb-8 md:mb-12 lg:mb-16">
              <div className="flex items-center gap-6 md:gap-8 mb-2">
                <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-full overflow-hidden shrink-0 bg-gray-700">
                  <Image src="/images/Profiel-pic.jpg" alt="Fares Bermak" width={150} height={150} className="w-full h-full object-cover" />
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-none">
                  Let&apos;s work
                </h1>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-none">
                together
              </h1>
            </div>

            <div className="relative mb-8 md:mb-12">
              <div className="relative w-full h-px overflow-hidden">
                <div className={`h-full bg-white/30 origin-left transition-transform duration-700 ease-out ${lineAnimated ? 'scale-x-100' : 'scale-x-0'}`} />
              </div>

              <div className="hidden lg:block absolute right-8 xl:right-12 top-0">
                <button
                  ref={buttonRef}
                  onClick={openForm}
                  onMouseMove={(e) => {
                    const btn = buttonRef.current;
                    if (!btn) return;
                    const rect = btn.getBoundingClientRect();
                    const x = Math.max(-40, Math.min(40, e.clientX - rect.left - rect.width / 2));
                    const y = Math.max(-10, Math.min(10, e.clientY - rect.top - rect.height / 2));
                    setButtonPosition({ x: x * 0.8, y: y * 0.5 });
                  }}
                  onMouseLeave={() => setButtonPosition({ x: 0, y: 0 })}
                  className="w-40 h-40 lg:w-44 lg:h-44 rounded-full bg-brand-primary hover:bg-brand-dark flex items-center justify-center text-base lg:text-lg transition-all duration-300 hover:scale-105"
                  style={{ transform: 'translateY(-50%)' }}
                >
                  <span className="hover:animate-pulse">Get in touch</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="flex flex-col lg:flex-row items-start gap-6">
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                  <a href={`mailto:${CONTACT_INFO.email}`} className="group relative inline-block border border-white/40 rounded-full px-6 md:px-8 py-3 md:py-4 text-sm md:text-base overflow-hidden transition-all hover:border-brand-primary">
                    <span className="absolute inset-0 bg-brand-primary rounded-full scale-y-0 origin-bottom transition-transform duration-700 group-hover:scale-y-100" />
                    <span className="relative z-10 text-white">{CONTACT_INFO.email}</span>
                  </a>
                  <a href={`tel:${CONTACT_INFO.phone}`} className="group relative inline-block border border-white/40 rounded-full px-6 md:px-8 py-3 md:py-4 text-sm md:text-base overflow-hidden transition-all hover:border-brand-primary">
                    <span className="absolute inset-0 bg-brand-primary rounded-full scale-y-0 origin-bottom transition-transform duration-700 group-hover:scale-y-100" />
                    <span className="relative z-10 text-white">{CONTACT_INFO.phone}</span>
                  </a>
                </div>
                <button onClick={openForm} className="lg:hidden w-40 h-40 rounded-full bg-brand-primary hover:bg-brand-dark flex items-center justify-center text-base transition-all hover:scale-105">
                  Get in touch
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-2 mt-4 md:mt-6 pb-1">
            <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-6">
              <div className="flex flex-col sm:flex-row gap-6 md:gap-12">
                <div>
                  <h4 className="text-[10px] md:text-xs uppercase tracking-wider text-gray-500 mb-1">Version</h4>
                  <p className="text-sm md:text-base">2026 © Edition</p>
                </div>
                <div>
                  <h4 className="text-[10px] md:text-xs uppercase tracking-wider text-gray-500 mb-1">Local time</h4>
                  <p className="text-sm md:text-base">{currentTime} GMT+1</p>
                </div>
              </div>
              <div>
                <h4 className="text-[10px] md:text-xs uppercase tracking-wider text-gray-500 mb-1">Socials</h4>
                <div className="flex gap-6 md:gap-8">
                  <a href={CONTACT_INFO.social.instagram} target="_blank" rel="noopener noreferrer" className="group relative text-sm md:text-base">
                    <span className="inline-block transition-all group-hover:-translate-y-0.5">Instagram</span>
                    <span className="absolute left-0 bottom-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
                  </a>
                  <a href={CONTACT_INFO.social.linkedin} target="_blank" rel="noopener noreferrer" className="group relative text-sm md:text-base">
                    <span className="inline-block transition-all group-hover:-translate-y-0.5">LinkedIn</span>
                    <span className="absolute left-0 bottom-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-100 bg-black flex items-center justify-center p-6 md:p-12">
          <button onClick={closeForm} className="absolute top-6 right-6 md:top-12 md:right-12 text-white hover:opacity-60 transition-opacity text-4xl md:text-5xl">
            ×
          </button>
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-12 md:mb-16">Get in touch</h3>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-white text-sm mb-3 uppercase tracking-wider">Name</label>
                <input type="text" id="name" name="name" required className="w-full bg-transparent border-b border-white/30 text-white text-xl md:text-2xl py-3 focus:outline-none focus:border-white transition-colors" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-white text-sm mb-3 uppercase tracking-wider">Email</label>
                <input type="email" id="email" name="email" required className="w-full bg-transparent border-b border-white/30 text-white text-xl md:text-2xl py-3 focus:outline-none focus:border-white transition-colors" placeholder="your@email.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-white text-sm mb-3 uppercase tracking-wider">Message</label>
                <textarea id="message" name="message" required rows={5} className="w-full bg-transparent border-b border-white/30 text-white text-xl md:text-2xl py-3 focus:outline-none focus:border-white transition-colors resize-none" placeholder="Your message..." />
              </div>
              <div className="mt-8">
                {formStatus.type === 'success' && <div className="mb-4 p-4 rounded-lg bg-green-100 text-green-800">{formStatus.message}</div>}
                {formStatus.type === 'error' && <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-800">{formStatus.message}</div>}
                <button type="submit" disabled={isSubmitting} className="bg-white text-black px-12 py-4 rounded-full text-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}