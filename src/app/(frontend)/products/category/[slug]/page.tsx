import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/PageHero'
import { RichText } from '@/components/RichText'
import { ProductCard } from '@/components/product/cards'
import { ButtonLink, Icon } from '@/components/ui'
import { getCategory, getProducts } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbJsonLd, JsonLd } from '@/lib/jsonld'
import { lexicalToText } from '@/lib/lexical-md'



export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const cat = await getCategory(slug)
  if (!cat) return {}
  return buildMetadata({ meta: cat.meta, title: `${cat.name} resins`, description: cat.tagline || lexicalToText(cat.description as never), path: `/products/category/${slug}`, image: cat.image })
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cat = await getCategory(slug)
  if (!cat) notFound()
  const products = await getProducts({ category: slug })
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: cat.name }]

  return (
    <>
      <PageHero hero={{ style: 'standard', eyebrow: 'Product category', heading: cat.name, text: cat.tagline, image: cat.image ?? null }} title={cat.name} breadcrumbs={crumbs}>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={`/request-quote?${products.map((p) => `product=${p.id}`).join('&')}`}>Request a quote</ButtonLink>
          <ButtonLink href="/products" appearance="onDark">
            All categories
          </ButtonLink>
        </div>
      </PageHero>

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="card sticky top-24 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Icon name={cat.icon} className="h-6 w-6" />
              </div>
              <h2 className="heading-3 mt-4">About {cat.shortName || cat.name}</h2>
              <RichText data={cat.description} className="mt-3 text-[0.95rem]" />
            </div>
          </aside>
          <div className="lg:col-span-8">
            <h2 className="heading-3">
              {products.length} product{products.length === 1 ? '' : 's'}
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </section>
      <JsonLd data={breadcrumbJsonLd(crumbs.map((c) => ({ name: c.label, href: c.href ?? `/products/category/${slug}` })))} />
    </>
  )
}
