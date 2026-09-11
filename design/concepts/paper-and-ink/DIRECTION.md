# Paper & Ink

**An independent scientific house, published with the precision of a technical monograph.** Warm paper, near-black ink and oxidised copper give Protpure a recognisable editorial voice. Newsreader’s sharp serifs and expressive italics bring the scientist into the foreground; Source Sans 3 keeps the buying interface direct. An annotated agarose cross-section introduces the chemistry, measured particle-range bands explain the platform, and ruled specification tables make the commercial evidence easy to inspect. Manufacturing capacity, available volumes and RFQ controls keep the identity firmly attached to a company that makes and supplies resin.

**Who it wins with:** research scientists, technically involved distributors and process-development teams who value access to the maker, documented data and practical evaluation. Procurement still gets grade, pack, catalog number and lead time close to the action.

**Tradeoff:** this is quieter and more human than a conventional bioprocess supplier. It depends on immaculate typesetting and truthful data. Avoid turning the editorial voice into long essays: the homepage uses six numbered chapters, with related topics merged, followed by one closing quote invitation.

## Boards

- `home.html` — fixed 1440px homepage. Chemistry illustration and manufacturing proof lead into mode selection, the four-grade platform, switching evidence, founder/facility, applications/services, and paid evaluation/FAQ. Customer proof shares the founder spread. Newsletter lives in the footer.
- `home-mobile.html` — fixed 390px version of the same content and sequence. Stacked hero, a compact scientific plate, two-column mode and application grids, a full-width comparison table, hamburger navigation and RFQ basket.
- `catalogue.html` — fixed 1440px catalogue of the 16 named products. Sidebar filter groups, sort, an expandable resin-selection entry, per-card grade/format and pack controls, comparison checkboxes and RFQ actions.
- `product.html` — fixed 1440px SP Agarose technical profile. All four product-specific grades, the complete supplied specification comparison and SP01–SP09 ordering rows. Includes sticky section navigation, a sticky quote bar, documents, related products and an explicitly labelled open-basket example.

Each HTML file contains one style block, Google Fonts links, inline SVG and a small inline script. No framework, external script, external stylesheet other than the requested font stylesheet, canvas or embedded image data is used. Image URLs are bare filenames for attachment at review/build time. All four boards can be reviewed independently.

## Colour system

OKLCH values are converted from the sRGB hex values, rounded to four decimals. Hex values are the board implementation source.

| Role | Hex | OKLCH | Use |
|---|---|---|---|
| Paper | `#f5f1e8` | `oklch(0.9588 0.0127 86.83)` | Page surface; warm but visibly clean |
| Sheet | `#fcfaf5` | `oklch(0.9853 0.0069 88.64)` | Product cards, basket, inputs |
| Wash | `#eae4d8` | `oklch(0.9203 0.0173 84.59)` | Founder spread, table heads, supporting panels |
| Ink | `#242720` | `oklch(0.2672 0.0134 126.23)` | Main text, important rules, sticky quote bar |
| Secondary ink | `#68685e` | `oklch(0.5142 0.0154 106.93)` | Body copy, captions and metadata |
| Oxidised copper | `#974a2c` | `oklch(0.4998 0.1121 41.21)` | Sole brand accent: primary action, italic emphasis, annotations |
| Copper hover | `#773b25` | `oklch(0.4248 0.0906 40.42)` | Primary button hover |
| Copper wash | `#ead9cb` | `oklch(0.8953 0.0267 61.98)` | Protpure comparison column and selected grade row |
| Rule | `#c7c1b4` | `oklch(0.8122 0.0191 86.16)` | Dividers, table rows, decorative bounds |
| Available / success | `#435844` | `oklch(0.4367 0.0415 146.04)` | Status text and dot only |
| Error | `#8b302b` | `oklch(0.4416 0.1251 26.62)` | Form errors with explanatory text |

The copper has lightness about 0.50 and moderate chroma 0.112 at hue 41°. That gives warmth and a material association with a printed scientific plate, without the brightness of an orange software CTA. The paper’s very low chroma prevents the design from reading as yellow or artificially antique. Copper is the only expressive accent; green and red are reserved for semantic states. Made-to-order uses copper with a written label, never colour alone. Disabled controls use secondary ink on wash and retain legible text.

Calculated sRGB contrast: ink/paper **13.44:1**, secondary ink/paper **4.99:1**, copper/paper **5.59:1**, sheet/copper **6.04:1**, available/sheet **7.41:1**. Hairline rules are structural decoration, not the sole way of identifying a control or state. Production form controls should use ink-strength boundaries where their boundary is necessary to recognise them.

## Typography

**Display:** [Newsreader](https://fonts.google.com/specimen/Newsreader), regular 400, medium 500 and semibold 600, with true italic 400. Stack: `'Newsreader', Georgia, 'Times New Roman', serif`.

**Interface and body:** [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3), 400 / 500 / 600 / 700. Stack: `'Source Sans 3', 'Segoe UI', sans-serif`.

Google Fonts are linked in these review boards as requested. Self-host the same families in the Next.js implementation. Keep font optical sizing automatic. Apply `font-variant-numeric: tabular-nums lining-nums` to all tables, numerical summaries, catalogue data and selectors. Units remain in the sans face; do not italicise values, minus signs or units. Italic display emphasis marks one idea, not an entire paragraph.

| Role | Desktop size / line height | Phone size / line height | Face / weight |
|---|---|---|---|
| Home and product display | 100 / 98px | 61 / 60.4px (home) | Newsreader 400; −3.5px / −2px tracking |
| Catalogue display | 76 / 74.5px | Not part of requested phone board | Newsreader 400 |
| Section title | 54 / 56.7px | 39 / 42.1px | Newsreader 400; −1.3px / −1px tracking |
| Founder title | 48 / 50.4px | 40 / 43.2px | Newsreader 400 |
| Product data-section title | 43 / 45.2px | Future responsive implementation | Newsreader 400 |
| Closing CTA | 45 / 47.3px | 36 / 38.9px | Newsreader 400 |
| Product subtitle | 36 / 41.4px | Future responsive implementation | Newsreader italic 400 |
| H3 | 30 / 33.6px | 27 / 30.2px | Newsreader 400 |
| Card title | 27 / 30.2px | Mode cards 24 / 26.9px | Newsreader 400 |
| Founder quotation | 21 / 28.4px | 22 / 29.7px | Newsreader italic 400 |
| Hero lead | 20 / 30px | 17 / 25.5px | Source Sans 3 400 |
| Body | 17 / 25.5px | 16 / 24px | Source Sans 3 400 |
| Table body | 15 / 22.5px | 13 / 19.5px | Source Sans 3, tabular figures |
| Controls / links | 15 / 22.5px | 15 / 22.5px | Source Sans 3 600 / 400 |
| Compact data / captions | 14 / 20.3px; 13 / 19.5px | 12–14 / 17.4–20.3px | Source Sans 3 400 |
| Small caps / section index | 12 / 16.8px | 10 / 14px | Source Sans 3 600; 1.8px / 1.4px tracking |
| Table headings | 11 / 16.5px | 9 / 13.5px on home comparison | Source Sans 3 600, uppercase |
| Figure annotations / axis | 9–11 / 13–16px | 9–11 / 13–16px | Source Sans 3 400; supplementary only |

## Layout, spacing and surfaces

- Desktop frame: 1440px with 72px side margins and 1296px usable width. Phone: 390px with 22px margins and 346px usable width.
- Base spacing sequence: **4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 72, 96px**. Optical adjustments include 14, 18, 22, 26, 28, 30 and 36px where a baseline or asymmetric column needs it.
- A 200px chapter-index column gives way to wide content on desktop. Hero, manufacturing story and platform intentionally use unequal column widths. Phone collapses the chapter rail above its content.
- Desktop sections use 64px vertical padding; technical sections 44px; phone sections 40px. Thin rules do the separating instead of large empty gaps.
- Corners: **0px** on sheets, tables, photo slots and fields; **2px** on buttons; full circles only for status dots and basket count. No pill-badge system.
- Rules: 1px. Ink for masthead, plate outline and table hierarchy; warm grey for subordinate divisions. No accent border down the side of a card.
- Shadows: none on normal components. The open basket example uses a flat `12px 12px 0 #d6cfc1` offset to suggest a lifted sheet of paper. The actual modal drawer uses a restrained 30% ink backdrop.
- Product renders keep their white background in a deliberate white specimen panel; no attempt to pass white pixels off as transparent paper.

## Scientific graphics and imagery

The hero is an original inline-SVG agarose pore schematic: a thin circular section, organic pore network, copper ligand marks and clean leader lines. It is visibly labelled **“Schematic · not to scale”**. It must never be described as microscopy, a measured structure or a chemically exact ligand formula. No hexagon wallpaper, generic molecular stock pattern, faux aged paper or decorative gradients.

The particle chart has a shared **0–250 µm axis**. Bands encode the actual supplied platform size ranges: Faster 100–240, Fast Flow 45–165, Precise 25–110 and HR 15–75 µm. Ink ticks encode approximate d50V values 163, 96, 60 and 40 µm. Flow values are an adjacent column, not an ambiguous second bar scale. The text range labels preserve the data on phone. Platform values and product-specific values are explicitly distinguished.

Assets used:

- `protpure-logo.png` — original mark, displayed at 134px desktop and 113px phone. CSS grayscale and multiply integrate the existing wordmark into ink; do not redraw or substitute a typeset brand name.
- `bpg200-column-client-site.webp` — real deployment proof, cropped inside the home scientific plate. The bounded top-anchored crop excludes the phone watermark at the bottom. Preserve the real colour of the resin and steel.
- `01_sp-agarose.webp` — unaltered SP product render, shown in a white specimen panel with a restrained catalog caption.

Facility exterior and founder portrait remain labelled photo slots. Future images should show actual people and working conditions in natural light, with editorial crops and minimal retouching. Do not generate a founder likeness or substitute an unrelated factory. Customer logos remain a bracketed proof slot until supplied. No fabricated testimonials.

## Iconography

One hand-authored inline-SVG stroke vocabulary: 24 × 24 viewbox, 1.5px stroke, round caps and joins, no filled illustrative icons. Basket, arrow, plus, check, download, search, menu, close and chevron share the same treatment. Default display size 20px; 14–16px only in dense supporting elements. Decorative icons are hidden from assistive technology; icon-only buttons have accessible names.

## Motion

Use 150ms colour and border transitions. No hover elevation, floating particles, scroll reveal or animation attached to data. The drawer may use a 180ms horizontal transition in production, with focus management and Escape-to-close. Native disclosure triangles are replaced with the consistent plus/chevron glyphs. Disable transitions and smooth scrolling under `prefers-reduced-motion`.

## Component notes

**Navigation.** Printed masthead: logo, small manufacturing descriptor, six understated links and outlined RFQ count. Phone keeps the logo, count and a native disclosure hamburger. The disclosure exposes actual navigation links. Header quote access always opens the basket. Chapter headings and page anchors retain generous scroll offsets.

**Buttons.** Copper is reserved for the primary RFQ action, repeated at decision points. Product hero “Add to RFQ” navigates to ordering so grade and pack are explicit. Filled button height is 48px; catalogue/order-row desktop buttons are 40px. Secondary actions are ruled text links or transparent buttons. No second competing filled hero CTA.

**Product cards.** Structured sheets separated by shared rules. Scan in this order: mode/status, product, chemistry, binding or relevant capacity metric, flow, available grades, then grade/format + pack and Add to RFQ. Use meaningful alternatives where DBC is not applicable: SEC calibration, CNBr activation capacity, MR metal capacity and magnetic slurry format. Missing flow values remain bracketed, not guessed. “Standard” is a request label for a sole named product grade; it is not a claim that all standard products have the same beads.

**Catalogue filters and sort.** Mode, exchanger type, grade and availability are real form controls. Within a filter group choices use OR; groups combine with AND. Result count updates, Reset clears selections, and catalogue/name sort works. The resin wizard is an expandable entry with target, stage and scale fields; recommendation logic is outside the board scope. In production, carry the three selections into an assisted inquiry or defined recommendation flow.

**Comparison.** Checkboxes collect a shortlist and name it in the inline tray; the visible reference specs remain in the cards. A separate compare-page interaction is not part of these boards. Card reference metrics are explicitly labelled with the grade/format they describe and do not change when the RFQ grade changes. The production implementation should supply an equivalent per-grade data map before making those metrics dynamically follow selection.

**Tables.** Left-aligned parameters, tabular figures and units in headings make scans predictable. Protpure is always the copper-tinted right-hand column in side-by-side comparisons; do not imply that equal values are wins. Fast Flow is the initially highlighted SP grade. Product-specific test pressure and bed height sit in the same row as flow. The phone homepage comparison fits its frame by wrapping text into three columns; it does not shrink the desktop layout or clip a wide table. For future phone product tables, use a labelled, keyboard-accessible horizontal scrolling region with sticky row labels.

**Badges.** Available and made-to-order states have both a written label and a dot. Do not upgrade “used in GMP facilities” into certification of Protpure’s manufacturing facility.

**Forms.** Labels sit above fields; selectors remain native. Copper focus ring with offset; show errors in words as well as colour. Quote intake asks for work email, organisation, destination and optional process notes, with required fields using native validation. The footer newsletter is a quiet underlined field with an explicit email label and named submit button.

**RFQ basket.** Each item contains product, grade/format, pack and quantity. Adding identical selections increments quantity; separate selections remain separate lines. Basket count follows total pack quantity. Items can be removed, Escape closes the modal, and all lines feed one request form. Native dialog supplies modal focus containment. The board is in-memory only: no request or subscription is transmitted. Submitting either preview form reports that no submission was sent. Production should persist selections across routes, allow direct quantity editing, attach catalog identifiers and submit once through the real RFQ backend.

**Open-state mock.** The product board also includes a small, permanently visible basket example with SP Agarose Fast Flow 1 L / SP05 and Q Agarose Precise 500 mL / QA04, quantity one each. The example is clearly labelled and does not seed or modify the live empty basket. It demonstrates the intended line-item layout without covering the technical page.

**Sticky quote bar.** Full-width ink bar anchors SP product identity, availability, grade, pack and Add to RFQ. Grade selection stays synchronised with the ordering selector. It is spatially distinct from the paper sheet without becoming a second colour system. The section nav sticks at the top and the quote bar at the bottom.

## Content decisions and source reconciliation

All claims, product data and source quotations come from `design/CONTENT.md` or the supplied brief. Headline language is tightened for this direction.

- The content export has 16 named products plus a `null` record. The boards exclude `null`, show **16 products**, and do not repeat the stale homepage count of 17.
- Affinity contains the four NTA products and Protein A, but Protein A is not described as IMAC. Activated support, columns, kits and magnetic beads remain individually discoverable.
- Home platform values are the supplied general platform values. SP’s Faster range is **100–200 µm**, Fast Flow **45–165**, Precise **45–105**, HR **25–55**; its d50V figures are **~150, ~90, ~65, ~35 µm**. The product page does not replace these with the generic platform figures.
- SP flow values are **800–1000, 250–450, 100–300 and 70–120 cm/h**; DBC values **≥120, ≈100, ≈120 and ≈130 mg lysozyme/mL**, at the supplied conditions. The old screenshot’s different capacity figures are not used.
- SP01–SP09 and pack sizes are exact supplied values. The source has blank grade cells, so grade is collected separately without inventing a grade suffix. Evaluation catalog identifiers need confirmation.
- Homepage imported-supplier claims retain their customer-reported, typical-value qualifier. The product technical comparison is not attributed to a named competitor.
- The founder quote is an exact excerpt from the supplied quotation. Founder experience is from the brief. No additional certification, customer name, award or performance result is added.
- Missing document URL is visible on the product board. Request-datasheet mail links are usable, but no pretend PDF download is generated.

## Placeholder inventory

Every bracketed placeholder in the boards is listed below.

| Exact placeholder | Location / replacement needed |
|---|---|
| `[PHOTO: Dr. Rucha Desai]` | Desktop and phone home founder portrait; supplied real portrait |
| `[PHOTO: facility exterior]` | Desktop and phone home manufacturing spread; supplied real facility image |
| `[CUSTOMER LOGO ×6]` | Desktop and phone home social proof slot; approved customer marks, or remove slot |
| `[FLOW: confirm]` | Catalogue: Protein A, Hy-Ionic DP, CNBr-Activated and MR kit; obtain operating/flow data or state a confirmed non-applicability |
| `[EVALUATION CATALOG NO.: confirm]` | SP evaluation callout; confirm evaluation identifiers and supported formats |
| `[SP DATASHEET PDF: link required]` | SP document section; attach actual downloadable datasheet |
| `[RFQ EXAMPLE: illustrative line items]` | Product board’s open-state basket demonstration; review annotation, omit from live customer site |

## Review status

Source values, product count, ordering identifiers, HTML structure, CSS delimiter balance, JavaScript syntax and declared asset filenames are checked locally. Palette contrast is calculated from the implemented sRGB values. A Chromium render was attempted through a local browser process; the environment blocked launch with `Operation not permitted`, so pixel-level rendering, live interaction and overflow checks remain unverified. No development server was started.
