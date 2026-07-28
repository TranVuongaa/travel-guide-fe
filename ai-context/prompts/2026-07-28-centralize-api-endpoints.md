---
id: "2026-07-28-centralize-api-endpoints"
status: completed
created_at: "2026-07-28T22:41:04+07:00"
confirmed_at: "2026-07-28T22:52:52+07:00"
completed_at: "2026-07-28T22:58:47+07:00"
---

# Goal

Centralize every external API endpoint path and dynamic endpoint builder in one shared TypeScript module while
keeping Axios transport infrastructure and domain service functions in their current architectural boundaries.

# Skills read

- None. The user did not request a project skill, and the approved workflow does not require one for this structural
  refactor.

# Existing code inspected

- `ai-context/project-overview.md`
- `ai-context/ai-workflow-rules.md`
- `ai-context/prompts/2026-07-28-remove-api-status-and-reorganize-api-modules.md`
- `package.json`
- `lib/api/client.ts`
- All `lib/feature/<domain>/api.ts` modules
- All `/api/v1` endpoint literals and local `endpoints` declarations under `lib/`
- Current `git status`

# Files likely to change

- Add the single shared endpoint registry:
  - `lib/api/endpoints.ts`
- Update endpoint consumers:
  - `lib/api/client.ts`
  - `lib/feature/auth/api.ts`
  - `lib/feature/users/api.ts`
  - `lib/feature/provinces/api.ts`
  - `lib/feature/categories/api.ts`
  - `lib/feature/places/api.ts`
  - `lib/feature/posts/api.ts`
  - `lib/feature/reviews/api.ts`
  - `lib/feature/comments/api.ts`
  - `lib/feature/reactions/api.ts`
- Add focused endpoint-registry coverage if needed:
  - `lib/api/endpoints.test.ts`
- Synchronize architecture documentation:
  - `ai-context/project-overview.md`
  - `ai-context/architecture-context.md`
  - `ai-context/code-standards.md`
  - this prompt

# Decisions / assumptions

- “Các endpoints sẽ tổ chức để chung 1 file” means all external API path constants and parameterized path builders
  will live in `lib/api/endpoints.ts`.
- Domain service implementations remain split across `lib/feature/<domain>/api.ts`; this request does not combine all
  API request functions into one file.
- The shared registry will be grouped by domain under one exported, immutable object so callers retain clear ownership
  such as auth, users, places, posts, reviews, comments, reactions, provinces, and categories.
- Dynamic path builders continue to apply `encodeURIComponent` to every path parameter.
- `lib/api/client.ts` and `lib/feature/auth/api.ts` will consume the same shared auth refresh endpoint, removing the
  current duplicate literal without creating a dependency from transport infrastructure into a feature module.
- This explicitly supersedes the earlier decision to colocate endpoint constants inside each domain service. The
  service boundary itself remains unchanged.
- Request methods, paths, payloads, response handling, exported service names, and runtime behavior remain unchanged.
- No barrel file or new dependency is required.

# Open questions

- None. Confirmation approves `lib/api/endpoints.ts` as the one endpoint registry and retains domain service files.

# Implementation requirements

- Create one typed, read-only endpoint registry in `lib/api/endpoints.ts`.
- Move all current static `/api/v1/...` strings and dynamic builders from `lib/api/client.ts` and every
  `lib/feature/<domain>/api.ts` module into that registry.
- Organize registry keys by domain and use descriptive member names.
- Import the shared registry in every consumer and remove each local `endpoints` object plus `REFRESH_ENDPOINT`.
- Preserve URL encoding for IDs, provider names, and other dynamic path segments.
- Ensure the Axios refresh interceptor and auth refresh service reference the same registry member.
- Do not change service signatures, HTTP methods, query parameters, request bodies, response types, token behavior, or
  abort-signal behavior.
- Keep application source in strict TypeScript and preserve the frontend-only architecture.
- Do not add Next.js backend code, dependencies, compatibility modules, or unrelated formatting changes.

# API contract and external backend dependencies

- The external API base URL remains configured by `NEXT_PUBLIC_API_BASE_URL`.
- Every existing endpoint remains byte-for-byte equivalent for the same input:
  - authentication registration, login, Google OAuth, refresh, logout, and logout-all;
  - current/admin users, roles, status, and OAuth linking;
  - provinces and categories;
  - places and place reviews;
  - posts and current-user posts;
  - current-user and individual reviews;
  - comments;
  - reactions and reaction summaries.
- The independent backend remains responsible for authentication, authorization, persistence, validation, and domain
  behavior.

# Security requirements

- Preserve `encodeURIComponent` on all dynamic path segments to prevent malformed paths or path-segment injection.
- Do not persist or log tokens, passwords, authorization codes, refresh tokens, PKCE values, or authorization headers.
- Preserve refresh-loop prevention, retry-once behavior, single-flight refresh, and in-memory credentials.
- Do not move backend behavior or secrets into Next.js.

# Accessibility requirements

- This refactor has no intended UI or interaction changes.
- Existing keyboard behavior, focus states, accessible names, loading announcements, and error presentation must remain
  unchanged.

# Visual interpretation

No visual change. This is an internal API-configuration refactor only.

# Layout

- No layout changes.

# Typography

- No typography changes.

# Spacing

- No spacing changes.

# Colors

- No color changes.

# Interaction states

- Preserve all existing loading, success, empty, error, disabled, hover, focus-visible, and authenticated states.

# Responsiveness

- No responsive behavior changes.

# Accessibility

- No semantic or accessible interaction changes.

# Pixel-perfect expectations

- Every rendered route must remain visually identical before and after the refactor.

# Acceptance criteria

- `lib/api/endpoints.ts` is the only application module that declares external API path strings and endpoint builders.
- The registry contains all endpoint groups currently used by auth, users, provinces, categories, places, posts,
  reviews, comments, and reactions.
- `lib/api/client.ts` and all domain services import and use the shared registry.
- No local `const endpoints` or `REFRESH_ENDPOINT` declaration remains in endpoint consumers.
- Dynamic endpoint builders still encode each path segment and produce the same URLs as before.
- Domain service locations, exports, request behavior, and UI behavior remain unchanged.
- Architecture documentation records the centralized endpoint registry and no longer says domain endpoint constants
  are colocated with each service.
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
rg -n "const endpoints|REFRESH_ENDPOINT|['``]/api/v1" lib --glob "*.ts"
rg -n "API_ENDPOINTS" lib/api/client.ts lib/feature --glob "*.ts"
rg --files app components config lib store types utils | rg "\.(js|jsx)$"
Test-Path app/api
```

# Manual testing steps

1. Run `npm run dev`.
2. Browse the destinations and stories lists, then open one detail page; verify requests load as before.
3. If a disposable non-production account is available, register or sign in and verify the auth request succeeds.
4. Reload one protected view during an expired-access-token scenario, if it can be safely reproduced, and verify the
   refresh request still retries the original request once.
5. Exercise one route that uses a dynamic ID and verify the requested URL matches the pre-refactor path.
6. Confirm there are no visual, responsive, keyboard, or screen-reader-facing changes.
