import type { Metadata } from 'next'
import { ListingHero } from '@/components/PageHero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { RichText } from '@/components/RichText'
import { ButtonLink, CmsImage } from '@/components/ui'
import { Chapter, ChapterEyebrow } from '@/components/visual/Chapter'
import { ArrowIcon, CheckIcon } from '@/components/visual/icons'
import { getPage, getServices } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbJsonLd, JsonLd } from '@/lib/jsonld'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('services')
  return buildMetadata({ meta: page?.meta, title: 'Downstream bioprocessing services', description: page?.hero?.text || 'Column packing, resin screening, method development and purification services from resin scientists.', path: '/services' })
}

const nn = (n: number) => String(n).padStart(2, '0')

export default async function ServicesPage() {
  const [page, services] = await Promise.all([getPage('services'), getServices()])
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Services' }]
  return (
    <>
      <ListingHero page={page} fallback={{ eyebrow: 'Services', title: 'We don’t just supply resin.', highlight: 'supply resin.', text: 'Our scientists pack columns, screen resins against your feedstock, develop methods and purify proteins for you — from 5 mL to 1 L columns.' }} breadcrumbs={crumbs}>
        {/* In-page index: one row per service, mono numbers, 44 px targets on phones. */}
        <nav className="mt-8 lg:mt-10" aria-label="Services on this page">
          <ol className="grid gap-x-8 border-t border-rule-dark sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6">
            {services.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.slug}`} className="flex h-full min-h-11 items-start gap-3 border-b border-rule-dark py-3 text-[12px] leading-[1.45] text-surface hover:text-teal-lum lg:text-[13px]">
                  <span className="mono pt-px text-[11px] text-teal-lum">{nn(i + 1)}</span>
                  {s.name}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </ListingHero>

      {services.map((s, i) => {
        const tone = i % 2 === 1 ? 'recessed' : 'light'
        return (
          <Chapter key={s.id} id={s.slug!} tone={tone} className="scroll-mt-24" data-block="service">
            <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-[75px]">
              <div>
                <ChapterEyebrow number={i + 1} className="mb-5" as="p">
                  Service
                </ChapterEyebrow>
                <h2 className="heading-2-sm max-w-[320px]">{s.name}</h2>
                {s.tagline ? <p className="mt-5 font-display text-[24px] leading-[1.2] tracking-[-0.02em] text-teal-deep lg:text-[27px]">{s.tagline}</p> : null}
                <ButtonLink href="/request-quote?type=technical" appearance={i % 2 === 1 ? 'ink' : 'primary'} className="mt-7">
                  Discuss this service <ArrowIcon />
                </ButtonLink>
              </div>
              <div className="min-w-0">
                {s.image && typeof s.image === 'object' ? (
                  <figure className="mb-8">
                    <div className="relative h-[245px] overflow-hidden lg:h-[338px]">
                      <CmsImage media={s.image} size="large" fill className="object-cover" sizes="(min-width: 1024px) 60vw, 100vw" fallbackAlt={s.name} />
                    </div>
                  </figure>
                ) : null}
                <RichText data={s.description} className="max-w-[680px]" />
                {s.deliverables?.length || s.idealFor?.length ? (
                  <div className="mt-8 grid gap-8 border-t border-(--rule-current) pt-6 sm:grid-cols-2 lg:gap-12">
                    {s.deliverables?.length ? (
                      <div>
                        <h3 className="eyebrow mb-2 text-[10px] tracking-[0.12em]">What you receive</h3>
                        <ul>
                          {s.deliverables.map((d) => (
                            <li key={d.id} className="flex gap-3 border-b border-(--rule-current) py-3 text-[13px] leading-[1.5] text-ink lg:text-[14px]">
                              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" />
                              {d.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {s.idealFor?.length ? (
                      <div>
                        <h3 className="eyebrow mb-2 text-[10px] tracking-[0.12em]">Ideal for</h3>
                        <ul>
                          {s.idealFor.map((d) => (
                            <li key={d.id} className="flex gap-3 border-b border-(--rule-current) py-3 text-[13px] leading-[1.5] text-ink lg:text-[14px]">
                              <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-teal-deep" aria-hidden />
                              {d.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </Chapter>
        )
      })}
      <RenderBlocks blocks={page?.layout} />
      <JsonLd data={breadcrumbJsonLd(crumbs.map((c) => ({ name: c.label, href: c.href ?? '/services' })))} />
    </>
  )
}
