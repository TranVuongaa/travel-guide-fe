import {apiClient} from '@/lib/api/client';
import {endpoints} from '@/lib/api/endpoints';

export const getHealthService = async (signal?: AbortSignal): Promise<string> => {
  const response = await apiClient.get<unknown>(endpoints.health, {signal});
  return typeof response.data === 'string' ? response.data : 'API đang hoạt động';
};
