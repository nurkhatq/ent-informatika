// app/components/layout/Header.tsx (исправленная версия)
'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

const HeaderContainer = styled.header`
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileNav = styled.nav<{ $isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1rem;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

// Используем $active вместо $active для styled-компонентов
const NavLink = styled(Link)<{ $active: boolean }>`
  color: ${({ $active }) => ($active ? 'var(--primary-color)' : 'var(--text-color)')};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  padding: 0.5rem;
  transition: all 0.2s ease;
  border-bottom: 2px solid ${({ $active }) => ($active ? 'var(--primary-color)' : 'transparent')};
  
  &:hover {
    color: var(--primary-color);
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem;
    width: 100%;
    border-bottom: 1px solid var(--border-color);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
  }
`;

const UserName = styled.span`
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const getNavItems = (t: (key: string) => string) => [
  { name: t('navigation.home'), href: '/' },
  { name: t('navigation.materials'), href: '/materials' },
  { name: t('navigation.videos'), href: '/videos' },
  { name: t('navigation.tests'), href: '/tests' },
  { name: t('navigation.context_tests'), href: '/context-tests' },
  { name: t('navigation.leaderboard'), href: '/leaderboard' },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { studentName, clearStudentName } = useUser();
  const { t } = useTranslation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo>
          <Link href="/">ENT Trainer</Link>
        </Logo>
        
        <Nav>
          {getNavItems(t).map((item) => (
            <NavLink 
              key={item.href} 
              href={item.href}
              $active={pathname === item.href}
            >
              {item.name}
            </NavLink>
          ))}
          
          <LanguageSwitcher />
          
          {studentName && (
            <UserInfo>
              <UserName>{t('hello')}, {studentName}!</UserName>
              <LogoutButton onClick={clearStudentName}>{t('logout')}</LogoutButton>
            </UserInfo>
          )}
        </Nav>
        
        <MobileMenuButton onClick={toggleMenu}>
          {isMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>
        
        <MobileNav $isOpen={isMenuOpen}>
          {getNavItems(t).map((item) => (
            <NavLink 
              key={item.href} 
              href={item.href}
              $active={pathname === item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}
          
          <LanguageSwitcher />
          
          {studentName && (
            <UserInfo>
              <UserName>{t('hello')}, {studentName}!</UserName>
              <LogoutButton onClick={() => {
                clearStudentName();
                setIsMenuOpen(false);
              }}>
                {t('logout')}
              </LogoutButton>
            </UserInfo>
          )}
        </MobileNav>
      </HeaderContent>
    </HeaderContainer>
  );
};