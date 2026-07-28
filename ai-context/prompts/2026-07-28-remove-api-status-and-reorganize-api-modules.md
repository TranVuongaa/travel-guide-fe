---
id: "2026-07-28-remove-api-status-and-reorganize-api-modules"
status: completed
created_at: "2026-07-28T22:21:15+07:00"
confirmed_at: "2026-07-28T22:30:58+07:00"
completed_at: "2026-07-28T22:38:24+07:00"
---

# Goal

Remove the public API-check/status feature and reorganize API integration so `lib/api/` groups the shared Axios
transport infrastructure, while domain-specific API services live under `lib/feature/`.

# Skills read

- None. The user did not request a project skill, and the approved workflow does not require one for this request.

# Existing code inspected

- `ai-context/project-overview.md`
- `ai-context/ai-workflow-rules.md`
- `ai-context/prompts/2026-07-28-implement-travel-guide-api-features.md`
- `config/routes.ts`
- `components/layout/AppHeader.tsx`
- `components/layout/AppFooter.tsx`
- `app/(public)/status/page.tsx`
- `app/(public)/status/_components/StatusPanel.tsx`
- All modules and tests under `lib/api/`
- All TypeScript imports of `@/lib/api/*` across `app/`, `components/`, `lib/`, `store/`, and `utils/`
- Current `git status`

# Files likely to change

- Remove the API status feature:
  - `app/(public)/status/page.tsx`
  - `app/(public)/status/_components/StatusPanel.tsx`
  - `lib/api/health.ts`
  - `config/routes.ts`
  - `components/layout/AppHeader.tsx`
  - `components/layout/AppFooter.tsx`
- Retain Axios infrastructure under `lib/api/`:
  - `lib/api/client.ts`
  - `lib/api/errors.ts`
  - `lib/api/errors.test.ts`
  - `lib/api/response.ts`
  - `lib/api/response.test.ts`
- Move domain services under `lib/feature/`:
  - `lib/feature/auth/api.ts`
  - `lib/feature/users/api.ts`
  - `lib/feature/provinces/api.ts`
  - `lib/feature/categories/api.ts`
  - `lib/feature/places/api.ts`
  - `lib/feature/posts/api.ts`
  - `lib/feature/reviews/api.ts`
  - `lib/feature/comments/api.ts`
  - `lib/feature/reactions/api.ts`
- Move shared API/domain contracts:
  - `types/api.ts`
- Remove superseded domain modules:
  - `lib/api/auth.ts`
  - `lib/api/users.ts`
  - `lib/api/provinces.ts`
  - `lib/api/categories.ts`
  - `lib/api/places.ts`
  - `lib/api/posts.ts`
  - `lib/api/reviews.ts`
  - `lib/api/comments.ts`
  - `lib/api/reactions.ts`
  - `lib/api/contracts.ts`
  - `lib/api/endpoints.ts`
- Update affected imports in:
  - `app/`
  - `components/`
  - `lib/auth/`
  - `store/`
  - `utils/`
- Synchronize architecture documentation:
  - `ai-context/project-overview.md`
  - `ai-context/architecture-context.md`
  - `ai-context/code-standards.md`
  - this prompt

# Decisions / assumptions

- “Remove tab check API” means remove the complete `/status` product feature, not merely hide its header tab:
  navigation and footer links, route configuration, page/components, and the health-check service are removed.
- `lib/api/` groups the shared Axios instance/interceptors, response-envelope handling, and application/API error
  normalization together.
- Domain endpoint constants and service functions are colocated in `lib/feature/<domain>/api.ts`.
- Shared API contracts move to `types/api.ts` because several domains and UI surfaces reuse them.
- Do not introduce a top-level `features/` directory. The existing rule against top-level features remains in force;
  the new domain boundary is `lib/feature/`.
- This is a structural refactor. Except for removal of the status feature, API request paths, payloads, response
  handling, authentication refresh behavior, exported service names, and user-visible behavior remain unchanged.
- Existing uncommitted changes in `ai-context/architecture-context.md`, `components/layout/AppHeader.tsx`, feature
  components, the debounce prompt, and `hooks/` are user-owned work. Preserve them and make only the minimal
  overlapping edits needed for this request.
- Do not create barrel files unless they materially simplify imports without introducing cycles.

# Open questions

- None for execution. Confirmation of this prompt confirms both the complete removal of `/status` and the new
  `lib/feature/` architecture described above.

# Implementation requirements

- Delete the `/status` route and all UI links to it.
- Remove `routes.status` and ensure no stale route reference remains.
- Remove the health service and health endpoint because no remaining feature consumes them.
- Keep `lib/api/client.ts` as the single Axios instance and interceptor owner.
- Keep API response-envelope narrowing and Axios/application error normalization in `lib/api/`.
- Move each remaining domain service to its matching `lib/feature/<domain>/` folder without changing its public
  function names or runtime behavior.
- Colocate each domain's endpoint paths with that domain service. Keep the refresh endpoint available to the Axios
  client without creating a dependency from transport infrastructure back into a feature module.
- Move shared request/response/domain types to `types/api.ts` and update all type-only imports.
- Update every affected import; no compatibility re-export should remain under the old `lib/api/<domain>` paths.
- Preserve strict TypeScript, browser-side Axios, Redux auth behavior, abort signals, and frontend-only architecture.
- Do not add dependencies, Next.js backend code, JavaScript/JSX application files, or unrelated formatting changes.

# API contract and external backend dependencies

- All existing API contracts and endpoints remain unchanged except that `GET /api` is no longer called or exposed by
  the frontend.
- `NEXT_PUBLIC_API_BASE_URL` remains the Axios base URL.
- Bearer attachment, single-flight refresh, retry-once behavior, in-memory credentials, and credential clearing remain
  unchanged.
- The independent backend remains responsible for authentication, authorization, persistence, and all domain data.

# Security requirements

- Do not persist or log tokens, passwords, authorization codes, PKCE values, or authorization headers.
- Preserve the current in-memory credential store and refresh-loop prevention.
- Do not move backend behavior into Next.js.
- Removing the status page must not expose the configured API URL anywhere else in the UI.

# Accessibility requirements

- Removing the status navigation item must preserve valid navigation landmarks, keyboard access, focus visibility, and
  responsive overflow behavior.
- Do not leave empty containers, broken accessible names, or links to a removed route.
- No other interaction semantics may regress during the import-only refactor.

# Visual interpretation

Remove the API status entry cleanly from the existing editorial navigation and footer. No replacement visual element
is required, and all remaining brand styling stays unchanged.

# Layout

- Preserve the current header and footer layout after removing the status links.
- Ensure remaining navigation links still wrap or scroll correctly at supported widths.

# Typography

- No typography changes.

# Spacing

- Preserve existing spacing tokens and gaps; allow the remaining navigation items to occupy the freed space naturally.

# Colors

- No color changes.

# Interaction states

- Preserve hover, focus-visible, active, disabled, and responsive navigation behavior for all remaining links.

# Responsiveness

- Verify the header and footer at 320px, 768px, 1280px, and 1440px after removing the link.

# Accessibility

- Preserve semantic header, navigation, main, and footer landmarks.
- Verify keyboard navigation order no longer contains the removed status destination.

# Pixel-perfect expectations

- The header and footer should look identical to the current design except for the absence of the API status links.
- The structural service refactor must not cause any UI changes elsewhere.

# Acceptance criteria

- No header tab, footer link, route constant, App Router page, component, or service for API status/checking remains.
- `/status` is absent from the production route output and resolves through the application's normal not-found
  behavior.
- `lib/api/` contains only Axios/transport-level client, error, response modules, and their tests.
- Domain API service functions live under `lib/feature/<domain>/api.ts`.
- Shared API contracts live at `types/api.ts`.
- No production or test import references a removed `@/lib/api/<domain>`, `@/lib/api/contracts`, or
  `@/lib/api/endpoints` module.
- Existing domain service behavior and auth refresh behavior remain unchanged.
- Architecture documentation describes `lib/feature/` as the domain-service boundary while continuing to prohibit a
  top-level `features/` directory.
- All required checks pass, or exact blockers are reported.

# Checks to run

```powershell
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

Also run:

```powershell
rg -n "routes\.status|/status|Trạng thái API|getHealthService|endpoints\.health" app components config lib store types utils
rg -n "@/lib/api/(auth|users|provinces|categories|places|posts|reviews|comments|reactions|contracts|endpoints)" app components config lib store types utils
Get-ChildItem lib/api -File | Select-Object -ExpandProperty Name
rg --files app components config lib store types utils | rg "\.(js|jsx)$"
Test-Path app/api
```

# Manual testing steps

1. Run `npm run dev`.
2. At 320px, 768px, 1280px, and 1440px, verify the header no longer shows “Trạng thái API” and the footer no longer
   shows “API”.
3. Navigate directly to `/status` and verify the normal not-found experience appears.
4. Browse destinations and stories, then open one detail page; verify their existing API-backed loading, success,
   empty, and error states behave as before.
5. If a disposable non-production account is available, sign in and verify profile loading plus one authenticated
   list request to exercise bearer attachment.
6. Verify keyboard focus order in header and footer skips the removed link and remains visible.
