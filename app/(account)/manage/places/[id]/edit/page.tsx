import type {Metadata} from 'next';

import {AuthGuard} from '@/components/auth/AuthGuard';

import {PlaceForm} from '../../_components/PlaceForm';

export const metadata: Metadata = {title: 'Sửa điểm đến'};

export default async function EditPlacePage({params}: Readonly<{params: Promise<{id: string}>}>) {
  const {id} = await params;
  return (
    <AuthGuard roles={['EDITOR', 'ADMIN']}>
      <p className='eyebrow'>Cập nhật dữ liệu</p>
      <h1 className='mb-7 mt-4 font-display text-5xl font-semibold'>Sửa điểm đến</h1>
      <PlaceForm placeId={id} />
    </AuthGuard>
  );
}
