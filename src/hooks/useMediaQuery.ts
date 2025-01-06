import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  // Server-side ve ilk render için varsayılan false
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  // Server-side rendering için ilk değer döndür
  if (!mounted) return false;

  return matches;
};