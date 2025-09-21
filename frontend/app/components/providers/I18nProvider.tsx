'use client';

import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../lib/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Initialize language from localStorage on client
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage && (savedLanguage === 'kk' || savedLanguage === 'ru')) {
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
};
