import {describe, expect, it, vi} from 'vitest';

import {apiClient} from '@/lib/api/client';
import {API_ENDPOINTS} from '@/lib/api/endpoints';

import {createTravelContentIngestionService} from './api';

import type {ApiSuccess, TravelContentIngestionRun} from '@/types/api';

vi.mock('@/lib/api/client', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

const run: TravelContentIngestionRun = {
  id: '96c018b4-35e9-4f2a-9c8f-84954d12809f',
  status: 'QUEUED',
  trendKeywordCount: 0,
  discoveredUrlCount: 0,
  importedPostCount: 0,
  duplicateCount: 0,
  skippedCount: 0,
  failedCount: 0,
  errorSummary: null,
  createdAt: '2026-07-29T05:00:00.000Z',
  startedAt: null,
  completedAt: null,
};

describe('createTravelContentIngestionService', () => {
  it('posts to the admin endpoint without inventing a request body', async () => {
    const response: ApiSuccess<TravelContentIngestionRun> = {
      success: true,
      data: run,
      meta: {
        timestamp: '2026-07-29T05:00:00.000Z',
        requestId: 'request-1',
      },
    };
    vi.mocked(apiClient.post).mockResolvedValue({data: response});

    await expect(createTravelContentIngestionService()).resolves.toEqual(run);
    expect(apiClient.post).toHaveBeenCalledOnce();
    expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.admin.travelContentIngestions);
  });
});
