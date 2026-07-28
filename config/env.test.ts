import {describe, expect, it} from 'vitest';

import {env, isGoogleOAuthConfigured} from './env';

describe('public environment', () => {
  it('preserves the confirmed HTTP API scheme', () => {
    expect(env.apiBaseUrl).toBe('http://52.62.25.92');
    expect(env.apiBaseUrl.startsWith('https://')).toBe(false);
  });

  it('allows Google OAuth to remain dormant without credentials', () => {
    expect(typeof isGoogleOAuthConfigured).toBe('boolean');
  });
});
