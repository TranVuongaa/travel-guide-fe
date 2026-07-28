'use client';

import Link from 'next/link';

import {routes} from '@/config/routes';
import {selectCurrentUser} from '@/store/selectors';
import {useAppSelector} from '@/store/hooks';
import {USER_ROLE_LABELS} from '@/utils/format';

import type {UserRole} from '@/types/api';

export function AuthGuard({
  children,
  roles,
}: Readonly<{children: React.ReactNode; roles?: UserRole[]}>) {
  const user = useAppSelector(selectCurrentUser);

  if (!user) {
    return (
      <div className='rounded-panel border border-line bg-surface p-8 text-center'>
        <h1 className='font-display text-3xl font-semibold'>Bạn cần đăng nhập</h1>
        <p className='mt-3 text-muted'>Phiên đăng nhập chỉ được giữ trong bộ nhớ của tab hiện tại.</p>
        <Link href={routes.login} className='button-primary mt-6'>
          Đến trang đăng nhập
        </Link>
      </div>
    );
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div role='alert' className='rounded-panel border border-danger/30 bg-danger-soft p-8 text-danger'>
        <h1 className='font-display text-3xl font-semibold'>Không đủ quyền truy cập</h1>
        <p className='mt-3'>
          Vai trò hiện tại: {USER_ROLE_LABELS[user.role]}. Khu vực này dành cho{' '}
          {roles.map((role) => USER_ROLE_LABELS[role]).join(' hoặc ')}.
        </p>
      </div>
    );
  }

  return children;
}
