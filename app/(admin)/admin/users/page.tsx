import type {Metadata} from 'next';
import {Suspense} from 'react';

import {LoadingState} from '@/components/ui/AsyncState';
import {UsersAdmin} from './_components/UsersAdmin';

export const metadata: Metadata = {title: 'Quản lý người dùng'};

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <UsersAdmin />
    </Suspense>
  );
}
