'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

import {routes} from '@/config/routes';
import {normalizeAppError} from '@/lib/api/errors';
import {listPlacesService} from '@/lib/api/places';
import {createPostService, getPostService, updatePostService} from '@/lib/api/posts';

import type {Place} from '@/lib/api/contracts';

export function PostForm({postId}: Readonly<{postId?: string}>) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(postId));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      listPlacesService({limit: 100, sortBy: 'name', sortOrder: 'asc'}, controller.signal),
      postId ? getPostService(postId, controller.signal) : Promise.resolve(null),
    ])
      .then(([placeData, post]) => {
        setPlaces(placeData.items);
        if (post) {
          setTitle(post.title);
          setContent(post.content);
          setPlaceId(post.placeId ?? '');
        }
        setIsLoading(false);
      })
      .catch((loadError: unknown) => {
        if (!controller.signal.aborted) {
          setError(normalizeAppError(loadError).message);
          setIsLoading(false);
        }
      });
    return () => controller.abort();
  }, [postId]);

  const handleSave = async (publicationIntent: 'DRAFT' | 'SUBMIT'): Promise<void> => {
    if (!title.trim() || title.trim().length > 200) {
      setError('Tiêu đề phải có từ 1 đến 200 ký tự.');
      return;
    }
    if (!content.trim() || content.length > 20000) {
      setError('Nội dung phải có từ 1 đến 20.000 ký tự.');
      return;
    }

    setIsSaving(true);
    try {
      if (postId) {
        await updatePostService(postId, {
          title: title.trim(),
          content: content.trim(),
          placeId: placeId || null,
          publicationIntent,
        });
      } else {
        await createPostService({
          title: title.trim(),
          content: content.trim(),
          placeId: placeId || undefined,
          publicationIntent,
        });
      }
      router.push(routes.accountPosts);
    } catch (saveError) {
      setError(normalizeAppError(saveError).message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p role='status' className='text-muted'>Đang tải bản thảo…</p>;
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void handleSave('SUBMIT');
      }}
      className='card space-y-5'
    >
      <div>
        <label className='field-label' htmlFor='post-title'>Tiêu đề</label>
        <input id='post-title' value={title} maxLength={200} onChange={(event) => setTitle(event.target.value)} className='field-control' required />
      </div>
      <div>
        <label className='field-label' htmlFor='post-place'>Điểm đến liên quan</label>
        <select id='post-place' value={placeId} onChange={(event) => setPlaceId(event.target.value)} className='field-control'>
          <option value=''>Không gắn điểm đến</option>
          {places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}
        </select>
      </div>
      <div>
        <label className='field-label' htmlFor='post-content'>Nội dung</label>
        <textarea id='post-content' value={content} maxLength={20000} onChange={(event) => setContent(event.target.value)} className='field-control min-h-80' required />
        <p className='mt-2 text-xs text-muted'>{content.length.toLocaleString('vi-VN')} / 20.000 ký tự</p>
      </div>
      {error ? <p role='alert' className='rounded-xl bg-danger-soft p-3 text-danger'>{error}</p> : null}
      <div className='flex flex-wrap gap-3'>
        <button type='button' disabled={isSaving} onClick={() => void handleSave('DRAFT')} className='button-secondary'>Lưu bản nháp</button>
        <button type='submit' disabled={isSaving} className='button-primary'>{isSaving ? 'Đang lưu…' : 'Gửi duyệt'}</button>
      </div>
    </form>
  );
}
