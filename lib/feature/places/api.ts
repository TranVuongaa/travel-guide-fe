import {apiClient} from '@/lib/api/client';
import {API_ENDPOINTS} from '@/lib/api/endpoints';
import {unwrapApiSuccess} from '@/lib/api/response';

import type {
  ApiSuccess,
  CreatePlaceInput,
  PaginatedData,
  PaginationParams,
  Place,
  UpdatePlaceInput,
} from '@/types/api';

export type PlaceListParams = PaginationParams & {
  search?: string;
  provinceId?: string;
  categoryId?: string;
  sortBy?: 'avgRating' | 'createdAt' | 'name' | 'updatedAt';
};

export const listPlacesService = async (
  params: PlaceListParams = {},
  signal?: AbortSignal,
): Promise<PaginatedData<Place>> => {
  const response = await apiClient.get<ApiSuccess<PaginatedData<Place>>>(API_ENDPOINTS.places.all, {params, signal});
  return unwrapApiSuccess<PaginatedData<Place>>(response.data);
};

export const getPlaceService = async (id: string, signal?: AbortSignal): Promise<Place> => {
  const response = await apiClient.get<ApiSuccess<Place>>(API_ENDPOINTS.places.one(id), {signal});
  return unwrapApiSuccess<Place>(response.data);
};

export const createPlaceService = async (input: CreatePlaceInput): Promise<Place> => {
  const response = await apiClient.post<ApiSuccess<Place>>(API_ENDPOINTS.places.all, input);
  return unwrapApiSuccess<Place>(response.data);
};

export const updatePlaceService = async (id: string, input: UpdatePlaceInput): Promise<Place> => {
  const response = await apiClient.patch<ApiSuccess<Place>>(API_ENDPOINTS.places.one(id), input);
  return unwrapApiSuccess<Place>(response.data);
};

export const deletePlaceService = async (id: string): Promise<Place> => {
  const response = await apiClient.delete<ApiSuccess<Place>>(API_ENDPOINTS.places.one(id));
  return unwrapApiSuccess<Place>(response.data);
};
