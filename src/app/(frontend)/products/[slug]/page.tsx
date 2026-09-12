import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import * as React from 'react'
import { RichText } from '@/components/RichText'
import { LivePreview } from '@/components/LivePreview'
import { FaqList } from '@/components/FaqList'
import { DocumentRow, ProductCard, TableFigure, figureParts } from '@/components/product/cards'
import { OrderingTable } from '@/components/product/OrderingTable'
import { QuoteBar } from '@/components/product/QuoteBar'
import { SectionNav, type Section } from '@/components/product/SectionNav'
import { AddToBasketButton } from '@/components/rfq/AddToBasketButton'
import { QuoteCta } from '@/components/rfq/BasketButton'
import { Breadcrumbs, ButtonLink, CmsImage, StatusBadge } from '@/components/ui'
import { BeadField } from '@/components/visual/BeadField'
import { BeadSchematic } from '@/components/visual/BeadSchematic'
import { Chapter, ChapterEyebrow } from '@/components/visual/Chapter'
import { RangeBars } from '@/components/visual/RangeBars'
import { Reveal } from '@/components/visual/Reveal'
import { ArrowIcon, CheckIcon, DocumentIcon, DownloadIcon } from '@/components/visual/icons'
import { getFaqs, getProduct, getSiteSettings } from '@/lib/data'
import { categoryOf, gradeLabel, pressureOnly, referenceGrade } from '@/lib/catalog'
import { toBasketProduct, type GradeValue } from '@/lib/rfq'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbJsonLd, faqJsonLd, JsonLd, productJsonLd } from '@/lib/jsonld'
import { cn, mediaAlt } from '@/lib/utils'
import type { Application, Document, Product } from '@/payload-types'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = await getProduct(slug)
  if (!p) return {}
  return buildMetadata({ meta: p.meta, title: `${p.name}${p.subtitle ? ` — ${p.subtitle}` : ''}`, description: p.summary, path: `/products/${slug}`, image: p.image })
}

type Grade = NonNullable<Product['grades']>[number]

const SECTION = 'scroll-mt-[140px] lg:scroll-mt-[150px]'
/** Product sections stack with 60 px between them (DIRECTION: product-section padding-top 60, no bottom padding). */
const CHAPTER = 'pt-12 pb-0 lg:pt-[60px] lg:pb-0'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()
  const [settings, faqs] = await Promise.all([getSiteSettings(), getFaqs({ product: product.id })])
  const cat = categoryOf(product)
  const docs = (product.documents ?? []).filter((d): d is Document => typeof d === 'object')
  const datasheet = docs.find((d) => d.type === 'datasheet')
  const related = (product.relatedProducts ?? []).filter((p): p is Product => typeof p === 'object')
  const applications = (product.applications ?? []).filter((a): a is Application => typeof a === 'object')
  const grades = product.grades ?? []
  const specs = product.specs ?? []
  const hasMarket = specs.some((s) => s.marketSpec)
  const leadTime = product.leadTime || settings.leadTime || '2–3 weeks ex-works'
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    ...(cat ? [{ label: cat.name, href: `/products/category/${cat.slug}` }] : []),
    { label: product.name },
  ]
  const basketProduct = toBasketProduct(product)
  const reference = referenceGrade(grades)
  const has = (key: keyof Grade) => grades.some((g) => g[key])
  const image = product.image && typeof product.image === 'object' ? product.image : null

  const sections: Section[] = [
    { id: 'overview', label: 'Overview' },
    ...(grades.length ? [{ id: 'grades', label: 'Grades' }] : []),
    ...(specs.length ? [{ id: 'specifications', label: 'Specifications' }] : []),
    { id: 'ordering', label: 'Ordering' },
    { id: 'documents', label: 'Documents' },
    ...(faqs.length ? [{ id: 'faq', label: 'FAQ' }] : []),
  ]
  const number = (id: string) => sections.findIndex((s) => s.id === id) + 1

  return (
    <>
      <LivePreview />

      {/* ---------- Hero: dark field, photo arch ---------- */}
      <section id="product-hero" className="surface-dark relative overflow-hidden">
        <BeadField density="normal" opacity={0.12} className="bottom-[-120px] right-[-80px] w-[380px] lg:bottom-[-100px] lg:left-[700px] lg:right-auto" />
        <div className="container-x relative grid gap-10 pb-10 pt-8 lg:grid-cols-[1.2fr_1fr] lg:gap-20 lg:pb-12 lg:pt-[35px]">
          <div className="relative z-[1] min-w-0">
            <Breadcrumbs items={crumbs} onDark />
            <p className="eyebrow mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 lg:mt-10">
              {cat ? (
                <Link href={`/products/category/${cat.slug}`} className="hover:text-surface">
                  {cat.name}
                </Link>
              ) : null}
              <StatusBadge status={product.availability} className="text-[11px] normal-case tracking-normal text-teal-lum" />
            </p>
            <h1 className="heading-display mt-4 text-wrap-initial">{product.name}</h1>
            {product.subtitle ? <p className="mt-3 font-display text-[26px] leading-[1.1] tracking-[-0.03em] text-teal-lum lg:text-[33px]">{product.subtitle}</p> : null}
            <p className="mt-5 max-w-[585px] text-[15px] leading-[1.6] text-text-2-dark">{product.summary}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
              <AddToBasketButton product={basketProduct} appearance="primary" size="md" className="min-h-12" />
              <span className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {datasheet?.url ? (
                  <a href={datasheet.url} target="_blank" rel="noopener noreferrer" className="text-link text-[13px]">
                    <DownloadIcon /> Download datasheet
                  </a>
                ) : (
                  <Link href={`/request-quote?type=technical&product=${product.id}`} className="text-link text-[13px]">
                    <DocumentIcon /> Request datasheet
                  </Link>
                )}
                <Link href={`/compare?ids=${product.slug}`} className="text-link text-[13px]">
                  Compare
                </Link>
              </span>
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-rule-dark pt-6 sm:grid-cols-[1fr_1.3fr_1fr_1fr] lg:mt-[25px]">
              {product.chemistry?.ligand ? <Fact k="Ligand" v={product.chemistry.ligand} /> : null}
              {product.chemistry?.matrix ? <Fact k="Matrix" v={product.chemistry.matrix} figure /> : null}
              {grades.length ? <Fact k="Grades" v={grades.map((g) => gradeLabel(g.grade)).join(' · ')} /> : null}
              <Fact k="Lead time" v={leadTime} figure />
            </dl>
          </div>

          <figure className="relative z-[1] self-center">
            <div className="arch-lg relative flex h-[338px] items-center justify-center bg-white lg:h-[475px]">
              {image ? (
                <CmsImage media={image} size="large" className="h-[300px] w-[300px] object-contain lg:h-[435px] lg:w-[435px]" sizes="(min-width: 1024px) 40vw, 90vw" priority />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-text-2">
                  <DocumentIcon className="h-10 w-10" />
                  <span className="mono text-[11px]">[PHOTO: {product.name}]</span>
                </div>
              )}
              {image ? <figcaption className="absolute bottom-[18px] left-[26px] text-[10px] text-text-2">{image.caption || mediaAlt(image, product.name)}</figcaption> : null}
            </div>
          </figure>
        </div>
      </section>

      {/* ---------- Sticky section nav ---------- */}
      <SectionNav sections={sections}>
        <AddToBasketButton product={basketProduct} appearance="primary" size="sm" className="min-h-9" />
      </SectionNav>

      {/* ---------- 01 Overview: description + chemistry panel ---------- */}
      <section id="overview" className={cn('bg-surface pt-12 lg:pt-[60px]', SECTION)}>
        <Reveal className="container-x grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-[90px]">
          <div className="min-w-0">
            <ChapterEyebrow number={number('overview')} className="mb-5">
              Overview
            </ChapterEyebrow>
            <h2 className="heading-2-md max-w-[660px]">Overview</h2>
            <RichText data={product.description} className="mt-6 max-w-[680px]" />
            {product.useCases?.length ? (
              <>
                <h3 className="heading-4 mt-10">Typical use cases</h3>
                <ul className="mt-4 grid gap-x-6 gap-y-3 text-[14px] leading-[1.5] text-text-2 sm:grid-cols-2">
                  {product.useCases.map((u) => (
                    <li key={u.id} className="flex gap-3">
                      <CheckIcon className="mt-[3px] h-4 w-4 shrink-0 text-teal-deep" /> {u.text}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {applications.length ? (
              <div className="mt-8">
                <p className="eyebrow mb-3 text-[10px]">Applications</p>
                <div className="flex flex-wrap gap-2">
                  {applications.map((a) => (
                    <Link key={a.id} href={`/applications/${a.slug}`} className="chip min-h-8 hover:border-teal-deep hover:text-teal-deep">
                      {a.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="min-w-0 lg:pt-2" aria-label="Chemistry">
            <div className="card p-5 lg:p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="eyebrow text-[10px]">Fig. 01 / Chemistry</p>
                <p className="mono text-[10px] text-text-2">Schematic</p>
              </div>
              <BeadSchematic tone="light" className="mt-4" />
              <dl className="mt-2 divide-y divide-rule border-y border-rule text-[13px]">
                {product.chemistry?.functionalType ? <Row k="Type" v={product.chemistry.functionalType} /> : null}
                {product.chemistry?.ligand ? <Row k="Ligand" v={product.chemistry.ligand} /> : null}
                {product.chemistry?.matrix ? <Row k="Matrix" v={product.chemistry.matrix} figure /> : null}
                {reference?.d50 ? <Row k={`d50V · ${gradeLabel(reference.grade)}`} v={reference.d50} figure /> : null}
              </dl>
              {product.keyFeatures?.length ? (
                <>
                  <p className="eyebrow mt-6 text-[10px]">Designed for your process</p>
                  <ul className="mt-3 grid gap-2.5 text-[13px] leading-[1.5] text-ink">
                    {product.keyFeatures.map((f) => (
                      <li key={f.id} className="flex gap-2.5">
                        <CheckIcon className="mt-[3px] h-4 w-4 shrink-0 text-teal-deep" />
                        {f.text}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
            {product.gallery?.length ? (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {product.gallery.map((g, i) => (
                  <div key={i} className="card overflow-hidden">
                    <CmsImage media={g} size="thumbnail" className="aspect-square w-full object-contain p-2" sizes="120px" />
                  </div>
                ))}
              </div>
            ) : null}
          </aside>
        </Reveal>
      </section>

      {/* ---------- 02 Grades ---------- */}
      {grades.length ? (
        <Chapter
          id="grades"
          number={number('grades')}
          eyebrow="Grade comparison"
          heading="Grades"
          intro="Same ligand chemistry on the same cross-linked agarose backbone; the bead size sets flow velocity and resolution. Not sure which grade? Ask our scientists."
          className={cn(CHAPTER, SECTION)}
          size="md"
          aside={
            <Link href="/technology" className="text-link text-[13px]">
              How the particle platform works <ArrowIcon />
            </Link>
          }
        >
          <div className="overflow-x-auto" role="region" aria-label={`${product.name} grade comparison`} tabIndex={0}>
            <table className="spec-table grade-table min-w-[720px]">
              <thead>
                <tr>
                  <th scope="col">{product.name} grade</th>
                  {has('particleSizeRange') ? <th scope="col">Particle range</th> : null}
                  {has('d50') ? <th scope="col">d50V</th> : null}
                  {has('maxFlowVelocity') ? <th scope="col">Linear flow velocity</th> : null}
                  {has('dynamicBindingCapacity') ? (
                    <th scope="col" className="highlight">
                      Dynamic binding capacity
                    </th>
                  ) : null}
                  {has('pressureFlow') ? <th scope="col">Pressure / bed height</th> : null}
                </tr>
              </thead>
              <tbody>
                {grades.map((g) => (
                  <tr key={g.id}>
                    <th scope="row" className="align-middle">
                      <span className="font-display text-[25px] leading-[1.2] tracking-[-0.02em] text-ink">{gradeLabel(g.grade)}</span>
                      {g.label && g.label !== `${product.name} ${gradeLabel(g.grade)}` ? <small className="mt-1 block text-[10px] text-text-2">{g.label}</small> : null}
                    </th>
                    {has('particleSizeRange') ? (
                      <td className="align-middle">
                        <TableFigure value={g.particleSizeRange} />
                      </td>
                    ) : null}
                    {has('d50') ? (
                      <td className="align-middle">
                        <TableFigure value={g.d50} />
                      </td>
                    ) : null}
                    {has('maxFlowVelocity') ? (
                      <td className="align-middle">
                        <TableFigure value={g.maxFlowVelocity} />
                      </td>
                    ) : null}
                    {has('dynamicBindingCapacity') ? (
                      <td className="highlight align-middle">
                        <TableFigure value={g.dynamicBindingCapacity} />
                      </td>
                    ) : null}
                    {has('pressureFlow') ? (
                      <td className="align-middle">
                        <TableFigure value={pressureOnly(g)} />
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {has('particleSizeRange') || has('d50') ? (
            <div className="surface-dark mt-6 px-5 py-6 lg:px-8 lg:py-8">
              <RangeBars
                grades={grades.map((g) => ({ id: g.id, name: gradeLabel(g.grade), d50: g.d50, sizeRange: g.particleSizeRange, maxFlow: g.maxFlowVelocity, text: g.dynamicBindingCapacity ? `DBC ${g.dynamicBindingCapacity}` : pressureOnly(g) }))}
                legend={['Grade / particle size distribution', 'Linear flow velocity / binding capacity']}
              />
              <p className="mt-4 text-[11px] leading-[1.5] text-text-2-dark">Range = particle size distribution. Marker = d50V. Flow figures are the product-specific ranges for each grade under the stated bed-height and pressure conditions.</p>
            </div>
          ) : null}
          <p className="table-note max-w-[720px]">Product-specific values from the {product.name} grade table. These flow ranges can differ from the general particle-platform maxima; compare under the stated bed-height and pressure conditions.</p>
        </Chapter>
      ) : null}

      {/* ---------- 03 Specifications ---------- */}
      {specs.length ? (
        <Chapter id="specifications" number={number('specifications')} eyebrow="Technical specification" heading="Specifications" intro={hasMarket ? `${product.name} compared with typical market specifications. Use your own process conditions for qualification.` : undefined} className={cn(CHAPTER, SECTION)}
          size="md">
          <div className="overflow-x-auto" role="region" aria-label={`${product.name} specifications`} tabIndex={0}>
            <table className="spec-table spec-comparison">
              <thead>
                <tr>
                  <th scope="col" className="w-[30%]">
                    Parameter
                  </th>
                  <th scope="col" className="highlight">
                    Protpure {product.name}
                  </th>
                  {hasMarket ? <th scope="col">Typical market specification</th> : null}
                </tr>
              </thead>
              <tbody>
                {specs.map((s) => (
                  <SpecRow key={s.id} label={s.parameter} value={s.value} market={hasMarket ? (s.marketSpec ?? '') : undefined} />
                ))}
              </tbody>
            </table>
          </div>
          <p className="table-note max-w-[720px]">Typical values from our technical datasheets, not a guarantee of equivalence in your process. Evaluate side by side under your SOPs. Lot-specific data comes with the certificate of analysis.</p>
        </Chapter>
      ) : null}

      {/* ---------- 04 Ordering ---------- */}
      <Chapter
        id="ordering"
        number={number('ordering')}
        eyebrow="Ordering"
        heading="Ordering"
        intro={
          <>
            Pricing by quotation · <span className="mono">{leadTime}</span>
            <br />
            {product.bulkAvailable ? 'Bulk and custom volumes available.' : 'Custom volumes on request.'}
          </>
        }
        className={cn(CHAPTER, SECTION)}
          size="md"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-[42px]">
          <div className="min-w-0">
            {product.packSizes?.length ? (
              <>
                <OrderingTable product={basketProduct} defaultGrade={reference?.grade as GradeValue | undefined} />
                <p className="table-note max-w-[720px]">Catalogue numbers identify pack sizes. Quantity is the number of packs; the selected grade travels as its own line in your RFQ and is confirmed in the quote.</p>
              </>
            ) : (
              <div className="card p-6">
                <p className="text-[14px] text-text-2">Pack sizes for {product.name} are quoted to your requirement.</p>
                <div className="mt-4">
                  <AddToBasketButton product={basketProduct} appearance="primary" size="sm" />
                </div>
              </div>
            )}

            {product.evaluationNote ? (
              <div className="mt-7 border border-[#b6cfc4] bg-tint p-5 text-tint-ink lg:p-6">
                <p className="eyebrow text-[10px]">Paid evaluation packs</p>
                <h3 className="mt-3 font-display text-[28px] leading-[1.05] tracking-[-0.03em] text-ink lg:text-[32px]">Qualify before you scale.</h3>
                <p className="mt-3 max-w-[560px] text-[13px] leading-[1.6] text-tint-ink">{product.evaluationNote}</p>
                <ButtonLink href={`/request-quote?type=evaluation&product=${product.id}`} appearance="ink" size="sm" className="mt-5 min-h-11">
                  Request an evaluation quote <ArrowIcon />
                </ButtonLink>
              </div>
            ) : null}
          </div>

          <aside className="surface-raised p-6 lg:p-7" aria-label="Get a quotation">
            <p className="eyebrow text-[10px]">Your RFQ</p>
            <h3 className="mt-3 font-display text-[30px] leading-[1.05] tracking-[-0.03em] text-surface">One request. Every grade and volume.</h3>
            <dl className="mt-5 divide-y divide-rule-dark border-y border-rule-dark text-[13px]">
              <Row k="Lead time" v={leadTime} figure dark />
              <Row k="Response" v={settings.responseTime || '1–2 business days'} figure dark />
              <Row k="Documentation" v="Datasheet and CoA with your quote" dark />
              <Row k="Shipping" v="Worldwide, ex-works" dark />
            </dl>
            <div className="mt-5 grid gap-2.5">
              <AddToBasketButton product={basketProduct} appearance="primary" size="md" className="w-full" />
              <QuoteCta href={`/request-quote?product=${product.id}`} label="Request a quote" className="btn-on-dark w-full" withArrow />
            </div>
            {settings.email ? (
              <p className="mt-4 text-[12px] leading-[1.6] text-text-2-dark">
                Prefer email?{' '}
                <a href={`mailto:${settings.email}?subject=${encodeURIComponent(`Quote request: ${product.name}`)}`} className="text-surface underline decoration-rule-dark underline-offset-4 hover:decoration-current">
                  {settings.email}
                </a>
              </p>
            ) : null}
          </aside>
        </div>
      </Chapter>

      {/* ---------- 05 Documents ---------- */}
      <Chapter id="documents" number={number('documents')} eyebrow="Documents" heading="Documentation for qualification." className={cn(CHAPTER, SECTION)}
          size="md">
        {docs.length ? (
          <div className="grid gap-x-5 md:grid-cols-2 xl:grid-cols-3">
            {docs.map((d) => (
              <DocumentRow key={d.id} doc={d} />
            ))}
          </div>
        ) : (
          <div className="grid gap-x-5 md:grid-cols-2 xl:grid-cols-3">
            <div className="flex items-start gap-4 border-b border-t border-rule border-t-rule-strong py-5">
              <DocumentIcon className="mt-1 h-5 w-5 shrink-0 text-teal-deep" />
              <div className="min-w-0">
                <p className="text-[17px] font-medium leading-tight text-ink">{product.name} datasheet</p>
                <p className="mono mt-2 text-[11px] text-text-2">[DOCUMENT: {product.name} PDF]</p>
                <p className="mt-2 text-[13px] leading-relaxed text-text-2">The technical datasheet is supplied on request while the download is being prepared.</p>
                <Link href={`/request-quote?type=technical&product=${product.id}`} className="text-link mt-4 text-[12px]">
                  Request datasheet <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>
        )}
      </Chapter>

      {/* ---------- 06 FAQ ---------- */}
      {faqs.length ? (
        <section id="faq" className={cn('bg-surface pt-12 lg:pt-[60px]', SECTION)}>
          <Reveal className="container-x grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-[90px]">
            <div>
              <ChapterEyebrow number={number('faq')} className="mb-5">
                Questions
              </ChapterEyebrow>
              <h2 className="heading-2-md">Questions</h2>
              <p className="text-body mt-5 max-w-[420px] text-text-2">Common questions about {product.name}. Need help with column geometry, feed or target? Our scientists can recommend a grade or screen it for you.</p>
            </div>
            <FaqList faqs={faqs} />
          </Reveal>
        </section>
      ) : null}

      {/* ---------- Related ---------- */}
      {related.length ? (
        <Chapter
          id="related"
          eyebrow="Related chemistries"
          heading="Related products"
          className="pt-12 pb-12 lg:pt-[60px] lg:pb-[65px]"
          size="md"
          aside={
            <Link href={`/compare?ids=${[product.slug, ...related.map((r) => r.slug)].slice(0, 3).join(',')}`} className="text-link text-[13px]">
              Compare side by side <ArrowIcon />
            </Link>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((r) => (
              <ProductCard key={r.id} product={r} compact />
            ))}
          </div>
        </Chapter>
      ) : (
        <div className="pb-12 lg:pb-20" />
      )}

      <QuoteBar product={basketProduct} availability={product.availability} leadTime={leadTime} datasheetUrl={datasheet?.url} />

      <JsonLd data={[productJsonLd(product), breadcrumbJsonLd(crumbs.map((c) => ({ name: c.label, href: c.href ?? `/products/${slug}` }))), ...(faqs.length ? [faqJsonLd(faqs)] : [])]} />
    </>
  )
}

/** Hero fact: uppercase label, value (mono when it is a figure). */
function Fact({ k, v, figure }: { k: string; v: string; figure?: boolean }) {
  const { head, tail, isFigure } = figure ? figureParts(v) : { head: v, tail: '', isFigure: false }
  return (
    <div className="min-w-0">
      <dt className="mb-1 text-[10px] uppercase tracking-[0.1em] text-text-2-dark">{k}</dt>
      <dd className="num text-[13px] leading-[1.5] text-surface">
        <span className={cn(isFigure && 'mono')}>{head}</span>
        {tail ? <span className="text-text-2-dark"> {tail}</span> : null}
      </dd>
    </div>
  )
}


/** Definition row for the chemistry panel and the quotation panel. */
function Row({ k, v, figure, dark }: { k: string; v: string; figure?: boolean; dark?: boolean }) {
  const { head, tail, isFigure } = figure ? figureParts(v) : { head: v, tail: '', isFigure: false }
  return (
    <div className="grid grid-cols-[minmax(0,38%)_1fr] gap-3 py-2.5">
      <dt className={dark ? 'text-text-2-dark' : 'text-text-2'}>{k}</dt>
      <dd className={cn('num min-w-0', dark ? 'text-surface' : 'text-ink')}>
        <span className={cn(isFigure && 'mono')}>{head}</span>
        {tail ? <span className={dark ? 'text-text-2-dark' : 'text-text-2'}> {tail}</span> : null}
      </dd>
    </div>
  )
}

function SpecRow({ label, value, market }: { label: string; value: string; market?: string }) {
  return (
    <tr>
      <th scope="row" className="font-normal">
        {label}
      </th>
      <td className="highlight">
        <TableFigure value={value} />
      </td>
      {market !== undefined ? <td>{market ? <TableFigure value={market} /> : <span className="text-text-2">—</span>}</td> : null}
    </tr>
  )
}
