import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {listPlacesService} from '@/lib/feature/places/api';
import {createPostService, getPostService, updatePostService} from '@/lib/feature/posts/api';

import {PostForm} from './PostForm';

import type {PaginatedData, Place, Post} from '@/types/api';

const navigation = vi.hoisted(() => ({
  push: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({push: navigation.push}),
}));

vi.mock('@/lib/feature/places/api', () => ({
  listPlacesService: vi.fn(),
}));

vi.mock('@/lib/feature/posts/api', () => ({
  createPostService: vi.fn(),
  getPostService: vi.fn(),
  updatePostService: vi.fn(),
}));

const emptyPlaces: PaginatedData<Place> = {
  items: [],
  page: 1,
  limit: 100,
  totalItems: 0,
  totalPages: 0,
};

const createdPost: Post = {
  id: 'post-1',
  authorId: 'author-1',
  placeId: null,
  title: 'Một ngày ở Huế',
  description: 'Lịch trình ngắn để khám phá Đại Nội Huế.',
  content: '<p>Nội dung bài viết.</p>',
  source: 'USER',
  status: 'DRAFT',
  deletedAt: null,
  createdAt: '2026-07-29T00:00:00.000Z',
  updatedAt: '2026-07-29T00:00:00.000Z',
  author: {
    id: 'author-1',
    displayName: 'Người viết',
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
  vi.mocked(createPostService).mockResolvedValue(createdPost);
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('PostForm', () => {
  it('submits the required description and HTML article body for a new draft', async () => {
    const user = userEvent.setup();
    render(<PostForm />);

    await user.type(screen.getByLabelText('Tiêu đề'), createdPost.title);
    await user.type(screen.getByLabelText('Mô tả ngắn'), createdPost.description);
    await screen.findByRole('textbox', {name: 'Nội dung bài viết'});
    const linkButton = screen.getByRole('button', {name: 'Chèn liên kết'});
    await waitFor(() => expect(linkButton).toBeEnabled());
    await user.click(linkButton);
    await user.type(screen.getByLabelText('Văn bản hiển thị'), 'Nội dung bài viết.');
    await user.type(screen.getByLabelText('Địa chỉ liên kết'), 'https://example.com/bai-viet');
    await user.click(screen.getByRole('button', {name: 'Chèn'}));
    await user.click(screen.getByRole('button', {name: 'Lưu bản nháp'}));

    await waitFor(() => {
      expect(createPostService).toHaveBeenCalledWith({
        title: createdPost.title,
        description: createdPost.description,
        content:
          '<p><a target="_blank" rel="noopener noreferrer nofollow" ' +
          'href="https://example.com/bai-viet">Nội dung bài viết.</a></p>',
        placeId: undefined,
        publicationIntent: 'DRAFT',
      });
    });
  });

  it('loads existing HTML into the visual editor and submits its updated HTML', async () => {
    const user = userEvent.setup();
    vi.mocked(getPostService).mockResolvedValue(createdPost);
    vi.mocked(updatePostService).mockResolvedValue({...createdPost, content: '<h2>Nội dung mới</h2>'});

    render(<PostForm postId={createdPost.id} />);

    const editor = await screen.findByRole('textbox', {name: 'Nội dung bài viết'});
    expect(editor).toContainHTML(createdPost.content);

    await user.click(screen.getByRole('button', {name: 'Tiêu đề cấp 2'}));
    await user.click(screen.getByRole('button', {name: 'Lưu bản nháp'}));

    await waitFor(() => {
      expect(updatePostService).toHaveBeenCalledWith(
        createdPost.id,
        expect.objectContaining({
          content: '<h2>Nội dung bài viết.</h2>',
          publicationIntent: 'DRAFT',
        }),
      );
    });
  });

  it('rejects a visually empty article body', async () => {
    const user = userEvent.setup();
    render(<PostForm />);

    await user.type(screen.getByLabelText('Tiêu đề'), createdPost.title);
    await user.type(screen.getByLabelText('Mô tả ngắn'), createdPost.description);
    await screen.findByRole('textbox', {name: 'Nội dung bài viết'});
    await user.click(screen.getByRole('button', {name: 'Lưu bản nháp'}));

    expect(screen.getByRole('alert')).toHaveTextContent('Nội dung phải có từ 1 đến 100.000 ký tự.');
    expect(createPostService).not.toHaveBeenCalled();
  });
});
