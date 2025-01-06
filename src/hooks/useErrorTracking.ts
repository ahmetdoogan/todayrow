export const useErrorTracking = () => {
  const trackError = (error: Error, errorInfo: { componentStack: string }) => {
    // GA4 Error Event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'error', {
        error_name: error.name,
        error_message: error.message,
        error_stack: error.stack,
        component_stack: errorInfo.componentStack,
      });
    }
    
    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
    }
  };

  return { trackError };
};