/** Catalogue types for public product catalogue. */

import type { CategoryResponse } from './category';
import type { Allergen } from './ingredient';

export interface IngredientSummary {
  id: string;
  name: string;
  is_allergen: boolean;
}

export interface CatalogueProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  categories: Pick<CategoryResponse, 'id' | 'name'>[];
  ingredients: IngredientSummary[];
  allergens: Allergen[];
  created_at: string;
  updated_at: string;
}

export interface CatalogueProductDetail extends CatalogueProduct {
  related_products: CatalogueProduct[];
}

export interface CatalogueProductListResponse {
  data: CatalogueProduct[];
  total: number;
  page: number;
  limit: number;
}

export interface CatalogueFilters {
  category_id?: string;
  exclude_allergens?: Allergen[];
  min_price?: number;
  max_price?: number;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: 'name' | 'price' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface CatalogueCategory {
  id: string;
  name: string;
  parent_id: string | null;
  product_count: number;
}

export interface CatalogueCategoryListResponse {
  data: CatalogueCategory[];
  total: number;
}

export interface AllergenInfo {
  id: Allergen;
  name: string;
}