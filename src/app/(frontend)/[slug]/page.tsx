import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/PageHero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { LivePreview } from '@/components/LivePreview'
import { getPage } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbJsonLd, JsonLd } from '@/lib/jsonld'


// Routes that have their own page files; a CMS page with the same slug only supplies the intro there.
const RESERVED = new Set(['home', 'products', 'applications', 'services', 'resources', 'blog', 'updates', 'contact', 'request-quote', 'faq', 'compare', 'newsletter'])


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) return {}
  return buildMetadata({ meta: page.meta, title: page.title, description: page.hero?.text, path: `/${slug}`, image: page.hero?.image })
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (RESERVED.has(slug)) notFound()
  const page = await getPage(slug)
  if (!page) notFound()
  return (
    <>
      <LivePreview />
      <PageHero hero={page.hero} title={page.title} breadcrumbs={[{ label: 'Home', href: '/' }, { label: page.title }]} />
      <RenderBlocks blocks={page.layout} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', href: '/' }, { name: page.title, href: `/${slug}` }])} />
    </>
  )
}
