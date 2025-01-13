import { sendEvent } from './ga-manager';

// Temel sayfa görüntüleme
export const trackPage = (path: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }
};

// Özellik kullanımı izleme
export const trackFeature = (
  feature: string,
  action: string,
  details: Record<string, any> = {}
) => {
  sendEvent({
    action: `${feature}_${action}`,
    category: 'feature',
    ...details
  });
};