import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import kkTranslations from '../../public/locales/kk/common.json';
import ruTranslations from '../../public/locales/ru/common.json';

const resources = {
  kk: {
    translation: kkTranslations
  },
  ru: {
    translation: ruTranslations
  }
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'kk', // default language
    fallbackLng: 'kk',
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    // Enable client-side language switching
    react: {
      useSuspense: false, // Disable suspense for better compatibility
    },
    
    // Preload all languages for instant switching
    preload: ['kk', 'ru'],
    
    // Save language preference (only on client)
    detection: typeof window !== 'undefined' ? {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    } : undefined,
  });

export default i18n;