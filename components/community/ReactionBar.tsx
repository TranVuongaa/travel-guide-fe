'use client';

import {useCallback, useEffect, useState} from 'react';
import Link from 'next/link';

import {routes} from '@/config/routes';
import {normalizeAppError} from '@/lib/api/errors';
import {
  deleteReactionService,
  getReactionSummaryService,
  upsertReactionService,
} from '@/lib/feature/reactions/api';
import {selectCurrentUser} from '@/store/selectors';
import {useAppSelector} from '@/store/hooks';
import {REACTION_ICONS, REACTION_LABELS} from '@/utils/format';

import type {ReactionSummary, ReactionType, TargetType} from '@/types/api';

const REACTION_TYPES: ReactionType[] = ['LIKE', 'LOVE', 'WOW', 'SAD', 'ANGRY'];

export function ReactionBar({
  targetType,
  targetId,
  initialCounts,
}: Readonly<{
  targetType: TargetType;
  targetId: string;
  initialCounts?: ReactionSummary['counts'];
}>) {
  const user = useAppSelector(selectCurrentUser);
  const [summary, setSummary] = useState<ReactionSummary | null>(
    initialCounts ? {targetType, targetId, counts: initialCounts, total: Object.values(initialCounts).reduce((a, b) => a + b, 0)} : null,
  );
  const [selectedType, setSelectedType] = useState<ReactionType | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async (signal?: AbortSignal) => {
    try {
      const nextSummary = await getReactionSummaryService(targetType, targetId, signal);
      setSummary(nextSummary);
    } catch (loadError) {
      if (signal?.aborted) {
        return;
      }
      setError(normalizeAppError(loadError).message);
    }
  }, [targetId, targetType]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => void loadSummary(controller.signal), 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [loadSummary]);

  const handleReaction = async (type: ReactionType): Promise<void> => {
    if (!user || isWorking) {
      return;
    }

    setIsWorking(true);
    setError(null);
    try {
      if (selectedType === type) {
        await deleteReactionService(targetType, targetId);
        setSelectedType(null);
      } else {
        await upsertReactionService({targetType, targetId, type});
        setSelectedType(type);
      }
      await loadSummary();
    } catch (reactionError) {
      setError(normalizeAppError(reactionError).message);
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <div className='mt-5'>
      <div className='flex flex-wrap items-center gap-2' aria-label='Cảm xúc'>
        {REACTION_TYPES.map((type) => (
          <button
            key={type}
            type='button'
            disabled={!user || isWorking}
            aria-pressed={selectedType === type}
            aria-label={`${REACTION_LABELS[type]}: ${summary?.counts[type] ?? 0}`}
            onClick={() => handleReaction(type)}
            className='inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-sm font-semibold transition hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-65 aria-pressed:border-brand aria-pressed:bg-brand aria-pressed:text-white'
          >
            <span aria-hidden='true'>{REACTION_ICONS[type]}</span>
            <span>{summary?.counts[type] ?? 0}</span>
          </button>
        ))}
        {!user ? (
          <Link href={routes.login} className='ml-1 text-sm font-semibold text-brand underline underline-offset-4'>
            Đăng nhập để bày tỏ
          </Link>
        ) : null}
      </div>
      {error ? <p role='alert' className='mt-2 text-sm text-danger'>{error}</p> : null}
    </div>
  );
}
