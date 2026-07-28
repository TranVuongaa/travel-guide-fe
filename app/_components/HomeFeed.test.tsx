import {cleanup, render, screen} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {listPlacesService} from '@/lib/feature/places/api';
import {listPostsService} from '@/lib/feature/posts/api';

import {HomeFeed} from './HomeFeed';

import type {PaginatedData, Place, Post} from '@/types/api';

vi.mock('@/lib/feature/places/api', () => ({
  listPlacesService: vi.fn(),
}));

vi.mock('@/lib/feature/posts/api', () => ({
  listPostsService: vi.fn(),
}));

const emptyPlaces: PaginatedData<Place> = {
  items: [],
  page: 1,
  limit: 3,
  totalItems: 0,
  totalPages: 0,
};

const post: Post = {
  id: 'post-1',
  authorId: 'author-1',
  placeId: null,
  title: 'Một ngày ở Huế',
  description: 'Lịch trình ngắn để khám phá Đại Nội Huế.',
  content: '<figure><img src="https://images.example.com/hue.jpg" alt="Đại Nội Huế"></figure>',
  source: 'SYSTEM',
  status: 'PUBLISHED',
  deletedAt: null,
  createdAt: '2026-07-29T00:00:00.000Z',
  updatedAt: '2026-07-29T00:00:00.000Z',
  author: {
    id: 'author-1',
    displayName: 'Ban biên tập',
    avatarUrl: null,
  },
  place: null,
  commentCount: 0,
  reactionCounts: {
    LIKE: 0,
    LOVE: 0,
    WOW: 0,
    SAD: 0,
    ANGRY: 0,
  },
};

beforeEach(() => {
  vi.mocked(listPlacesService).mockResolvedValue(emptyPlaces);
  vi.mocked(listPostsService).mockResolvedValue({
    items: [post],
    page: 1,
    limit: 3,
    totalItems: 1,
    totalPages: 1,
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('HomeFeed', () => {
  it('uses the plain-text description for story previews instead of HTML content', async () => {
    render(<HomeFeed />);

    expect(await screen.findByText(post.description)).toBeInTheDocument();
    expect(screen.queryByText(post.content)).not.toBeInTheDocument();
    expect(document.querySelector('figure')).not.toBeInTheDocument();
  });
});
