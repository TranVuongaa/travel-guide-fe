'use client';

import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

import {routes} from '@/config/routes';
import {selectAuthError, selectAuthStatus} from '@/store/selectors';
import {clearAuthError, register} from '@/store/slices/auth.slice';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {isEmail} from '@/utils/validation';

export function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const authError = useAppSelector(selectAuthError);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clientError, setClientError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    dispatch(clearAuthError());
    if (!displayName.trim() || displayName.trim().length > 100) {
      setClientError('Tên hiển thị phải có từ 1 đến 100 ký tự.');
      return;
    }
    if (!isEmail(email)) {
      setClientError('Email không đúng định dạng.');
      return;
    }
    if (password.length < 8 || password.length > 128) {
      setClientError('Mật khẩu phải có từ 8 đến 128 ký tự.');
      return;
    }

    setClientError(null);
    const result = await dispatch(register({displayName: displayName.trim(), email, password}));
    if (register.fulfilled.match(result)) {
      router.push(routes.profile);
    }
  };

  return (
    <div className='card'>
      <p className='eyebrow'>Gia nhập cộng đồng</p>
      <h1 className='mt-4 font-display text-4xl font-semibold'>Tạo tài khoản</h1>
      <form onSubmit={handleSubmit} className='mt-7 space-y-5' noValidate>
        <div>
          <label className='field-label' htmlFor='register-name'>Tên hiển thị</label>
          <input
            id='register-name'
            autoComplete='name'
            minLength={1}
            maxLength={100}
            required
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className='field-control'
          />
        </div>
        <div>
          <label className='field-label' htmlFor='register-email'>Email</label>
          <input
            id='register-email'
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
          <label className='field-label' htmlFor='register-password'>Mật khẩu</label>
          <input
            id='register-password'
            type='password'
            autoComplete='new-password'
            minLength={8}
            maxLength={128}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className='field-control'
          />
          <p className='mt-2 text-xs text-muted'>Từ 8 đến 128 ký tự.</p>
        </div>
        {clientError || authError ? (
          <p role='alert' className='rounded-xl bg-danger-soft p-3 text-sm text-danger'>
            {clientError ?? authError?.message}
          </p>
        ) : null}
        <button type='submit' disabled={status === 'loading'} className='button-primary w-full'>
          {status === 'loading' ? 'Đang tạo tài khoản…' : 'Đăng ký'}
        </button>
      </form>
      <p className='mt-6 text-center text-sm text-muted'>
        Đã có tài khoản?{' '}
        <Link href={routes.login} className='font-semibold text-brand underline underline-offset-4'>Đăng nhập</Link>
      </p>
    </div>
  );
}
