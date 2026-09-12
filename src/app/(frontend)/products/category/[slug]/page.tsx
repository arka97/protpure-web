import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/PageHero'
import { RichText } from '@/components/RichText'
import { Catalogue } from '@/components/product/Catalogue'
import { ArrowIcon, ModeEmblem } from '@/components/visual/icons'
import { getCategories, getCategory, getProducts, getSiteSettings } from '@/lib/data'
import { parseCatalogueQuery } from '@/lib/catalog'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbJsonLd, JsonLd } from '@/lib/jsonld'
import { lexicalToText } from '@/lib/lexical-md'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const cat = await getCategory(slug)
  if (!cat) return {}
  return buildMetadata({ meta: cat.meta, title: `${cat.name} resins`, description: cat.tagline || lexicalToText(cat.description as never), path: `/products/category/${slug}`, image: cat.image })
}

/** One chromatography mode: the same filters and grid as the catalogue, scoped to the category, with its CMS intro. */
export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [{ slug }, sp] = await Promise.all([params, searchParams])
  const cat = await getCategory(slug)
  if (!cat) notFound()
  const query = parseCatalogueQuery({ ...sp, category: undefined })
  const [products, categories, settings] = await Promise.all([getProducts({ category: slug }), getCategories(), getSiteSettings()])
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: cat.name }]
  const action = `/products/category/${slug}`

  return (
    <>
      <PageHero
        tone="dark"
        hero={{ style: 'compact', eyebrow: cat.shortName && cat.shortName !== cat.name ? `Chromatography mode · ${cat.shortName}` : 'Chromatography mode', heading: cat.name, text: cat.tagline }}
        title={cat.name}
        breadcrumbs={crumbs}
        aside={<ModeEmblem icon={cat.icon} className="hidden h-[120px] w-[120px] text-teal-lum lg:block" />}
      >
        <p className="mt-6 text-[12px] text-text-2-dark">
          <span className="mono">{products.length}</span> product{products.length === 1 ? '' : 's'} ·{' '}
          <Link href="/products" className="underline decoration-rule-dark underline-offset-4 hover:text-surface">
            All modes
          </Link>
        </p>
      </PageHero>

      {cat.description ? (
        <section className="border-b border-rule bg-surface">
          <div className="container-x grid gap-6 py-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 lg:py-10">
            <p className="eyebrow">About {cat.shortName || cat.name}</p>
            <div className="max-w-[720px]">
              <RichText data={cat.description} className="text-[15px]" />
              <Link href="/technology" className="text-link mt-5 text-[13px]">
                How the particle platform works <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <Catalogue products={products} categories={categories} query={query} action={action} scoped={cat} settings={settings} selector={false} />
      <JsonLd data={breadcrumbJsonLd(crumbs.map((c) => ({ name: c.label, href: c.href ?? action })))} />
    </>
  )
}
