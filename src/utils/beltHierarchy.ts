import { BeltLevel } from '../types';

export const BELT_HIERARCHY: BeltLevel[] = [
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

export const getBeltIndex = (belt: BeltLevel): number => {
  return BELT_HIERARCHY.indexOf(belt);
};

export const canAccessKata = (userBelt: BeltLevel, kataBelt: BeltLevel): boolean => {
  const userIndex = getBeltIndex(userBelt);
  const kataIndex = getBeltIndex(kataBelt);
  return userIndex >= kataIndex;
};

export const getAccessibleBelts = (userBelt: BeltLevel): BeltLevel[] => {
  const userIndex = getBeltIndex(userBelt);
  return BELT_HIERARCHY.slice(0, userIndex + 1);
};