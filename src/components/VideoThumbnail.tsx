import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { getVideoUrl } from '@/utils/api';
import { getThumbnailFromDrive, generateThumbnail, getThumbnailFromCache, saveThumbnailToCache } from '@/utils/videoThumbnail';

interface VideoThumbnailProps {
  driveId: string;
  kataName: string;
  className?: string;
}

export const VideoThumbnail = ({ driveId, kataName, className = '' }: VideoThumbnailProps) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadThumbnail = async () => {
      try {
        // Verificar cache primero
        const cached = getThumbnailFromCache(driveId);
        if (cached) {
          setThumbnail(cached);
          setLoading(false);
          return;
        }

        // Intentar obtener thumbnail de Google Drive
        const driveThumbnail = await getThumbnailFromDrive(driveId);
        if (driveThumbnail) {
          setThumbnail(driveThumbnail);
          saveThumbnailToCache(driveId, driveThumbnail);
          return;
        }

        // Fallback: generar thumbnail desde video
        const videoUrl = await getVideoUrl(driveId);
        const thumbnailData = await generateThumbnail(videoUrl);
        
        setThumbnail(thumbnailData);
        saveThumbnailToCache(driveId, thumbnailData);
      } catch (err) {
        console.warn('Error generating thumbnail:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadThumbnail();
  }, [driveId]);

  if (loading) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center ${className}`}>
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      </div>
    );
  }

  if (error || !thumbnail) {
    return (
      <div className={`bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center ${className}`}>
        <div className="text-center text-white">
          <Play className="h-8 w-8 mx-auto mb-2" fill="currentColor" />
          <p className="text-xs font-medium">{kataName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img 
        src={thumbnail} 
        alt={`Thumbnail de ${kataName}`}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
          <Play className="h-5 w-5 text-white ml-1" fill="currentColor" />
        </div>
      </div>
    </div>
  );
};