import type {Metadata} from 'next';

import {StoryDetail} from './_components/StoryDetail';

export const metadata: Metadata = {title: 'Chi tiết câu chuyện'};

export default async function StoryDetailPage({params}: Readonly<{params: Promise<{id: string}>}>) {
  const {id} = await params;
  return (
    <div className='mx-auto max-w-content px-page py-12 sm:py-16'>
      <StoryDetail id={id} />
    </div>
  );
}
