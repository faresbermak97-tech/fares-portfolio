'use client';

import { useEffect, useState, ReactNode } from 'react';
import { GREETINGS } from '@/lib/constants';

interface ClientProviderProps {
  children: ReactNode;
}

export default function ClientProvider({ children }: ClientProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [greetingIndex, setGreetingIndex] = useState(0);

  useEffect(() => {
    // Prevent scroll during loading
    document.body.style.overflow = 'hidden';
    
    // Ensure we start at top
    window.scrollTo(0, 0);

    // Cycle through greetings
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < GREETINGS.length) {
        setGreetingIndex(currentIndex);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          // Restore scroll after animation
          requestAnimationFrame(() => {
            document.body.style.overflow = '';
            window.scrollTo(0, 0);
          });
        }, 200);
      }
    }, 250);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = '';
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-9999 bg-black flex items-center justify-center">
        <div className="text-white text-4xl md:text-6xl font-bold">
          {GREETINGS[greetingIndex]}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}