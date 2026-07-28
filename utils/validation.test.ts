import {describe, expect, it} from 'vitest';

import {getRequiredError, isEmail, isHttpUrl} from './validation';

describe('validation utilities', () => {
  it('validates email and public HTTP URLs', () => {
    expect(isEmail('traveler@example.com')).toBe(true);
    expect(isEmail('invalid-email')).toBe(false);
    expect(isHttpUrl('http://52.62.25.92')).toBe(true);
    expect(isHttpUrl('javascript:alert(1)')).toBe(false);
  });

  it('returns a Vietnamese required-field message', () => {
    expect(getRequiredError(' ', 'Tên')).toBe('Tên là bắt buộc.');
    expect(getRequiredError('Huế', 'Tên')).toBeUndefined();
  });
});
