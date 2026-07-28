---
id: "2026-07-28-implement-travel-guide-api-features"
status: completed
created_at: "2026-07-28T20:41:51+07:00"
confirmed_at: "2026-07-28T21:09:07+07:00"
completed_at: "2026-07-28T21:47:05+07:00"
---

# Goal

Turn the current static Vietnamese travel-guide landing page into a complete, frontend-only Next.js application
backed by the OpenAPI contract at `http://52.62.25.92/api/docs-json`.

Implement a usable UI and typed browser-side integration for 51 of the 53 documented operations. Temporarily exclude
Apple OAuth login and Apple account linking:

- `POST /api/v1/auth/oauth/apple`
- `POST /api/v1/users/me/oauth/apple`

Keep the generic provider unlink operation available for providers already attached to an account.

# Skills read

- None. The user did not request a project skill, and the approved workflow does not require one for this request.

# Existing code inspected

- `AGENTS.md`
- `ai-context/project-overview.md`
- `ai-context/ai-workflow-rules.md`
- `ai-context/architecture-context.md`
- `ai-context/code-standards.md`
- `app/page.tsx`
- `app/layout.tsx`
- `app/globals.css`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `next.config.ts`
- `eslint.config.mjs`
- `.gitignore`
- `README.md`
- Live OpenAPI document at `http://52.62.25.92/api/docs-json`
- Live public/CORS responses from:
  - `GET http://52.62.25.92/api/v1/places?limit=2`
  - `OPTIONS http://52.62.25.92/api/v1/auth/login`
  - Unauthenticated `GET http://52.62.25.92/api/v1/users/me`

The repository currently contains a polished static homepage but no Axios client, Redux store, API infrastructure,
API-backed routes, forms, or automated tests. The public places API currently returns a valid empty page. Local CORS
for `http://localhost:3000` is enabled.

# Files likely to change

- Existing application shell and configuration:
  - `app/page.tsx`, `app/layout.tsx`, `app/globals.css`
  - `package.json`, `package-lock.json`
  - `next.config.ts`
  - `tsconfig.json` only if test configuration requires an include adjustment
  - `eslint.config.mjs` only if test globals require configuration
  - `.gitignore`
  - `.env.example`
- App Router routes under the existing root `app/` directory:
  - public home, destinations, destination detail, stories, story detail, login, registration, Google callback, and
    API status
  - authenticated account profile, posts, post editor, and reviews
  - authenticated place management
  - administrator users, provinces, and categories
  - shared layouts, providers, loading/error/not-found states where route-level behavior is useful
  - route-colocated private `_components/` and `_hooks/` folders where implementation belongs to one route section
- Shared frontend infrastructure:
  - `config/`
  - `lib/api/`
  - `lib/auth/`
  - `store/`
  - `components/layout/`
  - `components/ui/`
  - `types/`
  - `utils/`
- Deterministic tests and test setup:
  - `vitest.config.ts`
  - `tests/`
  - colocated `*.test.ts` and `*.test.tsx` files for critical API, state, and interaction behavior
- AI context synchronized after implementation:
  - `ai-context/project-overview.md`
  - `ai-context/architecture-context.md` only if implementation reveals a needed clarification beyond the root
    `app/`, route-colocation, and shared-folder structure already approved
  - this prompt

The existing modified completed prompt
`ai-context/prompts/2026-07-28-suppress-root-hydration-warning.md` is user-owned work and must not be reverted or
otherwise altered by this request.

# Decisions / assumptions

- The API base URL is `http://52.62.25.92`; OpenAPI paths already contain `/api` and must not be prefixed twice.
- Vietnamese is the single UI language for this unit. Do not add a localization dependency.
- Preserve the existing `Vạn Nẻo` brand direction, crane motif, semantic Tailwind v4 tokens, and editorial visual
  language while turning the static page into an application shell.
- Keep the established App Router in the root `app/` directory. Do not migrate it to `src/app`; Next.js supports both
  conventions, and this request explicitly selects the existing root layout to avoid unrelated file churn.
- Do not create a `src/` or top-level `features/` directory. Follow current Next.js organization guidance by using
  route groups and private route folders for colocation, with root shared folders only for code reused across routes.
- Use URL search parameters for public/admin list search, filtering, sorting, and pagination.
- Public read operations do not attach or require a bearer token. Anonymous visitors can use health, province,
  category, published place, published post, published review, published comment, and reaction-summary GET operations.
- Protected GET operations remain authenticated: current/admin users, current-user posts, and current-user reviews.
- Use Redux Toolkit only for shared authentication/current-user state and global notifications. Keep route-local list
  and form request state in route-private Hooks and Client Components.
- Add the required runtime dependencies: `axios`, `@reduxjs/toolkit`, and `react-redux`.
- Add a focused test stack using `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, and
  `@testing-library/user-event`. Do not add a form library, schema library, component library, or class-composition
  dependency.
- Define strict TypeScript request/response contracts from the inspected OpenAPI 3.0 document. Narrow response
  envelopes and nullable fields at the API boundary. Do not make the production build depend on downloading the
  OpenAPI document.
- Treat API IDs as UUID strings and preserve backend enum names at the API boundary. Map them to Vietnamese labels in
  the UI.
- Render post, review, and comment content as plain text with preserved line breaks. Do not render API content as HTML.
- Authentication uses an in-memory credential vault. Access and refresh tokens must not be put in Redux,
  `localStorage`, `sessionStorage`, URL parameters, logs, or rendered output. A full-page reload therefore ends the
  local session until the backend provides a secure cookie contract.
- The Axios client attaches the in-memory bearer token, performs a single-flight refresh using the in-memory refresh
  token, retries a failed request at most once, and clears the local session when refresh fails. It must not import the
  Redux store or navigate.
- Implement Google OAuth with Authorization Code + PKCE in a popup so the verifier and state can remain in opener
  memory. Validate the callback origin and state before exchanging the code. Keep
  `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_GOOGLE_REDIRECT_URI` optional at build time; Google login/link
  controls are unavailable with an explanatory state until both values exist.
- Place create/update/delete controls require a bearer token and are shown to `EDITOR` and `ADMIN`. Backend role
  enforcement remains authoritative and `403` responses are rendered safely.
- User administration, province mutation, and category mutation UI is shown only to `ADMIN`, consistent with the API
  summaries and documented `403` responses. This client-side gating is UX only.
- Authenticated users can create and manage their own posts, reviews, comments, reactions, profile, password, and OAuth
  links. These mutations require a bearer token and backend ownership checks remain authoritative.
- Google account linking reuses the Google PKCE flow. Apple login/link buttons and their service calls are omitted.
- The generic OAuth unlink control can unlink `GOOGLE` and can display/unlink another provider already returned in
  `oauthProviders`, provided doing so does not violate backend validation. Prevent an obviously destructive unlink
  when the account has neither a password nor another provider.
- Reaction summary responses do not expose the current user's selected reaction. After a reload, show counts without
  claiming which reaction the current user selected; update local selection only after a successful mutation.
- Public data being empty is a supported state. Keep a concise curated static introduction on the homepage and show
  accessible empty states for API-backed collections.
- Configure the external API through `NEXT_PUBLIC_API_BASE_URL=http://52.62.25.92`. No special Next.js trust setting is
  required for an outbound Axios request. This works from localhost or an HTTP-served frontend when backend CORS
  allows the origin. It does not allow an HTTPS page to bypass browser mixed-content blocking.
- Preserve the configured API scheme exactly. Environment parsing, endpoint builders, Axios configuration, navigation,
  and Next.js configuration must not rewrite `http://52.62.25.92` to HTTPS.
- The frontend is also expected to be served over HTTP. Do not add an HTTP-to-HTTPS redirect, an HSTS response header,
  a CSP `upgrade-insecure-requests` directive, or other application-controlled upgrade behavior. If a CSP is added,
  its `connect-src` must explicitly allow `http://52.62.25.92`.
- Dates and numbers use `Intl` with Vietnamese locale.
- Mutation confirmations are required for delete, soft-delete, deactivate, role-change, provider-unlink, and
  logout-all actions.

# Open questions

- The backend is HTTP-only. The accepted integration can run from localhost or an HTTP-served frontend. If the
  frontend is deployed over HTTPS, browsers will block the HTTP API before Axios/Next.js can override it; there is no
  frontend-side IP trust configuration that bypasses this browser rule.
- Browser-wide HTTPS-First settings, a previously cached HSTS policy, DNS/proxy redirects, or hosting-platform
  redirects are outside this repository's control. The application must not initiate an upgrade and the handoff must
  identify any observed external upgrade behavior rather than hiding it.
- Only `http://localhost:3000` CORS was verified. The backend team must allow the final staging and production browser
  origins.
- Persistent sign-in cannot be implemented safely from the current JavaScript token response contract. A backend-owned
  `HttpOnly`, `Secure`, appropriately scoped cookie flow is required for persistence across reloads.
- Google OAuth requires a real browser client ID and an allowlisted redirect URI. The implementation will remain
  dormant when its optional environment variables are absent. Live verification is blocked until the values and
  Google Console configuration are supplied; exact setup instructions must be included in the final handoff.
- The OpenAPI document does not expose a complete role/error matrix. The frontend will use the confirmed UI matrix
  (`ADMIN` for users/provinces/categories, `EDITOR|ADMIN` for places, authenticated owner for community content) and
  safely handle backend `401`, `403`, `404`, and `409` responses.
- No `EDITOR` or `ADMIN` test account was supplied. Privileged live verification requires non-production credentials
  or a backend-provided seeded environment.
- The live public collections were empty during inspection. End-to-end visual verification of populated public routes
  requires seeded non-production content.
- The API provides reaction counts but no endpoint for the current user's existing reaction, so selected-reaction
  restoration is not possible after reload.

# Implementation requirements

## Shared application foundation

- Keep the App Router under the existing root `app/` directory without losing the current design tokens, metadata,
  fonts, accessibility behavior, or hydration-warning behavior.
- Follow the approved `ai-context/architecture-context.md`: route-specific UI and Hooks are colocated in private
  folders beside routes; reusable infrastructure lives in root `components/`, `config/`, `lib/`, `store/`, `types/`,
  and `utils/`; no `src/` or top-level `features/` layer is introduced.
- Mount one Redux provider at the root client boundary.
- Create typed environment validation and safe route builders.
- Create one shared Axios instance with timeout, JSON headers, bearer attachment, normalized errors, single-flight
  refresh, abort support, and loop prevention.
- Normalize unknown failures to serializable `{code, message, status?, fieldErrors?}` values. Map known backend error
  codes to safe Vietnamese copy and use a generic message otherwise.
- Add reusable, accessible primitives only when used across unrelated routes: buttons, inputs, selects, text areas, status
  badges, pagination, dialogs/confirmation, notices, skeleton/loading regions, empty states, and form error summaries.
- Provide responsive application navigation whose visible destinations reflect signed-out, signed-in, and admin
  states.

## Route map and user flows

- `/`: branded landing page, API health degradation notice when appropriate, and small destination/story discovery
  sections with links to full collections.
- `/destinations`: published places list with search, province, category, sort, order, and pagination in the URL.
- `/destinations/[id]`: place detail, category/province context, review list, create/update/delete own review flows,
  review comment threads, and review/comment reactions.
- `/stories`: published post list with search, place, author, source, order, and pagination in the URL.
- `/stories/[id]`: published post detail, post reactions, comment/reply list, and create/update/delete own comments with
  comment reactions.
- `/login`: email/password login and Google OAuth login.
- `/register`: email/password/display-name registration.
- `/auth/google/callback`: popup callback that returns the authorization response to the trusted opener and renders a
  safe fallback/error state.
- `/status`: live API health check with retry.
- `/account/profile`: get/update profile, change password when supported by `hasPassword`, Google account link/unlink,
  generic existing-provider unlink, logout, and logout-all.
- `/account/posts`: current-user posts with status filter, pagination, edit, and soft-delete.
- `/account/posts/new`: create draft or submit a post.
- `/account/posts/[id]/edit`: update the current author's post, including clearing/choosing a place, then draft/submit.
- `/account/reviews`: current-user reviews with place/status filters, pagination, edit, and soft-delete.
- `/manage/places`: published place list adapted for authenticated management, with create/edit/soft-remove controls.
- `/manage/places/new`: create a place using live province/category choices.
- `/manage/places/[id]/edit`: load by ID and update a place using live province/category choices.
- `/admin/users`: admin user list with search, role, active status, sort, order, pagination, detail inspection, role
  change, and activation/deactivation.
- `/admin/provinces`: list, get, create, update, and delete unused provinces.
- `/admin/categories`: list, get, create, update, and delete categories with an explicit warning that deletion also
  removes place links.

Authenticated/admin routes use client-side guards for UX and retain accessible loading/denied states. Place
management requires `EDITOR` or `ADMIN`; user/province/category administration requires `ADMIN`. These controls must
not imply frontend authorization.

## API operation coverage

Every included operation must have a typed service and a reachable user-visible flow or internal orchestration:

- Health: `GET /api`.
- Auth: register, email login, Google OAuth login, refresh, logout, and logout-all.
- Users: get/update current profile, change password, list/get users, update role/status, Google link, and provider
  unlink.
- Provinces: list, create, get, update, and delete.
- Categories: list, create, get, update, and delete.
- Places: published list, create, get, update, and soft-remove.
- Posts: published list, create/submit, list mine, get, update, and soft-delete.
- Reviews: list for place, create, list mine, get, update, and soft-delete.
- Comments: list roots/replies, create comment/reply, get, update, and soft-delete.
- Reactions: summary, upsert/change, and remove.

Do not create service functions, buttons, callback handling, or placeholders for the two excluded Apple operations.

Public GET services must work without auth state and must not fail merely because no access token exists:

- `GET /api`
- `GET /api/v1/provinces` and `GET /api/v1/provinces/{id}`
- `GET /api/v1/categories` and `GET /api/v1/categories/{id}`
- `GET /api/v1/places` and `GET /api/v1/places/{id}`
- `GET /api/v1/posts` and `GET /api/v1/posts/{id}`
- `GET /api/v1/places/{placeId}/reviews` and `GET /api/v1/reviews/{id}`
- `GET /api/v1/comments` and `GET /api/v1/comments/{id}`
- `GET /api/v1/reactions/summary`

Protected reads and all non-auth content/profile mutations attach the bearer token. Role/ownership enforcement remains
the external backend's responsibility.

## Forms and API states

- Apply only contract-backed client validation: required fields, email format, password length 8–128, display name
  length 1–100, field maxima, rating 1–5, latitude/longitude ranges, UUID presence, enum values, and required array
  selection.
- Preserve meaningful zero/false/null values in patch requests and omit untouched optional fields.
- Disable duplicate submission, retain user input after recoverable errors, associate errors with fields, and focus an
  error summary after failed submission where useful.
- Every API-backed collection/detail/mutation must provide explicit loading, empty, error, success, and retry/disabled
  states appropriate to the interaction.
- Abort obsolete list/detail requests during navigation/filter changes.
- Keep filters/pagination shareable through URLs and reset page to 1 when a filter changes.

# API contract and external backend dependencies

- Contract source: `http://52.62.25.92/api/docs-json`
- OpenAPI version: `3.0.0`
- API title/version: `Vietnam Travel Guide API`, `1.0`
- Browser base URL variable: `NEXT_PUBLIC_API_BASE_URL`
- Current base URL: `http://52.62.25.92`
- Authentication: JavaScript-visible bearer access token plus rotating refresh token returned by auth endpoints
- Response envelope: `{success, data, meta}` for success; observed error envelope
  `{success:false, error:{code,message,details}, meta}`.
- CORS verified only for local origin `http://localhost:3000`.
- Public pagination defaults to page 1 and limit 20, with maximum limit 100.
- Public content GET endpoints are anonymous. Admin/current-user GET endpoints and non-auth mutations use bearer
  authentication.
- Google browser OAuth is implemented but enabled only when both optional variables are present:
  - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
  - `NEXT_PUBLIC_GOOGLE_REDIRECT_URI`
  - Google Console redirect-origin configuration matching the exact URI
- The external backend remains responsible for authorization, ownership, moderation/status transitions, persistence,
  OAuth code exchange, rate limiting, and token revocation.
- Do not add Next.js Route Handlers, Server Actions, secrets, database behavior, proxying, or a backend-for-frontend.

# Security requirements

- Never persist or log access tokens, refresh tokens, passwords, authorization codes, PKCE verifiers, authorization
  headers, or sensitive API payloads.
- Keep the configured HTTP API URL unchanged. Do not emit HSTS, HTTPS redirects, or `upgrade-insecure-requests`.
- If security headers include CSP, allow browser API calls through
  `connect-src 'self' http://52.62.25.92` without broad wildcard origins.
- Do not require or synthesize an access token for public GET operations. If a valid in-memory token already exists,
  the shared client may attach it uniformly, but anonymous access must remain fully functional.
- Keep credentials in module memory only and clear them on logout, logout-all, refresh failure, or account
  deactivation response.
- Refresh must be single-flight and each failed request may retry at most once.
- Google OAuth must use a cryptographically random state and PKCE verifier, SHA-256 challenge, exact redirect URI,
  popup origin validation, and one-time cleanup of transient values.
- Validate all IDs/enums/search parameters before sending them to the API.
- Validate arbitrary avatar/external URLs as HTTP(S), prevent `javascript:` and unsafe navigation, and avoid leaking
  referrers when loading a remote avatar.
- Render all user-authored content as text, never with `dangerouslySetInnerHTML`.
- Do not expose raw stack traces, backend internals, request bodies, or tokens in UI notices.
- Use confirmations for destructive and privilege-changing actions, with the exact target named.
- Do not rely on route guards or hidden controls for authorization.
- Do not include production credentials or real tokens in tests, fixtures, environment examples, or source control.

# Accessibility requirements

- Maintain a Vietnamese skip link, semantic landmarks, logical heading levels, and descriptive page titles.
- All fields have persistent labels, descriptions where needed, keyboard-operable controls, and associated error text.
- Async status updates use restrained `aria-live` regions without announcing every rendering change.
- Dialogs have an accessible name, initial focus, focus containment, Escape support where safe, and focus restoration.
- Tables provide headers and a responsive small-screen representation without losing labels.
- Pagination exposes current page and disabled boundaries semantically.
- Reaction controls expose their type, count, pressed state only when known, and do not rely on emoji/color alone.
- Star rating is keyboard operable and has a textual value.
- Preserve visible focus, sufficient contrast, 44px touch targets, text resizing, reduced-motion support, and no
  horizontal page scrolling at 320px.
- Loading and empty states remain understandable to screen-reader users.

# Visual interpretation

Extend the current contemporary Vietnamese editorial travel identity into a functional product. The experience should
feel like one coherent publication and community tool, not an unrelated admin template attached to the landing page.
Use the crane mark, warm canvas, purple brand surface, yellow accent, deep ink, expressive serif display headings,
clean Vietnamese body type, strong rules, and restrained graphic geometry already established.

Public pages should be image-independent because the API has no destination/post image fields. Use typography,
category chips, rating/reaction data, province labels, editorial numbering, and subtle crane/contour line motifs to
create hierarchy. Authenticated account and admin pages may be denser but must retain the same tokens and typography.

# Layout

- Public shell: max-width editorial canvas, responsive header, content-first cards, filter panel, main results region,
  and consistent footer.
- Detail pages: primary narrative column plus compact metadata/interaction rail on desktop; one column on mobile.
- Account/manage shell: responsive side navigation on large screens and compact top/overflow navigation on mobile.
- Admin lists: filter row, desktop table, labeled stacked records on small screens, and inline/modal editing only where
  it remains clear and accessible.
- Forms: readable single-column measure, grouped related fields, sticky action area only when it does not hide content.

# Typography

- Continue `Noto Serif` for display/editorial headings and `Be Vietnam Pro` for interface/body copy.
- Use fluid display sizes only on major public headings; use compact, consistent type scales for forms and management
  screens.
- Preserve Vietnamese diacritics, comfortable line height, and readable content measures.

# Spacing

- Reuse semantic page/content/section tokens and the established generous public-page rhythm.
- Use a tighter but still touch-friendly rhythm in data tables, filters, account panels, and dialogs.
- Keep consistent gaps between labels, controls, errors, section headings, and destructive-action regions.

# Colors

- Continue semantic `canvas`, `surface`, `ink`, `muted`, `line`, `accent`, `brand`, and `focus` tokens.
- Add semantic success, warning, danger, and subdued interactive tokens only if required, with accessible foregrounds.
- Never use color alone to encode role, status, rating, reaction, validation, or destructive intent.

# Interaction states

- Define default, hover, focus-visible, active/pressed, selected, loading, disabled, success, warning, and error states.
- Use optimistic UI only when rollback is deterministic. Prefer confirmed server responses for deletes, role/status
  changes, comments, reviews, and reactions.
- Keep motion brief and restrained, and disable non-essential transitions for reduced motion.

# Responsiveness

- Support at minimum 320px mobile, common tablet widths, and wide desktop without clipped dialogs, filters, navigation,
  tables, or long Vietnamese content.
- Collapse filters into an accessible disclosure when space is constrained.
- Convert multi-column cards/details to a linear reading order on small screens.
- Do not make hover a prerequisite for discovering actions.

# Pixel-perfect expectations

- Match the existing token values, rounded-panel language, shadows, borders, typography pairing, navigation treatment,
  and crane brand mark wherever those patterns remain appropriate.
- New API-backed pages must be visually consistent rather than exact copies of the static homepage sections.
- Verify representative public, detail, form, account, and admin views at 320px, 768px, 1280px, and 1440px.

# Acceptance criteria

- All 51 included OpenAPI operations are represented by strict typed services and reachable UI/internal orchestration.
- The two Apple OAuth operations are absent from services, route behavior, and controls.
- Anonymous visitors can browse provinces, categories, published places, posts, reviews, comments, reaction summaries,
  and API health without being redirected to login.
- Protected mutations enforce the confirmed client-side role/ownership UX matrix and correctly surface backend
  authorization failures.
- Public destination/story browsing, detail views, filters, sorts, URL pagination, and empty/error states work against
  the external API.
- Email registration/login, token attachment/rotation, logout, logout-all, and session clearing behave as specified
  without persistent token storage. Google OAuth PKCE code is complete but degrades safely when its optional
  environment configuration is absent.
- Profile, password, Google link/unlink, current-user posts, current-user reviews, comments/replies, and reactions have
  complete success/error/disabled flows.
- Place management and admin users/provinces/categories cover documented create/read/update/delete or role/status
  behavior with confirmations.
- API-backed UI never calls Axios directly; services use the shared client and Redux is limited to shared state.
- No Next.js backend code, Server Actions, application JavaScript/JSX files, secret values, or unsafe rich-text
  rendering are added.
- The existing Vạn Nẻo visual identity remains recognizable and all new routes meet the accessibility/responsive
  requirements.
- Context documents accurately reflect the implemented routes, API contract, state ownership, auth limitations, and
  unresolved backend dependencies.
- Required automated checks pass, or an exact external blocker is documented.

# Checks to run

```powershell
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

Also perform:

- Targeted Vitest coverage for API error normalization/envelope narrowing, auth credential/refresh behavior, Redux auth
  transitions/selectors, URL query parsing, form validation, and critical reaction/comment or destructive-action UI.
- Verify that no forbidden Next.js backend files or JavaScript application files were introduced:

```powershell
rg --files app components config lib store types utils | rg "\.(js|jsx)$"
rg -n "use server|dangerouslySetInnerHTML|localStorage|sessionStorage" app components config lib store types utils
Test-Path app/api
Test-Path src
Test-Path features
```

- Inspect the production build route output and report exact route coverage.
- Inspect frontend response headers and Next.js redirects to confirm the application does not emit HSTS, an HTTPS
  `Location`, or `upgrade-insecure-requests`.
- In a real browser network trace, confirm public API requests use `http://52.62.25.92`, receive no scheme-changing
  redirect, and are not silently rewritten to HTTPS.
- Perform live read-only browser/manual checks against a non-production API. Do not mutate external data without an
  explicitly supplied test account/environment.

# Manual testing steps

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_BASE_URL=http://52.62.25.92`. Leave the optional Google
   client ID/redirect URI empty until Google testing is available; the application must still build and run.
2. Run `npm install` and `npm run dev`.
3. Open the HTTP frontend in a signed-out/incognito session. In DevTools Network, verify API requests retain
   `http://52.62.25.92`, do not receive a scheme-changing `30x`, succeed without an Authorization header, and are not
   rewritten to HTTPS.
4. At 320px, 768px, 1280px, and 1440px, open `/`, `/destinations`, `/stories`, and `/status`; verify navigation,
   loading/empty states, focus behavior, and no horizontal overflow.
5. Register a disposable non-production user, verify authenticated navigation/profile, update profile, change
   password, log out, log in, and verify reload intentionally clears the memory-only session.
6. With Google configuration, open Google login in the popup, complete/deny it, verify callback/state/error handling,
   then link/unlink Google from the profile.
7. Create a draft post, submit/update it, filter `/account/posts`, open it when published, then soft-delete it.
8. Against a seeded place, create/update/delete a review; add a root comment and reply; edit/delete owned comments; add,
   change, and remove reactions for post/review/comment targets; verify counts and failures.
9. With an `EDITOR` or `ADMIN` account, create/update/soft-remove a place using province/category selections. Verify a
   normal `USER` cannot access those controls and backend authorization errors are explained without leaking details.
10. With an `ADMIN` test account, search/filter users, inspect one user, change role/status with confirmation, then
   create/update/delete a disposable province and category. Verify conflict states for in-use/duplicate records.
11. Verify keyboard-only navigation, dialog focus, error-summary focus, screen-reader labels/live regions, 200% text
    zoom, reduced motion, long Vietnamese copy, expired access-token refresh, refresh failure, and offline/API errors.
12. Confirm no Apple login/link control appears and no Apple OAuth request is sent.

# Known verification limitations before implementation

- Live privileged checks require supplied `ADMIN`/`EDITOR` non-production access.
- Live Google OAuth checks require public client configuration and allowlisted redirect origins.
- The HTTP API works only from localhost or an HTTP-served frontend with allowed CORS. An HTTPS frontend cannot call it
  directly because browser mixed-content blocking cannot be disabled through this Next.js application.
- Populated public/detail UI checks require seeded backend data; deterministic automated tests will cover those states
  without calling the live API.
