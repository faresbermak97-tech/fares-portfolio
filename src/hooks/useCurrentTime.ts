'use client';

import { useState, useEffect } from 'react';
import { formatTime } from '@/lib/utils';

/**
 * Custom hook to get current time that updates every minute
 */
export function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Set initial time
    setCurrentTime(formatTime(new Date()));

    // Update every minute
    const interval = setInterval(() => {
      setCurrentTime(formatTime(new Date()));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return currentTime;
}