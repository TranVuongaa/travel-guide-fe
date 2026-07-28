import type {Metadata} from 'next';
import {Suspense} from 'react';

import {LoadingState} from '@/components/ui/AsyncState';
import {TaxonomyManager} from '../_components/TaxonomyManager';

export const metadata: Metadata = {title: 'Quản lý danh mục'};

export default function AdminCategoriesPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <TaxonomyManager kind='category' />
    </Suspense>
  );
}
