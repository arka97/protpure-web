import * as React from 'react'
import { Badge, Breadcrumbs, CmsImage, CmsLinks } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Page } from '@/payload-types'

type Hero = NonNullable<Page['hero']>

/** Highlights `highlight` words in the heading in the accent colour. */
function Highlighted({ text, highlight }: { text: string; highlight?: string | null }) {
  if (!highlight || !text.includes(highlight)) return <>{text}</>
  const [before, after] = text.split(highlight)
  return (
    <>
      {before}
      <span className="text-teal-300">{highlight}</span>
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
    const hasImage = hero?.image && typeof hero.image === 'object'
    return (
      <section className="hex-bg relative overflow-hidden text-white">
        <div className={cn('container-x relative grid items-center gap-12 py-20 lg:py-28', hasImage && 'lg:grid-cols-12')}>
          <div className={cn(hasImage ? 'lg:col-span-7' : 'max-w-3xl')}>
            {breadcrumbs ? <div className="mb-6"><Breadcrumbs items={breadcrumbs} onDark /></div> : null}
            {hero?.eyebrow ? (
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-300">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                {hero.eyebrow}
              </p>
            ) : null}
            <h1 className="heading-1 text-white">
              <Highlighted text={heading} highlight={hero?.highlight} />
            </h1>
            {hero?.text ? <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">{hero.text}</p> : null}
            <CmsLinks links={hero?.links} onDark className="mt-8" />
            {hero?.badges?.length ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {hero.badges.map((b) => (
                  <Badge key={b.id} tone="onDark">
                    {b.text}
                  </Badge>
                ))}
              </div>
            ) : null}
            {children}
          </div>
          {hasImage ? (
            <div className="relative lg:col-span-5">
              <div className="absolute -inset-6 rounded-[2rem] bg-teal-400/10 blur-2xl" aria-hidden />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                <CmsImage media={hero!.image} size="large" className="h-auto w-full object-cover" sizes="(min-width: 1024px) 40vw, 100vw" priority />
              </div>
            </div>
          ) : null}
        </div>
      </section>
    )
  }

  return (
    <section className="border-b border-line bg-surface-2">
      <div className="container-x py-12 sm:py-16">
        {breadcrumbs ? <div className="mb-5"><Breadcrumbs items={breadcrumbs} /></div> : null}
        {hero?.eyebrow ? <p className="eyebrow mb-3">{hero.eyebrow}</p> : null}
        <h1 className="heading-1 max-w-4xl text-4xl sm:text-5xl">{heading}</h1>
        {hero?.text ? <p className="lede mt-4 max-w-3xl">{hero.text}</p> : null}
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
