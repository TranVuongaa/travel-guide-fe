import Link from 'next/link';

import {routes} from '@/config/routes';

import {BrandMark} from '@/components/layout/BrandMark';
import {HomeFeed} from './_components/HomeFeed';

export default function Home() {
  return (
    <>
      <section className='relative overflow-hidden bg-brand text-white'>
        <div className='editorial-grid absolute inset-0 opacity-20' />
        <div className='absolute -right-24 -top-32 size-96 rounded-full bg-accent sm:size-[34rem]' />
        <div className='relative mx-auto grid min-h-[42rem] max-w-content gap-12 px-page py-section lg:grid-cols-12 lg:items-center'>
          <div className='lg:col-span-8'>
            <p className='text-xs font-bold uppercase tracking-[0.24em] text-accent'>Cẩm nang du hành Việt Nam</p>
            <h1 className='mt-7 max-w-5xl font-display text-[clamp(3rem,15vw,10rem)] font-semibold leading-[0.82] tracking-[-0.055em]'>
              Vạn nẻo
              <span className='mt-4 block italic text-accent'>Việt Nam.</span>
            </h1>
            <p className='mt-9 max-w-xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8'>
              Khám phá những miền đất, câu chuyện và góc nhìn chân thành từ cộng đồng yêu du hành.
            </p>
            <div className='mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap'>
              <Link href={routes.destinations} className='button-primary bg-accent text-ink'>Khám phá điểm đến</Link>
              <Link href={routes.stories} className='button-secondary border-white/30 bg-white/10 text-white'>Đọc câu chuyện</Link>
            </div>
          </div>
          <div className='relative hidden min-h-96 lg:col-span-4 lg:grid lg:place-items-center'>
            <div className='grid size-72 place-items-center rounded-full border border-white/20 text-accent'>
              <BrandMark className='size-44' />
            </div>
          </div>
        </div>
      </section>
      <HomeFeed />
    </>
  );
}
