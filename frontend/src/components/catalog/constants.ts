/** Constants for catalog components. */

import type { Allergen } from '../../shared/types';

export const ALLERGEN_LABELS: Record<Allergen, string> = {
  gluten: 'Gluten',
  lacteos: 'Lácteos',
  huevos: 'Huevos',
  pescado: 'Pescado',
  mariscos: 'Mariscos',
  frutos_secos: 'Frutos secos',
  cacahuetes: 'Cacahuetes',
  soja: 'Soja',
  sesamo: 'Sésamo',
  mostaza: 'Mostaza',
  apio: 'Apio',
  sulfitos: 'Sulfitos',
  altramuces: 'Altramuces',
  moluscos: 'Moluscos',
  vegetariano: 'Vegetariano',
  vegano: 'Vegano',
};

export const ALLERGEN_OPTIONS = Object.entries(ALLERGEN_LABELS).map(([value, label]) => ({
  value: value as Allergen,
  label,
}));