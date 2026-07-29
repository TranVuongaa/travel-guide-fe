---
id: "add-admin-travel-content-ingestion"
status: completed
created_at: "2026-07-29T12:45:04+07:00"
confirmed_at: "2026-07-29T12:47:08+07:00"
completed_at: "2026-07-29T12:52:56+07:00"
---

# Goal

Add an administrator-only frontend flow that lets an `ADMIN` explicitly queue the backend travel-content scraping
job exposed by `POST /api/v1/admin/travel-content-ingestions`, then presents the accepted run snapshot and its
metrics in Vietnamese.

# Skills read

- None. The user did not request a project skill, and the repository workflow does not require one for this feature.

# Existing code inspected

- `ai-context/project-overview.md`
- `ai-context/ai-workflow-rules.md`
- Live OpenAPI document at `http://52.62.25.92/api/docs-json`
- `config/routes.ts`
- `app/(admin)/layout.tsx`
- `app/(admin)/admin/users/page.tsx`
- `app/(admin)/admin/users/_components/UsersAdmin.tsx`
- `app/(admin)/admin/_components/TaxonomyManager.tsx`
- `components/layout/AppHeader.tsx`
- `components/ui/AsyncState.tsx`
- `components/ui/ConfirmButton.tsx`
- `components/ui/ConfirmButton.test.tsx`
- `lib/api/endpoints.ts`
- `lib/api/endpoints.test.ts`
- `lib/api/errors.ts`
- `lib/api/response.ts`
- `lib/feature/users/api.ts`
- `types/api.ts`
- `package.json`

# Files likely to change

- `ai-context/prompts/2026-07-29-add-admin-travel-content-ingestion.md`
- `ai-context/project-overview.md`
- `config/routes.ts`
- `app/(admin)/layout.tsx`
- `app/(admin)/admin/travel-content-ingestions/page.tsx` (new)
- `app/(admin)/admin/travel-content-ingestions/_components/TravelContentIngestionAdmin.tsx` (new)
- `app/(admin)/admin/travel-content-ingestions/_components/TravelContentIngestionAdmin.test.tsx` (new)
- `lib/api/endpoints.ts`
- `lib/api/endpoints.test.ts`
- `lib/feature/travel-content-ingestions/api.ts` (new)
- `types/api.ts`

# Decisions / assumptions

- Add the admin route `/admin/travel-content-ingestions` and expose it in the existing admin sidebar.
- Keep authorization consistent with other admin routes: the shared `app/(admin)/layout.tsx` `AuthGuard` limits the
  page to `ADMIN`, while the backend remains authoritative.
- The endpoint has no request body. The UI therefore exposes one action only: queue a run.
- Because queueing a scraper can consume external resources, require an explicit confirmation before sending the
  request and disable repeat submission while it is pending.
- After an HTTP `202`, display the returned run ID, status, timestamps, counters, and error summary when present.
- Keep the returned run only in route-local component state. Do not add Redux state or browser persistence.
- A `409` response is presented as an active-run conflict with specific Vietnamese guidance. Other failures use the
  shared API error normalization.
- The frontend does not claim that the accepted snapshot updates in real time. It clearly explains that the backend
  contract currently provides queue acceptance only.
- Existing unrelated worktree changes are preserved and not rewritten.

# Open questions

- The live OpenAPI currently exposes only `POST /api/v1/admin/travel-content-ingestions`; it does not expose a run
  detail, current-run, history, cancellation, retry, or streaming endpoint. Consequently this increment cannot poll
  progress or show final results after the accepted response.
- The OpenAPI schema defines nullable `startedAt` and `completedAt` as date-time values with an imprecise generated
  `object` type. The frontend will interpret non-null values as ISO date-time strings, consistent with `createdAt`.
- `errorSummary` is declared only as a nullable object, without a stable field schema. The UI will render it safely as
  generic structured diagnostic data and will not assume specific keys.
- Privileged live verification requires an `ADMIN` account and a non-production environment where triggering the
  scraper is acceptable.

# Implementation requirements

- Register the endpoint once in `API_ENDPOINTS`.
- Add strict TypeScript contracts for ingestion status and the accepted run snapshot.
- Add a feature-local Axios service that calls the endpoint through the existing authenticated browser client and
  unwraps the standard API envelope.
- Add the route constant, admin sidebar link, page metadata, page, client component, and deterministic component
  tests.
- Show explanatory copy before the action so the administrator understands that the job is asynchronous.
- Require confirmation, expose an in-progress state, prevent duplicate client submissions, and restore the action
  after success or error.
- Present all returned counters: trend keywords, discovered URLs, imported posts, duplicates, skipped items, and
  failures.
- Present status labels for `QUEUED`, `RUNNING`, `COMPLETED`, `PARTIAL`, and `FAILED`, even though the initial
  response is normally expected to be `QUEUED`.
- Format timestamps using the project's Vietnamese date formatter where compatible.
- Show API errors with `role="alert"` and successful acceptance with an announced status region.
- Do not add a Next.js Route Handler, Server Action, secret, backend proxy, dependency, or persistent client storage.

# API contract and external backend dependencies

- Method and path: `POST /api/v1/admin/travel-content-ingestions`
- Authentication: bearer token; backend documents `401` when unauthenticated and `403` unless the user is an
  administrator.
- Request body: none.
- Success: HTTP `202` with the standard success envelope containing:
  - `id: string` (UUID)
  - `status: "QUEUED" | "RUNNING" | "COMPLETED" | "PARTIAL" | "FAILED"`
  - `trendKeywordCount: number`
  - `discoveredUrlCount: number`
  - `importedPostCount: number`
  - `duplicateCount: number`
  - `skippedCount: number`
  - `failedCount: number`
  - `errorSummary?: object | null`
  - `createdAt: string` (date-time)
  - `startedAt?: string | null`
  - `completedAt?: string | null`
- Conflict: HTTP `409` when another ingestion run is active.
- The independently deployed backend owns scraping, queue execution, concurrency enforcement, authorization, rate
  limits, fetched-content safety, and final persistence.

# Security requirements

- Send the request only through the existing authenticated Axios client; do not log or persist access/refresh tokens.
- Do not accept arbitrary URLs, selectors, commands, HTML, or scraper parameters from the browser.
- Treat `errorSummary` as untrusted data and render it only as escaped React text, never as HTML.
- Preserve both client role gating and backend authorization; do not treat the frontend guard as a security boundary.
- Avoid accidental duplicate work with confirmation, pending-state disabling, and backend `409` handling.

# Accessibility requirements

- The primary action and confirmation flow must be fully keyboard accessible and retain visible focus styles.
- The pending control must communicate its disabled/in-progress state in text.
- Acceptance feedback must use a polite live status region; errors must use an alert.
- Status and metrics must not rely on color alone.
- Use semantic headings, definition/list structures, and meaningful Vietnamese labels.
- Preserve text resizing, narrow-screen readability, and reduced-motion behavior supplied by the shared design system.

# Acceptance criteria

- An authenticated `ADMIN` can navigate to `/admin/travel-content-ingestions` from the admin sidebar.
- A non-admin remains blocked by the existing admin `AuthGuard`, and the request still depends on backend bearer
  authorization.
- Activating the action opens an explicit confirmation; cancelling sends no request.
- Confirming sends exactly one bodyless `POST` request to the registered endpoint.
- While pending, the UI prevents another request and communicates progress.
- On HTTP `202`, the page announces acceptance and displays the returned ID, status, timestamps, and all six counters.
- On HTTP `409`, the page explains that a run is already active and does not falsely report a new run.
- Other failures are normalized and exposed accessibly.
- No polling, history, cancellation, server-side code, or guessed API behavior is introduced.
- Tests cover the confirmation boundary, pending/success presentation, and conflict/error behavior without live
  network access.

# Checks to run

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

# Manual testing steps

1. Start the frontend with a valid `NEXT_PUBLIC_API_BASE_URL` and sign in as an `ADMIN`.
2. Open the admin area and verify the travel-content ingestion link is visible and opens the new page.
3. Start the action, cancel the confirmation, and verify no ingestion request is sent.
4. Start again and confirm; verify the button communicates progress and cannot be submitted twice.
5. Verify the accepted run card displays the backend response ID, status, timestamps, and all counters.
6. Trigger or simulate a second request while a backend run is active and verify the `409` guidance.
7. Verify keyboard navigation, visible focus, the confirmation dialog, screen-reader status/error announcements, and
   narrow-screen layout.
8. Sign in without `ADMIN` privileges and verify the admin guard blocks the page; independently verify the backend
   also returns `403` for an unauthorized direct request.

# Visual interpretation

Use the existing contemporary Vietnamese editorial admin language. The page should feel operational and deliberate:
clear explanation first, one prominent action, then a compact factual run snapshot. It should reuse existing tokens
and components rather than introduce a dashboard library or a new visual system.

# Layout

- Keep the existing admin two-column shell and content width.
- Use a page eyebrow and large display heading consistent with users, provinces, and categories.
- Place explanation and the queue action in a bordered surface card.
- After acceptance, show the run identity/status first and counters in a responsive grid below.
- Stack controls and metrics on small screens; expand the metrics grid at larger breakpoints.

# Typography

- Reuse `font-display` for page and section headings.
- Use the standard body face for explanation, labels, statuses, IDs, timestamps, and counters.
- Keep long IDs and structured error details wrap-safe.

# Spacing

- Reuse established `px-page`, `rounded-panel`, card padding, and `gap-*` rhythms from current admin screens.
- Maintain clear separation among explanation, action, feedback, and result details.

# Colors

- Reuse semantic design tokens only: canvas/surface/ink/line, brand/accent, success, warning, danger, and muted.
- Distinguish statuses with text labels and semantic accents without making color the only signal.

# Interaction states

- Default: action is available with concise impact copy.
- Confirmation open: focusable modal content explains that an asynchronous scraping run will be queued.
- Pending: action is disabled and text indicates the request is being queued.
- Accepted: show a success announcement and the returned run snapshot.
- Conflict: show specific warning/error copy that another run is active.
- Failure: show normalized API error copy and allow the administrator to retry.
- Focus/hover: preserve the existing shared button and focus-ring behavior.

# Responsiveness

- No horizontal scrolling should be required for the action or metrics at common phone widths.
- Long UUIDs and diagnostic text must wrap rather than force overflow.
- The existing admin sidebar remains horizontally scrollable at narrow widths and becomes vertical on large screens.

# Accessibility

- Follow the accessibility requirements above with semantic headings, labels, live feedback, and keyboard operation.
- Keep minimum interactive heights from existing shared button classes.

# Pixel-perfect expectations

- Match existing admin typography, surface borders, radii, semantic colors, and spacing tokens.
- No external design artifact was supplied; consistency with the current admin pages is the visual source of truth.
