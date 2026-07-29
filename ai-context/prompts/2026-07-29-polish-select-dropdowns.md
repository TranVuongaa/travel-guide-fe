---
id: "2026-07-29-polish-select-dropdowns"
status: completed
created_at: "2026-07-29T13:55:27+07:00"
confirmed_at: "2026-07-29T13:57:25+07:00"
completed_at: "2026-07-29T14:01:27+07:00"
---

# Goal

Làm đẹp toàn bộ dropdown `<select>` hiện có để trạng thái đóng và danh sách lựa chọn khi mở đồng bộ với phong cách
editorial ấm của dự án.

# Skills read

- Không có. Người dùng không yêu cầu project skill cụ thể và workflow không bắt buộc skill cho thay đổi CSS này.

# Existing code inspected

- `ai-context/project-overview.md`
- `ai-context/ai-workflow-rules.md`
- `app/globals.css`
- `app/(public)/destinations/_components/DestinationsExplorer.tsx`
- Tất cả vị trí sử dụng `<select>` trong `app/` và `components/`
- `package.json`

# Files likely to change

- `app/globals.css`
- File prompt này để cập nhật trạng thái và thời gian hoàn thành theo workflow

# Decisions / assumptions

- “Mấy cái dropdown” bao gồm toàn bộ `<select>` đang dùng class chung `.field-control`, trong đó có dropdown
  “Sắp xếp” trong ảnh.
- Giữ nguyên semantic native select, giá trị option, cơ chế submit form và các change handler hiện có.
- Áp dụng thay đổi tập trung qua CSS dùng chung, không sửa riêng từng màn hình.
- Không thêm component library hoặc dependency mới.
- Dùng progressive enhancement cho danh sách option khi mở vì khả năng tùy biến native picker phụ thuộc trình duyệt.
  Trình duyệt chưa hỗ trợ vẫn dùng dropdown native an toàn.

# Open questions

- Không có câu hỏi nào ảnh hưởng đáng kể đến việc triển khai.

# Implementation requirements

- Tạo dấu hiệu dropdown rõ ràng, đồng bộ thay vì giao diện mặc định của hệ điều hành.
- Trong trình duyệt hỗ trợ customizable select, style phần picker mở bằng các token surface, line, ink, muted,
  accent, brand, focus, radius và shadow hiện có.
- Option có vùng bấm thoải mái và phân biệt rõ hover, focus, selected.
- Không làm thay đổi giao diện input và textarea cũng đang dùng `.field-control`.
- Không thay đổi option value, label, name, defaultValue hoặc controlled state.
- Ưu tiên CSS-only; chỉ điều chỉnh markup tối thiểu nếu kiểm tra tương thích của repo chứng minh là cần thiết.

# API contract and external backend dependencies

- Không thay đổi API contract.
- Không phụ thuộc backend.
- Không thay đổi route, query parameter hoặc data fetching.

# Security requirements

- Không thêm HTML injection, dynamic style injection, external asset hoặc dependency.
- Không thay đổi authentication, browser storage hoặc network behavior.

# Accessibility requirements

- Giữ nguyên liên kết semantic giữa `<label>` và `<select>` cùng keyboard interaction native.
- Duy trì `:focus-visible` rõ ràng và đủ tương phản.
- Không biểu đạt trạng thái chọn chỉ bằng màu; giữ checkmark hoặc độ đậm tương đương.
- Duy trì chiều cao control phù hợp thao tác cảm ứng.
- Trong forced-colors/high-contrast hoặc khi không hỗ trợ custom picker, ưu tiên giao diện native đáng tin cậy.

# Acceptance criteria

- Mọi `select.field-control` có trạng thái đóng và icon dropdown nhất quán với thương hiệu.
- Dropdown “Sắp xếp” không còn giống popup vuông với highlight xanh mặc định trong ảnh trên trình duyệt hỗ trợ
  customizable select.
- Picker mở dùng palette ấm, bo góc, khoảng cách option thoải mái và có trạng thái chọn/tương tác rõ ràng.
- Trình duyệt chưa hỗ trợ custom picker vẫn có native select hoạt động bình thường.
- Mouse, touch, Tab, phím mũi tên, Enter, Escape và submit form giữ nguyên hành vi.
- Input và textarea không bị thay đổi giao diện.
- Không phát sinh horizontal overflow hoặc picker bị cắt trên mobile.

# Checks to run

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

# Manual testing steps

1. Chạy `npm run dev` và mở `/destinations`.
2. Mở các dropdown “Tỉnh thành”, “Danh mục” và “Sắp xếp” ở desktop và mobile hẹp.
3. Kiểm tra khung picker, spacing option, hover/focus, selected state và icon dropdown.
4. Điều hướng bằng Tab, phím mũi tên, Enter và Escape.
5. Submit bộ lọc và xác nhận query parameter vẫn hoạt động.
6. Kiểm tra thêm một controlled select như đánh giá sao hoặc tỉnh thành trong form địa điểm.
7. Kiểm tra một input và textarea dùng `.field-control` để bảo đảm giao diện không đổi.
8. Nếu có, kiểm tra trình duyệt chưa hỗ trợ customizable select và xác nhận fallback native vẫn sử dụng được.

# UI specification

## Visual interpretation

- Xem ảnh là minh họa vấn đề, không phải giao diện cần sao chép.
- Dropdown nên giống một editorial card nhỏ: nền ấm, viền nhẹ, bo tròn rộng và độ nổi vừa phải.
- Option đang chọn dùng ngôn ngữ màu vàng/tím của thương hiệu thay cho màu xanh mặc định của hệ điều hành.

## Layout

- Giữ nguyên full-width và minimum height hiện tại.
- Icon dropdown nằm bên phải và không chồng lên label dài.
- Picker mở theo chiều rộng control khi trình duyệt hỗ trợ.

## Typography

- Kế thừa font sans-serif tiếng Việt của dự án.
- Giữ cỡ chữ form hiện tại dễ đọc.
- Option đang chọn có độ đậm vừa phải nhưng không gây dịch chuyển layout.

## Spacing

- Giữ nhịp padding hiện tại, đồng thời chừa chỗ cho icon.
- Option mở có padding dọc đủ để quét mắt và thao tác cảm ứng.
- Có khoảng cách nhỏ giữa control và picker.

## Colors

- Control đóng: `--surface`, `--ink`, `--line`.
- Focus/active: `--focus`, `--brand`.
- Option đang chọn: `--accent` với chữ `--ink`.
- Secondary/disabled: `--muted`.

## Interaction states

- Phân biệt được resting, hover, open, focus-visible, selected và disabled.
- Chỉ dùng transition ngắn cho control đóng và icon.
- Không animation picker theo cách xung đột với native behavior.

## Responsiveness

- Hoạt động từ viewport tối thiểu 20rem của dự án trở lên.
- Label dài không đè lên icon.
- Picker không gây cuộn ngang toàn trang.

## Accessibility

- Semantic và keyboard behavior native được ưu tiên hơn trang trí.
- Focus ring không bị panel xung quanh cắt.
- Forced-colors và trình duyệt không hỗ trợ nhận giao diện native ổn định.

## Pixel-perfect expectations

- Bám theo design token và hình học form hiện tại, không thêm màu hoặc kích thước rời rạc.
- Cách render picker có thể khác giữa browser engine; trình duyệt hỗ trợ phải bám sát đặc tả này, còn fallback được
  phép giữ giao diện native.
