'use client';

import {useEffect, useId, useRef, useState} from 'react';

export function ConfirmButton({
  label,
  title,
  description,
  confirmLabel = 'Xác nhận',
  onConfirm,
  variant = 'danger',
  disabled = false,
}: Readonly<{
  label: string;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
  variant?: 'danger' | 'secondary';
  disabled?: boolean;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (isOpen) {
      cancelRef.current?.focus();
    }
  }, [isOpen]);

  const handleClose = (): void => {
    setIsOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };

  const handleConfirm = async (): Promise<void> => {
    setIsWorking(true);
    try {
      await onConfirm();
      handleClose();
    } finally {
      setIsWorking(false);
    }
  };

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Escape' && !isWorking) {
      handleClose();
      return;
    }
    if (event.key !== 'Tab' || !dialogRef.current) {
      return;
    }

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
      ),
    );
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) {
      return;
    }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type='button'
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className={variant === 'danger' ? 'button-danger' : 'button-secondary'}
      >
        {label}
      </button>
      {isOpen ? (
        <div
          role='presentation'
          className='fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4'
          onMouseDown={(event) => {
            if (event.currentTarget === event.target && !isWorking) {
              handleClose();
            }
          }}
          onKeyDown={handleDialogKeyDown}
        >
          <div
            ref={dialogRef}
            role='dialog'
            aria-modal='true'
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className='w-full max-w-md rounded-panel bg-surface p-6 shadow-editorial'
          >
            <h2 id={titleId} className='font-display text-2xl font-semibold'>
              {title}
            </h2>
            <p id={descriptionId} className='mt-3 text-sm leading-6 text-muted'>
              {description}
            </p>
            <div className='mt-6 flex justify-end gap-3'>
              <button ref={cancelRef} type='button' onClick={handleClose} disabled={isWorking} className='button-secondary'>
                Hủy
              </button>
              <button type='button' onClick={handleConfirm} disabled={isWorking} className='button-danger'>
                {isWorking ? 'Đang xử lý…' : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
