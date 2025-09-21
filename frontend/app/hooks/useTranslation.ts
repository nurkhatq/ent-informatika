'use client';

import { useRouter } from 'next/router';
import { useTranslation as useNextTranslation } from 'next-i18next';

export const useTranslation = () => {
  const router = useRouter();
  const { t, i18n } = useNextTranslation('common');
  
  const changeLanguage = (locale: string) => {
    router.push(router.asPath, router.asPath, { locale });
  };

  return {
    t,
    i18n,
    changeLanguage,
    currentLanguage: router.locale || 'kk'
  };
};

