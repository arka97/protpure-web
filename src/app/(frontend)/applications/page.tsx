import type { Metadata } from 'next'
import { ListingHero } from '@/components/PageHero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { ApplicationCard } from '@/components/product/cards'
import { getApplications, getPage } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'


export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('applications')
  return buildMetadata({ meta: page?.meta, title: 'Applications', description: page?.hero?.text || 'Agarose resins for biologics, vaccines, diagnostics, research and industrial biotechnology purification workflows.', path: '/applications' })
}

export default async function ApplicationsPage() {
  const [page, apps] = await Promise.all([getPage('applications'), getApplications()])
  return (
    <>
      <ListingHero page={page} fallback={{ eyebrow: 'Applications', title: 'Purification workflows we support', text: 'From capture to polishing, our resins are used across biologics, vaccines, diagnostics and research. Explore typical workflows and the resins we recommend for each.' }} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Applications' }]} />
      <section className="section">
        <div className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((a) => (
            <ApplicationCard key={a.id} application={a} />
          ))}
        </div>
      </section>
      <RenderBlocks blocks={page?.layout} />
    </>
  )
}
