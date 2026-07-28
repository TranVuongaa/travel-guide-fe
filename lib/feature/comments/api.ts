import {apiClient} from '@/lib/api/client';
import {unwrapApiSuccess} from '@/lib/api/response';

import type {
  ApiSuccess,
  Comment,
  CommentTargetType,
  CreateCommentInput,
  PaginatedData,
  PaginationParams,
} from '@/types/api';

const endpoints = {
  all: '/api/v1/comments',
  one: (id: string) => `/api/v1/comments/${encodeURIComponent(id)}`,
} as const;

export type CommentListParams = PaginationParams & {
  targetType: CommentTargetType;
  targetId: string;
  parentId?: string;
};

export const listCommentsService = async (
  params: CommentListParams,
  signal?: AbortSignal,
): Promise<PaginatedData<Comment>> => {
  const response = await apiClient.get<ApiSuccess<PaginatedData<Comment>>>(endpoints.all, {params, signal});
  return unwrapApiSuccess<PaginatedData<Comment>>(response.data);
};

export const createCommentService = async (input: CreateCommentInput): Promise<Comment> => {
  const response = await apiClient.post<ApiSuccess<Comment>>(endpoints.all, input);
  return unwrapApiSuccess<Comment>(response.data);
};

export const getCommentService = async (id: string): Promise<Comment> => {
  const response = await apiClient.get<ApiSuccess<Comment>>(endpoints.one(id));
  return unwrapApiSuccess<Comment>(response.data);
};

export const updateCommentService = async (id: string, content: string): Promise<Comment> => {
  const response = await apiClient.patch<ApiSuccess<Comment>>(endpoints.one(id), {content});
  return unwrapApiSuccess<Comment>(response.data);
};

export const deleteCommentService = async (id: string): Promise<Comment> => {
  const response = await apiClient.delete<ApiSuccess<Comment>>(endpoints.one(id));
  return unwrapApiSuccess<Comment>(response.data);
};
