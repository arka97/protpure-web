import type { Metadata } from 'next'
import { ListingHero } from '@/components/PageHero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { FaqList } from '@/components/FaqList'
import { Chapter, ChapterEyebrow } from '@/components/visual/Chapter'
import { FAQ_CATEGORIES } from '@/collections/Faqs'
import { getFaqs, getPage } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbJsonLd, faqJsonLd, JsonLd } from '@/lib/jsonld'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('faq')
  return buildMetadata({ meta: page?.meta, title: 'Frequently asked questions', description: page?.hero?.text || 'Answers about Protpure resins, ordering, shipping, quality documentation and technical support.', path: '/faq' })
}

export default async function FaqPage() {
  const [page, faqs] = await Promise.all([getPage('faq'), getFaqs()])
  const groups = FAQ_CATEGORIES.map((c) => ({ ...c, items: faqs.filter((f) => f.category === c.value) })).filter((g) => g.items.length)
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'FAQ' }]
  return (
    <>
      <ListingHero page={page} fallback={{ eyebrow: 'FAQ', title: 'Questions from the bench.', highlight: 'the bench.', text: 'Straight answers on products, ordering, export and documentation. Not covered? Ask us directly.' }} breadcrumbs={crumbs} />

      {/* Category tabs: sticky under the header, one anchor per category with its count in mono. */}
      <nav className="sticky top-[76px] z-30 border-b border-rule bg-surface lg:top-[72px]" aria-label="FAQ categories">
        <div className="container-x -mb-px flex gap-6 overflow-x-auto lg:gap-[30px]">
          {groups.map((g) => (
            <a key={g.value} href={`#${g.value}`} className="flex min-h-11 shrink-0 items-center gap-2 border-b border-transparent py-3 text-[12px] font-medium text-ink hover:border-teal-deep hover:text-teal-deep lg:min-h-[56px] lg:text-[13px]">
              {g.label}
              <span className="mono text-[10px] text-text-2">{g.items.length}</span>
            </a>
          ))}
        </div>
      </nav>

      {groups.map((g, i) => (
        <Chapter key={g.value} id={g.value} className="scroll-mt-[132px] border-b border-rule last-of-type:border-b-0 lg:scroll-mt-[128px]" tone={i % 2 === 1 ? 'recessed' : 'light'}>
          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-[75px]">
            <div>
              <ChapterEyebrow number={i + 1} className="mb-4" as="p">
                FAQ
              </ChapterEyebrow>
              <h2 className="serif-md max-w-[300px]">
                {g.label}
                <span className="mono ml-3 text-[13px] text-text-2">{g.items.length}</span>
              </h2>
            </div>
            <FaqList faqs={g.items} openFirst={i === 0} />
          </div>
        </Chapter>
      ))}
      <RenderBlocks blocks={page?.layout} />
      {faqs.length ? <JsonLd data={faqJsonLd(faqs)} /> : null}
      <JsonLd data={breadcrumbJsonLd(crumbs.map((c) => ({ name: c.label, href: c.href ?? '/faq' })))} />
    </>
  )
}
