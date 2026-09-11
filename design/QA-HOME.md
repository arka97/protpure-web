# Homepage design QA

Reviewed against the Deep Field desktop and mobile boards, `DIRECTION.md`, and the eight Clean Room additions in `BUILD-BRIEF.md`. Findings use the supplied 1440 px and 390 px screenshots and the implementation source; dimensions below are CSS pixels.

## 1. Verdict

The build is recognisably Deep Field: the palette, serif/sans contrast, arched photography, chemistry grid and dark particle platform are substantially faithful. It loses some of the board’s deliberate editorial composition through automatic headline wrapping, a looser photograph crop and independently spaced CMS blocks. The single biggest gap is the evaluation/FAQ composition: two full-width chapters replace the board’s compact paired layout, creating an oversized panel and excessive vertical separation near conversion.

## 2. Prioritised fixes

### P1 — Restore the paired evaluation and FAQ composition

**Wrong:** The evaluation panel spans all 1296 px of desktop content despite using only its left portion. The FAQ then occupies another chapter, with 160 px between the panel’s bottom and the FAQ content. The board places these together in two equal columns.

**Where:** `src/components/blocks/RenderBlocks.tsx` — `RenderBlocks`, `planBlocks`, `cta` with `style === 'evaluation'`, and the following `faqBlock`.

**Change:**

- Compose the existing adjacent evaluation and FAQ blocks inside one presentation wrapper. Preserve both CMS blocks, their IDs, content and order.
- Give the outer section `bg-surface` and `padding-block: 80px`.
- Inside one `container-x`, use:

  ```css
  .home-evaluation-faq {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 70px;
    align-items: start;
  }
  ```

- At 1440 px, each column is 613 px.
- Render the evaluation panel and FAQ contents without their current nested section padding or `container-x` wrappers.
- Keep the panel’s `surface-raised`; use `padding: 42px`.
- Stack the FAQ eyebrow, heading and accordion vertically within its column. Remove the current internal `lg:grid-cols-12` arrangement. Put `25px` between the FAQ heading and first rule.
- Treat the FAQ as a continuation of chapter 05: retain its CMS eyebrow but pass `number={null}`. Do not derive a separate `06`.
- Below 1024 px, use one column, `gap: 39px`, outer `padding-block: 48px`, and panel `padding: 28px 24px`.
- Return the panel bead field to `width: 370px; left: 250px; bottom: -150px; opacity: .17` on desktop. Keep the existing mobile positioning.

### P1 — Restore intentional headline breaks

**Wrong:** The desktop hero compresses “Purification at scale.” into one line; the catalogue headline also becomes one continuous line. These remove the stepped silhouette and pacing designed into the boards. On mobile, “Purification at” stays together and leaves “scale.” isolated.

**Where:** `src/components/PageHero.tsx` — `Highlighted`; `RenderBlocks.tsx` — `Heading`; heading utilities in `globals.css`.

**Change:**

Support newline presentation breaks in the existing CMS heading strings, including within the highlighted segment. Render those breaks as `<br />`; retain the current words and emphasis. Use these break positions:

| Heading | Required breaks |
|---|---|
| Hero | `Purification` / `at scale.` / italic proposition |
| Catalogue | `Every stage.` / `The right chemistry.` |
| Platform | `Four bead sizes.` / italic proposition |
| Reasons | `Qualify the resin.` / `Know the maker.` |
| Company | `Built for scale.` / `Grounded in science.` |
| Evaluation | `Your process.` / `Our resin.` / `Let the data decide.` |
| Closing invitation | `Ready to qualify Protpure` / `in your process?` |

Allow each segment to wrap naturally on narrow screens. Do not use nonbreaking spaces to force desktop lines onto phones.

For these homepage headings, set `text-wrap: initial` instead of inheriting `text-wrap: balance`. Keep the hero at `100px/.94` desktop and `62px/.96` mobile, using `--font-display`, weight `400`, tracking `-.035em`. Keep the existing highlight colour `--color-teal-lum`.

These are formatting changes to existing copy, not rewritten headings.

### P1 — Match the hero photograph’s engineered crop

**Wrong:** The built photograph exposes more of the lower assembly and base than the board intends. The mobile image also exposes the source watermark at its lower edge.

**Where:** `PageHero.tsx` — the `Image` inside `.arch`.

**Change:**

Replace the current `objectPosition: 'center 20%'` treatment with a dedicated class:

```css
.home-hero-photo {
  width: 100%;
  height: 121%;
  max-width: none;
  object-fit: cover;
  object-position: center top;
  transform: translateY(-4%);
}

@media (width < 64rem) {
  .home-hero-photo {
    height: 122%;
  }
}
```

With Next Image `fill`, override its inline height explicitly through the image’s `style` or an appropriately scoped important declaration.

Keep the clipping wrapper at `550px` desktop and `338px` mobile, with the existing `.arch` radii. Keep the medallion and actual client-site caption. Validate that the lower watermark is outside the crop at both supplied widths.

### P1 — Complete the selected Clean Room data typography

**Wrong:** Manufacturing figures remain Instrument Serif; platform flow figures and range annotations remain DM Sans. The build brief explicitly selects IBM Plex Mono for these data roles.

**Where:** `RenderBlocks.tsx` — `stats`; `src/components/visual/RangeBars.tsx`; `src/components/rfq/BasketButton.tsx`; `globals.css`.

**Change:**

- For stats `<dd>`, replace `font-display num` with `mono`; remove negative tracking. Keep weight `400`, desktop `66px/1.1`, mobile `47px/1.1`.
- Keep units in a separate `font-sans` element: `17px` desktop and `12px` mobile.
- On mobile, change the stats grid to `grid-template-columns: 160px minmax(0, 1fr); gap: 16px` to accommodate the wider mono figures.
- Apply `mono` to platform flow values at the existing `27px` desktop / `26px` mobile sizes. Explicitly apply `font-sans` to their unit/qualifier span.
- Render numeric range and d50 values in mono spans; keep units in sans. Use `11px/1.4`.
- Use mono for axis numerals and the basket count.
- Do not globally redefine `.num`: it also appears in editorial labels and other contexts that only need tabular alignment.

### P2 — Add real axis ticks and align labels mathematically

**Wrong:** The platform has correct range bars but an axis made from evenly distributed text boxes. It lacks the selected Clean Room tick marks, and `justify-between` does not put every label’s centre at its numerical coordinate.

**Where:** `RangeBars.tsx` — axis markup; `globals.css`.

**Change:**

Keep the current shared plotting column. Replace its flex label row with a positioned axis:

```css
.range-axis {
  position: relative;
  height: 24px;
  margin-top: 12px;
  border-top: 1px solid var(--color-rule-dark);
}

.range-axis-tick {
  position: absolute;
  top: 0;
  width: 1px;
  height: 5px;
  background: var(--color-rule-dark);
}

.range-axis-label {
  position: absolute;
  top: 8px;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 10px;
  line-height: 1.4;
  color: var(--color-text-2-dark);
}
```

Position ticks and labels at `t / max * 100%`. Align the first label left and the last label right with endpoint-specific transforms. Use `9px` labels on mobile; put the terminal unit in a sans span.

Retain the existing CMS explanatory note and the luminous circular d50 markers.

### P2 — Correct the specialised heading sizes

**Wrong:** Reusing `.heading-2-sm` gives several distinct board roles the same size.

**Where:** `RenderBlocks.tsx`; scoped classes in `globals.css`.

**Change:**

| Role | Desktop size / line-height | Mobile size / line-height |
|---|---:|---:|
| Company heading | `60px / 62px` | `46px / 47px` |
| Evaluation heading | `60px / 62px` | `44px / 45px` |
| Closing invitation | `58px / 60px` | `43px / 44px` |

Keep `--font-display`, weight `400`, tracking `-.035em`. Set the evaluation heading’s desktop maximum width to `390px`, replacing `420px`. Scope these adjustments to their blocks rather than changing `.heading-2-sm` globally.

### P2 — Make comparison-table wrapping deliberate

**Wrong:** “Documentation” breaks mid-word on mobile. The stylesheet combines a first-column minimum width with a later fixed-layout table and `overflow-wrap: anywhere`, producing conflicting intentions.

**Where:** `RenderBlocks.tsx` — homepage comparison table; `globals.css` — mobile table rules.

**Change:**

- Add `home-compare` to this table.
- Render parameter cells as `<th scope="row">`, preserving their normal visual weight.
- At widths below 640 px:

  ```css
  .home-compare {
    table-layout: fixed;
    font-size: 12px;
    line-height: 1.55;
  }

  .home-compare th,
  .home-compare td {
    min-width: 0;
    padding: 12px 9px;
    overflow-wrap: break-word;
    word-break: normal;
  }

  .home-compare th:first-child {
    width: 25%;
    font-size: 11px;
  }

  .home-compare thead th {
    font-size: 11px;
  }
  ```

- Retain `--color-tint` throughout the Protpure column and its deep-teal small-caps header.
- Apply these corrections only to the homepage comparison; do not force wider product specification tables into the same layout.

### P2 — Bring the floating contact control into the palette

**Wrong:** The saturated WhatsApp green introduces an unrelated focal point over the hero/trust area. Its shadow and scale hover also differ from the site’s restrained controls.

**Where:** `src/app/(frontend)/layout.tsx` — fixed WhatsApp anchor.

**Change:**

Replace the green fill, white icon, shadow and scale hover with:

```css
background: var(--color-field-raised);
color: var(--color-teal-lum);
border: 1px solid var(--color-rule-dark);
box-shadow: none;
```

Use `--color-field` on hover. Keep the existing `48px` target, circular shape, accessible label and destination. Position it `24px` from the right and `20px` above the bottom, including the bottom safe-area inset.

The black “N” badge is development UI, not a brand element; exclude it from the next production QA capture.

## 3. Mobile-specific issues

### P2 — Remove the doubled evaluation-to-FAQ spacing

The current separate wrappers produce `96px` between the evaluation panel and FAQ eyebrow. Apply the paired composition above so this becomes `39px`. Keep `48px` outside the combined chapter.

### P2 — Restore the compact catalogue footnote row

**Where:** `RenderBlocks.tsx` — `productCategories` footnote wrapper.

The “All 16 products” link drops onto a separate row and adds unnecessary height.

Use `flex-direction: row; align-items: flex-start; justify-content: space-between; gap: 20px`. At mobile widths, give the footnote `max-width: 170px`; retain the link’s `11px` type and prevent it from shrinking. Reset the footnote maximum width to `420px` at desktop widths.

### P2 — Give compact links a full touch target

**Where:** application/service links in `RenderBlocks.tsx`, footer navigation in `Footer.tsx`, and `.faq-item summary` in `globals.css`.

Several controls have only 32 px or text-height clickable areas.

Below 640 px:

- Set application and service links to `min-height: 44px`.
- Make footer navigation anchors `display: flex; align-items: center; min-height: 44px`; reduce their list row gap from `8px` to `0`.
- Set FAQ summaries to `min-height: 44px` and `.faq-item` padding to `9px 0`, keeping closed rows approximately their current overall height.
- Preserve the existing text sizes; expand the actual interactive area.

### Keep the single-column reasons list

The mobile board uses two columns for the four reasons, but the built single-column arrangement gives the approved descriptions substantially more readable line lengths. Do not restore the narrower board grid simply to reduce page height.

## 4. Better than the board — keep

- **CMS-driven product names in chemistry cards.** The taxonomy is connected to actual catalogue content while retaining the board’s compact scientific presentation.
- **Founder initials when no photograph exists.** This is cleaner for visitors than a bracketed design placeholder and preserves the intended portrait footprint.
- **Suppressed empty customer/facility placeholders.** Keep the real statements and existing CMS slots without exposing unfinished board annotations.
- **The mobile reasons list.** Its extra height earns its place through improved readability.
- **The comparison header.** The teal small-caps label and tinted Protpure column correctly incorporate the chosen Clean Room detail.
- **The quantitative range implementation.** Keep the shared numerical scale and CMS-derived ranges; improve its typography and axis rather than redrawing it as decoration.
- **The subdued empty basket count.** The outlined zero reduces header noise; the filled state can carry emphasis when the basket contains items.