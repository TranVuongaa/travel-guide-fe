# Next.js TypeScript Frontend Context and Standards

This folder is a reusable AI context template for frontend-only Next.js projects.

It assumes:

- Next.js with the App Router.
- TypeScript in strict mode for all application source.
- `.ts` for modules without JSX and `.tsx` for components or other modules containing JSX.
- React functional components and Hooks.
- Redux Toolkit for shared client state.
- Axios for browser-to-API communication.
- An independently deployed backend owns APIs, authentication, business logic, and data persistence.

Start by completing `ai-context/project-overview.md`. AI implementation work must then follow
`ai-context/ai-workflow-rules.md`.

## Frontend-only boundary

Next.js is used as the web UI and delivery framework. It is not the application backend.

- Browser-side Axios services call the external API.
- Axios request/response contracts, Redux state, component props, Hooks, and environment configuration are typed.
- Do not add Route Handlers, Server Actions, database clients, ORM code, or backend business logic.
- Do not expose secrets through `NEXT_PUBLIC_*` variables.
- The external API must support the browser origin and own authentication security.
- If an integration requires a server-only secret, implement it in the external backend, not in this project.

## Context files

- `ai-context/project-overview.md`: Product scope, user flows, API ownership, and project decisions.
- `ai-context/architecture-context.md`: Folder structure, dependency rules, and frontend/API boundaries.
- `ai-context/code-standards.md`: TypeScript, React, Next.js, Redux Toolkit, Axios, styling, and testing rules.
- `ai-context/ai-workflow-rules.md`: Required prompt, confirmation, implementation, and validation workflow.
