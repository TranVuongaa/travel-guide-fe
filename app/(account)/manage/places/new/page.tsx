import type {Metadata} from 'next';

import {AuthGuard} from '@/components/auth/AuthGuard';

import {PlaceForm} from '../_components/PlaceForm';

export const metadata: Metadata = {title: 'Thêm điểm đến'};

export default function NewPlacePage() {
  return (
    <AuthGuard roles={['EDITOR', 'ADMIN']}>
      <p className='eyebrow'>Dữ liệu mới</p>
      <h1 className='mb-7 mt-4 font-display text-5xl font-semibold'>Thêm điểm đến</h1>
      <PlaceForm />
    </AuthGuard>
  );
}
