---
id: "2026-07-29-reduce-destination-title-size"
status: completed
created_at: "2026-07-29T18:37:58+07:00"
confirmed_at: "2026-07-29T18:39:53+07:00"
completed_at: "2026-07-29T18:41:22+07:00"
---

# Goal

Reduce the oversized destination-detail page title so long Vietnamese place names remain prominent without dominating
the viewport or pushing the primary image excessively far below the fold.

# Skills read

- None. No project skill was explicitly requested or required for this small typography adjustment.

# Existing code inspected

- `app/(public)/destinations/[id]/_components/DestinationDetail.tsx`
- `app/(public)/destinations/[id]/_components/DestinationDetail.test.tsx`
- `app/globals.css` typography and spacing token declarations located by repository search

# Files likely to change

- `app/(public)/destinations/[id]/_components/DestinationDetail.tsx`
- `ai-context/prompts/2026-07-29-reduce-destination-title-size.md`

# Decisions / assumptions

- The reported oversized text is the level-one destination name shown in the supplied desktop screenshot.
- Preserve the current serif display font, weight, letter spacing, content width, and overall editorial direction.
- Change the responsive font clamp from `clamp(3.5rem,10vw,8rem)` to `clamp(2.75rem,7vw,6rem)`.
- Increase the tight line-height from `0.85` to `0.9` so wrapped Vietnamese diacritics and long multi-line names remain
  comfortable to scan.
- Do not alter destination data, image sizing, API behavior, page structure, or other page headings.

# Open questions

- None. The screenshot and current implementation identify a narrow typography defect with a low-risk responsive fix.

# Implementation requirements

- Update only the destination-detail `h1` responsive font size and line height.
- Keep the heading semantic level, content, font family, font weight, tracking, and maximum width unchanged.
- Avoid new dependencies or shared abstractions for this one-off adjustment.

# API contract and external backend dependencies

- No API contract changes.
- No external backend dependency changes.

# Security requirements

- Preserve the existing rendering and sanitization paths.
- Do not introduce new HTML injection points or data handling.

# Accessibility requirements

- Preserve the semantic `h1`.
- Keep the text responsive to browser zoom and user font scaling by using `rem` and viewport-aware `clamp()`.
- Ensure the reduced size does not make the title smaller than 2.75rem at narrow viewports.
- Preserve visible contrast and avoid clipping Vietnamese diacritics.

# Acceptance criteria

- The destination name uses `clamp(2.75rem,7vw,6rem)` on the detail page.
- The title line-height is `0.9`.
- At large desktop widths, the destination title is capped at 96px instead of 128px.
- Long destination names occupy fewer vertical lines or less vertical space than before.
- Mobile headings remain visually prominent and do not overflow horizontally.
- Existing destination-detail behavior and tests remain intact.

# Checks to run

- `npm run lint`
- `npm run typecheck`
- `npm test -- --run "app/(public)/destinations/[id]/_components/DestinationDetail.test.tsx"`
- `npm run build`

# Manual testing steps

1. Run the application and open a destination detail page with a long name.
2. At a desktop viewport near 1738px wide, confirm the heading is clearly smaller than in the supplied screenshot and
   the primary image appears sooner.
3. Test around 1440px, 1024px, 768px, and 375px widths.
4. Confirm the title wraps naturally, Vietnamese diacritics are not clipped, and no horizontal scrollbar appears.
5. Zoom the page to 200% and confirm the title remains readable and structurally correct.

# UI specification

## Visual interpretation

The current 128px maximum display size overpowers the page and turns a long destination name into a large block that
pushes the media below the fold. The intended result remains expressive and editorial, but with a calmer hierarchy
that lets the destination image participate in the initial viewport.

## Layout

- Keep the existing `max-w-5xl` title measure and document flow.
- Do not reposition the eyebrow, heading, or image.

## Typography

- Display family: unchanged.
- Weight: unchanged at semibold.
- Responsive size: `clamp(2.75rem,7vw,6rem)`.
- Line-height: `0.9`.
- Tracking: unchanged at `-0.055em`.

## Spacing

- Keep the existing top margins and image gap.

## Colors

- No color changes.

## Interaction states

- No interactive-state changes.

## Responsiveness

- The title scales fluidly from 44px to 96px.
- The smaller viewport coefficient reduces aggressive growth across tablet and desktop widths.
- Wrapping must remain natural at all supported viewport sizes.

## Accessibility

- Retain semantic heading structure and scalable CSS units.
- Preserve text contrast, browser zoom behavior, and full title visibility.

## Pixel-perfect expectations

- Match the existing page composition except for the destination-title scale and line-height.
- At the screenshot's desktop width, the title must cap at 96px and consume visibly less vertical space.
