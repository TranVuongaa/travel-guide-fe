# Project Overview

Complete this document before implementation begins. Do not guess missing product or API behavior.

## Goal

<!-- Describe the product and the user problem it solves. -->

## Core User Flows

<!-- Example:
1. The user signs in through the external API.
2. The user opens the dashboard.
3. The user views and updates a resource.
-->

## Route Map

<!-- List public and authenticated browser routes and their purpose. -->

## External API

- API owner: <!-- Team or service that owns the backend. -->
- Base URL variable: `NEXT_PUBLIC_API_BASE_URL`
- Authentication method: <!-- Prefer secure cookies owned by the backend; document the actual contract. -->
- API contract source: <!-- OpenAPI URL, documentation, types package, or other source of truth. -->
- Browser origins/CORS: <!-- Document allowed local, staging, and production origins. -->

## State Ownership

<!-- Identify local component state, URL state, and Redux state. Keep Redux limited to shared client state. -->

## Localization

<!-- List supported locales and the localization library, or state that localization is not required. -->

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

<!-- Record the unit, component, and end-to-end testing tools used by the project. -->

## Confirmed Decisions

- Next.js is a frontend-only application.
- All Next.js application source uses strict TypeScript: `.ts` without JSX and `.tsx` with JSX.
- `tsconfig.json` keeps `strict: true`, `noEmit: true`, and `allowJs: false`.
- Application data is requested from an external backend through browser-side Axios services.
- Next.js Route Handlers, Server Actions, database access, ORM code, and server-side secrets are out of scope.
- Tailwind CSS v4 and semantic theme tokens are the project styling standard.
- Yellow, near-black, purple, and a Vietnamese crane motif define the current visual direction.

## Open Questions

- Final product name and production logo are not yet confirmed. `Vạn Nẻo` and the current crane artwork are an
  implementation-ready visual direction that may be replaced when brand assets are supplied.
- Destination data, search, itinerary building, localization scope, and external API contracts remain undefined.
