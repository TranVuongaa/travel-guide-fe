---
id: "update-posts-for-rich-html-api"
status: completed
created_at: "2026-07-29T01:25:07+07:00"
confirmed_at: "2026-07-29T01:34:20+07:00"
completed_at: "2026-07-29T01:39:03+07:00"
---

# Goal

Update the Posts/Stories frontend for the live API's new post contract: use the new plain-text `description` for
previews and render the complete sanitized HTML `content`, including its leading `<figure>` image and caption, as an
editorial article.

# Skills read

- None. The user did not request a project skill, and the repository workflow does not require one for this change.

# Existing code inspected

- `ai-context/project-overview.md`
- `ai-context/ai-workflow-rules.md`
- `types/api.ts`
- `lib/feature/posts/api.ts`
- `app/_components/HomeFeed.tsx`
- `app/(public)/stories/_components/StoriesExplorer.tsx`
- `app/(public)/stories/[id]/_components/StoryDetail.tsx`
- `app/(account)/account/posts/_components/PostForm.tsx`
- `app/globals.css`
- `package.json`
- Existing test-file inventory
- Live OpenAPI document at `http://52.62.25.92/api/docs-json`
- A live anonymous `GET /api/v1/posts?limit=5&sortOrder=desc` response

# Files likely to change

- `types/api.ts`
- `app/_components/HomeFeed.tsx`
- `app/(public)/stories/_components/StoriesExplorer.tsx`
- `app/(public)/stories/[id]/_components/StoryDetail.tsx`
- `app/(account)/account/posts/_components/PostForm.tsx`
- A focused shared or story-local rich post content component under `components/` or
  `app/(public)/stories/[id]/_components/`
- `app/globals.css`
- Focused test files for the post content renderer and/or post form
- Relevant AI context documents if their API/security notes are affected
- This prompt file

# Decisions / assumptions

- The live OpenAPI document is the authoritative contract for this update.
- `Post.description` is required response data and is a short plain-text summary intended for previews.
- Create requests require `description`; update requests may include it. The frontend post form must therefore collect
  and submit it.
- `Post.content` is a complete HTML article body. The current live content includes `figure`, `img`, `figcaption`, `a`,
  `p`, `h2`, `ul`, `li`, `strong`, and `blockquote`.
- The API contract explicitly defines `content` as sanitized HTML. HTML rendering will be isolated to a dedicated post
  article renderer and will not be generalized to reviews, comments, or other user-authored fields.
- Story cards on the home page and story explorer will display `description`, not raw HTML and not a regex-derived
  excerpt.
- The existing plain textarea editing experience remains in scope; this request does not add a WYSIWYG editor.
- The form will explain that the article body accepts sanitized HTML and will align its limits with the API.
- No Next.js backend behavior will be introduced.

# Open questions

- None blocking. The new response and mutation contracts, length limits, and representative HTML structure were
  verified against the live OpenAPI document and public API response.

# Implementation requirements

- Add required `description: string` to `Post`.
- Add required `description: string` to `CreatePostInput` and optional `description?: string` to `UpdatePostInput`.
- Replace `post.content` with `post.description` in the home and `/stories` previews.
- Render `post.content` as semantic article HTML on `/stories/[id]` so the API-provided figure, image, caption,
  headings, paragraphs, lists, emphasis, quote, and links display correctly.
- Scope raw HTML handling to a dedicated post content component with an explicit trust-boundary comment tied to the
  backend's sanitized-HTML contract.
- Add responsive editorial styling for the supported article structure.
- Add a required description field to the create/edit post form, populate it when editing, submit it on create/update,
  and enforce the 500-character limit.
- Raise the content field limit from 20,000 to the API's 100,000 characters and make its HTML-body expectation clear.
- Preserve all existing loading, error, reaction, comment, routing, ownership, and publication-intent behavior.
- Add deterministic coverage proving that representative API HTML renders as semantic content rather than escaped
  markup, including the figure image/caption, and that preview text uses the description where practical.

# API contract and external backend dependencies

- `GET /api/v1/posts` and `GET /api/v1/posts/{id}` now return:
  - `description: string` — required, plain-text preview summary.
  - `content: string` — required, complete sanitized HTML article body.
- `POST /api/v1/posts` now requires:
  - `description: string`, maximum 500 characters.
  - `content: string`, maximum 100,000 characters, sanitized HTML article body.
- `PATCH /api/v1/posts/{id}` accepts optional `description` and `content` with the same limits.
- The external backend remains responsible for sanitizing stored and returned post HTML. The frontend must not
  attempt to implement backend sanitization or content persistence.
- Representative live content starts with a `<figure>` containing an external Wikimedia image and caption, followed
  by structured article HTML.

# Security requirements

- Render HTML only for `Post.content`, whose API contract guarantees sanitized HTML.
- Do not render `description`, titles, reviews, comments, captions from other models, or form errors as HTML.
- Keep the raw HTML insertion isolated and reviewable; do not spread `dangerouslySetInnerHTML` through list/detail
  components.
- Do not execute scripts, add remote scripts, or weaken Content Security Policy/browser protections.
- Do not add a Next.js proxy, image proxy, Route Handler, Server Action, secret, or server-side sanitizer.
- Preserve the configured HTTP API scheme and existing browser-side API boundary.

# Accessibility requirements

- Preserve the API-provided `alt` text on article images.
- Keep `figure` and `figcaption` semantics intact.
- Ensure links remain keyboard accessible and visibly distinguishable.
- Preserve native heading, paragraph, list, emphasis, and blockquote semantics.
- Images must be responsive without causing horizontal page overflow.
- Visible focus styles and text resizing must continue to work.

# Acceptance criteria

- Home and `/stories` cards show readable plain-text descriptions without literal HTML tags.
- `/stories/[id]` renders the API-provided image inside a semantic figure with its caption and source link.
- Article paragraphs, headings, lists, strong text, and blockquotes render with readable editorial spacing and
  typography instead of appearing as escaped markup.
- The article remains usable without an image if the HTML omits a figure or the external image fails.
- Create-post requests include the required description.
- Edit-post loads and updates the existing description.
- Description length is limited to 500 characters and content length to 100,000 characters in the form.
- Existing reaction and comment sections still appear after the article.
- Strict TypeScript, lint, deterministic tests, and the production build pass.

# Checks to run

```text
npm run lint
npm run typecheck
npm run test
npm run build
```

# Manual testing steps

1. Open `/` with the live API and verify each new story preview shows its description without HTML tags.
2. Open `/stories` and verify the same for the list, including search/filter/pagination behavior.
3. Open `/stories/40000000-0000-4000-8000-000000000006` and verify the Đại Nội Huế figure, image, caption, source
   link, headings, paragraphs, list, reactions, and comments render in the correct order.
4. Open other seeded posts containing `strong` and `blockquote` content and verify their rich semantics and styling.
5. At approximately 320 px, 768 px, and 1440 px widths, verify the article image, caption, long content, and links do
   not overflow or become unreadable.
6. With an authenticated member, open `/account/posts/new`, enter a description and HTML article body, then save a
   draft or submit it; verify the request succeeds.
7. Edit an existing owned post and verify its description and HTML content load, can be changed, and save correctly.
8. Verify validation prevents more than 500 description characters and more than 100,000 content characters.

# UI work

## Visual interpretation

- Treat the API figure as the article's lead editorial image and the remaining HTML as long-form travel writing.
- Keep the established contemporary Vietnamese editorial visual language; do not redesign the page shell.

## Layout

- Keep the current centered story measure.
- Let the lead figure use the available article width while preserving aspect ratio.
- Keep reactions and comments after the complete article body.

## Typography

- Use the existing display type for article subheadings and existing body type for paragraphs, lists, captions, and
  quotes.
- Preserve a comfortable long-form reading line height.

## Spacing

- Add consistent vertical rhythm between figures, captions, headings, paragraphs, lists, and blockquotes.
- Ensure the first figure integrates cleanly below the metadata without duplicated margins.

## Colors

- Reuse existing semantic tokens for ink, muted text, line, surface, brand, and focus colors.
- Do not introduce hard-coded colors that bypass the design system.

## Interaction states

- Article links need clear default, hover, and focus-visible states.
- Existing loading, error, reaction, and comment interaction states remain unchanged.

## Responsiveness

- Images scale down to the content width and retain their natural proportions.
- Captions and source links wrap cleanly on narrow screens.
- Structured content must not introduce horizontal scrolling at 320 px.

## Accessibility

- Retain semantic HTML supplied by the API and preserve meaningful image alternative text.
- Do not replace semantic article elements with decorative containers.

## Pixel-perfect expectations

- Match the existing story page's tokenized width, typography, and spacing rather than introducing a separate visual
  system.
- Exact source-image crops are not required; complete, uncropped editorial images with preserved aspect ratios are
  expected.
