/** API client for product management (admin). */

import api from './client';
import type {
  ProductCreate,
  ProductUpdate,
  ProductResponse,
  ProductListResponse,
  ProductFilter,
  ProductStockUpdate,
} from '../types';

export const productsApi = {
  /** Get all products with filters. */
  getAll: async (params?: ProductFilter): Promise<ProductListResponse> => {
    const { data } = await api.get('/api/admin/products', { params });
    return data;
  },

  /** Get product by ID. */
  getById: async (id: string): Promise<ProductResponse> => {
    const { data } = await api.get(`/api/admin/products/${id}`);
    return data;
  },

  /** Create a new product. */
  create: async (product: ProductCreate): Promise<ProductResponse> => {
    const { data } = await api.post('/api/admin/products', product);
    return data;
  },

  /** Update a product. */
  update: async (id: string, product: ProductUpdate): Promise<ProductResponse> => {
    const { data } = await api.put(`/api/admin/products/${id}`, product);
    return data;
  },

  /** Delete a product (soft delete). */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/products/${id}`);
  },

  /** Update product stock. */
  updateStock: async (id: string, stockUpdate: ProductStockUpdate): Promise<ProductResponse> => {
    const { data } = await api.patch(`/api/admin/products/${id}/stock`, stockUpdate);
    return data;
  },

  /** Add stock to a product. */
  addStock: async (id: string, quantity: number): Promise<ProductResponse> => {
    return productsApi.updateStock(id, { stock: quantity, operation: 'add' });
  },

  /** Remove stock from a product. */
  removeStock: async (id: string, quantity: number): Promise<ProductResponse> => {
    return productsApi.updateStock(id, { stock: quantity, operation: 'remove' });
  },

  /** Get products by category. */
  getByCategory: async (categoryId: string): Promise<ProductResponse[]> => {
    const { data } = await api.get('/api/admin/products', {
      params: { category_id: categoryId },
    });
    return data.data;
  },

  /** Search products. */
  search: async (search: string): Promise<ProductResponse[]> => {
    const { data } = await api.get('/api/admin/products', {
      params: { search },
    });
    return data.data;
  },
};

export default productsApi;