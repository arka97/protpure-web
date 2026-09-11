# Protpure v5 — build brief (chosen direction)

**Decision (11 Sep 2026):** build **Deep Field**, borrowing the best of **Clean Room**. Paper & Ink is not used.

Source of truth for the look: `design/concepts/deep-field/DIRECTION.md` (tokens, type ramp, spacing, geometry, component notes) and the four Deep Field boards (`home.html`, `home-mobile.html`, `catalogue.html`, `product.html`). Open the boards in a browser or read their `<style>` and markup: they are implementable CSS. Screenshots of the current v4 site and of the boards' competitors are in `design/references/`.

## What to carry over from Clean Room (`design/concepts/clean-room/`)

1. **Bead cross-section schematic** — the annotated "FIG. 01 / SCHEMATIC" line drawing of an agarose bead (cross-linked agarose, ligand, open pores, 6% matrix) from the Clean Room hero. Use it as a reusable SVG component (`BeadSchematic`) for the Technology page hero and the product-page "chemistry" panel; on the homepage, Deep Field's photograph stays the hero image. Draw in the Deep Field palette (luminous teal lines on dark, deep teal on light).
2. **Mono tabular numerals everywhere data appears** — IBM Plex Mono with `font-variant-numeric: tabular-nums` for every spec value, catalog number, d50, flow figure, DBC, pH range, count badge. Units in DM Sans. This is already in the Deep Field spec; Clean Room shows how far to take it (stat row, card specs, filter counts).
3. **Range-bar particle platform with axis** — the four-grade platform is a horizontal bar per grade (size range) with a d50 tick and a 0–250 µm axis, plus the max-flow figure at the right. Deep Field's board already does this in dark; keep Deep Field's dark treatment and Clean Room's axis labels, tick marks and the caption "Range = particle size distribution. Marker = d50V…".
4. **Comparison table with a tinted Protpure column** and a `note` row — both boards do this; use Deep Field's `#e0f2ea` tint and Clean Room's column header styling (small caps label, teal).
5. **Numbered chapter labels** (`01 / THE CATALOGUE`, `02 / THE PARTICLE PLATFORM`…) as the eyebrow pattern for homepage and long pages. The CMS `eyebrow` field supplies the text; the number is derived from the block's position among "chapter" blocks.
6. **Catalogue sidebar** — checkbox filter groups with counts (chromatography mode, exchanger type, grade / bead size, availability), "Reset", result count, sort select, and the inline "Find the right chemistry in three steps" entry above the grid. Cards show the 2–3 scanned specs (DBC, max flow / range, grades + d50) in mono, grade + pack selects, Compare checkbox and **Add to RFQ**.
7. **Product page** — sticky section nav (Overview · Grades · Specifications · Ordering · Documents · FAQ) plus a **sticky bottom quote bar** (product name · availability · lead time · Datasheet · "Choose grade & add to RFQ"). Ordering is a pack-size table with one Add-to-RFQ button per row and quantity input; a "Paid evaluation packs — qualify before you scale" callout under it; "Documentation for qualification" document cards.
8. **Trust strip** directly under the hero: BioProcess grade · Used in GMP facilities · CoA with every lot · Made in India (from Site settings → certifications).

## Non-negotiables

- Paid sample kits, never "free samples" (copy everywhere: FAQ, CTAs, llms.txt, MCP, emails).
- RFQ basket is the primary conversion: "Add to RFQ" on every product card and ordering row; header basket with count; "Request a quote" opens the basket drawer when it has items. The basket already exists functionally (`src/components/rfq/*`, `src/lib/rfq.ts`); restyle it, do not rebuild it.
- Everything stays CMS-driven: blocks in `src/blocks/config.ts` rendered by `src/components/blocks/RenderBlocks.tsx`; content from `src/lib/data.ts`. New sections = new blocks (+ seed in `src/seed/data/*` + DB update of the live page via the Payload local API, as the seed does). Never hard-code page copy in React.
- Placeholders are CMS slots, not hard-coded text: e.g. a `logoWall` block renders "Customer logos coming soon" styling only when empty, in a way an editor can fill; team photo slot shows initials until a photo is uploaded.
- Fonts self-hosted via fontsource: `@fontsource/instrument-serif` (400 + italic), `@fontsource-variable/dm-sans`, `@fontsource/ibm-plex-mono` (400, 500). Remove Inter/Manrope.
- Tailwind 4 `@theme` tokens in `src/app/(frontend)/globals.css` named after DIRECTION.md roles (`--color-field`, `--color-field-raised`, `--color-ink`, `--color-surface`, `--color-surface-recessed`, `--color-teal-lum`, `--color-teal-deep`, `--color-tint`, `--color-text-2`, `--color-text-2-dark`, `--color-rule`, `--color-rule-dark`, `--color-ok`, `--color-attention`, `--color-error`) plus `--font-display`, `--font-sans`, `--font-mono`. Radii 2 px (cards/buttons), full for marks; the 200 px / 240 px image arch; no card shadows.
- Motion: one restrained reveal (fade/translate 12 px, 400 ms, ease-out) on chapter entry via IntersectionObserver; respect `prefers-reduced-motion`. No parallax, no scroll-jacking.
- Accessibility: WCAG AA contrast on every text/background pair in DIRECTION.md, visible focus (2 px luminous-teal outline on dark, deep-teal on light), 44 px touch targets, semantic landmarks, `aria-current` on nav, tables with `<th scope>`.
- Performance: no client components unless interactive; images through `next/image` and `mediaUrl()`; hero image `priority`; SVG motifs inline and light (the bead field is one `<svg>` with ≤ 80 circles, no filters).
- Keep every AI surface in sync when content shape changes (`src/lib/markdown.ts`, `src/lib/public-api.ts`, `src/app/mcp/route.ts`).
- Checks before you finish: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`, plus screenshots at 1440 and 390 of every page you touched (Playwright: `import { chromium } from '<worktree>/node_modules/playwright-core/index.mjs'`, `chromium.launch({ args: ['--no-sandbox'] })`; Chromium headless shell is installed).

## Local environment notes for agents

- One shared Postgres (docker compose in the main checkout). Run your dev server on your own port with `PORT=<port> PAYLOAD_DB_PUSH=false pnpm dev` unless your branch changes the schema. Only one `pnpm build` or dev server per agent at a time; the machine has 8 GB RAM.
- Copy `.env` from the main checkout and change `NEXT_PUBLIC_SERVER_URL` to your port.
- `next dev` appends a generated block to `CLAUDE.md`; revert it before committing.
- Commit messages end with the attribution lines given in your instructions. Never push, never merge.
