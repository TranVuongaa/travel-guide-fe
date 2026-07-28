export function BrandMark({className = 'size-10'}: Readonly<{className?: string}>) {
  return (
    <svg aria-hidden='true' className={className} viewBox='0 0 48 48' fill='none'>
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
