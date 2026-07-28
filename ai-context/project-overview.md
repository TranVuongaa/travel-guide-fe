# Project Overview

Complete this document before implementation begins. Do not guess missing product or API behavior.

## Goal

Vạn Nẻo is a Vietnamese travel-guide and community frontend. Anonymous visitors explore published destinations,
stories, reviews, comments, and reactions. Signed-in members manage their profile and contribute posts, reviews,
comments, and reactions. Editors manage destinations. Administrators manage users, provinces, and categories.

## Core User Flows

1. An anonymous visitor browses, searches, filters, and opens published destinations and stories.
2. A visitor reads reviews and comment threads, including public reaction counts, without signing in.
3. A visitor registers or signs in with email/password; Google OAuth is available when its public environment
   configuration is supplied.
4. A member updates their profile/password, links or unlinks Google, and manages their own posts and reviews.
5. A member creates, edits, or soft-deletes owned comments and changes or removes reactions.
6. An `EDITOR` or `ADMIN` creates, updates, and soft-removes destinations.
7. An `ADMIN` manages users, roles, active status, provinces, and categories.

## Route Map

- `/`: Branded discovery landing page with live destination and story previews.
- `/destinations`: Public place discovery with search, filters, sorting, and pagination.
- `/destinations/[id]`: Public place detail, reviews, comments, and reactions.
- `/stories`: Public post discovery with search, filters, and pagination.
- `/stories/[id]`: Public story detail, comments, replies, and reactions.
- `/login`, `/register`: Email authentication and optional Google login.
- `/auth/google/callback`: Same-origin Google PKCE popup callback.
- `/account/profile`: Authenticated profile, password, OAuth links, and session controls.
- `/account/posts`, `/account/posts/new`, `/account/posts/[id]/edit`: Current-user post management.
- `/account/reviews`: Current-user review management.
- `/manage/places`, `/manage/places/new`, `/manage/places/[id]/edit`: `EDITOR`/`ADMIN` destination management.
- `/admin/users`: `ADMIN` user inspection, role changes, and activation/deactivation.
- `/admin/provinces`, `/admin/categories`: `ADMIN` reference-data CRUD.

## External API

- API owner: Independently deployed Vietnam Travel Guide backend.
- Base URL variable: `NEXT_PUBLIC_API_BASE_URL`
- Current base URL: `http://52.62.25.92`
- Authentication method: Bearer access token plus rotating refresh token returned to browser JavaScript. Both tokens
  are kept only in module memory and are never persisted in Redux or browser storage.
- API contract source: OpenAPI 3.0 at `http://52.62.25.92/api/docs-json` (`Vietnam Travel Guide API` v1.0).
- Browser origins/CORS: `http://localhost:3000` is confirmed. Other HTTP deployment origins must be allowed by the
  backend.
- Public access: provinces, categories, published places/posts/reviews/comments, and reaction summaries. Province and
  place responses include ordered image metadata with source and license attribution fields.
- Protected access: current/admin user reads, current-user posts/reviews, and all non-auth mutations.
- Client UX roles: `ADMIN` for users/provinces/categories; `EDITOR|ADMIN` for places; authenticated ownership for
  community content. Backend authorization is authoritative.
- Apple login and Apple account linking are intentionally not implemented.

## State Ownership

- Component/route Hook state: API lists, details, forms, mutation progress, dialogs, and route-specific errors.
- URL state: Search, filters, sort selections, and pagination.
- Redux Toolkit: Current authenticated user and shared authentication request state.
- Module memory: Access token, refresh token, refresh single-flight coordination, and transient Google PKCE state.
- External API: Source of truth for users, reference data, destinations, content, comments, and reactions.

## Localization

Vietnamese is the single supported UI language. No localization dependency is enabled. Dates and numbers use
Vietnamese `Intl` formatting.

## Styling and Design System

- Tailwind CSS v4 is the confirmed styling system.
- Semantic color, type, spacing, radius, shadow, and content-width tokens are defined in `app/globals.css`.
- Current brand direction uses warm yellow, near-black, and deep purple with an original Vietnamese crane motif.
- The visual language is contemporary Vietnamese editorial travel: generous spacing, expressive serif display type,
  strong contrast, graphic line work, and restrained motion.
- UI is mobile-first and must preserve visible focus states, reduced-motion support, text resizing, and keyboard
  navigation.
- No external component library or class-composition dependency is currently approved.

## Testing

- Vitest with jsdom.
- Testing Library DOM matchers, React rendering, and user-event.
- Tests mock or isolate the network boundary and never call the live API.
- Required checks: lint, strict TypeScript, deterministic tests, and production build.

## Confirmed Decisions

- Next.js is a frontend-only application.
- All Next.js application source uses strict TypeScript: `.ts` without JSX and `.tsx` with JSX.
- `tsconfig.json` keeps `strict: true`, `noEmit: true`, and `allowJs: false`.
- Application data is requested from an external backend through browser-side Axios services.
- Next.js Route Handlers, Server Actions, database access, ORM code, and server-side secrets are out of scope.
- Tailwind CSS v4 and semantic theme tokens are the project styling standard.
- Yellow, near-black, purple, and a Vietnamese crane motif define the current visual direction.
- The root `app/` App Router is retained; this project does not use `src/` or a top-level `features/` directory.
- Shared Axios transport infrastructure and the centralized external endpoint registry live in `lib/api/`; domain API
  services live in `lib/feature/<domain>/api.ts`; shared API contracts live in `types/api.ts`.
- Route-specific implementation is colocated in private `_components/` and `_hooks/` folders. Cross-route code lives
  in root shared folders.
- The frontend and backend are expected to run over HTTP. The application preserves the configured HTTP scheme and
  does not emit HSTS, HTTPS redirects, or `upgrade-insecure-requests`.
- Google OAuth code is implemented but remains unavailable until both `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and
  `NEXT_PUBLIC_GOOGLE_REDIRECT_URI` are configured.

## Open Questions

- Final product name and production logo are not yet confirmed. `Vạn Nẻo` and the current crane artwork are an
  implementation-ready visual direction that may be replaced when brand assets are supplied.
- Persistent sign-in requires a backend-owned secure cookie contract; the current memory-only session ends on reload.
- Google Console browser client configuration and exact redirect allowlisting remain to be supplied.
- Browser HTTPS-First settings, cached HSTS, proxies, DNS, and hosting-platform redirects are outside application
  control.
- The API does not expose the current user's selected reaction, so selected-state restoration is unavailable after a
  reload.
- The live non-production data currently returns empty image arrays for provinces and places, and nested province
  objects in place responses temporarily omit their documented image arrays. The frontend tolerates both cases with
  stable placeholders.
- The API does not guarantee a narrow set of external image hosts, so remote entity images are loaded directly by the
  browser after HTTP(S) URL validation instead of through the Next.js image optimizer.
- Privileged live verification still requires non-production `EDITOR` and `ADMIN` credentials.
