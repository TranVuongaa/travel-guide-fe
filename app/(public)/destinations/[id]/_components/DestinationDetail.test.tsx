import {cleanup, render, screen} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {getPlaceService} from '@/lib/feature/places/api';

import {DestinationDetail} from './DestinationDetail';

import type {Place} from '@/types/api';

vi.mock('@/lib/feature/places/api', () => ({
  getPlaceService: vi.fn(),
}));

vi.mock('@/components/community/ReviewSection', () => ({
  ReviewSection: ({placeId}: Readonly<{placeId: string}>) => (
    <div data-testid='review-section'>{placeId}</div>
  ),
}));

const place: Place = {
  id: 'place-1',
  name: 'Đại Nội Huế',
  slug: 'dai-noi-hue',
  description: 'Điểm đến di sản giữa lòng cố đô.',
  content: `
    <script>alert('unsafe')</script>
    <h2>Lịch sử và kiến trúc</h2>
    <p onclick="alert('unsafe')">Một quần thể kiến trúc đặc sắc.</p>
  `,
  address: 'Huế',
  latitude: 16.4695,
  longitude: 107.5785,
  provinceId: 'province-1',
  avgRating: 4.8,
  reviewCount: 12,
  status: 'PUBLISHED',
  createdById: 'editor-1',
  createdAt: '2026-07-29T00:00:00.000Z',
  updatedAt: '2026-07-29T00:00:00.000Z',
  province: {
    id: 'province-1',
    name: 'Thành phố Huế',
    slug: 'thanh-pho-hue',
    images: [],
  },
  categories: [
    {
      id: 'category-1',
      name: 'Di sản',
      slug: 'di-san',
    },
  ],
  images: [],
};

beforeEach(() => {
  vi.mocked(getPlaceService).mockResolvedValue(place);
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('DestinationDetail', () => {
  it('sanitizes and renders destination HTML content when the API provides it', async () => {
    const {container} = render(<DestinationDetail id={place.id} />);

    expect(await screen.findByRole('heading', {level: 2, name: 'Lịch sử và kiến trúc'})).toBeInTheDocument();
    expect(screen.getByText('Một quần thể kiến trúc đặc sắc.')).toBeVisible();
    expect(container.querySelector('.rich-content')).toBeInTheDocument();
    expect(container.querySelector('script')).not.toBeInTheDocument();
    expect(container.querySelector('[onclick]')).not.toBeInTheDocument();
    expect(screen.getByTestId('review-section')).toHaveTextContent(place.id);
  });

  it('does not render an empty rich-content container for current API responses', async () => {
    vi.mocked(getPlaceService).mockResolvedValue({...place, content: undefined});

    const {container} = render(<DestinationDetail id={place.id} />);

    expect(await screen.findByRole('heading', {level: 1, name: place.name})).toBeInTheDocument();
    expect(container.querySelector('.rich-content')).not.toBeInTheDocument();
  });
});
