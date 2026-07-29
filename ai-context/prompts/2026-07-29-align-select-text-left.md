---
id: "2026-07-29-align-select-text-left"
status: completed
created_at: "2026-07-29T16:52:28+07:00"
confirmed_at: "2026-07-29T16:53:11+07:00"
completed_at: "2026-07-29T16:56:05+07:00"
---

# Goal

Căn trái nội dung chữ trong toàn bộ dropdown dùng chung, trong khi icon dropdown và checkmark vẫn nằm bên phải.

# Skills read

- Không có; người dùng không yêu cầu skill và thay đổi CSS này không cần skill.

# Existing code inspected

- `ai-context/project-overview.md`
- `ai-context/ai-workflow-rules.md`
- `ai-context/prompts/2026-07-29-polish-select-dropdowns.md`
- Quy tắc `select.field-control` và option trong `app/globals.css`

# Files likely to change

- `app/globals.css`
- File prompt này để cập nhật trạng thái workflow

# Decisions / assumptions

- Áp dụng cho cả giá trị hiển thị trong select đóng và label của option trong picker mở.
- Không di chuyển icon dropdown hoặc checkmark sang trái.
- Người dùng đã yêu cầu triển khai trực tiếp và bỏ bước chờ xác nhận cho điều chỉnh này.

# Open questions

- Không có.

# Implementation requirements

- Đặt text alignment của `select.field-control` về bên trái.
- Đảm bảo option tùy biến bắt đầu từ mép trái và phần indicator tiếp tục neo bên phải.
- Không thay đổi spacing, màu sắc, behavior hoặc dữ liệu dropdown.

# API contract and external backend dependencies

- Không thay đổi API hoặc backend.

# Security requirements

- Không thêm dependency, asset hoặc nội dung động.

# Accessibility requirements

- Giữ nguyên native select semantics, keyboard behavior và focus state.
- Việc căn trái không được che text hoặc indicator khi zoom hay trên màn hình hẹp.

# Acceptance criteria

- Text của select đóng được căn trái.
- Text của mọi option được căn trái.
- Icon dropdown và selected checkmark vẫn ở bên phải.
- Các dropdown vẫn hoạt động như trước.

# Checks to run

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

# Manual testing steps

1. Mở `/destinations`.
2. Kiểm tra giá trị đang chọn trong “Sắp xếp” nằm bên trái và icon nằm bên phải.
3. Mở picker, kiểm tra mọi option căn trái và checkmark vẫn nằm bên phải.
4. Kiểm tra nhanh ở viewport mobile.

# UI specification

## Visual interpretation

- Chỉ sửa alignment; giữ nguyên giao diện dropdown vừa được duyệt.

## Layout

- Text bắt đầu từ padding trái hiện có; indicator giữ ở cạnh phải.

## Typography

- Không thay đổi font, cỡ chữ hoặc font weight.

## Spacing

- Không thay đổi padding hiện có.

## Colors

- Không thay đổi màu.

## Interaction states

- Không thay đổi hover, focus, selected, open hoặc disabled.

## Responsiveness

- Căn trái ổn định ở mọi chiều rộng hiện có.

## Accessibility

- Giữ nguyên semantics và điều hướng bàn phím.

## Pixel-perfect expectations

- Chữ phải căn trái rõ ràng trong cả trạng thái đóng và mở; indicator không bị dịch khỏi cạnh phải.
