import { useState, useEffect, useRef } from 'react';
import { X, Heart, ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';
import ReactPlayer from 'react-player';
import { useAppStore } from '@/store/useAppStore';
import { BELT_COLORS } from '@/utils/constants';
import { getVideoUrl } from '@/utils/api';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import type { Kata } from '@/types';

interface VideoModalProps {
  kata: Kata;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const VideoModal = ({ kata, onClose, onNext, onPrevious }: VideoModalProps) => {
  const { 
    favorites, 
    toggleFavorite, 
    updateVideoProgress, 
    getVideoProgress,
    isTheaterMode,
    toggleTheaterMode,
    autoPlayNext
  } = useAppStore();
  
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const playerRef = useRef<ReactPlayer>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const progress = getVideoProgress(kata.id);
  const isFavorite = favorites.includes(kata.id);

  useKeyboardShortcuts({
    onSpace: () => setIsPlaying(!isPlaying),
    onEscape: () => {
      if (isTheaterMode) {
        toggleTheaterMode();
      } else {
        onClose();
      }
    },
    onArrowLeft: () => onPrevious?.(),
    onArrowRight: () => onNext?.(),
    onF: () => toggleTheaterMode()
  });

  useEffect(() => {
    if (!isTheaterMode) return;
    
    const timer = setTimeout(() => setShowControls(false), 3000);
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timer);
      setTimeout(() => setShowControls(false), 3000);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isTheaterMode]);

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

  return (
    <div className={`fixed inset-0 z-50 ${
      isTheaterMode 
        ? 'bg-black' 
        : 'bg-black bg-opacity-75 flex items-center justify-center p-2 md:p-4'
    }`}>
      <div className={`${
        isTheaterMode 
          ? 'w-full h-full bg-black' 
          : `bg-white dark:bg-gray-900 rounded-lg w-full max-h-[95vh] md:max-h-[90vh] overflow-hidden ${
              isMobile ? 'max-w-full h-full' : 'max-w-4xl'
            }`
      }`}>
        <div className={`flex items-center justify-between p-3 md:p-4 transition-opacity duration-300 ${
          isTheaterMode 
            ? `absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent text-white ${
                showControls ? 'opacity-100' : 'opacity-0'
              }` 
            : 'border-b border-gray-200 dark:border-gray-700'
        }`}>
          <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
            <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
              isTheaterMode ? 'bg-white/20 text-white' : BELT_COLORS[kata.beltLevel]
            }`}>
              {isMobile ? kata.beltLevel.split(' ')[0] : kata.beltLevel}
            </span>
            <h2 className={`text-lg md:text-xl font-semibold truncate ${
              isTheaterMode ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              {kata.kataName}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleFavorite(kata.id)}
              className={`p-2 rounded-lg transition-colors ${
                isTheaterMode 
                  ? 'hover:bg-white/20 text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-current' : isTheaterMode ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
            </button>
            
            <button
              onClick={toggleTheaterMode}
              className={`p-2 rounded-lg transition-colors ${
                isTheaterMode 
                  ? 'hover:bg-white/20 text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title="Modo teatro (F)"
            >
              {isTheaterMode ? (
                <Minimize className={`h-5 w-5 ${isTheaterMode ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
              ) : (
                <Maximize className={`h-5 w-5 ${isTheaterMode ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
              )}
            </button>
            
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isTheaterMode 
                  ? 'hover:bg-white/20 text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <X className={`h-5 w-5 ${isTheaterMode ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
            </button>
          </div>
        </div>

        <div className={`bg-black relative ${
          isTheaterMode ? 'h-full' : 'aspect-video'
        }`}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : videoUrl ? (
            <>
              <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                width="100%"
                height="100%"
                controls={!isTheaterMode}
                playbackRate={playbackRate}
                playing={isPlaying}
                onReady={(player) => {
                  if (progress && progress.currentTime > 10 && !progress.completed) {
                    player.seekTo(progress.currentTime, 'seconds');
                  }
                }}
                onProgress={({ playedSeconds, loadedSeconds }) => {
                  if (playedSeconds > 0 && loadedSeconds > 0) {
                    updateVideoProgress(kata.id, playedSeconds, loadedSeconds);
                  }
                }}
                onDuration={(duration) => {
                  if (duration > 0) {
                    updateVideoProgress(kata.id, progress?.currentTime || 0, duration);
                  }
                }}
                onEnded={() => {
                  if (autoPlayNext && onNext) {
                    setTimeout(() => onNext(), 2000);
                  }
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
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
              
              {isTheaterMode && (
                <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
                  showControls ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="flex items-center justify-center space-x-4 text-white">
                    {onPrevious && (
                      <button onClick={onPrevious} className="p-2 hover:bg-white/20 rounded-full">
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                    )}
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)} 
                      className="p-3 hover:bg-white/20 rounded-full"
                    >
                      {isPlaying ? 'II' : '▶'}
                    </button>
                    {onNext && (
                      <button onClick={onNext} className="p-2 hover:bg-white/20 rounded-full">
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              <div className="text-center">
                <p className="mb-2">⚠️ Video no disponible</p>
                <p className="text-sm opacity-75">Verifica la configuración de Google Drive</p>
              </div>
            </div>
          )}
        </div>

        {!isTheaterMode && (
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
        )}
      </div>
    </div>
  );
};