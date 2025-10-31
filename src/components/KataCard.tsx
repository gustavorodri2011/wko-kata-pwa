import { Heart, Play, CheckCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { BELT_COLORS } from '@/utils/constants';
import { VideoThumbnail } from '@/components/VideoThumbnail';
import { ProgressBar } from '@/components/ProgressBar';
import type { Kata } from '@/types';

interface KataCardProps {
  kata: Kata;
  onClick: () => void;
}

export const KataCard = ({ kata, onClick }: KataCardProps) => {
  const { favorites, toggleFavorite, getVideoProgress } = useAppStore();
  const isFavorite = favorites.includes(kata.id);
  const progress = getVideoProgress(kata.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(kata.id);
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden"
      onClick={onClick}
    >
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-700">
        <VideoThumbnail 
          driveId={kata.driveId}
          kataName={kata.kataName}
          className="w-full h-full"
        />
        
        {/* Overlay de progreso */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-30">
          <div className="flex items-center space-x-2 text-white">
            {progress?.completed ? (
              <CheckCircle className="h-8 w-8" fill="currentColor" />
            ) : (
              <Play className="h-8 w-8" fill="currentColor" />
            )}
            {progress && !progress.completed && (
              <span className="text-sm font-medium">
                {Math.round(progress.watchedPercentage)}%
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all"
        >
          <Heart 
            className={`h-4 w-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
          />
        </button>

        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${BELT_COLORS[kata.beltLevel]}`}>
            {kata.beltLevel}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-gray-900 dark:text-white flex-1">
            {kata.kataName}
          </h3>
          {progress?.completed && (
            <CheckCircle className="h-4 w-4 text-green-500 ml-2 flex-shrink-0" />
          )}
        </div>
        
        {/* Barra de progreso */}
        {progress && progress.watchedPercentage > 0 && (
          <div className="mb-2">
            <ProgressBar progress={progress.watchedPercentage} />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {progress.completed ? 'Completado' : `${Math.round(progress.watchedPercentage)}% visto`}
              </span>
              {progress.currentTime > 0 && !progress.completed && (
                <span className="text-xs text-primary-600 dark:text-primary-400">
                  Continuar
                </span>
              )}
            </div>
          </div>
        )}
        
        {kata.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
            {kata.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {kata.category}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            #{kata.order}
          </span>
        </div>
      </div>
    </div>
  );
};