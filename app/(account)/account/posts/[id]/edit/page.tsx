import type {Metadata} from 'next';

import {PostForm} from '../../_components/PostForm';

export const metadata: Metadata = {title: 'Sửa bài viết'};

export default async function EditPostPage({params}: Readonly<{params: Promise<{id: string}>}>) {
  const {id} = await params;
  return (
    <div>
      <p className='eyebrow'>Chỉnh sửa</p>
      <h1 className='mb-7 mt-4 font-display text-5xl font-semibold'>Hoàn thiện câu chuyện</h1>
      <PostForm postId={id} />
    </div>
  );
}
