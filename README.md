# protpure-web

Website + headless CMS for **Protpure Tech Pvt. Ltd.** — agarose chromatography resins, made in India, supplied worldwide.

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, standalone output) |
| CMS | Payload 3 (embedded, Postgres via `@payloadcms/db-postgres`) |
| Styling | Tailwind CSS 4, self-hosted Inter + Manrope |
| Email | Resend via `@payloadcms/email-resend`, React Email templates |
| AI access | `/llms.txt`, `/llms-full.txt`, `/md/*`, `Accept: text/markdown`, `/api/public/*`, MCP server at `/mcp` |
| Deploy | Docker (Dokploy on Hetzner); media on a volume; migrations run on boot |

## Quick start (local)

```bash
cp .env.example .env            # set DATABASE_URL, PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL=http://localhost:3000
pnpm install
pnpm seed                       # creates the admin user + imports Protpure's catalogue, pages, PDFs, images
pnpm dev                        # http://localhost:3000  ·  admin at /admin
```

Or with Docker Compose (Postgres included): `docker compose up`, then `docker compose exec web pnpm seed`.

Default admin (change immediately): `admin@protpure.com` / `ChangeMe-Protpure-2026!` — or set `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` before seeding.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server (schema pushed to the DB automatically) |
| `pnpm build` / `pnpm start` | Production build / start |
| `pnpm seed [--reset]` | Idempotent content seed from `src/seed/**` + `seed/**` assets |
| `pnpm migrate:create` | Generate a migration after changing collections (commit it) |
| `pnpm migrate` | Apply migrations (production does this automatically on boot) |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` after schema changes |
| `pnpm typecheck` · `pnpm lint` · `pnpm test` | Checks |

## Project layout

```
src/
  payload.config.ts        CMS config (collections, globals, email, SEO plugin, migrations)
  collections/             products, product-categories, applications, services, pages, posts,
                           updates (LinkedIn), documents (PDF), media, faqs, team, testimonials,
                           certifications, customers, inquiries, subscribers, users
  globals/                 site-settings, header, footer
  blocks/config.ts         Page builder blocks (26 types)
  components/blocks/       RenderBlocks.tsx + trust/* (logo wall, certifications, gallery, publications, proof bar)
  app/(frontend)/          Public site routes
  app/(payload)/           Admin panel + Payload REST/GraphQL (generated)
  app/api/public/          Read-only JSON API + POST /api/public/inquiries
  app/mcp/route.ts         MCP server (Streamable HTTP)
  app/md/[...path]/        Markdown twin of every content page
  app/llms.txt, llms-full.txt
  proxy.ts                 Accept: text/markdown → /md rewrite
  lib/data.ts              Cached data access (unstable_cache + tag revalidation)
  lib/markdown.ts          Content → Markdown renderers (AI surfaces)
  lib/jsonld.ts            schema.org structured data
  emails/                  React Email templates + send helpers
  seed/                    Seed runner + Protpure content data
  migrations/              Postgres migrations (generated)
seed/media, seed/documents Images and PDFs imported by the seed
```

## How content works

* **Products** carry structured specs: chemistry, grades (particle size, d50, flow velocity, DBC, pressure/flow), a parameter table with an optional "typical market spec" column, use cases, pack sizes/catalog numbers, documents, related products. Everything on a product page, in the compare tool, in `/md`, in the JSON API and in MCP responses comes from these fields — edit once, published everywhere.
* **Pages** are block-based. `home`, `about`, `technology`, `global-supply`, `privacy`, `terms` are seeded. A page whose slug matches a listing route (`products`, `blog`, `resources`, `contact`, `request-quote`, `faq`, `applications`, `services`, `updates`) supplies that route's hero and any extra blocks.
* **Trust & proof** is content, not copy: *Company → Certifications & claims* (name, kind, issuer, expiry, certificate PDF), *Sales → Customers* (logo wall, shown only with "Show logo" + a logo), *Company → Team* (credentials, expertise, publications, featured), *Company → Testimonials* (context, "consent on file"), and *Site settings → Company → Proof points* (founded, team size, capacity, customers statement, LinkedIn followers). The `logoWall`, `certificationsStrip`, `gallery`, `publications` and `proofBar` blocks render them and stay invisible (or show the customers statement) while a collection is empty — there are no hard-coded placeholders. The same data feeds `/md/company`, `/api/public/company`, the MCP `get_company_info` tool and the Organization JSON-LD (founder, foundingDate, numberOfEmployees, hasCredential).
* **Drafts, versions, live preview** are enabled on products, pages and posts; LinkedIn updates also have drafts. "Preview" in the admin opens the page in draft mode; the live-preview pane re-renders on every change. Public reads (site, `/md`, JSON API, MCP) only ever see published documents.
* **Caching**: pages render on demand from a tag-cached data layer. Every save in the admin busts the cache, so edits are live immediately. Docker builds never touch the database.
* **LinkedIn updates**: paste a public post URL; the site stores a summary card and embeds the post on demand. (LinkedIn's company-posts API needs Marketing Developer Platform approval — this avoids it.) Each update has a `kind` (product launch, data, milestone, services, perspective) that the LinkedIn feed block can filter on. The seed ships five **draft** updates written from Protpure's public posts, without URLs: open each, paste the post URL, correct the date, publish.

## Transactional email

Configured through `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_FROM_NAME` (verify the sending domain in Resend and add its DNS records).

| Trigger | Emails |
| --- | --- |
| Quote / evaluation / technical / partnership / contact request (website RFQ basket, API or MCP) | Confirmation to the requester (reply-to = sales inbox) + notification to every address in **Site settings → Sales & email → Inquiry notification emails** (reply-to = requester). Both list the requested line items (product, grade, pack size, quantity, purpose) and repeat the paid-sample-kit policy when a line is a sample kit |
| Newsletter signup | Double opt-in confirmation, then welcome email with unsubscribe link |
| Admin forgot-password | Payload default |

Without `RESEND_API_KEY` emails are logged to the console instead of sent. `EMAIL_OVERRIDE_TO` routes every message to one inbox for testing.

Inquiries are stored in **Sales → Inquiries** with status, assignee and internal notes; subscribers in **Sales → Newsletter subscribers** (export confirmed ones to your mailing tool).

### RFQ basket

Protpure sells by quotation and ships **no free samples** — paid sample kits (5–25 mL packs or a 1 mL pre-packed column) are credited against the first bulk order. Buyers therefore collect several products in one request:

* **Add to RFQ basket** on every product card, in the product hero and per row of the pack-size table (pre-filled with that grade / pack / catalogue number). A picker asks for grade, pack size, quantity and purpose (`sample-kit`, `evaluation`, `production`, `other`) when the product offers a choice.
* The header shows a basket icon with a line count; it opens a slide-over drawer (`src/components/rfq/BasketDrawer.tsx`) where lines can be edited or removed. "Request a quote" opens the drawer when the basket has items.
* `/request-quote` shows the basket as an editable table above the form and submits **one** inquiry with an `items[]` array. `?product=ID` (and `?type=`) links still work: the product is added to the basket on arrival.
* State lives in `localStorage` (`protpure.rfq.v1`), survives navigation and follows other tabs; the shared reducer and validation are in `src/lib/rfq.ts` (unit-tested in `src/__tests__/rfq.test.ts`).
* In the admin, **Sales → Inquiries** lists the item count and shows each line (product link, name snapshot, grade, pack size, catalogue number, quantity, purpose, note). The legacy `products` / `requestedItems` fields remain for older API callers.

## AI / agent access

* `GET /llms.txt` — site map for LLMs; `GET /llms-full.txt` — the whole site as Markdown.
* `GET /md/<path>` (e.g. `/md/products/sp-agarose`, `/md/about`, `/md/company`) or any HTML URL with `Accept: text/markdown`.
* `GET /api/public/products[?category=&grade=&q=]`, `/api/public/products/{slug}`, `/api/public/documents[?type=]`, `/api/public/updates[?kind=&limit=]`, `/api/public/company` (contact, proof points, claims, structured certifications, team); `POST /api/public/inquiries` (JSON, rate-limited).
* MCP server: `POST /mcp` (Streamable HTTP, no auth). Tools: `list_products`, `get_product`, `compare_products`, `search_documents`, `list_applications`, `get_company_info`, `list_updates`, `request_quote`. Client config: `{ "protpure": { "url": "https://protpure.com/mcp" } }`.
* Filing a quote from an agent or integration — `POST /api/public/inquiries` and the MCP `request_quote` tool take the same `items[]` the website basket sends:

  ```json
  {
    "type": "quote", "name": "Ada Lovelace", "email": "ada@example.com", "organization": "Example Biologics", "country": "Germany",
    "application": "His-tagged enzyme capture",
    "items": [
      { "productSlug": "ni-nta-agarose", "grade": "fast-flow", "packSize": "25 mL", "quantity": 1, "purpose": "sample-kit" },
      { "productSlug": "sp-agarose", "grade": "precise", "packSize": "1 L", "quantity": 2, "purpose": "production", "notes": "10 cm column" }
    ]
  }
  ```

  Each item needs `productId`, `productSlug` or a free-text `productName`; `grade` is `faster | fast-flow | precise | hr`, `purpose` is `sample-kit | evaluation | production | other` (default `production`). The legacy `productIds[]` / `productSlugs[]` + `requestedItems` fields are still accepted. `llms.txt`, `/md/products/*` and `get_company_info` describe the basket and the paid-sample-kit policy so assistants file lines correctly.
* JSON-LD on every page (Organization with founder / foundingDate / numberOfEmployees / hasCredential, WebSite, Product with `additionalProperty` specs, BreadcrumbList, Article, FAQPage); `robots.txt` explicitly allows major AI crawlers; `sitemap.xml`; `blog/rss.xml`.

## Deployment (Dokploy)

1. **Database**: create a database on the shared Postgres: `CREATE DATABASE protpure;` (and a user with rights on it).
2. **Application** → new app from this Git repo, build type *Dockerfile*. Build arg `NEXT_PUBLIC_SERVER_URL=https://protpure.com` (it is inlined at build time).
3. **Environment** (runtime): `DATABASE_URL`, `PAYLOAD_SECRET` (`openssl rand -hex 32`), `NEXT_PUBLIC_SERVER_URL`, `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_FROM_NAME`, and — for the first deploy only — `SEED_TOKEN`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`.
4. **Volume**: mount a persistent volume at `/app/media` (uploads and PDFs).
5. **Domain**: `protpure.com` → port 3000, HTTPS via Traefik/Let's Encrypt.
6. Deploy. On first boot the app runs the migrations. Then import content once:
   `curl -X POST https://protpure.com/api/seed -H "x-seed-token: $SEED_TOKEN"` (add `?reset=1` to wipe seeded collections first).
7. Log in at `/admin`, change the password, remove `SEED_TOKEN` and redeploy.

Health check: `GET /api/public/company`. Backups: the Postgres database + the `/app/media` volume.

### Schema changes after go-live

Edit collections → `pnpm generate:types` → `pnpm migrate:create` → commit the migration → deploy. Pending migrations run automatically on boot (`prodMigrations` in `payload.config.ts`); dev uses schema push.

## Editor guide (for Dr. Rucha)

* **Products** → *Catalog → Products*. Tabs: Overview (name, summary, description, features, image), Specifications (chemistry, grades, spec table, applications, use cases), Ordering (pack sizes, lead time, documents, related). Save as draft, preview, then Publish. "Featured" shows it on the homepage.
* **Datasheets & PDFs** → *Content → Documents*: upload the PDF, pick a type, link products. They appear on product pages, in `/resources`, and are listed for AI assistants.
* **Blog** → *Content → Blog posts*. **LinkedIn** → *Content → LinkedIn updates*: title, post URL, two-sentence summary, kind, optional image. Save as draft until the post is live; drafts never appear on the site. The five seeded drafts only need the post URL and the right date before publishing.
* **Homepage & pages** → *Content → Pages*: hero + blocks (stats, feature grids, comparison tables, particle-size platform, resin selector, categories, featured products, applications, services, documents, blog, LinkedIn feed, testimonials, team, timeline, FAQ, image, forms, CTA, customer logo wall, certifications strip, photo gallery, publications, proof bar). Drag to reorder.
* **Proof & trust**
  * *Company → Certifications & claims*: one entry per certification or claim. Pick the kind (quality system, product claim, regulatory, membership, award), add the issuer and expiry for third-party certificates, and link the certificate PDF (upload it first under *Content → Documents*, type "Certificate"). The three current claims are seeded as product claims. Keep the short claims in *Site settings → Company → Certifications & claims* for the trust strip.
  * *Sales → Customers*: customer references for the logo wall. Upload the logo and tick **Show logo** only with the customer's written permission; until then use the anonymised label in copy. Nothing is seeded.
  * *Company → Team*: photo (initials are shown until one is uploaded), credentials, areas of expertise and publications (verify title, journal, year and link against the published record before publishing). **Featured** members feed the publications block and the founder entry in structured data.
  * *Company → Testimonials*: quote, person, organisation, context. Tick **Consent on file** once written permission exists; publish nothing without it. Nothing is seeded.
  * *Content → Pages → About*: the "Inside the Anand facility" gallery block is an empty slot — add facility, lab and team photos with captions and it appears.
* **Company details, proof points (founded, team size, capacity, customers statement, LinkedIn followers), contact, notification emails, regions served, announcement bar, AI summary** → *Settings → Site settings*. Navigation → *Settings → Header / Footer*.
* **Inquiries** → *Sales → Inquiries*: every quote/contact request with status tracking and the requested items (grade, pack size, quantity, sample kit vs production). Reply to the notification email directly — its reply-to is the requester.
* **Users** (admins only) → *Admin → Users*: add editors.
