/** Category types for product-management. */

export interface CategoryBreadcrumb {
  id: string;
  name: string;
}

export interface CategoryCreate {
  name: string;
  description?: string;
  parent_id?: string;
  order?: number;
}

export interface CategoryUpdate {
  name?: string;
  description?: string;
  parent_id?: string;
  order?: number;
}

export interface CategoryResponse {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  path: string;
  order: number;
  depth: number;
  breadcrumbs: CategoryBreadcrumb[];
  children: CategoryResponse[];
  created_at: string;
  updated_at: string;
}

export interface CategoryTree {
  id: string;
  name: string;
  parent_id: string | null;
  order: number;
  children: CategoryTree[];
}

export interface CategoryListResponse {
  data: CategoryResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface CategoryReorderRequest {
  order: number;
}