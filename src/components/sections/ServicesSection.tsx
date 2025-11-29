'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { SERVICES } from '@/lib/constants';
import Modal from '@/components/ui/Modal';

export default function ServicesSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      // Calculate progress: 0 when section enters viewport, 1 when it leaves
      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        const progress = Math.abs(rect.top) / (sectionHeight - windowHeight);
        setScrollProgress(Math.min(Math.max(progress, 0), 1));
      } else if (rect.top > 0) {
        setScrollProgress(0);
      } else {
        setScrollProgress(1);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate individual card progress
  const getCardProgress = (index: number) => {
    const totalCards = SERVICES.length;
    const cardStart = index / totalCards;
    const cardEnd = (index + 1) / totalCards;
    
    if (scrollProgress < cardStart) return 0;
    if (scrollProgress > cardEnd) return 1;
    
    return (scrollProgress - cardStart) / (cardEnd - cardStart);
  };

  return (
    <div 
      ref={sectionRef} 
      id="services" 
      className="relative bg-gray-50" 
      style={{ height: '400vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="relative h-full w-full flex items-center justify-center p-4 md:p-8 lg:p-16">
          {SERVICES.map((service, index) => {
            const progress = getCardProgress(index);
            const scale = 1 - (1 - progress) * 0.05;
            const translateY = index === 2 ? 0 : (1 - progress) * 100;
            
            return (
              <div
                key={service.id}
                className={`absolute ${service.bgColor} rounded-3xl shadow-2xl`}
                style={{
                  width: 'min(calc(100% - 2rem), 1400px)',
                  height: 'min(calc(100% - 4rem), 800px)',
                  zIndex: SERVICES.length - index,
                  transform: `scale(${scale}) translateY(${translateY}%)`,
                  transition: 'transform 0.1s ease-out',
                }}
              >
                <div className="h-full flex flex-col lg:flex-row overflow-hidden rounded-3xl">
                  {/* Content */}
                  <div className="flex-1 p-6 md:p-12 lg:p-16 flex flex-col justify-center">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                      {service.title}
                    </h2>
                    <p className="text-base md:text-lg text-gray-700 mb-6 max-w-xl leading-relaxed">
                      {service.description}
                    </p>
                    <Modal
                      title={service.title}
                      trigger={
                        <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black/70 hover:bg-black/80 text-white text-sm font-medium transition-all cursor-pointer">
                          <span>View Details</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      }
                    >
                      <ul className="space-y-3">
                        {service.details.map((detail, idx) => (
                          <li key={idx} className="text-white/90 flex items-start gap-3">
                            <span className="text-white/60 mt-1">•</span>
                            <p className="text-base md:text-lg leading-relaxed">{detail}</p>
                          </li>
                        ))}
                      </ul>
                    </Modal>
                  </div>

                  {/* Image */}
                  <div className="flex-1 relative min-h-[300px]">
                    <div className="absolute inset-4 lg:inset-8">
                      <Image 
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover rounded-2xl shadow-xl"
                        priority={index === 0}
                      />
                    </div>
                    <div className="absolute top-4 right-4 lg:top-8 lg:right-8 text-white text-6xl lg:text-9xl font-bold opacity-20 select-none">
                      0{service.id}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}