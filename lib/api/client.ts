import axios from 'axios';

import {env} from '@/config/env';
import {clearCredentials, getCredentials, setCredentials} from '@/lib/auth/credentials';

import type {AxiosError, InternalAxiosRequestConfig} from 'axios';
import type {ApiSuccess, AuthResponse} from '@/types/api';

const REFRESH_ENDPOINT = '/api/v1/auth/refresh';

type RetriableConfig = InternalAxiosRequestConfig & {
  hasRetriedAuth?: boolean;
  skipAuthRefresh?: boolean;
};

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

apiClient.interceptors.request.use((config) => {
  const currentCredentials = getCredentials();
  if (currentCredentials?.accessToken) {
    config.headers.Authorization = `Bearer ${currentCredentials.accessToken}`;
  }

  return config;
});

let refreshPromise: Promise<AuthResponse> | null = null;

const refreshCredentials = async (): Promise<AuthResponse> => {
  const currentCredentials = getCredentials();
  if (!currentCredentials?.refreshToken) {
    throw new Error('No refresh token is available');
  }

  const response = await apiClient.post<ApiSuccess<AuthResponse>>(
    REFRESH_ENDPOINT,
    {refreshToken: currentCredentials.refreshToken},
    {skipAuthRefresh: true} as RetriableConfig,
  );
  const nextAuth = response.data.data;
  setCredentials({
    accessToken: nextAuth.accessToken,
    refreshToken: nextAuth.refreshToken,
  });
  return nextAuth;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;
    const shouldRefresh =
      error.response?.status === 401 &&
      Boolean(config) &&
      !config?.hasRetriedAuth &&
      !config?.skipAuthRefresh &&
      Boolean(getCredentials()?.refreshToken);

    if (!shouldRefresh || !config) {
      return Promise.reject(error);
    }

    config.hasRetriedAuth = true;
    try {
      refreshPromise ??= refreshCredentials().finally(() => {
        refreshPromise = null;
      });
      await refreshPromise;
      return apiClient.request(config);
    } catch {
      clearCredentials();
      return Promise.reject(error);
    }
  },
);
