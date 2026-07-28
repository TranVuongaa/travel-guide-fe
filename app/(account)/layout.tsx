import {AuthGuard} from '@/components/auth/AuthGuard';

export default function AuthenticatedLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <div className='mx-auto max-w-content px-page py-10 sm:py-14'>
      <AuthGuard>{children}</AuthGuard>
    </div>
  );
}
