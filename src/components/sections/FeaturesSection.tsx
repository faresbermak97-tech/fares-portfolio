'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FEATURES } from '@/lib/constants';
import Modal from '@/components/ui/Modal';

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Use setTimeout to defer state update
    const timer = setTimeout(() => setIsReady(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const triggers: ScrollTrigger[] = [];
    const validSlides = slidesRef.current.filter(slide => slide !== null);
    
    if (validSlides.length === 0) return;

    validSlides.forEach((slide, slideIndex) => {
      const text = slide.querySelector(".slide-text") as HTMLElement;
      const img = slide.querySelector(".slide-img") as HTMLElement;

      if (!text || !img) return;

      gsap.set(text, { opacity: 0, x: 60 });
      gsap.set(img, { opacity: 0, x: -60 });

      const textTrigger = ScrollTrigger.create({
        trigger: slide,
        start: `${slideIndex * 100}vh center`,
        end: `${(slideIndex + 1) * 100}vh center`,
        onEnter: () => gsap.to(text, { opacity: 1, x: 0, duration: 1, ease: "power3.out" }),
        onLeaveBack: () => gsap.to(text, { opacity: 0, x: 60, duration: 1, ease: "power3.out" })
      });
      triggers.push(textTrigger);

      const imgTrigger = ScrollTrigger.create({
        trigger: slide,
        start: `${slideIndex * 100}vh center`,
        end: `${(slideIndex + 1) * 100}vh center`,
        onEnter: () => gsap.to(img, { opacity: 1, x: 0, duration: 1, ease: "power3.out" }),
        onLeaveBack: () => gsap.to(img, { opacity: 0, x: -60, duration: 1, ease: "power3.out" })
      });
      triggers.push(imgTrigger);
    });

    if (progressLineRef.current && sectionRef.current) {
      const progressTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        scrub: true,
        onUpdate: (self) => {
          if (progressLineRef.current) {
            gsap.set(progressLineRef.current, { height: `${self.progress * 100}%` });
          }
        }
      });
      triggers.push(progressTrigger);
    }

    return () => triggers.forEach(trigger => trigger.kill());
  }, [isReady]);

  return (
    <section id="features" className="relative w-full bg-[#f5f5f5]" style={{ height: '300vh' }} ref={sectionRef}>
      {/* Timeline */}
      <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gray-300 -translate-x-1/2 z-[1]">
        <div ref={progressLineRef} className="absolute top-0 left-0 w-full bg-gradient-to-b from-brand-primary to-brand-dark h-0" />
      </div>
      
      {/* Timeline dots */}
      <div className="absolute left-1/2 w-4 h-4 bg-brand-primary rounded-full -translate-x-1/2 z-[3] shadow-[0_0_15px_rgba(77,100,255,0.6)] animate-pulse" style={{ top: '16.66%' }} />
      <div className="absolute left-1/2 w-4 h-4 bg-brand-primary rounded-full -translate-x-1/2 z-[3] shadow-[0_0_15px_rgba(77,100,255,0.6)] animate-pulse" style={{ top: '50%' }} />
      <div className="absolute left-1/2 w-4 h-4 bg-brand-primary rounded-full -translate-x-1/2 z-[3] shadow-[0_0_15px_rgba(77,100,255,0.6)] animate-pulse" style={{ top: '83.33%' }} />

      {FEATURES.map((feature, i) => (
        <div
          key={i}
          ref={(el) => { if (el) slidesRef.current[i] = el; }}
          className={`grid items-center justify-center h-screen px-[6%] box-border ${
            feature.reverse ? 'grid-cols-[1fr_8px_1fr]' : 'grid-cols-[1fr_8px_1fr]'
          }`}
        >
          <div className={`flex justify-center items-center ${feature.reverse ? 'order-3' : 'order-1'}`}>
            <div className="slide-img">
              <Image 
                src={feature.img}
                width={500} 
                alt={feature.highlight}
                height={400}
                className="w-[90%] max-w-[500px] h-[400px] object-cover rounded-2xl shadow-[0_8px_32px_rgba(77,100,255,0.15)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_48px_rgba(77,100,255,0.25)]"
              />
            </div>
          </div>
          
          <div className={`w-0.5 h-[60%] bg-gray-300 rounded-sm mx-auto ${feature.reverse ? 'order-2' : 'order-2'}`} />
          
          <div className={`slide-text px-10 ${feature.reverse ? 'order-1' : 'order-3'}`}>
            <h2 className="text-[clamp(32px,5vw,56px)] font-bold text-[#0b1220] -mt-5 mb-6 leading-[1.2]">
              <span className="text-brand-primary">{feature.highlight}</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-[480px] mb-8">
              {feature.text}
            </p>
            <Modal
              title={feature.highlight}
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
                {feature.details.map((detail, idx) => (
                  <li key={idx} className="text-white/90 flex items-start gap-3">
                    <span className="text-white/60 text-lg leading-relaxed mt-0.5">•</span>
                    <p className="text-base md:text-lg leading-relaxed">{detail}</p>
                  </li>
                ))}
              </ul>
            </Modal>
          </div>
        </div>
      ))}

      <style jsx>{`
        @media (max-width: 900px) {
          div[class*="grid"] {
            grid-template-columns: 1fr !important;
            height: auto !important;
            padding: 80px 6% !important;
          }
          div[class*="order-"] {
            order: unset !important;
            text-align: center;
          }
          .slide-img img {
            width: 100%;
            max-width: 400px;
            height: auto;
          }
        }
      `}</style>
    </section>
  );
}