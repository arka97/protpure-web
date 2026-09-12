import type { Metadata } from 'next'
import { ListingHero } from '@/components/PageHero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { ApplicationCard } from '@/components/product/cards'
import { Chapter } from '@/components/visual/Chapter'
import { getApplications, getPage } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbJsonLd, JsonLd } from '@/lib/jsonld'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('applications')
  return buildMetadata({ meta: page?.meta, title: 'Applications — purification workflows', description: page?.hero?.text || 'Agarose resins for biologics, vaccines, diagnostics, research and industrial biotechnology purification workflows.', path: '/applications' })
}

export default async function ApplicationsPage() {
  const [page, apps] = await Promise.all([getPage('applications'), getApplications()])
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Applications' }]
  return (
    <>
      <ListingHero page={page} fallback={{ eyebrow: 'Applications', title: 'Purification workflows we support', highlight: 'we support', text: 'From capture to polishing, our resins are used across biologics, vaccines, diagnostics and research. Explore typical workflows and the resins we recommend for each.' }} breadcrumbs={crumbs} />
      <Chapter id="workflows" aria-label="Application areas">
        <p className="mono mb-5 border-b border-rule pb-3 text-[11px] text-text-2 lg:mb-6 lg:text-[12px]">
          {apps.length} application areas <span className="font-sans text-text-2">/ typical workflows and recommended resins</span>
        </p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((a) => (
            <li key={a.id}>
              <ApplicationCard application={a} />
            </li>
          ))}
        </ul>
      </Chapter>
      <RenderBlocks blocks={page?.layout} />
      <JsonLd data={breadcrumbJsonLd(crumbs.map((c) => ({ name: c.label, href: c.href ?? '/applications' })))} />
    </>
  )
}
