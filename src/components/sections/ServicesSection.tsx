'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { SERVICES } from '@/lib/constants';
import Modal from '@/components/ui/Modal';

export default function ServicesSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const updateCardProgress = useCallback((cardIndex: number, progress: number) => {
    const card = cardRefs.current[cardIndex];
    if (card) {
      card.style.setProperty('--progress', String(progress));
    }
  }, []);

  // Initialize cards on mount
  useEffect(() => {
    cardRefs.current.forEach((_, index) => {
      updateCardProgress(index, 0);
    });
  }, [updateCardProgress]);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;

      if (sectionTop <= 0 && sectionTop > -sectionHeight + windowHeight) {
        const progress = Math.abs(sectionTop) / (sectionHeight - windowHeight);
        setScrollProgress(Math.min(Math.max(progress, 0), 1));
      } else if (sectionTop > 0) {
        setScrollProgress(0);
      } else {
        setScrollProgress(1);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Update card progress
  useEffect(() => {
    const card1Progress = Math.min(scrollProgress * 3, 1);
    const card2Progress = Math.min(Math.max((scrollProgress - 0.33) * 3, 0), 1);
    const card3Progress = Math.min(Math.max((scrollProgress - 0.66) * 3, 0), 1);

    updateCardProgress(0, card1Progress);
    updateCardProgress(1, card2Progress);
    updateCardProgress(2, card3Progress);
  }, [scrollProgress, updateCardProgress]);

  return (
    <div ref={sectionRef} id="services" className="relative bg-gray-50" style={{ height: '400vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="relative h-full w-full flex items-center justify-center p-8 md:p-16">
          {SERVICES.map((service, index) => (
            <div
              key={service.id}
              ref={el => { cardRefs.current[index] = el; }}
              className={`card-${index + 1} absolute ${service.bgColor} rounded-3xl shadow-2xl transition-all duration-300 ease-out`}
              style={{
                width: 'calc(100% - 2cm)',
                height: 'calc(100% - 4cm)',
                maxWidth: '1400px',
                zIndex: index + 1,
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
              }}
            >
              <div className="h-full flex flex-col lg:flex-row overflow-hidden rounded-3xl">
                <div className="flex-1 p-6 md:p-12 lg:p-16 flex flex-col justify-center relative z-10">
                  <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                    {service.title}
                  </h2>
                  <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8 max-w-xl leading-relaxed pl-1 md:pl-2">
                    {service.description}
                  </p>
                  <div className="pl-1 md:pl-2">
                    <Modal
                      title={service.title}
                      trigger={
                        <span className="group relative inline-flex items-center gap-2 px-6 py-2 rounded-full bg-black/70 hover:bg-black/80 backdrop-blur-md border border-black/50 hover:border-black/70 transition-all duration-300 text-white text-sm font-medium">
                          <span>Detail</span>
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      }
                    >
                      <ul className="space-y-3">
                        {service.details.map((detail, idx) => (
                          <li key={idx} className="text-white/90 flex items-start gap-3">
                            <span className="text-white/60 text-lg leading-relaxed mt-0.5">•</span>
                            <p className="text-base md:text-lg leading-relaxed">{detail}</p>
                          </li>
                        ))}
                      </ul>
                    </Modal>
                  </div>
                </div>
                <div className="flex-1 relative overflow-hidden min-h-[300px] lg:min-h-0">
                  <div className="absolute inset-4 lg:inset-8">
                    <Image 
                      src={service.image}
                      alt={service.title}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover rounded-2xl shadow-xl"
                    />
                  </div>
                  <div className="absolute top-4 right-4 lg:top-8 lg:right-8 text-white text-6xl lg:text-9xl font-bold opacity-20 select-none">
                    0{service.id}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .card-1, .card-2, .card-3 {
          --progress: 0;
          --scale: calc(1 - var(--progress) * 0.05);
        }
        
        .card-1 {
          transform: scale(var(--scale)) translateY(0);
        }
        
        .card-2 {
          --translate-y: calc((1 - var(--progress)) * 100%);
          transform: scale(var(--scale)) translateY(var(--translate-y));
        }
        
        .card-3 {
          --translate-y: calc((1 - var(--progress)) * 100%);
          transform: scale(1) translateY(var(--translate-y));
        }
      `}</style>
    </div>
  );
}