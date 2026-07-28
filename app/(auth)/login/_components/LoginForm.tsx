'use client';

import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

import {isGoogleOAuthConfigured} from '@/config/env';
import {routes} from '@/config/routes';
import {openGoogleOAuthPopup} from '@/lib/auth/google-pkce';
import {selectAuthError, selectAuthStatus, selectCurrentUser} from '@/store/selectors';
import {clearAuthError, login, loginWithGoogle} from '@/store/slices/auth.slice';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {isEmail} from '@/utils/validation';

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const status = useAppSelector(selectAuthStatus);
  const authError = useAppSelector(selectAuthError);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clientError, setClientError] = useState<string | null>(null);
  const isSubmitting = status === 'loading';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    dispatch(clearAuthError());
    if (!isEmail(email)) {
      setClientError('Email không đúng định dạng.');
      return;
    }
    if (password.length < 8 || password.length > 128) {
      setClientError('Mật khẩu phải có từ 8 đến 128 ký tự.');
      return;
    }

    setClientError(null);
    const result = await dispatch(login({email, password}));
    if (login.fulfilled.match(result)) {
      router.push(routes.profile);
    }
  };

  const handleGoogle = async (): Promise<void> => {
    dispatch(clearAuthError());
    try {
      const input = await openGoogleOAuthPopup();
      const result = await dispatch(loginWithGoogle(input));
      if (loginWithGoogle.fulfilled.match(result)) {
        router.push(routes.profile);
      }
    } catch (error) {
      setClientError(error instanceof Error ? error.message : 'Không thể đăng nhập với Google.');
    }
  };

  if (user) {
    return (
      <div className='card'>
        <h1 className='font-display text-4xl font-semibold'>Bạn đã đăng nhập</h1>
        <p className='mt-4 text-muted'>Xin chào {user.displayName}.</p>
        <Link href={routes.profile} className='button-primary mt-6'>Mở tài khoản</Link>
      </div>
    );
  }

  return (
    <div className='card'>
      <p className='eyebrow'>Chào mừng trở lại</p>
      <h1 className='mt-4 font-display text-4xl font-semibold'>Đăng nhập</h1>
      <form onSubmit={handleSubmit} className='mt-7 space-y-5' noValidate>
        <div>
          <label className='field-label' htmlFor='login-email'>Email</label>
          <input
            id='login-email'
            type='email'
            autoComplete='email'
            maxLength={320}
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className='field-control'
          />
        </div>
        <div>
          <label className='field-label' htmlFor='login-password'>Mật khẩu</label>
          <input
            id='login-password'
            type='password'
            autoComplete='current-password'
            minLength={8}
            maxLength={128}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className='field-control'
          />
        </div>
        {clientError || authError ? (
          <p role='alert' className='rounded-xl bg-danger-soft p-3 text-sm text-danger'>
            {clientError ?? authError?.message}
          </p>
        ) : null}
        <button type='submit' disabled={isSubmitting} className='button-primary w-full'>
          {isSubmitting ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </button>
      </form>
      <div className='my-6 flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-muted'>
        <span className='h-px flex-1 bg-line' />
        hoặc
        <span className='h-px flex-1 bg-line' />
      </div>
      <button
        type='button'
        disabled={!isGoogleOAuthConfigured || isSubmitting}
        onClick={handleGoogle}
        className='button-secondary w-full'
      >
        Tiếp tục với Google
      </button>
      {!isGoogleOAuthConfigured ? (
        <p className='mt-3 text-xs leading-5 text-muted'>
          Google OAuth đang chờ cấu hình `NEXT_PUBLIC_GOOGLE_CLIENT_ID` và `NEXT_PUBLIC_GOOGLE_REDIRECT_URI`.
        </p>
      ) : null}
      <p className='mt-6 text-center text-sm text-muted'>
        Chưa có tài khoản?{' '}
        <Link href={routes.register} className='font-semibold text-brand underline underline-offset-4'>Đăng ký</Link>
      </p>
    </div>
  );
}
