import Link from 'next/link';

import {routes} from '@/config/routes';

const accountLinks = [
  {href: routes.profile, label: 'Hồ sơ'},
  {href: routes.accountPosts, label: 'Bài viết của tôi'},
  {href: routes.accountReviews, label: 'Đánh giá của tôi'},
];

export default function AccountLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <div className='grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]'>
      <aside className='h-fit rounded-panel bg-ink p-5 text-canvas'>
        <p className='text-xs font-bold uppercase tracking-[0.18em] text-accent'>Tài khoản</p>
        <nav aria-label='Điều hướng tài khoản' className='mt-5 flex gap-2 overflow-x-auto lg:flex-col'>
          {accountLinks.map((link) => (
            <Link key={link.href} href={link.href} className='min-h-11 flex-none rounded-xl px-4 py-3 text-sm font-semibold hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'>
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
