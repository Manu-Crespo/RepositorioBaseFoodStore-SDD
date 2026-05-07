/** Ingredient store for admin management. */

import { create } from 'zustand';
import { ingredientsApi } from '../shared/api/ingredients';
import type {
  IngredientCreate,
  IngredientUpdate,
  IngredientResponse,
} from '../shared/types';

interface IngredientState {
  ingredients: IngredientResponse[];
  currentIngredient: IngredientResponse | null;
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
}

interface IngredientActions {
  fetchIngredients: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    allergen?: string;
  }) => Promise<void>;
  fetchIngredient: (id: string) => Promise<void>;
  createIngredient: (ingredient: IngredientCreate) => Promise<IngredientResponse>;
  updateIngredient: (id: string, ingredient: IngredientUpdate) => Promise<IngredientResponse>;
  deleteIngredient: (id: string) => Promise<void>;
  setCurrentIngredient: (ingredient: IngredientResponse | null) => void;
  clearError: () => void;
}

export const useIngredientStore = create<IngredientState & IngredientActions>()(
  (set, get) => ({
    ingredients: [],
    currentIngredient: null,
    total: 0,
    page: 1,
    limit: 20,
    isLoading: false,
    error: null,

    fetchIngredients: async (params) => {
      set({ isLoading: true, error: null });
      try {
        const page = params?.page || 1;
        const limit = params?.limit || 20;
        const data = await ingredientsApi.getAll({
          page,
          limit,
          ...params,
        });
        set({
          ingredients: data.data,
          total: data.total,
          page: data.page,
          limit: data.limit,
          isLoading: false,
        });
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },

    fetchIngredient: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const data = await ingredientsApi.getById(id);
        set({ currentIngredient: data, isLoading: false });
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },

    createIngredient: async (ingredient) => {
      set({ isLoading: true, error: null });
      try {
        const data = await ingredientsApi.create(ingredient);
        // Refresh list after create
        await get().fetchIngredients({ page: get().page });
        return data;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },

    updateIngredient: async (id, ingredient) => {
      set({ isLoading: true, error: null });
      try {
        const data = await ingredientsApi.update(id, ingredient);
        // Refresh list after update
        await get().fetchIngredients({ page: get().page });
        return data;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },

    deleteIngredient: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await ingredientsApi.delete(id);
        // Refresh list after delete
        await get().fetchIngredients({ page: get().page });
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },

    setCurrentIngredient: (ingredient) => set({ currentIngredient: ingredient }),

    clearError: () => set({ error: null }),
  })
);