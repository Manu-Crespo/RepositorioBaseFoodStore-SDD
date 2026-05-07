/** API client for ingredient management. */

import api from './client';
import type {
  IngredientCreate,
  IngredientUpdate,
  IngredientResponse,
  IngredientListResponse,
} from '../types';

export const ingredientsApi = {
  /** Get all ingredients with optional filters. */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    allergen?: string;
  }): Promise<IngredientListResponse> => {
    const { data } = await api.get('/api/admin/ingredients', { params });
    return data;
  },

  /** Get ingredient by ID. */
  getById: async (id: string): Promise<IngredientResponse> => {
    const { data } = await api.get(`/api/admin/ingredients/${id}`);
    return data;
  },

  /** Create a new ingredient. */
  create: async (ingredient: IngredientCreate): Promise<IngredientResponse> => {
    const { data } = await api.post('/api/admin/ingredients', ingredient);
    return data;
  },

  /** Update an ingredient. */
  update: async (id: string, ingredient: IngredientUpdate): Promise<IngredientResponse> => {
    const { data } = await api.put(`/api/admin/ingredients/${id}`, ingredient);
    return data;
  },

  /** Delete an ingredient (soft delete). */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/ingredients/${id}`);
  },

  /** Get ingredients filtered by allergen. */
  getByAllergen: async (allergen: string): Promise<IngredientResponse[]> => {
    const { data } = await api.get('/api/admin/ingredients', {
      params: { allergen },
    });
    return data.data;
  },
};

export default ingredientsApi;