import { sendEvent, EventCategories } from './ga-manager';

// Basit page view tracking
export const trackPage = (path: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }
};