import Link from 'next/link';

import {routes} from '@/config/routes';

import {AuthGuard} from '@/components/auth/AuthGuard';

const adminLinks = [
  {href: routes.adminUsers, label: 'Người dùng'},
  {href: routes.adminProvinces, label: 'Tỉnh thành'},
  {href: routes.adminCategories, label: 'Danh mục'},
];

export default function AdminLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <div className='mx-auto max-w-content px-page py-10 sm:py-14'>
      <AuthGuard roles={['ADMIN']}>
        <div className='grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]'>
          <aside className='h-fit rounded-panel bg-brand p-5 text-white'>
            <p className='text-xs font-bold uppercase tracking-[0.18em] text-accent'>Quản trị</p>
            <nav aria-label='Điều hướng quản trị' className='mt-5 flex gap-2 overflow-x-auto lg:flex-col'>
              {adminLinks.map((link) => (
                <Link key={link.href} href={link.href} className='min-h-11 flex-none rounded-xl px-4 py-3 text-sm font-semibold hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'>
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
          <div>{children}</div>
        </div>
      </AuthGuard>
    </div>
  );
}
