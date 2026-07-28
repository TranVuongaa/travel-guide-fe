'use client';

import {useCallback, useEffect, useState} from 'react';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';

import {routes} from '@/config/routes';
import {listCategoriesService} from '@/lib/api/categories';
import {normalizeAppError} from '@/lib/api/errors';
import {listPlacesService} from '@/lib/api/places';
import {listProvincesService} from '@/lib/api/provinces';
import {formatNumber} from '@/utils/format';

import {EmptyState, ErrorState, LoadingState} from '@/components/ui/AsyncState';
import {Pagination} from '@/components/ui/Pagination';

import type {Category, PaginatedData, Place, Province, SortOrder} from '@/lib/api/contracts';

const EMPTY_PAGE: PaginatedData<Place> = {items: [], page: 1, limit: 20, totalItems: 0, totalPages: 0};

export function DestinationsExplorer() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(EMPTY_PAGE);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');

  const query = searchParams.toString();
  const load = useCallback(async (signal?: AbortSignal) => {
    const params = new URLSearchParams(query);
    const page = Math.max(1, Number(params.get('page')) || 1);
    try {
      const [placesData, provincesData, categoriesData] = await Promise.all([
        listPlacesService(
          {
            page,
            limit: 20,
            search: params.get('search') || undefined,
            provinceId: params.get('provinceId') || undefined,
            categoryId: params.get('categoryId') || undefined,
            sortBy: (params.get('sortBy') as 'avgRating' | 'createdAt' | 'name' | 'updatedAt' | null) ?? 'createdAt',
            sortOrder: (params.get('sortOrder') as SortOrder | null) ?? 'desc',
          },
          signal,
        ),
        listProvincesService({limit: 100, sortOrder: 'asc'}, signal),
        listCategoriesService({limit: 100, sortOrder: 'asc'}, signal),
      ]);
      setData(placesData);
      setProvinces(provincesData.items);
      setCategories(categoriesData.items);
      setStatus('ready');
    } catch (loadError) {
      if (!signal?.aborted) {
        setError(normalizeAppError(loadError).message);
        setStatus('error');
      }
    }
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setStatus('loading');
      void load(controller.signal);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [load]);

  return (
    <>
      <form action={routes.destinations} className='mb-8 grid gap-4 rounded-panel bg-surface p-5 md:grid-cols-5'>
        <div className='md:col-span-2'>
          <label className='field-label' htmlFor='place-search'>Tìm kiếm</label>
          <input id='place-search' name='search' defaultValue={searchParams.get('search') ?? ''} className='field-control' placeholder='Tên hoặc mô tả' />
        </div>
        <div>
          <label className='field-label' htmlFor='province-filter'>Tỉnh thành</label>
          <select id='province-filter' name='provinceId' defaultValue={searchParams.get('provinceId') ?? ''} className='field-control'>
            <option value=''>Tất cả</option>
            {provinces.map((province) => <option key={province.id} value={province.id}>{province.name}</option>)}
          </select>
        </div>
        <div>
          <label className='field-label' htmlFor='category-filter'>Danh mục</label>
          <select id='category-filter' name='categoryId' defaultValue={searchParams.get('categoryId') ?? ''} className='field-control'>
            <option value=''>Tất cả</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </div>
        <div>
          <label className='field-label' htmlFor='place-sort'>Sắp xếp</label>
          <select id='place-sort' name='sortBy' defaultValue={searchParams.get('sortBy') ?? 'createdAt'} className='field-control'>
            <option value='createdAt'>Mới nhất</option>
            <option value='avgRating'>Đánh giá cao</option>
            <option value='name'>Tên</option>
            <option value='updatedAt'>Mới cập nhật</option>
          </select>
        </div>
        <input type='hidden' name='sortOrder' value={searchParams.get('sortOrder') ?? 'desc'} />
        <div className='flex flex-wrap gap-3 md:col-span-5'>
          <button type='submit' className='button-primary'>Áp dụng bộ lọc</button>
          <Link href={routes.destinations} className='button-secondary'>Xóa bộ lọc</Link>
        </div>
      </form>

      {status === 'loading' ? <LoadingState /> : null}
      {status === 'error' ? <ErrorState message={error} onRetry={() => void load()} /> : null}
      {status === 'ready' && data.items.length === 0 ? (
        <EmptyState title='Chưa tìm thấy điểm đến' description='Thử thay đổi từ khóa hoặc bộ lọc.' />
      ) : null}
      {status === 'ready' && data.items.length > 0 ? (
        <>
          <p className='mb-5 text-sm text-muted'>{formatNumber(data.totalItems)} điểm đến</p>
          <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
            {data.items.map((place) => (
              <Link key={place.id} href={routes.destination(place.id)} className='card group transition hover:-translate-y-1 hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus'>
                <p className='text-xs font-bold uppercase tracking-[0.16em] text-brand'>{place.province.name}</p>
                <h2 className='mt-4 font-display text-3xl font-semibold'>{place.name}</h2>
                <p className='mt-3 line-clamp-3 text-sm leading-6 text-muted'>{place.description}</p>
                <div className='mt-6 flex flex-wrap gap-2'>
                  {place.categories.map((category) => <span key={category.id} className='rounded-full bg-accent/35 px-3 py-1 text-xs font-semibold'>{category.name}</span>)}
                </div>
                <p className='mt-5 text-sm font-semibold'>★ {place.avgRating.toFixed(1)} · {place.reviewCount} đánh giá</p>
              </Link>
            ))}
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} />
        </>
      ) : null}
    </>
  );
}
