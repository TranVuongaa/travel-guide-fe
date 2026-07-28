import type {Metadata} from 'next';

import {DestinationDetail} from './_components/DestinationDetail';

export const metadata: Metadata = {title: 'Chi tiết điểm đến'};

export default async function DestinationDetailPage({
  params,
}: Readonly<{params: Promise<{id: string}>}>) {
  const {id} = await params;
  return (
    <div className='mx-auto max-w-content px-page py-12 sm:py-16'>
      <DestinationDetail id={id} />
    </div>
  );
}
