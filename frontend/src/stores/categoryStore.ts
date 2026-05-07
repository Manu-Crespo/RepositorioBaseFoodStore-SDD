/** Category store for admin management. */

import { create } from 'zustand';
import { categoriesApi } from '../shared/api/categories';
import type {
  CategoryCreate,
  CategoryUpdate,
  CategoryResponse,
  CategoryTree,
} from '../shared/types';

interface CategoryState {
  categories: CategoryResponse[];
  tree: CategoryTree[];
  currentCategory: CategoryResponse | null;
  isLoading: boolean;
  error: string | null;
}

interface CategoryActions {
  fetchCategories: (params?: { format?: 'flat' | 'tree'; parent_id?: string }) => Promise<void>;
  fetchTree: () => Promise<void>;
  fetchCategory: (id: string) => Promise<void>;
  createCategory: (category: CategoryCreate) => Promise<CategoryResponse>;
  updateCategory: (id: string, category: CategoryUpdate) => Promise<CategoryResponse>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategory: (id: string, order: number) => Promise<CategoryResponse>;
  setCurrentCategory: (category: CategoryResponse | null) => void;
  clearError: () => void;
}

export const useCategoryStore = create<CategoryState & CategoryActions>()(
  (set, get) => ({
    categories: [],
    tree: [],
    currentCategory: null,
    isLoading: false,
    error: null,

    fetchCategories: async (params) => {
      set({ isLoading: true, error: null });
      try {
        const data = await categoriesApi.getAll(params);
        if (params?.format === 'tree') {
          set({ tree: data as CategoryTree[], isLoading: false });
        } else {
          set({ categories: data as CategoryResponse[], isLoading: false });
        }
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },

    fetchTree: async () => {
      set({ isLoading: true, error: null });
      try {
        const data = await categoriesApi.getTree();
        set({ tree: data, isLoading: false });
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },

    fetchCategory: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const data = await categoriesApi.getById(id);
        set({ currentCategory: data, isLoading: false });
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },

    createCategory: async (category) => {
      set({ isLoading: true, error: null });
      try {
        const data = await categoriesApi.create(category);
        // Refresh list after create
        await get().fetchCategories();
        return data;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },

    updateCategory: async (id, category) => {
      set({ isLoading: true, error: null });
      try {
        const data = await categoriesApi.update(id, category);
        // Refresh list after update
        await get().fetchCategories();
        return data;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },

    deleteCategory: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await categoriesApi.delete(id);
        // Refresh list after delete
        await get().fetchCategories();
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },

    reorderCategory: async (id, order) => {
      set({ isLoading: true, error: null });
      try {
        const data = await categoriesApi.reorder(id, { order });
        // Refresh list after reorder
        await get().fetchCategories();
        return data;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },

    setCurrentCategory: (category) => set({ currentCategory: category }),

    clearError: () => set({ error: null }),
  })
);