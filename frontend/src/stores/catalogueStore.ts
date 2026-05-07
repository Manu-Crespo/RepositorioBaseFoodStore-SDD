/** Catalogue store for public product browsing (no auth required). */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { catalogueApi } from '../shared/api/catalogue';
import type {
  CatalogueProduct,
  CatalogueProductDetail,
  CatalogueFilters,
  CatalogueCategory,
  AllergenInfo,
} from '../shared/types';

interface CatalogueState {
  products: CatalogueProduct[];
  currentProduct: CatalogueProductDetail | null;
  categories: CatalogueCategory[];
  allergens: AllergenInfo[];
  total: number;
  page: number;
  limit: number;
  filters: CatalogueFilters;
  isLoading: boolean;
  error: string | null;
}

interface CatalogueActions {
  fetchProducts: (params?: CatalogueFilters) => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchAllergens: () => Promise<void>;
  setFilters: (filters: CatalogueFilters) => void;
  clearFilters: () => void;
  nextPage: () => void;
  prevPage: () => void;
  clearError: () => void;
}

const defaultFilters: CatalogueFilters = {
  page: 1,
  limit: 12,
  sort_by: 'created_at',
  sort_order: 'desc',
};

export const useCatalogueStore = create<CatalogueState & CatalogueActions>()(
  persist(
    (set, get) => ({
      products: [],
      currentProduct: null,
      categories: [],
      allergens: [],
      total: 0,
      page: 1,
      limit: 12,
      filters: defaultFilters,
      isLoading: false,
      error: null,

      fetchProducts: async (params) => {
        set({ isLoading: true, error: null });
        try {
          const filters = { ...get().filters, ...params };
          const data = await catalogueApi.getProducts(filters);
          set({
            products: data.data,
            total: data.total,
            page: data.page,
            limit: data.limit,
            filters,
            isLoading: false,
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      fetchProduct: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const data = await catalogueApi.getProduct(id);
          set({ currentProduct: data, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await catalogueApi.getCategories();
          set({ categories: data.data, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      fetchAllergens: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await catalogueApi.getAllergens();
          set({ allergens: data, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      setFilters: (filters) => {
        set({ filters: { ...get().filters, ...filters, page: 1 } }); // Reset to page 1 on filter change
      },

      clearFilters: () => set({ filters: defaultFilters }),

      nextPage: () => {
        const { page, limit, total } = get();
        if (page * limit < total) {
          set({ filters: { ...get().filters, page: page + 1 } });
          get().fetchProducts();
        }
      },

      prevPage: () => {
        const { page } = get();
        if (page > 1) {
          set({ filters: { ...get().filters, page: page - 1 } });
          get().fetchProducts();
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'catalogue-filters',
      partialize: (state) => ({ filters: state.filters }),
    }
  )
);