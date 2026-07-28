'use client';

import {useEffect, useState} from 'react';

import {createGoogleCallbackMessage} from '@/lib/auth/google-pkce';

export function GoogleCallback() {
  const [message, setMessage] = useState('Đang hoàn tất xác thực Google…');

  useEffect(() => {
    let closeTimer: number | undefined;
    const messageTimer = window.setTimeout(() => {
    if (!window.opener) {
      setMessage('Không tìm thấy cửa sổ đăng nhập ban đầu. Bạn có thể đóng trang này.');
      return;
    }

    const callbackMessage = createGoogleCallbackMessage(new URLSearchParams(window.location.search));
    window.opener.postMessage(callbackMessage, window.location.origin);
    setMessage(callbackMessage.error ? 'Google đã từ chối yêu cầu đăng nhập.' : 'Đã nhận mã xác thực. Cửa sổ sẽ đóng.');
      closeTimer = window.setTimeout(() => window.close(), 250);
    }, 0);
    return () => {
      window.clearTimeout(messageTimer);
      if (closeTimer) {
        window.clearTimeout(closeTimer);
      }
    };
  }, []);

  return (
    <div role='status' className='card text-center'>
      <h1 className='font-display text-3xl font-semibold'>Google OAuth</h1>
      <p className='mt-4 text-muted'>{message}</p>
    </div>
  );
}
