import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { sendPerformanceMetrics } from './ga-manager';

export const usePerformanceMonitoring = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Sayfa yüklendiğinde performance metriklerini gönder
    if (document.readyState === 'complete') {
      sendPerformanceMetrics();
    } else {
      window.addEventListener('load', sendPerformanceMetrics);
      return () => window.removeEventListener('load', sendPerformanceMetrics);
    }
  }, [pathname]);
};