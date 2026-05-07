/** API client for category management. */

import api from './client';
import type {
  CategoryCreate,
  CategoryUpdate,
  CategoryResponse,
  CategoryTree,
  CategoryListResponse,
  CategoryReorderRequest,
} from '../types';

export const categoriesApi = {
  /** Get all categories with optional format. */
  getAll: async (params?: {
    format?: 'flat' | 'tree';
    parent_id?: string;
  }): Promise<CategoryResponse[] | CategoryTree[]> => {
    const { data } = await api.get('/api/admin/categories', { params });
    // Backend returns CategoryListResponse with data wrapper
    return data.data;
  },

  /** Get category by ID. */
  getById: async (id: string): Promise<CategoryResponse> => {
    const { data } = await api.get(`/api/admin/categories/${id}`);
    return data;
  },

  /** Create a new category. */
  create: async (category: CategoryCreate): Promise<CategoryResponse> => {
    const { data } = await api.post('/api/admin/categories', category);
    return data;
  },

  /** Update a category. */
  update: async (id: string, category: CategoryUpdate): Promise<CategoryResponse> => {
    const { data } = await api.put(`/api/admin/categories/${id}`, category);
    return data;
  },

  /** Delete a category (soft delete). */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/categories/${id}`);
  },

  /** Reorder a category. */
  reorder: async (id: string, request: CategoryReorderRequest): Promise<CategoryResponse> => {
    const { data } = await api.patch(`/api/admin/categories/${id}/reorder`, request);
    return data;
  },

  /** Get category tree structure. */
  getTree: async (): Promise<CategoryTree[]> => {
    const { data } = await api.get('/api/admin/categories', {
      params: { format: 'tree' },
    });
    return data.data;
  },

  /** Get paginated categories. */
  getList: async (params?: {
    page?: number;
    limit?: number;
    parent_id?: string;
  }): Promise<CategoryListResponse> => {
    const { data } = await api.get('/api/admin/categories', {
      params: { ...params, format: 'flat' },
    });
    return data;
  },
};

export default categoriesApi;