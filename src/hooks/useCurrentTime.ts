'use client';

import { useState, useEffect } from 'react';
import { formatTime } from '@/lib/utils';

/**
 * Custom hook to get current time that updates every minute
 */
export function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Set initial time after component mounts (not during effect)
    const initialTime = formatTime(new Date());
    
    // Use setTimeout to defer the state update
    const initialTimer = setTimeout(() => {
      setCurrentTime(initialTime);
    }, 0);

    // Update every minute
    const interval = setInterval(() => {
      setCurrentTime(formatTime(new Date()));
    }, 60000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return currentTime;
}