'use client';

import {useCallback, useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';

import {routes} from '@/config/routes';
import {useDebouncedSearchParam} from '@/hooks/useDebouncedSearchParam';
import {
  createCategoryService,
  deleteCategoryService,
  getCategoryService,
  listCategoriesService,
  updateCategoryService,
} from '@/lib/feature/categories/api';
import {normalizeAppError} from '@/lib/api/errors';
import {
  createProvinceService,
  deleteProvinceService,
  getProvinceService,
  listProvincesService,
  updateProvinceService,
} from '@/lib/feature/provinces/api';

import {ConfirmButton} from '@/components/ui/ConfirmButton';
import {EmptyState, ErrorState, LoadingState} from '@/components/ui/AsyncState';
import {Pagination} from '@/components/ui/Pagination';

import type {Category, PaginatedData, Province} from '@/types/api';

type TaxonomyItem = Province | Category;
type Kind = 'province' | 'category';
const EMPTY_PAGE: PaginatedData<TaxonomyItem> = {items: [], page: 1, limit: 20, totalItems: 0, totalPages: 0};

const config = {
  province: {
    eyebrow: 'Dữ liệu địa lý',
    title: 'Tỉnh thành',
    singular: 'tỉnh thành',
    route: routes.adminProvinces,
    warning: 'Chỉ có thể xóa tỉnh thành chưa được điểm đến nào sử dụng.',
  },
  category: {
    eyebrow: 'Phân loại nội dung',
    title: 'Danh mục',
    singular: 'danh mục',
    route: routes.adminCategories,
    warning: 'Xóa danh mục cũng xóa toàn bộ liên kết giữa danh mục này và các điểm đến.',
  },
} satisfies Record<Kind, {eyebrow: string; title: string; singular: string; route: string; warning: string}>;

export function TaxonomyManager({kind}: Readonly<{kind: Kind}>) {
  const searchParams = useSearchParams();
  const {search, setSearch} = useDebouncedSearchParam();
  const query = searchParams.toString();
  const copy = config[kind];
  const [data, setData] = useState<PaginatedData<TaxonomyItem>>(EMPTY_PAGE);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async (signal?: AbortSignal) => {
    const params = new URLSearchParams(query);
    const input = {
      page: Math.max(1, Number(params.get('page')) || 1),
      limit: 20,
      search: params.get('search') || undefined,
      sortOrder: 'asc' as const,
    };
    try {
      const nextData =
        kind === 'province'
          ? await listProvincesService(input, signal)
          : await listCategoriesService(input, signal);
      setData(nextData);
      setStatus('ready');
    } catch (loadError) {
      if (!signal?.aborted) {
        setError(normalizeAppError(loadError).message);
        setStatus('error');
      }
    }
  }, [kind, query]);

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
      const item = kind === 'province' ? await getProvinceService(id) : await getCategoryService(id);
      setEditingId(item.id);
      setName(item.name);
      setError('');
    } catch (detailError) {
      setError(normalizeAppError(detailError).message);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!name.trim() || name.trim().length > 100) {
      setError('Tên phải có từ 1 đến 100 ký tự.');
      return;
    }
    try {
      if (kind === 'province') {
        if (editingId) {
          await updateProvinceService(editingId, name.trim());
        } else {
          await createProvinceService(name.trim());
        }
      } else if (editingId) {
        await updateCategoryService(editingId, name.trim());
      } else {
        await createCategoryService(name.trim());
      }
      setNotice(editingId ? 'Đã cập nhật.' : 'Đã tạo mới.');
      setName('');
      setEditingId(null);
      await load();
    } catch (saveError) {
      setError(normalizeAppError(saveError).message);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      if (kind === 'province') {
        await deleteProvinceService(id);
      } else {
        await deleteCategoryService(id);
      }
      setNotice('Đã xóa dữ liệu.');
      await load();
    } catch (deleteError) {
      setError(normalizeAppError(deleteError).message);
    }
  };

  return (
    <>
      <p className='eyebrow'>{copy.eyebrow}</p>
      <h1 className='mt-4 font-display text-5xl font-semibold'>{copy.title}</h1>
      <p className='mt-4 rounded-xl bg-warning-soft p-3 text-sm leading-6 text-warning'>{copy.warning}</p>
      {notice ? <p role='status' className='mt-4 rounded-xl bg-success-soft p-3 text-success'>{notice}</p> : null}
      {error ? <p role='alert' className='mt-4 rounded-xl bg-danger-soft p-3 text-danger'>{error}</p> : null}
      <form onSubmit={handleSubmit} className='card mt-7'>
        <h2 className='font-display text-2xl font-semibold'>{editingId ? `Sửa ${copy.singular}` : `Thêm ${copy.singular}`}</h2>
        <label className='field-label mt-5' htmlFor={`${kind}-name`}>Tên</label>
        <input id={`${kind}-name`} value={name} maxLength={100} onChange={(event) => setName(event.target.value)} className='field-control' />
        <div className='mt-4 flex gap-3'>
          <button type='submit' className='button-primary'>{editingId ? 'Lưu thay đổi' : 'Tạo mới'}</button>
          {editingId ? <button type='button' onClick={() => {setEditingId(null); setName('');}} className='button-secondary'>Hủy</button> : null}
        </div>
      </form>
      <form action={copy.route} className='mt-7 flex flex-wrap items-end gap-3'>
        <div className='min-w-64 flex-1'>
          <label className='field-label' htmlFor={`${kind}-search`}>Tìm kiếm</label>
          <input
            id={`${kind}-search`}
            name='search'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className='field-control'
          />
        </div>
        <button type='submit' className='button-secondary'>Tìm</button>
      </form>
      <div className='mt-6'>
        {status === 'loading' ? <LoadingState /> : null}
        {status === 'error' ? <ErrorState message={error} onRetry={() => void load()} /> : null}
        {status === 'ready' && data.items.length === 0 ? <EmptyState title={`Chưa có ${copy.singular}`} /> : null}
        <div className='space-y-3'>
          {data.items.map((item) => (
            <article key={item.id} className='flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between'>
              <div><h2 className='font-semibold'>{item.name}</h2><p className='mt-1 text-xs text-muted'>/{item.slug} · {item.id}</p></div>
              <div className='flex gap-2'>
                <button type='button' onClick={() => void handleEdit(item.id)} className='button-secondary'>Sửa</button>
                <ConfirmButton
                  label='Xóa'
                  title={`Xóa “${item.name}”?`}
                  description={copy.warning}
                  onConfirm={() => handleDelete(item.id)}
                />
              </div>
            </article>
          ))}
        </div>
        <Pagination page={data.page} totalPages={data.totalPages} />
      </div>
    </>
  );
}
