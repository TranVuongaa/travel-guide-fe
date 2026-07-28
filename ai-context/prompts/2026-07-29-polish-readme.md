---
id: "2026-07-29-polish-readme"
status: completed
created_at: "2026-07-29T00:47:23+07:00"
confirmed_at: "2026-07-29T00:50:13+07:00"
completed_at: "2026-07-29T00:51:05+07:00"
---

# Goal

Polish the root README so it presents the travel-guide frontend clearly, looks intentional in rendered Markdown,
and gives contributors the essential setup and verification information without becoming verbose.

# Skills read

- None.

# Existing code inspected

- `ai-context/project-overview.md`
- `ai-context/ai-workflow-rules.md`
- `README.md`
- `.env.example`
- `package.json`
- `DEPLOY_README.md`
- The current uncommitted diff for `README.md`

# Files likely to change

- `README.md`
- `ai-context/prompts/2026-07-29-polish-readme.md` for workflow status updates

# Decisions / assumptions

- Preserve the user's current uncommitted intent to prominently expose the frontend demo and backend API docs links.
- Correct the visibly corrupted Vietnamese project name to `Vạn Nẻo`.
- Use concise Markdown sections, a small technology overview, copyable setup commands, environment-variable guidance,
  quality-check commands, and short security/authentication notes.
- Use proper Markdown links instead of bare URLs.
- Keep the README focused on local development and project orientation; detailed EC2 deployment remains in
  `DEPLOY_README.md`.
- Do not add badges whose values or external services have not been confirmed.

# Open questions

- The final product name is not confirmed in the project overview; `Vạn Nẻo` is the current implementation-ready name.
- No public repository URL or CI badge endpoint is confirmed, so neither will be added.

# Implementation requirements

- Add a clear title and concise project description.
- Present the live frontend and API documentation as clickable links.
- Summarize the primary stack using only dependencies confirmed in `package.json`.
- Document prerequisites and local startup using npm and `.env.example`.
- Document required and optional public environment variables without exposing secrets.
- List the existing lint, typecheck, test, and production-build commands.
- Include short notes about frontend-only architecture, memory-only authentication tokens, Google OAuth availability,
  and external API authorization.
- Link to `DEPLOY_README.md` for deployment details rather than duplicating its content.
- Preserve UTF-8 Vietnamese text and end the file with a newline.

# API contract and external backend dependencies

- The external API base URL remains configured through `NEXT_PUBLIC_API_BASE_URL`.
- The currently documented API and demo host is `http://52.62.25.92`.
- Google OAuth remains optional and requires both `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and
  `NEXT_PUBLIC_GOOGLE_REDIRECT_URI`.
- No backend contract or endpoint changes are in scope.

# Security requirements

- Do not include private credentials, client secrets, tokens, or values from the local `.env`.
- State that browser-exposed `NEXT_PUBLIC_*` values are public configuration.
- Preserve the documented memory-only token behavior and external-backend authorization boundary.

# Accessibility requirements

- Use a logical heading hierarchy and descriptive link labels.
- Avoid decorative formatting that makes the document harder to scan.
- Keep code examples copyable and language-tagged.

# Acceptance criteria

- The README renders as clean, structured Markdown.
- The project name and Vietnamese text display correctly in UTF-8.
- Demo and API documentation links are clickable and retain the user's supplied destinations.
- Setup commands, environment variables, scripts, and architecture notes match inspected repository files.
- No secret or unverified project claim is added.
- Only README/documentation workflow files change.

# Checks to run

- `git diff --check`
- Manually compare README commands with `package.json`.
- Manually compare environment-variable names with `.env.example`.

# Manual testing steps

1. Open the rendered `README.md` preview.
2. Confirm headings, lists, tables, and code blocks render correctly.
3. Open the frontend demo and API documentation links.
4. Copy the local setup commands and verify their paths and script names match the repository.
