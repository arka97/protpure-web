import Link from 'next/link'
import { draftMode } from 'next/headers'
import * as React from 'react'
import { RichText } from '@/components/RichText'
import { ButtonLink, CmsImage, CmsLinks, Icon } from '@/components/ui'
import { ApplicationCard, CategoryCard, DocumentRow, ProductCard, ServiceCard } from '@/components/product/cards'
import { FaqList } from '@/components/FaqList'
import { UpdateCard } from '@/components/UpdateCard'
import { PostCard } from '@/components/PostCard'
import { ResinSelector } from '@/components/product/ResinSelector'
import { InquiryForm } from '@/components/forms/InquiryForm'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { BeadField } from '@/components/visual/BeadField'
import { Chapter, ChapterEyebrow, type ChapterTone } from '@/components/visual/Chapter'
import { RangeBars } from '@/components/visual/RangeBars'
import { Reveal } from '@/components/visual/Reveal'
import { ArrowIcon, CheckIcon } from '@/components/visual/icons'
import { CertificationsStrip, Gallery, ProofBar, Publications } from '@/components/blocks/trust'
import { getApplications, getCategories, getCustomers, getDocuments, getFaqs, getPosts, getProducts, getServices, getSiteSettings, getTeam, getTestimonials, getUpdates } from '@/lib/data'
import { displayableCustomers } from '@/lib/trust'
import { toBasketProduct } from '@/lib/rfq'
import { cn, resolveLink } from '@/lib/utils'
import { categoryOf, slimProduct } from '@/lib/catalog'
import type { Customer, Page, Product, ProductCategory, Team, Testimonial } from '@/payload-types'

type Block = NonNullable<Page['layout']>[number]

/* ------------------------------------------------------------------------------------------------
 * Chapter numbering and composition
 *
 * The homepage reads as numbered chapters ("01 / THE CATALOGUE"). The eyebrow text is CMS copy; the
 * number is derived from the block's position among chapter-opening blocks. Some blocks *continue*
 * the previous chapter instead of opening a new one (a comparison table under the reasons grid, the
 * team line under the founder text, the services row and logo wall under the company spread) — they
 * render "attached": no top padding, the same surface tone, and the block before them shortens its
 * bottom padding so the chapter reads as one.
 * ---------------------------------------------------------------------------------------------- */

const CHAPTER_BLOCKS = new Set<Block['blockType']>([
  'productCategories', 'gradesPlatform', 'featureGrid', 'twoColumn', 'resinSelector', 'featuredProducts', 'teamGrid', 'timeline', 'testimonials',
  'latestPosts', 'linkedInFeed', 'applicationsGrid', 'servicesGrid', 'documentList', 'formBlock', 'faqBlock', 'cta', 'comparisonTable', 'logoWall',
])

function opensChapter(b: Block): boolean {
  if (!('eyebrow' in b) || !b.eyebrow) return false
  if (b.blockType === 'cta' && b.style !== 'evaluation') return false
  return CHAPTER_BLOCKS.has(b.blockType)
}

const isEvaluation = (b?: Block): b is Extract<Block, { blockType: 'cta' }> => b?.blockType === 'cta' && b.style === 'evaluation'

/** The evaluation panel and the FAQ that follows it compose as one two-column chapter. */
export function isPairedFaq(b: Block, prev?: Block): b is Extract<Block, { blockType: 'faqBlock' }> {
  return b.blockType === 'faqBlock' && isEvaluation(prev)
}

function isAttached(b: Block, prev?: Block): boolean {
  if (!prev) return false
  if (b.blockType === 'faqBlock' && isEvaluation(prev)) return true
  switch (b.blockType) {
    case 'comparisonTable':
      return !b.eyebrow && !b.intro
    case 'applicationsGrid':
      return b.layout === 'list'
    case 'servicesGrid':
      return b.layout === 'row'
    case 'teamGrid':
      return b.layout === 'spread'
    case 'logoWall':
      return !b.eyebrow && !b.heading && ['twoColumn', 'teamGrid', 'servicesGrid', 'logoWall', 'featureGrid', 'comparisonTable'].includes(prev.blockType)
    case 'faqBlock':
      return !b.eyebrow && !b.heading && !b.intro
    default:
      return false
  }
}

function toneOf(b: Block): ChapterTone {
  switch (b.blockType) {
    case 'twoColumn':
      return b.background === 'recessed' ? 'recessed' : 'light'
    case 'gradesPlatform':
      return 'dark'
    case 'stats':
      return b.style === 'dark' ? 'dark' : 'light'
    case 'timeline':
    case 'linkedInFeed':
      return 'recessed'
    case 'cta':
      return b.style === 'accent' ? 'accent' : b.style === 'light' ? 'recessed' : 'dark'
    default:
      return 'light'
  }
}

type Meta = { number: number | null; attached: boolean; tight: boolean; tone: ChapterTone }

export function planBlocks(blocks: Block[]): Meta[] {
  let chapter = 0
  const metas: Meta[] = blocks.map((b, i) => {
    const attached = isAttached(b, blocks[i - 1])
    const numbered = !attached && opensChapter(b)
    if (numbered) chapter++
    return { number: numbered ? chapter : null, attached, tight: false, tone: toneOf(b) }
  })
  for (let i = 0; i < blocks.length; i++) {
    if (metas[i].attached) metas[i].tone = metas[i - 1].tone
    if (metas[i + 1]?.attached) metas[i].tight = true
  }
  return metas
}

export async function RenderBlocks({ blocks }: { blocks?: Page['layout'] | null }) {
  if (!blocks?.length) return null
  const metas = planBlocks(blocks)
  const out: React.ReactNode[] = []
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]
    const next = blocks[i + 1]
    if (isEvaluation(b) && next && isPairedFaq(next, b)) {
      // Evaluation panel + FAQ side by side (one chapter, one number).
      out.push(
        <section key={b.id ?? i} className="bg-surface py-12 lg:py-20" id="evaluation">
          <Reveal className="container-x grid gap-[39px] lg:grid-cols-2 lg:gap-[70px] lg:items-start">
            <EvaluationPanel block={b} number={metas[i].number} />
            <FaqColumn block={next} number={null} dark={false} stacked />
          </Reveal>
        </section>,
      )
      i++
      continue
    }
    out.push(
      <React.Fragment key={b.id ?? i}>
        <RenderBlock block={b} meta={metas[i]} />
      </React.Fragment>,
    )
  }
  return <>{out}</>
}

/* ------------------------------------------------------------------------------------------------
 * Small helpers
 * ---------------------------------------------------------------------------------------------- */

/** Headings may italicise a short proposition with *asterisks*: "Four bead sizes. *One chemistry.*" */
function Heading({ text, dark }: { text?: string | null; dark?: boolean }) {
  if (!text) return null
  // Typed line breaks are deliberate breaks (segments still wrap naturally when narrow).
  const parts = text.trim().split(/(\*[^*]+\*|\n)/g).filter(Boolean)
  return (
    <>
      {parts.map((p, i) =>
        p === '\n' ? (
          <br key={i} />
        ) : p.startsWith('*') && p.endsWith('*') ? (
          <em key={i} className={cn('italic', dark ? 'text-teal-lum' : 'text-teal-deep')}>
            {p.slice(1, -1)}
          </em>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        ),
      )}
    </>
  )
}

function Paragraphs({ text, className }: { text?: string | null; className?: string }) {
  if (!text) return null
  return (
    <>
      {text.split(/\n\s*\n/).map((p, i) => (
        <p key={i} className={className}>
          {p}
        </p>
      ))}
    </>
  )
}

const nn = (n: number) => String(n).padStart(2, '0')

/** Product names shortened for the mode line: "SP Agarose" → "SP", "Agarose SEC Resin" → "SEC Resin". */
export function shortProductName(name: string) {
  return name.replace(/\s+Agarose(\s+Resin)?$/i, '').replace(/^Agarose\s+/i, '') || name
}

const RAIL = 'grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-[75px]'
const SPREAD = 'grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-[58px]'

/* ------------------------------------------------------------------------------------------------
 * Blocks
 * ---------------------------------------------------------------------------------------------- */

async function RenderBlock({ block, meta }: { block: Block; meta: Meta }) {
  const { number, attached, tight, tone } = meta
  const dark = tone === 'dark' || tone === 'raised'

  switch (block.blockType) {
    case 'richText':
      return (
        <section className="py-10 lg:py-[60px]">
          <div className="container-x">
            <div className={cn(block.width === 'narrow' && 'max-w-[840px]')}>
              <RichText data={block.content} />
            </div>
          </div>
        </section>
      )

    case 'trustStrip': {
      const items = block.source === 'custom' ? (block.items ?? []).map((i) => i.text) : ((await getSiteSettings()).certifications ?? []).map((c) => c.text)
      if (!items.length) return null
      return (
        <div className="surface-raised">
          <ul className="container-x grid grid-cols-2 gap-x-3 gap-y-4 py-5 text-[10px] leading-[1.5] text-[#dcebe5] lg:flex lg:min-h-[62px] lg:items-center lg:justify-between lg:gap-6 lg:py-0 lg:text-[12px]" aria-label="Quality statements">
            {items.map((t, i) => (
              <li key={i} className="flex items-center gap-2 lg:gap-3">
                <CheckIcon className="h-[13px] w-[13px] shrink-0 text-teal-lum lg:h-4 lg:w-4" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      )
    }

    case 'stats': {
      const items = block.items ?? []
      const cols = { 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5', 6: 'lg:grid-cols-6' }[Math.min(6, Math.max(2, items.length)) as 2 | 3 | 4 | 5 | 6]
      return (
        <section className={cn(dark ? 'surface-dark' : 'bg-surface')} aria-label={block.heading ?? 'Key figures'}>
          <div className="container-x">
            {block.heading ? <h2 className="heading-3 pt-8">{block.heading}</h2> : null}
            <dl className={cn('grid border-b border-(--rule-current) py-2 lg:pb-9 lg:pt-[35px]', cols)}>
              {items.map((it, i) => (
                <div key={it.id ?? i} className="grid grid-cols-[160px_minmax(0,1fr)] items-center gap-4 border-b border-(--rule-current) py-4 last:border-b-0 lg:flex lg:flex-col lg:items-start lg:justify-start lg:gap-0 lg:border-b-0 lg:border-r lg:px-9 lg:py-0 lg:first:pl-0 lg:last:border-r-0">
                  <dt className="order-2 text-[11px] leading-[1.5] text-secondary lg:mt-1.5 lg:text-[13px]">
                    {it.label}
                    {it.note ? <span className="block text-[11px] opacity-80">{it.note}</span> : null}
                  </dt>
                  <dd className="mono order-1 whitespace-nowrap text-[47px] leading-[1.1] lg:text-[66px]">
                    {it.value}
                    {it.unit ? <small className="ml-1.5 font-sans text-[12px] text-secondary lg:ml-2.5 lg:text-[17px]">{it.unit}</small> : null}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )
    }

    case 'featureGrid': {
      const items = block.items ?? []
      const reasons = block.numbered && block.columns === '2'
      if (reasons) {
        return (
          <Chapter tone={tone} attached={attached} tight={tight} id="why-switch">
            <div className={RAIL}>
              <div>
                {block.eyebrow ? (
                  <ChapterEyebrow number={number} className="mb-5">
                    {block.eyebrow}
                  </ChapterEyebrow>
                ) : null}
                {block.heading ? (
                  <h2 className="heading-2-sm">
                    <Heading text={block.heading} dark={dark} />
                  </h2>
                ) : null}
                {block.intro ? <p className="text-body text-secondary mt-6 max-w-[320px]">{block.intro}</p> : null}
              </div>
              <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2 lg:gap-x-11 lg:gap-y-8">
                {items.map((it, i) => {
                  const link = resolveLink(it.link)
                  return (
                    <article key={it.id ?? i}>
                      <span className="mono mb-3 block text-[12px] text-teal-deep">{nn(i + 1)}</span>
                      <h3 className="heading-4 mb-2">{it.title}</h3>
                      <p className="text-[12px] leading-[1.6] text-secondary lg:text-[14px]">{it.text}</p>
                      {link && link.href !== '#' ? (
                        <Link href={link.href} className="text-link mt-3 text-[13px]">
                          {link.label} <ArrowIcon />
                        </Link>
                      ) : null}
                    </article>
                  )
                })}
              </div>
            </div>
          </Chapter>
        )
      }
      const cols = { '2': 'sm:grid-cols-2', '3': 'sm:grid-cols-2 lg:grid-cols-3', '4': 'sm:grid-cols-2 lg:grid-cols-4' }[block.columns ?? '3']
      return (
        <Chapter tone={tone} number={number} eyebrow={block.eyebrow} heading={<Heading text={block.heading} dark={dark} />} intro={block.intro} attached={attached} tight={tight}>
          <div className={cn('grid gap-4', cols)}>
            {items.map((it, i) => {
              const link = resolveLink(it.link)
              const body = (
                <>
                  {block.numbered ? (
                    <span className="mono block text-[12px] text-teal-deep">{nn(i + 1)}</span>
                  ) : (
                    <span className="flex h-11 w-11 items-center justify-center border border-[#b6cfc4] bg-tint text-teal-deep">
                      <Icon name={it.icon} className="h-5 w-5" />
                    </span>
                  )}
                  <h3 className="heading-4 mt-4 text-ink">{it.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-text-2">{it.text}</p>
                  {link && link.href !== '#' ? (
                    <span className="text-link mt-4 self-start text-[13px]">
                      {link.label} <ArrowIcon />
                    </span>
                  ) : null}
                </>
              )
              return link && link.href !== '#' ? (
                <Link key={it.id ?? i} href={link.href} className="card-hover flex flex-col p-6">
                  {body}
                </Link>
              ) : (
                <div key={it.id ?? i} className="card flex flex-col p-6">
                  {body}
                </div>
              )
            })}
          </div>
        </Chapter>
      )
    }

    case 'twoColumn': {
      const left = block.imagePosition === 'left'
      const { isEnabled: isDraft } = await draftMode()
      const hasImage = block.image && typeof block.image === 'object'
      const hasSecond = block.secondImage && typeof block.secondImage === 'object'
      return (
        <Chapter tone={tone} attached={attached} tight={tight} id={block.eyebrow ? undefined : undefined}>
          <div className={SPREAD}>
            <div className={cn(!left && 'lg:order-2')}>
              {hasImage ? (
                <figure>
                  <div className="relative h-[245px] overflow-hidden lg:h-[338px]">
                    <CmsImage media={block.image} size="large" fill className="object-cover" sizes="(min-width: 1024px) 55vw, 100vw" />
                  </div>
                  {block.imageCaption || block.imageCaptionNote ? (
                    <figcaption className="mt-3 flex justify-between gap-5 text-[9px] leading-[1.5] text-secondary lg:text-[11px]">
                      <span>
                        {number ? <span className="num">{nn(number)} / </span> : null}
                        {block.imageCaption}
                      </span>
                      {block.imageCaptionNote ? <span className="text-right">{block.imageCaptionNote}</span> : null}
                    </figcaption>
                  ) : null}
                </figure>
              ) : null}
              {hasSecond || block.secondImageText ? (
                <div className="mt-5 grid grid-cols-[123px_1fr] items-center gap-4 lg:grid-cols-[180px_1fr] lg:gap-6">
                  {hasSecond ? (
                    <div className="relative h-[98px] overflow-hidden lg:h-[115px]">
                      <CmsImage media={block.secondImage} size="card" fill className="object-cover" sizes="180px" />
                    </div>
                  ) : isDraft ? (
                    <div className="placeholder-slot min-h-[98px] text-[9px] lg:min-h-[115px] lg:text-[11px]">[PHOTO SLOT — upload a second image in this block]</div>
                  ) : null}
                  {block.secondImageText ? <p className={cn('whitespace-pre-line text-[11px] leading-[1.6] text-secondary lg:text-[13px]', !hasSecond && !isDraft && 'col-span-2')}>{block.secondImageText}</p> : null}
                </div>
              ) : null}
            </div>
            <div className={cn(!left && 'lg:order-1')}>
              {block.eyebrow ? (
                <ChapterEyebrow number={number} className="mb-5">
                  {block.eyebrow}
                </ChapterEyebrow>
              ) : null}
              {block.heading ? (
                <h2 className="heading-company max-w-[440px]">
                  <Heading text={block.heading} dark={dark} />
                </h2>
              ) : null}
              <RichText data={block.content} invert={dark} className="mt-5 text-[13px] leading-[1.6] lg:text-[15px]" />
              {block.quote ? <blockquote className="mt-5 text-[13px] leading-[1.6] text-secondary lg:text-[15px]">“{block.quote}”</blockquote> : null}
              {block.facts?.length ? (
                <dl className="mt-6 grid gap-x-6 gap-y-3 border-t border-(--rule-current) pt-5 sm:grid-cols-2">
                  {block.facts.map((f) => (
                    <div key={f.id}>
                      <dt className="text-[10px] uppercase tracking-[0.1em] text-secondary">{f.label}</dt>
                      <dd className="num mt-1 text-[13px] font-medium">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              <CmsLinks links={block.links} onDark={dark} className="mt-7" />
            </div>
          </div>
        </Chapter>
      )
    }

    case 'comparisonTable': {
      // Attached (no eyebrow/intro): the heading becomes the table caption and the table sits under
      // the previous chapter's right-hand column. Standalone: a normal chapter head above the table.
      const table = (
        <div>
          <div className="overflow-x-auto">
            <table className="compare-table home-compare">
              {attached && block.heading ? <caption>{block.heading}</caption> : null}
              <thead>
                <tr>
                  <th scope="col">Parameter</th>
                  <th scope="col">{block.columnA}</th>
                  <th scope="col" className="highlight">
                    {block.columnB}
                  </th>
                </tr>
              </thead>
              <tbody>
                {block.rows?.map((r, i) => (
                  <tr key={r.id ?? i}>
                    <th scope="row">{r.parameter}</th>
                    <td>{r.a}</td>
                    <td className="highlight">{r.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.note ? <p className="table-note">{block.note}</p> : null}
        </div>
      )
      if (attached) {
        return (
          <Chapter tone={tone} attached tight={tight}>
            <div className={RAIL}>
              <div className="hidden lg:block" aria-hidden />
              {table}
            </div>
          </Chapter>
        )
      }
      return (
        <Chapter tone={tone} number={number} eyebrow={block.eyebrow} heading={<Heading text={block.heading} dark={dark} />} intro={block.intro} tight={tight}>
          {table}
        </Chapter>
      )
    }

    case 'gradesPlatform': {
      const link = resolveLink(block.link)
      return (
        <Chapter tone="dark" number={number} eyebrow={block.eyebrow} heading={<Heading text={block.heading} dark />} intro={block.intro} attached={attached} tight={tight} beads id="platform" headingClassName="max-w-[560px]">
          <RangeBars grades={block.grades ?? []} />
          {block.note || (link && link.href !== '#') ? (
            <div className="mt-6 flex flex-col gap-5 text-[11px] leading-[1.6] text-text-2-dark lg:flex-row lg:items-start lg:justify-between lg:gap-8 lg:text-[12px]">
              {block.note ? <p className="max-w-[560px] whitespace-pre-line">{block.note}</p> : <span />}
              {link && link.href !== '#' ? (
                <Link href={link.href} className="text-link shrink-0 text-[11px] text-surface lg:text-[13px]" target={link.newTab ? '_blank' : undefined}>
                  {link.label} <ArrowIcon />
                </Link>
              ) : null}
            </div>
          ) : null}
        </Chapter>
      )
    }

    case 'resinSelector': {
      const [cats, products] = await Promise.all([getCategories(), getProducts()])
      return (
        <Chapter tone={tone} number={number} eyebrow={block.eyebrow} heading={<Heading text={block.heading} dark={dark} />} intro={block.intro} attached={attached} tight={tight} id="selector">
          <div className="border border-[#b6cfc4] bg-tint p-5 lg:p-6">
            <ResinSelector categories={cats.map((c) => ({ slug: c.slug!, name: c.name, mode: c.mode ?? null }))} products={products.map(slimProduct)} />
          </div>
        </Chapter>
      )
    }

    case 'productCategories': {
      const [allCats, products] = await Promise.all([getCategories(), getProducts()])
      const picked = (block.categories ?? []).filter((c): c is ProductCategory => typeof c === 'object')
      const cats = picked.length ? picked : allCats
      const names = new Map<number, string[]>()
      for (const p of products) {
        const id = categoryOf(p)?.id ?? (typeof p.category === 'number' ? p.category : null)
        if (id == null) continue
        names.set(id, [...(names.get(id) ?? []), shortProductName(p.name)])
      }
      const linkLabel = block.linkLabel || `All ${products.length} products`
      return (
        <Chapter tone={tone} number={number} eyebrow={block.eyebrow} heading={<Heading text={block.heading} dark={dark} />} intro={block.intro} attached={attached} tight={tight} id="catalogue">
          <div className={cn('grid border-l border-t border-rule border-t-rule-strong sm:grid-cols-2', cats.length % 3 === 0 || cats.length > 4 ? 'lg:grid-cols-3' : 'lg:grid-cols-2')}>
            {cats.map((c, i) => (
              <CategoryCard key={c.id} category={c} index={i} products={names.get(c.id)} count={names.get(c.id)?.length ?? 0} />
            ))}
          </div>
          <div className="mt-5 flex items-start justify-between gap-5 text-[11px] text-secondary lg:mt-6 lg:items-center lg:text-[13px]">
            <span className="max-w-[170px] sm:max-w-[420px]">{block.footnote}</span>
            <Link href="/products" className="text-link shrink-0 self-start text-[11px] text-ink lg:text-[14px]">
              {linkLabel} <ArrowIcon />
            </Link>
          </div>
        </Chapter>
      )
    }

    case 'featuredProducts': {
      const picked = (block.products ?? []).filter((p): p is Product => typeof p === 'object')
      const products = picked.length ? picked : await getProducts({ featured: true, limit: 8 })
      if (!products.length) return null
      return (
        <Chapter tone={tone} number={number} eyebrow={block.eyebrow} heading={<Heading text={block.heading} dark={dark} />} intro={block.intro} attached={attached} tight={tight}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} compact />
            ))}
          </div>
        </Chapter>
      )
    }

    case 'applicationsGrid': {
      const apps = await getApplications()
      if (block.layout === 'list') {
        return (
          <Chapter tone={tone} attached={attached} tight={tight} id="applications">
            <div className={cn(RAIL, 'gap-5 border-t border-(--rule-current) pt-6 lg:gap-[75px]')}>
              <div>
                {block.eyebrow ? (
                  <ChapterEyebrow number={number} className="mb-3">
                    {block.eyebrow}
                  </ChapterEyebrow>
                ) : null}
                {block.heading ? <h3 className="heading-3">{block.heading}</h3> : null}
                {block.intro ? <p className="text-body text-secondary mt-3">{block.intro}</p> : null}
              </div>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-4 text-[11px] sm:grid-cols-3 lg:gap-x-6 lg:text-[13px]">
                {apps.map((a) => (
                  <li key={a.id}>
                    <Link href={`/applications/${a.slug}`} className="flex min-h-11 items-start justify-between gap-3 border-b border-(--rule-current) pb-2.5 hover:text-teal-deep lg:min-h-8">
                      {a.name}
                      <ArrowIcon className="mt-0.5 h-[15px] w-[15px] shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Chapter>
        )
      }
      return (
        <Chapter tone={tone} number={number} eyebrow={block.eyebrow} heading={<Heading text={block.heading} dark={dark} />} intro={block.intro} attached={attached} tight={tight} id="applications">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((a) => (
              <ApplicationCard key={a.id} application={a} />
            ))}
          </div>
        </Chapter>
      )
    }

    case 'servicesGrid': {
      const services = await getServices()
      if (block.layout === 'row') {
        return (
          <Chapter tone={tone} attached={attached} tight={tight} id="services">
            <div className="border-t border-rule-strong pt-6 lg:flex lg:items-center lg:gap-10">
              <div className="mb-6 lg:mb-0 lg:max-w-[240px] lg:shrink-0">
                {block.eyebrow ? (
                  <ChapterEyebrow number={number} className="mb-3">
                    {block.eyebrow}
                  </ChapterEyebrow>
                ) : null}
                <h3 className="serif-md">
                  <Heading text={block.heading} dark={dark} />
                </h3>
                {block.intro ? <p className="text-body text-secondary mt-3">{block.intro}</p> : null}
              </div>
              <ul className="grid flex-1 grid-cols-2 gap-5 text-[11px] lg:grid-cols-4 lg:gap-6 lg:text-[13px]">
                {services.map((s) => (
                  <li key={s.id}>
                    <Link href={`/services#${s.slug}`} className="flex min-h-11 items-center justify-between gap-3 hover:text-teal-deep lg:min-h-8">
                      {s.name}
                      <ArrowIcon className="h-4 w-4 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Chapter>
        )
      }
      return (
        <Chapter tone={tone} number={number} eyebrow={block.eyebrow} heading={<Heading text={block.heading} dark={dark} />} intro={block.intro} attached={attached} tight={tight} id="services">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>
        </Chapter>
      )
    }

    case 'logoWall': {
      // Logos come from Sales → Customers (only those cleared with "Show logo"); the statement beside
      // them is the block's fallback statement or Site settings → Proof points → Customers statement.
      // Attached under a chapter it reads as a closing line; standalone (about page) it opens one.
      const pickedIds = (block.customers ?? []).map((c) => (typeof c === 'object' ? c.id : c))
      const [customers, settings, { isEnabled: isDraft }] = await Promise.all([
        block.source === 'picked' ? (pickedIds.length ? getCustomers({ ids: pickedIds }) : Promise.resolve([] as Customer[])) : getCustomers({ showLogo: true }),
        getSiteSettings(),
        draftMode(),
      ])
      const logos = displayableCustomers(customers)
      const statement = block.fallbackStatement || settings.proof?.customersStatement || null
      if (!logos.length && !statement && !isDraft) return null
      const wall = (
        <div className={cn('grid items-center gap-5 lg:grid-cols-[310px_1fr] lg:gap-11', attached && 'border-t border-rule-strong pt-6')}>
          {statement ? <p className="whitespace-pre-line text-[12px] leading-[1.6] text-secondary lg:text-[13px]">{statement}</p> : <span />}
          {logos.length ? (
            <ul className="flex flex-wrap items-center gap-x-10 gap-y-6" aria-label="Customers">
              {logos.map((c) => {
                const label = [c.name, c.country].filter(Boolean).join(', ')
                const img = c.logo && typeof c.logo === 'object' ? <CmsImage media={c.logo} size="thumbnail" className="h-8 w-auto max-w-[140px] object-contain lg:h-10" fallbackAlt={c.name} /> : null
                return (
                  <li key={c.id} title={label}>
                    {c.website ? (
                      <a href={c.website} target="_blank" rel="noopener noreferrer" aria-label={c.name} className="opacity-80 transition-opacity hover:opacity-100">
                        {img}
                      </a>
                    ) : (
                      img
                    )}
                  </li>
                )
              })}
            </ul>
          ) : isDraft ? (
            <div className="placeholder-slot min-h-[75px]">[CUSTOMER LOGOS — add customers with a logo under Sales → Customers and tick “Show logo”. Visitors do not see this slot.]</div>
          ) : null}
        </div>
      )
      if (attached || (!block.eyebrow && !block.heading)) {
        return (
          <Chapter tone={tone} attached={attached} tight={tight}>
            {wall}
          </Chapter>
        )
      }
      return (
        <Chapter tone={tone} number={number} eyebrow={block.eyebrow} heading={<Heading text={block.heading} dark={dark} />} tight={tight}>
          {wall}
        </Chapter>
      )
    }

    case 'documentList': {
      const docs = await getDocuments({ types: block.types ?? undefined, limit: block.limit ?? 12 })
      return (
        <Chapter tone={tone} number={number} eyebrow={block.eyebrow} heading={<Heading text={block.heading} dark={dark} />} intro={block.intro} attached={attached} tight={tight} id="documents">
          <div className="grid gap-x-8 md:grid-cols-2">
            {docs.map((d) => (
              <DocumentRow key={d.id} doc={d} />
            ))}
          </div>
          <Link href="/resources" className="text-link mt-6 text-[13px]">
            All resources <ArrowIcon />
          </Link>
        </Chapter>
      )
    }

    case 'latestPosts': {
      const posts = await getPosts({ limit: block.limit ?? 3 })
      if (!posts.docs.length) return null
      return (
        <Chapter
          tone={tone}
          number={number}
          eyebrow={block.eyebrow}
          heading={<Heading text={block.heading} dark={dark} />}
          attached={attached}
          tight={tight}
          aside={
            <ButtonLink href="/blog" appearance="link">
              All articles <ArrowIcon />
            </ButtonLink>
          }
        >
          <div className="grid gap-4 md:grid-cols-3">
            {posts.docs.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </Chapter>
      )
    }

    case 'linkedInFeed': {
      const updates = await getUpdates(block.limit ?? 3, { kind: block.kind })
      const settings = await getSiteSettings()
      if (!updates.length) return null
      return (
        <Chapter
          tone={tone}
          number={number}
          eyebrow={block.eyebrow}
          heading={<Heading text={block.heading} dark={dark} />}
          intro={block.intro}
          attached={attached}
          tight={tight}
          aside={
            <div className="flex flex-wrap gap-5">
              <ButtonLink href="/updates" appearance="link">
                All updates <ArrowIcon />
              </ButtonLink>
              {settings.social?.linkedin ? (
                <ButtonLink href={settings.social.linkedin} appearance="link" newTab>
                  Follow on LinkedIn <ArrowIcon />
                </ButtonLink>
              ) : null}
            </div>
          }
        >
          <div className="grid gap-4 md:grid-cols-3">
            {updates.map((u) => (
              <UpdateCard key={u.id} update={u} />
            ))}
          </div>
        </Chapter>
      )
    }

    case 'testimonials': {
      const picked = (block.items ?? []).filter((t): t is Testimonial => typeof t === 'object')
      const items = picked.length ? picked : await getTestimonials()
      if (!items.length) return null
      return (
        <Chapter tone={tone} number={number} eyebrow={block.eyebrow} heading={<Heading text={block.heading} dark={dark} />} attached={attached} tight={tight}>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {items.map((t) => (
              <figure key={t.id} className="flex h-full flex-col border-t border-rule-strong pt-5">
                <blockquote className="flex-1 font-display text-[24px] leading-[1.25] tracking-[-0.02em] text-ink">“{t.quote}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 text-[13px]">
                  {t.logo && typeof t.logo === 'object' ? <CmsImage media={t.logo} size="thumbnail" className="h-8 w-auto" /> : null}
                  <div>
                    <p className="font-medium text-ink">{t.person || t.organization}</p>
                    <p className="text-text-2">{[t.role, t.person ? t.organization : null, t.country].filter(Boolean).join(' · ')}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </Chapter>
      )
    }

    case 'teamGrid': {
      const picked = (block.members ?? []).filter((t): t is Team => typeof t === 'object')
      const members = picked.length ? picked : await getTeam()
      if (!members.length) return null
      const initials = (name: string) =>
        name
          .replace(/^(Dr|Mr|Mrs|Ms|Prof)\.?\s+/i, '')
          .split(/\s+/)
          .filter((w) => /^[A-Z]/.test(w) && !/\.$/.test(w))
          .slice(0, 2)
          .map((w) => w[0])
          .join('')
      if (block.layout === 'spread') {
        return (
          <Chapter tone={tone} attached={attached} tight={tight}>
            <div className={SPREAD}>
              <div className="hidden lg:block" aria-hidden />
              <ul className="grid gap-5">
                {members.map((m) => (
                  <li key={m.id} className="grid grid-cols-[77px_1fr] items-center gap-4 border-t border-rule-strong pt-5 lg:grid-cols-[90px_1fr] lg:gap-5">
                    {m.photo && typeof m.photo === 'object' ? (
                      <div className="relative h-[91px] overflow-hidden lg:h-[100px]">
                        <CmsImage media={m.photo} size="thumbnail" fill className="object-cover" sizes="90px" fallbackAlt={m.name} />
                      </div>
                    ) : (
                      <div className="flex h-[91px] items-center justify-center bg-[#dce5df] font-display text-[28px] text-ink lg:h-[100px] lg:text-[32px]" aria-hidden>
                        {initials(m.name)}
                      </div>
                    )}
                    <div>
                      <h3 className="heading-4 mb-1">{m.name}</h3>
                      <p className="text-[11px] leading-[1.55] text-secondary lg:text-[13px]">
                        {m.role}
                        {m.tagline ? (
                          <>
                            <br />
                            {m.tagline}
                          </>
                        ) : null}
                      </p>
                      {m.linkedinUrl ? (
                        <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-block text-[11px] font-medium text-teal-deep hover:underline lg:text-[12px]">
                          LinkedIn ↗
                        </a>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Chapter>
        )
      }
      return (
        <Chapter tone={tone} number={number} eyebrow={block.eyebrow} heading={<Heading text={block.heading} dark={dark} />} intro={block.intro} attached={attached} tight={tight}>
          <div className="grid gap-6 md:grid-cols-2">
            {members.map((m) => (
              <div key={m.id} className="card flex gap-5 p-6">
                {m.photo && typeof m.photo === 'object' ? (
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden">
                    <CmsImage media={m.photo} size="thumbnail" fill className="object-cover" sizes="96px" fallbackAlt={m.name} />
                  </div>
                ) : (
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center bg-[#dce5df] font-display text-[32px] text-ink" aria-hidden>
                    {initials(m.name)}
                  </div>
                )}
                <div>
                  <h3 className="heading-4 text-ink">{m.name}</h3>
                  <p className="mt-0.5 text-[13px] font-medium text-teal-deep">{m.role}</p>
                  <RichText data={m.bio} className="mt-3 text-[14px]" />
                  {m.linkedinUrl ? (
                    <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-link mt-3 text-[13px]">
                      LinkedIn <ArrowIcon />
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </Chapter>
      )
    }

    case 'timeline':
      return (
        <Chapter tone={tone} number={number} eyebrow={block.eyebrow} heading={<Heading text={block.heading} dark={dark} />} attached={attached} tight={tight}>
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {block.items?.map((it, i) => (
              <li key={it.id ?? i} className="border-t border-rule-strong pt-5">
                <p className="mono text-[12px] text-teal-deep">{it.date}</p>
                <h3 className="heading-4 mt-2 text-ink">{it.title}</h3>
                {it.text ? <p className="mt-1.5 text-[13px] leading-relaxed text-text-2">{it.text}</p> : null}
              </li>
            ))}
          </ol>
        </Chapter>
      )

    case 'faqBlock':
      return (
        <Chapter tone={tone} attached={attached} tight={tight} id="faq">
          <FaqColumn block={block} number={number} dark={dark} />
        </Chapter>
      )

    case 'mediaBlock':
      return (
        <section className={cn(block.size === 'full' ? '' : 'py-10 lg:py-[60px]')}>
          <figure className={cn(block.size === 'full' ? '' : 'container-x')}>
            <div className={cn(block.size === 'narrow' && 'mx-auto max-w-[840px]')}>
              <CmsImage media={block.image} size="large" className="w-full object-cover" sizes="100vw" />
              {block.caption ? <figcaption className={cn('mt-3 text-[11px] leading-[1.5] text-text-2', block.size === 'full' && 'container-x')}>{block.caption}</figcaption> : null}
            </div>
          </figure>
        </section>
      )

    case 'formBlock': {
      const settings = await getSiteSettings()
      const products = block.form === 'newsletter' ? [] : await getProducts()
      return (
        <Chapter tone={tone} attached={attached} tight={tight} id={block.form === 'newsletter' ? 'newsletter' : 'form'}>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              {block.heading ? (
                <h2 className="heading-2-xs">
                  <Heading text={block.heading} dark={dark} />
                </h2>
              ) : null}
              {block.intro ? <p className="text-body text-secondary mt-5">{block.intro}</p> : null}
              {block.sidebar ? <RichText data={block.sidebar} className="mt-6 text-[14px]" /> : null}
            </div>
            <div className="lg:col-span-8">
              {block.form === 'newsletter' ? (
                <div className="border border-rule bg-white p-6">
                  <NewsletterForm />
                </div>
              ) : (
                <div className="border border-rule bg-white p-6 sm:p-8">
                  <React.Suspense>
                    <InquiryForm type={block.form} products={products.map(toBasketProduct)} responseTime={settings.responseTime} allowTypeChange={block.form === 'contact'} />
                  </React.Suspense>
                </div>
              )}
            </div>
          </div>
        </Chapter>
      )
    }

    case 'cta': {
      const style = block.style ?? 'dark'
      if (style === 'evaluation') {
        return (
          <section className={cn('bg-surface', attached ? 'pb-12 lg:pb-20' : 'py-12 lg:py-20')} id="evaluation">
            <Reveal className="container-x">
              <EvaluationPanel block={block} number={number} />
            </Reveal>
          </section>
        )
      }
      if (style === 'accent') {
        return (
          <section className="surface-accent">
            <div className="container-x flex flex-col items-start gap-6 py-9 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:py-[45px]">
              <div className="max-w-[740px]">
                {block.eyebrow ? <ChapterEyebrow className="mb-4">{block.eyebrow}</ChapterEyebrow> : null}
                <h2 className="heading-closing">
                  <Heading text={block.heading} />
                </h2>
                <Paragraphs text={block.text} className="mt-3 text-[12px] leading-[1.6] text-[#24534e] lg:text-[14px]" />
                {block.note ? <p className="mt-3 text-[13px] font-semibold">{block.note}</p> : null}
              </div>
              <CmsLinks links={block.links} className="shrink-0" />
            </div>
          </section>
        )
      }
      const isDark = style === 'dark'
      return (
        <Chapter tone={isDark ? 'dark' : 'recessed'} beads={isDark ? { density: 'sparse', opacity: 0.14, className: 'right-[-60px] bottom-[-120px] w-[480px]', seed: 5 } : undefined} attached={attached} tight={tight}>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center lg:gap-16">
            <div className="max-w-[740px]">
              {block.eyebrow ? <ChapterEyebrow number={number} className="mb-5">{block.eyebrow}</ChapterEyebrow> : null}
              <h2 className="heading-2-sm">
                <Heading text={block.heading} dark={isDark} />
              </h2>
              <Paragraphs text={block.text} className="text-body text-secondary mt-4 max-w-[560px]" />
              {block.note ? <p className="mt-3 text-[14px] font-semibold">{block.note}</p> : null}
            </div>
            <CmsLinks links={block.links} onDark={isDark} className="shrink-0" />
          </div>
        </Chapter>
      )
    }

    // ---------- Trust & proof (src/components/blocks/trust/*) ----------
    case 'certificationsStrip':
      return <CertificationsStrip block={block} />

    case 'gallery':
      return <Gallery block={block} />

    case 'publications':
      return <Publications block={block} />

    case 'proofBar':
      return <ProofBar block={block} />

    default:
      return null
  }
}

/** The dark "start with an evaluation" panel (bead field, chapter number, note, one CTA). */
function EvaluationPanel({ block, number }: { block: Extract<Block, { blockType: 'cta' }>; number: number | null }) {
  return (
    <div className="surface-raised relative overflow-hidden px-6 py-7 lg:p-[42px]">
      <BeadField density="sparse" opacity={0.17} className="bottom-[-130px] left-[140px] w-[370px] lg:bottom-[-150px] lg:left-[250px]" seed={3} />
      <div className="relative max-w-[560px]">
        {block.eyebrow ? (
          <ChapterEyebrow number={number} className="mb-5">
            {block.eyebrow}
          </ChapterEyebrow>
        ) : null}
        <h2 className="heading-evaluation max-w-[390px]">
          <Heading text={block.heading} dark />
        </h2>
        <Paragraphs text={block.text} className="mt-5 max-w-[375px] text-[13px] leading-[1.6] text-text-2-dark lg:text-[15px]" />
        {block.note ? (
          <p className="mt-4 max-w-[375px] text-[13px] leading-[1.6] lg:text-[15px]">
            <strong className="font-semibold text-surface">{block.note}</strong>
          </p>
        ) : null}
        <CmsLinks links={block.links} onDark className="mt-6" />
      </div>
    </div>
  )
}

/** FAQ eyebrow + heading + accordion. `stacked` keeps everything in one column (paired layout). */
async function FaqColumn({ block, number, dark, stacked }: { block: Extract<Block, { blockType: 'faqBlock' }>; number: number | null; dark: boolean; stacked?: boolean }) {
  const ids = (block.faqs ?? []).map((f) => (typeof f === 'object' ? f.id : f))
  const faqs = await getFaqs(ids.length ? { ids } : { category: block.category ?? 'all' })
  if (!faqs.length) return null
  const head = (
    <>
      {block.eyebrow ? (
        <ChapterEyebrow number={number} className="mb-5">
          {block.eyebrow}
        </ChapterEyebrow>
      ) : null}
      <h2 className="heading-2-xs">
        <Heading text={block.heading ?? 'Frequently asked questions'} dark={dark} />
      </h2>
      {block.intro ? <p className="text-body text-secondary mt-5 max-w-[360px]">{block.intro}</p> : null}
    </>
  )
  if (stacked) {
    return (
      <div>
        {head}
        <div className="mt-[25px]">
          <FaqList faqs={faqs} invert={dark} />
        </div>
      </div>
    )
  }
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-4">{head}</div>
      <div className="lg:col-span-8">
        <FaqList faqs={faqs} invert={dark} />
      </div>
    </div>
  )
}

