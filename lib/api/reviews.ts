import {apiClient} from '@/lib/api/client';
import {endpoints} from '@/lib/api/endpoints';
import {unwrapApiSuccess} from '@/lib/api/response';

import type {
  ApiSuccess,
  ContentStatus,
  CreateReviewInput,
  PaginatedData,
  PaginationParams,
  Review,
  UpdateReviewInput,
} from '@/lib/api/contracts';

export type MyReviewListParams = PaginationParams & {
  placeId?: string;
  status?: ContentStatus;
};

export const listPlaceReviewsService = async (
  placeId: string,
  params: PaginationParams = {},
  signal?: AbortSignal,
): Promise<PaginatedData<Review>> => {
  const response = await apiClient.get<ApiSuccess<PaginatedData<Review>>>(endpoints.places.reviews(placeId), {
    params,
    signal,
  });
  return unwrapApiSuccess<PaginatedData<Review>>(response.data);
};

export const createReviewService = async (placeId: string, input: CreateReviewInput): Promise<Review> => {
  const response = await apiClient.post<ApiSuccess<Review>>(endpoints.places.reviews(placeId), input);
  return unwrapApiSuccess<Review>(response.data);
};

export const listMyReviewsService = async (
  params: MyReviewListParams = {},
  signal?: AbortSignal,
): Promise<PaginatedData<Review>> => {
  const response = await apiClient.get<ApiSuccess<PaginatedData<Review>>>(endpoints.reviews.mine, {params, signal});
  return unwrapApiSuccess<PaginatedData<Review>>(response.data);
};

export const getReviewService = async (id: string): Promise<Review> => {
  const response = await apiClient.get<ApiSuccess<Review>>(endpoints.reviews.one(id));
  return unwrapApiSuccess<Review>(response.data);
};

export const updateReviewService = async (id: string, input: UpdateReviewInput): Promise<Review> => {
  const response = await apiClient.patch<ApiSuccess<Review>>(endpoints.reviews.one(id), input);
  return unwrapApiSuccess<Review>(response.data);
};

export const deleteReviewService = async (id: string): Promise<Review> => {
  const response = await apiClient.delete<ApiSuccess<Review>>(endpoints.reviews.one(id));
  return unwrapApiSuccess<Review>(response.data);
};
