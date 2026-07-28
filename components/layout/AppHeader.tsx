'use client';

import Link from 'next/link';

import {routes} from '@/config/routes';
import {selectCurrentUser} from '@/store/selectors';
import {useAppSelector} from '@/store/hooks';

import {BrandMark} from './BrandMark';

const publicLinks = [
  {href: routes.destinations, label: 'Điểm đến'},
  {href: routes.stories, label: 'Câu chuyện'},
  {href: routes.status, label: 'Trạng thái API'},
];

export function AppHeader() {
  const user = useAppSelector(selectCurrentUser);

  return (
    <header className='sticky top-0 z-40 border-b border-line/80 bg-canvas/95 backdrop-blur'>
      <div className='mx-auto flex max-w-content flex-wrap items-center justify-between gap-4 px-page py-4'>
        <Link
          href={routes.home}
          className='flex min-w-0 items-center gap-2 rounded-sm text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:gap-3'
        >
          <BrandMark className='size-9 sm:size-10' />
          <span>
            <span className='block font-display text-lg font-bold leading-none text-ink sm:text-xl'>Vạn Nẻo</span>
            <span className='mt-1 block text-[0.625rem] font-bold uppercase tracking-[0.2em] text-muted'>
              Travel journal
            </span>
          </span>
        </Link>

        <nav aria-label='Điều hướng chính' className='order-3 flex w-full gap-2 overflow-x-auto pb-1 md:order-none md:w-auto'>
          {publicLinks.map((link) => (
            <Link key={link.href} href={link.href} className='app-nav-link'>
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href={routes.profile} className='app-nav-link'>
                Tài khoản
              </Link>
              {(user.role === 'EDITOR' || user.role === 'ADMIN') && (
                <Link href={routes.managePlaces} className='app-nav-link'>
                  Quản lý điểm đến
                </Link>
              )}
              {user.role === 'ADMIN' && (
                <Link href={routes.adminUsers} className='app-nav-link'>
                  Quản trị
                </Link>
              )}
            </>
          ) : null}
        </nav>

        <div className='flex items-center gap-2'>
          {user ? (
            <Link href={routes.profile} className='button-secondary min-h-11'>
              {user.displayName}
            </Link>
          ) : (
            <>
              <Link href={routes.login} className='button-secondary min-h-11'>
                Đăng nhập
              </Link>
              <Link href={routes.register} className='button-primary hidden min-h-11 sm:inline-flex'>
                Tham gia
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
