'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';

import {routes} from '@/config/routes';
import {normalizeAppError} from '@/lib/api/errors';
import {listPlacesService} from '@/lib/feature/places/api';
import {listPostsService} from '@/lib/feature/posts/api';
import {formatDate} from '@/utils/format';

import type {Place, Post} from '@/types/api';

export function HomeFeed() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      listPlacesService({limit: 3, sortBy: 'avgRating', sortOrder: 'desc'}, controller.signal),
      listPostsService({limit: 3, sortOrder: 'desc'}, controller.signal),
    ])
      .then(([placeData, postData]) => {
        setPlaces(placeData.items);
        setPosts(postData.items);
      })
      .catch((loadError: unknown) => {
        if (!controller.signal.aborted) {
          setError(normalizeAppError(loadError).message);
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <div className='mx-auto max-w-content px-page py-section'>
      {error ? (
        <div role='status' className='mb-10 rounded-2xl border border-warning/30 bg-warning-soft p-4 text-sm text-warning'>
          Dữ liệu trực tiếp đang tạm gián đoạn: {error}
        </div>
      ) : null}
      <section aria-labelledby='featured-places'>
        <div className='flex flex-wrap items-end justify-between gap-5'>
          <div>
            <p className='eyebrow'>Mở bản đồ</p>
            <h2 id='featured-places' className='mt-4 font-display text-4xl font-semibold sm:text-6xl'>Điểm đến nổi bật</h2>
          </div>
          <Link href={routes.destinations} className='button-secondary'>Xem tất cả →</Link>
        </div>
        {places.length > 0 ? (
          <div className='mt-8 grid gap-4 md:grid-cols-3'>
            {places.map((place, index) => (
              <Link
                key={place.id}
                href={routes.destination(place.id)}
                className='group min-h-72 rounded-panel border border-line bg-surface p-6 transition hover:-translate-y-1 hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus'
              >
                <p className='text-xs font-bold uppercase tracking-[0.2em] text-brand'>0{index + 1} · {place.province.name}</p>
                <h3 className='mt-16 font-display text-4xl font-semibold'>{place.name}</h3>
                <p className='mt-4 line-clamp-3 text-sm leading-6 text-muted'>{place.description}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className='mt-8 rounded-panel border border-dashed border-line p-8 text-muted'>
            Backend chưa có điểm đến đã xuất bản. Bạn vẫn có thể mở trang khám phá để dùng bộ lọc.
          </div>
        )}
      </section>

      <section aria-labelledby='featured-stories' className='mt-section'>
        <div className='flex flex-wrap items-end justify-between gap-5'>
          <div>
            <p className='eyebrow'>Ghi chép bản địa</p>
            <h2 id='featured-stories' className='mt-4 font-display text-4xl font-semibold sm:text-6xl'>Câu chuyện mới</h2>
          </div>
          <Link href={routes.stories} className='button-secondary'>Đọc thêm →</Link>
        </div>
        {posts.length > 0 ? (
          <div className='mt-8 divide-y divide-line border-y border-line'>
            {posts.map((post) => (
              <Link
                key={post.id}
                href={routes.story(post.id)}
                className='grid gap-3 py-6 transition hover:pl-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:grid-cols-[1fr_auto]'
              >
                <div>
                  <h3 className='font-display text-2xl font-semibold'>{post.title}</h3>
                  <p className='mt-2 line-clamp-2 text-sm leading-6 text-muted'>{post.content}</p>
                </div>
                <p className='text-xs text-muted'>{formatDate(post.createdAt)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className='mt-8 rounded-panel border border-dashed border-line p-8 text-muted'>
            Chưa có câu chuyện nào được xuất bản.
          </div>
        )}
      </section>
    </div>
  );
}
