---
id: "2026-07-28-suppress-root-hydration-warning"
status: in-progress
created_at: "2026-07-28T20:36:10+07:00"
confirmed_at: "2026-07-28T20:36:10+07:00"
completed_at: null
---

# Goal

Suppress root-level hydration attribute warnings in the application layout, as explicitly requested by the user.
The user instructed the agent to implement without a separate confirmation round.

# Skills read

- None.

# Existing code inspected

- `ai-context/project-overview.md`
- `ai-context/ai-workflow-rules.md`
- `app/layout.tsx`
- `app/page.tsx`

# Files likely to change

- `app/layout.tsx`

# Decisions / assumptions

- Add `suppressHydrationWarning` to both `<html>` and `<body>` because browser extensions may inject attributes into
  either root element.
- Do not change rendering, design, content, routing, or state.

# Open questions

- The exact mismatched attribute was not provided, so this intentionally suppresses root attribute mismatches rather
  than correcting a confirmed application-generated mismatch.

# Implementation requirements

- Use React's `suppressHydrationWarning` prop on the root HTML and body elements.
- Do not add Client Components or runtime logic.

# API contract and external backend dependencies

- None.

# Security requirements

- Do not introduce scripts, raw HTML, or external runtime content.

# Accessibility requirements

- Preserve the existing document language, semantics, and accessible page structure.

# Acceptance criteria

- Both root elements opt into hydration warning suppression.
- Existing metadata, fonts, content, and styles remain unchanged.
- Lint, typecheck, and build pass.

# Checks to run

- `npm run lint`
- `npm run typecheck`
- `npm run build`

# Manual testing steps

1. Run `npm run dev`.
2. Load `/` in the browser where the root-attribute warning was observed.
3. Confirm the warning no longer appears for attributes injected on `<html>` or `<body>`.

# Visual interpretation

- No visual change.

# Layout

- No layout change.

# Typography

- No typography change.

# Spacing

- No spacing change.

# Colors

- No color change.

# Interaction states

- No interaction change.

# Responsiveness

- No responsive change.

# Accessibility

- Existing accessibility behavior remains unchanged.

# Pixel-perfect expectations

- The rendered page must be visually identical.
