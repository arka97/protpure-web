import Link from 'next/link'
import * as React from 'react'
import { ProductCard } from './cards'
import { FilterSidebar, SortForm } from './CatalogueFilters'
import { CompareBar } from './CompareToggle'
import { ResinSelector } from './ResinSelector'
import { ButtonLink, EmptyState } from '@/components/ui'
import { ArrowIcon, ChevronDownIcon } from '@/components/visual/icons'
import { buildFilterGroups, cardSpecs, filterProducts, hasFilters, slimProduct, sortProducts, type CatalogueQuery } from '@/lib/catalog'
import { SAMPLE_KIT_POLICY } from '@/lib/rfq'
import type { Product, ProductCategory, SiteSetting } from '@/payload-types'

/**
 * The catalogue body shared by /products and the category pages: the 220 px filter sidebar, the
 * inline resin selector, the results bar with sort, the three-column card grid, the floating
 * compare bar and the footnotes. Everything is derived from the product rows — nothing hard-coded.
 * The page itself decides the scope (all products or one category) and the form action URL.
 */
export function Catalogue({
  products,
  categories,
  query,
  action,
  scoped,
  settings,
  selector = true,
}: {
  products: Product[]
  categories: ProductCategory[]
  query: CatalogueQuery
  /** Form action / reset URL, e.g. `/products` or `/products/category/affinity`. */
  action: string
  /** Category page: the mode group is dropped and counts are within the category. */
  scoped?: ProductCategory | null
  settings: SiteSetting
  selector?: boolean
}) {
  const groups = buildFilterGroups(products, categories, query, { scoped: Boolean(scoped) })
  const results = sortProducts(filterProducts(products, query), query.sort, categories)
  const active = query.category.length + query.type.length + query.grade.length + query.availability.length + (query.q ? 1 : 0)
  const hidden: [string, string][] = [
    ...query.category.map((v): [string, string] => ['category', v]),
    ...query.type.map((v): [string, string] => ['type', v]),
    ...query.grade.map((v): [string, string] => ['grade', v]),
    ...query.availability.map((v): [string, string] => ['availability', v]),
    ...(query.q ? [['q', query.q] as [string, string]] : []),
  ]
  const names = Object.fromEntries(products.map((p) => [p.slug ?? '', p.name]))
  const anyMissing = results.some((p) => cardSpecs(p).some((s) => s.missing))
  const onRequest = products.filter((p) => p.leadTime && /request/i.test(p.leadTime)).map((p) => p.name)
  const scopeLabel = scoped ? scoped.shortName || scoped.name : hasFilters(query) ? 'filtered' : 'all modes'

  return (
    <div className="container-x grid gap-6 pb-16 pt-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 lg:pb-[65px] lg:pt-10">
      <aside aria-label="Product filters" className="min-w-0">
        <FilterSidebar action={action} groups={groups} q={query.q} sort={query.sort} activeCount={active} resultCount={results.length} />
        <div className="hidden border-t border-rule pt-6 text-[12px] leading-[1.6] text-text-2 lg:block">
          <p className="mb-3">Choosing between chemistries?</p>
          <Link href="/request-quote?type=technical" className="text-link text-[13px]">
            Ask a scientist <ArrowIcon />
          </Link>
        </div>
      </aside>

      <section aria-label="Product results" className="min-w-0">
        {selector ? <SelectorEntry categories={categories} products={products} /> : null}

        <div className="mb-5 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 text-[13px]">
          <p aria-live="polite">
            <strong className="mono font-medium text-ink">{results.length}</strong> product{results.length === 1 ? '' : 's'} <span className="text-text-2">/ {scopeLabel}</span>
            {hasFilters(query) ? (
              <>
                {' '}
                <span className="text-text-2">·</span>{' '}
                <Link href={action} className="font-medium text-teal-deep underline decoration-rule underline-offset-4 hover:decoration-current">
                  Reset
                </Link>
              </>
            ) : null}
          </p>
          <SortForm action={action} sort={query.sort} hidden={hidden} />
        </div>

        {results.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" role="list">
            {results.map((p) => (
              <li key={p.id} className="min-w-0">
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No products match these filters" text="Reset the filters to see the full catalogue, or ask us — we develop custom ligands and bead sizes to order.">
            <ButtonLink href={action} appearance="secondary">
              Reset filters
            </ButtonLink>
            <ButtonLink href="/request-quote?type=technical">Ask about custom resins</ButtonLink>
          </EmptyState>
        )}

        <div className="mt-6 max-w-[720px] space-y-2 text-[11px] leading-[1.6] text-text-2">
          <p>
            DBC values refer to the stated model protein and grade; flow values refer to the stated grade and conditions. See each product’s specifications before comparing.
            {anyMissing ? ' [DBC: to confirm] and [Flow: to confirm] mark data awaiting confirmation.' : ''}
          </p>
          <p>
            {settings.leadTime ? `Standard products: ${settings.leadTime}. ` : ''}
            {onRequest.length ? `${onRequest.join(', ')}: lead time on request. ` : ''}
            All prices by quotation. {SAMPLE_KIT_POLICY}
          </p>
        </div>
      </section>

      <CompareBar names={names} />
    </div>
  )
}

/** "Find the right chemistry in three steps" — a native disclosure on the tint surface, open on request. */
function SelectorEntry({ categories, products }: { categories: ProductCategory[]; products: Product[] }) {
  const slim = products.map(slimProduct)
  return (
    <details className="group mb-6 border border-[#b6cfc4] bg-tint text-tint-ink">
      <summary className="flex min-h-11 cursor-pointer list-none flex-col gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden sm:flex-row sm:items-center sm:justify-between sm:gap-5 lg:px-6 lg:py-5">
        <span className="min-w-0">
          <span className="block font-display text-[26px] leading-[1.05] tracking-[-0.03em] text-ink lg:text-[30px]">Find the right chemistry in three steps.</span>
          <span className="mt-1 block text-[12px] text-text-2">Tell us your target, workflow and scale. We suggest a starting point.</span>
        </span>
        <span className="text-link shrink-0 self-start text-[12px] text-ink group-open:hidden">
          Start the selector <ArrowIcon />
        </span>
        <span className="hidden shrink-0 items-center gap-2 self-start text-[12px] font-medium text-ink group-open:inline-flex">
          Close <ChevronDownIcon className="h-4 w-4 rotate-180" />
        </span>
      </summary>
      <div className="border-t border-[#b6cfc4] px-5 py-5 lg:px-6 lg:py-6">
        <ResinSelector categories={categories.map((c) => ({ slug: c.slug!, name: c.name, mode: c.mode ?? null }))} products={slim} />
      </div>
    </details>
  )
}
