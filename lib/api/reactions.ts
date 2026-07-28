import {apiClient} from '@/lib/api/client';
import {endpoints} from '@/lib/api/endpoints';
import {unwrapApiSuccess} from '@/lib/api/response';

import type {
  ApiSuccess,
  Reaction,
  ReactionMutation,
  ReactionSummary,
  TargetType,
  UpsertReactionInput,
} from '@/lib/api/contracts';

export const getReactionSummaryService = async (
  targetType: TargetType,
  targetId: string,
  signal?: AbortSignal,
): Promise<ReactionSummary> => {
  const response = await apiClient.get<ApiSuccess<ReactionSummary>>(endpoints.reactions.summary, {
    params: {targetType, targetId},
    signal,
  });
  return unwrapApiSuccess<ReactionSummary>(response.data);
};

export const upsertReactionService = async (input: UpsertReactionInput): Promise<ReactionMutation> => {
  const response = await apiClient.post<ApiSuccess<ReactionMutation>>(endpoints.reactions.all, input);
  return unwrapApiSuccess<ReactionMutation>(response.data);
};

export const deleteReactionService = async (targetType: TargetType, targetId: string): Promise<Reaction> => {
  const response = await apiClient.delete<ApiSuccess<Reaction>>(endpoints.reactions.all, {
    params: {targetType, targetId},
  });
  return unwrapApiSuccess<Reaction>(response.data);
};
