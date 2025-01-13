export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Temel sayfa görüntüleme
export const pageView = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Özel event gönderme
export const sendEvent = ({
  action,
  category,
  label,
  value,
  ...otherProps
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: any;
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...otherProps,
    });
  }
};