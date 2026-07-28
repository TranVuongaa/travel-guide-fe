import type {Metadata} from 'next';

import {PostForm} from '../_components/PostForm';

export const metadata: Metadata = {title: 'Viết bài mới'};

export default function NewPostPage() {
  return (
    <div>
      <p className='eyebrow'>Bài viết mới</p>
      <h1 className='mb-7 mt-4 font-display text-5xl font-semibold'>Kể một hành trình</h1>
      <PostForm />
    </div>
  );
}
