'use client';

import { useEffect } from 'react';
import { initPerformanceMonitoring } from '@/lib/performance';

export function PerformanceSetup() {
  useEffect(() => {
    initPerformanceMonitoring();
  }, []);
  
  return null;
}