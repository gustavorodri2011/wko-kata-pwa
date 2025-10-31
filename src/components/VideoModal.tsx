import { useState, useEffect } from 'react';
import { X, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactPlayer from 'react-player';
import { useAppStore } from '@/store/useAppStore';
import { BELT_COLORS } from '@/utils/constants';
import { getVideoUrl } from '@/utils/api';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { Kata } from '@/types';

interface VideoModalProps {
  kata: Kata;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const VideoModal = ({ kata, onClose, onNext, onPrevious }: VideoModalProps) => {
  const { favorites, toggleFavorite, updateVideoProgress, getVideoProgress } = useAppStore();
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const progress = getVideoProgress(kata.id);

  const isFavorite = favorites.includes(kata.id);

  useEffect(() => {
    const loadVideo = async () => {
      setLoading(true);
      try {
        const url = await getVideoUrl(kata.driveId);
        setVideoUrl(url);
      } catch (error) {
        console.error('Error loading video:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [kata.driveId]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && onPrevious) onPrevious();
    if (e.key === 'ArrowRight' && onNext) onNext();
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrevious]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 md:p-4">
      <div className={`bg-white dark:bg-gray-900 rounded-lg w-full max-h-[95vh] md:max-h-[90vh] overflow-hidden ${
        isMobile ? 'max-w-full h-full' : 'max-w-4xl'
      }`}>
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
            <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${BELT_COLORS[kata.beltLevel]}`}>
              {isMobile ? kata.beltLevel.split(' ')[0] : kata.beltLevel}
            </span>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white truncate">
              {kata.kataName}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleFavorite(kata.id)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-400'}`} />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className={`bg-black ${
          isMobile ? 'aspect-video' : 'aspect-video'
        }`}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : videoUrl ? (
            <ReactPlayer
              url={videoUrl}
              width="100%"
              height="100%"
              controls
              playbackRate={playbackRate}
              playing={false}
              onReady={(player) => {
                // Continuar desde donde se quedó
                if (progress && progress.currentTime > 10 && !progress.completed) {
                  player.seekTo(progress.currentTime, 'seconds');
                }
              }}
              onProgress={({ played, playedSeconds, loaded, loadedSeconds }) => {
                // Actualizar progreso cada 5 segundos
                if (playedSeconds > 0 && loadedSeconds > 0) {
                  updateVideoProgress(kata.id, playedSeconds, loadedSeconds);
                }
              }}
              onDuration={(duration) => {
                // Actualizar duración cuando esté disponible
                if (duration > 0) {
                  updateVideoProgress(kata.id, progress?.currentTime || 0, duration);
                }
              }}
              onError={(error) => {
                console.error('Error reproduciendo video:', error);
              }}
              config={{
                file: {
                  attributes: {
                    controlsList: 'nodownload'
                  },
                  forceVideo: true
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              <div className="text-center">
                <p className="mb-2">⚠️ Video no disponible</p>
                <p className="text-sm opacity-75">Verifica la configuración de Google Drive</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 md:p-4">
          <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'} mb-4`}>
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-sm text-gray-600 dark:text-gray-400">Velocidad:</span>
              {[0.5, 0.75, 1, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setPlaybackRate(rate)}
                  className={`px-2 py-1 rounded text-xs md:text-sm ${
                    playbackRate === rate
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              {onPrevious && (
                <button
                  onClick={onPrevious}
                  className={`flex items-center space-x-1 px-2 md:px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {!isMobile && <span>Anterior</span>}
                </button>
              )}
              
              {onNext && (
                <button
                  onClick={onNext}
                  className={`flex items-center space-x-1 px-2 md:px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}
                >
                  {!isMobile && <span>Siguiente</span>}
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {kata.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Descripción
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {kata.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};