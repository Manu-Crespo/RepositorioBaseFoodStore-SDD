/** API client for public catalogue (no auth required). */

import api from './client';
import type {
  CatalogueProduct,
  CatalogueProductDetail,
  CatalogueProductListResponse,
  CatalogueFilters,
  CatalogueCategoryListResponse,
  AllergenInfo,
} from '../types';

export const catalogueApi = {
  /** Get products with filters, search, and pagination. */
  getProducts: async (params?: CatalogueFilters): Promise<CatalogueProductListResponse> => {
    const { data } = await api.get('/api/catalogue/products', { params });
    return data;
  },

  /** Get product details by ID. */
  getProduct: async (id: string): Promise<CatalogueProductDetail> => {
    const { data } = await api.get(`/api/catalogue/products/${id}`);
    return data;
  },

  /** Get related products. */
  getRelatedProducts: async (id: string): Promise<CatalogueProduct[]> => {
    const { data } = await api.get(`/api/catalogue/products/${id}/related`);
    return data;
  },

  /** Get public categories. */
  getCategories: async (): Promise<CatalogueCategoryListResponse> => {
    const { data } = await api.get('/api/catalogue/categories');
    return data;
  },

  /** Get list of available allergens. */
  getAllergens: async (): Promise<AllergenInfo[]> => {
    const { data } = await api.get('/api/catalogue/allergens');
    return data;
  },

  /** Get products by category. */
  getProductsByCategory: async (categoryId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<CatalogueProductListResponse> => {
    const { data } = await api.get('/api/catalogue/products', {
      params: { ...params, category_id: categoryId },
    });
    return data;
  },

  /** Search products. */
  searchProducts: async (search: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<CatalogueProductListResponse> => {
    const { data } = await api.get('/api/catalogue/products', {
      params: { ...params, search },
    });
    return data;
  },

  /** Filter products by allergens to exclude. */
  filterByAllergens: async (excludeAllergens: string[], params?: {
    page?: number;
    limit?: number;
  }): Promise<CatalogueProductListResponse> => {
    const { data } = await api.get('/api/catalogue/products', {
      params: { ...params, exclude_allergens: excludeAllergens },
    });
    return data;
  },
};

export default catalogueApi;