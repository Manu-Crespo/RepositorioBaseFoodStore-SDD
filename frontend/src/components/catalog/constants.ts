/** Constants for catalog components. */

import type { Allergen } from '../../shared/types';

export const ALLERGEN_LABELS: Record<Allergen, string> = {
  gluten: 'Gluten',
  crustaceans: 'Crustáceos',
  eggs: 'Huevos',
  fish: 'Pescado',
  peanuts: 'Cacahuetes',
  soybeans: 'Soja',
  milk: 'Leche',
  nuts: 'Frutos secos',
  celery: 'Apio',
  mustard: 'Mostaza',
  sesame: 'Sésamo',
  sulphites: 'Sulfitos',
  lupin: 'Lupino',
  mollusks: 'Moluscos',
};

export const ALLERGEN_OPTIONS = Object.entries(ALLERGEN_LABELS).map(([value, label]) => ({
  value: value as Allergen,
  label,
}));