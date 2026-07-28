import {apiClient} from '@/lib/api/client';
import {unwrapApiSuccess} from '@/lib/api/response';
import {clearCredentials, getCredentials, setCredentials} from '@/lib/auth/credentials';

import type {ApiSuccess, AuthResponse, LoginInput, OAuthCodeInput, RegisterInput} from '@/types/api';

const endpoints = {
  register: '/api/v1/auth/register',
  login: '/api/v1/auth/login',
  google: '/api/v1/auth/oauth/google',
  refresh: '/api/v1/auth/refresh',
  logout: '/api/v1/auth/logout',
  logoutAll: '/api/v1/auth/logout-all',
} as const;

const acceptAuthResponse = (value: unknown): AuthResponse => {
  const auth = unwrapApiSuccess<AuthResponse>(value);
  setCredentials({accessToken: auth.accessToken, refreshToken: auth.refreshToken});
  return auth;
};

export const registerService = async (input: RegisterInput): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiSuccess<AuthResponse>>(endpoints.register, input, {
    skipAuthRefresh: true,
  });
  return acceptAuthResponse(response.data);
};

export const loginService = async (input: LoginInput): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiSuccess<AuthResponse>>(endpoints.login, input, {
    skipAuthRefresh: true,
  });
  return acceptAuthResponse(response.data);
};

export const googleLoginService = async (input: OAuthCodeInput): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiSuccess<AuthResponse>>(endpoints.google, input, {
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
    endpoints.refresh,
    {refreshToken},
    {skipAuthRefresh: true},
  );
  return acceptAuthResponse(response.data);
};

export const logoutService = async (): Promise<void> => {
  const refreshToken = getCredentials()?.refreshToken;
  try {
    if (refreshToken) {
      await apiClient.post(endpoints.logout, {refreshToken}, {skipAuthRefresh: true});
    }
  } finally {
    clearCredentials();
  }
};

export const logoutAllService = async (): Promise<void> => {
  try {
    await apiClient.post(endpoints.logoutAll);
  } finally {
    clearCredentials();
  }
};
