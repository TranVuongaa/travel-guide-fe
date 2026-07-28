import {describe, expect, it} from 'vitest';

import {unwrapApiSuccess} from './response';

describe('unwrapApiSuccess', () => {
  it('returns data from a valid success envelope', () => {
    expect(
      unwrapApiSuccess({
        success: true,
        data: {id: 'province-1', name: 'Huế'},
        meta: {timestamp: '2026-07-28T00:00:00Z', requestId: 'request-1'},
      }),
    ).toEqual({id: 'province-1', name: 'Huế'});
  });

  it('rejects an invalid response envelope', () => {
    expect(() => unwrapApiSuccess({success: false})).toThrow(
      expect.objectContaining({code: 'INVALID_API_RESPONSE'}),
    );
  });
});
