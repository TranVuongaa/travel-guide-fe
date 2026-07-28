import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    hasRetriedAuth?: boolean;
    skipAuthRefresh?: boolean;
  }

  export interface InternalAxiosRequestConfig {
    hasRetriedAuth?: boolean;
    skipAuthRefresh?: boolean;
  }
}
