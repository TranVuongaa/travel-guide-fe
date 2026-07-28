import type {Metadata} from 'next';
import {Suspense} from 'react';

import {LoadingState} from '@/components/ui/AsyncState';
import {MyPostsList} from './_components/MyPostsList';

export const metadata: Metadata = {title: 'Bài viết của tôi'};

export default function MyPostsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <MyPostsList />
    </Suspense>
  );
}
