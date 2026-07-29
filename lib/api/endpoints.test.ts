import {describe, expect, it} from 'vitest';

import {API_ENDPOINTS} from '@/lib/api/endpoints';

describe('API_ENDPOINTS', () => {
  it('keeps every static endpoint under the versioned API prefix', () => {
    const staticEndpoints = [
      API_ENDPOINTS.auth.register,
      API_ENDPOINTS.auth.login,
      API_ENDPOINTS.auth.google,
      API_ENDPOINTS.auth.refresh,
      API_ENDPOINTS.auth.logout,
      API_ENDPOINTS.auth.logoutAll,
      API_ENDPOINTS.users.all,
      API_ENDPOINTS.users.me,
      API_ENDPOINTS.users.password,
      API_ENDPOINTS.users.linkGoogle,
      API_ENDPOINTS.provinces.all,
      API_ENDPOINTS.categories.all,
      API_ENDPOINTS.places.all,
      API_ENDPOINTS.posts.all,
      API_ENDPOINTS.posts.mine,
      API_ENDPOINTS.reviews.mine,
      API_ENDPOINTS.comments.all,
      API_ENDPOINTS.reactions.all,
      API_ENDPOINTS.reactions.summary,
      API_ENDPOINTS.admin.travelContentIngestions,
    ];

    expect(staticEndpoints.every((endpoint) => endpoint.startsWith('/api/v1/'))).toBe(true);
  });

  it('encodes every dynamic path segment', () => {
    const segment = 'id/with spaces?';
    const encodedSegment = encodeURIComponent(segment);

    expect(API_ENDPOINTS.users.one(segment)).toBe(`${API_ENDPOINTS.users.all}/${encodedSegment}`);
    expect(API_ENDPOINTS.users.role(segment)).toBe(`${API_ENDPOINTS.users.all}/${encodedSegment}/role`);
    expect(API_ENDPOINTS.users.status(segment)).toBe(`${API_ENDPOINTS.users.all}/${encodedSegment}/status`);
    expect(API_ENDPOINTS.users.unlinkOAuthProvider(segment)).toBe(
      `${API_ENDPOINTS.users.me}/oauth/${encodedSegment}`,
    );
    expect(API_ENDPOINTS.provinces.one(segment)).toBe(`${API_ENDPOINTS.provinces.all}/${encodedSegment}`);
    expect(API_ENDPOINTS.categories.one(segment)).toBe(`${API_ENDPOINTS.categories.all}/${encodedSegment}`);
    expect(API_ENDPOINTS.places.one(segment)).toBe(`${API_ENDPOINTS.places.all}/${encodedSegment}`);
    expect(API_ENDPOINTS.places.reviews(segment)).toBe(`${API_ENDPOINTS.places.all}/${encodedSegment}/reviews`);
    expect(API_ENDPOINTS.posts.one(segment)).toBe(`${API_ENDPOINTS.posts.all}/${encodedSegment}`);
    expect(API_ENDPOINTS.reviews.one(segment)).toBe(`/api/v1/reviews/${encodedSegment}`);
    expect(API_ENDPOINTS.comments.one(segment)).toBe(`${API_ENDPOINTS.comments.all}/${encodedSegment}`);
  });
});
