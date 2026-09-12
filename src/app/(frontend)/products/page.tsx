import type { Metadata } from 'next'
import { ListingHero } from '@/components/PageHero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { Catalogue } from '@/components/product/Catalogue'
import { getCategories, getPage, getProducts, getSiteSettings } from '@/lib/data'
import { parseCatalogueQuery } from '@/lib/catalog'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('products')
  return buildMetadata({ meta: page?.meta, title: 'Products — agarose chromatography resins', description: page?.hero?.text || 'Ion exchange, affinity (IMAC), size exclusion, hydrophobic interaction and mixed-mode agarose resins, pre-packed columns and evaluation kits.', path: '/products' })
}

/**
 * The catalogue: every published product, filtered and sorted from URL search params
 * (`?category=…&type=…&grade=…&availability=…&q=…&sort=…`, repeatable or comma-separated) so the
 * page renders on the server and every state is a shareable link.
 */
export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams
  const query = parseCatalogueQuery(sp)
  const [page, categories, products, settings] = await Promise.all([getPage('products'), getCategories(), getProducts(), getSiteSettings()])

  return (
    <>
      <ListingHero
        tone="dark"
        page={page}
        fallback={{ eyebrow: 'The Protpure catalogue', title: 'Find your chemistry.', text: `From a first evaluation to manufacturing-scale supply.\n${products.length} products. Direct from the scientists who make them.` }}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Products' }]}
      />
      <Catalogue products={products} categories={categories} query={query} action="/products" settings={settings} />
      <RenderBlocks blocks={page?.layout} />
    </>
  )
}
