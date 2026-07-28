'use client';

import {useCallback, useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';

import {routes} from '@/config/routes';
import {normalizeAppError} from '@/lib/api/errors';
import {listPlacesService} from '@/lib/api/places';
import {
  deleteReviewService,
  getReviewService,
  listMyReviewsService,
  updateReviewService,
} from '@/lib/api/reviews';
import {CONTENT_STATUS_LABELS, formatDate} from '@/utils/format';

import {ConfirmButton} from '@/components/ui/ConfirmButton';
import {EmptyState, ErrorState, LoadingState} from '@/components/ui/AsyncState';
import {Pagination} from '@/components/ui/Pagination';

import type {ContentStatus, PaginatedData, Place, Review} from '@/lib/api/contracts';

const EMPTY_PAGE: PaginatedData<Review> = {items: [], page: 1, limit: 20, totalItems: 0, totalPages: 0};
const STATUSES: ContentStatus[] = ['DRAFT', 'PENDING', 'PUBLISHED', 'REJECTED', 'HIDDEN'];

export function MyReviewsList() {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const [data, setData] = useState(EMPTY_PAGE);
  const [places, setPlaces] = useState<Place[]>([]);
  const [editing, setEditing] = useState<Review | null>(null);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');

  const load = useCallback(async (signal?: AbortSignal) => {
    const params = new URLSearchParams(query);
    try {
      const [reviewData, placeData] = await Promise.all([
        listMyReviewsService(
          {
            page: Math.max(1, Number(params.get('page')) || 1),
            limit: 20,
            placeId: params.get('placeId') || undefined,
            status: (params.get('status') as ContentStatus | null) ?? undefined,
            sortOrder: 'desc',
          },
          signal,
        ),
        listPlacesService({limit: 100, sortBy: 'name', sortOrder: 'asc'}, signal),
      ]);
      setData(reviewData);
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
    const timer = window.setTimeout(() => void load(controller.signal), 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [load]);

  const handleEdit = async (id: string): Promise<void> => {
    try {
      const review = await getReviewService(id);
      setEditing(review);
      setRating(review.rating);
      setContent(review.content ?? '');
    } catch (editError) {
      setError(normalizeAppError(editError).message);
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!editing) {
      return;
    }
    try {
      await updateReviewService(editing.id, {rating, content: content.trim() || null});
      setEditing(null);
      await load();
    } catch (saveError) {
      setError(normalizeAppError(saveError).message);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteReviewService(id);
      await load();
    } catch (deleteError) {
      setError(normalizeAppError(deleteError).message);
    }
  };

  return (
    <>
      <p className='eyebrow'>Góc nhìn đã chia sẻ</p>
      <h1 className='mt-4 font-display text-5xl font-semibold'>Đánh giá của tôi</h1>
      <form action={routes.accountReviews} className='my-7 grid gap-4 rounded-2xl bg-surface p-4 sm:grid-cols-3'>
        <div>
          <label className='field-label' htmlFor='review-place-filter'>Điểm đến</label>
          <select id='review-place-filter' name='placeId' defaultValue={searchParams.get('placeId') ?? ''} className='field-control'>
            <option value=''>Tất cả</option>
            {places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}
          </select>
        </div>
        <div>
          <label className='field-label' htmlFor='review-status-filter'>Trạng thái</label>
          <select id='review-status-filter' name='status' defaultValue={searchParams.get('status') ?? ''} className='field-control'>
            <option value=''>Tất cả</option>
            {STATUSES.map((item) => <option key={item} value={item}>{CONTENT_STATUS_LABELS[item]}</option>)}
          </select>
        </div>
        <button type='submit' className='button-secondary self-end'>Lọc</button>
      </form>
      {error ? <p role='alert' className='mb-5 rounded-xl bg-danger-soft p-3 text-danger'>{error}</p> : null}
      {status === 'loading' ? <LoadingState /> : null}
      {status === 'error' ? <ErrorState message={error} onRetry={() => void load()} /> : null}
      {status === 'ready' && data.items.length === 0 ? <EmptyState title='Bạn chưa có đánh giá nào' /> : null}
      <div className='space-y-4'>
        {data.items.map((review) => (
          <article key={review.id} className='card'>
            <div className='flex flex-wrap justify-between gap-4'>
              <div>
                <p className='text-xs font-bold uppercase tracking-[0.14em] text-brand'>{review.place.name}</p>
                <p className='mt-3 text-warning'>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                <p className='mt-3 whitespace-pre-wrap text-sm leading-6 text-muted'>{review.content || 'Không có nội dung.'}</p>
                <p className='mt-3 text-xs text-muted'>{CONTENT_STATUS_LABELS[review.status]} · {formatDate(review.updatedAt)}</p>
              </div>
              <div className='flex gap-2'>
                <button type='button' onClick={() => void handleEdit(review.id)} className='button-secondary'>Sửa</button>
                <ConfirmButton label='Xóa' title={`Xóa đánh giá về ${review.place.name}?`} description='Đánh giá sẽ được soft-delete.' onConfirm={() => handleDelete(review.id)} />
              </div>
            </div>
          </article>
        ))}
      </div>
      <Pagination page={data.page} totalPages={data.totalPages} />
      {editing ? (
        <div role='dialog' aria-modal='true' aria-labelledby='edit-review-title' className='fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4'>
          <div className='w-full max-w-xl rounded-panel bg-surface p-6'>
            <h2 id='edit-review-title' className='font-display text-3xl font-semibold'>Sửa đánh giá</h2>
            <label className='field-label mt-5' htmlFor='edit-review-rating'>Số sao</label>
            <select id='edit-review-rating' value={rating} onChange={(event) => setRating(Number(event.target.value))} className='field-control'>
              {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} sao</option>)}
            </select>
            <label className='field-label mt-5' htmlFor='edit-review-content'>Nội dung</label>
            <textarea id='edit-review-content' value={content} maxLength={5000} onChange={(event) => setContent(event.target.value)} className='field-control min-h-36' />
            <div className='mt-5 flex justify-end gap-3'>
              <button type='button' onClick={() => setEditing(null)} className='button-secondary'>Hủy</button>
              <button type='button' onClick={handleSave} className='button-primary'>Lưu</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
