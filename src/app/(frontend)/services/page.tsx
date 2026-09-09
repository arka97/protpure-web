import type { Metadata } from 'next'
import { ListingHero } from '@/components/PageHero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { RichText } from '@/components/RichText'
import { ButtonLink, CmsImage } from '@/components/ui'
import { getPage, getServices } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { cn } from '@/lib/utils'


export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('services')
  return buildMetadata({ meta: page?.meta, title: 'Downstream bioprocessing services', description: page?.hero?.text || 'Column packing, resin screening, method development and purification services from resin scientists.', path: '/services' })
}

export default async function ServicesPage() {
  const [page, services] = await Promise.all([getPage('services'), getServices()])
  return (
    <>
      <ListingHero page={page} fallback={{ eyebrow: 'Services', title: 'Downstream bioprocessing services', text: 'We don’t just supply resin. Our scientists pack columns, screen resins against your feedstock, develop methods and purify proteins for you — from 5 mL to 1 L columns.' }} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Services' }]} />
      <section className="section">
        <div className="container-x space-y-16">
          {services.map((s, i) => (
            <article key={s.id} id={s.slug!} className={cn('grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 lg:gap-16')}>
              <div className={cn(i % 2 === 1 && 'lg:order-2')}>
                <p className="eyebrow">Service {String(i + 1).padStart(2, '0')}</p>
                <h2 className="heading-2 mt-3">{s.name}</h2>
                {s.tagline ? <p className="mt-2 text-lg text-teal-600">{s.tagline}</p> : null}
                <RichText data={s.description} className="mt-5" />
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {s.deliverables?.length ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">What you receive</p>
                      <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
                        {s.deliverables.map((d) => (
                          <li key={d.id} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                            {d.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {s.idealFor?.length ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">Ideal for</p>
                      <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
                        {s.idealFor.map((d) => (
                          <li key={d.id} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-navy-600" />
                            {d.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
                <ButtonLink href={`/request-quote?type=technical`} className="mt-8">
                  Discuss this service
                </ButtonLink>
              </div>
              <div className={cn(i % 2 === 1 && 'lg:order-1')}>
                {s.image && typeof s.image === 'object' ? (
                  <div className="overflow-hidden rounded-2xl shadow-card">
                    <CmsImage media={s.image} size="large" className="h-auto w-full object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
                  </div>
                ) : (
                  <div className="hex-bg aspect-[4/3] rounded-2xl" />
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
      <RenderBlocks blocks={page?.layout} />
    </>
  )
}
