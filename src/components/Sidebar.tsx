import { Heart, X, Play, SkipForward } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { BELT_COLORS, BELT_ORDER } from '@/utils/constants';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { BeltLevel } from '@/types';

export const Sidebar = () => {
  const { 
    selectedBelts, 
    setSelectedBelts, 
    showFavoritesOnly, 
    toggleShowFavoritesOnly,
    favorites,
    isSidebarOpen,
    closeSidebar,
    videoProgress,
    autoPlayNext,
    toggleAutoPlayNext
  } = useAppStore();
  
  const inProgressVideos = Object.values(videoProgress).filter(
    p => p.watchedPercentage > 0 && !p.completed
  ).length;
  
  const isMobile = useMediaQuery('(max-width: 768px)');

  const toggleBelt = (belt: BeltLevel) => {
    setSelectedBelts(
      selectedBelts.includes(belt)
        ? selectedBelts.filter(b => b !== belt)
        : [...selectedBelts, belt]
    );
    // Cerrar sidebar en móvil después de seleccionar
    if (isMobile) {
      setTimeout(() => closeSidebar(), 300);
    }
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        ${isMobile ? 'fixed' : 'relative'} 
        ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 
        h-full overflow-y-auto transition-transform duration-300 ease-in-out z-50
        ${isMobile ? 'top-0 left-0' : ''}
      `}>
      <div className="p-6">
        {/* Header móvil del sidebar */}
        {isMobile && (
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filtros</h2>
            <button
              onClick={closeSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        )}
        <div className="mb-6 space-y-3">
          <button
            onClick={toggleShowFavoritesOnly}
            className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              showFavoritesOnly
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            <span>Solo Favoritos ({favorites.length})</span>
          </button>
          
          {inProgressVideos > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                <Play className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Continuar viendo ({inProgressVideos})
                </span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Tienes videos sin terminar
              </p>
            </div>
          )}
          
          <button
            onClick={toggleAutoPlayNext}
            className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              autoPlayNext
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <SkipForward className={`h-4 w-4 ${autoPlayNext ? 'fill-current' : ''}`} />
            <span>Reproducción automática</span>
          </button>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Filtrar por Cinturón
          </h3>
          <div className="space-y-2">
            {BELT_ORDER.map((belt) => (
              <button
                key={belt}
                onClick={() => toggleBelt(belt)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  selectedBelts.includes(belt)
                    ? `${BELT_COLORS[belt]} ring-2 ring-primary-500`
                    : `${BELT_COLORS[belt]} opacity-60 hover:opacity-100`
                }`}
              >
                {belt}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setSelectedBelts([])}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </aside>
    </>
  );
};