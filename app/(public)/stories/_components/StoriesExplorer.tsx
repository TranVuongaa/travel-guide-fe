'use client';

import {useCallback, useEffect, useState} from 'react';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';

import {routes} from '@/config/routes';
import {useDebouncedSearchParam} from '@/hooks/useDebouncedSearchParam';
import {normalizeAppError} from '@/lib/api/errors';
import {listPlacesService} from '@/lib/feature/places/api';
import {listPostsService} from '@/lib/feature/posts/api';
import {formatDate, formatNumber} from '@/utils/format';

import {EmptyState, ErrorState, LoadingState} from '@/components/ui/AsyncState';
import {Pagination} from '@/components/ui/Pagination';

import type {PaginatedData, Place, Post, PostSource} from '@/types/api';

const EMPTY_PAGE: PaginatedData<Post> = {items: [], page: 1, limit: 20, totalItems: 0, totalPages: 0};

export function StoriesExplorer() {
  const searchParams = useSearchParams();
  const {search, setSearch} = useDebouncedSearchParam();
  const query = searchParams.toString();
  const [data, setData] = useState(EMPTY_PAGE);
  const [places, setPlaces] = useState<Place[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');

  const load = useCallback(async (signal?: AbortSignal) => {
    const params = new URLSearchParams(query);
    try {
      const [postData, placeData] = await Promise.all([
        listPostsService(
          {
            page: Math.max(1, Number(params.get('page')) || 1),
            limit: 20,
            search: params.get('search') || undefined,
            placeId: params.get('placeId') || undefined,
            authorId: params.get('authorId') || undefined,
            source: (params.get('source') as PostSource | null) ?? undefined,
            sortOrder: 'desc',
          },
          signal,
        ),
        listPlacesService({limit: 100, sortBy: 'name', sortOrder: 'asc'}, signal),
      ]);
      setData(postData);
      setPlaces(placeData.items);
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
      <form action={routes.stories} className='mb-8 grid gap-4 rounded-panel bg-surface p-5 md:grid-cols-4'>
        <div className='md:col-span-2'>
          <label className='field-label' htmlFor='story-search'>Tìm kiếm</label>
          <input
            id='story-search'
            name='search'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className='field-control'
            placeholder='Tiêu đề hoặc nội dung'
          />
        </div>
        <div>
          <label className='field-label' htmlFor='story-place'>Điểm đến</label>
          <select id='story-place' name='placeId' defaultValue={searchParams.get('placeId') ?? ''} className='field-control'>
            <option value=''>Tất cả</option>
            {places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}
          </select>
        </div>
        <div>
          <label className='field-label' htmlFor='story-source'>Nguồn</label>
          <select id='story-source' name='source' defaultValue={searchParams.get('source') ?? ''} className='field-control'>
            <option value=''>Tất cả</option>
            <option value='SYSTEM'>Biên tập</option>
            <option value='USER'>Cộng đồng</option>
          </select>
        </div>
        <div className='flex flex-wrap gap-3 md:col-span-4'>
          <button type='submit' className='button-primary'>Tìm câu chuyện</button>
          <Link href={routes.stories} className='button-secondary'>Xóa bộ lọc</Link>
        </div>
      </form>
      {status === 'loading' ? <LoadingState /> : null}
      {status === 'error' ? <ErrorState message={error} onRetry={() => void load()} /> : null}
      {status === 'ready' && data.items.length === 0 ? <EmptyState title='Chưa có câu chuyện phù hợp' /> : null}
      {status === 'ready' && data.items.length > 0 ? (
        <>
          <p className='mb-5 text-sm text-muted'>{formatNumber(data.totalItems)} câu chuyện</p>
          <div className='divide-y divide-line border-y border-line'>
            {data.items.map((post) => (
              <Link key={post.id} href={routes.story(post.id)} className='grid gap-5 py-7 transition hover:pl-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus md:grid-cols-[1fr_13rem]'>
                <div>
                  <p className='text-xs font-bold uppercase tracking-[0.14em] text-brand'>
                    {post.place?.name ?? 'Chuyện dọc đường'} · {post.author.displayName}
                  </p>
                  <h2 className='mt-3 font-display text-3xl font-semibold'>{post.title}</h2>
                  <p className='mt-3 line-clamp-2 text-sm leading-6 text-muted'>{post.description}</p>
                </div>
                <div className='text-sm text-muted md:text-right'>
                  <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                  <p className='mt-2'>{post.commentCount} bình luận</p>
                </div>
              </Link>
            ))}
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} />
        </>
      ) : null}
    </>
  );
}
