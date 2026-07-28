import {apiClient} from '@/lib/api/client';
import {unwrapApiSuccess} from '@/lib/api/response';

import type {ApiSuccess, PaginatedData, PaginationParams, Province} from '@/types/api';

const endpoints = {
  all: '/api/v1/provinces',
  one: (id: string) => `/api/v1/provinces/${encodeURIComponent(id)}`,
} as const;

export type ProvinceListParams = PaginationParams & {search?: string};

export const listProvincesService = async (
  params: ProvinceListParams = {},
  signal?: AbortSignal,
): Promise<PaginatedData<Province>> => {
  const response = await apiClient.get<ApiSuccess<PaginatedData<Province>>>(endpoints.all, {params, signal});
  return unwrapApiSuccess<PaginatedData<Province>>(response.data);
};

export const getProvinceService = async (id: string): Promise<Province> => {
  const response = await apiClient.get<ApiSuccess<Province>>(endpoints.one(id));
  return unwrapApiSuccess<Province>(response.data);
};

export const createProvinceService = async (name: string): Promise<Province> => {
  const response = await apiClient.post<ApiSuccess<Province>>(endpoints.all, {name});
  return unwrapApiSuccess<Province>(response.data);
};

export const updateProvinceService = async (id: string, name: string): Promise<Province> => {
  const response = await apiClient.patch<ApiSuccess<Province>>(endpoints.one(id), {name});
  return unwrapApiSuccess<Province>(response.data);
};

export const deleteProvinceService = async (id: string): Promise<Province> => {
  const response = await apiClient.delete<ApiSuccess<Province>>(endpoints.one(id));
  return unwrapApiSuccess<Province>(response.data);
};
