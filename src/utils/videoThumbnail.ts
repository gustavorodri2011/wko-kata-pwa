export const getThumbnailFromDrive = async (driveId: string): Promise<string | null> => {
  try {
    const response = await fetch(`/api/thumbnail/${driveId}`);
    if (response.ok) {
      const { thumbnailUrl } = await response.json();
      return thumbnailUrl;
    }
    return null;
  } catch (error) {
    console.warn('Error fetching Drive thumbnail:', error);
    return null;
  }
};

export const generateThumbnail = (videoUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    video.crossOrigin = 'anonymous';
    video.currentTime = 1;

    video.onloadeddata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      
      const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
      resolve(thumbnail);
    };

    video.onerror = () => reject(new Error('Error loading video'));
    video.src = videoUrl;
    video.load();
  });
};

export const getThumbnailFromCache = (driveId: string): string | null => {
  return localStorage.getItem(`thumbnail_${driveId}`);
};

export const saveThumbnailToCache = (driveId: string, thumbnail: string): void => {
  try {
    localStorage.setItem(`thumbnail_${driveId}`, thumbnail);
  } catch (error) {
    console.warn('Could not save thumbnail to cache:', error);
  }
};