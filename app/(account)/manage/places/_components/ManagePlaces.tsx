'use client';

import {useCallback, useEffect, useState} from 'react';
import Link from 'next/link';

import {routes} from '@/config/routes';
import {normalizeAppError} from '@/lib/api/errors';
import {deletePlaceService, listPlacesService} from '@/lib/feature/places/api';
import {CONTENT_STATUS_LABELS} from '@/utils/format';

import {AuthGuard} from '@/components/auth/AuthGuard';
import {ConfirmButton} from '@/components/ui/ConfirmButton';
import {EmptyState, ErrorState, LoadingState} from '@/components/ui/AsyncState';

import type {Place} from '@/types/api';

export function ManagePlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      const data = await listPlacesService({limit: 100, sortBy: 'updatedAt', sortOrder: 'desc'}, signal);
      setPlaces(data.items);
      setStatus('ready');
    } catch (loadError) {
      if (!signal?.aborted) {
        setError(normalizeAppError(loadError).message);
        setStatus('error');
      }
    }
  }, []);

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
      await deletePlaceService(id);
      await load();
    } catch (deleteError) {
      setError(normalizeAppError(deleteError).message);
    }
  };

  return (
    <AuthGuard roles={['EDITOR', 'ADMIN']}>
      <div className='flex flex-wrap items-end justify-between gap-5'>
        <div>
          <p className='eyebrow'>Biên tập nội dung</p>
          <h1 className='mt-4 font-display text-5xl font-semibold'>Quản lý điểm đến</h1>
        </div>
        <Link href={routes.newPlace} className='button-primary'>Thêm điểm đến</Link>
      </div>
      <div className='mt-8'>
        {error ? <p role='alert' className='mb-5 rounded-xl bg-danger-soft p-3 text-danger'>{error}</p> : null}
        {status === 'loading' ? <LoadingState /> : null}
        {status === 'error' ? <ErrorState message={error} onRetry={() => void load()} /> : null}
        {status === 'ready' && places.length === 0 ? <EmptyState title='Chưa có điểm đến đã xuất bản' /> : null}
        <div className='space-y-4'>
          {places.map((place) => (
            <article key={place.id} className='card flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <p className='text-xs font-bold uppercase tracking-[0.14em] text-brand'>{place.province.name}</p>
                <h2 className='mt-2 font-display text-3xl font-semibold'>{place.name}</h2>
                <p className='mt-2 text-sm text-muted'>{CONTENT_STATUS_LABELS[place.status]} · {place.categories.map((item) => item.name).join(', ')}</p>
              </div>
              <div className='flex flex-wrap gap-2'>
                <Link href={routes.destination(place.id)} className='button-secondary'>Xem</Link>
                <Link href={routes.editPlace(place.id)} className='button-secondary'>Sửa</Link>
                <ConfirmButton
                  label='Gỡ'
                  title={`Gỡ “${place.name}”?`}
                  description='Điểm đến sẽ được soft-remove khỏi nội dung công khai.'
                  onConfirm={() => handleDelete(place.id)}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
