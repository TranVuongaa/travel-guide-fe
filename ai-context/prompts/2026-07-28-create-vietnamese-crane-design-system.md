---
id: "2026-07-28-create-vietnamese-crane-design-system"
status: completed
created_at: "2026-07-28T20:22:26+07:00"
confirmed_at: "2026-07-28T20:24:22+07:00"
completed_at: "2026-07-28T20:33:57+07:00"
---

# Goal

Replace the default Next.js starter screen with a polished, static travel-guide homepage that demonstrates a
reusable Tailwind CSS v4 design system inspired by Vietnam. Use yellow, black, and purple as the primary visual
palette, with a stylized Vietnamese crane as the brand motif. Update the project code standards to make Tailwind the
confirmed styling convention.

# Skills read

- None. The user did not request a project skill, and the approved workflow does not require one for this task.

# Existing code inspected

- `AGENTS.md`
- `ai-context/project-overview.md`
- `ai-context/ai-workflow-rules.md`
- `ai-context/architecture-context.md`
- `ai-context/code-standards.md`
- `package.json`
- `postcss.config.mjs`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`

# Files likely to change

- `app/globals.css`
- `app/layout.tsx`
- `app/page.tsx`
- `ai-context/code-standards.md`
- `ai-context/project-overview.md`
- `package.json` (add the workflow-required `typecheck` script; no dependency or lockfile change)
- `tsconfig.json` (enforce the documented TypeScript-only `allowJs: false` baseline)

# Decisions / assumptions

- "System style" means a reusable visual system implemented with Tailwind CSS v4 tokens and utilities, demonstrated
  on the current homepage.
- The default starter screen will become a static Vietnamese travel-guide landing page. No unconfirmed route, form,
  authentication, persistence, or API behavior will be introduced.
- User-facing copy will be Vietnamese, and the document language will be `vi`.
- The crane will be an original, code-native inline SVG mark/illustration. It will not require an external image,
  remote source, generated bitmap, or new dependency.
- The primary palette will use warm yellow as the main action/accent color, near-black as the grounding neutral, and
  deep purple as the supporting brand color. Semantic Tailwind theme tokens will be used instead of scattered raw
  color values.
- The existing root-level `app/` structure will be preserved; migrating the project into `src/` is outside this
  visual-system unit.
- Static, deterministic sample destinations may be used solely to demonstrate cards and visual hierarchy.

# Open questions

- The final product name and production logo are not yet defined. The implementation will use a tasteful temporary
  Vietnamese travel brand name and an original crane mark that can be replaced later.
- Destination content and calls to action are illustrative until product requirements and API contracts are defined.

# Implementation requirements

- Keep the application frontend-only and use the existing App Router and strict TypeScript.
- Use Tailwind CSS v4 as already installed; do not add a UI library or styling dependency.
- Define semantic color, typography, radius, shadow, and layout tokens in `app/globals.css` using Tailwind v4 theme
  configuration and CSS custom properties where appropriate.
- Remove the generated Next.js starter UI and create a refined homepage containing:
  - A compact brand/header treatment.
  - A high-impact hero with a Vietnamese crane motif.
  - Clear travel-guide value proposition and primary/secondary actions.
  - A small set of static editorial/destination content to demonstrate the design language.
  - A footer or closing brand statement.
- Keep the visual composition editorial and distinctive rather than a generic SaaS template.
- Use reusable utility patterns and semantic tokens; avoid unnecessary extraction of one-use components.
- Update metadata and the root document language for the Vietnamese experience.
- Update `ai-context/code-standards.md` so Tailwind CSS v4 is the project styling standard, including semantic token,
  class composition, responsive, focus, and arbitrary-value guidance.
- Update `ai-context/project-overview.md` to record the confirmed Tailwind design system and brand direction.
- Add `npm run typecheck` as `tsc --noEmit` so the repository satisfies its documented workflow.
- Do not add API requests, Redux state, client-side state, Server Actions, Route Handlers, or backend behavior.

# API contract and external backend dependencies

- No external API is required for this implementation.
- All display content is deterministic and local.
- Future live destinations, search, and itinerary behavior require a separately confirmed external API contract.

# Security requirements

- Do not add secrets, environment variables, remote scripts, raw HTML injection, or third-party runtime content.
- Internal navigation must use safe, explicit paths. Any placeholder control that does not have a confirmed route must
  not imply working persistence or API behavior.

# Accessibility requirements

- Use semantic landmarks and heading order.
- All interactive elements must be keyboard reachable and have clear accessible names.
- Preserve highly visible focus indicators across the yellow, black, and purple surfaces.
- Maintain WCAG AA text contrast for normal text.
- Mark purely decorative crane artwork as hidden from assistive technology; give meaningful branding an accessible
  text equivalent.
- Respect `prefers-reduced-motion`, touch target sizing, browser zoom, and text resizing.
- Avoid color as the only carrier of meaning.

# Acceptance criteria

- The default Next.js starter content is fully removed.
- The homepage visibly uses a cohesive yellow, black, and purple visual language.
- A recognizable, original Vietnamese crane motif is integrated into the brand/hero composition.
- The layout remains usable without horizontal scrolling at narrow mobile, tablet, laptop, and wide desktop sizes.
- Typography, spacing, radii, borders, shadows, focus states, and color roles are driven by reusable Tailwind/CSS
  tokens rather than repeated raw values.
- The page has no unconfirmed dynamic product behavior and does not call an API.
- `ai-context/code-standards.md` explicitly documents Tailwind CSS v4 as the styling standard.
- `ai-context/project-overview.md` records the design-system decision.
- The root metadata and `lang` value are appropriate for the Vietnamese travel-guide homepage.
- Lint, strict TypeScript, and production build checks pass.

# Checks to run

- `npm run lint`
- `npm run typecheck`
- `npm run build`

# Manual testing steps

1. Run `npm run dev`.
2. Open `http://localhost:3000`.
3. Verify the header, hero, crane artwork, destination/editorial content, and closing section render correctly.
4. Resize through approximately 320 px, 768 px, 1024 px, and 1440 px widths; confirm no horizontal overflow or
   clipped content.
5. Navigate all links and controls with the keyboard; confirm focus is obvious on light and dark surfaces.
6. Enable reduced-motion at the operating-system/browser level and confirm non-essential motion is removed.
7. Check Vietnamese diacritics, heading order, landmark navigation, and text contrast with browser accessibility
   tools.

# Visual interpretation

The visual direction should feel like a contemporary Vietnamese editorial travel journal: sun-washed yellow,
lacquer-like black, imperial purple, generous negative space, fine graphic lines, and a crane rendered with elegant
curves. The crane is a cultural/nature-inspired motif, not a photorealistic illustration or official national emblem.

# Layout

- Mobile-first, with a compact stacked header and hero at small widths.
- A wide editorial grid on desktop, balancing oversized Vietnamese typography with the crane artwork.
- Subsequent content uses asymmetric cards/panels that still follow a consistent content-width system.
- Prefer Grid, Flexbox, and normal document flow; use absolute positioning only for contained decorative elements.

# Typography

- Use a Vietnamese-capable font supplied through `next/font` or the existing bundled font setup.
- Establish distinct display, heading, body, label, and metadata roles.
- Favor bold, condensed-feeling display scale and comfortable body line length.
- Ensure Vietnamese diacritics render correctly at every weight used.

# Spacing

- Use a small, documented semantic scale for page gutters, section rhythm, card padding, and control gaps.
- Preserve generous hero whitespace while remaining compact enough on small mobile screens.

# Colors

- Primary action/accent: warm yellow.
- Primary ink/background: near-black.
- Supporting brand/accent: deep purple.
- Supporting surfaces: warm off-white and restrained translucent/tinted variants.
- Use semantic names such as canvas, ink, brand, accent, muted, border, and focus rather than hue-number names in
  application markup.

# Interaction states

- Links and buttons need distinct default, hover, active, and focus-visible states.
- Motion must be restrained and support hierarchy, with reduced-motion fallbacks.
- Static sample content must not masquerade as a completed API-backed search or booking flow.

# Responsiveness

- The design must work from 320 px upward without horizontal scrolling.
- Type and spacing may scale fluidly with bounded values.
- Cards and navigation should stack or wrap cleanly at small widths and use editorial grids at larger widths.

# Accessibility

- Meet the requirements in the dedicated accessibility section above.
- Decorative text and artwork must not create duplicate announcements.
- Button/link labels must communicate destination or intent without relying on surrounding decoration.

# Pixel-perfect expectations

- No external design file was supplied, so exact reproduction is not expected.
- Internal alignment, spacing rhythm, visual balance, border weight, and token consistency should be polished and
  deliberate across the defined responsive widths.
