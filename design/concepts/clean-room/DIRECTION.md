# Clean Room

Purification, precisely engineered. Clean Room makes Protpure feel like a manufacturer whose work can be inspected: a white instrument panel, a visible grid, a bead cross-section and disciplined columns of measured values. Space Grotesk gives the voice character; IBM Plex Mono makes quantities, conditions and catalog numbers easy to compare. The website earns attention through specific chemistry, operating windows and documentation, then turns product selection into one consolidated RFQ. Teal marks the next action and the Protpure data column; the rest of the interface stays quiet.

**Who it wins with:** sceptical process-development scientists, technical procurement teams and international distributors evaluating a second source. They can move from chemistry to grade to evidence to pack size without changing visual language. **Tradeoff:** deliberately less warmth and photographic spectacle; it depends on immaculate data, explicit test conditions and disciplined content maintenance. The founder and laboratory provide a small, credible human counterweight.

## Boards

- `home.html` — fixed 1440 px frame. Six numbered editorial groups combine the required homepage content, followed by the final quote action and newsletter footer.
- `home-mobile.html` — fixed 390 px frame. The same content and sequence, recomposed rather than scaled down. Explicit mobile navigation and a readable, three-column supplier comparison.
- `catalogue.html` — fixed 1440 px frame. All 16 named products, sidebar filters, sort, inline resin-finder entry, reference specifications, grade and pack controls, comparison and RFQ selection.
- `product.html` — fixed 1440 px frame. SP Agarose, all four grades, complete specification comparison, all nine catalog numbers, technical documents, related products, sticky section navigation and quote bar. An inset open basket specimen sits beside ordering so it can be reviewed without obscuring the page.

These are standalone design-intent HTML boards. Each has exactly one embedded style block, Google Fonts links, inline SVG and a small vanilla JavaScript enhancement. There is no application framework, external CSS file or external script. Image references are bare filenames as requested; the review/build environment attaches the supplied assets. Links to sibling boards work locally. Links to other product URLs indicate the eventual production routes.

## Palette

A single chromatic hue family, centred on process teal. OKLCH values below are calculated from the specified sRGB hex values; neutral hue values have negligible perceptual significance.

| Token | Hex | OKLCH | Use |
| --- | --- | --- | --- |
| Paper | `#ffffff` | `oklch(100% 0 0)` | Main surface, product photography, forms |
| Cool wash | `#f3f6f6` | `oklch(97.09% 0.0032 197.10)` | Platform, ordering and final CTA surfaces |
| Ink | `#172526` | `oklch(25.22% 0.0192 201.61)` | Headings, body emphasis, sticky quote bar |
| Muted ink | `#526465` | `oklch(48.87% 0.0219 200.61)` | Descriptions, secondary labels, explanatory notes |
| Rule | `#cbd6d6` | `oklch(86.77% 0.0119 196.94)` | Hairlines, table rows, construction lines |
| Process teal | `#006e73` | `oklch(48.93% 0.0832 200.31)` | Primary actions, selected values, figure annotations |
| Teal tint | `#e5f1f0` | `oklch(94.89% 0.0128 190.95)` | Protpure comparison column, RFQ count, evaluation callout |
| Teal pressed | `#00565a` | `oklch(41.20% 0.0700 200.27)` | Primary hover/pressed state |

Semantic states reuse the system: available = teal filled dot plus “Available”; made to order = muted hollow dot plus text; selected = teal control or tint; focus = 2 px teal outline with 4 px offset. Errors use an ink outline, stroke warning icon and explicit error text; colour never carries the message alone. Disabled controls use muted ink and cool wash with an explicit reason. The supplied blue/purple wordmark remains unchanged as an existing brand asset, not an additional UI accent.

## Typography

**Space Grotesk** for display, body and controls. Google Fonts family, weights 400, 500, 600 and 700; boards mainly use 400 and 500. Stack: `"Space Grotesk", system-ui, sans-serif`.

**IBM Plex Mono** for figures, specification values, catalog numbers, small technical labels and diagram annotations. Google Fonts family, weights 400 and 500. Stack: `"IBM Plex Mono", ui-monospace, monospace`. Enable `font-variant-numeric: tabular-nums`. In production, self-host the exact font files rather than loading Google Fonts remotely.

| Role | Desktop size / line height | Mobile size / line height | Weight / tracking |
| --- | --- | --- | --- |
| Hero display | 80 / 81.6 px | 49 / 50.96 px | 500; −5 / −2.8 px |
| Catalogue title | 64 / 65.28 px | 40 / 43 px, future catalogue adaptation | 500; −3 / −1.8 px |
| Section heading | 42 / 47.04 px | 32 / 35.84 px | 500; −1.8 / −1.3 px |
| Final CTA heading | 36 / 40.32 px | 31 / 34.72 px | 500; −1.8 / −1.3 px |
| Feature heading | 24 / 28.8 px | 21 / 25.2 px | 500; −0.65 px |
| Product card heading | 22 / 26.4 px | 20 / 24 px, future catalogue adaptation | 500; −0.65 px |
| Mode title | 20 / 24 px | 19 / 22.8 px | 500 |
| Body lead | 17 / 27.2 px | 15 / 24 px | 400 |
| Body | 16 / 24 px | 15 / 22.5 px | 400 |
| Supporting copy | 14 / 21–23.8 px | 13 / 19.5–20.8 px | 400 |
| Buttons | 14 / 21 px | 13 / 19.5 px | 500 |
| Technical table values | 13 / 19.5–21.45 px | 10 / 16 px in the home comparison | Mono 400; no tracking |
| Product grade table | 12 / 18 px | Future product page uses scoped horizontal overflow | Mono 400 |
| Notes | 11 / 17.6 px | 10 / 16 px | 400 |
| Section identifiers | 11 / 16.5 px | 9 / 13.5 px | Mono 400; +1.2 / +0.8 px |
| Metadata / diagram labels | 9–10 / 13.5–15 px | 8–9 / 12–13.5 px | Mono 400; +0.4–1 px |
| Hero metric | 38 / 45.6 px | 25 / 30 px | Mono 400; −2 / −1.2 px |
| Hero metric unit | 19 / 22.8 px | 12 / 14.4 px | Mono 400 |

The smallest text is ancillary metadata, not the only source of a specification. Ordinary reading copy stays in a sans; numerical cells use mono. Do not bold entire tables. Maintain approximations (`≈`, `~`), inequalities, units and test conditions exactly.

## Grid, spacing and surfaces

- Base spacing scale: **4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80 px**. Fine 1–2 px offsets are reserved for rules, icons and alignment.
- Desktop: 1440 px canvas, 1280 px content area, 80 px side margins. Use the same column boundaries across page sections. Homepage hero is a near-equal two-column grid with a vertical division. Primary editorial gutters are 40–64 px.
- Mobile: 390 px canvas, 342 px content area, 24 px side margins. Sections use 38 px vertical padding, versus 64 px on desktop. Preserve meaningful whitespace around the hero; tighten repeated modules.
- Catalogue: 218 px sidebar, 44 px gap, three product columns with 16 px gaps. Product cards contain no decorative image tile; reference values and selection controls get that space.
- Radius: 0 for layout panels, tables and figure boundaries; 2 px for inputs/buttons; fully round only for status dots. No pill-shaped cards.
- Borders: 1 px cool rules; 1 px ink at the top of major data structures. Large surface changes are also separated by rules.
- Shadows: none on ordinary cards. Basket overlay uses `−8px 0 30px rgb(23 37 38 / 8%)`; the inset basket example uses an 8 px flat wash offset to make the state distinct. No elevated-card hover movement.

## The signature figure system

The homepage bead cross-section uses a section axis, hatch, pore outlines, leaders, dimension line and a figure number. It is labelled **schematic** and conveys open-pore, cross-linked agarose architecture; it does not claim to be microscopy or depict measured pore geometry. Do not use background hexagons, molecular stock art or decorative pressure–flow curves.

The particle platform is a compact technical figure built with grid and CSS positioning. Every grade shares a **0–250 µm linear axis**. A bounded bar shows the actual size range; a vertical marker shows d50V. Flow is a separate aligned numerical column, never encoded as an invented relationship between bead size and resolution. Source platform values: Faster 100–240 / ~163 µm; Fast Flow 45–165 / ~96 µm; Precise 25–110 / ~60 µm; HR 15–75 / ~40 µm. Maxima are 1000 / 700 / 380 / 120 cm/h respectively. The caption distinguishes these platform values from product-specific operating ranges.

If measured curves are introduced later, show units, test conditions, measured points, a clear source and legends. Never fit or interpolate a marketing curve without underlying data.

## Imagery and icons

- Keep the existing `protpure-logo.png` wordmark, proportional, on white. Do not redraw or filter it.
- `01_sp-agarose.webp` is contained on white in a ruled product-image stage. “500 mL bottle shown / SP04” makes the image illustrative, independent of the selected pack.
- `fplc-system.webp` appears as a real laboratory photograph with a process-evaluation caption. Use a straightforward crop; no aesthetic tint, artificial depth or AI retouching.
- Reserve clearly labelled photo areas for the actual facility exterior and Dr. Rucha Desai. Do not substitute unrelated buildings or stock scientists.
- If the supplied BPG 200 image is used in later pages, crop off its phone watermark and label it as a client-site deployment; do not imply it is the Protpure facility. It is intentionally not used on these boards.
- Customer marks occupy restrained dashed slots. Until approved logos are supplied, keep the bracketed placeholders visible; never imply an unnamed endorsement.
- Icons use one inline SVG stroke grammar: 24-unit viewBox, 1.5-unit stroke, round joins and ends, no fills. Mode drawings use the same vocabulary at 32 units. No emoji, mixed icon libraries or filled pictograms.

## Component behaviour

**Navigation.** Compact origin strip; 88 px desktop header; existing logo at left; five direct links; RFQ icon and count at right. Mobile replaces the desktop links with a native details menu and retains the basket. Production mobile hit areas should remain at least 44 px. Count represents distinct product/grade/pack lines, not a currency total.

**Actions.** Primary filled teal always means advancing the quote path: Request a quote, Add to RFQ, Request an evaluation or Send one quote request. Browse links and datasheet actions stay secondary. Homepage hero has one filled CTA. Product hero and sticky nav point to ordering, where the grade and pack are captured.

**Cards.** Product name, chemistry, availability, explicitly named reference grade, two scan specifications, then grade and pack selectors. Snapshot specifications remain labelled with the reference grade even when the requested grade changes; do not imply values silently update. A production enhancement may update the reference data once the full per-grade schema is available. For SEC, activated media and kits, show the relevant fractionation range, ligand density or metal capacity rather than calling everything DBC. Missing data is bracketed.

**Tables.** Align scientific values in consistent columns with tabular figures. The Protpure column is tinted continuously, so readers compare across each row. Full words and test conditions remain visible. Homepage mobile comparison keeps three columns with shorter text and deliberate widths; no clipped page-wide table. The platform uses the same data and axis on mobile. Future dense product tables should scroll inside a labelled region with the parameter column pinned, rather than shrinking all text.

**Badges.** Status includes both a dot shape and a text label. Do not call products “certified GMP”; the supplied claim is “used in GMP facilities.” BioProcess grade and CoA are factual attributes, not invented seals.

**Forms.** Visible labels, rectangular controls, restrained placeholders. RFQ asks for work email, company, destination and notes; grade, pack and quantities come from the basket. Validate before submission, retain entered values on error and show a plain error next to the field. Newsletter is a separate secondary footer form. Board submissions explicitly report “Design preview — your information has not been sent.” No information leaves the board.

**Basket drawer.** 440 px wide on desktop, 390 px on the mobile board; white surface over a restrained ink scrim. Selected items show product, grade, pack, catalog number and quantity. Identical selections consolidate quantities; removing items updates the count. One form submits the basket as one request. The product page also shows a labelled, static open-state example with SP Agarose / Fast Flow / 500 mL / SP04 / quantity 1; it is separate from the live preview basket, which starts empty. The example is UI demonstration data, not a customer order. The live preview uses hash navigation and an Escape handler. Production implementation should use an accessible modal dialog with focus trapping, return focus, inert background and scroll locking.

**Sticky quote bar.** Slim ink strip with product context, available grades and ex-works lead time. White quote action stands out in this local context. It points to grade/pack selection; it never adds a guessed SKU. Sticky section navigation stays white and uses the same page grid. Anchor offsets account for the 66 px navigation.

**Motion.** Only 140 ms background/colour transitions on controls. No scroll reveals, parallax, card lifts or ambient animation. A production drawer may translate in over 180 ms ease-out. Honour reduced-motion preferences: no smooth scroll or motion transitions.

## Content decisions and source discrepancies

1. CONTENT.md contains **16 named products** and a seventeenth `null` record. The brief explicitly requests the real 16; the catalogue excludes `null`, and the homepage uses “All 16 products” rather than repeating the legacy 17 statistic.
2. SP product-specific values take precedence over the generic platform figure: Faster 100–200 µm, d50V ~150 µm, 800–1000 cm/h, ≥120 mg lysozyme/mL; Fast Flow 45–165 µm, ~90 µm, 250–450 cm/h, ≈100; Precise 45–105 µm, ~65 µm, 100–300 cm/h, ≈120; HR 25–55 µm, ~35 µm, 70–120 cm/h, ≈130. Conditions are retained in the grade table.
3. The SP summary initially names three grades, but its grade table includes Faster. The board shows all four listed grades and does not infer additional variants.
4. SP ordering has empty Grade cells. SP01–SP09 remain pack identifiers; requested grade is captured separately. No invented grade-specific code suffixes. Evaluation sizes are offered through a quoted request, not assigned unsupported SP catalog numbers.
5. Protein A is grouped under **Affinity**, not IMAC; its record's chemistry identifies Protein A affinity. The source category's “(IMAC)” is not repeated for Protein A.
6. The homepage's imported-vs-Protpure table is condensed to five practical rows. The supplied customer-reported-experience caveat remains visible. No named competitor equivalence, certification, customer or award is invented.
7. Product datasheet file URLs are not supplied in ASSETS.md. A bracketed document placeholder is shown and the secondary action requests it by email. The hero “Datasheet” link leads to this documents section, not to an invented PDF.
8. The resin-finder is an inline entry with target/workflow/scale selectors and a scientist contact path. It does not invent an automated recommendation algorithm. Live board filters and sorting operate locally; comparison shows the named reference specifications.

## Placeholder inventory

- `[PHOTO: facility exterior]` — homepage and mobile, company/facility module.
- `[PHOTO: Dr. Rucha Desai]` — homepage and mobile, founder portrait.
- `[CUSTOMER LOGO]` — three slots on each homepage; no testimonial or endorsement invented.
- `[DATASHEET: SP Agarose PDF]` — product documents module; actual file required.
- `[Not specified]` — catalogue reference data for CM Agarose DBC; Protein A flow; Hy-Ionic DP flow; CNBr-Activated Agarose flow; Ni-NTA Magnetic Agarose DBC. CM's missing DBC also appears in the related-product module.

Ordinary form prompts such as “name@company.com” are illustrative input hints, not contact facts. “Standard” is a UI shorthand for the unqualified named grade in the source records. The inset RFQ line is explicitly labelled as an open-state example.

## Verification

The boards were checked for paired HTML tags, one style block per board, fixed frame rules, permitted image filenames, absence of template delimiters, complete catalogue membership, SP01–SP09 ordering coverage and inline JavaScript syntax. Asset references were checked against seed/media. No dev server or git commands were used, and changes remain inside this concept folder.

Chromium and its headless shell could not launch because the environment denied required socket operations. Rendered screenshots, actual font loading, visual overflow and browser interaction execution therefore remain unverified. The responsive layout is authored explicitly for the requested 390 px frame; a browser pass with attached assets and loaded fonts is the remaining handoff check.
