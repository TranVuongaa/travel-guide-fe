import {apiClient} from '@/lib/api/client';
import {API_ENDPOINTS} from '@/lib/api/endpoints';
import {unwrapApiSuccess} from '@/lib/api/response';
import {clearCredentials, getCredentials, setCredentials} from '@/lib/auth/credentials';

import type {ApiSuccess, AuthResponse, LoginInput, OAuthCodeInput, RegisterInput} from '@/types/api';

const acceptAuthResponse = (value: unknown): AuthResponse => {
  const auth = unwrapApiSuccess<AuthResponse>(value);
  setCredentials({accessToken: auth.accessToken, refreshToken: auth.refreshToken});
  return auth;
};

export const registerService = async (input: RegisterInput): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiSuccess<AuthResponse>>(API_ENDPOINTS.auth.register, input, {
    skipAuthRefresh: true,
  });
  return acceptAuthResponse(response.data);
};

export const loginService = async (input: LoginInput): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiSuccess<AuthResponse>>(API_ENDPOINTS.auth.login, input, {
    skipAuthRefresh: true,
  });
  return acceptAuthResponse(response.data);
};

export const googleLoginService = async (input: OAuthCodeInput): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiSuccess<AuthResponse>>(API_ENDPOINTS.auth.google, input, {
    skipAuthRefresh: true,
  });
  return acceptAuthResponse(response.data);
};

export const refreshSessionService = async (): Promise<AuthResponse> => {
  const refreshToken = getCredentials()?.refreshToken;
  if (!refreshToken) {
    throw new Error('Không có phiên đăng nhập để làm mới.');
  }

  const response = await apiClient.post<ApiSuccess<AuthResponse>>(
    API_ENDPOINTS.auth.refresh,
    {refreshToken},
    {skipAuthRefresh: true},
  );
  return acceptAuthResponse(response.data);
};

export const logoutService = async (): Promise<void> => {
  const refreshToken = getCredentials()?.refreshToken;
  try {
    if (refreshToken) {
      await apiClient.post(API_ENDPOINTS.auth.logout, {refreshToken}, {skipAuthRefresh: true});
    }
  } finally {
    clearCredentials();
  }
};

export const logoutAllService = async (): Promise<void> => {
  try {
    await apiClient.post(API_ENDPOINTS.auth.logoutAll);
  } finally {
    clearCredentials();
  }
};
