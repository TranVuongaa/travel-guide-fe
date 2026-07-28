import {apiClient} from '@/lib/api/client';
import {unwrapApiSuccess} from '@/lib/api/response';

import type {
  ApiSuccess,
  ContentStatus,
  CreatePostInput,
  PaginatedData,
  PaginationParams,
  Post,
  PostSource,
  UpdatePostInput,
} from '@/types/api';

const endpoints = {
  all: '/api/v1/posts',
  mine: '/api/v1/posts/mine',
  one: (id: string) => `/api/v1/posts/${encodeURIComponent(id)}`,
} as const;

export type PostListParams = PaginationParams & {
  placeId?: string;
  authorId?: string;
  source?: PostSource;
  search?: string;
};

export type MyPostListParams = PaginationParams & {status?: ContentStatus};

export const listPostsService = async (
  params: PostListParams = {},
  signal?: AbortSignal,
): Promise<PaginatedData<Post>> => {
  const response = await apiClient.get<ApiSuccess<PaginatedData<Post>>>(endpoints.all, {params, signal});
  return unwrapApiSuccess<PaginatedData<Post>>(response.data);
};

export const listMyPostsService = async (
  params: MyPostListParams = {},
  signal?: AbortSignal,
): Promise<PaginatedData<Post>> => {
  const response = await apiClient.get<ApiSuccess<PaginatedData<Post>>>(endpoints.mine, {params, signal});
  return unwrapApiSuccess<PaginatedData<Post>>(response.data);
};

export const getPostService = async (id: string, signal?: AbortSignal): Promise<Post> => {
  const response = await apiClient.get<ApiSuccess<Post>>(endpoints.one(id), {signal});
  return unwrapApiSuccess<Post>(response.data);
};

export const createPostService = async (input: CreatePostInput): Promise<Post> => {
  const response = await apiClient.post<ApiSuccess<Post>>(endpoints.all, input);
  return unwrapApiSuccess<Post>(response.data);
};

export const updatePostService = async (id: string, input: UpdatePostInput): Promise<Post> => {
  const response = await apiClient.patch<ApiSuccess<Post>>(endpoints.one(id), input);
  return unwrapApiSuccess<Post>(response.data);
};

export const deletePostService = async (id: string): Promise<Post> => {
  const response = await apiClient.delete<ApiSuccess<Post>>(endpoints.one(id));
  return unwrapApiSuccess<Post>(response.data);
};
