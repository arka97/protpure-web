import type { Metadata } from 'next'
import Link from 'next/link'
import * as React from 'react'
import { PageHero } from '@/components/PageHero'
import { TableFigure } from '@/components/product/cards'
import { AddToBasketButton } from '@/components/rfq/AddToBasketButton'
import { ButtonLink, EmptyState, StatusBadge } from '@/components/ui'
import { ArrowIcon, CloseIcon, PlusIcon } from '@/components/visual/icons'
import { getProducts, getSiteSettings } from '@/lib/data'
import { categoryOf, gradeLabel, pickCompared, pressureOnly, referenceGrade } from '@/lib/catalog'
import { toBasketProduct } from '@/lib/rfq'
import { buildMetadata } from '@/lib/seo'
import type { Product } from '@/payload-types'

export const metadata: Metadata = buildMetadata({ title: 'Compare resins', description: 'Compare Protpure agarose resins side by side: ligand, grades, particle size, flow velocity, binding capacity and stability.', path: '/compare', noIndex: true })

const MAX = 3

/**
 * Side-by-side comparison of up to three products, chosen with the catalogue's Compare checkboxes
 * (`?ids=slug,slug` — ids or slugs; the older repeated `?p=` form still works). Every column is a
 * Protpure product, so the reference-grade figures are quoted per column and each column ends in
 * its own Add to RFQ.
 */
export default async function ComparePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams
  const [all, settings] = await Promise.all([getProducts(), getSiteSettings()])
  const selected = pickCompared(all, sp, MAX)
  const slugs = selected.map((p) => p.slug!)
  const others = all.filter((p) => !slugs.includes(p.slug!))
  const href = (list: string[]) => (list.length ? `/compare?ids=${list.join(',')}` : '/compare')
  const refs = new Map(selected.map((p) => [p.id, referenceGrade(p.grades)]))
  const gradeNote = (p: Product) => {
    const r = refs.get(p.id)
    return r && (p.grades?.length ?? 0) > 1 ? gradeLabel(r.grade) : null
  }

  type Row = { label: string; get: (p: Product) => React.ReactNode; figure?: boolean }
  const chem: Row[] = [
    { label: 'Chromatography mode', get: (p) => categoryOf(p)?.name },
    { label: 'Functional type', get: (p) => p.chemistry?.functionalType },
    { label: 'Ligand', get: (p) => p.chemistry?.ligand },
    { label: 'Matrix', get: (p) => p.chemistry?.matrix, figure: true },
    { label: 'Grades', get: (p) => (p.grades ?? []).map((g) => gradeLabel(g.grade)).join(' · ') },
  ]
  const ref = (k: 'particleSizeRange' | 'd50' | 'maxFlowVelocity' | 'dynamicBindingCapacity' | 'pressureFlow') => (p: Product) => refs.get(p.id)?.[k] ?? null
  const perf: Row[] = [
    { label: 'Particle size range', get: ref('particleSizeRange'), figure: true },
    { label: 'Particle size, d50V', get: ref('d50'), figure: true },
    { label: 'Max linear flow velocity', get: ref('maxFlowVelocity'), figure: true },
    { label: 'Dynamic binding capacity', get: ref('dynamicBindingCapacity'), figure: true },
    { label: 'Pressure / bed height', get: (p: Product) => pressureOnly(refs.get(p.id)), figure: true },
  ].filter((r) => selected.some((p) => r.get(p)))
  const specParams = Array.from(new Set(selected.flatMap((p) => (p.specs ?? []).map((s) => s.parameter))))
  const order: Row[] = [
    { label: 'Availability', get: (p) => <StatusBadge status={p.availability} /> },
    { label: 'Lead time', get: (p) => p.leadTime || settings.leadTime, figure: true },
    { label: 'Pack sizes', get: (p) => (p.packSizes ?? []).map((ps) => ps.size).join(' · ') },
  ]

  const cell = (r: Row, p: Product) => {
    const v = r.get(p)
    if (v == null || v === '') return <span className="text-text-2">—</span>
    if (typeof v !== 'string') return v
    return r.figure ? <TableFigure value={v} /> : <span className="num">{v}</span>
  }

  return (
    <>
      <PageHero
        hero={{ style: 'compact', eyebrow: 'Compare', heading: 'Compare resins', text: `Up to ${MAX} products side by side: chemistry, reference-grade figures, specifications and ordering. Tick “Compare” on any catalogue card to add it here.` }}
        title="Compare"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: 'Compare' }]}
      />

      <section className="bg-surface pb-16 pt-8 lg:pb-[65px] lg:pt-10">
        <div className="container-x">
          {/* Selection */}
          <div className="flex flex-wrap items-center gap-2" aria-label="Products in this comparison">
            {selected.map((p) => (
              <span key={p.id} className="chip min-h-9 gap-2 border-ink bg-ink pl-3 pr-1 text-[12px] text-white">
                {p.name}
                <Link href={href(slugs.filter((s) => s !== p.slug))} aria-label={`Remove ${p.name} from the comparison`} className="icon-button min-h-7 min-w-7 text-white/80 hover:bg-white/10 hover:text-white">
                  <CloseIcon className="h-3.5 w-3.5" />
                </Link>
              </span>
            ))}
            {selected.length < MAX ? (
              <details className="relative">
                <summary className="chip min-h-9 cursor-pointer list-none border-rule-strong px-3 text-[12px] hover:border-ink [&::-webkit-details-marker]:hidden">
                  <PlusIcon className="h-3.5 w-3.5" /> Add a product
                </summary>
                <div className="absolute left-0 top-full z-20 mt-2 max-h-80 w-80 overflow-y-auto border border-rule bg-white p-1.5 shadow-panel">
                  {others.map((p) => (
                    <Link key={p.id} href={href([...slugs, p.slug!])} className="block px-3 py-2 hover:bg-surface-recessed">
                      <span className="block text-[13px] font-medium text-ink">{p.name}</span>
                      <span className="block text-[11px] text-text-2">{categoryOf(p)?.name ?? ''}</span>
                    </Link>
                  ))}
                </div>
              </details>
            ) : (
              <span className="text-[12px] text-text-2">
                <span className="mono">{MAX}</span> of <span className="mono">{MAX}</span> — remove one to add another
              </span>
            )}
          </div>

          {selected.length ? (
            <>
              <div className="mt-8 overflow-x-auto" role="region" aria-label="Comparison table" tabIndex={0}>
                <table className="compare-table compare-products min-w-[640px]">
                  <thead>
                    <tr>
                      <th scope="col" className="w-[22%]">
                        Parameter
                      </th>
                      {selected.map((p) => (
                        <th key={p.id} scope="col" className="highlight align-bottom">
                          <Link href={`/products/${p.slug}`} className="block font-display text-[24px] normal-case leading-[1.1] tracking-[-0.02em] text-ink hover:text-teal-deep">
                            {p.name}
                          </Link>
                          <span className="mt-1.5 block text-[11px] font-normal normal-case tracking-normal text-text-2">
                            {p.subtitle || categoryOf(p)?.name}
                            {gradeNote(p) ? (
                              <>
                                {' · '}
                                reference grade <span className="mono">{gradeNote(p)}</span>
                              </>
                            ) : null}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <GroupRow label="Chemistry" span={selected.length + 1} />
                    {chem.map((r) => (
                      <tr key={r.label}>
                        <th scope="row">{r.label}</th>
                        {selected.map((p) => (
                          <td key={p.id}>{cell(r, p)}</td>
                        ))}
                      </tr>
                    ))}
                    {perf.length ? (
                      <>
                        <GroupRow label="Reference grade" span={selected.length + 1} />
                        {perf.map((r) => (
                          <tr key={r.label}>
                            <th scope="row">{r.label}</th>
                            {selected.map((p) => (
                              <td key={p.id}>{cell(r, p)}</td>
                            ))}
                          </tr>
                        ))}
                      </>
                    ) : null}
                    {specParams.length ? (
                      <>
                        <GroupRow label="Specifications" span={selected.length + 1} />
                        {specParams.map((param) => (
                          <tr key={param}>
                            <th scope="row">{param}</th>
                            {selected.map((p) => (
                              <td key={p.id}>
                                <TableFigure value={p.specs?.find((s) => s.parameter === param)?.value} />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </>
                    ) : null}
                    <GroupRow label="Ordering" span={selected.length + 1} />
                    {order.map((r) => (
                      <tr key={r.label}>
                        <th scope="row">{r.label}</th>
                        {selected.map((p) => (
                          <td key={p.id}>{cell(r, p)}</td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <th scope="row">
                        <span className="sr-only">Actions</span>
                      </th>
                      {selected.map((p) => (
                        <td key={p.id} className="highlight">
                          <div className="flex flex-wrap items-center gap-3">
                            <AddToBasketButton product={toBasketProduct(p)} appearance="teal" size="sm" />
                            <Link href={`/products/${p.slug}`} className="text-link text-[12px]">
                              Details <ArrowIcon />
                            </Link>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="table-note max-w-[720px]">
                Reference-grade figures are quoted for the grade named in each column (Fast Flow / Standard where it exists); every product page lists all grades with their test conditions. Typical datasheet values, not a guarantee of equivalence in your process.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href={`/request-quote?${selected.map((p) => `product=${p.id}`).join('&')}`}>
                  Request a quote for these <ArrowIcon />
                </ButtonLink>
                <ButtonLink href="/request-quote?type=technical" appearance="secondary">
                  Ask which fits my process
                </ButtonLink>
              </div>
            </>
          ) : (
            <div className="mt-8">
              <EmptyState title="Nothing to compare yet" text="Tick “Compare” on up to three catalogue cards, or add products with the button above.">
                <ButtonLink href="/products" appearance="secondary">
                  Browse the catalogue <ArrowIcon />
                </ButtonLink>
              </EmptyState>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function GroupRow({ label, span }: { label: string; span: number }) {
  return (
    <tr className="compare-group">
      <th scope="colgroup" colSpan={span} className="bg-surface pb-2 pt-7">
        <span className="eyebrow text-[10px]">{label}</span>
      </th>
    </tr>
  )
}
