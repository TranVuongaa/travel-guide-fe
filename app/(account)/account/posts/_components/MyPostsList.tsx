'use client';

import {useCallback, useEffect, useState} from 'react';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';

import {routes} from '@/config/routes';
import {normalizeAppError} from '@/lib/api/errors';
import {deletePostService, listMyPostsService} from '@/lib/api/posts';
import {CONTENT_STATUS_LABELS, formatDate} from '@/utils/format';

import {ConfirmButton} from '@/components/ui/ConfirmButton';
import {EmptyState, ErrorState, LoadingState} from '@/components/ui/AsyncState';
import {Pagination} from '@/components/ui/Pagination';

import type {ContentStatus, PaginatedData, Post} from '@/lib/api/contracts';

const EMPTY_PAGE: PaginatedData<Post> = {items: [], page: 1, limit: 20, totalItems: 0, totalPages: 0};
const STATUSES: ContentStatus[] = ['DRAFT', 'PENDING', 'PUBLISHED', 'REJECTED', 'HIDDEN'];

export function MyPostsList() {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const [data, setData] = useState(EMPTY_PAGE);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');

  const load = useCallback(async (signal?: AbortSignal) => {
    const params = new URLSearchParams(query);
    try {
      const nextData = await listMyPostsService(
        {
          page: Math.max(1, Number(params.get('page')) || 1),
          limit: 20,
          status: (params.get('status') as ContentStatus | null) ?? undefined,
          sortOrder: 'desc',
        },
        signal,
      );
      setData(nextData);
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

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deletePostService(id);
      await load();
    } catch (deleteError) {
      setError(normalizeAppError(deleteError).message);
    }
  };

  return (
    <>
      <div className='mb-7 flex flex-wrap items-end justify-between gap-4'>
        <div>
          <p className='eyebrow'>Không gian sáng tác</p>
          <h1 className='mt-4 font-display text-5xl font-semibold'>Bài viết của tôi</h1>
        </div>
        <Link href={routes.newPost} className='button-primary'>Viết bài mới</Link>
      </div>
      <form action={routes.accountPosts} className='mb-6 flex flex-wrap items-end gap-3'>
        <div>
          <label className='field-label' htmlFor='my-post-status'>Trạng thái</label>
          <select id='my-post-status' name='status' defaultValue={searchParams.get('status') ?? ''} className='field-control min-w-48'>
            <option value=''>Tất cả</option>
            {STATUSES.map((item) => <option key={item} value={item}>{CONTENT_STATUS_LABELS[item]}</option>)}
          </select>
        </div>
        <button type='submit' className='button-secondary'>Lọc</button>
      </form>
      {status === 'loading' ? <LoadingState /> : null}
      {status === 'error' ? <ErrorState message={error} onRetry={() => void load()} /> : null}
      {status === 'ready' && data.items.length === 0 ? <EmptyState title='Bạn chưa có bài viết nào' action={<Link href={routes.newPost} className='button-primary'>Tạo bài đầu tiên</Link>} /> : null}
      <div className='space-y-4'>
        {data.items.map((post) => (
          <article key={post.id} className='card'>
            <div className='flex flex-wrap items-start justify-between gap-4'>
              <div>
                <span className='rounded-full bg-accent/40 px-3 py-1 text-xs font-semibold'>{CONTENT_STATUS_LABELS[post.status]}</span>
                <h2 className='mt-3 font-display text-3xl font-semibold'>{post.title}</h2>
                <p className='mt-2 text-sm text-muted'>Cập nhật {formatDate(post.updatedAt)}</p>
              </div>
              <div className='flex flex-wrap gap-2'>
                <Link href={routes.editPost(post.id)} className='button-secondary'>Sửa</Link>
                <ConfirmButton
                  label='Xóa'
                  title={`Xóa “${post.title}”?`}
                  description='Bài viết sẽ được soft-delete và không còn hiển thị công khai.'
                  onConfirm={() => handleDelete(post.id)}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
      <Pagination page={data.page} totalPages={data.totalPages} />
    </>
  );
}
