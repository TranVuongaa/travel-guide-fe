'use client';

import {useEffect, useState} from 'react';

import {normalizeAppError} from '@/lib/api/errors';
import {getPostService} from '@/lib/feature/posts/api';
import {formatDate} from '@/utils/format';

import {CommentsThread} from '@/components/community/CommentsThread';
import {ReactionBar} from '@/components/community/ReactionBar';
import {ErrorState, LoadingState} from '@/components/ui/AsyncState';

import {sanitizePostHtml, StoryContent} from './StoryContent';

import type {Post} from '@/types/api';
import type {SanitizedPostHtml} from './StoryContent';

type RenderablePost = Omit<Post, 'content'> & {
  content: SanitizedPostHtml;
};

export function StoryDetail({id}: Readonly<{id: string}>) {
  const [post, setPost] = useState<RenderablePost | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getPostService(id, controller.signal)
      .then((nextPost) => {
        setPost({...nextPost, content: sanitizePostHtml(nextPost.content)});
      })
      .catch((loadError: unknown) => {
        if (!controller.signal.aborted) {
          setError(normalizeAppError(loadError).message);
        }
      });
    return () => controller.abort();
  }, [id]);

  if (error) {
    return <ErrorState message={error} />;
  }
  if (!post) {
    return <LoadingState label='Đang mở câu chuyện…' />;
  }

  return (
    <article className='mx-auto max-w-4xl'>
      <p className='eyebrow'>{post.place?.name ?? 'Chuyện dọc đường'}</p>
      <h1 className='mt-6 font-display text-[clamp(3rem,9vw,7rem)] font-semibold leading-[0.88] tracking-[-0.05em]'>{post.title}</h1>
      <div className='mt-8 flex flex-wrap gap-x-5 gap-y-2 border-y border-line py-4 text-sm text-muted'>
        <span>{post.author.displayName}</span>
        <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
        <span>{post.source === 'SYSTEM' ? 'Biên tập' : 'Cộng đồng'}</span>
      </div>
      <StoryContent html={post.content} />
      <ReactionBar targetType='POST' targetId={post.id} initialCounts={post.reactionCounts} />
      <CommentsThread targetType='POST' targetId={post.id} />
    </article>
  );
}
