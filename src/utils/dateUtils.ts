import { useTranslations } from 'next-intl';

export function getFormatDate(locale: string) {
  return function formatDate(date: string) {
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
}

export function useDateFormatter() {
  const t = useTranslations('common');
  const locale = t('locales.dateFormat');
  
  return function formatDate(date: string) {
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
}