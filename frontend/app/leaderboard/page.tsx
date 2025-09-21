// app/leaderboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { Container } from '../components/common/Container';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';
import { ExpandableLeaderboard } from '../components/leaderboard/ExpandableLeaderboard';
import { testApi, contextQuestionsApi, TestResult } from '../services/api';
import { useTranslation } from 'react-i18next';

const LeaderboardContainer = styled(Container)`
  padding: 2rem 1rem;
`;

const LeaderboardTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const LeaderboardDescription = styled.p`
  font-size: 1.1rem;
  color: var(--text-light);
  max-width: 800px;
  margin: 0 auto 2rem auto;
  text-align: center;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const LeaderboardCard = styled(Card)`
  margin-bottom: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const ErrorMessage = styled.div`
  background-color: rgba(231, 76, 60, 0.1);
  border: 1px solid var(--error-color);
  border-radius: 8px;
  padding: 1rem;
  color: var(--error-color);
  margin-bottom: 2rem;
  text-align: center;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: rgba(52, 152, 219, 0.05);
  
  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: var(--text-color);
    border-bottom: 1px solid var(--border-color);
  }
`;

const TableBody = styled.tbody`
  tr {
    &:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }
    
    &.current-user {
      background-color: rgba(52, 152, 219, 0.1);
    }
  }
  
  td {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: ${props => props.$active ? '600' : '400'};
  color: ${props => props.$active ? 'var(--primary-color)' : 'var(--text-color)'};
  border-bottom: 2px solid ${props => props.$active ? 'var(--primary-color)' : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--primary-color);
  }
  
  @media (max-width: 768px) {
    text-align: center;
    border-bottom: none;
    border-left: 3px solid ${props => props.$active ? 'var(--primary-color)' : 'transparent'};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 0;
  color: var(--text-light);
`;

interface TestLeaderboard {
  id: number;
  title: string;
  results: TestResult[];
}

// Функция для извлечения номера из названия теста
const extractTestNumber = (title: string): number => {
  // Ищем формат "X бөлім" или "X_" в начале названия, где X - число
  const match = title.match(/^(\d+)[\s_-]?/);
  return match ? parseInt(match[1], 10) : 999; // Если номер не найден, присваиваем большое число
};

// Функция для извлечения номера из контекстного теста
const extractContextTestNumber = (title: string): number => {
  // Ищем формат "X-нұсқа" или "нұсқа X" в названии, где X - число
  const match1 = title.match(/^(\d+)-нұсқа/);
  if (match1) return parseInt(match1[1], 10);
  
  const match2 = title.match(/нұсқа (\d+)/);
  if (match2) return parseInt(match2[1], 10);
  
  return 999; // Если номер не найден, присваиваем большое число
};

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'regular' | 'context' | 'random'>('regular');
  const [regularLeaderboards, setRegularLeaderboards] = useState<TestLeaderboard[]>([]);
  const [contextLeaderboards, setContextLeaderboards] = useState<TestLeaderboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isNameSet, studentName, isLoading } = useUser();
  const router = useRouter();
  const [randomLeaderboards, setRandomLeaderboards] = useState<TestResult[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoading && !isNameSet) {
      router.push('/register-name');
      return;
    }
    
    const fetchLeaderboards = async () => {
      try {
        // Получаем список тестов
        const testsData = await testApi.getTests();
        const tests = testsData.filter(test => test.id !== 9999);
        // Для каждого теста получаем рейтинг
        const regularLeaderboardsData = await Promise.all(
          tests.map(async (test) => {
            const results = await testApi.getTestLeaderboard(test.id);
            
            // Сортируем результаты по проценту и дате
            const sortedResults = [...results].sort((a, b) => {
              if (a.percentage !== b.percentage) {
                return b.percentage - a.percentage;
              }
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
            
            return {
              id: test.id,
              title: test.title,
              results: sortedResults
            };
          })
        );
        
        // Сортируем тесты по номеру раздела
        const sortedRegularLeaderboards = regularLeaderboardsData.sort((a, b) => {
          const aNum = extractTestNumber(a.title);
          const bNum = extractTestNumber(b.title);
          return aNum - bNum;
        });
        
        // Получаем список контекстных тестов
        const contextSets = await contextQuestionsApi.getQuestionSets();
        
        // Для каждого контекстного теста получаем рейтинг
        const contextLeaderboardsData = await Promise.all(
          contextSets.map(async (set) => {
            const results = await contextQuestionsApi.getLeaderboard(set.id);
            
            // Сортируем результаты по проценту и дате
            const sortedResults = [...results].sort((a, b) => {
              if (a.percentage !== b.percentage) {
                return b.percentage - a.percentage;
              }
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
            
            return {
              id: set.id,
              title: set.title,
              results: sortedResults
            };
          })
        );
        
        // Сортируем контекстные тесты по номеру варианта
        const sortedContextLeaderboards = contextLeaderboardsData.sort((a, b) => {
          const aNum = extractContextTestNumber(a.title);
          const bNum = extractContextTestNumber(b.title);
          return aNum - bNum;
        });
        
        setRegularLeaderboards(sortedRegularLeaderboards);
        setContextLeaderboards(sortedContextLeaderboards);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaderboards:', err);
        setError(t('leaderboard.error'));
        setLoading(false);
      }
    };
    
    const fetchRandomLeaderboard = async () => {
      try {
        const randomLeaderboardData = await testApi.getRandomTestLeaderboard();
        setRandomLeaderboards(randomLeaderboardData);
      } catch (err) {
        console.error('Error fetching random leaderboard:', err);
      }
    };
    
    if (isNameSet) {
      fetchLeaderboards();
      fetchRandomLeaderboard();
    }
  }, [isNameSet, router, isLoading, t]);

  if (isLoading) {
    return (
      <LoadingContainer>
        <Spinner size="40px" />
      </LoadingContainer>
    );
  }

  if (!isNameSet) {
    return (
      <LoadingContainer>
        <Spinner size="40px" />
      </LoadingContainer>
    );
  }
  
  return (
    <LeaderboardContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LeaderboardTitle>{t('leaderboard.title')}</LeaderboardTitle>
        <LeaderboardDescription>
          {t('leaderboard.description')}
        </LeaderboardDescription>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {loading ? (
          <LoadingContainer>
            <Spinner size="40px" />
          </LoadingContainer>
        ) : (
          <>
            <TabsContainer>
              <Tab 
                $active={activeTab === 'regular'} 
                onClick={() => setActiveTab('regular')}
              >
                {t('test.section_tests')}
              </Tab>
              <Tab 
                $active={activeTab === 'context'} 
                onClick={() => setActiveTab('context')}
              >
                {t('navigation.context_tests')}
              </Tab>
              <Tab 
                $active={activeTab === 'random'} 
                onClick={() => setActiveTab('random')}
              >
                {t('test.trial_test')}
              </Tab>
            </TabsContainer>
            
            {activeTab === 'regular' ? (
              regularLeaderboards.length === 0 ? (
                <EmptyState>
                  <p>{t('leaderboard.no_data')}</p>
                </EmptyState>
              ) : (
                regularLeaderboards.map((leaderboard) => (
                  <ExpandableLeaderboard
                    key={leaderboard.id}
                    title={leaderboard.title}
                    results={leaderboard.results}
                    currentUserName={studentName}
                    testNumberOrder={false} // Отключаем дополнительную сортировку, так как уже отсортировали
                  />
                ))
              )
            ) : activeTab === 'context' ? (
              contextLeaderboards.length === 0 ? (
                <EmptyState>
                  <p>{t('leaderboard.no_data')}</p>
                </EmptyState>
              ) : (
                contextLeaderboards.map((leaderboard) => (
                  <ExpandableLeaderboard
                    key={leaderboard.id}
                    title={leaderboard.title}
                    results={leaderboard.results}
                    currentUserName={studentName}
                    testNumberOrder={false} // Отключаем дополнительную сортировку, так как уже отсортировали
                  />
                ))
              )
            ) : (
              randomLeaderboards.length === 0 ? (
                <EmptyState>
                  <p>{t('leaderboard.no_data')}</p>
                </EmptyState>
              ) : (
                <LeaderboardCard>
                  <CardHeader>
                    <CardTitle>{t('test.trial_test')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <tr>
                            <th>{t('leaderboard.position')}</th>
                            <th>{t('leaderboard.student')}</th>
                            <th>{t('leaderboard.result')}</th>
                            <th>{t('leaderboard.completed_at')}</th>
                          </tr>
                        </TableHead>
                        <TableBody>
                          {randomLeaderboards.map((result, index) => {
                            const isCurrentUser = result.student_name === studentName;
                            const date = new Date(result.created_at);
                            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                            
                            return (
                              <tr key={result.id} className={isCurrentUser ? 'current-user' : ''}>
                                <td>{index + 1}</td>
                                <td>
                                  {result.student_name} {isCurrentUser && `(${t('leaderboard.you')})`}
                                </td>
                                <td>{result.percentage.toFixed(1)}%</td>
                                <td>{formattedDate}</td>
                              </tr>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </LeaderboardCard>
              )
            )}
          </>
        )}
      </motion.div>
    </LeaderboardContainer>
  );
}