import { pageView } from './ga-manager';

// URL path'lerini normalize et
const normalizeRoute = (path: string) => {
  // Dynamic ID'leri temizle (örn: /notes/123 -> /notes/:id)
  return path.replace(/\/[0-9a-f-]{36}/g, '/:id')
             .replace(/\/[0-9]+/g, '/:id');
};

// Her sayfa değişimini izle
export const trackPageView = (path: string) => {
  const normalizedPath = normalizeRoute(path);
  
  // Sayfa görüntülemeyi gönder
  pageView(normalizedPath);
  
  // Özel sayfaları izle
  trackSpecialPages(normalizedPath);
};

// Özel sayfaları izle (notes, planner vs.)
const trackSpecialPages = (path: string) => {
  const specialPages = {
    '/dashboard/notes': 'notes_view',
    '/dashboard/contents': 'contents_view',
    '/dashboard/calendar': 'calendar_view',
    '/dashboard/settings': 'settings_view'
  };

  const eventName = specialPages[path];
  if (eventName) {
    window.gtag('event', eventName, {
      page_path: path,
      page_title: document.title
    });
  }
};