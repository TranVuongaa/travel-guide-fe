import type {Metadata} from 'next';

import {PageIntro} from '@/components/layout/PageIntro';

import {StatusPanel} from './_components/StatusPanel';

export const metadata: Metadata = {title: 'Trạng thái API'};

export default function StatusPage() {
  return (
    <div className='mx-auto max-w-content px-page py-12 sm:py-16'>
      <PageIntro eyebrow='Kết nối hệ thống' title='Trạng thái dịch vụ.' description='Kiểm tra trực tiếp kết nối HTTP đến backend.' />
      <StatusPanel />
    </div>
  );
}
