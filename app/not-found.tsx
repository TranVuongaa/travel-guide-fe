import Link from 'next/link';

import {routes} from '@/config/routes';

export default function NotFound() {
  return (
    <div className='mx-auto max-w-content px-page py-section text-center'>
      <p className='eyebrow justify-center'>404 · Lạc đường</p>
      <h1 className='mt-5 font-display text-[clamp(3.5rem,10vw,8rem)] font-semibold'>Không tìm thấy trang.</h1>
      <p className='mx-auto mt-6 max-w-lg leading-7 text-muted'>Con đường này chưa có trên bản đồ Vạn Nẻo.</p>
      <Link href={routes.home} className='button-primary mt-8'>Về trang chủ</Link>
    </div>
  );
}
