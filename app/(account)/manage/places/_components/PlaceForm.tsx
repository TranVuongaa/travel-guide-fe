'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

import {routes} from '@/config/routes';
import {listCategoriesService} from '@/lib/feature/categories/api';
import {normalizeAppError} from '@/lib/api/errors';
import {createPlaceService, getPlaceService, updatePlaceService} from '@/lib/feature/places/api';
import {listProvincesService} from '@/lib/feature/provinces/api';

import type {Category, Province} from '@/types/api';

export function PlaceForm({placeId}: Readonly<{placeId?: string}>) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(placeId));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      listProvincesService({limit: 100, sortOrder: 'asc'}, controller.signal),
      listCategoriesService({limit: 100, sortOrder: 'asc'}, controller.signal),
      placeId ? getPlaceService(placeId, controller.signal) : Promise.resolve(null),
    ])
      .then(([provinceData, categoryData, place]) => {
        setProvinces(provinceData.items);
        setCategories(categoryData.items);
        if (place) {
          setName(place.name);
          setDescription(place.description);
          setContent(place.content ?? '');
          setAddress(place.address ?? '');
          setLatitude(place.latitude?.toString() ?? '');
          setLongitude(place.longitude?.toString() ?? '');
          setProvinceId(place.provinceId);
          setCategoryIds(place.categories.map((category) => category.id));
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
  }, [placeId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const latitudeNumber = latitude ? Number(latitude) : undefined;
    const longitudeNumber = longitude ? Number(longitude) : undefined;
    if (!name.trim() || name.length > 200) {
      setError('Tên điểm đến phải có từ 1 đến 200 ký tự.');
      return;
    }
    if (!description.trim()) {
      setError('Mô tả là bắt buộc.');
      return;
    }
    if (content.length > 100000) {
      setError('Nội dung điểm đến không được vượt quá 100.000 ký tự.');
      return;
    }
    if (!provinceId || categoryIds.length === 0) {
      setError('Hãy chọn tỉnh thành và ít nhất một danh mục.');
      return;
    }
    if (latitudeNumber !== undefined && (latitudeNumber < -90 || latitudeNumber > 90)) {
      setError('Vĩ độ phải nằm trong khoảng -90 đến 90.');
      return;
    }
    if (longitudeNumber !== undefined && (longitudeNumber < -180 || longitudeNumber > 180)) {
      setError('Kinh độ phải nằm trong khoảng -180 đến 180.');
      return;
    }

    const trimmedContent = content.trim();
    const input = {
      name: name.trim(),
      description: description.trim(),
      ...(trimmedContent ? {content: trimmedContent} : {}),
      address: address.trim() || undefined,
      latitude: latitudeNumber,
      longitude: longitudeNumber,
      provinceId,
      categoryIds,
    };
    setIsSaving(true);
    try {
      if (placeId) {
        await updatePlaceService(placeId, input);
      } else {
        await createPlaceService(input);
      }
      router.push(routes.managePlaces);
    } catch (saveError) {
      setError(normalizeAppError(saveError).message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p role='status' className='text-muted'>Đang tải điểm đến…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className='card space-y-5'>
      <div>
        <label className='field-label' htmlFor='place-name'>Tên điểm đến</label>
        <input id='place-name' value={name} maxLength={200} onChange={(event) => setName(event.target.value)} className='field-control' required />
      </div>
      <div>
        <label className='field-label' htmlFor='place-description'>Mô tả</label>
        <textarea id='place-description' value={description} onChange={(event) => setDescription(event.target.value)} className='field-control min-h-44' required />
      </div>
      <div>
        <label className='field-label' htmlFor='place-content'>Nội dung điểm đến (HTML)</label>
        <textarea
          id='place-content'
          value={content}
          maxLength={100000}
          onChange={(event) => setContent(event.target.value)}
          className='field-control min-h-64 font-mono text-sm leading-6'
          aria-describedby='place-content-help place-content-count'
        />
        <p id='place-content-help' className='mt-2 text-xs leading-5 text-muted'>
          Không bắt buộc. Nội dung HTML sẽ hiển thị như một bài viết chi tiết khi API hỗ trợ trường content.
        </p>
        <p id='place-content-count' className='mt-1 text-xs text-muted'>
          {content.length.toLocaleString('vi-VN')} / 100.000 ký tự
        </p>
      </div>
      <div>
        <label className='field-label' htmlFor='place-address'>Địa chỉ</label>
        <input id='place-address' value={address} maxLength={500} onChange={(event) => setAddress(event.target.value)} className='field-control' />
      </div>
      <div className='grid gap-5 sm:grid-cols-2'>
        <div>
          <label className='field-label' htmlFor='place-province'>Tỉnh thành</label>
          <select id='place-province' value={provinceId} onChange={(event) => setProvinceId(event.target.value)} className='field-control' required>
            <option value=''>Chọn tỉnh thành</option>
            {provinces.map((province) => <option key={province.id} value={province.id}>{province.name}</option>)}
          </select>
        </div>
        <fieldset>
          <legend className='field-label'>Danh mục</legend>
          <div className='grid max-h-44 gap-2 overflow-y-auto rounded-xl border border-line bg-canvas p-3'>
            {categories.map((category) => (
              <label key={category.id} className='flex min-h-10 items-center gap-2 text-sm'>
                <input
                  type='checkbox'
                  checked={categoryIds.includes(category.id)}
                  onChange={(event) => {
                    setCategoryIds((current) =>
                      event.target.checked
                        ? [...current, category.id]
                        : current.filter((id) => id !== category.id),
                    );
                  }}
                />
                {category.name}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div className='grid gap-5 sm:grid-cols-2'>
        <div>
          <label className='field-label' htmlFor='place-latitude'>Vĩ độ</label>
          <input id='place-latitude' type='number' step='any' min={-90} max={90} value={latitude} onChange={(event) => setLatitude(event.target.value)} className='field-control' />
        </div>
        <div>
          <label className='field-label' htmlFor='place-longitude'>Kinh độ</label>
          <input id='place-longitude' type='number' step='any' min={-180} max={180} value={longitude} onChange={(event) => setLongitude(event.target.value)} className='field-control' />
        </div>
      </div>
      {error ? <p role='alert' className='rounded-xl bg-danger-soft p-3 text-danger'>{error}</p> : null}
      <div className='flex gap-3'>
        <button type='submit' disabled={isSaving} className='button-primary'>{isSaving ? 'Đang lưu…' : 'Lưu điểm đến'}</button>
        <button type='button' onClick={() => router.push(routes.managePlaces)} className='button-secondary'>Hủy</button>
      </div>
    </form>
  );
}
