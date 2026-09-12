# Deep Field

**An Indian chromatography manufacturer, seen from the bead up.** Deep Field evolves Protpure’s navy and teal identity into an editorial scientific brand: an expansive serif, near-black blue fields, real equipment photography and an ordered language of four particle sizes. The first impression is ambitious; the next is measurable. Large manufacturing figures lead into compact chemistry choices, a calibrated particle-range graphic and clear comparison tables. The scientist, the resin and the manufacturing capability belong to the same story. The quotation basket makes that story actionable across several products, grades and pack sizes.

Wins with Indian biopharma process-development and procurement teams evaluating a credible domestic manufacturer, and international buyers assessing a second source. The tradeoff is deliberate contrast: dark areas establish identity; sustained technical reading happens on light surfaces. The serif carries the point of view, while the sans and tabular figures carry the purchasing decision.

## Boards and reading order

| File | Fixed frame | Purpose |
| --- | --- | --- |
| `home.html` | 1440 px | Complete homepage: five numbered editorial chapters, then the closing quotation invitation and footer. |
| `home-mobile.html` | 390 px | The same homepage, content and section order, with a purpose-built phone composition. |
| `catalogue.html` | 1440 px | All 16 named products, sidebar filters, three-column product grid, sorting, comparison and resin-selector entry. |
| `product.html` | 1440 px | SP Agarose from specification to ordering; all four grades, all nine catalog entries, related products, sticky navigation and quotation bar. Includes a labelled, open basket example beside ordering. |

Open the HTML files directly or in the board-review tool. Images deliberately use **filenames only**, as requested: the review/build environment should resolve these against `seed/media/`. No images are embedded. Each board contains exactly one inline style block, Google Fonts links and a small, framework-free enhancement script. No dev server is required.

### Homepage compression

The home groups the requirements into five chapters rather than giving every topic its own large section:

1. Catalogue by chemistry, with formats and kits in the catalogue footnote.
2. Four-grade particle platform.
3. Four reasons to switch + imported comparison + application links.
4. Laboratory photography + future facility slot + founder + services + customer-logo slot.
5. Paid evaluation offer + FAQ teaser.

The hero, narrow trust strip and three large supply figures establish the context first. Repeated RFQ actions share one conversion path. No separate news carousel, social feed or redundant product-feature section lengthens the page.

## Colour system

Conversions below are calculated from sRGB hex into OKLCH, rounded to four decimals. Hex values are the board implementation reference.

| Token / role | Hex | OKLCH |
| --- | --- | --- |
| Field: hero, platform, footer | `#081f29` | `oklch(0.2263 0.0346 229.51)` |
| Raised field: trust strip, sample panel, quote bar | `#102f39` | `oklch(0.2869 0.0405 222.20)` |
| Primary ink | `#102b35` | `oklch(0.2730 0.0375 225.03)` |
| Main surface / inverse heading | `#f6f7f2` | `oklch(0.9740 0.0067 115.70)` |
| Recessed surface: company chapter, table header | `#e9eee8` | `oklch(0.9436 0.0096 140.52)` |
| Product cards, forms, bottle stage | `#ffffff` | `oklch(1.0000 0 0)` |
| Luminous teal: action fill, key data, particle marks | `#83e6d1` | `oklch(0.8583 0.0988 178.53)` |
| Deep teal: links and markers on light surfaces | `#00786d` | `oklch(0.5145 0.0912 183.80)` |
| Comparison tint: Protpure column, selector | `#e0f2ea` | `oklch(0.9456 0.0218 167.47)` |
| Secondary text on light | `#51666b` | `oklch(0.4950 0.0264 213.82)` |
| Secondary text on dark | `#b8caca` | `oklch(0.8254 0.0196 196.78)` |
| Rule on light | `#cbd5d0` | `oklch(0.8639 0.0128 164.75)` |
| Rule on dark | `#3a535b` | `oklch(0.4252 0.0330 219.68)` |
| Available / success | `#236450` | `oklch(0.4557 0.0739 169.42)` |
| Made to order / attention | `#865613` | `oklch(0.4954 0.0998 69.17)` |
| Invalid field / error, reserved | `#a43b35` | `oklch(0.4996 0.1402 26.65)` |

The original supplied logo retains its original colour. Do not recolour its raster asset. Luminous teal always takes dark text. On white, deep teal carries small text; luminous teal is a fill, never a low-contrast text colour. Status labels include words and a dot, so colour is supplementary. Error states must add explanatory text as well as the reserved red border. Light table tints identify Protpure consistently, without claiming every value is superior.

## Typography

**Instrument Serif** Regular + Italic is the display face. It connects with the old Protpure serif without recreating that site. Use italic for a short scientific proposition, such as “One chemistry”; do not italicise paragraph copy.

**DM Sans** 400 / 500 / 600 / 700 carries UI, prose, navigation, controls and table labels. **IBM Plex Mono** 400 / 500 is a utility face for scanned product specifications, catalog numbers and small scientific notation. All three are Google Fonts; self-host these exact families and weights in the Next.js build.

Fallback stacks:

- Display: `"Instrument Serif", Georgia, serif`
- Text/UI: `"DM Sans", sans-serif`
- Data utility: `"IBM Plex Mono", monospace`

Never simulate a bold Instrument Serif. Use scale, line breaks and colour for display hierarchy. Display tracking is −0.035em; UI headings −0.02em; ordinary text 0. Scientific values use `font-variant-numeric: tabular-nums`. Unit labels remain in DM Sans when they sit beneath a numerical value.

### Size / line-height ramp, in pixels

| Role | Desktop | Phone | Face / treatment |
| --- | --- | --- | --- |
| Home hero | 100 / 94 | 62 / 59.5 | Instrument Serif 400; intentional line breaks |
| Product hero | 102 / 96 | Not a supplied phone board | Instrument Serif 400 |
| Catalogue hero | 80 / 75 | Not a supplied phone board | Instrument Serif 400 |
| Manufacturing numerals | 66 / 73 | 47 / 52 | Instrument Serif, tabular figures |
| Primary chapter heading | 64 / 66 | 44 / 45 | Instrument Serif |
| Founder / sample heading | 60 / 62 | 46 / 47 or 44 / 45 | Instrument Serif |
| Switch / closing heading | 58 / 60 | 45 / 46 or 43 / 44 | Instrument Serif |
| Product content heading | 52 / 54 | — | Instrument Serif |
| FAQ heading | 48 / 49 | 42 / 43 | Instrument Serif |
| Footer wordmark | 40 / 40 | 40 / 40 | Instrument Serif Italic; secondary text treatment |
| Process-column medallion | 36 / 36 | 28 / 28 | Instrument Serif |
| Product descriptor / drawer title | 33 / 41 or 33 / 34 | 33 / 34 in drawer | Instrument Serif |
| Services heading | 32 / 38 | 32 / 38 | Instrument Serif |
| Mode card heading | 31 / 37 | 29 / 35 | Instrument Serif |
| Selector heading | 30 / 31 | — | Instrument Serif |
| Product card title | 29 / 31 | — | Instrument Serif |
| Grade flow figure | 27 / 30 | 26 / 29 | DM Sans, tabular |
| Grade table title | 25 / 39 | — | Instrument Serif |
| Platform grade title | 24 / 37 | 27 / 42 | Instrument Serif |
| UI section heading | 21 / 25 | 19 / 23 | DM Sans 500 |
| Reason / small section heading | 18 / 22 | 15 / 18 | DM Sans 500 |
| Hero introduction | 17 / 28 | 14 / 22 | DM Sans 400 |
| Base prose | 16 / 25 | 14 / 22 | DM Sans 400 |
| Section descriptions | 15 / 23 | 13 / 20 | DM Sans 400 |
| Body / table value | 14 / 22 | 12 / 19 | DM Sans; tabular in tables |
| Compact body / product navigation | 13 / 20 | 11–12 / 17–19 | DM Sans |
| Card figure / form value | 12 / 18 | 12 / 18 | IBM Plex Mono / DM Sans respectively |
| Scientific detail / eyebrow | 11 / 17 or 11 / 15 | 10 / 15.5 or 9 / 12.6 | Mono for values; sans uppercase for eyebrows |
| Secondary metadata | 10 / 15.5 | 9 / 14 | DM Sans; never the only carrier of a key spec |
| Compact card labels | 9 / 14 | — | DM Sans; figures remain 12 px |

Key table values remain at least 12 px on the phone comparison. The first column is 25% of the available width; the remaining two columns wrap naturally. Do not shrink the whole desktop table to fit a phone.

## Layout, spacing and geometry

The desktop frame is 1440 px with 72 px left/right margins: 1296 px of usable width. The phone frame is 390 px with 24 px margins: 342 px usable width. Root board widths are fixed for review; grids and flex layouts within them are real, implementable CSS.

The base spacing scale is **4, 8, 12, 16, 20, 24, 32, 40, 48, 60, 72, 80, 96 px**. Two- and six-pixel optical adjustments are permitted for compact controls and icon alignment. Chapter spacing is 80 px on desktop and 48 px on phone. Local section margins can collapse through merged chapters rather than repeating a large blank band.

The catalogue is a 220 px sidebar, a 40 px gap and three equal product columns separated by 16 px. SP ordering uses a flexible table plus a 400 px open basket example with a 42 px gap. Homepage asymmetry changes deliberately by task: wide headline beside a large image; 320 px editorial rail beside facts; then roughly balanced photo/founder columns.

- **Radii:** 2 px for cards, buttons and controls. Full circle for status/count/particle marks. The signature image arch is 200 px at the top of the home photograph and 240 px on the product stage, with 2 px bottom corners. Phone photograph: 175 px upper radius.
- **Borders:** 1 px solid structural rules; 1 px dashed placeholder outlines. No decorative left borders on cards.
- **Shadows:** none on ordinary cards. Basket example: `0 12px 32px #081f2910`; open modal: `-16px 0 60px #081f2930`; sticky quotation bar: `0 -5px 20px #081f2910`.
- **Light surfaces:** long-form product data and comparisons always remain light. Thin rules, aligned labels and explicit units do the work.

## The bead field

The field replaces the hexagon wallpaper. It consists exclusively of flat SVG circles in four diameters: **8, 12, 20 and 32 SVG units**. An underlying ordered lattice receives a deterministic, small positional offset. Most circles are outlined; a few are filled. No random animation, blur, glow or gradients.

The background field is decorative and qualitative, not a microscope image and not measured bead density. It is `aria-hidden`, non-interactive and held at 10–17% opacity. It stays away from long paragraphs and specification tables. Use it at chapter edges, never as universal wallpaper.

The particle-platform diagram is different: a **quantitative range plot**, drawn with HTML/CSS so its labels remain text. All four ranges use the same 0–250 µm scale. Range bars encode the supplied size range; filled markers encode d50V. The neighbouring circle is a qualitative grade identifier. The axis spans the full plotting area; at 390 px it spans the available column. The mobile row places grade and maximum flow first, range plot second and application third. Do not replace these plots with arbitrary progress bars.

Platform values: Faster 100–240 µm / ~163 µm / up to 1000 cm/h; Fast Flow 45–165 / ~96 / up to 700; Precise 25–110 / ~60 / up to 380; HR 15–75 / ~40 / up to 120. SP’s distinct product ranges and test conditions appear only in its own tables.

## Imagery and illustration

Lead with the supplied BPG 200 process-column photograph, large enough to see the slurry, steel and scale markings. Its arched crop makes the column feel like an object of engineering. The crop removes the bottom phone watermark through framing; the image itself is unedited. Keep the real client-site caption, without inventing a client name.

Use `fplc-system.webp` as a real laboratory photograph, cropped around the equipment. The facility exterior and founder portrait remain visibly bracketed slots. Do not pass the laboratory photograph off as a future facility exterior or fabricate people.

Product renders stay on white. Do not colourise resin, stretch the bottle or remove the label. `01_sp-agarose.webp` is shown in a tall white arched stage; the caption identifies the illustrated 500 mL bottle. The catalogue deliberately allocates its area to grade, binding, flow and ordering rather than repeating bottle pictures sixteen times.

Homepage assets: `protpure-logo.png`, `bpg200-column-client-site.webp`, `fplc-system.webp`. SP board additionally uses `01_sp-agarose.webp` and `03_q-agarose.webp`. Other provided product images may appear when a corresponding item is added to the working RFQ drawer. Products without an image use the abstract bead mark in that drawer; no invented pack render.

## Iconography

One inline SVG stroke language: 24 × 24 viewBox, 1.5 px stroke, round caps and joins, no filled pictograms. The set includes arrow, basket, add, check, download, menu, close and search. Render at 20 px by default, 14–16 px in compact controls. Decorative SVGs carry `aria-hidden`; icon-only buttons receive specific labels. Chemistry emblems use the same circle construction at 60 × 60, with a 1.1 px stroke. No emoji or font icons.

## Components and interaction

### Navigation

96 px desktop masthead on the light surface, with the supplied logo, short provenance note, five navigation items and separate RFQ count. The dark quotation button is the same conversion action as the hero, not a new goal. On phone the masthead is 76 px; the provenance note and desktop links leave the row. Basket and hamburger remain, with a simple expanding menu. The count is total requested packs; the basket rows group matching product + grade + pack selections.

### Buttons

48 px primary target, teal fill and ink text; 42 px in the desktop header, 35 px in dense catalogue actions. Phone primary actions are at least 47 px tall. Buttons have 2 px corners. Plain links with an arrow are for exploration; outlined links and download actions remain subordinate. Keep one conversion family: **Add to RFQ → Request / submit one quote**. Do not introduce a checkout or a price that does not exist.

### Product cards and filters

Cards always show a named product, availability, product-specific metric, applicable maximum flow and grades or format. Binding measurements retain their analyte and denominator. DBC is not a meaningful metric for every product: SEC uses fractionation, CNBr activation uses cyanate-ester content, MR uses metal binding, and magnetic beads state that flow is not applicable. Missing numbers stay bracketed.

Each card has a grade/format select, an actual orderable pack select, a compare checkbox and Add to RFQ. Exchanger type and grade filters combine across groups; selections within one checkbox group use OR. Standard and Fast Flow share a filter; exact particle sizes stay in each card because a universal “90 µm” value would be misleading. Mode counts are absolute catalogue totals; the result count updates with filters. Sorting and a maximum of three products in comparison are demonstrated. The selector has target, purification stage and scale inputs, giving a starting point with scientist confirmation rather than asserting an unqualified scientific recommendation.

### Tables

Every table is native HTML with scoped column headers. Product tables use a light tinted Protpure column, including values that match the typical market specification. Never replace equal values with exaggerated superiority icons. SP grade data includes particle range, d50V, flow, lysozyme DBC, pressure and bed height. Order tables display all nine real catalog numbers and keep selected grade as a separate request field. Two-, three- and six-column tables share rule weight and left alignment.

On the phone homepage, the short imported comparison remains a three-column table with 12 px values and wrapped text. In the eventual responsive product build, wider scientific tables should scroll horizontally inside a labelled region with their first column pinned; the supplied product board itself is a desktop frame.

### Availability and other badges

Status is a word plus a dot, not a floating pill. “Available” is green, “Made to order” is amber. “Used in GMP facilities” is a usage statement, not a certification badge. BioProcess grade and CoA per lot remain separate statements. Do not add ISO seals, awards or customer names without evidence.

### Forms

Visible labels, 1 px borders, white fill, dark input values and a 3 px deep-teal focus outline. Work email, organisation and destination country are required. Notes are optional and can capture target, scale, custom volume and timeline. The native email field validates email format. Missing values must receive a specific field error in the production build, with focus moved to the first invalid field and the red token paired with text.

The newsletter is a single labelled email field. No real submission is wired in these boards. Both newsletter and RFQ forms validate locally, then explicitly say **“Design preview: your details are valid. Nothing has been sent.”**

### RFQ drawer

445 px on desktop, 390 px on the phone frame, white surface, full-height native modal dialog with backdrop, labelled title, close control and Escape dismissal. Matching additions increment quantity. Items show product, grade, pack, catalog number and quantity controls, with a removal action. A single form follows all lines; no subtotal or fabricated price appears. RFQ state is retained in session storage when the viewing environment permits it; it works in memory otherwise.

The product page includes an independent, clearly labelled **example open state** alongside ordering, containing SP Fast Flow / 500 mL / SP04 and Q Precise / 100 mL / QA02, one each. These example lines are not preloaded into the working basket. Its static quantity presentation keeps the illustrative panel distinct from the live drawer. The header and actual Add controls open the live dialog.

The evaluation button opens that same RFQ route with notes requesting a paid evaluation and scientist guidance. The selected product and grade must be confirmed; the generic evaluation offer never silently creates a fabricated stock code.

### Sticky product actions

A 65 px light section navigation stays at the top: Overview, Grades, Specifications, Ordering, Documents, FAQ. Content sections have scroll-margin so headings clear it. The dark bottom quote bar repeats SP name, availability and lead time beside a grade-selection action. It is in document flow and sticky, rather than a permanent overlay hiding ordering rows. The open native basket overlays these bars.

### Motion and focus

Use 160 ms colour/background/border transitions on controls. No automatic bead motion, parallax, scroll hijacking or animated data. Smooth in-page anchor scrolling is allowed. Honour `prefers-reduced-motion` by disabling transitions and smooth scrolling. Use native details for FAQs, native dialog focus management, labelled selects, visible focus and keyboard-operated controls. A future drawer entrance may use a 160 ms horizontal slide; it must be disabled under reduced motion.

## Content decisions and source integrity

- The catalogue contains the **16 named products** supplied in `CONTENT.md`. Its seventeenth `null` entry is excluded; homepage “17 products” copy is not repeated.
- Protein A is labelled affinity, without implying it is an IMAC resin. It is made to order and its lead time is on request.
- SP Fast Flow flow is **250–450 cm/h**, not the platform maximum of 700. Precise is **100–300**, HR **70–120** and Faster **800–1000**, with the supplied bed-height/pressure conditions.
- SP binding is **≈100 / ≈120 / ≈130 mg lysozyme/mL** for Fast Flow / Precise / HR and **≥120** for Faster. The old screenshot’s stronger figure is not reused.
- SP catalog numbers **SP01–SP09** come from the source. Grade suffixes are not supplied, so none are invented.
- The supplied generic paid evaluation offer is separate from SP’s standard catalogue, which begins at 50 mL. Evaluation identification is a visible placeholder.
- Imported lead-time and service comparisons retain the customer-reported-experience qualifier. The compact homepage includes five of the seven source comparison rows.
- Missing product data remains visible. The real lab photograph and supplied founder quotation are used; no customer testimonial is fabricated.
- The technical PDF is not among the supplied file assets. The document slot names the missing PDF and the working secondary action requests it by email. It does not link to a fake download.
- This is a reviewable design concept. Backend submission, document delivery, complete non-SP product routes and application-specific routes belong to implementation. Application links here lead to the catalogue; they do not pretend to be completed application pages.

## Every visible placeholder

| Placeholder | Where | Required before replacing |
| --- | --- | --- |
| `[PHOTO: facility exterior]` | Desktop and mobile home, company chapter | Approved facility exterior photograph |
| `[PHOTO: Dr. Rucha Desai]` | Desktop and mobile home, founder profile | Approved founder portrait |
| `[CUSTOMER LOGO ×6]` | Desktop and mobile home, social proof slot | Customer permission and supplied artwork; omit the slot if unavailable |
| `[DBC: to confirm]` | Catalogue CM and Ni-NTA Magnetic; related CM card on SP page | Product-specific validated capacity and analyte/test conditions |
| `[Flow: to confirm]` | Catalogue Protein A, Hy-Ionic DP and CNBr | Validated flow values and relevant conditions, or explicit non-applicability |
| `[EVALUATION SKU: to confirm]` | SP ordering evaluation callout | Approved evaluation catalog identifier |
| `[DOCUMENT: SP Agarose PDF]` | SP documents section | Approved datasheet file and final download route |

Form examples such as `you@company.com` and “Company or institute” are input hints, not claimed company data.

## Validation record

All four HTML documents were checked for balanced explicit tags, unique IDs, a single style block in the head, existing image filenames, absence of forbidden template-brace sequences and JavaScript syntax. Scientific values and pack identifiers were checked against the supplied Markdown. The desktop and phone home use identical content and section order with CSS-specific composition.

A visual browser pass was attempted with the installed Chromium and headless shell. Both were blocked by the environment’s socket/IPC sandbox before rendering. No browser screenshot or visual-fit verification is claimed. The boards need their final rendered inspection in the review environment with assets and Google Fonts resolved.
