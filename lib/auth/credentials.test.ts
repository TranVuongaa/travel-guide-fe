import {afterEach, describe, expect, it, vi} from 'vitest';

import {
  clearCredentials,
  getCredentials,
  setCredentials,
  subscribeToCredentials,
} from './credentials';

afterEach(() => {
  clearCredentials();
});

describe('in-memory credentials', () => {
  it('stores and clears credentials only in module memory', () => {
    setCredentials({accessToken: 'access', refreshToken: 'refresh'});
    expect(getCredentials()).toEqual({accessToken: 'access', refreshToken: 'refresh'});

    clearCredentials();
    expect(getCredentials()).toBeNull();
  });

  it('notifies subscribers when the session changes', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToCredentials(listener);

    setCredentials({accessToken: 'access', refreshToken: 'refresh'});
    clearCredentials();
    unsubscribe();

    expect(listener).toHaveBeenNthCalledWith(1, 'changed');
    expect(listener).toHaveBeenNthCalledWith(2, 'cleared');
  });
});
