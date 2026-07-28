---
id: "2026-07-28-display-place-province-images"
status: completed
created_at: "2026-07-28T23:14:56.9884718+07:00"
confirmed_at: "2026-07-28T23:18:32.4086555+07:00"
completed_at: "2026-07-28T23:23:32.7713293+07:00"
---

# Goal

Consume the newly documented image metadata for provinces and places and present those images appropriately across
the existing destination discovery, destination detail, place management, and province management experiences.

# Skills read

- None. The user did not request a project skill, and the approved workflow does not require one for this change.

# Existing code inspected

- `ai-context/project-overview.md`
- `ai-context/ai-workflow-rules.md`
- `types/api.ts`
- `next.config.ts`
- `package.json`
- `app/globals.css`
- `app/_components/HomeFeed.tsx`
- `app/(public)/destinations/_components/DestinationsExplorer.tsx`
- `app/(public)/destinations/[id]/_components/DestinationDetail.tsx`
- `app/(account)/manage/places/_components/ManagePlaces.tsx`
- `app/(admin)/admin/_components/TaxonomyManager.tsx`
- `lib/feature/places/api.ts`
- `lib/feature/provinces/api.ts`
- Live OpenAPI document at `http://52.62.25.92/api/docs-json`
- Read-only live responses from `GET /api/v1/provinces?limit=100` and `GET /api/v1/places?limit=100`

# Files likely to change

- `types/api.ts`
- A new reusable image presentation component under `components/ui/`
- Focused tests for image selection, fallback, alt text, error handling, and attribution behavior
- `app/_components/HomeFeed.tsx`
- `app/(public)/destinations/_components/DestinationsExplorer.tsx`
- `app/(public)/destinations/[id]/_components/DestinationDetail.tsx`
- `app/(account)/manage/places/_components/ManagePlaces.tsx`
- `app/(admin)/admin/_components/TaxonomyManager.tsx`
- `ai-context/project-overview.md`
- This implementation prompt

# Decisions / assumptions

- `ProvinceResponseDto.images` and `PlaceResponseDto.images` are read-only response fields. The current
  `CreateProvinceDto`, `UpdateProvinceDto`, `CreatePlaceDto`, and `UpdatePlaceDto` contracts do not accept image
  fields, so image upload/edit controls are outside this request.
- An entity's primary image is the valid entry with the lowest `sortOrder`; stable API order breaks ties.
- Place imagery takes precedence. When a place has no usable image, its province's primary image is used when the
  nested province response supplies one.
- Empty, invalid, or failed image URLs show a quiet branded placeholder and never hide essential text or actions.
- Destination detail uses the primary image as a wide editorial hero and presents remaining place images as a
  responsive gallery. The province fallback is not duplicated as gallery content.
- Homepage and destination discovery cards use a consistent image-first card treatment. Place-management rows use a
  compact thumbnail, and province-management rows show the province thumbnail only for the province variant.
- Category management remains visually and behaviorally unchanged.
- Detailed image attribution is shown with the destination detail imagery using the API's source, author, license
  name, and license URL metadata when available. Compact card thumbnails retain meaningful alt text without adding
  crowded attribution UI.
- API image URLs are arbitrary absolute URIs and the contract does not define a fixed allowlist of hosts. Images will
  therefore be loaded directly by the browser through one isolated shared component instead of opening a wildcard
  Next.js image optimizer/proxy allowlist. The component will document the reason for not using `next/image`.
- No image lightbox, carousel, upload flow, or image mutation is included.

# Open questions

- The live non-production API currently returns empty `images` arrays for all 34 provinces and all 6 published
  places, despite the fields being present in OpenAPI. Real-image rendering must therefore be covered
  deterministically in tests and manually rechecked when the backend provides populated data.
- Live place responses currently omit `images` from their nested `province` object even though
  `ProvinceResponseDto.images` is required by OpenAPI. The frontend will tolerate that transitional mismatch and use
  the place placeholder when no nested province image is available.
- The API does not document a fixed set of image hostnames. If the backend later guarantees a narrow host allowlist,
  the shared presentation component can be migrated to `next/image` optimization in a separate change.

# Implementation requirements

- Add a strictly typed `EntityImage` contract matching `EntityImageResponseDto`: `id`, `url`, `sourcePageUrl`,
  `altText`, nullable `author`, `licenseName`, nullable `licenseUrl`, nullable `width`, nullable `height`, and
  `sortOrder`.
- Add required `images: EntityImage[]` fields to `Province` and `Place`.
- Keep image selection and rendering behavior centralized so sorting, fallback, loading, failure handling, alt text,
  and external-link safety are consistent.
- Treat blank or non-HTTP(S) image/source/license URLs as unusable rather than rendering them.
- Use the API-provided `altText` when nonblank; otherwise fall back to a concise entity-name-based Vietnamese alt.
- Reserve a stable aspect ratio to prevent layout shift even when metadata dimensions are missing.
- Use lazy loading for card, management, and gallery images; the destination-detail primary hero may load eagerly.
- Reset failure state when the rendered image URL changes.
- Add safe source/license links only for validated HTTP(S) URLs, and open external attribution links with
  `rel='noreferrer noopener'`.
- Display the chosen primary place/province image on the homepage place cards, destination result cards, destination
  detail, place-management rows, and province-management rows.
- On destination detail, render all usable place images once, ordered by `sortOrder`, with responsive crops and
  readable attribution. If no place image is usable, render at most the province fallback or placeholder.
- Preserve all existing fetching, filters, pagination, permissions, mutations, links, and error/empty/loading states.
- Do not add a dependency, backend behavior, Next.js route handler, server-side secret, or browser persistence.
- Keep all application source in `.ts` or `.tsx` and pass strict TypeScript checks.

# API contract and external backend dependencies

- `ProvinceResponseDto` now requires `images: EntityImageResponseDto[]`.
- `PlaceResponseDto` now requires `images: EntityImageResponseDto[]` and references `ProvinceResponseDto`.
- `EntityImageResponseDto` requires `id`, `url`, `sourcePageUrl`, `altText`, `licenseName`, and `sortOrder`; `author`,
  `licenseUrl`, `width`, and `height` are nullable.
- OpenAPI describes `author`, `licenseUrl`, `width`, and `height` as nullable objects rather than their concrete scalar
  shapes. Based on their formats and usage, the frontend will represent `author` as `string | null`,
  `licenseUrl` as `string | null`, and dimensions as `number | null`, while remaining defensive at rendering time.
- Existing province/place list and detail services already return the affected DTOs; no endpoint or transport change
  is required.
- Image mutation remains an external backend concern because current create/update DTOs expose no image fields.
- The external backend must populate image arrays before live manual verification can confirm real media and
  attribution rendering.

# Security requirements

- Treat every API-provided image and attribution URL as untrusted.
- Accept only absolute `http:` or `https:` URLs for rendered images and links.
- Do not inject raw HTML, inline styles from the API, scripts, data URLs, blob URLs, or dynamic code.
- Avoid server-side image proxying of arbitrary API URLs.
- Add `referrerPolicy='no-referrer'` to direct external image requests.
- External source and license links must use `target='_blank'` with `rel='noreferrer noopener'`.
- Do not log image URLs, user data, tokens, or authentication state.

# Accessibility requirements

- Every meaningful image has useful alt text from the API or a deterministic entity-name fallback.
- Decorative placeholder artwork is hidden from assistive technology while its container does not replace entity
  text.
- Image failure must not remove headings, descriptions, metadata, links, or management actions.
- Attribution text and links remain keyboard accessible, readable at 200% text zoom, and sufficiently contrasted.
- Cards retain one clear link target and visible focus styling; image additions must not create nested interactive
  content inside those links.
- Gallery markup preserves a logical reading order matching visual order.
- Respect existing reduced-motion behavior and do not add autoplay, parallax, or motion-only cues.

# Acceptance criteria

- TypeScript contracts match the documented province, place, and entity-image response shapes.
- Place cards on `/` and `/destinations` render the primary place image, then the nested province image if present,
  then a stable placeholder.
- `/destinations/[id]` renders a responsive ordered place-image hero/gallery with meaningful alt text and available
  attribution; a province fallback or placeholder is shown when place images are absent.
- `/manage/places` shows compact image thumbnails without reducing access to view, edit, or remove controls.
- `/admin/provinces` shows province thumbnails, while `/admin/categories` is unchanged.
- Invalid URLs and image load failures fall back cleanly with no broken-image icon and no unhandled error.
- Existing no-image API responses still produce intentional, balanced layouts at mobile, tablet, and desktop widths.
- Image rendering does not weaken URL safety or expose the Next.js server as an arbitrary image proxy.
- Deterministic tests cover ordered selection, place-to-province fallback, missing images, invalid URL rejection,
  supplied/fallback alt text, load failure, and attribution-link safety.
- No runtime dependency is added, and unrelated working-tree files remain untouched.

# Checks to run

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

# Manual testing steps

1. Start the frontend with `npm run dev` and open `/`, `/destinations`, and one `/destinations/[id]` route.
2. With the current live API, verify intentional placeholders render without layout shift or broken-image icons.
3. Against a non-production response containing multiple place images, verify the lowest `sortOrder` image is primary,
   remaining images follow in order, alt text is correct, and source/license links open safely.
4. Test a place with no images but a nested province image and verify that province image is used once as the fallback.
5. Test invalid and unreachable image URLs and verify the UI switches to its placeholder while all text and navigation
   remain available.
6. Sign in as `EDITOR` or `ADMIN`, open `/manage/places`, and verify thumbnails coexist with all management actions.
7. Sign in as `ADMIN`, compare `/admin/provinces` and `/admin/categories`, and verify thumbnails appear only for
   provinces.
8. Resize through approximately 320 px, 768 px, and 1440 px widths and verify crops, hero/gallery layout, content
   wrapping, and action placement.
9. Navigate by keyboard and zoom text to 200%; verify focus visibility, card/link semantics, and attribution
   readability.

# Visual interpretation

Images should enrich the established contemporary Vietnamese editorial direction rather than turn the interface into
a generic photo grid. Large destination imagery uses confident crops and generous radii; compact administrative
thumbnails remain functional and restrained. Existing warm canvas, ink, yellow, purple, serif display type, and
graphic placeholders provide continuity when media is absent.

# Layout

- Homepage and destination cards use a media area above their existing textual hierarchy.
- Destination detail places a wide primary image between the title block and descriptive content, with additional
  images in a compact responsive gallery below or adjacent according to available width.
- Management rows use fixed-ratio thumbnails that collapse naturally above text on small screens and sit beside text
  on wider screens.
- Province rows gain a compact thumbnail only when `kind === 'province'`; category rows keep their current geometry.

# Typography

- Preserve existing serif display headings and sans-serif metadata.
- Attribution uses compact sans-serif text but remains legible and does not rely on uppercase or excessive tracking.

# Spacing

- Reuse current page, section, card, and panel spacing.
- Keep a clear gap between media, headings, metadata, and actions; gallery gaps become tighter on small screens without
  touching.

# Colors

- Use existing semantic canvas, surface, ink, muted, line, accent, brand, and focus tokens.
- Placeholders use restrained brand/accent graphic treatment and maintain sufficient contrast.
- Do not derive UI colors from untrusted image data.

# Interaction states

- Card hover and keyboard focus behavior remains intact around the new media area.
- Images transition only through native loading/error states; no decorative motion is added.
- Failed images are replaced by the same placeholder used for absent/invalid images.
- Attribution links have visible hover and focus states.

# Responsiveness

- Media crops remain stable without horizontal overflow from 320 px upward.
- Destination cards retain one column on narrow screens and existing multi-column breakpoints on larger screens.
- The detail gallery moves from one column to a compact multi-column layout when space allows.
- Administrative rows preserve readable text and reachable actions at all current breakpoints.

# Accessibility

- Meaningful alt text, logical image order, noninteractive placeholders, safe attribution links, focus visibility, and
  text zoom resilience are required.
- Media is supplementary; all essential destination and management information remains available as text.

# Pixel-perfect expectations

- New image areas must align with existing card radii, borders, spacing, and responsive grids with no cumulative
  layout shift.
- Object crops should fill their reserved frames consistently while preserving the established typography and action
  alignment.
- Empty/error placeholders must occupy exactly the same frame as successful images so layouts do not jump.
