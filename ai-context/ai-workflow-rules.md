# Development Workflow

## Approach

Build incrementally with a spec-driven workflow. Context files define what to build, how to build it, and the current
state of progress. Implement against those specifications; do not invent missing behavior.

## Scope one unit

- Work on one feature unit or subsystem at a time.
- Prefer small, verifiable increments over large speculative changes.
- Do not combine unrelated system boundaries in one implementation step.
- Preserve the frontend-only boundary. Backend requirements must be recorded for the external API team, not
  implemented inside Next.js.

## Handle missing requirements

- Do not invent product behavior, API contracts, route contracts, state shapes, visual requirements, authentication
  behavior, or toolchain decisions.
- Record unresolved decisions under **Open questions** in the active request.
- When no API contract is provided for a UI feature, plan deterministic feature-local mock data rather than a guessed
  live endpoint.
- If browser CORS, cookie, CSRF, or authentication behavior is unknown, record it as an open question.
- A material change to confirmed scope, dependencies, contracts, routing, persistence, security, architecture, or
  acceptance criteria requires updating the active request and obtaining confirmation again.

# AI Workflow

## Before any repository change

1. Read:
   - `ai-context/project-overview.md`

2. Read any skills explicitly referenced by the user.

3. Inspect only the relevant code needed for the request.

4. Ask a focused clarification question only if meaningful ambiguity would materially change the result.

5. Create or update **exactly one** implementation prompt under:

   `ai-context/prompts/`

   Example:

   - `2026-07-28-add-profile-page.md`
   - `2026-07-28-fix-dashboard-filter.md`

   The prompt must start with:

   ```yaml
   ---
   id: "{{REQUEST_ID}}"
   status: awaiting-confirmation
   created_at: "{{CREATED_AT_ISO_8601}}"
   confirmed_at: null
   completed_at: null
   ---
   ```

   It must include:

   - Goal
   - Skills read
   - Existing code inspected
   - Files likely to change
   - Decisions / assumptions
   - Open questions
   - Implementation requirements
   - API contract and external backend dependencies
   - Security requirements
   - Accessibility requirements
   - Acceptance criteria
   - Checks to run
   - Manual testing steps
   - For UI work:
     - Visual interpretation
     - Layout
     - Typography
     - Spacing
     - Colors
     - Interaction states
     - Responsiveness
     - Accessibility
     - Pixel-perfect expectations

6. Ask for confirmation:

   > I prepared the implementation prompt at `ai-context/prompts/<file-name>.md`. Is this good to execute?

## Confirmation

Only treat these replies as approval:

- confirm
- approved
- implement it
- y
- yes
- ok

Questions, discussion, changed requirements, or silence are not confirmation.

If requirements change before confirmation:

- Update the same prompt file.
- Keep its status as `awaiting-confirmation`.
- Ask for confirmation again.

Before confirmation:

- Only the active prompt under `ai-context/prompts/` may be modified.
- Do not edit application code or other context documents.
- Do not update dependencies or lockfiles.
- Do not generate assets.
- Do not modify build, deployment, or environment configuration.

## After confirmation

1. Reload the approved prompt from `ai-context/prompts/`.

2. Verify:

   - Its status is `awaiting-confirmation`.
   - The user's confirmation refers to the active request.

3. Update:

   ```yaml
   status: in-progress
   confirmed_at: "{{CURRENT_ISO_8601}}"
   ```

4. Before implementation, read:

   - `ai-context/architecture-context.md`
   - `ai-context/code-standards.md`

   Follow both documents before making architecture or implementation decisions.

5. Reinspect relevant files if they may have changed since the prompt was prepared.

6. Implement exactly the approved prompt.

7. Run the required checks.

8. Synchronize affected AI context documents when implementation changes:

   - Product scope or routes.
   - API contracts or backend dependencies.
   - Architecture or state ownership.
   - Security decisions.
   - Code conventions.
   - Open questions or user testing notes.

9. Mark the prompt completed:

   ```yaml
   status: completed
   completed_at: "{{CURRENT_ISO_8601}}"
   ```

   Do this only after implementation and required validation finish.

10. Report:

    - The outcome.
    - Files changed.
    - Checks executed, with exact commands.
    - Exact manual testing steps.
    - Known limitations and unresolved backend dependencies.

## Rules

- Never implement before the implementation prompt exists and has explicit approval.
- Never skip required context.
- Never assume confirmation.
- Never claim a check, browser behavior, responsive result, or API behavior that was not verified.
- Modify only files required by the approved prompt.
- New Next.js application files must use `.ts` or `.tsx`, and every implementation must pass `npm run typecheck`.
- Do not solve backend gaps by adding Next.js server code.
- If a requested feature requires a server-only secret or privileged API operation, stop that part of implementation
  and document the external backend requirement.

## Keeping docs in sync

Update the relevant context when implementation changes:

- System architecture or frontend/backend boundaries.
- Public routes or navigation behavior.
- Redux or local state ownership.
- External API contracts.
- Authentication, browser storage, CORS, CSRF, or security decisions.
- Feature scope and acceptance criteria.

Progress must reflect actual state, not intended state.

## Before closing a unit

1. The unit works end to end within its confirmed scope.
2. No invariant in `architecture-context.md` or `code-standards.md` is violated.
3. Lint, type checks, relevant tests, and the production build pass, or exact blockers are reported.
4. API-backed behavior has deterministic test coverage or documented manual verification against a non-production API.
5. The user receives concise verification steps.
