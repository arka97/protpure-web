import Image from 'next/image'
import * as React from 'react'
import { Badge, Breadcrumbs, CmsLinks } from '@/components/ui'
import { BeadField } from '@/components/visual/BeadField'
import { cn, mediaAlt, mediaUrl } from '@/lib/utils'
import type { Media, Page } from '@/payload-types'

type Hero = NonNullable<Page['hero']>

/** CMS text with `\n` rendered as deliberate line breaks (segments still wrap naturally when narrow). */
export function Lines({ text }: { text: string }) {
  const parts = text.split('\n')
  return (
    <>
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <br /> : null}
          {p}
        </React.Fragment>
      ))}
    </>
  )
}

/**
 * Serif headline with the `highlight` words set in italic luminous teal. When the highlight closes
 * the heading it takes its own line — the short scientific proposition ("From the bead up.").
 * Line breaks typed into the CMS heading are kept, inside or outside the highlight.
 */
export function Highlighted({ text, highlight, className }: { text: string; highlight?: string | null; className?: string }) {
  const src = text.trim()
  const hl = highlight?.trim()
  // The highlight may span a typed line break: match its words across any whitespace.
  const re = hl ? new RegExp(hl.split(/\s+/).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s+')) : null
  const m = re ? src.match(re) : null
  if (!m || m.index === undefined) return <Lines text={src} />
  const before = src.slice(0, m.index).replace(/[ \t]+$/, '')
  const inner = m[0]
  const after = src.slice(m.index + inner.length)
  const ownLine = after.trim() === '' && before.trim() !== '' && !before.endsWith('\n')
  return (
    <>
      {before ? <Lines text={before.replace(/\n$/, '')} /> : null}
      {before ? (before.endsWith('\n') || ownLine ? <br /> : ' ') : null}
      <em className={cn('italic text-teal-lum', className)}>
        <Lines text={inner} />
      </em>
      {after ? <Lines text={after} /> : null}
    </>
  )
}

export function PageHero({
  hero,
  title,
  breadcrumbs,
  children,
  tone = 'light',
  aside,
}: {
  hero?: Hero | null
  title: string
  breadcrumbs?: { label: string; href?: string }[]
  children?: React.ReactNode
  /** Compact heroes are light by default; the catalogue and category pages use the dark field with a bead field at the edge. */
  tone?: 'light' | 'dark'
  /** Right-hand column of a compact hero (e.g. the category emblem). */
  aside?: React.ReactNode
}) {
  const style = hero?.style ?? 'compact'
  if (style === 'none') return null
  const heading = hero?.heading || title

  if (style === 'standard') {
    const image = hero?.image && typeof hero.image === 'object' ? (hero.image as Media) : null
    const imageUrl = image ? mediaUrl(image, 'large') ?? mediaUrl(image) : null
    const hasImage = Boolean(imageUrl)
    return (
      <section className="surface-dark relative overflow-hidden">
        <BeadField density="normal" opacity={0.16} className="bottom-[250px] left-[145px] w-[350px] lg:bottom-[-45px] lg:left-[235px] lg:w-[650px]" />
        <div className={cn('container-x relative grid gap-7 pb-8 pt-8 lg:gap-6 lg:pb-12 lg:pt-[58px]', hasImage ? 'lg:min-h-[725px] lg:grid-cols-[1.08fr_1fr]' : 'lg:min-h-[420px]')}>
          <div className={cn('relative z-[2] lg:pt-[18px]', !hasImage && 'max-w-[820px]')}>
            {breadcrumbs ? (
              <div className="mb-8">
                <Breadcrumbs items={breadcrumbs} onDark />
              </div>
            ) : null}
            {hero?.eyebrow ? (
              <p className="eyebrow mb-5 flex items-center gap-3">
                <span className="dot" aria-hidden />
                {hero.eyebrow}
              </p>
            ) : null}
            <h1 className="heading-display text-wrap-initial">
              <Highlighted text={heading} highlight={hero?.highlight} />
            </h1>
            {hero?.text ? <p className="lede mt-6 max-w-[470px] lg:mt-[30px]">{hero.text}</p> : null}
            <CmsLinks links={hero?.links} onDark className="mt-6 lg:mt-[30px]" />
            {hero?.badges?.length ? (
              <ul className="mt-8 flex flex-wrap gap-2">
                {hero.badges.map((b) => (
                  <li key={b.id}>
                    <Badge tone="onDark">{b.text}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
            {children}
          </div>

          {hasImage && image ? (
            <figure className="relative self-start lg:ml-2.5">
              <div className="arch relative h-[338px] bg-field-raised lg:h-[550px]">
                <Image
                  src={imageUrl!}
                  alt={mediaAlt(image, heading)}
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="home-hero-photo"
                />
              </div>
              {hero?.imageMarker ? (
                <div className="absolute bottom-[49px] left-[-8px] flex h-[97px] w-[97px] flex-col items-center justify-center rounded-full bg-teal-lum text-center text-field shadow-[0_0_0_6px_var(--color-field)] lg:bottom-[68px] lg:left-[-45px] lg:h-[134px] lg:w-[134px] lg:shadow-[0_0_0_9px_var(--color-field)]" aria-label={[hero.imageMarker, hero.imageMarkerNote].filter(Boolean).join(', ')}>
                  <strong className="serif-lg num">{hero.imageMarker}</strong>
                  {hero.imageMarkerNote ? <span className="mt-1.5 px-2 text-[8px] uppercase tracking-[0.08em] lg:mt-2 lg:text-[10px]">{hero.imageMarkerNote}</span> : null}
                </div>
              ) : null}
              {hero?.imageCaption || hero?.imageCaptionNote ? (
                <figcaption className="mt-3.5 flex justify-between gap-4 text-[9px] leading-[1.5] text-text-2-dark lg:text-[11px]">
                  <span>{hero.imageCaption}</span>
                  {hero.imageCaptionNote ? <span className="text-right">{hero.imageCaptionNote}</span> : null}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>
      </section>
    )
  }

  const dark = tone === 'dark'
  return (
    <section className={cn('relative overflow-hidden', dark ? 'surface-dark' : 'border-b border-rule bg-surface')}>
      {dark ? <BeadField density="normal" opacity={0.14} className="bottom-[-190px] right-[-60px] w-[420px] lg:bottom-[-155px] lg:right-[35px] lg:w-[630px]" /> : null}
      <div className={cn('container-x relative py-10 lg:py-11', aside && 'grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end')}>
        <div className="min-w-0">
          {breadcrumbs ? (
            <div className="mb-6">
              <Breadcrumbs items={breadcrumbs} onDark={dark} />
            </div>
          ) : null}
          {hero?.eyebrow ? <p className="eyebrow mb-4">{hero.eyebrow}</p> : null}
          <h1 className="heading-1 max-w-[900px]">
            <Lines text={heading} />
          </h1>
          {hero?.text ? (
            <p className={cn('lede mt-4 max-w-[650px]', dark && 'lg:mt-[18px]')}>
              <Lines text={hero.text} />
            </p>
          ) : null}
          <CmsLinks links={hero?.links} onDark={dark} className="mt-6" />
          {children}
        </div>
        {aside}
      </div>
    </section>
  )
}

/** Hero for listing routes that may or may not have a CMS page behind them. */
export function ListingHero({ page, fallback, breadcrumbs, children, tone, aside }: { page: Page | null; fallback: { title: string; text?: string; eyebrow?: string }; breadcrumbs?: { label: string; href?: string }[]; children?: React.ReactNode; tone?: 'light' | 'dark'; aside?: React.ReactNode }) {
  const hero = page?.hero?.style && page.hero.style !== 'none' ? page.hero : { style: 'compact' as const, eyebrow: fallback.eyebrow, heading: fallback.title, text: fallback.text }
  return (
    <PageHero hero={hero as Hero} title={page?.title ?? fallback.title} breadcrumbs={breadcrumbs} tone={tone} aside={aside}>
      {children}
    </PageHero>
  )
}
