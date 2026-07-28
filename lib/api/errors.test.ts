import {describe, expect, it} from 'vitest';
import axios, {AxiosHeaders} from 'axios';

import {normalizeAppError} from './errors';

describe('normalizeAppError', () => {
  it('preserves normalized application errors', () => {
    expect(normalizeAppError({code: 'INVALID_API_RESPONSE', message: 'Dữ liệu lỗi'})).toEqual({
      code: 'INVALID_API_RESPONSE',
      message: 'Dữ liệu lỗi',
      status: undefined,
      fieldErrors: undefined,
    });
  });

  it('maps API error codes and field details', () => {
    const error = new axios.AxiosError(
      'Conflict',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 409,
        statusText: 'Conflict',
        headers: {},
        config: {headers: new AxiosHeaders()},
        data: {
          success: false,
          error: {
            code: 'EMAIL_ALREADY_EXISTS',
            details: [{field: 'email', message: 'Email đã tồn tại'}],
          },
        },
      },
    );

    expect(normalizeAppError(error)).toMatchObject({
      code: 'EMAIL_ALREADY_EXISTS',
      status: 409,
      message: 'Email này đã được sử dụng.',
      fieldErrors: {email: 'Email đã tồn tại'},
    });
  });
});
