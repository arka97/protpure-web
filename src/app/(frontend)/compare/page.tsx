import type { Metadata } from 'next'
import Link from 'next/link'
import { X } from 'lucide-react'
import { PageHero } from '@/components/PageHero'
import { GRADE_SHORT } from '@/components/product/cards'
import { ButtonLink, EmptyState } from '@/components/ui'
import { getProducts } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { categoryOf } from '@/lib/catalog'


export const metadata: Metadata = buildMetadata({ title: 'Compare resins', description: 'Compare Protpure agarose resins side by side: ligand, grades, particle size, flow velocity, binding capacity and stability.', path: '/compare', noIndex: true })

export default async function ComparePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams
  const slugs = ([] as string[]).concat(sp.p ?? []).filter(Boolean).slice(0, 4)
  const all = await getProducts()
  const selected = slugs.map((s) => all.find((p) => p.slug === s)).filter(Boolean) as typeof all
  const others = all.filter((p) => !slugs.includes(p.slug!))
  const href = (list: string[]) => `/compare?${list.map((s) => `p=${s}`).join('&')}`

  const rows: { label: string; get: (p: (typeof all)[number]) => string }[] = [
    { label: 'Category', get: (p) => categoryOf(p)?.name ?? '—' },
    { label: 'Type', get: (p) => p.chemistry?.functionalType ?? '—' },
    { label: 'Ligand', get: (p) => p.chemistry?.ligand ?? '—' },
    { label: 'Matrix', get: (p) => p.chemistry?.matrix ?? '—' },
    { label: 'Grades', get: (p) => (p.grades ?? []).map((g) => GRADE_SHORT[g.grade] ?? g.grade).join(', ') || '—' },
    { label: 'Particle size', get: (p) => (p.grades ?? []).map((g) => `${GRADE_SHORT[g.grade] ?? g.grade}: ${g.particleSizeRange ?? '—'}`).join(' · ') || '—' },
    { label: 'Max flow velocity', get: (p) => (p.grades ?? []).map((g) => `${GRADE_SHORT[g.grade] ?? g.grade}: ${g.maxFlowVelocity ?? '—'}`).join(' · ') || '—' },
    { label: 'Dynamic binding capacity', get: (p) => (p.grades ?? []).map((g) => `${GRADE_SHORT[g.grade] ?? g.grade}: ${g.dynamicBindingCapacity ?? '—'}`).join(' · ') || '—' },
  ]
  const specParams = Array.from(new Set(selected.flatMap((p) => (p.specs ?? []).map((s) => s.parameter))))

  return (
    <>
      <PageHero hero={{ style: 'compact', eyebrow: 'Tools', heading: 'Compare resins', text: 'Select up to four products to compare chemistry, grades and specifications side by side.' }} title="Compare" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: 'Compare' }]} />
      <section className="section-tight">
        <div className="container-x">
          <div className="flex flex-wrap items-center gap-2">
            {selected.map((p) => (
              <span key={p.id} className="chip border-navy-900 bg-navy-900 text-white">
                {p.name}
                <Link href={href(slugs.filter((s) => s !== p.slug))} aria-label={`Remove ${p.name}`} className="ml-1 rounded-full hover:bg-white/20">
                  <X className="h-3.5 w-3.5" />
                </Link>
              </span>
            ))}
            {selected.length < 4 ? (
              <details className="relative">
                <summary className="chip cursor-pointer list-none hover:border-navy-900/40">+ Add product</summary>
                <div className="absolute left-0 top-full z-20 mt-2 max-h-72 w-72 overflow-y-auto rounded-xl border border-line bg-white p-2 shadow-card-hover">
                  {others.map((p) => (
                    <Link key={p.id} href={href([...slugs, p.slug!])} className="block rounded-lg px-3 py-2 text-sm hover:bg-navy-50">
                      <span className="font-medium text-navy-900">{p.name}</span>
                      <span className="block text-xs text-muted">{categoryOf(p)?.name ?? ''}</span>
                    </Link>
                  ))}
                </div>
              </details>
            ) : null}
          </div>

          {selected.length ? (
            <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
              <table className="spec-table">
                <thead>
                  <tr>
                    <th className="w-48">Parameter</th>
                    {selected.map((p) => (
                      <th key={p.id}>
                        <Link href={`/products/${p.slug}`} className="hover:underline">
                          {p.name}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.label}>
                      <td>{r.label}</td>
                      {selected.map((p) => (
                        <td key={p.id}>{r.get(p)}</td>
                      ))}
                    </tr>
                  ))}
                  {specParams.map((param) => (
                    <tr key={param}>
                      <td>{param}</td>
                      {selected.map((p) => (
                        <td key={p.id}>{p.specs?.find((s) => s.parameter === param)?.value ?? '—'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState title="Nothing to compare yet" text="Add products with the button above, or open any product page and press “Compare”.">
                <ButtonLink href="/products" appearance="secondary">
                  Browse products
                </ButtonLink>
              </EmptyState>
            </div>
          )}

          {selected.length ? (
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={`/request-quote?${selected.map((p) => `product=${p.id}`).join('&')}`}>Request a quote for these</ButtonLink>
              <ButtonLink href="/request-quote?type=technical" appearance="secondary">
                Ask which fits my process
              </ButtonLink>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
