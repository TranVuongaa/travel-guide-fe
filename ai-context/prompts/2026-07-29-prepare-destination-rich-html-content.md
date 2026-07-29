---
id: "prepare-destination-rich-html-content"
status: completed
created_at: "2026-07-29T12:20:00+07:00"
confirmed_at: "2026-07-29T12:28:45+07:00"
completed_at: "2026-07-29T12:33:27+07:00"
---

# Goal

Prepare the frontend for a future destination `content` field containing sanitized HTML, using the same rendering,
security, and editorial presentation as story content while remaining compatible with the current API responses that
do not include the field yet.

# Skills read

- None. The user did not request a project skill, and the repository workflow does not require one for this change.

# Existing code inspected

- `ai-context/project-overview.md`
- `ai-context/ai-workflow-rules.md`
- `types/api.ts`
- `lib/feature/places/api.ts`
- `app/(public)/destinations/[id]/_components/DestinationDetail.tsx`
- `app/(account)/manage/places/_components/PlaceForm.tsx`
- `app/(public)/stories/[id]/_components/StoryContent.tsx`
- `app/(public)/stories/[id]/_components/StoryContent.test.tsx`
- `app/(public)/stories/[id]/_components/StoryDetail.tsx`
- `app/(account)/account/posts/_components/PostForm.tsx`
- `app/(account)/account/posts/_components/PostForm.test.tsx`
- `app/globals.css`
- `package.json`

# Files likely to change

- `types/api.ts`
- `app/(public)/destinations/[id]/_components/DestinationDetail.tsx`
- `app/(account)/manage/places/_components/PlaceForm.tsx`
- `app/(public)/stories/[id]/_components/StoryDetail.tsx`
- `app/(public)/stories/[id]/_components/StoryContent.tsx` and its test, or their shared replacement
- A shared rich-HTML renderer under `components/`
- `app/globals.css`
- Focused destination detail and/or place form tests
- `ai-context/project-overview.md`
- This prompt file

# Decisions / assumptions

- The future destination response and mutation key will be named `content`, as specified by the user.
- Destination `content` will have the same semantics as story `content`: a complete sanitized HTML article body.
- Because the backend contract is not available yet, `Place.content` and place mutation `content` will be optional in
  the frontend contract. Existing responses without the key will continue to work.
- The management form will expose an optional destination HTML content field. Empty content will be represented as
  `undefined`, allowing JSON serialization to omit it.
- Non-empty destination content entered before backend support is deployed may be rejected or ignored by the current
  backend. This is an external dependency and cannot be resolved in the frontend.
- Destination descriptions remain required plain text and continue to serve as summaries. They are never rendered as
  HTML.
- The existing story allowlist sanitizer and renderer will be promoted to a shared content component and reused by
  both stories and destinations. No second sanitizer implementation will be introduced.
- Existing supported HTML elements, URL restrictions, attribute removal, image handling, and editorial styles remain
  unchanged unless a small naming generalization is required.
- The destination form will use the story content limit of 100,000 characters as a temporary frontend assumption
  until the destination API contract supplies its own constraint.
- No WYSIWYG editor and no Next.js backend behavior will be introduced.

# Open questions

- The backend has not yet confirmed whether destination `content` is nullable, its create/update requiredness, its
  maximum length, or whether it is returned by list endpoints as well as the detail endpoint.
- The backend has not yet confirmed that it will sanitize destination HTML using the same policy as story HTML.
- The temporary 100,000-character limit must be revisited if the future destination contract defines another value.

# Implementation requirements

- Add optional `content?: string | null` to `Place` so current API responses remain valid.
- Add optional `content?: string` to `CreatePlaceInput`; `UpdatePlaceInput` will inherit it.
- Extract/generalize the story HTML allowlist sanitizer, branded sanitized-string type, and renderer into a shared
  cross-route component.
- Keep the sanitizer behavior covered by deterministic tests, including semantic rendering and removal of scripts,
  unsafe URLs, event/style attributes, unsafe images, and embedded executable content.
- Update story detail to use the shared renderer without changing its visible behavior.
- On destination detail, sanitize and store non-empty `place.content`, then render it as an editorial HTML body after
  the plain-text description and before destination metadata/reviews.
- Do not render a content container when the key is missing, null, empty, or whitespace-only.
- Add an optional `Nội dung điểm đến (HTML)` field to the create/edit destination form.
- Populate the field when editing a destination that includes `content`.
- Submit trimmed non-empty content through the `content` key and omit empty content.
- Enforce and expose the temporary 100,000-character client limit.
- Preserve current destination images, description, address, metadata, reviews, loading, errors, routing, and role
  behavior.
- Add focused tests proving destination HTML is sanitized/rendered and/or the place form submits `content`, without
  calling the live API.

# API contract and external backend dependencies

- Current API: place responses and mutations do not yet document or expose `content`.
- Planned API key: `content`.
- Assumed planned response shape: `content?: string | null`, containing a sanitized HTML article body.
- Assumed planned mutation shape: optional `content?: string`.
- The external backend must add this key to its place response DTOs and create/update validation before end-to-end
  destination authoring can be verified.
- The external backend remains authoritative for stored-HTML sanitization. The browser allowlist pass is defense in
  depth only.
- If the final backend nullability, requiredness, length, or sanitizer contract differs, update `types/api.ts`, form
  validation, tests, and this documented contract to match it.

# Security requirements

- Only render destination `content` after it passes the shared browser-side allowlist sanitizer.
- Continue to treat the backend sanitizer as the primary security boundary once destination HTML is supported.
- Never render destination `description`, name, address, category data, form errors, reviews, or comments as HTML.
- Allow only absolute HTTP(S) image and link URLs; strip executable tags, unsafe URLs, unapproved tags, and unapproved
  attributes exactly as for stories.
- Keep `dangerouslySetInnerHTML` isolated inside the shared renderer and accept only its branded sanitized value.
- Preserve safe external-link attributes and lazy, async image behavior.
- Do not add scripts, iframes, a Next.js proxy, Route Handler, Server Action, server-side sanitizer, secrets, or
  backend persistence logic.

# Accessibility requirements

- Preserve semantic headings, paragraphs, lists, figures, captions, quotes, and emphasis from allowed HTML.
- Preserve meaningful image alt text and make images responsive.
- Keep links keyboard accessible with visible focus states.
- Associate the new form label, help text, and character count with the textarea.
- Ensure long content and links do not create horizontal scrolling at the 320 px minimum viewport.
- Do not add an empty landmark or content region when destination content is unavailable.

# Acceptance criteria

- Existing destinations without `content` still load and render exactly their current core sections.
- A destination response with non-empty HTML `content` renders semantic editorial content instead of escaped markup.
- Unsafe destination HTML is removed or neutralized by the same allowlist used for story content.
- Story detail continues to render its existing rich content using the shared implementation.
- Create/edit destination forms expose optional HTML content, populate it when present, and submit it using the
  `content` key.
- Empty destination content is omitted from the request payload.
- The form prevents more than 100,000 content characters until the backend defines another limit.
- Destination images, metadata, categories, reviews, and existing navigation remain intact.
- Strict TypeScript, lint, deterministic tests, and the production build pass.

# Checks to run

```text
npm run lint
npm run typecheck
npm run test
npm run build
```

# Manual testing steps

1. With the current API, open several `/destinations/[id]` pages and verify destinations without `content` still show
   their images, description, metadata, and reviews without an empty content block or error.
2. In a deterministic test or mocked response, supply destination `content` containing a figure, caption, paragraph,
   heading, list, link, and quote; verify semantic rendering and editorial styling.
3. Include script, event-handler, inline-style, JavaScript URL, data-image URL, and iframe payloads in mocked content;
   verify they are removed or neutralized.
4. Open a story detail page and verify its figure, caption, headings, paragraphs, links, and quotes are unchanged after
   moving to the shared renderer.
5. As `EDITOR` or `ADMIN`, open a new destination form and confirm the optional HTML field has help text and a
   100,000-character counter.
6. Open an edit form with mocked or future API data containing `content`; verify it populates and submits the trimmed
   value under the `content` key.
7. Leave destination content empty and verify the create/update request omits `content`.
8. After backend support is deployed, create or edit a destination with safe HTML, reopen its public detail page, and
   verify the stored content renders end to end.
9. At approximately 320 px, 768 px, and 1440 px widths, verify rich destination content remains readable and does not
   overflow.

# UI work

## Visual interpretation

- Treat destination `content` as long-form editorial guide material that expands on the short plain-text description.
- Reuse the established story article language so rich content feels consistent across destinations and stories.

## Layout

- Keep the existing destination hero, gallery, and metadata layout.
- Place rich content in the main reading column after the description and before address/metadata flow, without
  displacing the sidebar or reviews.
- Do not reserve space when content is absent.

## Typography

- Reuse the existing rich-content body, display heading, caption, list, and blockquote typography.
- Keep the destination description visually distinct as a plain-text summary.

## Spacing

- Preserve the existing destination section rhythm and add a clear but restrained gap before rich content.
- Reuse the story renderer's internal spacing between article elements.

## Colors

- Reuse existing semantic canvas, surface, ink, muted, line, brand, and focus tokens.
- Do not introduce hard-coded colors.

## Interaction states

- Rich-content links retain clear default, hover, and focus-visible states.
- Existing destination form saving, disabled, validation, cancel, loading, and error states remain unchanged.

## Responsiveness

- Rich images scale to the available main-column width while preserving aspect ratio.
- Captions, long text, and links wrap on narrow screens.
- The existing destination grid continues to collapse correctly on small viewports.

## Accessibility

- Retain native article semantics and meaningful image alternative text.
- Keep the optional form field fully labelled and described.
- Preserve visible focus and text-resizing behavior.

## Pixel-perfect expectations

- Match the existing story content styling and destination design tokens; do not create a second visual system.
- Exact image crops are not required. Rich-content images should remain uncropped and preserve their aspect ratio.
