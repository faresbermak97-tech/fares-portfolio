'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FEATURES } from '@/lib/constants';
import Modal from '@/components/ui/Modal';

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleSlides, setVisibleSlides] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          if (entry.isIntersecting) {
            setVisibleSlides(prev => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.3 }
    );

    const slides = sectionRef.current?.querySelectorAll('.feature-slide');
    slides?.forEach(slide => observer.observe(slide));

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="features" 
      ref={sectionRef}
      className="relative w-full bg-[#f5f5f5]" 
      style={{ minHeight: '300vh' }}
    >
      {/* Timeline */}
      <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gray-300 -translate-x-1/2">
        <div className="sticky top-0 h-screen">
          <div className="absolute left-0 w-full bg-linear-to-b from-[#4D64FF] to-[#3d50cc]" 
               style={{ height: '33.33%' }} />
        </div>
      </div>
      
      {/* Timeline dots */}
      {[16.66, 50, 83.33].map((top, i) => (
        <div 
          key={i}
          className="absolute left-1/2 w-4 h-4 bg-[#4D64FF] rounded-full -translate-x-1/2 shadow-lg" 
          style={{ top: `${top}%` }} 
        />
      ))}

      {FEATURES.map((feature, i) => (
        <div
          key={i}
          data-index={i}
          className="feature-slide min-h-screen flex items-center justify-center px-6 md:px-12"
        >
          <div className={`max-w-7xl w-full grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-center ${
            feature.reverse ? 'lg:grid-flow-dense' : ''
          }`}>
            {/* Image */}
            <div 
              className={`${feature.reverse ? 'lg:col-start-3' : 'lg:col-start-1'} transition-all duration-1000 ${
                visibleSlides.has(i) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              <Image 
                src={feature.img}
                width={500} 
                height={400}
                alt={feature.highlight}
                className="w-full max-w-[500px] h-[400px] mx-auto object-cover rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Divider */}
            <div className="hidden lg:block w-0.5 h-[60%] bg-gray-300 rounded-sm mx-8" />
            
            {/* Text */}
            <div 
              className={`${feature.reverse ? 'lg:col-start-1' : 'lg:col-start-3'} transition-all duration-1000 delay-200 ${
                visibleSlides.has(i) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="text-[#4D64FF]">{feature.highlight}</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed max-w-[480px] mb-8">
                {feature.text}
              </p>
              <Modal
                title={feature.highlight}
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
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="text-white/90 flex items-start gap-3">
                      <span className="text-white/60 mt-1">•</span>
                      <p className="text-base md:text-lg leading-relaxed">{detail}</p>
                    </li>
                  ))}
                </ul>
              </Modal>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}