import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { LazyKataCard } from '@/components/LazyKataCard';
import { VideoModal } from '@/components/VideoModal';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';
import { fetchKatas } from '@/utils/api';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { Kata } from '@/types';

export const Home = () => {
  const { 
    setKatas, 
    getFilteredKatas, 
    currentKata, 
    setCurrentKata,
    closeSidebar
  } = useAppStore();
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredKatas = getFilteredKatas();

  useEffect(() => {
    const loadKatas = async () => {
      try {
        // Delay inicial para mejorar perceived performance
        await new Promise(resolve => setTimeout(resolve, 100));
        const data = await fetchKatas();
        setKatas(data);
      } catch (err) {
        setError('Error al cargar los katas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadKatas();
  }, [setKatas]);

  const handleKataClick = (kata: Kata) => {
    setCurrentKata(kata);
    // Cerrar sidebar en móvil al abrir video
    if (isMobile) {
      closeSidebar();
    }
  };

  const handleCloseModal = () => {
    setCurrentKata(null);
  };

  const handleNextKata = () => {
    if (!currentKata) return;
    const currentIndex = filteredKatas.findIndex(k => k.id === currentKata.id);
    const nextIndex = (currentIndex + 1) % filteredKatas.length;
    setCurrentKata(filteredKatas[nextIndex]);
  };

  const handlePreviousKata = () => {
    if (!currentKata) return;
    const currentIndex = filteredKatas.findIndex(k => k.id === currentKata.id);
    const previousIndex = currentIndex === 0 ? filteredKatas.length - 1 : currentIndex - 1;
    setCurrentKata(filteredKatas[previousIndex]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex relative">
        <Sidebar />
        
        <main className={`flex-1 p-4 md:p-6 ${isMobile ? 'w-full' : ''}`}>
          {filteredKatas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No se encontraron katas con los filtros seleccionados
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Katas ({filteredKatas.length})
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredKatas.map((kata) => (
                  <LazyKataCard
                    key={kata.id}
                    kata={kata}
                    onClick={() => handleKataClick(kata)}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {currentKata && (
        <VideoModal
          kata={currentKata}
          onClose={handleCloseModal}
          onNext={filteredKatas.length > 1 ? handleNextKata : undefined}
          onPrevious={filteredKatas.length > 1 ? handlePreviousKata : undefined}
        />
      )}
      
      <KeyboardShortcuts />
    </div>
  );
};