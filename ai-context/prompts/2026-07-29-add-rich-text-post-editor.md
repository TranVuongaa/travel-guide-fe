---
id: "add-rich-text-post-editor"
status: completed
created_at: "2026-07-29T17:07:16+07:00"
confirmed_at: "2026-07-29T17:12:08+07:00"
completed_at: "2026-07-29T17:26:09+07:00"
---

# Goal

Replace the raw HTML textarea in the create/edit post form with an accessible Word-like rich-text editor that lets
members format an article visually while continuing to submit the API's required HTML `content` string.

# Skills read

- None. The user did not request a project skill, and the repository workflow does not require one for this change.

# Existing code inspected

- `ai-context/project-overview.md`
- `ai-context/ai-workflow-rules.md`
- `app/(account)/account/posts/_components/PostForm.tsx`
- `app/(account)/account/posts/_components/PostForm.test.tsx`
- `components/content/RichHtmlContent.tsx`
- The `.rich-content`, `.field-label`, and `.field-control` rules in `app/globals.css`
- `package.json`
- `ai-context/prompts/2026-07-29-update-posts-for-rich-html-api.md`
- Current npm metadata for Tiptap v3 packages and React 19 peer compatibility

# Files likely to change

- `package.json`
- `package-lock.json`
- `app/(account)/account/posts/_components/PostForm.tsx`
- A focused reusable rich-text editor component under `components/content/`
- Focused editor and post-form tests
- `app/globals.css`
- Relevant AI context documents if the dependency or editor architecture needs recording
- This prompt file

# Decisions / assumptions

- “Như Word” means a visual WYSIWYG editing surface with a familiar formatting toolbar; members should not need to
  write or see raw HTML during normal editing.
- Tiptap v3 will provide the client-side editor because its current packages explicitly support React 19 and can
  serialize editor state to HTML without adding backend behavior.
- The editor will be controlled through an HTML value/onChange contract so `PostForm` and the external API contract
  continue to use a string.
- Toolbar scope will match the frontend renderer's current allowlist: paragraph, heading levels 2 and 3, bold,
  italic, bullet list, numbered list, blockquote, link, horizontal rule, undo, and redo.
- The toolbar will also allow inserting an externally hosted HTTP(S) image by URL with alternative text. Local file
  upload is out of scope because no upload/storage API contract exists.
- Existing API-loaded HTML will populate the editor for post editing.
- Pasted content will be parsed through the editor schema; unsupported formatting will not be intentionally
  preserved or exposed in the toolbar.
- The raw HTML source will not be a second editable mode in this unit; the generated HTML remains an implementation
  detail sent to the API.
- This request applies only to post content. The optional destination HTML field remains unchanged.
- No Next.js backend behavior will be introduced.

# Open questions

- Image file upload needs an external backend/media-storage contract and is not included. This is non-blocking because
  safe external image URLs are already part of the article HTML contract.

# Implementation requirements

- Add the minimum Tiptap v3 packages required for React integration, starter rich-text behavior, links, and images.
- Create a client-only rich-text editor that accepts `value`, `onChange`, label/description IDs, required state, and
  maximum HTML length appropriate for the post form.
- Render a responsive toolbar with controls for paragraph, H2, H3, bold, italic, unordered list, ordered list,
  blockquote, link, external image, horizontal rule, undo, and redo.
- Show active formatting state and disable commands that cannot currently run.
- Use explicit, accessible URL-entry UI for links and external images; validate that entered destinations use
  `http:` or `https:` before inserting them.
- Keep editor state synchronized when an existing post is loaded asynchronously.
- Emit HTML through `onChange` and keep `PostForm` submission behavior and the 100,000-character API limit intact.
- Treat semantically empty editor output such as an empty paragraph as empty during required-field validation.
- Replace the “Nội dung bài viết (HTML)” raw textarea presentation with a visual “Nội dung bài viết” field and update
  helper text to describe visual formatting and safe image URLs.
- Preserve create/update payloads, draft/submit actions, loading, errors, routing, and all fields unrelated to content
  editing.
- Add deterministic tests for visual formatting-to-HTML output, asynchronous existing-content hydration, required
  empty-content validation, and post submission with generated HTML.

# API contract and external backend dependencies

- The external post create/update endpoints continue to receive `content: string`.
- `content` remains required and limited to 100,000 characters.
- The external backend remains authoritative for sanitizing stored and returned HTML.
- No endpoint exists in the confirmed project contract for uploading article images. This editor supports only
  explicitly entered external HTTP(S) image URLs.
- No API schema, route, request method, or response type changes are required.

# Security requirements

- Do not add raw HTML insertion paths outside the existing controlled post-content contract.
- Configure the editor to generate only the supported structural content; do not expose scripts, embeds, iframes,
  inline event handlers, arbitrary styles, or arbitrary HTML editing.
- Accept only absolute `http:` and `https:` URLs for links and images.
- Never treat client-side editor constraints as a replacement for backend HTML sanitization.
- Do not add remote scripts, server-only secrets, Route Handlers, Server Actions, image proxies, or upload endpoints.
- Preserve the existing browser-only Axios/external API boundary.

# Accessibility requirements

- Associate the visual editing surface with the visible “Nội dung bài viết” label and its help/count text.
- Give every toolbar control an accessible Vietnamese name and expose pressed/active state where applicable.
- Keep toolbar and editor fully keyboard reachable with visible focus styles.
- Preserve native semantic output for headings, paragraphs, lists, blockquotes, links, and horizontal rules.
- Require useful alternative text when inserting an external image.
- Do not communicate active, disabled, error, or over-limit state by color alone.
- The editor must remain usable with browser zoom and text resizing.

# Acceptance criteria

- `/account/posts/new` shows a visual rich-text editor instead of a raw HTML textarea.
- A member can apply paragraph/H2/H3, bold, italic, bullet/numbered list, blockquote, link, image URL, and divider
  formatting without typing HTML.
- Undo and redo work through toolbar controls and normal keyboard shortcuts supported by the editor.
- Formatting actions update the `content` state as semantic HTML compatible with `RichHtmlContent`.
- Editing an existing owned post visually renders and preserves its current supported HTML content.
- Link and image insertion reject non-HTTP(S) URLs, and image insertion collects alternative text.
- Visually empty content cannot be saved or submitted.
- The HTML character counter and 100,000-character limit remain visible and enforced.
- Existing title, place, description, draft, submit, loading, error, and redirect behavior remains unchanged.
- The editor toolbar wraps cleanly on narrow screens and does not introduce horizontal page scrolling.
- Strict TypeScript, lint, deterministic tests, and the production build pass.

# Checks to run

```text
npm run lint
npm run typecheck
npm run test
npm run build
```

# Manual testing steps

1. Sign in as a member and open `/account/posts/new`.
2. Enter the title and description, then use every toolbar control to create a structured article without typing HTML.
3. Insert a valid HTTPS link and verify it is represented as a link; try `javascript:` and verify it is rejected.
4. Insert a valid HTTPS image URL with meaningful alternative text; try an unsafe URL and verify it is rejected.
5. Save as a draft, reopen the edit route, and verify the formatted content loads in the editor.
6. Submit the edited post and open its public story page; verify the generated headings, emphasis, lists, quote, link,
   divider, and image render correctly.
7. Clear all editor content and verify draft/submit validation reports that content is required.
8. At approximately 320 px, 768 px, and 1440 px widths, verify the toolbar wraps, the editor stays readable, controls
   remain reachable, and no horizontal page overflow appears.
9. Navigate the toolbar and editor using only the keyboard and verify visible focus, active formatting state, and
   disabled undo/redo state.

# UI work

## Visual interpretation

- Present the field as a compact editorial writing desk: a restrained formatting toolbar above a spacious document
  canvas, visually integrated with the existing form rather than resembling a developer HTML input.

## Layout

- Keep the editor within the existing form card and content width.
- Place the toolbar directly above the editable document surface inside one bordered editor container.
- Group related controls visually while allowing the toolbar to wrap on small screens.
- Keep helper text and the live HTML character count below the editor.

## Typography

- Use the existing body font for editing text and toolbar controls.
- Reflect H2/H3 hierarchy inside the editing canvas so the author can understand the eventual article structure.
- Keep editor body size and line height comfortable for long-form Vietnamese writing.

## Spacing

- Reuse existing spacing rhythm and semantic form-control dimensions.
- Give the document canvas enough minimum height for article writing without consuming the whole viewport on mobile.
- Keep toolbar targets comfortably separated and large enough for touch.

## Colors

- Reuse the existing ink, muted, surface, line, brand, danger, and focus tokens.
- Active controls should use the established brand treatment; hover, focus, and disabled states should remain
  distinct in both light and dark user-agent contexts supported by the existing theme.

## Interaction states

- Provide default, hover, focus-visible, active/pressed, and disabled states for toolbar controls.
- Clearly report invalid link/image input near its entry UI.
- Preserve the existing saving-disabled and form-error states.

## Responsiveness

- Toolbar controls wrap to additional rows at narrow widths.
- The editable canvas, long URLs, lists, and images stay within the form width at 320 px.
- Desktop layout remains compact and does not stretch the writing measure unnecessarily.

## Accessibility

- The toolbar uses appropriate toolbar/control semantics and Vietnamese accessible names.
- Active toggle state, disabled state, validation messages, label association, focus order, and visible focus are all
  programmatically and visually available.
- The contenteditable surface has a meaningful role/name and supports native selection and keyboard editing.

## Pixel-perfect expectations

- Match the current card border, radius, semantic colors, form typography, and focus ring exactly.
- The editor may introduce purpose-built toolbar/editor styling, but it must feel native to the existing design
  system and should not bring in a third-party visual theme.
