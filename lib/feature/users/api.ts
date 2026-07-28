import {apiClient} from '@/lib/api/client';
import {API_ENDPOINTS} from '@/lib/api/endpoints';
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

export type UsersParams = PaginationParams & {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  sortBy?: 'createdAt' | 'displayName' | 'email' | 'updatedAt';
};

export const getCurrentUserService = async (): Promise<User> => {
  const response = await apiClient.get<ApiSuccess<User>>(API_ENDPOINTS.users.me);
  return unwrapApiSuccess<User>(response.data);
};

export const updateCurrentUserService = async (input: UpdateProfileInput): Promise<User> => {
  const response = await apiClient.patch<ApiSuccess<User>>(API_ENDPOINTS.users.me, input);
  return unwrapApiSuccess<User>(response.data);
};

export const changePasswordService = async (input: ChangePasswordInput): Promise<void> => {
  await apiClient.patch(API_ENDPOINTS.users.password, input);
};

export const listUsersService = async (params: UsersParams, signal?: AbortSignal): Promise<PaginatedData<User>> => {
  const response = await apiClient.get<ApiSuccess<PaginatedData<User>>>(API_ENDPOINTS.users.all, {params, signal});
  return unwrapApiSuccess<PaginatedData<User>>(response.data);
};

export const getUserService = async (id: string): Promise<User> => {
  const response = await apiClient.get<ApiSuccess<User>>(API_ENDPOINTS.users.one(id));
  return unwrapApiSuccess<User>(response.data);
};

export const updateUserRoleService = async (id: string, role: UserRole): Promise<User> => {
  const response = await apiClient.patch<ApiSuccess<User>>(API_ENDPOINTS.users.role(id), {role});
  return unwrapApiSuccess<User>(response.data);
};

export const updateUserStatusService = async (id: string, isActive: boolean): Promise<User> => {
  const response = await apiClient.patch<ApiSuccess<User>>(API_ENDPOINTS.users.status(id), {isActive});
  return unwrapApiSuccess<User>(response.data);
};

export const linkGoogleService = async (input: OAuthCodeInput): Promise<User> => {
  const response = await apiClient.post<ApiSuccess<User>>(API_ENDPOINTS.users.linkGoogle, input);
  return unwrapApiSuccess<User>(response.data);
};

export const unlinkOAuthProviderService = async (provider: string): Promise<User> => {
  const response = await apiClient.delete<ApiSuccess<User>>(API_ENDPOINTS.users.unlinkOAuthProvider(provider));
  return unwrapApiSuccess<User>(response.data);
};

export type {SortOrder};
