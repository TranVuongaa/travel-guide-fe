'use client';

import {useState} from 'react';

import {normalizeAppError} from '@/lib/api/errors';
import {createTravelContentIngestionService} from '@/lib/feature/travel-content-ingestions/api';
import {formatDate, formatNumber} from '@/utils/format';

import {ConfirmButton} from '@/components/ui/ConfirmButton';

import type {TravelContentIngestionRun, TravelContentIngestionStatus} from '@/types/api';

type RequestState =
  | {status: 'idle'}
  | {status: 'pending'}
  | {status: 'success'; run: TravelContentIngestionRun}
  | {status: 'error'; message: string};

const STATUS_PRESENTATION = {
  QUEUED: {
    label: 'Đang chờ',
    className: 'border-warning/30 bg-warning-soft text-warning',
  },
  RUNNING: {
    label: 'Đang chạy',
    className: 'border-brand/30 bg-brand/10 text-brand',
  },
  COMPLETED: {
    label: 'Hoàn tất',
    className: 'border-success/30 bg-success-soft text-success',
  },
  PARTIAL: {
    label: 'Hoàn tất một phần',
    className: 'border-warning/30 bg-warning-soft text-warning',
  },
  FAILED: {
    label: 'Thất bại',
    className: 'border-danger/30 bg-danger-soft text-danger',
  },
} satisfies Record<TravelContentIngestionStatus, {label: string; className: string}>;

const METRICS = [
  {key: 'trendKeywordCount', label: 'Từ khóa xu hướng'},
  {key: 'discoveredUrlCount', label: 'URL đã phát hiện'},
  {key: 'importedPostCount', label: 'Bài viết đã nhập'},
  {key: 'duplicateCount', label: 'Nội dung trùng lặp'},
  {key: 'skippedCount', label: 'Nội dung đã bỏ qua'},
  {key: 'failedCount', label: 'Nội dung lỗi'},
] as const;

const formatOptionalDate = (value: string | null | undefined): string => (value ? formatDate(value) : 'Chưa có');

function IngestionRunDetails({run}: Readonly<{run: TravelContentIngestionRun}>) {
  const status = STATUS_PRESENTATION[run.status];

  return (
    <section aria-labelledby='ingestion-run-title' className='mt-7 rounded-panel border border-line bg-surface p-5 sm:p-7'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='min-w-0'>
          <p className='text-xs font-bold uppercase tracking-[0.16em] text-muted'>Lần chạy vừa tiếp nhận</p>
          <h2 id='ingestion-run-title' className='mt-2 font-display text-3xl font-semibold'>
            Thông tin thu thập
          </h2>
          <p className='mt-3 break-all text-xs text-muted'>ID: {run.id}</p>
        </div>
        <span className={`w-fit rounded-full border px-3 py-1 text-sm font-semibold ${status.className}`}>
          Trạng thái: {status.label}
        </span>
      </div>

      <dl className='mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
        {METRICS.map((metric) => (
          <div key={metric.key} className='rounded-2xl bg-canvas p-4'>
            <dt className='text-sm text-muted'>{metric.label}</dt>
            <dd className='mt-2 font-display text-3xl font-semibold'>{formatNumber(run[metric.key])}</dd>
          </div>
        ))}
      </dl>

      <dl className='mt-6 grid gap-4 border-t border-line pt-6 text-sm sm:grid-cols-3'>
        <div>
          <dt className='font-semibold text-muted'>Được tạo lúc</dt>
          <dd className='mt-1'>{formatDate(run.createdAt)}</dd>
        </div>
        <div>
          <dt className='font-semibold text-muted'>Bắt đầu lúc</dt>
          <dd className='mt-1'>{formatOptionalDate(run.startedAt)}</dd>
        </div>
        <div>
          <dt className='font-semibold text-muted'>Hoàn tất lúc</dt>
          <dd className='mt-1'>{formatOptionalDate(run.completedAt)}</dd>
        </div>
      </dl>

      {run.errorSummary ? (
        <section aria-labelledby='ingestion-errors-title' className='mt-6 border-t border-line pt-6'>
          <h3 id='ingestion-errors-title' className='font-semibold text-danger'>
            Chi tiết lỗi từ backend
          </h3>
          <pre className='mt-3 max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-danger-soft p-4 text-xs text-danger'>
            {JSON.stringify(run.errorSummary, null, 2)}
          </pre>
        </section>
      ) : null}
    </section>
  );
}

export function TravelContentIngestionAdmin() {
  const [requestState, setRequestState] = useState<RequestState>({status: 'idle'});

  const handleQueue = async (): Promise<void> => {
    if (requestState.status === 'pending') {
      return;
    }

    setRequestState({status: 'pending'});
    try {
      const run = await createTravelContentIngestionService();
      setRequestState({status: 'success', run});
    } catch (error) {
      const appError = normalizeAppError(error);
      setRequestState({
        status: 'error',
        message:
          appError.status === 409
            ? 'Đang có một lần thu thập nội dung hoạt động. Vui lòng chờ lần chạy đó hoàn tất trước khi thử lại.'
            : appError.message,
      });
    }
  };

  const isPending = requestState.status === 'pending';

  return (
    <>
      <p className='eyebrow'>Tự động hóa nội dung</p>
      <h1 className='mt-4 font-display text-5xl font-semibold'>Thu thập nội dung du lịch</h1>
      <p className='mt-4 max-w-3xl leading-7 text-muted'>
        Yêu cầu backend tìm các chủ đề du lịch đang được quan tâm, thu thập bài viết phù hợp và đưa chúng vào hệ
        thống. Tác vụ chạy bất đồng bộ và mỗi thời điểm chỉ có một lần chạy hoạt động.
      </p>

      <section aria-labelledby='queue-ingestion-title' className='card mt-7'>
        <h2 id='queue-ingestion-title' className='font-display text-2xl font-semibold'>
          Bắt đầu một lần thu thập
        </h2>
        <p className='mt-3 max-w-2xl text-sm leading-6 text-muted'>
          API hiện chỉ xác nhận đã tiếp nhận yêu cầu. Trạng thái hiển thị bên dưới là snapshot tại thời điểm tiếp nhận
          và sẽ không tự cập nhật cho đến khi backend bổ sung API theo dõi tiến trình.
        </p>
        <div className='mt-6'>
          <ConfirmButton
            label={isPending ? 'Đang gửi yêu cầu…' : 'Chạy thu thập nội dung'}
            title='Bắt đầu thu thập nội dung?'
            description='Backend sẽ tạo một tác vụ scraping bất đồng bộ và sử dụng tài nguyên bên ngoài để tìm, xử lý và nhập nội dung.'
            confirmLabel='Xác nhận và chạy'
            variant='secondary'
            disabled={isPending}
            onConfirm={handleQueue}
          />
        </div>
      </section>

      {requestState.status === 'error' ? (
        <p role='alert' className='mt-5 rounded-xl bg-danger-soft p-4 text-danger'>
          {requestState.message}
        </p>
      ) : null}

      {requestState.status === 'success' ? (
        <>
          <p role='status' className='mt-5 rounded-xl bg-success-soft p-4 text-success'>
            Backend đã tiếp nhận yêu cầu thu thập nội dung.
          </p>
          <IngestionRunDetails run={requestState.run} />
        </>
      ) : null}
    </>
  );
}
