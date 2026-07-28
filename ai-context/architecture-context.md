# Next.js Frontend Architecture

This document defines the structure for a frontend-only Next.js project using:

- The App Router and mandatory strict TypeScript.
- Server Components for static composition and Client Components for interactive application UI.
- Redux Toolkit for shared client state.
- Axios for browser-side calls to an independently deployed backend.
- Feature-oriented modules with shared UI and infrastructure.

The architecture is designed to keep routing, UI, client state, and external API access separate without turning
Next.js into a backend.

## System boundary

```text
Browser
  -> Next.js routes and UI
    -> Client Component / Hook
      -> Redux thunk or feature controller
        -> Feature service
          -> Shared Axios client
            -> External backend API
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
├── public/
├── src/
├── tests/
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

- `public/`: Static files served as-is.
- `src/`: Application source.
- `tests/`: Shared or end-to-end tests that do not belong beside a module.
- `.env.example`: Names and safe examples of required public configuration. Never include credentials.
- `tsconfig.json`: Strict TypeScript configuration for application and test source.
- Root configuration files contain only toolchain, build, test, and deployment configuration.

Do not put feature components, services, slices, or helpers at the project root.

## TypeScript baseline

- All application source MUST use TypeScript.
- Use `.ts` when a module does not contain JSX.
- Use `.tsx` when a component or other module contains JSX.
- Do not add application `.js` or `.jsx` files.
- Keep `strict: true`, `noEmit: true`, and `allowJs: false` in `tsconfig.json`.
- Tool configuration MAY use JavaScript only when that tool does not support a TypeScript or ESM configuration.
- Props, Hooks, Redux modules, Axios boundaries, environment configuration, and application errors must be typed.
- TypeScript types do not validate network data at runtime. Narrow or validate untrusted external API payloads at the
  boundary when the contract or risk requires it.

## Source structure

```text
src/
├── app/
│   ├── (public)/
│   ├── (authenticated)/
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
├── features/
│   └── example/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── model/
│       └── index.ts
├── i18n/
├── lib/
│   └── api/
│       ├── client.ts
│       ├── endpoints.ts
│       └── errors.ts
├── store/
│   ├── hooks.ts
│   └── store.ts
├── styles/
│   └── tokens.css
├── types/
└── utils/
```

Create optional folders only when a real file needs them. Do not add empty architecture placeholders to an
application.

## App Router

`src/app` owns URL structure, layouts, metadata, and route-level boundaries.

Example:

```text
src/app/
├── (public)/
│   └── sign-in/
│       └── page.tsx
├── (authenticated)/
│   ├── layout.tsx
│   └── dashboard/
│       ├── loading.tsx
│       ├── error.tsx
│       └── page.tsx
├── globals.css
├── layout.tsx
└── providers.tsx
```

Rules:

- Route folders use lowercase kebab-case.
- Route groups describe layout ownership and do not appear in URLs.
- `page.tsx` composes a route from feature and shared components.
- `layout.tsx` owns shared route layout, not domain data fetching.
- `providers.tsx` is a Client Component and mounts Redux and approved client contexts once.
- Keep pages and layouts small.
- Do not create `app/api`.
- Do not add Server Actions.
- Server Components MUST NOT request dynamic application data from the external API.
- Interactive and API-backed sections use Client Components.

## Features

Each business domain lives under `src/features/<feature>`.

```text
src/features/profile/
├── api/
│   ├── profile.mapper.ts
│   ├── profile.service.ts
│   └── profile.types.ts
├── components/
│   ├── ProfileCard.tsx
│   └── ProfileForm.tsx
├── hooks/
│   └── useProfileForm.ts
├── model/
│   ├── profile.selectors.ts
│   ├── profile.slice.ts
│   └── profile.thunks.ts
├── profile.module.css
└── index.ts
```

- `api/`: External API contracts, mapping, and service calls for the feature.
- `components/`: Feature-specific UI.
- `hooks/`: Feature-specific client orchestration.
- `model/`: Redux state, selectors, and thunks when shared state is needed.
- `index.ts`: A small, intentional public API for other modules.

Do not force every feature to contain every folder. A static feature may need only components. Local feature data
does not require a Redux slice.

Feature rules:

- A feature MAY import shared components, shared infrastructure, config, types, and utilities.
- A feature MUST NOT import another feature's internal files.
- Cross-feature reuse goes through the other feature's public `index.ts`, a shared component, or an approved
  higher-level composition.
- Feature components MUST NOT define base URLs or create Axios instances.

## Shared components

```text
src/components/
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
- `layout/` contains reusable page structure and navigation chrome.
- Shared components accept data and callbacks through typed props.
- Shared components do not call feature APIs or dispatch feature-specific thunks.
- Do not create a shared component for one trivial use.
- Component styles stay beside the component or follow the confirmed styling system.

## API infrastructure

```text
src/lib/api/
├── client.ts
├── endpoints.ts
└── errors.ts
```

- `client.ts`: The one shared Axios instance, safe defaults, and interceptors.
- `endpoints.ts`: Shared endpoint builders/constants when endpoints are not feature-local.
- `errors.ts`: Converts unknown Axios failures into serializable `AppError` values.

Example:

```ts
import axios from 'axios';

import {env} from '@/config/env';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30_000,
  headers: {
    Accept: 'application/json',
  },
});
```

`env.apiBaseUrl` is public browser configuration. It is not a secret.

Feature service example:

```ts
import {apiClient} from '@/lib/api/client';

import {mapProfileResponse} from './profile.mapper';
import type {Profile, ProfileResponse} from './profile.types';

export const getProfileService = async (): Promise<Profile> => {
  const response = await apiClient.get<ProfileResponse>('/profile');
  return mapProfileResponse(response.data);
};
```

Rules:

- Components never call Axios directly.
- The shared client does not import features, components, routing, or the Redux store.
- Services do not render UI, dispatch Redux actions, or navigate.
- The browser can call only APIs whose CORS and authentication policies allow the deployed frontend origin.
- Secrets and privileged requests belong in the external backend.

## Redux store

```text
src/store/
├── hooks.ts
└── store.ts
```

- `store.ts` configures the one Redux store and exports `RootState` and `AppDispatch`.
- `hooks.ts` exports typed `useAppDispatch` and `useAppSelector`.
- Domain slices, selectors, and thunks stay with their feature under `features/<feature>/model`.
- `app/providers.tsx` mounts the provider.

Example flow:

```text
ProfilePanel
  -> dispatch(fetchProfile())
    -> getProfileService()
      -> apiClient.get()
        -> external backend
    -> profileSlice extraReducers
  -> selectProfile()
    -> ProfilePanel
```

Use a shared UI slice only for truly global client UI, such as an application-wide notification queue. Request
status normally belongs to the feature that owns the request.

## Configuration

```text
src/config/
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

## Assets, images, and fonts

- Put files that need stable public URLs in `public/`.
- Keep component-imported assets close to their owning feature when supported by the toolchain.
- Use lowercase kebab-case names: `empty-state.svg`, `company-logo.png`.
- Do not store secrets, source design files, or unused assets in `public/`.
- Use `next/image` and `next/font` according to the code standards.

## Styling

```text
src/
├── app/globals.css
└── styles/tokens.css
```

- `globals.css`: Reset, base element behavior, and global imports.
- `tokens.css`: Semantic color, spacing, typography, radius, shadow, breakpoint, and content-width tokens.
- Component layout and appearance stay in CSS Modules beside the component unless another system is confirmed.
- Feature code consumes semantic tokens rather than repeating raw values.

## Localization

When localization is required:

```text
src/i18n/
├── config.ts
├── locales/
│   ├── en.json
│   └── vi.json
└── types.ts
```

- Keep one resource per locale.
- All locales contain the same required keys.
- UI receives copy through the localization library.
- Do not import locale JSON directly into arbitrary components.
- Do not add locale routing or a localization dependency until the project overview confirms it.

## Utilities and shared types

- `src/utils` contains small, domain-neutral pure functions.
- `src/types` contains genuinely shared types.
- Do not create broad `helpers.ts`, `utils.ts`, or `types.ts` dumping grounds.
- Domain types stay inside their feature.
- Browser storage wrappers, if approved, belong in a clearly named client-only module.

## Dependency direction

```text
App routes
  -> Features
    -> Shared components
    -> Feature model
      -> Feature services
        -> Shared API client
    -> Config / utilities / shared types

Shared components
  -> Config / utilities / shared types
```

Rules:

- Shared infrastructure does not import features.
- Shared components do not import routes or feature models.
- Services do not import UI, Redux, or navigation.
- Slices do not import UI or browser storage.
- Server Components do not import browser-only API/state modules.
- Features do not reach into another feature's internals.
- Circular dependencies are not allowed.

## File naming

| Type | Convention | Example |
| --- | --- | --- |
| Route segment | lowercase kebab-case | `account-settings/` |
| Next.js special file | framework convention | `page.tsx`, `layout.tsx` |
| Component | PascalCase | `ProfileCard.tsx` |
| Provider | PascalCase | `AppProviders.tsx` |
| Hook | camelCase with `use` | `useProfileForm.ts` |
| Slice | dot suffix | `profile.slice.ts` |
| Selector | dot suffix | `profile.selectors.ts` |
| Thunk | dot suffix | `profile.thunks.ts` |
| Service | dot suffix | `profile.service.ts` |
| API types | dot suffix | `profile.types.ts` |
| Utility | camelCase | `formatDate.ts` |
| CSS Module | matching owner | `ProfileCard.module.css` |
| Public asset | lowercase kebab-case | `empty-state.svg` |

Choose and preserve one naming convention in an existing project. Do not mechanically rename established files
without an approved migration.

Application modules not represented in the table still follow the same extension rule: `.ts` without JSX and `.tsx`
with JSX.

## Adding a route

1. Confirm the URL, access expectations, metadata, and route states.
2. Add the route segment and `page.tsx` under the correct route group.
3. Keep the page focused on composition.
4. Add a Client Component for interaction or dynamic API data.
5. Reuse or add feature modules.
6. Add loading, empty, error, and not-found behavior as required.
7. Add localization keys and tests.
8. Verify direct navigation, refresh, keyboard behavior, and responsive layouts.

## Adding an API flow

1. Obtain the confirmed external API contract.
2. Add or update request and response types at the feature API boundary.
3. Add the endpoint constant/builder if needed.
4. Add a feature service using the shared Axios client.
5. Normalize the response and errors.
6. Use a feature Hook for local data or an async thunk and slice for shared data.
7. Render loading, empty, error, and success states.
8. Test the network boundary without calling a production API.

```text
External API contract
  -> profile.service.ts
    -> profile.thunks.ts
      -> profile.slice.ts
        -> ProfilePanel.tsx
```

## Adding shared UI

Add a component to `src/components` only when it:

- Is reused across features;
- Represents a domain-neutral UI primitive with a clear typed API; or
- Materially simplifies multiple route/feature compositions.

Shared UI MUST remain accessible, responsive, theme-aware, and independent of a specific API or Redux slice.
