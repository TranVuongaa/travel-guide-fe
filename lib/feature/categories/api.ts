import {apiClient} from '@/lib/api/client';
import {unwrapApiSuccess} from '@/lib/api/response';

import type {ApiSuccess, Category, PaginatedData, PaginationParams} from '@/types/api';

const endpoints = {
  all: '/api/v1/categories',
  one: (id: string) => `/api/v1/categories/${encodeURIComponent(id)}`,
} as const;

export type CategoryListParams = PaginationParams & {search?: string};

export const listCategoriesService = async (
  params: CategoryListParams = {},
  signal?: AbortSignal,
): Promise<PaginatedData<Category>> => {
  const response = await apiClient.get<ApiSuccess<PaginatedData<Category>>>(endpoints.all, {params, signal});
  return unwrapApiSuccess<PaginatedData<Category>>(response.data);
};

export const getCategoryService = async (id: string): Promise<Category> => {
  const response = await apiClient.get<ApiSuccess<Category>>(endpoints.one(id));
  return unwrapApiSuccess<Category>(response.data);
};

export const createCategoryService = async (name: string): Promise<Category> => {
  const response = await apiClient.post<ApiSuccess<Category>>(endpoints.all, {name});
  return unwrapApiSuccess<Category>(response.data);
};

export const updateCategoryService = async (id: string, name: string): Promise<Category> => {
  const response = await apiClient.patch<ApiSuccess<Category>>(endpoints.one(id), {name});
  return unwrapApiSuccess<Category>(response.data);
};

export const deleteCategoryService = async (id: string): Promise<Category> => {
  const response = await apiClient.delete<ApiSuccess<Category>>(endpoints.one(id));
  return unwrapApiSuccess<Category>(response.data);
};
