import type { Metadata } from 'next'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { ListingHero } from '@/components/PageHero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { ProductCard } from '@/components/product/cards'
import { EmptyState, ButtonLink } from '@/components/ui'
import { getCategories, getPage, getProducts } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { cn } from '@/lib/utils'
import { categoryOf } from '@/lib/catalog'


const GRADES = [
  { value: 'faster', label: 'Faster' },
  { value: 'fast-flow', label: 'Fast Flow' },
  { value: 'precise', label: 'Precise' },
  { value: 'hr', label: 'HR' },
]

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('products')
  return buildMetadata({ meta: page?.meta, title: 'Products — agarose chromatography resins', description: page?.hero?.text || 'Ion exchange, affinity (IMAC), size exclusion, hydrophobic interaction and mixed-mode agarose resins, pre-packed columns and evaluation kits.', path: '/products' })
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams
  const category = typeof sp.category === 'string' ? sp.category : undefined
  const grade = typeof sp.grade === 'string' ? sp.grade : undefined
  const q = typeof sp.q === 'string' ? sp.q.trim() : ''
  const [page, categories, products] = await Promise.all([getPage('products'), getCategories(), getProducts({ category, search: q || undefined })])
  const filtered = grade ? products.filter((p) => p.grades?.some((g) => g.grade === grade)) : products

  const href = (patch: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    const next = { category, grade, q, ...patch }
    for (const [k, v] of Object.entries(next)) if (v) params.set(k, v)
    const s = params.toString()
    return `/products${s ? `?${s}` : ''}`
  }

  const grouped = categories
    .map((c) => ({ category: c, items: filtered.filter((p) => categoryOf(p)?.id === c.id) }))
    .filter((g) => g.items.length)

  return (
    <>
      <ListingHero page={page} fallback={{ eyebrow: 'Catalog', title: 'Agarose chromatography resins', text: 'Every product family below is manufactured in our Anand, Gujarat facility on the same cross-linked agarose backbone and shipped worldwide. Pick a mode, compare grades, then request a quote.' }} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Products' }]} />

      <section className="section-tight">
        <div className="container-x">
          <form action="/products" className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between" role="search">
            <div className="flex flex-wrap gap-2" aria-label="Filter by category">
              <Link href={href({ category: undefined })} className={cn('chip', !category && 'border-navy-900 bg-navy-900 text-white')}>
                All
              </Link>
              {categories.map((c) => (
                <Link key={c.id} href={href({ category: c.slug! })} className={cn('chip', category === c.slug && 'border-navy-900 bg-navy-900 text-white')}>
                  {c.shortName || c.name}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex gap-1" aria-label="Filter by grade">
                {GRADES.map((g) => (
                  <Link key={g.value} href={href({ grade: grade === g.value ? undefined : g.value })} className={cn('chip', grade === g.value && 'border-teal-500 bg-teal-50 text-teal-600')}>
                    {g.label}
                  </Link>
                ))}
              </div>
              <label className="relative">
                <span className="sr-only">Search products</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input name="q" defaultValue={q} placeholder="Search…" className="w-44 rounded-full border border-line bg-white py-1.5 pl-9 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" />
              </label>
              {category ? <input type="hidden" name="category" value={category} /> : null}
              {grade ? <input type="hidden" name="grade" value={grade} /> : null}
            </div>
          </form>

          {q || category || grade ? (
            <p className="mt-4 text-sm text-muted">
              {filtered.length} product{filtered.length === 1 ? '' : 's'}
              {q ? ` matching “${q}”` : ''} ·{' '}
              <Link href="/products" className="font-medium text-navy-900 hover:underline">
                Clear filters
              </Link>
            </p>
          ) : null}

          {grouped.length ? (
            <div className="mt-8 space-y-14">
              {grouped.map(({ category: c, items }) => (
                <div key={c.id} id={c.slug!}>
                  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
                    <div>
                      <h2 className="heading-3">{c.name}</h2>
                      {c.tagline ? <p className="mt-1 text-sm text-ink-soft">{c.tagline}</p> : null}
                    </div>
                    <Link href={`/products/category/${c.slug}`} className="text-sm font-semibold text-navy-900 hover:text-teal-600">
                      About {c.shortName || c.name} →
                    </Link>
                  </div>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {items.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState title="No products match" text="Try a different search term or clear the filters. If you need a chemistry that is not listed, we develop custom ligands and bead sizes to order.">
                <ButtonLink href="/products" appearance="secondary">
                  Clear filters
                </ButtonLink>
                <ButtonLink href="/request-quote?type=technical">Ask about custom resins</ButtonLink>
              </EmptyState>
            </div>
          )}
        </div>
      </section>

      <RenderBlocks blocks={page?.layout} />
    </>
  )
}
