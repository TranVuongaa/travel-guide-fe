import {createContractError} from '@/lib/api/errors';

import type {ApiSuccess} from '@/types/api';

export const unwrapApiSuccess = <T>(value: unknown): T => {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('success' in value) ||
    value.success !== true ||
    !('data' in value)
  ) {
    throw createContractError();
  }

  return (value as ApiSuccess<T>).data;
};
