export function LoadingState({label = 'Đang tải dữ liệu…'}: Readonly<{label?: string}>) {
  return (
    <div role='status' className='rounded-panel border border-line bg-surface p-8 text-center text-muted'>
      <span className='mx-auto mb-4 block size-8 animate-spin rounded-full border-2 border-line border-t-brand motion-reduce:animate-none' />
      {label}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: Readonly<{title: string; description?: string; action?: React.ReactNode}>) {
  return (
    <div className='rounded-panel border border-dashed border-line bg-surface/60 p-8 text-center'>
      <h2 className='font-display text-2xl font-semibold'>{title}</h2>
      {description ? <p className='mx-auto mt-3 max-w-lg text-sm leading-6 text-muted'>{description}</p> : null}
      {action ? <div className='mt-6 flex justify-center'>{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: Readonly<{message: string; onRetry?: () => void}>) {
  return (
    <div role='alert' className='rounded-panel border border-danger/30 bg-danger-soft p-6 text-danger'>
      <p className='font-semibold'>Không thể tải dữ liệu</p>
      <p className='mt-2 text-sm leading-6'>{message}</p>
      {onRetry ? (
        <button type='button' onClick={onRetry} className='button-secondary mt-5'>
          Thử lại
        </button>
      ) : null}
    </div>
  );
}
