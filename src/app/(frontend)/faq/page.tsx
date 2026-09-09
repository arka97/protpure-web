import type { Metadata } from 'next'
import { ListingHero } from '@/components/PageHero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { FaqList } from '@/components/FaqList'
import { FAQ_CATEGORIES } from '@/collections/Faqs'
import { getFaqs, getPage } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { faqJsonLd, JsonLd } from '@/lib/jsonld'


export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('faq')
  return buildMetadata({ meta: page?.meta, title: 'Frequently asked questions', description: page?.hero?.text || 'Answers about Protpure resins, ordering, shipping, quality documentation and technical support.', path: '/faq' })
}

export default async function FaqPage() {
  const [page, faqs] = await Promise.all([getPage('faq'), getFaqs()])
  const groups = FAQ_CATEGORIES.map((c) => ({ ...c, items: faqs.filter((f) => f.category === c.value) })).filter((g) => g.items.length)
  return (
    <>
      <ListingHero page={page} fallback={{ eyebrow: 'FAQ', title: 'Frequently asked questions', text: 'Straight answers on products, ordering, export and documentation. Not covered? Ask us directly.' }} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]} />
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <nav className="lg:col-span-3" aria-label="FAQ sections">
            <ul className="sticky top-24 space-y-1 text-sm">
              {groups.map((g) => (
                <li key={g.value}>
                  <a href={`#${g.value}`} className="block rounded-md px-3 py-2 text-ink-soft hover:bg-navy-50 hover:text-navy-900">
                    {g.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-12 lg:col-span-9">
            {groups.map((g) => (
              <div key={g.value} id={g.value} className="scroll-mt-28">
                <h2 className="heading-3 mb-4">{g.label}</h2>
                <FaqList faqs={g.items} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <RenderBlocks blocks={page?.layout} />
      {faqs.length ? <JsonLd data={faqJsonLd(faqs)} /> : null}
    </>
  )
}
