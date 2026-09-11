import Image from 'next/image'
import * as React from 'react'
import { Badge, Breadcrumbs, CmsLinks } from '@/components/ui'
import { BeadField } from '@/components/visual/BeadField'
import { BeadSchematic } from '@/components/visual/BeadSchematic'
import { cn, mediaAlt, mediaUrl } from '@/lib/utils'
import type { Media, Page } from '@/payload-types'

type Hero = NonNullable<Page['hero']>

/**
 * Serif headline with the `highlight` words set in italic luminous teal. When the highlight closes
 * the heading it takes its own line — the short scientific proposition ("From the bead up.").
 */
export function Highlighted({ text, highlight, className }: { text: string; highlight?: string | null; className?: string }) {
  if (!highlight || !text.includes(highlight)) return <>{text}</>
  const idx = text.indexOf(highlight)
  const before = text.slice(0, idx).trimEnd()
  const after = text.slice(idx + highlight.length)
  const ownLine = after.trim() === '' && before !== ''
  return (
    <>
      {before}
      {ownLine ? <br /> : before ? ' ' : null}
      <em className={cn('italic text-teal-lum', className)}>{highlight}</em>
      {after}
    </>
  )
}

export function PageHero({
  hero,
  title,
  breadcrumbs,
  children,
}: {
  hero?: Hero | null
  title: string
  breadcrumbs?: { label: string; href?: string }[]
  children?: React.ReactNode
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
            <h1 className="heading-display">
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
                  className="object-cover object-top"
                  style={{ objectPosition: 'center 20%' }}
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

  if (style === 'schematic') {
    // Light hero with the annotated bead cross-section (BUILD-BRIEF item 1). The label row above the
    // drawing and the caption under it come from the hero's marker / caption fields.
    return (
      <section className="relative overflow-hidden border-b border-rule bg-surface">
        <div className="container-x grid gap-8 pb-10 pt-8 lg:min-h-[600px] lg:grid-cols-[1.08fr_1fr] lg:gap-[70px] lg:pb-[64px] lg:pt-[58px]">
          <div className="relative z-[2] lg:pt-[18px]">
            {breadcrumbs ? (
              <div className="mb-8">
                <Breadcrumbs items={breadcrumbs} />
              </div>
            ) : null}
            {hero?.eyebrow ? (
              <p className="eyebrow mb-5 flex items-center gap-3">
                <span className="dot" aria-hidden />
                {hero.eyebrow}
              </p>
            ) : null}
            <h1 className="heading-display">
              <Highlighted text={heading} highlight={hero?.highlight} className="text-teal-deep" />
            </h1>
            {hero?.text ? <p className="lede mt-6 max-w-[470px] lg:mt-[30px]">{hero.text}</p> : null}
            <CmsLinks links={hero?.links} className="mt-6 lg:mt-[30px]" />
            {children}
          </div>
          <figure className="self-center lg:pl-2">
            {hero?.imageMarker || hero?.imageMarkerNote ? (
              <div className="mb-4 flex items-center justify-between gap-4 border-b border-rule pb-3 text-[10px] uppercase tracking-[0.14em] text-text-2 lg:text-[11px]">
                <span>{hero.imageMarker}</span>
                {hero.imageMarkerNote ? <span className="num text-right">{hero.imageMarkerNote}</span> : null}
              </div>
            ) : null}
            <BeadSchematic tone="light" className="mx-auto max-w-[560px]" />
            {hero?.imageCaption || hero?.imageCaptionNote ? (
              <figcaption className="mt-4 flex justify-between gap-4 border-t border-rule pt-3 text-[10px] uppercase tracking-[0.14em] text-text-2 lg:text-[11px]">
                <span>{hero.imageCaption}</span>
                {hero.imageCaptionNote ? <span className="text-right">{hero.imageCaptionNote}</span> : null}
              </figcaption>
            ) : null}
          </figure>
        </div>
      </section>
    )
  }

  return (
    <section className="border-b border-rule bg-surface">
      <div className="container-x py-10 lg:py-11">
        {breadcrumbs ? (
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        ) : null}
        {hero?.eyebrow ? <p className="eyebrow mb-4">{hero.eyebrow}</p> : null}
        <h1 className="heading-1 max-w-[900px]">{heading}</h1>
        {hero?.text ? <p className="lede mt-4 max-w-[650px]">{hero.text}</p> : null}
        <CmsLinks links={hero?.links} className="mt-6" />
        {children}
      </div>
    </section>
  )
}

/** Hero for listing routes that may or may not have a CMS page behind them. */
export function ListingHero({ page, fallback, breadcrumbs, children }: { page: Page | null; fallback: { title: string; text?: string; eyebrow?: string }; breadcrumbs?: { label: string; href?: string }[]; children?: React.ReactNode }) {
  const hero = page?.hero?.style && page.hero.style !== 'none' ? page.hero : { style: 'compact' as const, eyebrow: fallback.eyebrow, heading: fallback.title, text: fallback.text }
  return (
    <PageHero hero={hero as Hero} title={page?.title ?? fallback.title} breadcrumbs={breadcrumbs}>
      {children}
    </PageHero>
  )
}
