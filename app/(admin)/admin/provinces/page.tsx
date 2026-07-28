import type {Metadata} from 'next';
import {Suspense} from 'react';

import {LoadingState} from '@/components/ui/AsyncState';
import {TaxonomyManager} from '../_components/TaxonomyManager';

export const metadata: Metadata = {title: 'Quản lý tỉnh thành'};

export default function AdminProvincesPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <TaxonomyManager kind='province' />
    </Suspense>
  );
}
