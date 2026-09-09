import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { getPage, getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { LivePreview } from '@/components/LivePreview'


export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPage('home'), getSiteSettings()])
  return buildMetadata({ meta: page?.meta, title: settings.titleSuffix || 'Protpure — Agarose Chromatography Resins', description: settings.description, path: '/', image: settings.ogImage })
}

export default async function HomePage() {
  const page = await getPage('home')
  if (!page) {
    return (
      <section className="hex-bg text-white">
        <div className="container-x py-32">
          <h1 className="heading-1 text-white">Protpure</h1>
          <p className="mt-4 text-white/80">Create a page with the slug “home” in the admin panel to build the homepage.</p>
        </div>
      </section>
    )
  }
  return (
    <>
      <LivePreview />
      <PageHero hero={page.hero} title={page.title} />
      <RenderBlocks blocks={page.layout} />
    </>
  )
}
