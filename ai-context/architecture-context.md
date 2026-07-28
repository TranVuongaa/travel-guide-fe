# Next.js Frontend Architecture

This document defines the structure for a frontend-only Next.js project using:

- The root `app/` App Router and mandatory strict TypeScript.
- Server Components for static composition and Client Components for interactive application UI.
- Route groups and private folders for route organization and colocation.
- Redux Toolkit for shared client state.
- Axios for browser-side calls to an independently deployed backend.
- A small set of root shared folders for code reused across routes.

The architecture follows current Next.js project-organization conventions without a `src/` directory or a
top-level `features/` layer. Route-specific UI and orchestration stay next to their route. Only genuinely shared code
is promoted to a root shared folder.

## System boundary

```text
Browser
  -> Next.js route
    -> Client Component / Hook
      -> domain API service or Redux thunk
        -> shared Axios client
          -> external backend API
```

The external backend owns:

- Authentication authority and authorization.
- Business rules.
- Data persistence and database access.
- Secrets and privileged third-party integrations.
- Webhooks, background work, scheduled jobs, and server-side auditing.

The Next.js project MUST NOT contain Route Handlers, Server Actions, database access, ORM code, or a
backend-for-frontend layer.

## Root structure

```text
project/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── (account)/
│   ├── (admin)/
│   ├── _components/
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── providers.tsx
├── components/
│   ├── layout/
│   └── ui/
├── config/
│   ├── env.ts
│   └── routes.ts
├── hooks/
│   ├── useDebounce.ts
│   └── useDebouncedSearchParam.ts
├── lib/
│   ├── api/
│   ├── auth/
│   └── feature/
├── store/
│   ├── slices/
│   ├── hooks.ts
│   └── store.ts
├── types/
├── utils/
├── tests/
├── public/
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

- `app/`: Routes, layouts, metadata, route boundaries, and route-colocated private implementation.
- `components/`: Components reused across unrelated routes.
- `config/`: Validated public configuration and safe route builders.
- `hooks/`: Domain-neutral client Hooks reused across unrelated routes.
- `lib/`: Shared non-visual infrastructure, domain API services, and authentication plumbing.
- `store/`: The single Redux store, typed hooks, and slices for genuinely shared client state.
- `types/`: Types used by multiple unrelated modules.
- `utils/`: Small domain-neutral pure functions.
- `tests/`: Shared test setup and tests that do not belong beside an owning module.
- `public/`: Static files served as-is.
- Root configuration files contain only toolchain, build, test, and deployment configuration.

Do not create optional folders until a real file needs them. Do not add empty architecture placeholders.

## TypeScript baseline

- All application source MUST use TypeScript.
- Use `.ts` when a module does not contain JSX.
- Use `.tsx` when a component or other module contains JSX.
- Do not add application `.js` or `.jsx` files.
- Keep `strict: true`, `noEmit: true`, and `allowJs: false` in `tsconfig.json`.
- Tool configuration MAY use JavaScript only when that tool does not support TypeScript or ESM configuration.
- Props, Hooks, Redux modules, Axios boundaries, environment configuration, and application errors must be typed.
- TypeScript types do not validate network data at runtime. Narrow or validate untrusted external API payloads at the
  boundary when the contract or risk requires it.

## App Router organization

The root `app/` directory owns the URL structure. The project intentionally does not use `src/app`.

Use Next.js file conventions for route behavior:

- `page.tsx`: Route entry point.
- `layout.tsx`: Shared route layout.
- `loading.tsx`: Route-level loading UI when streaming or navigation behavior requires it.
- `error.tsx`: Unexpected route rendering errors.
- `not-found.tsx`: Missing resource UI.
- `providers.tsx`: Root Client Component that mounts Redux and approved client contexts.

Use route groups to organize sections without changing their URLs:

```text
app/
├── (public)/
│   ├── destinations/
│   └── stories/
├── (auth)/
│   ├── login/
│   └── register/
├── (account)/
│   └── account/
└── (admin)/
    └── admin/
```

Use private folders prefixed with `_` for implementation details that must not become routes:

```text
app/(public)/destinations/
├── _components/
│   ├── DestinationFilters.tsx
│   └── DestinationList.tsx
├── _hooks/
│   └── useDestinations.ts
├── [id]/
│   ├── _components/
│   │   └── DestinationDetail.tsx
│   └── page.tsx
└── page.tsx
```

Colocation rules:

- Keep UI, Hooks, validation, and helpers used by one route inside private folders next to that route.
- Promote code to a parent private folder when several child routes in the same section reuse it.
- Promote code to a root shared folder only when unrelated route sections reuse it.
- Route folders use lowercase URL-safe names. Private folder names begin with `_`.
- Route groups describe layout ownership and do not appear in URLs.
- Keep `page.tsx` and `layout.tsx` small and focused on composition.
- `layout.tsx` owns shared route layout, not dynamic external API fetching.
- Do not create `app/api`.
- Do not add Server Actions.
- Server Components MUST NOT request dynamic application data from the external API.
- Interactive and API-backed sections use Client Components.
- Do not create barrel files solely to hide route-private implementation.

## Shared components

```text
components/
├── layout/
│   ├── AppHeader.tsx
│   └── PageShell.tsx
└── ui/
    ├── Button.tsx
    ├── Dialog.tsx
    ├── Input.tsx
    └── Spinner.tsx
```

- `ui/` contains reusable, domain-neutral controls.
- `layout/` contains application chrome reused by unrelated route groups.
- Shared components accept data and callbacks through typed props.
- Shared components do not call domain APIs or dispatch route-specific actions.
- A component used by only one route stays in that route's `_components/` folder.
- Do not create a shared component merely to shorten one class list.

## API infrastructure and domain services

```text
lib/
├── api/
│   ├── client.ts
│   ├── errors.ts
│   └── response.ts
└── feature/
    ├── auth/api.ts
    ├── users/api.ts
    ├── provinces/api.ts
    ├── categories/api.ts
    ├── places/api.ts
    ├── posts/api.ts
    ├── reviews/api.ts
    ├── comments/api.ts
    └── reactions/api.ts

types/
└── api.ts
```

- `lib/api/client.ts`: The one shared Axios instance, safe defaults, and interceptors.
- `lib/api/errors.ts`: Converts unknown Axios failures into serializable application errors.
- `lib/api/response.ts`: Narrows shared API response envelopes.
- `lib/feature/<domain>/api.ts`: Colocates endpoint constants and typed service functions for one API domain.
- `types/api.ts`: Shared response envelopes, pagination, enums, request contracts, and cross-domain API shapes.
- Split a domain API module only when its size or responsibilities justify additional files in the same domain folder.
- Components and Hooks never call Axios directly.
- The shared client does not import UI, routing, or the Redux store.
- Domain service modules do not render UI, dispatch Redux actions, or navigate.
- Keep raw endpoint strings out of route components.
- The browser can call only APIs whose CORS and authentication policies allow the deployed frontend origin.
- Secrets and privileged requests belong in the external backend.

Example:

```ts
import {apiClient} from '@/lib/api/client';

import type {ApiSuccess, User} from '@/types/api';

export const getCurrentUserService = async (): Promise<User> => {
  const response = await apiClient.get<ApiSuccess<User>>('/api/v1/users/me');
  return response.data.data;
};
```

## Authentication infrastructure

Shared browser-only session plumbing belongs under `lib/auth/`:

```text
lib/auth/
├── credentials.ts
├── google-pkce.ts
└── session-events.ts
```

- Keep credential storage policy explicit and isolated.
- Browser-only modules must not be imported by Server Components.
- Authentication infrastructure may expose small typed functions to the Axios client and auth UI.
- It must not render UI, navigate, or import the Redux store.
- Provider-specific UI stays with the owning login, callback, or account route.

## Redux store

```text
store/
├── slices/
│   ├── auth.slice.ts
│   └── notifications.slice.ts
├── hooks.ts
└── store.ts
```

- `store.ts` configures the one store and exports `RootState` and `AppDispatch`.
- `hooks.ts` exports typed `useAppDispatch` and `useAppSelector`.
- `slices/` contains only state shared across distant routes.
- `app/providers.tsx` mounts the provider once.
- Request state used by one route stays in its route Hook or Client Component.
- Use Redux thunks only for API flows that update genuinely shared Redux state.
- Use a notification slice only when notices must be coordinated across unrelated routes.

Example flow:

```text
ProfilePanel
  -> dispatch(fetchCurrentUser())
    -> getCurrentUserService()
      -> apiClient.get()
        -> external backend
    -> auth slice
  -> typed selector
    -> ProfilePanel
```

## Configuration

```text
config/
├── env.ts
└── routes.ts
```

- `env.ts` reads and validates public runtime/build configuration.
- `routes.ts` defines internal path builders when centralized paths improve safety.
- Only variables prefixed with `NEXT_PUBLIC_` are available in browser code.
- Every `NEXT_PUBLIC_*` value is exposed to users and MUST be non-sensitive.
- Do not define environment URLs inside components or services.

Example:

```ts
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is required');
}

export const env = {
  apiBaseUrl,
} as const;
```

## Assets, styling, and localization

- Put files that need stable public URLs in `public/`.
- Keep route-owned assets beside the route when supported by the toolchain.
- Put globally reused component-imported assets in a clearly named root asset folder only when needed.
- Use lowercase kebab-case names for public assets.
- Do not store secrets, source design files, or unused assets in `public/`.
- Use `next/image` and `next/font` according to the code standards.
- Keep global Tailwind imports and semantic tokens in `app/globals.css`.
- Keep component appearance in Tailwind utilities or beside its owning component using the approved styling approach.
- All code consumes semantic tokens rather than repeating raw values.

If localization is later enabled, place its shared configuration under root `i18n/`. Route-specific translated copy
may remain beside the route when the selected localization library supports it. Do not add locale routing or a
localization dependency until the project overview confirms it.

## Utilities and shared types

- Root `hooks/` contains domain-neutral client Hooks reused by unrelated routes.
- Root `utils/` contains only small domain-neutral pure functions reused by unrelated routes.
- Root `types/` contains only types shared by unrelated modules.
- Route-specific helpers and types stay in a private folder beside the owning route.
- API contract types shared across domains stay in `types/api.ts`.
- Do not create broad `helpers.ts`, `utils.ts`, or `types.ts` dumping grounds.
- Browser storage wrappers, if approved, belong in a clearly named browser-only module.

## Dependency direction

```text
App route
  -> route-private components and Hooks
    -> shared components
    -> domain API services
      -> shared Axios client
    -> shared Redux store when state crosses routes
    -> config / utilities / shared types

Shared components
  -> config / utilities / shared types
```

Rules:

- Root shared infrastructure does not import route-private code.
- Shared components do not import routes, domain services, or Redux slices.
- Domain services do not import UI, Redux, or navigation.
- Redux slices do not import UI or browser storage.
- Server Components do not import browser-only API/state modules.
- A route may import from its own private folders, ancestor private folders, and root shared modules.
- One route must not reach into another route's private folder.
- Circular dependencies are not allowed.

## File naming

| Type | Convention | Example |
| --- | --- | --- |
| Route segment | lowercase kebab-case | `account-settings/` |
| Route group | descriptive parentheses | `(account)/` |
| Private folder | leading underscore | `_components/` |
| Next.js special file | framework convention | `page.tsx`, `layout.tsx` |
| Component | PascalCase | `ProfileCard.tsx` |
| Provider | PascalCase | `AppProviders.tsx` |
| Hook | camelCase with `use` | `useProfileForm.ts` |
| Slice | dot suffix | `auth.slice.ts` |
| Selector | dot suffix | `auth.selectors.ts` |
| Thunk | dot suffix | `auth.thunks.ts` |
| Domain API module | domain folder with `api.ts` | `lib/feature/places/api.ts` |
| Utility | camelCase | `formatDate.ts` |
| CSS Module | matching owner | `ProfileCard.module.css` |
| Public asset | lowercase kebab-case | `empty-state.svg` |

Choose and preserve one naming convention. Do not mechanically rename established files without an approved
migration. Application modules not represented in the table still use `.ts` without JSX and `.tsx` with JSX.

## Adding a route

1. Confirm the URL, access expectations, metadata, and route states.
2. Add the route segment and `page.tsx` under the correct route group.
3. Keep the page focused on composition.
4. Add route-specific Client Components and Hooks under private folders beside the route.
5. Reuse root shared modules only when the behavior truly crosses route boundaries.
6. Add loading, empty, error, and not-found behavior as required.
7. Add tests beside the owning module or under `tests/` when shared.
8. Verify direct navigation, refresh, keyboard behavior, and responsive layouts.

## Adding an API flow

1. Obtain the confirmed external API contract.
2. Add or update shared request and response types in `types/api.ts`, or domain-local types in the relevant feature
   API module.
3. Add the endpoint constant or builder if needed.
4. Add a typed service function to the relevant domain API module using the shared Axios client.
5. Normalize the response and errors.
6. Use a route-private Hook for local data or a typed Redux thunk for shared state.
7. Render loading, empty, error, and success states.
8. Test the network boundary without calling a production API.

```text
External API contract
  -> lib/feature/profile/api.ts
    -> route-private Hook or shared auth thunk
      -> Client Component
```

## Adding shared UI

Add a component to root `components/` only when it:

- Is reused by unrelated routes;
- Represents a domain-neutral UI primitive with a clear typed API; or
- Materially simplifies multiple route sections.

Otherwise keep it in the owning route's `_components/` folder. Shared UI must remain accessible, responsive,
theme-aware, and independent of a specific API domain or Redux slice.
