import {apiClient} from '@/lib/api/client';
import {endpoints} from '@/lib/api/endpoints';
import {unwrapApiSuccess} from '@/lib/api/response';

import type {
  ApiSuccess,
  Comment,
  CommentTargetType,
  CreateCommentInput,
  PaginatedData,
  PaginationParams,
} from '@/lib/api/contracts';

export type CommentListParams = PaginationParams & {
  targetType: CommentTargetType;
  targetId: string;
  parentId?: string;
};

export const listCommentsService = async (
  params: CommentListParams,
  signal?: AbortSignal,
): Promise<PaginatedData<Comment>> => {
  const response = await apiClient.get<ApiSuccess<PaginatedData<Comment>>>(endpoints.comments.all, {params, signal});
  return unwrapApiSuccess<PaginatedData<Comment>>(response.data);
};

export const createCommentService = async (input: CreateCommentInput): Promise<Comment> => {
  const response = await apiClient.post<ApiSuccess<Comment>>(endpoints.comments.all, input);
  return unwrapApiSuccess<Comment>(response.data);
};

export const getCommentService = async (id: string): Promise<Comment> => {
  const response = await apiClient.get<ApiSuccess<Comment>>(endpoints.comments.one(id));
  return unwrapApiSuccess<Comment>(response.data);
};

export const updateCommentService = async (id: string, content: string): Promise<Comment> => {
  const response = await apiClient.patch<ApiSuccess<Comment>>(endpoints.comments.one(id), {content});
  return unwrapApiSuccess<Comment>(response.data);
};

export const deleteCommentService = async (id: string): Promise<Comment> => {
  const response = await apiClient.delete<ApiSuccess<Comment>>(endpoints.comments.one(id));
  return unwrapApiSuccess<Comment>(response.data);
};
