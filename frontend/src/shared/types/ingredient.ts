/** Ingredient types for product-management. */

export type Allergen = 
  | 'gluten'
  | 'crustaceans'
  | 'eggs'
  | 'fish'
  | 'peanuts'
  | 'soybeans'
  | 'milk'
  | 'nuts'
  | 'celery'
  | 'mustard'
  | 'sesame'
  | 'sulphites'
  | 'lupin'
  | 'mollusks';

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