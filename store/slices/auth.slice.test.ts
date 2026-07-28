import {describe, expect, it} from 'vitest';

import {authReducer, login, sessionCleared, userChanged} from './auth.slice';

import type {User} from '@/types/api';

const USER: User = {
  id: 'user-1',
  email: 'traveler@example.com',
  displayName: 'Người đi',
  avatarUrl: null,
  role: 'USER',
  isActive: true,
  hasPassword: true,
  oauthProviders: [],
  createdAt: '2026-07-28T00:00:00Z',
  updatedAt: '2026-07-28T00:00:00Z',
};

describe('authReducer', () => {
  it('tracks pending and fulfilled login states', () => {
    const pending = authReducer(undefined, login.pending('request-1', {email: 'a@b.com', password: 'password'}));
    expect(pending.status).toBe('loading');

    const fulfilled = authReducer(pending, login.fulfilled(USER, 'request-1', {email: 'a@b.com', password: 'password'}));
    expect(fulfilled.status).toBe('authenticated');
    expect(fulfilled.user).toEqual(USER);
  });

  it('updates and clears the shared user', () => {
    const authenticated = authReducer(undefined, userChanged(USER));
    expect(authenticated.user?.displayName).toBe('Người đi');

    const cleared = authReducer(authenticated, sessionCleared());
    expect(cleared.user).toBeNull();
    expect(cleared.status).toBe('idle');
  });
});
