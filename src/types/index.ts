export type BeltLevel = 
  | 'Blanco' 
  | 'Naranja' 
  | 'Azul' 
  | 'Azul barra Amarillo' 
  | 'Amarillo' 
  | 'Amarillo barra Verde' 
  | 'Verde' 
  | 'Verde barra Marrón' 
  | 'Marrón' 
  | 'Marrón barra Negro' 
  | 'Negro 1er DAN'
  | 'Negro 2do DAN'
  | 'Negro 3er DAN'
  | 'Negro 4to DAN';

export type Category = 'Básicos' | 'Avanzados' | 'Superiores';

export interface Kata {
  id: string;
  kataName: string;
  beltLevel: BeltLevel;
  driveId: string;
  driveUrl: string;
  category: Category;
  order: number;
  description?: string;
}

export interface VideoProgress {
  kataId: string;
  currentTime: number;
  duration: number;
  watchedPercentage: number;
  lastWatched: string;
  completed: boolean;
}

export interface User {
  id: number;
  username: string;
  name: string;
  belt: BeltLevel;
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

export interface AppState {
  katas: Kata[];
  favorites: string[];
  searchTerm: string;
  selectedBelts: BeltLevel[];
  showFavoritesOnly: boolean;
  isDarkMode: boolean;
  currentKata: Kata | null;
  videoProgress: Record<string, VideoProgress>;
  auth: AuthState;
  users: User[];
}

export interface FilterState {
  searchTerm: string;
  selectedBelts: BeltLevel[];
  showFavoritesOnly: boolean;
}