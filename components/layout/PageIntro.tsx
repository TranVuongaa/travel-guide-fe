export function PageIntro({
  eyebrow,
  title,
  description,
  actions,
}: Readonly<{
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}>) {
  return (
    <div className='mb-10 grid gap-6 border-b border-line pb-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end'>
      <div>
        <p className='eyebrow'>{eyebrow}</p>
        <h1 className='mt-4 font-display text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.045em]'>
          {title}
        </h1>
        {description ? <p className='mt-5 max-w-2xl text-base leading-7 text-muted'>{description}</p> : null}
      </div>
      {actions ? <div className='flex flex-wrap gap-3'>{actions}</div> : null}
    </div>
  );
}
