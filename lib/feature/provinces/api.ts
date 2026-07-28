import {apiClient} from '@/lib/api/client';
import {API_ENDPOINTS} from '@/lib/api/endpoints';
import {unwrapApiSuccess} from '@/lib/api/response';

import type {ApiSuccess, PaginatedData, PaginationParams, Province} from '@/types/api';

export type ProvinceListParams = PaginationParams & {search?: string};

export const listProvincesService = async (
  params: ProvinceListParams = {},
  signal?: AbortSignal,
): Promise<PaginatedData<Province>> => {
  const response = await apiClient.get<ApiSuccess<PaginatedData<Province>>>(API_ENDPOINTS.provinces.all, {
    params,
    signal,
  });
  return unwrapApiSuccess<PaginatedData<Province>>(response.data);
};

export const getProvinceService = async (id: string): Promise<Province> => {
  const response = await apiClient.get<ApiSuccess<Province>>(API_ENDPOINTS.provinces.one(id));
  return unwrapApiSuccess<Province>(response.data);
};

export const createProvinceService = async (name: string): Promise<Province> => {
  const response = await apiClient.post<ApiSuccess<Province>>(API_ENDPOINTS.provinces.all, {name});
  return unwrapApiSuccess<Province>(response.data);
};

export const updateProvinceService = async (id: string, name: string): Promise<Province> => {
  const response = await apiClient.patch<ApiSuccess<Province>>(API_ENDPOINTS.provinces.one(id), {name});
  return unwrapApiSuccess<Province>(response.data);
};

export const deleteProvinceService = async (id: string): Promise<Province> => {
  const response = await apiClient.delete<ApiSuccess<Province>>(API_ENDPOINTS.provinces.one(id));
  return unwrapApiSuccess<Province>(response.data);
};
