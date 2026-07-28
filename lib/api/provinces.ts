import {apiClient} from '@/lib/api/client';
import {endpoints} from '@/lib/api/endpoints';
import {unwrapApiSuccess} from '@/lib/api/response';

import type {ApiSuccess, PaginatedData, PaginationParams, Province} from '@/lib/api/contracts';

export type ProvinceListParams = PaginationParams & {search?: string};

export const listProvincesService = async (
  params: ProvinceListParams = {},
  signal?: AbortSignal,
): Promise<PaginatedData<Province>> => {
  const response = await apiClient.get<ApiSuccess<PaginatedData<Province>>>(endpoints.provinces.all, {params, signal});
  return unwrapApiSuccess<PaginatedData<Province>>(response.data);
};

export const getProvinceService = async (id: string): Promise<Province> => {
  const response = await apiClient.get<ApiSuccess<Province>>(endpoints.provinces.one(id));
  return unwrapApiSuccess<Province>(response.data);
};

export const createProvinceService = async (name: string): Promise<Province> => {
  const response = await apiClient.post<ApiSuccess<Province>>(endpoints.provinces.all, {name});
  return unwrapApiSuccess<Province>(response.data);
};

export const updateProvinceService = async (id: string, name: string): Promise<Province> => {
  const response = await apiClient.patch<ApiSuccess<Province>>(endpoints.provinces.one(id), {name});
  return unwrapApiSuccess<Province>(response.data);
};

export const deleteProvinceService = async (id: string): Promise<Province> => {
  const response = await apiClient.delete<ApiSuccess<Province>>(endpoints.provinces.one(id));
  return unwrapApiSuccess<Province>(response.data);
};
