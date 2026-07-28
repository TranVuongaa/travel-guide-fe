'use client';

import {useCallback, useEffect, useState} from 'react';
import Link from 'next/link';

import {routes} from '@/config/routes';
import {normalizeAppError} from '@/lib/api/errors';
import {
  createReviewService,
  deleteReviewService,
  getReviewService,
  listPlaceReviewsService,
  updateReviewService,
} from '@/lib/api/reviews';
import {selectCurrentUser} from '@/store/selectors';
import {useAppSelector} from '@/store/hooks';
import {formatDate} from '@/utils/format';

import {CommentsThread} from './CommentsThread';
import {ReactionBar} from './ReactionBar';

import type {Review} from '@/lib/api/contracts';

export function ReviewSection({placeId}: Readonly<{placeId: string}>) {
  const user = useAppSelector(selectCurrentUser);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  const loadReviews = useCallback(async (signal?: AbortSignal) => {
    try {
      const data = await listPlaceReviewsService(placeId, {page: 1, limit: 100}, signal);
      setReviews(data.items);
      setStatus('ready');
      setError(null);
    } catch (loadError) {
      if (signal?.aborted) {
        return;
      }
      setError(normalizeAppError(loadError).message);
      setStatus('error');
    }
  }, [placeId]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => void loadReviews(controller.signal), 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [loadReviews]);

  const resetForm = (): void => {
    setRating(5);
    setContent('');
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    try {
      if (editingId) {
        await updateReviewService(editingId, {rating, content: content.trim() || null});
      } else {
        await createReviewService(placeId, {rating, content: content.trim() || undefined});
      }
      resetForm();
      await loadReviews();
    } catch (submitError) {
      setError(normalizeAppError(submitError).message);
    }
  };

  const handleEdit = async (id: string): Promise<void> => {
    try {
      const review = await getReviewService(id);
      setEditingId(review.id);
      setRating(review.rating);
      setContent(review.content ?? '');
    } catch (editError) {
      setError(normalizeAppError(editError).message);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteReviewService(id);
      await loadReviews();
    } catch (deleteError) {
      setError(normalizeAppError(deleteError).message);
    }
  };

  return (
    <section aria-labelledby='reviews-title' className='mt-14'>
      <div className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <p className='eyebrow'>Góc nhìn cộng đồng</p>
          <h2 id='reviews-title' className='mt-3 font-display text-4xl font-semibold'>Đánh giá</h2>
        </div>
      </div>
      {user ? (
        <form onSubmit={handleSubmit} className='card mt-6'>
          <div className='grid gap-5 sm:grid-cols-[10rem_1fr]'>
            <div>
              <label className='field-label' htmlFor='review-rating'>Số sao</label>
              <select
                id='review-rating'
                value={rating}
                onChange={(event) => setRating(Number(event.target.value))}
                className='field-control'
              >
                {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} sao</option>)}
              </select>
            </div>
            <div>
              <label className='field-label' htmlFor='review-content'>Nội dung (không bắt buộc)</label>
              <textarea
                id='review-content'
                value={content}
                maxLength={5000}
                onChange={(event) => setContent(event.target.value)}
                className='field-control min-h-28'
              />
            </div>
          </div>
          <div className='mt-4 flex gap-3'>
            <button type='submit' className='button-primary'>{editingId ? 'Lưu đánh giá' : 'Gửi đánh giá'}</button>
            {editingId ? <button type='button' onClick={resetForm} className='button-secondary'>Hủy sửa</button> : null}
          </div>
        </form>
      ) : (
        <p className='mt-5 text-muted'>
          <Link href={routes.login} className='font-semibold text-brand underline underline-offset-4'>Đăng nhập</Link>{' '}
          để viết đánh giá.
        </p>
      )}
      {error ? <p role='alert' className='mt-5 text-danger'>{error}</p> : null}
      {status === 'loading' ? <p role='status' className='mt-8 text-muted'>Đang tải đánh giá…</p> : null}
      {status === 'ready' && reviews.length === 0 ? <p className='mt-8 text-muted'>Chưa có đánh giá nào.</p> : null}
      <div className='mt-8 space-y-6'>
        {reviews.map((review) => (
          <article key={review.id} className='card'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <p className='font-semibold'>{review.author.displayName}</p>
                <p className='mt-1 text-sm text-warning' aria-label={`${review.rating} trên 5 sao`}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </p>
              </div>
              <time dateTime={review.createdAt} className='text-xs text-muted'>{formatDate(review.createdAt)}</time>
            </div>
            {review.content ? <p className='mt-4 whitespace-pre-wrap leading-7 text-muted'>{review.content}</p> : null}
            <ReactionBar targetType='REVIEW' targetId={review.id} initialCounts={review.reactionCounts} />
            <div className='mt-4 flex flex-wrap gap-3 text-sm'>
              <button
                type='button'
                onClick={() => setExpandedId(expandedId === review.id ? null : review.id)}
                className='font-semibold text-brand underline underline-offset-4'
              >
                {expandedId === review.id ? 'Ẩn thảo luận' : `Bình luận (${review.commentCount})`}
              </button>
              {user?.id === review.authorId ? (
                <>
                  <button type='button' onClick={() => handleEdit(review.id)} className='font-semibold text-brand underline underline-offset-4'>Sửa</button>
                  <button type='button' onClick={() => handleDelete(review.id)} className='font-semibold text-danger underline underline-offset-4'>Xóa</button>
                </>
              ) : null}
            </div>
            {expandedId === review.id ? <CommentsThread targetType='REVIEW' targetId={review.id} /> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
