import {apiClient} from '@/lib/api/client';
import {API_ENDPOINTS} from '@/lib/api/endpoints';
import {unwrapApiSuccess} from '@/lib/api/response';

import type {ApiSuccess, Category, PaginatedData, PaginationParams} from '@/types/api';

export type CategoryListParams = PaginationParams & {search?: string};

export const listCategoriesService = async (
  params: CategoryListParams = {},
  signal?: AbortSignal,
): Promise<PaginatedData<Category>> => {
  const response = await apiClient.get<ApiSuccess<PaginatedData<Category>>>(API_ENDPOINTS.categories.all, {
    params,
    signal,
  });
  return unwrapApiSuccess<PaginatedData<Category>>(response.data);
};

export const getCategoryService = async (id: string): Promise<Category> => {
  const response = await apiClient.get<ApiSuccess<Category>>(API_ENDPOINTS.categories.one(id));
  return unwrapApiSuccess<Category>(response.data);
};

export const createCategoryService = async (name: string): Promise<Category> => {
  const response = await apiClient.post<ApiSuccess<Category>>(API_ENDPOINTS.categories.all, {name});
  return unwrapApiSuccess<Category>(response.data);
};

export const updateCategoryService = async (id: string, name: string): Promise<Category> => {
  const response = await apiClient.patch<ApiSuccess<Category>>(API_ENDPOINTS.categories.one(id), {name});
  return unwrapApiSuccess<Category>(response.data);
};

export const deleteCategoryService = async (id: string): Promise<Category> => {
  const response = await apiClient.delete<ApiSuccess<Category>>(API_ENDPOINTS.categories.one(id));
  return unwrapApiSuccess<Category>(response.data);
};
