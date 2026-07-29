import {apiClient} from '@/lib/api/client';
import {API_ENDPOINTS} from '@/lib/api/endpoints';
import {unwrapApiSuccess} from '@/lib/api/response';

import type {ApiSuccess, TravelContentIngestionRun} from '@/types/api';

export const createTravelContentIngestionService = async (): Promise<TravelContentIngestionRun> => {
  const response = await apiClient.post<ApiSuccess<TravelContentIngestionRun>>(
    API_ENDPOINTS.admin.travelContentIngestions,
  );
  return unwrapApiSuccess<TravelContentIngestionRun>(response.data);
};
