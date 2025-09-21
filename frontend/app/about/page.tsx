// app/about/page.tsx
'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Container } from '../components/common/Container';

const AboutContainer = styled(Container)`
  padding: 2rem 1rem;
  max-width: 900px;
`;

const AboutTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const AboutSection = styled.section`
  margin-bottom: 3rem;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: var(--card-shadow);
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SectionContent = styled.div`
  font-size: 1.1rem;
  line-height: 1.7;
  
  p {
    margin-bottom: 1rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    padding-left: 1.5rem;
    position: relative;
    margin-bottom: 1rem;
    
    &:before {
      content: '✓';
      color: var(--secondary-color);
      position: absolute;
      left: 0;
      top: 0;
    }
  }
`;

const TechStack = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const TechItem = styled.div`
  background-color: rgba(52, 152, 219, 0.05);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: var(--primary-color);
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      margin-bottom: 0.5rem;
    }
  }
`;

export default function AboutPage() {
  const { t } = useTranslation();
  
  return (
    <AboutContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AboutTitle>{t('about.title')}</AboutTitle>
        
        <AboutSection>
          <SectionTitle>{t('about.goal.title')}</SectionTitle>
          <SectionContent>
            <p>
              {t('about.goal.description1')}
            </p>
            <p>
              {t('about.goal.description2')}
            </p>
          </SectionContent>
        </AboutSection>
        
        <AboutSection>
          <SectionTitle>{t('about.capabilities.title')}</SectionTitle>
          <SectionContent>
            <FeatureList>
              <li>
                <strong>{t('features.materials.title')}</strong> - {t('about.capabilities.materials')}
              </li>
              <li>
                <strong>{t('features.tests.title')}</strong> - {t('about.capabilities.tests')}
              </li>
              <li>
                <strong>{t('features.context_tests.title')}</strong> - {t('about.capabilities.context_tests')}
              </li>
              <li>
                <strong>{t('features.leaderboard.title')}</strong> - {t('about.capabilities.progress')}
              </li>
              <li>
                <strong>{t('features.videos.title')}</strong> - {t('about.capabilities.videos')}
              </li>
            </FeatureList>
          </SectionContent>
        </AboutSection>
        
        <AboutSection>
          <SectionTitle>{t('about.tech_stack.title')}</SectionTitle>
          <SectionContent>
            <p>{t('about.tech_stack.description')}</p>
            <p>
              {t('tech_stack.description_extra')}
            </p>
            
            <TechStack>
              <TechItem>
                <h3>{t('tech_stack.frontend')}</h3>
                <ul>
                  <li>{t('tech_stack.frontend_tech')}</li>
                </ul>
              </TechItem>
              
              <TechItem>
                <h3>{t('tech_stack.backend')}</h3>
                <ul>
                  <li>{t('tech_stack.backend_tech')}</li>
                </ul>
              </TechItem>
              
              <TechItem>
                <h3>{t('tech_stack.storage')}</h3>
                <ul>
                  <li>{t('tech_stack.storage_tech')}</li>
                </ul>
              </TechItem>
            </TechStack>
          </SectionContent>
        </AboutSection>
      </motion.div>
    </AboutContainer>
  );
}