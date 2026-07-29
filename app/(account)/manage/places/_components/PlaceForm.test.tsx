import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {listCategoriesService} from '@/lib/feature/categories/api';
import {createPlaceService, getPlaceService} from '@/lib/feature/places/api';
import {listProvincesService} from '@/lib/feature/provinces/api';

import {PlaceForm} from './PlaceForm';

import type {Category, PaginatedData, Place, Province} from '@/types/api';

const navigation = vi.hoisted(() => ({
  push: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({push: navigation.push}),
}));

vi.mock('@/lib/feature/categories/api', () => ({
  listCategoriesService: vi.fn(),
}));

vi.mock('@/lib/feature/places/api', () => ({
  createPlaceService: vi.fn(),
  getPlaceService: vi.fn(),
  updatePlaceService: vi.fn(),
}));

vi.mock('@/lib/feature/provinces/api', () => ({
  listProvincesService: vi.fn(),
}));

const province: Province = {
  id: 'province-1',
  name: 'Thành phố Huế',
  slug: 'thanh-pho-hue',
  images: [],
};

const category: Category = {
  id: 'category-1',
  name: 'Di sản',
  slug: 'di-san',
};

const place: Place = {
  id: 'place-1',
  name: 'Đại Nội Huế',
  slug: 'dai-noi-hue',
  description: 'Điểm đến di sản giữa lòng cố đô.',
  content: '<h2>Lịch sử</h2><p>Một quần thể kiến trúc đặc sắc.</p>',
  address: null,
  latitude: null,
  longitude: null,
  provinceId: province.id,
  avgRating: 4.8,
  reviewCount: 12,
  status: 'DRAFT',
  createdById: 'editor-1',
  createdAt: '2026-07-29T00:00:00.000Z',
  updatedAt: '2026-07-29T00:00:00.000Z',
  province,
  categories: [category],
  images: [],
};

const provincePage: PaginatedData<Province> = {
  items: [province],
  page: 1,
  limit: 100,
  totalItems: 1,
  totalPages: 1,
};

const categoryPage: PaginatedData<Category> = {
  items: [category],
  page: 1,
  limit: 100,
  totalItems: 1,
  totalPages: 1,
};

const fillRequiredFields = async (): Promise<void> => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Tên điểm đến'), place.name);
  await user.type(screen.getByLabelText('Mô tả'), place.description);
  await user.selectOptions(
    screen.getByLabelText('Tỉnh thành'),
    await screen.findByRole('option', {name: province.name}),
  );
  await user.click(screen.getByRole('checkbox', {name: category.name}));
};

beforeEach(() => {
  vi.mocked(listProvincesService).mockResolvedValue(provincePage);
  vi.mocked(listCategoriesService).mockResolvedValue(categoryPage);
  vi.mocked(getPlaceService).mockResolvedValue(place);
  vi.mocked(createPlaceService).mockResolvedValue(place);
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('PlaceForm', () => {
  it('submits trimmed optional destination HTML through the content key', async () => {
    const user = userEvent.setup();
    render(<PlaceForm />);
    await fillRequiredFields();
    await user.type(screen.getByLabelText('Nội dung điểm đến (HTML)'), `  ${place.content}  `);
    await user.click(screen.getByRole('button', {name: 'Lưu điểm đến'}));

    await waitFor(() => {
      expect(createPlaceService).toHaveBeenCalledWith({
        name: place.name,
        description: place.description,
        content: place.content,
        address: undefined,
        latitude: undefined,
        longitude: undefined,
        provinceId: province.id,
        categoryIds: [category.id],
      });
    });
  });

  it('omits content when the optional HTML field is empty', async () => {
    const user = userEvent.setup();
    render(<PlaceForm />);
    await fillRequiredFields();
    await user.click(screen.getByRole('button', {name: 'Lưu điểm đến'}));

    await waitFor(() => {
      expect(createPlaceService).toHaveBeenCalledWith({
        name: place.name,
        description: place.description,
        address: undefined,
        latitude: undefined,
        longitude: undefined,
        provinceId: province.id,
        categoryIds: [category.id],
      });
    });
  });

  it('populates content when editing a destination that already has it', async () => {
    render(<PlaceForm placeId={place.id} />);

    expect(await screen.findByLabelText('Nội dung điểm đến (HTML)')).toHaveValue(place.content);
  });
});
