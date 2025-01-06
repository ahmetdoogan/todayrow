import React from 'react';
import { useErrorTracking } from '@/hooks/useErrorTracking';

export default function ErrorBoundary({
  children
}: {
  children: React.ReactNode;
}) {
  const { trackError } = useErrorTracking();
  
  if (typeof window !== 'undefined') {
    window.onerror = (message, source, lineno, colno, error) => {
      if (error) {
        trackError(error, { componentStack: '' });
      }
    };
  }

  return <>{children}</>;
}