import type {Metadata} from 'next';

import {LoginForm} from './_components/LoginForm';

export const metadata: Metadata = {title: 'Đăng nhập'};

export default function LoginPage() {
  return (
    <div className='mx-auto max-w-lg px-page py-12 sm:py-20'>
      <LoginForm />
    </div>
  );
}
