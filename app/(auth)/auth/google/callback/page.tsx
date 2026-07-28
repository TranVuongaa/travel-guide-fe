import type {Metadata} from 'next';

import {GoogleCallback} from './_components/GoogleCallback';

export const metadata: Metadata = {title: 'Google OAuth'};

export default function GoogleCallbackPage() {
  return (
    <div className='mx-auto max-w-lg px-page py-20'>
      <GoogleCallback />
    </div>
  );
}
