import {apiClient} from '@/lib/api/client';
import {unwrapApiSuccess} from '@/lib/api/response';

import type {
  ApiSuccess,
  Reaction,
  ReactionMutation,
  ReactionSummary,
  TargetType,
  UpsertReactionInput,
} from '@/types/api';

const endpoints = {
  all: '/api/v1/reactions',
  summary: '/api/v1/reactions/summary',
} as const;

export const getReactionSummaryService = async (
  targetType: TargetType,
  targetId: string,
  signal?: AbortSignal,
): Promise<ReactionSummary> => {
  const response = await apiClient.get<ApiSuccess<ReactionSummary>>(endpoints.summary, {
    params: {targetType, targetId},
    signal,
  });
  return unwrapApiSuccess<ReactionSummary>(response.data);
};

export const upsertReactionService = async (input: UpsertReactionInput): Promise<ReactionMutation> => {
  const response = await apiClient.post<ApiSuccess<ReactionMutation>>(endpoints.all, input);
  return unwrapApiSuccess<ReactionMutation>(response.data);
};

export const deleteReactionService = async (targetType: TargetType, targetId: string): Promise<Reaction> => {
  const response = await apiClient.delete<ApiSuccess<Reaction>>(endpoints.all, {
    params: {targetType, targetId},
  });
  return unwrapApiSuccess<Reaction>(response.data);
};
