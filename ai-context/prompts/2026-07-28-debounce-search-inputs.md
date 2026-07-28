---
id: "2026-07-28-debounce-search-inputs"
status: completed
created_at: "2026-07-28T22:06:17.0244333+07:00"
confirmed_at: "2026-07-28T22:07:39.3402658+07:00"
completed_at: "2026-07-28T22:13:18.6879563+07:00"
---

# Goal

Use a shared debounce hook for every API-backed text search input so typing updates the search query only after a
short idle period, avoids a request per keystroke, and keeps the URL as the source of truth for filters.

# Skills read

- None. The user did not request a project skill, and the approved workflow does not require one for this change.

# Existing code inspected

- `ai-context/project-overview.md`
- `ai-context/ai-workflow-rules.md`
- `package.json`
- `app/(public)/destinations/_components/DestinationsExplorer.tsx`
- `app/(public)/stories/_components/StoriesExplorer.tsx`
- `app/(admin)/admin/users/_components/UsersAdmin.tsx`
- `app/(admin)/admin/_components/TaxonomyManager.tsx`
- `components/layout/AppHeader.tsx` and its current uncommitted diff, to ensure the unrelated user change is
  preserved
- Repository searches for existing debounce hooks, search inputs, and test files

# Files likely to change

- A new shared client hook under `hooks/`, with the final filename matching the exported hook
- `app/(public)/destinations/_components/DestinationsExplorer.tsx`
- `app/(public)/stories/_components/StoriesExplorer.tsx`
- `app/(admin)/admin/users/_components/UsersAdmin.tsx`
- `app/(admin)/admin/_components/TaxonomyManager.tsx`
- Focused hook and/or search behavior tests in TypeScript/TSX
- This implementation prompt

# Decisions / assumptions

- The requested `useDebouce` spelling is interpreted as the conventional, correctly spelled `useDebounce`.
- Because the request says "search input" generally and the repository has four API-backed text-search
  implementations, the hook will be applied consistently to destinations, stories, admin users, and both taxonomy
  variants.
- The delay will be a small shared default suitable for search, targeted at 300 ms unless repository context read
  after confirmation establishes a different convention.
- Search text will be controlled locally for immediate visual feedback. Its debounced value will update the current
  URL through App Router navigation while preserving the other active filters.
- A changed search term will reset `page` to `1` by removing the existing `page` query parameter.
- Empty or whitespace-only search text will remove `search` from the URL.
- Existing filter forms, filter selects, submit buttons, reset links, result fetching, abort behavior, and API
  contracts will remain otherwise unchanged.
- Browser history will not receive one entry per search term update; debounced search synchronization will use
  replacement navigation.
- The unrelated existing change in `components/layout/AppHeader.tsx` will not be modified.

# Open questions

- None blocking. If the intended scope was only one specific page, or if the exact misspelled export name
  `useDebouce` is required, revise this prompt before confirmation.

# Implementation requirements

- Add a reusable, strictly typed generic debounce hook without adding a dependency.
- Ensure pending timers are cleared when the input changes or the component unmounts.
- Use the hook in all four API-backed search UIs.
- Keep input state synchronized when navigation changes the URL externally, such as pagination, reset links, browser
  back/forward navigation, or switching between taxonomy routes.
- Preserve all unrelated URL parameters when debounced search changes.
- Avoid redundant router updates when the normalized debounced value already matches the URL.
- Avoid an initial navigation or duplicate API request solely because a page mounts.
- Retain native form submission so keyboard Enter and the existing submit buttons remain functional.
- Keep all application source in `.ts` or `.tsx` and pass strict TypeScript checks.

# API contract and external backend dependencies

- No API contract changes.
- Existing list endpoints continue receiving the optional `search` query value through their current service
  functions.
- No backend work, Next.js route handler, or server-side secret is required.

# Security requirements

- Treat search input as untrusted text and pass it only through `URLSearchParams` and the existing typed API service
  boundary.
- Do not use raw HTML, dynamic code execution, browser storage, or token persistence.
- Do not log search terms or authentication data.

# Accessibility requirements

- Preserve the current explicit labels and input IDs.
- Preserve native text-input and form keyboard behavior, including Enter submission.
- Do not move focus during debounced URL synchronization.
- Do not announce an artificial loading state beyond the result UI's existing loading/error behavior.
- Maintain visible focus styling and touch-target behavior from the existing design system.

# Acceptance criteria

- Typing in any in-scope search field immediately updates the visible input value.
- The URL and API-backed results do not change until the debounce interval has elapsed.
- Continued typing restarts the debounce interval and results in one update for the final settled value.
- Updating search preserves other filters and removes the current pagination parameter.
- Clearing search removes the `search` parameter after the debounce interval.
- Back/forward navigation and reset links synchronize the visible input value with the URL.
- Existing submit buttons and Enter submission still apply the current search and filters.
- No redundant navigation occurs when the debounced search equals the current URL value.
- Existing request cancellation behavior prevents stale results from replacing current results.
- No new runtime dependency is added.
- Unrelated working-tree changes are preserved.

# Checks to run

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

# Manual testing steps

1. Start the frontend with `npm run dev` and open `/destinations`.
2. Type several characters faster than the debounce delay; verify the field updates immediately while the URL waits,
   then updates once after typing stops.
3. Select province/category filters, move to another page if available, then change search; verify filters remain and
   page resets.
4. Clear the search and verify the `search` query parameter is removed.
5. Use Enter and the existing apply/reset controls and verify they remain functional.
6. Repeat the settled typing, clearing, filters, and back/forward checks on `/stories`, `/admin/users`,
   `/admin/provinces`, and `/admin/categories` with suitable authorized accounts for protected pages.
7. Confirm rapid search changes do not show stale results from an older request.

# Visual interpretation

This is a behavior-only refinement. Search fields should retain their current visual design while becoming responsive
to paused typing.

# Layout

- No layout changes.

# Typography

- No typography changes.

# Spacing

- No spacing changes.

# Colors

- No color changes.

# Interaction states

- The search field reflects each keystroke immediately.
- URL navigation and result loading begin only after the debounce interval.
- Existing focus, loading, ready, error, empty, submit, and reset states remain intact.

# Responsiveness

- Preserve all current mobile-first grid, flex, wrapping, and field sizing behavior.

# Accessibility

- Preserve semantic forms, labels, IDs, keyboard submission, focus visibility, and stable focus during URL updates.

# Pixel-perfect expectations

- No intentional pixel-level visual differences from the current UI.
