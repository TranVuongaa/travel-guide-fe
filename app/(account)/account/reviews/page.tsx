import type {Metadata} from 'next';
import {Suspense} from 'react';

import {LoadingState} from '@/components/ui/AsyncState';
import {MyReviewsList} from './_components/MyReviewsList';

export const metadata: Metadata = {title: 'Đánh giá của tôi'};

export default function MyReviewsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <MyReviewsList />
    </Suspense>
  );
}
