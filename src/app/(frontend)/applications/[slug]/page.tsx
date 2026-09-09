import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Check } from 'lucide-react'
import { PageHero } from '@/components/PageHero'
import { RichText } from '@/components/RichText'
import { ProductCard } from '@/components/product/cards'
import { ButtonLink } from '@/components/ui'
import { getApplication } from '@/lib/data'
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
  const a = await getApplication(slug)
  if (!a) notFound()
  const products = (a.recommendedProducts ?? []).filter((p): p is Product => typeof p === 'object')
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Applications', href: '/applications' }, { label: a.name }]
  return (
    <>
      <PageHero hero={{ style: 'standard', eyebrow: 'Application', heading: a.name, text: a.summary, image: a.image ?? null }} title={a.name} breadcrumbs={crumbs}>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={`/request-quote?type=technical`}>Discuss your process</ButtonLink>
          {products.length ? (
            <ButtonLink href={`/request-quote?${products.map((p) => `product=${p.id}`).join('&')}`} appearance="onDark">
              Quote recommended resins
            </ButtonLink>
          ) : null}
        </div>
      </PageHero>
      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <RichText data={a.description} />
          </div>
          <aside className="lg:col-span-5">
            {a.workflows?.length ? (
              <div className="card p-6">
                <h2 className="heading-3">Typical workflows</h2>
                <ul className="mt-4 space-y-2.5">
                  {a.workflows.map((w) => (
                    <li key={w.id} className="flex gap-2 text-sm text-ink-soft">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" /> {w.text}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
      {products.length ? (
        <section className="section bg-surface-2">
          <div className="container-x">
            <h2 className="heading-2">Recommended resins</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <JsonLd data={[applicationJsonLd(a), breadcrumbJsonLd(crumbs.map((c) => ({ name: c.label, href: c.href ?? `/applications/${slug}` })))]} />
    </>
  )
}
