'use client';

import Link from 'next/link';
import {usePathname, useSearchParams} from 'next/navigation';

export function Pagination({page, totalPages}: Readonly<{page: number; totalPages: number}>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  const hrefFor = (nextPage: number): string => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    return `${pathname}?${params.toString()}`;
  };

  return (
    <nav aria-label='Phân trang' className='mt-8 flex items-center justify-between gap-4'>
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className='button-secondary'>
          ← Trang trước
        </Link>
      ) : (
        <span className='button-secondary cursor-not-allowed opacity-40'>← Trang trước</span>
      )}
      <span aria-current='page' className='text-sm font-semibold text-muted'>
        Trang {page} / {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className='button-secondary'>
          Trang sau →
        </Link>
      ) : (
        <span className='button-secondary cursor-not-allowed opacity-40'>Trang sau →</span>
      )}
    </nav>
  );
}
