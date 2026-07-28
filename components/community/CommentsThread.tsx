'use client';

import {useCallback, useEffect, useState} from 'react';
import Link from 'next/link';

import {routes} from '@/config/routes';
import {
  createCommentService,
  deleteCommentService,
  getCommentService,
  listCommentsService,
  updateCommentService,
} from '@/lib/feature/comments/api';
import {normalizeAppError} from '@/lib/api/errors';
import {selectCurrentUser} from '@/store/selectors';
import {useAppSelector} from '@/store/hooks';
import {formatDate} from '@/utils/format';

import {ReactionBar} from './ReactionBar';

import type {Comment, CommentTargetType} from '@/types/api';

function ReplyList({
  targetType,
  targetId,
  parentId,
  onChanged,
}: Readonly<{
  targetType: CommentTargetType;
  targetId: string;
  parentId: string;
  onChanged: () => void;
}>) {
  const [replies, setReplies] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadReplies = useCallback(async () => {
    try {
      const data = await listCommentsService({targetType, targetId, parentId, limit: 100});
      setReplies(data.items);
      setError(null);
    } catch (loadError) {
      setError(normalizeAppError(loadError).message);
    }
  }, [parentId, targetId, targetType]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadReplies(), 0);
    return () => window.clearTimeout(timer);
  }, [loadReplies]);

  if (error) {
    return <p role='alert' className='mt-3 text-sm text-danger'>{error}</p>;
  }

  return (
    <div className='mt-4 space-y-3 border-l-2 border-line pl-4'>
      {replies.map((reply) => (
        <CommentCard
          key={reply.id}
          comment={reply}
          targetType={targetType}
          targetId={targetId}
          onChanged={() => {
            void loadReplies();
            onChanged();
          }}
        />
      ))}
    </div>
  );
}

function CommentCard({
  comment,
  targetType,
  targetId,
  onChanged,
}: Readonly<{
  comment: Comment;
  targetType: CommentTargetType;
  targetId: string;
  onChanged: () => void;
}>) {
  const user = useAppSelector(selectCurrentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [content, setContent] = useState(comment.content ?? '');
  const [reply, setReply] = useState('');
  const [detail, setDetail] = useState<Comment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isOwner = user?.id === comment.authorId;

  const handleUpdate = async (): Promise<void> => {
    if (!content.trim()) {
      setError('Nội dung bình luận là bắt buộc.');
      return;
    }
    try {
      await updateCommentService(comment.id, content.trim());
      setIsEditing(false);
      setError(null);
      onChanged();
    } catch (updateError) {
      setError(normalizeAppError(updateError).message);
    }
  };

  const handleReply = async (): Promise<void> => {
    if (!reply.trim()) {
      setError('Nội dung trả lời là bắt buộc.');
      return;
    }
    try {
      await createCommentService({targetType, targetId, parentId: comment.id, content: reply.trim()});
      setReply('');
      setIsReplying(false);
      setShowReplies(true);
      setError(null);
      onChanged();
    } catch (replyError) {
      setError(normalizeAppError(replyError).message);
    }
  };

  const handleInspect = async (): Promise<void> => {
    try {
      setDetail(await getCommentService(comment.id));
    } catch (detailError) {
      setError(normalizeAppError(detailError).message);
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      await deleteCommentService(comment.id);
      onChanged();
    } catch (deleteError) {
      setError(normalizeAppError(deleteError).message);
    }
  };

  return (
    <article className='rounded-2xl border border-line bg-surface p-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <p className='font-semibold'>{comment.author?.displayName ?? 'Tài khoản đã ẩn'}</p>
        <time className='text-xs text-muted' dateTime={comment.createdAt}>{formatDate(comment.createdAt)}</time>
      </div>
      {isEditing ? (
        <div className='mt-3'>
          <label className='field-label' htmlFor={`edit-comment-${comment.id}`}>Sửa bình luận</label>
          <textarea
            id={`edit-comment-${comment.id}`}
            value={content}
            maxLength={2000}
            onChange={(event) => setContent(event.target.value)}
            className='field-control min-h-28'
          />
          <div className='mt-3 flex gap-2'>
            <button type='button' onClick={handleUpdate} className='button-primary'>Lưu</button>
            <button type='button' onClick={() => setIsEditing(false)} className='button-secondary'>Hủy</button>
          </div>
        </div>
      ) : (
        <p className='mt-3 whitespace-pre-wrap text-sm leading-6 text-muted'>
          {comment.isDeleted ? 'Bình luận đã bị xóa.' : comment.content}
        </p>
      )}
      <ReactionBar targetType='COMMENT' targetId={comment.id} initialCounts={comment.reactionCounts} />
      <div className='mt-4 flex flex-wrap gap-2 text-sm'>
        <button type='button' onClick={handleInspect} className='font-semibold text-brand underline underline-offset-4'>
          Chi tiết
        </button>
        {user && !comment.isDeleted ? (
          <button type='button' onClick={() => setIsReplying((value) => !value)} className='font-semibold text-brand underline underline-offset-4'>
            Trả lời
          </button>
        ) : null}
        {comment.replyCount > 0 ? (
          <button type='button' onClick={() => setShowReplies((value) => !value)} className='font-semibold text-brand underline underline-offset-4'>
            {showReplies ? 'Ẩn trả lời' : `Xem ${comment.replyCount} trả lời`}
          </button>
        ) : null}
        {isOwner && !comment.isDeleted ? (
          <>
            <button type='button' onClick={() => setIsEditing(true)} className='font-semibold text-brand underline underline-offset-4'>
              Sửa
            </button>
            <button type='button' onClick={handleDelete} className='font-semibold text-danger underline underline-offset-4'>
              Xóa
            </button>
          </>
        ) : null}
      </div>
      {detail ? <p className='mt-3 text-xs text-muted'>ID: {detail.id} · Trạng thái: {detail.status}</p> : null}
      {isReplying ? (
        <div className='mt-4'>
          <label className='field-label' htmlFor={`reply-${comment.id}`}>Nội dung trả lời</label>
          <textarea
            id={`reply-${comment.id}`}
            value={reply}
            maxLength={2000}
            onChange={(event) => setReply(event.target.value)}
            className='field-control min-h-24'
          />
          <button type='button' onClick={handleReply} className='button-primary mt-3'>Gửi trả lời</button>
        </div>
      ) : null}
      {error ? <p role='alert' className='mt-3 text-sm text-danger'>{error}</p> : null}
      {showReplies ? (
        <ReplyList targetType={targetType} targetId={targetId} parentId={comment.id} onChanged={onChanged} />
      ) : null}
    </article>
  );
}

export function CommentsThread({
  targetType,
  targetId,
}: Readonly<{targetType: CommentTargetType; targetId: string}>) {
  const user = useAppSelector(selectCurrentUser);
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async (signal?: AbortSignal) => {
    try {
      const data = await listCommentsService({targetType, targetId, page: 1, limit: 100}, signal);
      setComments(data.items);
      setStatus('ready');
      setError(null);
    } catch (loadError) {
      if (signal?.aborted) {
        return;
      }
      setError(normalizeAppError(loadError).message);
      setStatus('error');
    }
  }, [targetId, targetType]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => void loadComments(controller.signal), 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [loadComments]);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!content.trim()) {
      setError('Nội dung bình luận là bắt buộc.');
      return;
    }
    try {
      await createCommentService({targetType, targetId, content: content.trim()});
      setContent('');
      await loadComments();
    } catch (createError) {
      setError(normalizeAppError(createError).message);
    }
  };

  return (
    <section aria-labelledby={`comments-${targetType}-${targetId}`} className='mt-10 border-t border-line pt-8'>
      <h2 id={`comments-${targetType}-${targetId}`} className='font-display text-3xl font-semibold'>Bình luận</h2>
      {user ? (
        <form onSubmit={handleCreate} className='mt-5 rounded-2xl bg-surface p-4'>
          <label className='field-label' htmlFor={`new-comment-${targetId}`}>Chia sẻ suy nghĩ</label>
          <textarea
            id={`new-comment-${targetId}`}
            value={content}
            maxLength={2000}
            onChange={(event) => setContent(event.target.value)}
            className='field-control min-h-28'
          />
          <button type='submit' className='button-primary mt-3'>Gửi bình luận</button>
        </form>
      ) : (
        <p className='mt-4 text-sm text-muted'>
          <Link href={routes.login} className='font-semibold text-brand underline underline-offset-4'>Đăng nhập</Link>{' '}
          để tham gia thảo luận.
        </p>
      )}
      {status === 'loading' ? <p role='status' className='mt-6 text-muted'>Đang tải bình luận…</p> : null}
      {status === 'error' ? <p role='alert' className='mt-6 text-danger'>{error}</p> : null}
      {status === 'ready' && comments.length === 0 ? <p className='mt-6 text-muted'>Chưa có bình luận nào.</p> : null}
      <div className='mt-6 space-y-4'>
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            targetType={targetType}
            targetId={targetId}
            onChanged={() => void loadComments()}
          />
        ))}
      </div>
    </section>
  );
}
