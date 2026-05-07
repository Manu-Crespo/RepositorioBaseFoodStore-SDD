/** Product types for product-management (admin). */

import type { CategoryResponse } from './category';
import type { IngredientResponse } from './ingredient';

export interface ProductCreate {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_ids?: string[];
  ingredient_ids?: string[];
}

export interface ProductUpdate {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category_ids?: string[];
  ingredient_ids?: string[];
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  categories: CategoryResponse[];
  ingredients: IngredientResponse[];
  created_at: string;
  updated_at: string;
}

export interface ProductListResponse {
  data: ProductResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductFilter {
  category_id?: string;
  ingredient_id?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  page?: number;
  limit?: number;
  sort_by?: 'name' | 'price' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface ProductStockUpdate {
  stock: number;
  operation?: 'set' | 'add' | 'remove';
}