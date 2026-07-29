'use client';

import {useEffect, useId, useState} from 'react';

import {mergeAttributes, Node} from '@tiptap/core';
import Image from '@tiptap/extension-image';
import {EditorContent, useEditor, useEditorState} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import {sanitizeRichHtml} from '@/components/content/RichHtmlContent';

import type {Editor} from '@tiptap/core';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  labelId: string;
  descriptionIds: string;
  maxLength: number;
  required?: boolean;
};

type ToolbarButtonProps = {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
  isToggle?: boolean;
  disabled?: boolean;
};

type InsertPanel = 'link' | 'image' | null;

const Figure = Node.create({
  name: 'figure',
  group: 'block',
  content: 'image figcaption?',
  isolating: true,
  parseHTML: () => [{tag: 'figure'}],
  renderHTML: ({HTMLAttributes}) => ['figure', mergeAttributes(HTMLAttributes), 0],
});

const Figcaption = Node.create({
  name: 'figcaption',
  content: 'inline*',
  parseHTML: () => [{tag: 'figcaption'}],
  renderHTML: ({HTMLAttributes}) => ['figcaption', mergeAttributes(HTMLAttributes), 0],
});

const getToolbarState = (editor: Editor) => ({
  isParagraph: editor.isActive('paragraph'),
  isHeading2: editor.isActive('heading', {level: 2}),
  isHeading3: editor.isActive('heading', {level: 3}),
  isBold: editor.isActive('bold'),
  isItalic: editor.isActive('italic'),
  isBulletList: editor.isActive('bulletList'),
  isOrderedList: editor.isActive('orderedList'),
  isBlockquote: editor.isActive('blockquote'),
  isLink: editor.isActive('link'),
  canUndo: editor.can().undo(),
  canRedo: editor.can().redo(),
});

const normalizeSafeHttpUrl = (value: string): string | null => {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
};

export const isRichTextContentEmpty = (html: string): boolean => {
  if (!html.trim()) {
    return true;
  }

  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const hasNonTextContent = Boolean(parsedDocument.body.querySelector('img, hr'));
  return !hasNonTextContent && !parsedDocument.body.textContent?.trim();
};

function ToolbarButton({
  label,
  children,
  onClick,
  isActive = false,
  isToggle = false,
  disabled = false,
}: Readonly<ToolbarButtonProps>) {
  return (
    <button
      type='button'
      className='rich-text-toolbar-button'
      aria-label={label}
      aria-pressed={isToggle ? isActive : undefined}
      title={label}
      data-active={isActive ? 'true' : undefined}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function RichTextToolbar({
  editor,
  onOpenLink,
  onOpenImage,
}: Readonly<{
  editor: Editor | null;
  onOpenLink: () => void;
  onOpenImage: () => void;
}>) {
  const state = useEditorState({
    editor,
    selector: ({editor: activeEditor}) => {
      if (!activeEditor) {
        return null;
      }

      return getToolbarState(activeEditor);
    },
  });

  const resolvedState = state ?? (editor ? getToolbarState(editor) : null);
  const isUnavailable = !editor || !resolvedState;
  const handleToolbarKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }

    const buttons = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'),
    );
    const currentButton = (event.target as HTMLElement).closest('button');
    const currentIndex = currentButton ? buttons.indexOf(currentButton) : -1;

    if (currentIndex < 0 || buttons.length === 0) {
      return;
    }

    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    buttons[(currentIndex + direction + buttons.length) % buttons.length]?.focus();
  };

  return (
    <div
      className='rich-text-toolbar'
      role='toolbar'
      aria-label='Định dạng nội dung bài viết'
      onKeyDown={handleToolbarKeyDown}
    >
      <div className='rich-text-toolbar-group' role='group' aria-label='Kiểu đoạn'>
        <ToolbarButton
          label='Đoạn văn'
          isToggle
          isActive={resolvedState?.isParagraph}
          disabled={isUnavailable}
          onClick={() => editor?.chain().focus().setParagraph().run()}
        >
          Đoạn
        </ToolbarButton>
        <ToolbarButton
          label='Tiêu đề cấp 2'
          isToggle
          isActive={resolvedState?.isHeading2}
          disabled={isUnavailable}
          onClick={() => editor?.chain().focus().toggleHeading({level: 2}).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          label='Tiêu đề cấp 3'
          isToggle
          isActive={resolvedState?.isHeading3}
          disabled={isUnavailable}
          onClick={() => editor?.chain().focus().toggleHeading({level: 3}).run()}
        >
          H3
        </ToolbarButton>
      </div>

      <div className='rich-text-toolbar-group' role='group' aria-label='Định dạng chữ'>
        <ToolbarButton
          label='In đậm'
          isToggle
          isActive={resolvedState?.isBold}
          disabled={isUnavailable || !editor?.can().chain().focus().toggleBold().run()}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          label='In nghiêng'
          isToggle
          isActive={resolvedState?.isItalic}
          disabled={isUnavailable || !editor?.can().chain().focus().toggleItalic().run()}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolbarButton>
      </div>

      <div className='rich-text-toolbar-group' role='group' aria-label='Danh sách và trích dẫn'>
        <ToolbarButton
          label='Danh sách dấu đầu dòng'
          isToggle
          isActive={resolvedState?.isBulletList}
          disabled={isUnavailable}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          • DS
        </ToolbarButton>
        <ToolbarButton
          label='Danh sách đánh số'
          isToggle
          isActive={resolvedState?.isOrderedList}
          disabled={isUnavailable}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          1. DS
        </ToolbarButton>
        <ToolbarButton
          label='Trích dẫn'
          isToggle
          isActive={resolvedState?.isBlockquote}
          disabled={isUnavailable}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          “ ”
        </ToolbarButton>
      </div>

      <div className='rich-text-toolbar-group' role='group' aria-label='Chèn nội dung'>
        <ToolbarButton
          label={resolvedState?.isLink ? 'Gỡ liên kết' : 'Chèn liên kết'}
          isToggle
          isActive={resolvedState?.isLink}
          disabled={isUnavailable}
          onClick={() => {
            if (resolvedState?.isLink) {
              editor?.chain().focus().unsetLink().run();
              return;
            }
            onOpenLink();
          }}
        >
          Liên kết
        </ToolbarButton>
        <ToolbarButton label='Chèn hình ảnh từ URL' disabled={isUnavailable} onClick={onOpenImage}>
          Ảnh
        </ToolbarButton>
        <ToolbarButton
          label='Chèn đường phân cách'
          disabled={isUnavailable}
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        >
          —
        </ToolbarButton>
      </div>

      <div className='rich-text-toolbar-group' role='group' aria-label='Lịch sử chỉnh sửa'>
        <ToolbarButton
          label='Hoàn tác'
          disabled={isUnavailable || !resolvedState?.canUndo}
          onClick={() => editor?.chain().focus().undo().run()}
        >
          ↶
        </ToolbarButton>
        <ToolbarButton
          label='Làm lại'
          disabled={isUnavailable || !resolvedState?.canRedo}
          onClick={() => editor?.chain().focus().redo().run()}
        >
          ↷
        </ToolbarButton>
      </div>
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  labelId,
  descriptionIds,
  maxLength,
  required = false,
}: Readonly<RichTextEditorProps>) {
  const editorId = useId();
  const linkTextId = useId();
  const linkUrlId = useId();
  const imageUrlId = useId();
  const imageAltId = useId();
  const [insertPanel, setInsertPanel] = useState<InsertPanel>(null);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [panelError, setPanelError] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        code: false,
        codeBlock: false,
        heading: {levels: [2, 3]},
        link: {
          autolink: false,
          linkOnPaste: false,
          openOnClick: false,
          protocols: ['http', 'https'],
          isAllowedUri: (url) => normalizeSafeHttpUrl(url) !== null,
        },
        strike: false,
        trailingNode: false,
        underline: false,
      }),
      Image.configure({
        allowBase64: false,
      }),
      Figure,
      Figcaption,
    ],
    content: value,
    editorProps: {
      attributes: {
        id: editorId,
        role: 'textbox',
        'aria-labelledby': labelId,
        'aria-describedby': descriptionIds,
        'aria-multiline': 'true',
        'aria-required': required ? 'true' : 'false',
        class: 'rich-text-editor-content',
      },
      transformPastedHTML: (html) => sanitizeRichHtml(html),
    },
    onUpdate: ({editor: updatedEditor}) => {
      onChange(updatedEditor.isEmpty ? '' : updatedEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentValue = editor.isEmpty ? '' : editor.getHTML();
    if (value !== currentValue) {
      editor.commands.setContent(value, {emitUpdate: false});
    }
  }, [editor, value]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.view.dom.setAttribute('aria-invalid', value.length > maxLength ? 'true' : 'false');
  }, [editor, maxLength, value.length]);

  const closeInsertPanel = (): void => {
    setInsertPanel(null);
    setPanelError(null);
  };

  const handleOpenLink = (): void => {
    if (!editor) {
      return;
    }

    const {from, to} = editor.state.selection;
    setLinkText(editor.state.doc.textBetween(from, to, ' '));
    setLinkUrl('');
    setPanelError(null);
    setInsertPanel('link');
  };

  const handleInsertLink = (): void => {
    if (!editor) {
      return;
    }

    const safeUrl = normalizeSafeHttpUrl(linkUrl);
    if (!linkText.trim()) {
      setPanelError('Nhập văn bản sẽ hiển thị cho liên kết.');
      return;
    }
    if (!safeUrl) {
      setPanelError('Liên kết phải bắt đầu bằng http:// hoặc https://.');
      return;
    }

    editor
      .chain()
      .focus()
      .insertContent({
        type: 'text',
        text: linkText.trim(),
        marks: [{type: 'link', attrs: {href: safeUrl}}],
      })
      .run();
    setLinkText('');
    setLinkUrl('');
    closeInsertPanel();
  };

  const handleInsertImage = (): void => {
    if (!editor) {
      return;
    }

    const safeUrl = normalizeSafeHttpUrl(imageUrl);
    if (!safeUrl) {
      setPanelError('Địa chỉ ảnh phải bắt đầu bằng http:// hoặc https://.');
      return;
    }
    if (!imageAlt.trim()) {
      setPanelError('Nhập mô tả thay thế để người đọc hiểu nội dung ảnh.');
      return;
    }

    editor.chain().focus().setImage({src: safeUrl, alt: imageAlt.trim()}).run();
    setImageUrl('');
    setImageAlt('');
    closeInsertPanel();
  };

  return (
    <div className='rich-text-editor' data-over-limit={value.length > maxLength ? 'true' : undefined}>
      <RichTextToolbar
        editor={editor}
        onOpenLink={handleOpenLink}
        onOpenImage={() => {
          setImageUrl('');
          setImageAlt('');
          setPanelError(null);
          setInsertPanel('image');
        }}
      />

      {insertPanel ? (
        <div
          className='rich-text-insert-panel'
          role='group'
          aria-label={insertPanel === 'link' ? 'Chèn liên kết' : 'Chèn hình ảnh'}
        >
          {insertPanel === 'link' ? (
            <>
              <div>
                <label className='field-label' htmlFor={linkTextId}>Văn bản hiển thị</label>
                <input
                  id={linkTextId}
                  className='field-control'
                  autoFocus
                  value={linkText}
                  onChange={(event) => setLinkText(event.target.value)}
                />
              </div>
              <div>
                <label className='field-label' htmlFor={linkUrlId}>Địa chỉ liên kết</label>
                <input
                  id={linkUrlId}
                  className='field-control'
                  type='url'
                  inputMode='url'
                  placeholder='https://example.com'
                  value={linkUrl}
                  onChange={(event) => setLinkUrl(event.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className='field-label' htmlFor={imageUrlId}>Địa chỉ hình ảnh</label>
                <input
                  id={imageUrlId}
                  className='field-control'
                  autoFocus
                  type='url'
                  inputMode='url'
                  placeholder='https://example.com/anh.jpg'
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                />
              </div>
              <div>
                <label className='field-label' htmlFor={imageAltId}>Mô tả thay thế</label>
                <input
                  id={imageAltId}
                  className='field-control'
                  value={imageAlt}
                  onChange={(event) => setImageAlt(event.target.value)}
                />
              </div>
            </>
          )}
          {panelError ? <p className='rich-text-insert-error' role='alert'>{panelError}</p> : null}
          <div className='flex flex-wrap gap-2'>
            <button
              type='button'
              className='button-primary'
              onClick={insertPanel === 'link' ? handleInsertLink : handleInsertImage}
            >
              Chèn
            </button>
            <button type='button' className='button-secondary' onClick={closeInsertPanel}>
              Hủy
            </button>
          </div>
        </div>
      ) : null}

      <EditorContent editor={editor} />
    </div>
  );
}
