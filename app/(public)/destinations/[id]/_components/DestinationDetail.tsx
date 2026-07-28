'use client';

import {useEffect, useState} from 'react';

import {normalizeAppError} from '@/lib/api/errors';
import {getPlaceService} from '@/lib/api/places';

import {ReviewSection} from '@/components/community/ReviewSection';
import {ErrorState, LoadingState} from '@/components/ui/AsyncState';

import type {Place} from '@/lib/api/contracts';

export function DestinationDetail({id}: Readonly<{id: string}>) {
  const [place, setPlace] = useState<Place | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getPlaceService(id, controller.signal)
      .then(setPlace)
      .catch((loadError: unknown) => {
        if (!controller.signal.aborted) {
          setError(normalizeAppError(loadError).message);
        }
      });
    return () => controller.abort();
  }, [id]);

  if (error) {
    return <ErrorState message={error} />;
  }
  if (!place) {
    return <LoadingState label='Đang mở điểm đến…' />;
  }

  return (
    <>
      <article>
        <p className='eyebrow'>{place.province.name}</p>
        <h1 className='mt-5 max-w-5xl font-display text-[clamp(3.5rem,10vw,8rem)] font-semibold leading-[0.85] tracking-[-0.055em]'>{place.name}</h1>
        <div className='mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]'>
          <div>
            <p className='whitespace-pre-wrap text-lg leading-8 text-muted'>{place.description}</p>
            {place.address ? <p className='mt-6 rounded-2xl bg-surface p-4 text-sm'><strong>Địa chỉ:</strong> {place.address}</p> : null}
          </div>
          <aside className='card h-fit'>
            <p className='text-sm font-semibold'>★ {place.avgRating.toFixed(1)} / 5</p>
            <p className='mt-2 text-sm text-muted'>{place.reviewCount} đánh giá</p>
            {place.latitude !== null && place.longitude !== null ? (
              <p className='mt-4 text-sm text-muted'>Tọa độ: {place.latitude}, {place.longitude}</p>
            ) : null}
            <div className='mt-5 flex flex-wrap gap-2'>
              {place.categories.map((category) => <span key={category.id} className='rounded-full bg-accent/35 px-3 py-1 text-xs font-semibold'>{category.name}</span>)}
            </div>
          </aside>
        </div>
      </article>
      <ReviewSection placeId={place.id} />
    </>
  );
}
