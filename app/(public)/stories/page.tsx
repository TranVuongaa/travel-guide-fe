import type {Metadata} from 'next';
import {Suspense} from 'react';

import {PageIntro} from '@/components/layout/PageIntro';
import {LoadingState} from '@/components/ui/AsyncState';

import {StoriesExplorer} from './_components/StoriesExplorer';

export const metadata: Metadata = {title: 'Câu chuyện'};

export default function StoriesPage() {
  return (
    <div className='mx-auto max-w-content px-page py-12 sm:py-16'>
      <PageIntro
        eyebrow='Ghi chép từ dải đất hình chữ S'
        title='Những câu chuyện còn ở lại.'
        description='Góc nhìn từ người bản địa, người đi đường và đội ngũ biên tập Vạn Nẻo.'
      />
      <Suspense fallback={<LoadingState />}>
        <StoriesExplorer />
      </Suspense>
    </div>
  );
}
