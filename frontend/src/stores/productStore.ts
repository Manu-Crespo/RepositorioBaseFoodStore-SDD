/** Product store for admin management. */

import { create } from 'zustand';
import { productsApi } from '../shared/api/products';
import type {
  ProductCreate,
  ProductUpdate,
  ProductResponse,
  ProductFilter,
} from '../shared/types';

interface ProductState {
  products: ProductResponse[];
  currentProduct: ProductResponse | null;
  total: number;
  page: number;
  limit: number;
  filters: ProductFilter;
  isLoading: boolean;
  error: string | null;
}

interface ProductActions {
  fetchProducts: (params?: ProductFilter) => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  createProduct: (product: ProductCreate) => Promise<ProductResponse>;
  updateProduct: (id: string, product: ProductUpdate) => Promise<ProductResponse>;
  deleteProduct: (id: string) => Promise<void>;
  updateStock: (id: string, quantity: number, operation: 'set' | 'add' | 'remove') => Promise<ProductResponse>;
  setFilters: (filters: ProductFilter) => void;
  clearFilters: () => void;
  setCurrentProduct: (product: ProductResponse | null) => void;
  clearError: () => void;
}

const defaultFilters: ProductFilter = {
  page: 1,
  limit: 20,
  sort_by: 'created_at',
  sort_order: 'desc',
};

export const useProductStore = create<ProductState & ProductActions>()(
  (set, get) => ({
    products: [],
    currentProduct: null,
    total: 0,
    page: 1,
    limit: 20,
    filters: defaultFilters,
    isLoading: false,
    error: null,

    fetchProducts: async (params) => {
      set({ isLoading: true, error: null });
      try {
        const filters = { ...get().filters, ...params };
        const data = await productsApi.getAll(filters);
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
        const data = await productsApi.getById(id);
        set({ currentProduct: data, isLoading: false });
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },

    createProduct: async (product) => {
      set({ isLoading: true, error: null });
      try {
        const data = await productsApi.create(product);
        // Refresh list after create
        await get().fetchProducts();
        return data;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },

    updateProduct: async (id, product) => {
      set({ isLoading: true, error: null });
      try {
        const data = await productsApi.update(id, product);
        // Refresh list after update
        await get().fetchProducts();
        return data;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },

    deleteProduct: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await productsApi.delete(id);
        // Refresh list after delete
        await get().fetchProducts();
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },

    updateStock: async (id, quantity, operation) => {
      set({ isLoading: true, error: null });
      try {
        const data = await productsApi.updateStock(id, { quantity, operation });
        // Update current product if it's the same
        if (get().currentProduct?.id === id) {
          set({ currentProduct: data });
        }
        // Refresh list
        await get().fetchProducts();
        return data;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },

    setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

    clearFilters: () => set({ filters: defaultFilters }),

    setCurrentProduct: (product) => set({ currentProduct: product }),

    clearError: () => set({ error: null }),
  })
);