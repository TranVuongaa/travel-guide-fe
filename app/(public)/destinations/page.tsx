import type {Metadata} from 'next';
import {Suspense} from 'react';

import {PageIntro} from '@/components/layout/PageIntro';
import {LoadingState} from '@/components/ui/AsyncState';

import {DestinationsExplorer} from './_components/DestinationsExplorer';

export const metadata: Metadata = {title: 'Điểm đến'};

export default function DestinationsPage() {
  return (
    <div className='mx-auto max-w-content px-page py-12 sm:py-16'>
      <PageIntro
        eyebrow='Khám phá Việt Nam'
        title='Mỗi miền đất, một nhịp riêng.'
        description='Tìm điểm đến theo tỉnh thành, danh mục và đánh giá từ cộng đồng.'
      />
      <Suspense fallback={<LoadingState />}>
        <DestinationsExplorer />
      </Suspense>
    </div>
  );
}
