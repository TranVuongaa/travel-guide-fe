import type {Metadata} from 'next';

import {RegisterForm} from './_components/RegisterForm';

export const metadata: Metadata = {title: 'Đăng ký'};

export default function RegisterPage() {
  return (
    <div className='mx-auto max-w-lg px-page py-12 sm:py-20'>
      <RegisterForm />
    </div>
  );
}
