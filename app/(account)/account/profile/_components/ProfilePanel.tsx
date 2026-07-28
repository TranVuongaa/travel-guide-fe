'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

import {isGoogleOAuthConfigured} from '@/config/env';
import {routes} from '@/config/routes';
import {logoutAllService, logoutService} from '@/lib/feature/auth/api';
import {normalizeAppError} from '@/lib/api/errors';
import {
  changePasswordService,
  getCurrentUserService,
  linkGoogleService,
  unlinkOAuthProviderService,
  updateCurrentUserService,
} from '@/lib/feature/users/api';
import {openGoogleOAuthPopup} from '@/lib/auth/google-pkce';
import {selectCurrentUser} from '@/store/selectors';
import {userChanged} from '@/store/slices/auth.slice';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {formatDate, USER_ROLE_LABELS} from '@/utils/format';
import {isHttpUrl} from '@/utils/validation';

import {ConfirmButton} from '@/components/ui/ConfirmButton';

export function ProfilePanel() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      return;
    }
    getCurrentUserService()
      .then((nextUser) => {
        dispatch(userChanged(nextUser));
        setDisplayName(nextUser.displayName);
        setAvatarUrl(nextUser.avatarUrl ?? '');
      })
      .catch((loadError: unknown) => setError(normalizeAppError(loadError).message));
  }, [dispatch, userId]);

  if (!user) {
    return null;
  }

  const handleProfile = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!displayName.trim() || displayName.trim().length > 100) {
      setError('Tên hiển thị phải có từ 1 đến 100 ký tự.');
      return;
    }
    if (avatarUrl && !isHttpUrl(avatarUrl)) {
      setError('URL ảnh đại diện phải dùng HTTP hoặc HTTPS.');
      return;
    }
    setIsWorking(true);
    try {
      const nextUser = await updateCurrentUserService({
        displayName: displayName.trim(),
        avatarUrl: avatarUrl.trim() || null,
      });
      dispatch(userChanged(nextUser));
      setNotice('Đã cập nhật hồ sơ.');
      setError(null);
    } catch (updateError) {
      setError(normalizeAppError(updateError).message);
    } finally {
      setIsWorking(false);
    }
  };

  const handlePassword = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (currentPassword.length < 8 || newPassword.length < 8 || newPassword.length > 128) {
      setError('Mật khẩu phải có từ 8 đến 128 ký tự.');
      return;
    }
    setIsWorking(true);
    try {
      await changePasswordService({currentPassword, newPassword});
      setCurrentPassword('');
      setNewPassword('');
      setNotice('Đã đổi mật khẩu.');
      setError(null);
    } catch (passwordError) {
      setError(normalizeAppError(passwordError).message);
    } finally {
      setIsWorking(false);
    }
  };

  const handleLinkGoogle = async (): Promise<void> => {
    setIsWorking(true);
    try {
      const input = await openGoogleOAuthPopup();
      const nextUser = await linkGoogleService(input);
      dispatch(userChanged(nextUser));
      setNotice('Đã liên kết Google.');
      setError(null);
    } catch (linkError) {
      setError(normalizeAppError(linkError).message);
    } finally {
      setIsWorking(false);
    }
  };

  const handleUnlink = async (provider: string): Promise<void> => {
    const remainingProviders = user.oauthProviders.filter((item) => item !== provider);
    if (!user.hasPassword && remainingProviders.length === 0) {
      setError('Không thể gỡ phương thức đăng nhập duy nhất. Hãy đặt mật khẩu hoặc liên kết phương thức khác trước.');
      return;
    }
    try {
      const nextUser = await unlinkOAuthProviderService(provider);
      dispatch(userChanged(nextUser));
      setNotice(`Đã gỡ liên kết ${provider}.`);
    } catch (unlinkError) {
      setError(normalizeAppError(unlinkError).message);
    }
  };

  const handleLogout = async (): Promise<void> => {
    await logoutService();
    router.push(routes.home);
  };

  const handleLogoutAll = async (): Promise<void> => {
    await logoutAllService();
    router.push(routes.home);
  };

  return (
    <div>
      <p className='eyebrow'>Thông tin cá nhân</p>
      <h1 className='mt-4 font-display text-5xl font-semibold'>Hồ sơ của bạn</h1>
      <div className='mt-7 grid gap-3 rounded-2xl bg-surface p-5 text-sm sm:grid-cols-2'>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Vai trò:</strong> {USER_ROLE_LABELS[user.role]}</p>
        <p><strong>Trạng thái:</strong> {user.isActive ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}</p>
        <p><strong>Tham gia:</strong> {formatDate(user.createdAt)}</p>
      </div>
      {notice ? <p role='status' className='mt-5 rounded-xl bg-success-soft p-3 text-success'>{notice}</p> : null}
      {error ? <p role='alert' className='mt-5 rounded-xl bg-danger-soft p-3 text-danger'>{error}</p> : null}

      <form onSubmit={handleProfile} className='card mt-7 space-y-5'>
        <h2 className='font-display text-3xl font-semibold'>Cập nhật hồ sơ</h2>
        <div>
          <label className='field-label' htmlFor='profile-name'>Tên hiển thị</label>
          <input id='profile-name' value={displayName} maxLength={100} onChange={(event) => setDisplayName(event.target.value)} className='field-control' />
        </div>
        <div>
          <label className='field-label' htmlFor='profile-avatar'>URL ảnh đại diện</label>
          <input id='profile-avatar' type='url' value={avatarUrl} maxLength={2048} onChange={(event) => setAvatarUrl(event.target.value)} className='field-control' placeholder='https://…' />
        </div>
        <button type='submit' disabled={isWorking} className='button-primary'>Lưu hồ sơ</button>
      </form>

      {user.hasPassword ? (
        <form onSubmit={handlePassword} className='card mt-7 space-y-5'>
          <h2 className='font-display text-3xl font-semibold'>Đổi mật khẩu</h2>
          <div>
            <label className='field-label' htmlFor='current-password'>Mật khẩu hiện tại</label>
            <input id='current-password' type='password' autoComplete='current-password' value={currentPassword} minLength={8} maxLength={128} onChange={(event) => setCurrentPassword(event.target.value)} className='field-control' />
          </div>
          <div>
            <label className='field-label' htmlFor='new-password'>Mật khẩu mới</label>
            <input id='new-password' type='password' autoComplete='new-password' value={newPassword} minLength={8} maxLength={128} onChange={(event) => setNewPassword(event.target.value)} className='field-control' />
          </div>
          <button type='submit' disabled={isWorking} className='button-primary'>Đổi mật khẩu</button>
        </form>
      ) : null}

      <section className='card mt-7' aria-labelledby='oauth-title'>
        <h2 id='oauth-title' className='font-display text-3xl font-semibold'>Tài khoản liên kết</h2>
        <div className='mt-5 flex flex-wrap gap-3'>
          {user.oauthProviders.map((provider) => (
            <ConfirmButton
              key={provider}
              label={`Gỡ ${provider}`}
              title={`Gỡ liên kết ${provider}?`}
              description='Bạn sẽ không thể dùng nhà cung cấp này để đăng nhập cho đến khi liên kết lại.'
              onConfirm={() => handleUnlink(provider)}
            />
          ))}
          {!user.oauthProviders.includes('GOOGLE') ? (
            <button type='button' disabled={!isGoogleOAuthConfigured || isWorking} onClick={handleLinkGoogle} className='button-secondary'>
              Liên kết Google
            </button>
          ) : null}
        </div>
        {!isGoogleOAuthConfigured ? <p className='mt-4 text-sm text-muted'>Google đang chờ cấu hình môi trường.</p> : null}
      </section>

      <section className='mt-7 rounded-panel border border-danger/30 bg-danger-soft p-6'>
        <h2 className='font-display text-3xl font-semibold text-danger'>Phiên đăng nhập</h2>
        <p className='mt-3 text-sm leading-6 text-danger'>Token chỉ tồn tại trong bộ nhớ và sẽ mất khi tải lại trang.</p>
        <div className='mt-5 flex flex-wrap gap-3'>
          <button type='button' onClick={handleLogout} className='button-secondary'>Đăng xuất tab này</button>
          <ConfirmButton
            label='Đăng xuất mọi thiết bị'
            title='Thu hồi tất cả phiên?'
            description='Mọi refresh session của tài khoản sẽ bị thu hồi.'
            confirmLabel='Đăng xuất tất cả'
            onConfirm={handleLogoutAll}
          />
        </div>
      </section>
    </div>
  );
}
