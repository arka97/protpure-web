# Protpure website v5 — design concept brief

You are the lead designer on a website revamp for **Protpure Tech Pvt. Ltd.**, a scientist-founded manufacturer of agarose chromatography resins in Anand, Gujarat, India (founded May 2023, ~8–10 people, bootstrapped, 600 L/month capacity, resins already used in GMP facilities with repeat orders). Founder: Dr. Rucha P. Desai, materials chemist with two decades in bead polymerisation and ligand coupling.

The site sells B2B, by quotation, to: process-development scientists and procurement teams at Indian biopharma/vaccine/diagnostics companies (primary), CDMOs and research labs, and distributors abroad (Middle East, SE Asia, Europe, North America). The buyer is technical, sceptical of "Indian alternatives", and compares against Cytiva (Capto/Sepharose), Bio-Rad, Purolite, Tosoh. They need: real specs, datasheets, CoA, evidence of reproducibility, and a fast path to a quote.

## What already exists (read these)

- `design/CONTENT.md` — the ENTIRE current site as Markdown: company info, homepage copy, about, technology, all 16 products with spec tables, applications, services, FAQs, documents. **Use this copy. Do not invent facts.** Where a fact is missing (a customer name, a certification), write a bracketed placeholder like `[CUSTOMER LOGO]` or `[ISO CERT IF ANY]`.
- `design/ASSETS.md` — image assets available, with dimensions. Reference images by filename only (e.g. `<img src="01_sp-agarose.webp">`) — they will be attached at build time. Do not embed base64.
- `design/references/*.png` — screenshots: `home-desktop-*.png` and `product-sp-desktop-*.png` are the CURRENT v4 site (Next.js + Tailwind, navy hex-pattern heroes, teal accent, Inter + Manrope). `ext-old-protpure-*.png` is the OLD site (serif display type, horizontal bead-size bars, sidebar catalogue filters, RFQ cart). `ext-dxbidt-0.png` (Indian reagents e-commerce, modern teal gradient), `ext-cube-0.png` (Cube Biotech, authority via citation counts), `ext-cytiva-resin-0.png` (Cytiva product page: tabs, add to quote list) are competitor references.
- `src/app/(frontend)/globals.css` — current design tokens (navy 900 #0b2545, teal 500 #0fa3a3 etc.).

## Decisions already taken (non-negotiable)

1. **Paid sample kits, never "free samples".** Protpure sells paid evaluation/sample kits (5–25 mL packs or a 1 mL pre-packed column), credited against the first bulk order.
2. **RFQ basket.** Every product card and product page has "Add to RFQ" (grade + pack size). The header shows a basket icon with a count. A basket drawer/page lists line items and submits ONE quote request. This replaces the single-product form as the primary conversion path; "Request a quote" still exists as a button that opens the basket.
3. Real facility, lab and team photos will be supplied later — design the slots and label them `[PHOTO: facility]`, `[PHOTO: Dr. Rucha Desai]` etc. Customer logos/testimonials may or may not come — design the slot, mark it as placeholder.
4. Tech stack for the build is Next.js + Tailwind CSS 4, self-hosted fonts. Your boards are design intent, not production code, but keep them implementable: real CSS grid/flex, no canvas/WebGL, no JS frameworks.

## Deliverable: ONE direction, four boards + a spec

You are producing **one** of three directions (told in your instructions). Write everything under `design/concepts/<direction-slug>/`:

| File | Frame | What |
|---|---|---|
| `home.html` | 1440 wide, any height | Full homepage. Sections you must include, in an order you choose: nav with RFQ basket; hero with one primary CTA; trust strip (BioProcess grade · used in GMP facilities · CoA per lot · made in India); catalogue by chromatography mode; the four-grade particle platform (Faster / Fast Flow / Precise / HR — the horizontal bar treatment from the old site is a good starting point, do better); "why switch" reasons (max 6, ideally 4); imported-vs-Protpure comparison; applications; facility + founder (photo slots); services; social proof slot (testimonials / customer logos placeholder); paid sample kit callout; FAQ teaser; final CTA; footer with newsletter. The current homepage is 14 sections and 11,000 px tall — yours must feel shorter and more decisive. Cut or merge. |
| `home-mobile.html` | 390 wide | The same homepage at phone width. Prove the type scale, nav (hamburger + basket), tables and cards survive. |
| `catalogue.html` | 1440 wide | Product catalogue: left sidebar filters (chromatography mode, exchanger type, grade/bead size, availability), sort, product cards with the 2–3 specs a buyer scans (DBC, max flow, grades), "Compare" checkbox and "Add to RFQ" on each card, result count, an inline "find your resin" wizard entry. Use the real 16 products. |
| `product.html` | 1440 wide | Product page for **SP Agarose** using its real data from CONTENT.md: hero with image, availability, ligand/matrix/grades facts; sticky section nav (Overview · Grades · Specifications · Ordering · Documents · FAQ); grade comparison table; specification table with the "typical market specification" column; ordering with pack sizes + catalog numbers + "Add to RFQ" per row; documents; related products; a sticky bottom/side quote bar. Include a small RFQ basket drawer mock (open state) somewhere on this board. |
| `DIRECTION.md` | — | Name, one-paragraph thesis, who it wins with and the tradeoff. Then the system: palette as hex + oklch (surfaces, ink, 1–2 accents, semantic states), type pairing (Google Fonts only, with fallback stacks, full size/line-height ramp), spacing scale, radii, borders, shadows, motion rules, imagery/illustration rules, iconography rule, and component notes (nav, buttons, cards, spec tables, badges, forms, basket drawer, sticky quote bar). Finally: a list of every placeholder you used. |

## Rules of craft

- **Copy is real.** Pull headlines, stats, spec values, FAQ text from CONTENT.md. Write tighter headlines if you can, but never invent numbers, customers, certifications or awards.
- **No slop.** No emoji, no gradient-mesh-everywhere, no rounded cards with left-border accents, no Inter/Roboto/Arial/Fraunces. Icons are inline SVG, stroke-based, one consistent set — never emoji. Prefer flat colour, precise rules, real hierarchy.
- **Data is the hero.** Spec tables, grade comparisons and numbers must be beautiful and legible: tabular numerals, aligned units, clear "Protpure vs market spec" reading. This is what convinces a process scientist.
- **One primary action per page**, repeated: Add to RFQ / Request a quote. Secondary: Download datasheet.
- **Self-contained HTML.** One `<style>` block in `<head>`, Google Fonts via `<link>`, images by filename from ASSETS.md, no external CSS/JS, no `{{` or `}}` anywhere in the file (it breaks the review tool). Minimal or no JavaScript. Root element fixed at the frame width. Close every tag, quote every attribute.
- Placeholders are visible and bracketed: `[PHOTO: facility exterior]`, `[CUSTOMER LOGO ×6]`, `[TESTIMONIAL — process scientist, Indian vaccine manufacturer]`.
- Do not modify anything outside your `design/concepts/<direction-slug>/` folder. Do not run git commands. Do not run a dev server.

When finished, reply with a short summary: the files written, the fonts chosen, and the three things that make this direction unmistakable.
