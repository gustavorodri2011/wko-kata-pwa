import type { BeltLevel } from '@/types';

export const BELT_COLORS: Record<BeltLevel, string> = {
  'Blanco': 'bg-white text-gray-800 border border-gray-300',
  'Naranja': 'bg-orange-500 text-white',
  'Azul': 'bg-blue-500 text-white',
  'Azul barra Amarillo': 'bg-gradient-to-r from-blue-500 to-yellow-500 text-white',
  'Amarillo': 'bg-yellow-500 text-gray-800',
  'Amarillo barra Verde': 'bg-gradient-to-r from-yellow-500 to-green-500 text-white',
  'Verde': 'bg-green-500 text-white',
  'Verde barra Marrón': 'bg-gradient-to-r from-green-500 to-amber-700 text-white',
  'Marrón': 'bg-amber-700 text-white',
  'Marrón barra Negro': 'bg-gradient-to-r from-amber-700 to-black text-white',
  'Negro 1er DAN': 'bg-black text-white border border-yellow-400',
  'Negro 2do DAN': 'bg-black text-white border-2 border-yellow-400',
  'Negro 3er DAN': 'bg-black text-white border-4 border-yellow-400',
  'Negro 4to DAN': 'bg-black text-white border-4 border-red-500'
};

export const BELT_ORDER: BeltLevel[] = [
  'Blanco',
  'Naranja',
  'Azul',
  'Azul barra Amarillo',
  'Amarillo',
  'Amarillo barra Verde',
  'Verde',
  'Verde barra Marrón',
  'Marrón',
  'Marrón barra Negro',
  'Negro 1er DAN',
  'Negro 2do DAN',
  'Negro 3er DAN',
  'Negro 4to DAN'
];

// Mapeo de nombres de archivo a cinturones reales
export const BELT_FILE_MAPPING: Record<string, BeltLevel> = {
  'Blanco': 'Blanco',
  'Naranja': 'Naranja', 
  'Azul': 'Azul',
  'AzulAmarillo': 'Azul barra Amarillo',
  'Amarillo': 'Amarillo',
  'AmarilloVerde': 'Amarillo barra Verde',
  'Verde': 'Verde',
  'VerdeMarron': 'Verde barra Marrón',
  'Marron': 'Marrón',
  'MarronNegro': 'Marrón barra Negro',
  'Negro1Dan': 'Negro 1er DAN',
  'Negro2Dan': 'Negro 2do DAN',
  'Negro3Dan': 'Negro 3er DAN',
  'Negro4Dan': 'Negro 4to DAN'
};