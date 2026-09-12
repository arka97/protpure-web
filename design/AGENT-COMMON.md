# Common instructions for v5 page agents

You are one of two agents restyling the Protpure website onto the **Deep Field** design system, which is now merged into `revamp/v5` (commit `07ddb2f` or later). Read, in this order:

1. `design/BUILD-BRIEF.md` — the decision, the eight Clean Room carry-overs, the non-negotiables.
2. `design/concepts/deep-field/DIRECTION.md` — tokens, type ramp, spacing, components.
3. The Deep Field boards for your pages (`design/concepts/deep-field/*.html`) and the Clean Room boards for the carried-over details (`design/concepts/clean-room/*.html`). They are implementable CSS: open the `<style>` and markup.
4. What already exists on the branch, and must be **reused, not duplicated**:
   - Tokens/utilities: `src/app/(frontend)/globals.css` (`@theme` colours `field`, `field-raised`, `ink`, `surface`, `surface-recessed`, `teal-lum`, `teal-deep`, `tint`, `text-2`, `rule`, `ok`, `attention`, `error`; `--font-display` / `--font-sans` / `--font-mono`; utilities `eyebrow`, `mono`, `num`, `surface-dark`, `surface-raised`, `surface-recessed`, `surface-accent`, `container-x`, `btn*`, `spec-table`, `compare-table`, `table-note`, `placeholder-slot`, `arch` image treatments, `reveal`). Legacy aliases (`navy-*`, `teal-500`, `ink-soft`, `surface-2`, `line`, `card`, `chip`, `section`, `section-tight`) still exist so old pages render; **replace them with the new tokens in every file you touch**, and delete an alias from globals.css only when `grep` shows it unused.
   - Visual components: `src/components/visual/{Chapter,BeadField,BeadSchematic,RangeBars,Reveal,icons}.tsx` (`Chapter`, `ChapterHead`, `ChapterEyebrow`, `TONE_CLASS`, `ModeEmblem`, stroke icons — no lucide in new code).
   - UI primitives: `src/components/ui/index.tsx` (`ButtonLink`, `CmsImage`, `CmsLinks`, `Badge`, `StatusBadge`, `Breadcrumbs`, `KeyValue`, `EmptyState`, `SectionHeader`).
   - Shell: `src/components/layout/{Header,Footer}.tsx`, `src/components/PageHero.tsx` (`PageHero`, `ListingHero`), `src/components/product/cards.tsx`, `src/components/rfq/*` + `src/lib/rfq.ts` (basket: restyle only, never rebuild), `src/components/blocks/RenderBlocks.tsx` (the homepage is finished — look at it for the idiom: chapters, `RAIL`/`SPREAD` grids, `Heading` with `*italic*`, `Paragraphs`).
   - Data: `src/lib/data.ts` only (never `getPayload` in pages), `src/lib/catalog.ts`, `src/lib/trust.ts`.

## Rules

- Copy is CMS content or already-published facts. Never invent numbers, customers, certifications. Paid sample kits / evaluation packs, never "free samples".
- One primary action per page: **Add to RFQ** / **Request a quote** (opens the basket drawer when it has items). Secondary: Download datasheet.
- Every product card and ordering row gets `AddToBasketButton` (grade + pack size). Mono tabular numerals for every value, catalogue number, d50, flow, DBC, pH, count.
- Server components by default; `'use client'` only for interaction. `next/image` via `CmsImage`/`mediaUrl()`. Semantic landmarks, `aria-current`, `<th scope>`, 44 px touch targets, visible focus (already in globals.css), WCAG AA.
- If you change a collection or block schema: `pnpm generate:types` → `pnpm migrate:create <name> --skip-empty` → commit the migration. Prefer not to; most of this work is rendering.
- Keep AI surfaces in sync when the content shape changes: `src/lib/markdown.ts`, `src/lib/public-api.ts`, `src/app/mcp/route.ts`.
- Checks before you finish: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`.
- Screenshots of every page you touched at 1440 and 390: `node <worktree>/scripts/shot.mjs` does not exist — write your own under your scratchpad: `import { chromium } from '<worktree>/node_modules/playwright-core/index.mjs'`, `chromium.launch({ args: ['--no-sandbox'] })`; scroll with `window.scrollTo({ top, behavior: 'instant' })` (the site uses smooth scrolling) so the `.reveal` IntersectionObserver fires before a full-page capture. Tile tall captures with `sharp` (in node_modules) and actually look at them; fix what looks wrong.

## Local environment

- Copy `.env` from the main checkout (`/home/arka/projects/protpure-web/.env`) into your worktree and change `DATABASE_URL` to **your** database and `NEXT_PUBLIC_SERVER_URL` to **your** port (given in your task). Your database is a fresh clone of the seeded main DB; schema push is fine there.
- One shared Postgres in docker (`protpure-web-db-1`); `docker exec protpure-web-db-1 psql -U protpure -d <yourdb>` for inspection.
- `PORT=<yours> pnpm dev` (run it with `nohup … > dev.log &` and stop it before `pnpm build`; the machine has 8 GB, one Next process per agent). After re-seeding (`pnpm seed`), delete `.next/dev/cache/fetch-cache` and restart dev — `unstable_cache` persists across restarts.
- `next dev` appends a generated block to `CLAUDE.md`: `git checkout -- CLAUDE.md` before committing.
- Never `git stash` (shared stash). Never push, never merge, never touch `.claude/`. Commit in logical steps with the attribution lines from your instructions.
- Ports 3000 (tunnel), 3001 (main dev service) and 5432 are taken.

Finish with a report: files changed, what each page now does, screenshots' paths, anything left undone and why.
