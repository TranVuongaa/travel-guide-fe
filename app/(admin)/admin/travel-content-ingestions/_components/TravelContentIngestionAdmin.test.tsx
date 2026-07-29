import {act, cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {createTravelContentIngestionService} from '@/lib/feature/travel-content-ingestions/api';

import {TravelContentIngestionAdmin} from './TravelContentIngestionAdmin';

import type {TravelContentIngestionRun} from '@/types/api';

vi.mock('@/lib/feature/travel-content-ingestions/api', () => ({
  createTravelContentIngestionService: vi.fn(),
}));

const run: TravelContentIngestionRun = {
  id: '96c018b4-35e9-4f2a-9c8f-84954d12809f',
  status: 'QUEUED',
  trendKeywordCount: 4,
  discoveredUrlCount: 12,
  importedPostCount: 3,
  duplicateCount: 2,
  skippedCount: 5,
  failedCount: 2,
  errorSummary: {source: 'example.vn', reason: 'timeout'},
  createdAt: '2026-07-29T05:00:00.000Z',
  startedAt: null,
  completedAt: null,
};

beforeEach(() => {
  vi.mocked(createTravelContentIngestionService).mockResolvedValue(run);
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('TravelContentIngestionAdmin', () => {
  it('requires confirmation and renders the accepted run snapshot', async () => {
    const user = userEvent.setup();
    render(<TravelContentIngestionAdmin />);

    await user.click(screen.getByRole('button', {name: 'Chạy thu thập nội dung'}));
    expect(screen.getByRole('dialog', {name: 'Bắt đầu thu thập nội dung?'})).toBeInTheDocument();

    await user.click(screen.getByRole('button', {name: 'Hủy'}));
    expect(createTravelContentIngestionService).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', {name: 'Chạy thu thập nội dung'}));
    await user.click(screen.getByRole('button', {name: 'Xác nhận và chạy'}));

    expect(createTravelContentIngestionService).toHaveBeenCalledOnce();
    expect(await screen.findByRole('status')).toHaveTextContent('Backend đã tiếp nhận yêu cầu');
    expect(screen.getByText(`ID: ${run.id}`)).toBeInTheDocument();
    expect(screen.getByText('Trạng thái: Đang chờ')).toBeInTheDocument();
    expect(screen.getByText('Từ khóa xu hướng')).toBeInTheDocument();
    expect(screen.getByText('URL đã phát hiện')).toBeInTheDocument();
    expect(screen.getByText('Bài viết đã nhập')).toBeInTheDocument();
    expect(screen.getByText('Nội dung trùng lặp')).toBeInTheDocument();
    expect(screen.getByText('Nội dung đã bỏ qua')).toBeInTheDocument();
    expect(screen.getByText('Nội dung lỗi')).toBeInTheDocument();
    expect(screen.getByText(/"reason": "timeout"/)).toBeInTheDocument();
  });

  it('communicates the pending state and prevents another confirmation', async () => {
    const user = userEvent.setup();
    let resolveRun: ((value: TravelContentIngestionRun) => void) | undefined;
    vi.mocked(createTravelContentIngestionService).mockReturnValue(
      new Promise((resolve) => {
        resolveRun = resolve;
      }),
    );
    render(<TravelContentIngestionAdmin />);

    await user.click(screen.getByRole('button', {name: 'Chạy thu thập nội dung'}));
    await user.click(screen.getByRole('button', {name: 'Xác nhận và chạy'}));

    expect(screen.getByRole('button', {name: 'Đang xử lý…'})).toBeDisabled();
    expect(createTravelContentIngestionService).toHaveBeenCalledOnce();

    await act(async () => {
      resolveRun?.(run);
    });
    expect(await screen.findByRole('status')).toBeInTheDocument();
  });

  it('shows specific guidance when another run is active', async () => {
    const user = userEvent.setup();
    vi.mocked(createTravelContentIngestionService).mockRejectedValue({
      code: 'CONFLICT',
      message: 'Conflict',
      status: 409,
    });
    render(<TravelContentIngestionAdmin />);

    await user.click(screen.getByRole('button', {name: 'Chạy thu thập nội dung'}));
    await user.click(screen.getByRole('button', {name: 'Xác nhận và chạy'}));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Đang có một lần thu thập nội dung hoạt động',
    );
    expect(screen.getByRole('button', {name: 'Chạy thu thập nội dung'})).toBeEnabled();
  });
});
