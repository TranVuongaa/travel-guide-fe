'use client';

import {useCallback, useEffect, useState} from 'react';

import {env} from '@/config/env';
import {normalizeAppError} from '@/lib/api/errors';
import {getHealthService} from '@/lib/api/health';

export function StatusPanel() {
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [message, setMessage] = useState('');

  const check = useCallback(async (signal?: AbortSignal) => {
    setStatus('loading');
    try {
      setMessage(await getHealthService(signal));
      setStatus('online');
    } catch (error) {
      if (!signal?.aborted) {
        setMessage(normalizeAppError(error).message);
        setStatus('offline');
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => void check(controller.signal), 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [check]);

  return (
    <div className='card max-w-2xl'>
      <div className='flex items-center gap-3'>
        <span
          aria-hidden='true'
          className={[
            'size-3 rounded-full',
            status === 'online' ? 'bg-success' : status === 'offline' ? 'bg-danger' : 'animate-pulse bg-warning',
          ].join(' ')}
        />
        <h2 className='font-display text-3xl font-semibold'>
          {status === 'online' ? 'API đang hoạt động' : status === 'offline' ? 'API đang gián đoạn' : 'Đang kiểm tra'}
        </h2>
      </div>
      <p role='status' className='mt-4 text-muted'>{message || 'Đang gửi yêu cầu kiểm tra…'}</p>
      <dl className='mt-6 grid gap-3 text-sm'>
        <div><dt className='font-semibold'>Địa chỉ API</dt><dd className='mt-1 break-all text-muted'>{env.apiBaseUrl}</dd></div>
        <div><dt className='font-semibold'>Giao thức</dt><dd className='mt-1 text-muted'>{new URL(env.apiBaseUrl).protocol.replace(':', '').toUpperCase()}</dd></div>
      </dl>
      <button type='button' onClick={() => void check()} disabled={status === 'loading'} className='button-primary mt-7'>
        Kiểm tra lại
      </button>
    </div>
  );
}
