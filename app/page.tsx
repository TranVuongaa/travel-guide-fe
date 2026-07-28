const DESTINATIONS = [
  {
    number: '01',
    region: 'Miền đá nở hoa',
    name: 'Hà Giang',
    detail: 'Đèo Mã Pí Lèng · Sông Nho Quế',
    description:
      'Men theo những cung đường đá, chạm vào nhịp sống bình dị giữa cao nguyên và mây trời cực Bắc.',
    className: 'bg-brand text-white md:col-span-7',
  },
  {
    number: '02',
    region: 'Miền di sản',
    name: 'Cố đô Huế',
    detail: 'Kinh thành · Phá Tam Giang',
    description:
      'Một nhịp đi chậm giữa kiến trúc cung đình, làng nghề và những buổi chiều tím bên dòng Hương.',
    className: 'bg-accent text-ink md:col-span-5',
  },
  {
    number: '03',
    region: 'Miền gió cát',
    name: 'Ninh Thuận',
    detail: 'Núi Chúa · Làng Chăm',
    description:
      'Đi qua vườn nho, triền cát và bờ biển nguyên sơ để gặp một miền văn hóa đầy nắng và sức sống.',
    className: 'bg-ink text-canvas md:col-span-12',
  },
] as const;

function BrandMark() {
  return (
    <svg
      aria-hidden='true'
      className='size-11 shrink-0'
      viewBox='0 0 48 48'
      fill='none'
    >
      <circle cx='24' cy='24' r='23' fill='currentColor' />
      <path
        d='M10 29.5c7-1.1 12.3-4.5 16-10.2-1 5.7.2 10.4 3.6 14.2-5-3.7-10.4-5-16.4-3.9'
        fill='var(--color-accent)'
      />
      <path
        d='M25.8 20.2c2-6.3 5.2-9.2 9.6-8.7-2.7 1.4-4.5 3.5-5.5 6.3l5.8.4-6.5 2.4'
        stroke='var(--color-canvas)'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.8'
      />
      <circle cx='34.7' cy='11.7' r='1' fill='var(--color-accent)' />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden='true' className='size-4' viewBox='0 0 16 16' fill='none'>
      <path
        d='M3 8h10m-4-4 4 4-4 4'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.5'
      />
    </svg>
  );
}

function CraneArtwork() {
  return (
    <svg
      aria-hidden='true'
      className='crane-float h-auto w-[82%] max-w-[34rem]'
      viewBox='0 0 560 610'
      fill='none'
    >
      <path
        d='M86 356c113-13 200-74 260-185-15 107 13 194 85 262-92-69-192-92-300-69l-45-8Z'
        fill='var(--color-canvas)'
      />
      <path
        d='M116 346c91-25 164-80 220-164-26 82-23 151 9 207-67-40-143-54-229-43Z'
        fill='var(--color-accent)'
      />
      <path
        d='M137 334c71-27 130-72 179-135-26 60-33 112-19 156-46-23-99-30-160-21Z'
        fill='var(--color-brand)'
      />
      <path
        d='M333 195c31-103 88-151 171-144-49 21-82 55-99 103l102 1-112 45'
        stroke='var(--color-canvas)'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='13'
      />
      <path
        d='m494 54 42 20-49 8'
        fill='var(--color-accent)'
        stroke='var(--color-accent)'
        strokeLinejoin='round'
        strokeWidth='5'
      />
      <circle cx='489' cy='50' r='6' fill='var(--color-ink)' />
      <path
        d='M341 385c34 52 53 110 58 174m-27-162c-4 56-23 108-56 156'
        stroke='var(--color-canvas)'
        strokeLinecap='round'
        strokeWidth='7'
      />
      <path
        d='m399 559 38 4m-121-10-34 13'
        stroke='var(--color-accent)'
        strokeLinecap='round'
        strokeWidth='7'
      />
      <path
        d='M142 359c75 11 140 42 196 94m-180-63c61 3 115 23 162 59'
        stroke='var(--color-ink)'
        strokeLinecap='round'
        strokeWidth='5'
      />
    </svg>
  );
}

export default function Home() {
  return (
    <main>
      <a
        href='#noi-dung'
        className='fixed left-4 top-4 z-50 -translate-y-24 bg-accent px-4 py-3 font-semibold text-ink transition-transform focus:translate-y-0'
      >
        Bỏ qua đến nội dung
      </a>

      <header className='relative z-20 mx-auto flex max-w-content items-center justify-between px-page py-6 lg:py-8'>
        <a
          href='#top'
          aria-label='Về đầu trang Vạn Nẻo'
          className='flex items-center gap-3 rounded-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-canvas'
        >
          <span className='text-brand'>
            <BrandMark />
          </span>
          <span>
            <span className='block font-display text-xl font-bold leading-none'>Vạn Nẻo</span>
            <span className='mt-1 block text-[0.625rem] font-bold uppercase tracking-[0.24em] text-muted'>
              Travel journal
            </span>
          </span>
        </a>

        <nav aria-label='Điều hướng chính' className='hidden items-center gap-8 md:flex'>
          <a
            className='nav-link'
            href='#mien-dat'
          >
            Miền đất
          </a>
          <a
            className='nav-link'
            href='#hanh-trinh'
          >
            Hành trình
          </a>
          <a
            className='inline-flex min-h-11 items-center gap-2 rounded-full border border-ink px-5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-canvas'
            href='#cau-chuyen'
          >
            Câu chuyện
            <ArrowIcon />
          </a>
        </nav>

        <a
          className='inline-flex min-h-11 items-center rounded-full border border-ink px-4 text-xs font-bold uppercase tracking-[0.14em] text-ink md:hidden'
          href='#mien-dat'
        >
          Khám phá
        </a>
      </header>

      <div id='noi-dung'>
        <section
          id='top'
          aria-labelledby='hero-title'
          className='mx-auto grid min-h-[calc(100svh-6.5rem)] max-w-content gap-8 px-page pb-10 pt-8 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pb-16'
        >
          <div className='relative z-10 lg:col-span-7'>
            <p className='mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-brand'>
              <span className='h-px w-10 bg-brand' />
              Cẩm nang du hành Việt Nam
            </p>
            <h1
              id='hero-title'
              className='font-display text-[clamp(3.8rem,11vw,9.75rem)] font-semibold leading-[0.78] tracking-[-0.065em] text-ink'
            >
              Vạn nẻo
              <span className='mt-4 block pl-[0.34em] italic text-brand lg:mt-7'>Việt Nam.</span>
            </h1>

            <div className='mt-10 grid gap-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end lg:ml-[10%] lg:mt-14 lg:max-w-2xl'>
              <p className='max-w-lg text-base leading-7 text-muted sm:text-lg sm:leading-8'>
                Những chỉ dẫn được tuyển chọn để bạn đi sâu hơn, ở lại lâu hơn và tìm thấy vẻ đẹp
                trong từng nhịp sống bản địa.
              </p>
              <a
                className='group inline-flex min-h-14 w-fit items-center gap-4 rounded-full bg-ink px-6 text-sm font-bold text-canvas transition-[background-color,color,transform] hover:-translate-y-0.5 hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-canvas'
                href='#mien-dat'
              >
                Mở bản đồ
                <span className='grid size-8 place-items-center rounded-full bg-accent text-ink transition-transform group-hover:translate-x-1'>
                  <ArrowIcon />
                </span>
              </a>
            </div>
          </div>

          <div className='relative min-h-[25rem] overflow-hidden rounded-panel bg-brand shadow-editorial sm:min-h-[34rem] lg:col-span-5 lg:min-h-[41rem]'>
            <div className='absolute -right-20 -top-20 size-72 rounded-full bg-accent sm:size-96' />
            <div className='editorial-grid absolute inset-0 opacity-25' />
            <div className='absolute left-7 top-7 z-10 rounded-full border border-white/30 px-4 py-2 text-[0.625rem] font-bold uppercase tracking-[0.22em] text-white'>
              Bay qua miền di sản
            </div>
            <div className='absolute inset-0 flex items-end justify-center pb-4 sm:pb-8'>
              <CraneArtwork />
            </div>
            <p className='absolute bottom-7 right-7 z-10 max-w-28 text-right text-[0.625rem] font-semibold uppercase leading-4 tracking-[0.16em] text-white/70'>
              Tự do là một hướng đi
            </p>
          </div>
        </section>

        <section
          aria-label='Tuyên ngôn du hành'
          className='border-y border-white/10 bg-ink text-canvas'
        >
          <div className='mx-auto flex max-w-content flex-col gap-7 px-page py-9 sm:flex-row sm:items-center sm:justify-between'>
            <p className='font-display text-3xl font-medium leading-tight sm:text-4xl'>
              Đi để hiểu đất.
              <span className='text-accent'> Ở để thương người.</span>
            </p>
            <div className='flex shrink-0 items-center gap-3 text-[0.625rem] font-bold uppercase tracking-[0.22em] text-canvas/60'>
              <span>8°B</span>
              <span className='h-px w-12 bg-accent' />
              <span>23°B</span>
            </div>
          </div>
        </section>

        <section
          id='mien-dat'
          aria-labelledby='destinations-title'
          className='mx-auto max-w-content px-page py-section'
        >
          <div className='mb-12 grid gap-6 md:grid-cols-12 md:items-end lg:mb-16'>
            <div className='md:col-span-8'>
              <p className='eyebrow'>Tuyển chọn theo mùa</p>
              <h2
                id='destinations-title'
                className='mt-4 max-w-4xl font-display text-[clamp(2.8rem,7vw,6.4rem)] font-semibold leading-[0.9] tracking-[-0.045em] text-ink'
              >
                Mỗi miền đất,
                <span className='block italic text-brand'>một nhịp riêng.</span>
              </h2>
            </div>
            <p className='max-w-sm text-sm leading-6 text-muted md:col-span-4 md:justify-self-end md:text-base md:leading-7'>
              Ba lát cắt từ núi cao xuống biển, dành cho những người muốn lắng nghe cảnh sắc bằng mọi
              giác quan.
            </p>
          </div>

          <div className='grid gap-4 md:grid-cols-12'>
            {DESTINATIONS.map((destination) => (
              <article
                key={destination.name}
                className={`group relative min-h-[26rem] overflow-hidden rounded-panel p-6 sm:p-9 ${destination.className}`}
              >
                <div className='relative z-10 flex h-full flex-col'>
                  <div className='flex items-center justify-between text-[0.625rem] font-bold uppercase tracking-[0.2em] opacity-70'>
                    <span>{destination.number}</span>
                    <span>{destination.region}</span>
                  </div>
                  <div className='mt-auto'>
                    <p className='mb-3 text-xs font-semibold uppercase tracking-[0.14em] opacity-70'>
                      {destination.detail}
                    </p>
                    <h3 className='font-display text-5xl font-semibold tracking-[-0.04em] sm:text-6xl'>
                      {destination.name}
                    </h3>
                    <div className='mt-6 flex items-end justify-between gap-6'>
                      <p className='max-w-md text-sm leading-6 opacity-75 sm:text-base sm:leading-7'>
                        {destination.description}
                      </p>
                      <span className='grid size-11 shrink-0 place-items-center rounded-full border border-current transition-transform duration-300 group-hover:-rotate-12'>
                        <ArrowIcon />
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  aria-hidden='true'
                  className='absolute -right-16 top-16 size-56 rounded-full border-[3rem] border-current opacity-[0.08] transition-transform duration-700 group-hover:scale-110 sm:size-72'
                />
              </article>
            ))}
          </div>
        </section>

        <section
          id='hanh-trinh'
          aria-labelledby='journey-title'
          className='bg-accent text-ink'
        >
          <div className='mx-auto grid max-w-content gap-12 px-page py-section lg:grid-cols-12 lg:gap-16'>
            <div className='lg:col-span-5'>
              <p className='eyebrow'>Cách chúng tôi dẫn lối</p>
              <h2
                id='journey-title'
                className='mt-5 font-display text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-[0.86] tracking-[-0.05em]'
              >
                Chậm lại.
                <span className='block italic text-brand'>Nhìn sâu hơn.</span>
              </h2>
            </div>

            <ol className='divide-y divide-ink/20 border-y border-ink/20 lg:col-span-7'>
              <li className='grid gap-4 py-7 sm:grid-cols-[3rem_1fr] sm:gap-6'>
                <span className='text-xs font-bold tracking-[0.18em] text-brand'>01</span>
                <div>
                  <h3 className='font-display text-2xl font-semibold'>Chọn điều bản địa</h3>
                  <p className='mt-2 max-w-xl text-sm leading-6 text-ink/70 sm:text-base sm:leading-7'>
                    Từ quán nhỏ trong hẻm đến người giữ nghề lâu năm, mỗi gợi ý đều bắt đầu từ câu
                    chuyện tại chỗ.
                  </p>
                </div>
              </li>
              <li className='grid gap-4 py-7 sm:grid-cols-[3rem_1fr] sm:gap-6'>
                <span className='text-xs font-bold tracking-[0.18em] text-brand'>02</span>
                <div>
                  <h3 className='font-display text-2xl font-semibold'>Đi vừa đủ gần</h3>
                  <p className='mt-2 max-w-xl text-sm leading-6 text-ink/70 sm:text-base sm:leading-7'>
                    Những hành trình gọn, có khoảng thở và tôn trọng nhịp sống của nơi mình ghé qua.
                  </p>
                </div>
              </li>
              <li className='grid gap-4 py-7 sm:grid-cols-[3rem_1fr] sm:gap-6'>
                <span className='text-xs font-bold tracking-[0.18em] text-brand'>03</span>
                <div>
                  <h3 className='font-display text-2xl font-semibold'>Mang về một ký ức</h3>
                  <p className='mt-2 max-w-xl text-sm leading-6 text-ink/70 sm:text-base sm:leading-7'>
                    Không chỉ là một tấm ảnh đẹp, mà là dư vị, cuộc gặp và góc nhìn còn ở lại sau
                    chuyến đi.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section
          id='cau-chuyen'
          aria-labelledby='story-title'
          className='mx-auto max-w-content px-page py-section'
        >
          <div className='relative overflow-hidden rounded-panel bg-brand px-6 py-14 text-white sm:px-12 sm:py-20 lg:px-20 lg:py-24'>
            <div className='editorial-grid absolute inset-0 opacity-20' />
            <div className='absolute -right-16 -top-32 size-80 rounded-full bg-accent sm:size-[28rem]' />
            <div className='relative z-10 max-w-4xl'>
              <p className='text-xs font-bold uppercase tracking-[0.22em] text-accent'>
                Ghi chép từ dải đất hình chữ S
              </p>
              <h2
                id='story-title'
                className='mt-6 font-display text-[clamp(2.8rem,7vw,6.6rem)] font-semibold leading-[0.9] tracking-[-0.05em]'
              >
                Việt Nam không chỉ để ngắm.
                <span className='block italic text-accent'>Hãy đến để cảm.</span>
              </h2>
              <p className='mt-8 max-w-xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8'>
                Một dự án kể chuyện du hành bằng những góc nhìn chân thành, để mỗi chuyến đi bắt đầu
                bằng sự tò mò và kết thúc bằng kết nối.
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className='border-t border-line'>
        <div className='mx-auto flex max-w-content flex-col gap-7 px-page py-8 sm:flex-row sm:items-end sm:justify-between'>
          <div className='flex items-center gap-3 text-brand'>
            <BrandMark />
            <div>
              <p className='font-display text-xl font-bold text-ink'>Vạn Nẻo</p>
              <p className='text-xs text-muted'>Cẩm nang du hành Việt Nam</p>
            </div>
          </div>
          <p className='max-w-sm text-xs leading-5 text-muted sm:text-right'>
            Bản giới thiệu định hướng hình ảnh · Nội dung điểm đến đang được hoàn thiện.
          </p>
        </div>
      </footer>
    </main>
  );
}
