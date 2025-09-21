// app/videos/page.tsx
'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { videos } from '../data/videos';
import { Container } from '../components/common/Container';
import { useTranslation } from 'react-i18next';

const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const VideoCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const Thumbnail = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .duration {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
  }
`;

const VideoInfo = styled.div`
  padding: 1rem;
`;

const VideoTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  line-height: 1.4;
`;

const VideoDescription = styled.p`
  font-size: 0.9rem;
  color: var(--text-light);
  line-height: 1.5;
  margin-bottom: 0.75rem;
`;

const VideoMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-light);
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PageDescription = styled.p`
  font-size: 1.1rem;
  color: var(--text-light);
  margin-bottom: 2rem;
  line-height: 1.6;
`;

export default function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const { t } = useTranslation();

  return (
    <Container style={{ padding: '2rem 1rem' }}>
      <PageTitle>{t('videos.title')}</PageTitle>
      <PageDescription>
        {t('videos.description')}
      </PageDescription>
      
      <VideosGrid>
        {videos.map((video) => (
          <VideoCard key={video.id} onClick={() => setSelectedVideo(video.id)}>
            <Thumbnail>
              <img src={video.thumbnail} alt={video.title} />
              <div className="duration">{video.duration}</div>
            </Thumbnail>
            <VideoInfo>
              <VideoTitle>{video.title}</VideoTitle>
              <VideoDescription>{video.description}</VideoDescription>
              <VideoMeta>
                <span>{video.views} көру</span>
                <span>{video.date}</span>
              </VideoMeta>
            </VideoInfo>
          </VideoCard>
        ))}
      </VideosGrid>
    </Container>
  );
}