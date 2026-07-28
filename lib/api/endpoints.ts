export const endpoints = {
  health: '/api',
  auth: {
    register: '/api/v1/auth/register',
    login: '/api/v1/auth/login',
    google: '/api/v1/auth/oauth/google',
    refresh: '/api/v1/auth/refresh',
    logout: '/api/v1/auth/logout',
    logoutAll: '/api/v1/auth/logout-all',
  },
  users: {
    me: '/api/v1/users/me',
    password: '/api/v1/users/me/password',
    all: '/api/v1/users',
    one: (id: string) => `/api/v1/users/${encodeURIComponent(id)}`,
    role: (id: string) => `/api/v1/users/${encodeURIComponent(id)}/role`,
    status: (id: string) => `/api/v1/users/${encodeURIComponent(id)}/status`,
    linkGoogle: '/api/v1/users/me/oauth/google',
    unlink: (provider: string) => `/api/v1/users/me/oauth/${encodeURIComponent(provider)}`,
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
    reviews: (id: string) => `/api/v1/places/${encodeURIComponent(id)}/reviews`,
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
} as const;
