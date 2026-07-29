'use client';

import {useEffect, useState} from 'react';

import {normalizeAppError} from '@/lib/api/errors';
import {getPlaceService} from '@/lib/feature/places/api';

import {ReviewSection} from '@/components/community/ReviewSection';
import {RichHtmlContent, sanitizeRichHtml} from '@/components/content/RichHtmlContent';
import {ErrorState, LoadingState} from '@/components/ui/AsyncState';
import {EntityImage, getOrderedEntityImages, getPrimaryEntityImage} from '@/components/ui/EntityImage';

import type {Place} from '@/types/api';
import type {SanitizedRichHtml} from '@/components/content/RichHtmlContent';

type RenderablePlace = Omit<Place, 'content'> & {
  content: SanitizedRichHtml | null;
};

export function DestinationDetail({id}: Readonly<{id: string}>) {
  const [place, setPlace] = useState<RenderablePlace | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getPlaceService(id, controller.signal)
      .then((nextPlace) => {
        const content = nextPlace.content?.trim();
        setPlace({...nextPlace, content: content ? sanitizeRichHtml(content) : null});
      })
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

  const placeImages = getOrderedEntityImages(place.images);
  const primaryImage = placeImages[0] ?? getPrimaryEntityImage(place.province.images);
  const galleryImages = placeImages.slice(1);

  return (
    <>
      <article>
        <p className='eyebrow'>{place.province.name}</p>
        <h1 className='mt-5 max-w-5xl font-display text-[clamp(2.75rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.055em]'>{place.name}</h1>
        <EntityImage
          image={primaryImage}
          altFallback={`Ảnh toàn cảnh ${place.name}`}
          className='mt-8'
          frameClassName='aspect-[16/9] rounded-panel border border-line shadow-editorial'
          loading='eager'
          showAttribution
        />
        {galleryImages.length > 0 ? (
          <div className='mt-5 grid gap-5 sm:grid-cols-2'>
            {galleryImages.map((image) => (
              <EntityImage
                key={image.id}
                image={image}
                altFallback={`Ảnh về ${place.name}`}
                frameClassName='aspect-[4/3] rounded-2xl border border-line'
                showAttribution
              />
            ))}
          </div>
        ) : null}
        <div className='mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]'>
          <div>
            <p className='whitespace-pre-wrap text-lg leading-8 text-muted'>{place.description}</p>
            {place.content ? <RichHtmlContent html={place.content} /> : null}
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
