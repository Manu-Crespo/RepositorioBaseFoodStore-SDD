/** Ingredient types for product-management. */

export type Allergen = 
  | 'gluten'
  | 'lacteos'
  | 'huevos'
  | 'pescado'
  | 'mariscos'
  | 'frutos_secos'
  | 'cacahuetes'
  | 'soja'
  | 'sesamo'
  | 'mostaza'
  | 'apio'
  | 'sulfitos'
  | 'altramuces'
  | 'moluscos'
  | 'vegetariano'
  | 'vegano';

export interface IngredientCreate {
  name: string;
  allergens: Allergen[];
}

export interface IngredientUpdate {
  name?: string;
  allergens?: Allergen[];
}

export interface IngredientResponse {
  id: string;
  name: string;
  allergens: Allergen[];
  created_at: string;
  updated_at: string;
}

export interface IngredientListResponse {
  data: IngredientResponse[];
  total: number;
  page: number;
  limit: number;
}