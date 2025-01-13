'use client';

import { usePerformanceMonitoring } from '@/lib/analytics/usePerformanceMonitoring';

export default function PerformanceMonitor() {
  usePerformanceMonitoring();
  return null;
}