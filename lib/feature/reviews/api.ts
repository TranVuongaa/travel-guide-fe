import {apiClient} from '@/lib/api/client';
import {unwrapApiSuccess} from '@/lib/api/response';

import type {
  ApiSuccess,
  ContentStatus,
  CreateReviewInput,
  PaginatedData,
  PaginationParams,
  Review,
  UpdateReviewInput,
} from '@/types/api';

const endpoints = {
  forPlace: (placeId: string) => `/api/v1/places/${encodeURIComponent(placeId)}/reviews`,
  mine: '/api/v1/reviews/mine',
  one: (id: string) => `/api/v1/reviews/${encodeURIComponent(id)}`,
} as const;

export type MyReviewListParams = PaginationParams & {
  placeId?: string;
  status?: ContentStatus;
};

export const listPlaceReviewsService = async (
  placeId: string,
  params: PaginationParams = {},
  signal?: AbortSignal,
): Promise<PaginatedData<Review>> => {
  const response = await apiClient.get<ApiSuccess<PaginatedData<Review>>>(endpoints.forPlace(placeId), {
    params,
    signal,
  });
  return unwrapApiSuccess<PaginatedData<Review>>(response.data);
};

export const createReviewService = async (placeId: string, input: CreateReviewInput): Promise<Review> => {
  const response = await apiClient.post<ApiSuccess<Review>>(endpoints.forPlace(placeId), input);
  return unwrapApiSuccess<Review>(response.data);
};

export const listMyReviewsService = async (
  params: MyReviewListParams = {},
  signal?: AbortSignal,
): Promise<PaginatedData<Review>> => {
  const response = await apiClient.get<ApiSuccess<PaginatedData<Review>>>(endpoints.mine, {params, signal});
  return unwrapApiSuccess<PaginatedData<Review>>(response.data);
};

export const getReviewService = async (id: string): Promise<Review> => {
  const response = await apiClient.get<ApiSuccess<Review>>(endpoints.one(id));
  return unwrapApiSuccess<Review>(response.data);
};

export const updateReviewService = async (id: string, input: UpdateReviewInput): Promise<Review> => {
  const response = await apiClient.patch<ApiSuccess<Review>>(endpoints.one(id), input);
  return unwrapApiSuccess<Review>(response.data);
};

export const deleteReviewService = async (id: string): Promise<Review> => {
  const response = await apiClient.delete<ApiSuccess<Review>>(endpoints.one(id));
  return unwrapApiSuccess<Review>(response.data);
};
