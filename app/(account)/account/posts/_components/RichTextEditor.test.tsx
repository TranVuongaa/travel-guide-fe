import {useState} from 'react';

import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {isRichTextContentEmpty, RichTextEditor} from './RichTextEditor';

function EditorHarness({initialValue = ''}: Readonly<{initialValue?: string}>) {
  const [value, setValue] = useState(initialValue);

  return (
    <>
      <p id='editor-label'>Nội dung bài viết</p>
      <RichTextEditor
        value={value}
        onChange={setValue}
        labelId='editor-label'
        descriptionIds='editor-help editor-count'
        maxLength={100000}
        required
      />
      <p id='editor-help'>Hướng dẫn</p>
      <output id='editor-count'>{value}</output>
    </>
  );
}

afterEach(() => {
  cleanup();
});

describe('RichTextEditor', () => {
  it('turns visual formatting into supported semantic HTML', async () => {
    const user = userEvent.setup();
    render(<EditorHarness initialValue='<p><strong>Khám phá Huế</strong></p>' />);

    await screen.findByRole('textbox', {name: 'Nội dung bài viết'});
    await user.click(screen.getByRole('button', {name: 'Tiêu đề cấp 2'}));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('<h2><strong>Khám phá Huế</strong></h2>');
    });
  });

  it('rejects unsafe links before inserting a valid HTTP(S) link', async () => {
    const user = userEvent.setup();
    render(<EditorHarness />);

    await screen.findByRole('textbox', {name: 'Nội dung bài viết'});
    const linkButton = screen.getByRole('button', {name: 'Chèn liên kết'});
    await waitFor(() => expect(linkButton).toBeEnabled());
    await user.click(linkButton);
    await user.type(screen.getByLabelText('Văn bản hiển thị'), 'Nguồn tham khảo');
    await user.type(screen.getByLabelText('Địa chỉ liên kết'), 'javascript:alert(1)');
    await user.click(screen.getByRole('button', {name: 'Chèn'}));

    expect(screen.getByRole('alert')).toHaveTextContent('http:// hoặc https://');

    await user.clear(screen.getByLabelText('Địa chỉ liên kết'));
    await user.type(screen.getByLabelText('Địa chỉ liên kết'), 'https://example.com/nguon');
    await user.click(screen.getByRole('button', {name: 'Chèn'}));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        '<p><a target="_blank" rel="noopener noreferrer nofollow" href="https://example.com/nguon">Nguồn tham khảo</a></p>',
      );
    });
  });

  it('requires alternative text and inserts only a safe external image URL', async () => {
    const user = userEvent.setup();
    render(<EditorHarness />);

    await screen.findByRole('textbox', {name: 'Nội dung bài viết'});
    const imageButton = screen.getByRole('button', {name: 'Chèn hình ảnh từ URL'});
    await waitFor(() => expect(imageButton).toBeEnabled());
    await user.click(imageButton);
    await user.type(screen.getByLabelText('Địa chỉ hình ảnh'), 'https://example.com/hue.jpg');
    await user.click(screen.getByRole('button', {name: 'Chèn'}));

    expect(screen.getByRole('alert')).toHaveTextContent('mô tả thay thế');

    await user.type(screen.getByLabelText('Mô tả thay thế'), 'Đại Nội Huế');
    await user.click(screen.getByRole('button', {name: 'Chèn'}));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        '<img src="https://example.com/hue.jpg" alt="Đại Nội Huế">',
      );
    });
  });

  it('synchronizes HTML supplied after the editor is mounted', async () => {
    const handleChange = vi.fn();
    const existingHtml =
      '<figure><img src="https://example.com/hue.jpg" alt="Đại Nội Huế">' +
      '<figcaption>Ảnh di sản từ <a href="https://example.com">nguồn mở</a>.</figcaption></figure>' +
      '<h2>Lịch trình mới</h2><p>Ngày đầu tiên.</p>';
    const {rerender} = render(
      <>
        <p id='editor-label'>Nội dung bài viết</p>
        <RichTextEditor
          value=''
          onChange={handleChange}
          labelId='editor-label'
          descriptionIds='editor-help'
          maxLength={100000}
        />
      </>,
    );

    await screen.findByRole('textbox', {name: 'Nội dung bài viết'});
    rerender(
      <>
        <p id='editor-label'>Nội dung bài viết</p>
        <RichTextEditor
          value={existingHtml}
          onChange={handleChange}
          labelId='editor-label'
          descriptionIds='editor-help'
          maxLength={100000}
        />
      </>,
    );

    const editor = screen.getByRole('textbox', {name: 'Nội dung bài viết'});
    await waitFor(() => expect(editor.querySelector('figure')).toBeInTheDocument());
    expect(editor.querySelector('figure img')).toHaveAttribute('alt', 'Đại Nội Huế');
    expect(editor.querySelector('figcaption')).toHaveTextContent('Ảnh di sản từ nguồn mở.');
    expect(editor.querySelector('figcaption a')).toHaveAttribute('href', 'https://example.com');
    expect(editor).toContainHTML('<h2>Lịch trình mới</h2><p>Ngày đầu tiên.</p>');
    expect(handleChange).not.toHaveBeenCalled();
  });
});

describe('isRichTextContentEmpty', () => {
  it('recognizes empty editor markup while retaining meaningful non-text content', () => {
    expect(isRichTextContentEmpty('')).toBe(true);
    expect(isRichTextContentEmpty('<p><br></p>')).toBe(true);
    expect(isRichTextContentEmpty('<p>Hành trình</p>')).toBe(false);
    expect(isRichTextContentEmpty('<img src="https://example.com/hue.jpg" alt="Đại Nội Huế">')).toBe(false);
  });
});
