import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Kata, BeltLevel, VideoProgress } from '@/types';

interface AppStore extends AppState {
  setKatas: (katas: Kata[]) => void;
  toggleFavorite: (kataId: string) => void;
  setSearchTerm: (term: string) => void;
  setSelectedBelts: (belts: BeltLevel[]) => void;
  toggleShowFavoritesOnly: () => void;
  toggleDarkMode: () => void;
  setCurrentKata: (kata: Kata | null) => void;
  getFilteredKatas: () => Kata[];
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  updateVideoProgress: (kataId: string, currentTime: number, duration: number) => void;
  getVideoProgress: (kataId: string) => VideoProgress | null;
  markVideoCompleted: (kataId: string) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      katas: [],
      favorites: [],
      searchTerm: '',
      selectedBelts: [],
      showFavoritesOnly: false,
      isDarkMode: false,
      currentKata: null,
      isSidebarOpen: false,
      videoProgress: {},

      setKatas: (katas) => set({ katas }),
      
      toggleFavorite: (kataId) => set((state) => ({
        favorites: state.favorites.includes(kataId)
          ? state.favorites.filter(id => id !== kataId)
          : [...state.favorites, kataId]
      })),

      setSearchTerm: (searchTerm) => set({ searchTerm }),
      
      setSelectedBelts: (selectedBelts) => set({ selectedBelts }),
      
      toggleShowFavoritesOnly: () => set((state) => ({
        showFavoritesOnly: !state.showFavoritesOnly
      })),
      
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      
      setCurrentKata: (currentKata) => set({ currentKata }),

      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      closeSidebar: () => set({ isSidebarOpen: false }),

      updateVideoProgress: (kataId, currentTime, duration) => set((state) => {
        const watchedPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
        const completed = watchedPercentage >= 90; // Considerado completado al 90%
        
        return {
          videoProgress: {
            ...state.videoProgress,
            [kataId]: {
              kataId,
              currentTime,
              duration,
              watchedPercentage,
              lastWatched: new Date().toISOString(),
              completed
            }
          }
        };
      }),

      getVideoProgress: (kataId) => {
        const { videoProgress } = get();
        return videoProgress[kataId] || null;
      },

      markVideoCompleted: (kataId) => set((state) => {
        const progress = state.videoProgress[kataId];
        if (progress) {
          return {
            videoProgress: {
              ...state.videoProgress,
              [kataId]: {
                ...progress,
                completed: true,
                watchedPercentage: 100
              }
            }
          };
        }
        return state;
      }),

      getFilteredKatas: () => {
        const { katas, searchTerm, selectedBelts, showFavoritesOnly, favorites } = get();
        
        return katas.filter(kata => {
          const matchesSearch = kata.kataName.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesBelt = selectedBelts.length === 0 || selectedBelts.includes(kata.beltLevel);
          const matchesFavorites = !showFavoritesOnly || favorites.includes(kata.id);
          
          return matchesSearch && matchesBelt && matchesFavorites;
        }).sort((a, b) => {
          if (a.beltLevel !== b.beltLevel) {
            return a.beltLevel.localeCompare(b.beltLevel);
          }
          return a.order - b.order;
        });
      }
    }),
    {
      name: 'wko-katas-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        isDarkMode: state.isDarkMode,
        videoProgress: state.videoProgress
      })
    }
  )
);