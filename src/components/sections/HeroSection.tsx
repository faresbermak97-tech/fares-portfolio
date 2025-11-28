'use client';

import { useEffect, useRef } from 'react';

export default function HeroSection() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    let scrollPosition = 0;
    let lastTime = 0;
    let animationId: number;

    const scroll = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      scrollPosition -= 0.15 * deltaTime;

      if (textElement) {
        textElement.style.transform = `translateX(${scrollPosition}px)`;
        if (Math.abs(scrollPosition) > textElement.scrollWidth / 2) {
          scrollPosition = 0;
        }
      }

      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section className="relative h-screen min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Skip Link for Accessibility */}
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-black text-white px-4 py-2 rounded"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <nav aria-label="Main navigation" className="absolute top-0 left-0 right-0 z-30 px-6 md:px-8 py-6 md:py-8 flex items-center justify-between">
        <div className="group cursor-default">
          <div className="bg-black/60 backdrop-blur-md rounded-full px-4 py-2 transition-all duration-300 group-hover:px-6">
            <span className="text-base md:text-lg text-white group-hover:hidden">© Code by Fares</span>
            <span className="text-base md:text-lg text-white hidden group-hover:inline">© Fares Bermak</span>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <a href="#services" className="group relative flex flex-col items-center">
            <div className="bg-black/60 backdrop-blur-md rounded-full px-5 py-2 hover:bg-black/80 transition-all">
              <span className="text-base md:text-lg text-white">Work</span>
            </div>
            <span className="mt-2 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </a>

          <a href="#about" className="group relative flex flex-col items-center">
            <div className="bg-black/60 backdrop-blur-md rounded-full px-5 py-2 hover:bg-black/80 transition-all">
              <span className="text-base md:text-lg text-white">About</span>
            </div>
            <span className="mt-2 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </a>

          <a href="#contact" className="group relative flex flex-col items-center">
            <div className="bg-black/60 backdrop-blur-md rounded-full px-5 py-2 hover:bg-black/80 transition-all">
              <span className="text-base md:text-lg text-white">Contact</span>
            </div>
            <span className="mt-2 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </a>
        </div>
      </nav>

      {/* Hero Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/My Pic.jpg"
          alt="Fares Bermak"
          className="w-full h-full object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-black/5"></div>
      </div>

      {/* Location Badge */}
      <div className="absolute -left-6 md:-left-18 top-1/2 -translate-y-1/2 z-20 hidden md:block">
        <div className="bg-black rounded-full px-8 py-2 flex items-center gap-5 shadow-lg">
          <div className="text-white text-sm leading-tight">
            <div>Located</div>
            <div>in</div>
            <div>Algeria</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 animate-spin-slow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="1.5"/>
              <path d="M2 12h20M12 2c2.5 2.5 4 6 4 10s-1.5 7.5-4 10M12 2C9.5 4.5 8 8 8 12s1.5 7.5 4 10" stroke="black" strokeWidth="1.5"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Badge Right */}
      <div className="absolute right-6 md:right-16 top-[25%] md:top-[30%] z-20">
        <div className="text-white text-lg md:text-2xl lg:text-3xl font-semibold leading-tight">
          <div>Remote Virtual Assistant</div>
          <div>& Data Entry</div>
        </div>
      </div>

      {/* Scroll Icon */}
      <div className="absolute right-6 md:right-12 lg:right-16 top-1/2 -translate-y-1/2 z-20 hidden sm:block">
        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center animate-bounce-slow">
          <svg width="24" height="24" viewBox="0 0 30 30" fill="none">
            <path d="M15 8L15 22M15 22L21 16M15 22L9 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Scrolling Big Text */}
      <div className="absolute bottom-12 sm:bottom-16 md:bottom-20 lg:bottom-24 left-0 right-0 z-10 w-full pointer-events-none overflow-hidden">
        <div
          ref={textRef}
          className="text-[18vw] sm:text-[15vw] md:text-[12vw] lg:text-[10vw] font-extrabold text-white/90 leading-none whitespace-nowrap inline-block will-change-transform tracking-tighter"
        >
          Fares Bermak — Fares Bermak — Fares Bermak — Fares Bermak — Fares Bermak — Fares Bermak —
        </div>
      </div>
    </section>
  );
}