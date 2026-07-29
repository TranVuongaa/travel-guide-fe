export const API_ENDPOINTS = {
  auth: {
    register: '/api/v1/auth/register',
    login: '/api/v1/auth/login',
    google: '/api/v1/auth/oauth/google',
    refresh: '/api/v1/auth/refresh',
    logout: '/api/v1/auth/logout',
    logoutAll: '/api/v1/auth/logout-all',
  },
  users: {
    all: '/api/v1/users',
    me: '/api/v1/users/me',
    password: '/api/v1/users/me/password',
    one: (id: string) => `/api/v1/users/${encodeURIComponent(id)}`,
    role: (id: string) => `/api/v1/users/${encodeURIComponent(id)}/role`,
    status: (id: string) => `/api/v1/users/${encodeURIComponent(id)}/status`,
    linkGoogle: '/api/v1/users/me/oauth/google',
    unlinkOAuthProvider: (provider: string) => `/api/v1/users/me/oauth/${encodeURIComponent(provider)}`,
  },
  provinces: {
    all: '/api/v1/provinces',
    one: (id: string) => `/api/v1/provinces/${encodeURIComponent(id)}`,
  },
  categories: {
    all: '/api/v1/categories',
    one: (id: string) => `/api/v1/categories/${encodeURIComponent(id)}`,
  },
  places: {
    all: '/api/v1/places',
    one: (id: string) => `/api/v1/places/${encodeURIComponent(id)}`,
    reviews: (placeId: string) => `/api/v1/places/${encodeURIComponent(placeId)}/reviews`,
  },
  posts: {
    all: '/api/v1/posts',
    mine: '/api/v1/posts/mine',
    one: (id: string) => `/api/v1/posts/${encodeURIComponent(id)}`,
  },
  reviews: {
    mine: '/api/v1/reviews/mine',
    one: (id: string) => `/api/v1/reviews/${encodeURIComponent(id)}`,
  },
  comments: {
    all: '/api/v1/comments',
    one: (id: string) => `/api/v1/comments/${encodeURIComponent(id)}`,
  },
  reactions: {
    all: '/api/v1/reactions',
    summary: '/api/v1/reactions/summary',
  },
  admin: {
    travelContentIngestions: '/api/v1/admin/travel-content-ingestions',
  },
} as const;
