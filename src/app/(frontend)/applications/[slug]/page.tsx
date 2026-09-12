import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/PageHero'
import { RichText } from '@/components/RichText'
import { ProductCard } from '@/components/product/cards'
import { ButtonLink } from '@/components/ui'
import { Chapter, ChapterEyebrow } from '@/components/visual/Chapter'
import { ArrowIcon, CheckIcon } from '@/components/visual/icons'
import { getApplication, getApplications } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { applicationJsonLd, breadcrumbJsonLd, JsonLd } from '@/lib/jsonld'
import type { Product } from '@/payload-types'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const a = await getApplication(slug)
  if (!a) return {}
  return buildMetadata({ meta: a.meta, title: `${a.name} — chromatography resins`, description: a.summary, path: `/applications/${slug}`, image: a.image })
}

export default async function ApplicationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [a, all] = await Promise.all([getApplication(slug), getApplications()])
  if (!a) notFound()
  const products = (a.recommendedProducts ?? []).filter((p): p is Product => typeof p === 'object')
  const others = all.filter((o) => o.id !== a.id)
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Applications', href: '/applications' }, { label: a.name }]
  const quoteHref = products.length ? `/request-quote?${products.map((p) => `product=${p.id}`).join('&')}` : '/request-quote'
  return (
    <>
      <PageHero hero={{ style: 'standard', eyebrow: 'Application', heading: a.name, text: a.summary, image: a.image ?? null, imageCaption: a.image && typeof a.image === 'object' ? a.name : null }} title={a.name} breadcrumbs={crumbs}>
        <div className="mt-6 flex flex-wrap gap-3 lg:mt-[30px]">
          <ButtonLink href="/request-quote?type=technical">
            Discuss your process <ArrowIcon />
          </ButtonLink>
          {products.length ? (
            <ButtonLink href={quoteHref} appearance="onDark">
              Quote the recommended resins
            </ButtonLink>
          ) : null}
        </div>
      </PageHero>

      {/* 01 / The workflow: reading column + typical workflows as a rule-separated list */}
      <Chapter id="workflow" tight={products.length > 0}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,680px)_320px] lg:justify-between lg:gap-[75px]">
          <div>
            <ChapterEyebrow number={1} className="mb-5" as="p">
              The workflow
            </ChapterEyebrow>
            <RichText data={a.description} />
          </div>
          <aside className="lg:pt-9">
            {a.workflows?.length ? (
              <>
                <h2 className="heading-3 border-b border-rule-strong pb-3">Typical workflows</h2>
                <ul className="mt-1">
                  {a.workflows.map((w) => (
                    <li key={w.id} className="flex min-h-11 items-center gap-3 border-b border-rule py-2.5 text-[13px] text-ink lg:text-[14px]">
                      <CheckIcon className="h-4 w-4 shrink-0 text-teal-deep" /> {w.text}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {others.length ? (
              <nav className="mt-8" aria-label="Other applications">
                <h2 className="eyebrow mb-3 text-[10px] tracking-[0.12em]">Other applications</h2>
                <ul className="grid gap-y-1 text-[13px]">
                  {others.map((o) => (
                    <li key={o.id}>
                      <Link href={`/applications/${o.slug}`} className="flex min-h-11 items-center justify-between gap-3 border-b border-rule py-2 hover:text-teal-deep lg:min-h-9">
                        {o.name}
                        <ArrowIcon className="h-[15px] w-[15px] shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </aside>
        </div>
      </Chapter>

      {/* 02 / Recommended resins: cards with Add to RFQ, then one quote action for the set */}
      {products.length ? (
        <Chapter
          id="resins"
          tone="recessed"
          number={2}
          eyebrow="Recommended resins"
          heading={`${products.length} ${products.length === 1 ? 'resin' : 'resins'} for ${a.name.toLowerCase()}`}
          intro="Add the grades and pack sizes you want to evaluate to the RFQ basket; one request covers the whole set."
          aside={
            <ButtonLink href={quoteHref} appearance="link">
              Quote all recommended resins <ArrowIcon />
            </ButtonLink>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} compact />
            ))}
          </div>
        </Chapter>
      ) : null}
      <JsonLd data={[applicationJsonLd(a), breadcrumbJsonLd(crumbs.map((c) => ({ name: c.label, href: c.href ?? `/applications/${slug}` })))]} />
    </>
  )
}
