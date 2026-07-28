import Link from 'next/link';

import {routes} from '@/config/routes';

import {BrandMark} from './BrandMark';

export function AppFooter() {
  return (
    <footer className='border-t border-line'>
      <div className='mx-auto flex max-w-content flex-col gap-6 px-page py-10 sm:flex-row sm:items-end sm:justify-between'>
        <div className='flex items-center gap-3 text-brand'>
          <BrandMark />
          <div>
            <p className='font-display text-xl font-bold text-ink'>Vạn Nẻo</p>
            <p className='text-xs text-muted'>Cẩm nang du hành Việt Nam</p>
          </div>
        </div>
        <div className='flex flex-wrap gap-5 text-sm text-muted'>
          <Link href={routes.destinations} className='hover:text-ink focus-visible:text-ink'>
            Điểm đến
          </Link>
          <Link href={routes.stories} className='hover:text-ink focus-visible:text-ink'>
            Câu chuyện
          </Link>
          <Link href={routes.status} className='hover:text-ink focus-visible:text-ink'>
            API
          </Link>
        </div>
      </div>
    </footer>
  );
}
