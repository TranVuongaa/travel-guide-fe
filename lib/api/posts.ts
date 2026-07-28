import {apiClient} from '@/lib/api/client';
import {endpoints} from '@/lib/api/endpoints';
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
} from '@/lib/api/contracts';

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
  const response = await apiClient.get<ApiSuccess<PaginatedData<Post>>>(endpoints.posts.all, {params, signal});
  return unwrapApiSuccess<PaginatedData<Post>>(response.data);
};

export const listMyPostsService = async (
  params: MyPostListParams = {},
  signal?: AbortSignal,
): Promise<PaginatedData<Post>> => {
  const response = await apiClient.get<ApiSuccess<PaginatedData<Post>>>(endpoints.posts.mine, {params, signal});
  return unwrapApiSuccess<PaginatedData<Post>>(response.data);
};

export const getPostService = async (id: string, signal?: AbortSignal): Promise<Post> => {
  const response = await apiClient.get<ApiSuccess<Post>>(endpoints.posts.one(id), {signal});
  return unwrapApiSuccess<Post>(response.data);
};

export const createPostService = async (input: CreatePostInput): Promise<Post> => {
  const response = await apiClient.post<ApiSuccess<Post>>(endpoints.posts.all, input);
  return unwrapApiSuccess<Post>(response.data);
};

export const updatePostService = async (id: string, input: UpdatePostInput): Promise<Post> => {
  const response = await apiClient.patch<ApiSuccess<Post>>(endpoints.posts.one(id), input);
  return unwrapApiSuccess<Post>(response.data);
};

export const deletePostService = async (id: string): Promise<Post> => {
  const response = await apiClient.delete<ApiSuccess<Post>>(endpoints.posts.one(id));
  return unwrapApiSuccess<Post>(response.data);
};
