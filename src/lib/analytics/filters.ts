// Bot ve geçersiz trafiği filtrelemek için kurallar
export const isValidTraffic = () => {
  if (typeof window === 'undefined') return false;

  // Development ortamında izleme yapma
  if (process.env.NODE_ENV === 'development') return false;

  // Bot kontrolü
  const userAgent = window.navigator.userAgent.toLowerCase();
  const botPatterns = [
    'bot', 'crawler', 'spider', 'slurp', 'baiduspider',
    'yandexbot', 'facebookexternalhit', 'whatsapp'
  ];

  const isBot = botPatterns.some(pattern => userAgent.includes(pattern));
  if (isBot) return false;

  // Preview/Test URL'lerini kontrol et
  const hostname = window.location.hostname;
  if (hostname.includes('vercel.app') || 
      hostname.includes('localhost') || 
      hostname.includes('preview')) {
    return false;
  }

  return true;
};