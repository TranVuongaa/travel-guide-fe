import axios from 'axios';

export type AppError = {
  code: string;
  message: string;
  status?: number;
  fieldErrors?: Record<string, string>;
};

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_ACCESS_TOKEN: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.',
  INVALID_REFRESH_TOKEN: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng.',
  EMAIL_ALREADY_EXISTS: 'Email này đã được sử dụng.',
  NOT_FOUND: 'Không tìm thấy nội dung yêu cầu.',
  FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này.',
  CONFLICT: 'Dữ liệu đang xung đột với một bản ghi khác.',
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getFieldErrors = (details: unknown): Record<string, string> | undefined => {
  if (!Array.isArray(details)) {
    return undefined;
  }

  const entries = details.flatMap((detail): [string, string][] => {
    if (!isRecord(detail)) {
      return [];
    }

    const field = typeof detail.field === 'string' ? detail.field : undefined;
    const message = typeof detail.message === 'string' ? detail.message : undefined;
    return field && message ? [[field, message]] : [];
  });

  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
};

export const normalizeAppError = (error: unknown): AppError => {
  if (!axios.isAxiosError(error)) {
    if (
      isRecord(error) &&
      typeof error.code === 'string' &&
      typeof error.message === 'string'
    ) {
      return {
        code: error.code,
        message: error.message,
        status: typeof error.status === 'number' ? error.status : undefined,
        fieldErrors: isRecord(error.fieldErrors)
          ? Object.fromEntries(
              Object.entries(error.fieldErrors).filter(
                (entry): entry is [string, string] => typeof entry[1] === 'string',
              ),
            )
          : undefined,
      };
    }

    return {
      code: 'UNEXPECTED_ERROR',
      message: error instanceof Error ? error.message : 'Đã có lỗi không mong muốn xảy ra.',
    };
  }

  const status = error.response?.status;
  const payload: unknown = error.response?.data;
  const apiError = isRecord(payload) && isRecord(payload.error) ? payload.error : undefined;
  const code = apiError && typeof apiError.code === 'string' ? apiError.code : 'REQUEST_FAILED';

  return {
    code,
    message:
      ERROR_MESSAGES[code] ??
      (status === 401
        ? 'Bạn cần đăng nhập để tiếp tục.'
        : status === 403
          ? 'Bạn không có quyền thực hiện thao tác này.'
          : status === 404
            ? 'Không tìm thấy nội dung yêu cầu.'
            : status === 409
              ? 'Dữ liệu bị trùng hoặc đang được sử dụng.'
              : 'Không thể kết nối đến dịch vụ. Vui lòng thử lại.'),
    status,
    fieldErrors: getFieldErrors(apiError?.details),
  };
};

export const createContractError = (): AppError => ({
  code: 'INVALID_API_RESPONSE',
  message: 'Dịch vụ trả về dữ liệu không hợp lệ.',
});
