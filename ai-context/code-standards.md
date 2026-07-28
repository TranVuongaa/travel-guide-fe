# Next.js Code Standards

This document defines conventions for frontend-only projects built with:

- Next.js App Router and TypeScript.
- React functional components and Hooks.
- Redux Toolkit with slices, selectors, and async thunks.
- Axios for browser-side requests to an external API.
- Tailwind CSS v4 with semantic theme tokens.

Keywords:

- **MUST**: Required.
- **SHOULD**: Recommended. Skip only with a clear reason.
- **MAY**: Optional.

## Frontend-only boundary

- Next.js MUST be used only for frontend rendering, routing, assets, and browser behavior.
- Do not add Route Handlers under `app/api`.
- Do not add Server Actions or files marked with `'use server'`.
- Do not add database clients, ORM schemas, queues, webhooks, cron jobs, or backend business logic.
- Application API requests MUST go through the shared Axios client and domain API service modules under `lib/api/`.
- Dynamic external API requests MUST originate from Client Components, client Hooks, or Redux thunks.
- Server Components MAY render static/local content and compose the page shell, but MUST NOT call the application API.
- If a feature requires a server-only credential, signed request, webhook, or privileged operation, record it as a
  backend requirement. Do not implement it in Next.js.

This boundary intentionally trades server-rendered application data for a simple frontend/backend separation. If a
future requirement needs SSR data fetching or a backend-for-frontend, update the architecture and obtain explicit
approval before implementation.

## General

- TypeScript is mandatory for application source.
- Use `.ts` for modules without JSX and `.tsx` for components or other modules containing JSX.
- New application `.js` and `.jsx` files are not allowed.
- A JavaScript configuration file MAY exist only when a tool does not support TypeScript or ESM configuration.
- Migrating an existing JavaScript application requires a separately approved, incremental migration plan. Do not
  weaken the TypeScript baseline silently to accommodate old files.
- Use functional components and Hooks. Do not add class components.
- Keep UI, API access, state coordination, and utilities in separate modules.
- Do not start API calls or other side effects during render.
- Never hard-code tokens, passwords, API secrets, private keys, or personal data.
- Remove commented-out code, debug logs, and test data from production source.
- Production errors and analytics MUST NOT include credentials, tokens, or sensitive personal data.
- All interactive elements MUST be keyboard accessible and have an accessible name.
- Prefer semantic HTML before adding ARIA:

```tsx
<button type='button' onClick={handleSubmit}>
  {t('auth.signIn')}
</button>
```

- Use one package manager and commit only its lockfile.
- Do not edit generated files or build output.
- Before merging, run every check configured by the project. A standard project SHOULD provide:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## TypeScript

### Required compiler baseline

`tsconfig.json` MUST keep at least:

```json
{
  "compilerOptions": {
    "allowJs": false,
    "noEmit": true,
    "strict": true
  }
}
```

- Do not disable strict checks at the file level to bypass a type error.
- Do not use `// @ts-ignore`. Use `// @ts-expect-error` only for a known, documented incompatibility and include a
  short reason.
- Preserve the Next.js TypeScript plugin and the module/JSX settings generated or recommended for the installed
  Next.js version.
- `npm run typecheck` MUST run `tsc --noEmit` and pass before merging.

### Formatting

- Use ES Modules.
- Use single quotes.
- Always use semicolons.
- Use trailing commas in multiline values and argument lists.
- Keep lines within 120 characters where practical.
- Use `const` by default, `let` only for reassignment, and never `var`.
- Use `===` and `!==`.
- Prefer `async/await` with meaningful error handling.
- Use optional chaining and nullish coalescing where appropriate.

Formatting MUST be automated by the project's formatter. Do not manually fight the configured formatter.

### Types

- Do not use `any`. Use `unknown` at untrusted boundaries and narrow it safely.
- Define typed props for every component with props.
- Type custom Hook inputs and exported return contracts when inference does not make the public contract obvious.
- Type Redux state, dispatch, selectors, thunk arguments, fulfilled values, and rejected values.
- Type Axios request bodies, query parameters, successful responses, and normalized application errors.
- Validate and type environment configuration in one module.
- Define API request and response contracts explicitly.
- Treat all API data as untrusted until it is validated or narrowed.
- Do not duplicate a backend contract when an approved generated client or shared type package is the source of truth.
- Use `type` for unions and object shapes by default. Use `interface` when declaration merging or an established
  project convention requires it.
- Prefer discriminated unions for finite UI states:

```ts
type RequestState<T> =
  | {status: 'idle'}
  | {status: 'loading'}
  | {status: 'success'; data: T}
  | {status: 'error'; message: string};
```

- Avoid non-null assertions. Prove that a value exists or handle the missing case.
- Use `satisfies` when checking configuration while preserving inferred literal types.
- Keep Redux state and thunk arguments serializable.

### Naming

- Components, providers, and their files use `PascalCase`: `LoginForm.tsx`, `AppProviders.tsx`.
- Hooks use a `use` prefix and `camelCase`: `useCurrentUser.ts`.
- Variables and functions use `camelCase`.
- Boolean names begin with `is`, `has`, `can`, `should`, or `needs`.
- Constants use `UPPER_SNAKE_CASE`.
- Redux selectors begin with `select`.
- Service functions end with `Service`.
- Async thunk names describe the action and do not need an `Action` suffix:

```ts
export const getProfileService = async (): Promise<Profile> => {};
export const fetchProfile = createAsyncThunk('profile/fetch', async () => {});
export const selectProfile = (state: RootState) => state.profile.data;
```

- Event handlers begin with `handle`. Do not use leading underscores for ordinary private functions.
- Route folders follow Next.js conventions and use lowercase URL-safe segments.

### Imports

Use this order, separated into logical groups when it improves readability:

1. React and Next.js.
2. Third-party packages.
3. Internal aliases such as `@/lib`, `@/components`, and `@/store`.
4. Relative imports.
5. Type-only imports.
6. Styles.

- Use `import type` for imports used only as types.
- Prefer the configured `@/` alias over long parent-relative paths.
- Avoid barrel files that create circular dependencies or hide large dependency graphs.
- Do not import another route's private folders. Route-private modules may import ancestor private modules and root
  shared modules.

## React and Next.js

### Server and Client Components

- Components are Server Components by default.
- Add `'use client'` only when a module needs Hooks, browser APIs, Redux, Axios-driven data, or event handlers.
- Keep Client Component boundaries as low as practical.
- `app/providers.tsx` is the normal client boundary for Redux and other client contexts.
- Do not pass functions or other non-serializable values from a Server Component to a Client Component.
- Browser-only modules MUST NOT be imported by Server Components.
- Never use `window`, `document`, `localStorage`, or `sessionStorage` during render or at module scope.
- Use browser APIs only in Client Components and effects/event handlers.

### Components and Hooks

- Destructure props in parameters.
- Keep each component focused on one responsibility.
- Prefer composition over large components with many mode flags.
- Do not mirror props into state unless the state intentionally diverges.
- Do not store derived values in state when they can be computed during render.
- Hooks MUST include all dependencies. Fix the design instead of disabling dependency lint rules.
- Use `useMemo` and `useCallback` only when measurement or reference stability justifies them.
- Never mutate props or state.
- Lists MUST use stable domain identifiers as keys. Do not use array indexes when order can change.
- Handle loading, empty, error, and success states explicitly for API-backed UI.
- Error boundaries handle unexpected rendering failures; they do not replace expected API error UI.

### Routes and navigation

- Use the App Router under the root `app/` directory. This project intentionally does not use `src/`.
- Route segments and URLs use lowercase kebab-case.
- Use route groups such as `(public)` and `(authenticated)` only for layout organization; they do not change URLs.
- Use private folders such as `_components` and `_hooks` to colocate route implementation without creating URL
  segments.
- Keep `page.tsx` and `layout.tsx` small. Move interactive behavior into route-private or genuinely shared components.
- Do not add a top-level `features/` directory. Route-specific code stays beside its route; cross-route code belongs
  in an appropriate root shared folder.
- Use `next/link` for internal navigation.
- Use `useRouter` only for imperative navigation that cannot be expressed with a link.
- Put filter, sort, pagination, and shareable selection state in URL search parameters when appropriate.
- Validate route and search parameters before using them.
- Never navigate to an arbitrary URL received from an API. Validate external URLs and allowlist internal destinations.
- Define static metadata through Next.js metadata APIs. Do not manipulate `<head>` manually.
- Use `not-found.tsx`, `error.tsx`, and `loading.tsx` only where their route-level behavior is needed.

### Images and fonts

- Use `next/image` for content images when compatible with the source and project requirements.
- Provide useful `alt` text; use `alt=''` only for decorative images.
- Declare dimensions or use a constrained `fill` container to prevent layout shift.
- Configure allowed remote image sources narrowly.
- Use `next/font` for bundled or supported web fonts when possible.

## State management

Choose the smallest suitable owner:

- Component state: local interaction, form fields, and temporary UI.
- URL state: shareable filters, search, sorting, tabs, and pagination.
- Redux Toolkit: client state shared across distant components or routes.
- External API: server-owned source of truth.

Do not move all state into Redux. Do not copy URL state or easily derived values into Redux without a documented
reason.

### Redux Toolkit

The standard flow is:

```text
Client Component
  -> typed dispatch
    -> async thunk
      -> domain API service
        -> shared Axios client
          -> external API
    -> shared-state slice
  -> typed selector
    -> Client Component
```

- Configure one store.
- Mount the Redux provider once in `app/providers.tsx`.
- Export typed `useAppDispatch` and `useAppSelector` Hooks.
- Each slice owns one domain.
- Reducers MUST remain pure and MUST NOT call APIs or browser storage.
- Immer mutation syntax is allowed only inside Redux Toolkit reducers.
- Use `createAsyncThunk` for API flows that update Redux state.
- Provide `createAsyncThunk` generic types when argument, result, or `rejectWithValue` types are not fully inferred.
- Handle pending, fulfilled, and rejected states in `extraReducers`.
- Return normalized, serializable rejection values with `rejectWithValue`.
- Do not put callbacks, Promises, errors, class instances, `Map`, or `Set` in actions or state.
- Keep derived data in selectors.
- Do not store every API response globally. Route-local data MAY stay in a Hook when no other consumer needs it.
- This architecture does not use RTK Query unless the project overview explicitly changes that decision.

## Axios and external APIs

### Shared client

- Create the Axios instance in `lib/api/client.ts`.
- Read the base URL from `NEXT_PUBLIC_API_BASE_URL`.
- A `NEXT_PUBLIC_*` variable is visible to every browser user. It MUST NOT contain a secret.
- Configure timeout, safe default headers, credentials behavior, and interceptors in one place.
- Use `withCredentials: true` only when the external API uses cross-origin cookies and its CORS policy explicitly
  supports credentialed requests.
- Interceptors MAY attach approved client credentials and normalize transport errors.
- Interceptors MUST NOT import the Redux store or cause navigation. Avoid circular dependencies.
- Prevent infinite token-refresh retry loops.
- Never log authorization headers, cookies, credentials, or sensitive payloads.

### Services and errors

- Domain API service modules under `lib/api/` are the only modules that call the shared Axios client.
- Services define request/response types and return domain data, not raw Axios responses, unless the contract requires
  response metadata.
- Components MUST NOT call Axios directly.
- Slices and reducers MUST NOT call Axios.
- Endpoints live in one shared endpoint module or the relevant domain API module; do not scatter raw path strings
  through UI code.
- Convert Axios failures into a serializable application error:

```ts
export type AppError = {
  code: string;
  message: string;
  status?: number;
  fieldErrors?: Record<string, string>;
};
```

- User-facing messages SHOULD use stable backend error codes mapped through localization. Do not display raw stack
  traces or internal backend messages.
- Use cancellation through `AbortSignal` when a request can become obsolete.
- Retry only idempotent operations and only when the product/API contract allows it.
- Keep backend naming at the API boundary. Map `snake_case` payloads to frontend domain types when necessary.

### Authentication and browser security

- Prefer secure, `HttpOnly`, `Secure`, appropriately scoped cookies issued by the external backend.
- Frontend JavaScript cannot create an `HttpOnly` cookie.
- Do not store passwords, refresh tokens, or sensitive session material in Redux, `localStorage`, or `sessionStorage`.
- If the confirmed backend contract returns a bearer token to JavaScript, document its storage and threat model before
  implementation.
- Client-side route guards improve UX but are not authorization. The external API MUST authorize every protected
  request.
- Do not embed service credentials, private API keys, signing keys, or server-only tokens in the frontend bundle.
- Follow the backend's CSRF protection contract for cookie-authenticated mutating requests.
- Render user-provided rich text only after sanitization with an approved strategy.

## Forms

- Use native form semantics and associate every input with a label.
- Prevent duplicate submission while a mutation is in flight.
- Show field errors near the relevant input and provide an accessible summary when appropriate.
- Client validation improves UX; the backend remains the authority.
- Do not invent validation rules that are absent from the confirmed product/API contract.
- Choose a form and schema library only when confirmed by the project overview or existing dependencies.

## Styling and responsive UI

- Tailwind CSS v4 is the confirmed project styling system. Application UI MUST use Tailwind utilities and the
  semantic theme tokens defined in `app/globals.css`.
- Keep `globals.css` limited to the Tailwind import, semantic theme tokens, typography/base behavior, reusable global
  patterns, keyframes, and accessibility media queries.
- Define project tokens through Tailwind v4 `@theme` variables backed by CSS custom properties when runtime CSS access
  is useful.
- Use semantic token names:

```css
:root {
  --canvas: #f7f1df;
  --ink: #17130f;
  --accent: #f4c82e;
  --brand: #612884;
}

@theme inline {
  --color-canvas: var(--canvas);
  --color-ink: var(--ink);
  --color-accent: var(--accent);
  --color-brand: var(--brand);
}
```

- Prefer utilities such as `bg-canvas`, `text-ink`, and `ring-brand` over repeating raw color values.
- Avoid vague or palette-bound token names such as `purple2`, `text5`, or `space3`.
- Keep complete Tailwind class strings in source so the compiler can discover them. Do not build utility names with
  string interpolation.
- Extract a React component when a styled pattern has a reusable behavioral or semantic contract. Do not extract a
  component or add a class-composition dependency solely to shorten one class list.
- When conditional classes are needed, use a small local array/join expression or an already-approved class utility.
  Adding `clsx`, `tailwind-merge`, or a variant library requires a separately approved dependency change.
- Use arbitrary values only for one-off art direction or structural values that have no meaningful reusable token,
  such as a bounded `clamp()` display size. Repeated arbitrary values MUST become semantic theme tokens.
- Do not use inline style objects for static values. Inline SVG presentation MAY use `currentColor` or semantic CSS
  variables so artwork follows the theme.
- Build mobile-first layouts.
- Add unprefixed utilities for the smallest supported viewport, then layer `sm:`, `md:`, `lg:`, and other shared
  responsive variants only where the layout needs them.
- Prefer normal document flow, Grid, and Flexbox over absolute positioning.
- Use shared breakpoints and content-width tokens.
- Support zoom, text resizing, long translations, reduced motion, keyboard navigation, and touch input.
- Interactive elements MUST define a visible `focus-visible` treatment with sufficient contrast on every surface.
- Hover styles MUST NOT be the only indication of interactivity and MUST have keyboard-equivalent focus styles.
- Non-essential motion MUST have a `prefers-reduced-motion` fallback.
- Use relative units where they improve scaling.
- Avoid viewport-width layouts that introduce horizontal scrolling.

## Localization

When localization is enabled:

- All user-facing copy goes through the localization library.
- Translation keys describe meaning, not English sentences.
- Every locale contains the same required keys.
- Format dates, numbers, currencies, and plural forms with locale-aware APIs.
- Do not concatenate translated fragments into sentences.
- Keep backend error codes separate from translated messages.

## Testing

- Test behavior and user outcomes, not implementation details.
- Unit test reducers, selectors, error normalization, validation, and mapping utilities.
- Component test important states and interactions.
- Mock at the network boundary for API-backed tests.
- Add end-to-end tests for critical user flows when an E2E tool is configured.
- Tests MUST be deterministic and MUST NOT call production APIs.
- Do not weaken assertions or skip tests merely to make a check pass.

## Tooling

A new project SHOULD define:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "<project test command>"
  }
}
```

Keep explicit, committed configuration for TypeScript, ESLint, formatting, and tests. Use the dependency versions and
commands already selected by the project; dependency changes require approval through the workflow.

## Protected areas

Do not modify these unless the approved request explicitly requires it:

- Secrets, credentials, and environment files.
- Authentication and authorization.
- Public API contracts or generated API clients.
- Payments and other security-sensitive flows.
- Package manager, dependencies, lockfiles, and build/deployment configuration.
- Generated files and build output.
- Files outside the approved implementation scope.
