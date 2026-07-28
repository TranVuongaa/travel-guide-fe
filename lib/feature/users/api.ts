import {apiClient} from '@/lib/api/client';
import {unwrapApiSuccess} from '@/lib/api/response';

import type {
  ApiSuccess,
  ChangePasswordInput,
  OAuthCodeInput,
  PaginatedData,
  PaginationParams,
  SortOrder,
  UpdateProfileInput,
  User,
  UserRole,
} from '@/types/api';

const endpoints = {
  me: '/api/v1/users/me',
  password: '/api/v1/users/me/password',
  all: '/api/v1/users',
  one: (id: string) => `/api/v1/users/${encodeURIComponent(id)}`,
  role: (id: string) => `/api/v1/users/${encodeURIComponent(id)}/role`,
  status: (id: string) => `/api/v1/users/${encodeURIComponent(id)}/status`,
  linkGoogle: '/api/v1/users/me/oauth/google',
  unlink: (provider: string) => `/api/v1/users/me/oauth/${encodeURIComponent(provider)}`,
} as const;

export type UsersParams = PaginationParams & {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  sortBy?: 'createdAt' | 'displayName' | 'email' | 'updatedAt';
};

export const getCurrentUserService = async (): Promise<User> => {
  const response = await apiClient.get<ApiSuccess<User>>(endpoints.me);
  return unwrapApiSuccess<User>(response.data);
};

export const updateCurrentUserService = async (input: UpdateProfileInput): Promise<User> => {
  const response = await apiClient.patch<ApiSuccess<User>>(endpoints.me, input);
  return unwrapApiSuccess<User>(response.data);
};

export const changePasswordService = async (input: ChangePasswordInput): Promise<void> => {
  await apiClient.patch(endpoints.password, input);
};

export const listUsersService = async (params: UsersParams, signal?: AbortSignal): Promise<PaginatedData<User>> => {
  const response = await apiClient.get<ApiSuccess<PaginatedData<User>>>(endpoints.all, {params, signal});
  return unwrapApiSuccess<PaginatedData<User>>(response.data);
};

export const getUserService = async (id: string): Promise<User> => {
  const response = await apiClient.get<ApiSuccess<User>>(endpoints.one(id));
  return unwrapApiSuccess<User>(response.data);
};

export const updateUserRoleService = async (id: string, role: UserRole): Promise<User> => {
  const response = await apiClient.patch<ApiSuccess<User>>(endpoints.role(id), {role});
  return unwrapApiSuccess<User>(response.data);
};

export const updateUserStatusService = async (id: string, isActive: boolean): Promise<User> => {
  const response = await apiClient.patch<ApiSuccess<User>>(endpoints.status(id), {isActive});
  return unwrapApiSuccess<User>(response.data);
};

export const linkGoogleService = async (input: OAuthCodeInput): Promise<User> => {
  const response = await apiClient.post<ApiSuccess<User>>(endpoints.linkGoogle, input);
  return unwrapApiSuccess<User>(response.data);
};

export const unlinkOAuthProviderService = async (provider: string): Promise<User> => {
  const response = await apiClient.delete<ApiSuccess<User>>(endpoints.unlink(provider));
  return unwrapApiSuccess<User>(response.data);
};

export type {SortOrder};
