import type { Kata } from '@/types';

export const fetchKatas = async (): Promise<Kata[]> => {
  try {
    // Intentar API primero
    const response = await fetch('/api/katas');
    if (response.ok) {
      return await response.json();
    }
    throw new Error('API not available');
  } catch (error) {
    console.warn('API no disponible, usando datos locales:', error);
    // Fallback a datos locales
    const response = await fetch('/katas.json');
    if (!response.ok) {
      throw new Error('No se pudieron cargar los datos');
    }
    return await response.json();
  }
};

export const getVideoUrl = async (driveId: string): Promise<string> => {
  // En desarrollo, usar video de ejemplo
  if (import.meta.env?.DEV) {
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  }
  
  // En producción, usar proxy directo
  return `/api/proxy/${driveId}`;
};