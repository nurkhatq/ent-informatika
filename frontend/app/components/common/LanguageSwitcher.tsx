'use client';

import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import i18n from '../../lib/i18n';

const LanguageSwitcherContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LanguageButton = styled.button<{ $active: boolean }>`
  background: ${({ $active }) => $active ? 'var(--primary-color)' : 'transparent'};
  color: ${({ $active }) => $active ? 'white' : 'var(--text-color)'};
  border: 1px solid ${({ $active }) => $active ? 'var(--primary-color)' : 'var(--border-color)'};
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ $active }) => $active ? 'var(--primary-color)' : 'var(--primary-light)'};
    color: white;
  }
`;

export const LanguageSwitcher: React.FC = () => {
  const { i18n: i18nInstance } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18nInstance.changeLanguage(lng);
  };

  return (
    <LanguageSwitcherContainer>
      <LanguageButton 
        $active={i18nInstance.language === 'kk'} 
        onClick={() => changeLanguage('kk')}
      >
        Қазақша
      </LanguageButton>
      <LanguageButton 
        $active={i18nInstance.language === 'ru'} 
        onClick={() => changeLanguage('ru')}
      >
        Русский
      </LanguageButton>
    </LanguageSwitcherContainer>
  );
};

