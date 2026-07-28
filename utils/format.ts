import type {ContentStatus, ReactionType, UserRole} from '@/lib/api/contracts';

export const formatDate = (value: string): string =>
  new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

export const formatNumber = (value: number): string => new Intl.NumberFormat('vi-VN').format(value);

export const CONTENT_STATUS_LABELS: Record<ContentStatus, string> = {
  DRAFT: 'Bản nháp',
  PENDING: 'Chờ duyệt',
  PUBLISHED: 'Đã xuất bản',
  REJECTED: 'Bị từ chối',
  HIDDEN: 'Đã ẩn',
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  USER: 'Thành viên',
  EDITOR: 'Biên tập viên',
  ADMIN: 'Quản trị viên',
};

export const REACTION_LABELS: Record<ReactionType, string> = {
  LIKE: 'Thích',
  LOVE: 'Yêu thích',
  WOW: 'Ấn tượng',
  SAD: 'Buồn',
  ANGRY: 'Không hài lòng',
};

export const REACTION_ICONS: Record<ReactionType, string> = {
  LIKE: '👍',
  LOVE: '❤️',
  WOW: '😮',
  SAD: '😢',
  ANGRY: '😠',
};
