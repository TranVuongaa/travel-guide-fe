'use client';

import {useCallback, useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';

import {routes} from '@/config/routes';
import {normalizeAppError} from '@/lib/api/errors';
import {
  getUserService,
  listUsersService,
  updateUserRoleService,
  updateUserStatusService,
} from '@/lib/api/users';
import {formatDate, USER_ROLE_LABELS} from '@/utils/format';

import {ConfirmButton} from '@/components/ui/ConfirmButton';
import {EmptyState, ErrorState, LoadingState} from '@/components/ui/AsyncState';
import {Pagination} from '@/components/ui/Pagination';

import type {PaginatedData, User, UserRole} from '@/lib/api/contracts';

const EMPTY_PAGE: PaginatedData<User> = {items: [], page: 1, limit: 20, totalItems: 0, totalPages: 0};
const ROLES: UserRole[] = ['USER', 'EDITOR', 'ADMIN'];

export function UsersAdmin() {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const [data, setData] = useState(EMPTY_PAGE);
  const [selected, setSelected] = useState<User | null>(null);
  const [nextRole, setNextRole] = useState<UserRole>('USER');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');

  const load = useCallback(async (signal?: AbortSignal) => {
    const params = new URLSearchParams(query);
    try {
      const nextData = await listUsersService(
        {
          page: Math.max(1, Number(params.get('page')) || 1),
          limit: 20,
          search: params.get('search') || undefined,
          role: (params.get('role') as UserRole | null) ?? undefined,
          isActive: params.get('isActive') ? params.get('isActive') === 'true' : undefined,
          sortBy: (params.get('sortBy') as 'createdAt' | 'displayName' | 'email' | 'updatedAt' | null) ?? 'createdAt',
          sortOrder: 'desc',
        },
        signal,
      );
      setData(nextData);
      setStatus('ready');
    } catch (loadError) {
      if (!signal?.aborted) {
        setError(normalizeAppError(loadError).message);
        setStatus('error');
      }
    }
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => void load(controller.signal), 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [load]);

  const handleOpen = async (id: string): Promise<void> => {
    try {
      const user = await getUserService(id);
      setSelected(user);
      setNextRole(user.role);
    } catch (detailError) {
      setError(normalizeAppError(detailError).message);
    }
  };

  const handleRole = async (): Promise<void> => {
    if (!selected) {
      return;
    }
    try {
      const nextUser = await updateUserRoleService(selected.id, nextRole);
      setSelected(nextUser);
      await load();
    } catch (roleError) {
      setError(normalizeAppError(roleError).message);
    }
  };

  const handleStatus = async (): Promise<void> => {
    if (!selected) {
      return;
    }
    try {
      const nextUser = await updateUserStatusService(selected.id, !selected.isActive);
      setSelected(nextUser);
      await load();
    } catch (statusError) {
      setError(normalizeAppError(statusError).message);
    }
  };

  return (
    <>
      <p className='eyebrow'>Phân quyền và trạng thái</p>
      <h1 className='mt-4 font-display text-5xl font-semibold'>Người dùng</h1>
      <form action={routes.adminUsers} className='my-7 grid gap-4 rounded-2xl bg-surface p-4 md:grid-cols-4'>
        <div className='md:col-span-2'>
          <label className='field-label' htmlFor='user-search'>Tìm kiếm</label>
          <input id='user-search' name='search' defaultValue={searchParams.get('search') ?? ''} className='field-control' placeholder='Email hoặc tên' />
        </div>
        <div>
          <label className='field-label' htmlFor='user-role'>Vai trò</label>
          <select id='user-role' name='role' defaultValue={searchParams.get('role') ?? ''} className='field-control'>
            <option value=''>Tất cả</option>
            {ROLES.map((role) => <option key={role} value={role}>{USER_ROLE_LABELS[role]}</option>)}
          </select>
        </div>
        <div>
          <label className='field-label' htmlFor='user-active'>Trạng thái</label>
          <select id='user-active' name='isActive' defaultValue={searchParams.get('isActive') ?? ''} className='field-control'>
            <option value=''>Tất cả</option>
            <option value='true'>Hoạt động</option>
            <option value='false'>Vô hiệu hóa</option>
          </select>
        </div>
        <button type='submit' className='button-secondary md:col-span-4 md:justify-self-start'>Áp dụng</button>
      </form>
      {error ? <p role='alert' className='mb-5 rounded-xl bg-danger-soft p-3 text-danger'>{error}</p> : null}
      {status === 'loading' ? <LoadingState /> : null}
      {status === 'error' ? <ErrorState message={error} onRetry={() => void load()} /> : null}
      {status === 'ready' && data.items.length === 0 ? <EmptyState title='Không có người dùng phù hợp' /> : null}
      {data.items.length > 0 ? (
        <div className='overflow-x-auto rounded-panel border border-line bg-surface'>
          <table className='w-full min-w-[42rem] text-left text-sm'>
            <thead className='bg-ink text-canvas'>
              <tr><th className='p-4'>Người dùng</th><th className='p-4'>Vai trò</th><th className='p-4'>Trạng thái</th><th className='p-4'>Tham gia</th><th className='p-4'>Thao tác</th></tr>
            </thead>
            <tbody className='divide-y divide-line'>
              {data.items.map((user) => (
                <tr key={user.id}>
                  <td className='p-4'><strong>{user.displayName}</strong><span className='mt-1 block text-xs text-muted'>{user.email}</span></td>
                  <td className='p-4'>{USER_ROLE_LABELS[user.role]}</td>
                  <td className='p-4'>{user.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}</td>
                  <td className='p-4'>{formatDate(user.createdAt)}</td>
                  <td className='p-4'><button type='button' onClick={() => void handleOpen(user.id)} className='button-secondary'>Quản lý</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <Pagination page={data.page} totalPages={data.totalPages} />
      {selected ? (
        <div role='dialog' aria-modal='true' aria-labelledby='user-dialog-title' className='fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4'>
          <div className='w-full max-w-xl rounded-panel bg-surface p-6'>
            <h2 id='user-dialog-title' className='font-display text-3xl font-semibold'>{selected.displayName}</h2>
            <p className='mt-2 text-sm text-muted'>{selected.email} · ID {selected.id}</p>
            <div className='mt-6'>
              <label className='field-label' htmlFor='next-user-role'>Vai trò mới</label>
              <select id='next-user-role' value={nextRole} onChange={(event) => setNextRole(event.target.value as UserRole)} className='field-control'>
                {ROLES.map((role) => <option key={role} value={role}>{USER_ROLE_LABELS[role]}</option>)}
              </select>
              <ConfirmButton
                label='Đổi vai trò'
                title={`Đổi vai trò của ${selected.displayName}?`}
                description={`Vai trò mới: ${USER_ROLE_LABELS[nextRole]}.`}
                variant='secondary'
                onConfirm={handleRole}
              />
            </div>
            <div className='mt-6 border-t border-line pt-6'>
              <ConfirmButton
                label={selected.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                title={`${selected.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'} ${selected.displayName}?`}
                description='Thay đổi này ảnh hưởng đến khả năng sử dụng tài khoản và phải được backend xác thực.'
                onConfirm={handleStatus}
              />
            </div>
            <button type='button' onClick={() => setSelected(null)} className='button-secondary mt-6'>Đóng</button>
          </div>
        </div>
      ) : null}
    </>
  );
}
