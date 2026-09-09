import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Check, Download, FileText, Scale } from 'lucide-react'
import { RichText } from '@/components/RichText'
import { LivePreview } from '@/components/LivePreview'
import { FaqList } from '@/components/FaqList'
import { DocumentRow, GRADE_SHORT, ProductCard } from '@/components/product/cards'
import { Breadcrumbs, ButtonLink, CmsImage, KeyValue, StatusBadge } from '@/components/ui'
import { getFaqs, getProduct, getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbJsonLd, faqJsonLd, JsonLd, productJsonLd } from '@/lib/jsonld'
import type { Application, Document, Product, ProductCategory } from '@/payload-types'



export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = await getProduct(slug)
  if (!p) return {}
  return buildMetadata({ meta: p.meta, title: `${p.name}${p.subtitle ? ` — ${p.subtitle}` : ''}`, description: p.summary, path: `/products/${slug}`, image: p.image })
}

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'grades', label: 'Grades' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'ordering', label: 'Ordering' },
  { id: 'documents', label: 'Documents' },
  { id: 'faq', label: 'FAQ' },
]

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()
  const [settings, faqs] = await Promise.all([getSiteSettings(), getFaqs({ product: product.id })])
  const cat = product.category as ProductCategory
  const docs = (product.documents ?? []).filter((d): d is Document => typeof d === 'object')
  const datasheet = docs.find((d) => d.type === 'datasheet')
  const related = (product.relatedProducts ?? []).filter((p): p is Product => typeof p === 'object')
  const applications = (product.applications ?? []).filter((a): a is Application => typeof a === 'object')
  const grades = product.grades ?? []
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: cat.name, href: `/products/category/${cat.slug}` },
    { label: product.name },
  ]
  const quoteHref = `/request-quote?product=${product.id}`
  const hasGradeRow = (key: keyof (typeof grades)[number]) => grades.some((g) => g[key])

  return (
    <>
      <LivePreview />
      {/* Hero */}
      <section className="hex-bg text-white">
        <div className="container-x grid gap-10 py-14 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-7">
            <Breadcrumbs items={crumbs} onDark />
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href={`/products/category/${cat.slug}`} className="eyebrow hover:text-white">
                {cat.name}
              </Link>
              <StatusBadge status={product.availability} />
            </div>
            <h1 className="heading-1 mt-3 text-white">{product.name}</h1>
            {product.subtitle ? <p className="mt-2 text-xl text-teal-300">{product.subtitle}</p> : null}
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{product.summary}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={quoteHref}>Request a quote</ButtonLink>
              {datasheet ? (
                <ButtonLink href={datasheet.url ?? '#'} appearance="onDark" newTab>
                  <Download className="h-4 w-4" /> Datasheet
                </ButtonLink>
              ) : null}
              <ButtonLink href={`/compare?p=${product.slug}`} appearance="onDark">
                <Scale className="h-4 w-4" /> Compare
              </ButtonLink>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-4">
              {product.chemistry?.ligand ? <Fact k="Ligand" v={product.chemistry.ligand} /> : null}
              {product.chemistry?.matrix ? <Fact k="Matrix" v={product.chemistry.matrix} /> : null}
              {grades.length ? <Fact k="Grades" v={grades.map((g) => GRADE_SHORT[g.grade] ?? g.grade).join(' · ')} /> : null}
              <Fact k="Lead time" v={product.leadTime || settings.leadTime || '2–3 weeks'} />
            </dl>
          </div>
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white p-8">
              {product.image && typeof product.image === 'object' ? (
                <CmsImage media={product.image} size="large" className="mx-auto max-h-[380px] w-auto object-contain" sizes="(min-width: 1024px) 40vw, 100vw" priority />
              ) : (
                <div className="flex h-64 items-center justify-center text-navy-100">
                  <FileText className="h-16 w-16" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section nav */}
      <div className="sticky top-16 z-30 border-b border-line bg-white/95 backdrop-blur lg:top-[72px]">
        <nav className="container-x flex gap-1 overflow-x-auto py-2 text-sm" aria-label="Product sections">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="shrink-0 rounded-md px-3 py-1.5 font-medium text-ink-soft hover:bg-navy-50 hover:text-navy-900">
              {s.label}
            </a>
          ))}
          <Link href={quoteHref} className="btn-primary btn-sm ml-auto shrink-0">
            Request a quote
          </Link>
        </nav>
      </div>

      {/* Overview */}
      <section id="overview" className="section scroll-mt-32">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="heading-2">Overview</h2>
            <RichText data={product.description} className="mt-5" />
            {product.useCases?.length ? (
              <>
                <h3 className="heading-3 mt-10">Typical use cases</h3>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {product.useCases.map((u) => (
                    <li key={u.id} className="flex gap-2 text-sm text-ink-soft">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" /> {u.text}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
          <aside className="lg:col-span-5">
            {product.keyFeatures?.length ? (
              <div className="card p-6">
                <h3 className="heading-3">Key features</h3>
                <ul className="mt-4 space-y-3">
                  {product.keyFeatures.map((f) => (
                    <li key={f.id} className="flex gap-3 text-sm text-ink-soft">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                        <Check className="heading-3 w-3" />
                      </span>
                      {f.text}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {applications.length ? (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Applications</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {applications.map((a) => (
                    <Link key={a.id} href={`/applications/${a.slug}`} className="chip hover:border-teal-400 hover:text-teal-600">
                      {a.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
            {product.gallery?.length ? (
              <div className="mt-5 grid grid-cols-3 gap-2">
                {product.gallery.map((g, i) => (
                  <div key={i} className="overflow-hidden rounded-lg border border-line bg-white">
                    <CmsImage media={g} size="thumbnail" className="aspect-square w-full object-contain p-2" sizes="120px" />
                  </div>
                ))}
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {/* Grades */}
      {grades.length ? (
        <section id="grades" className="section scroll-mt-32 bg-surface-2">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="heading-2">Grades</h2>
                <p className="mt-2 max-w-2xl text-ink-soft">Same ligand chemistry on the same cross-linked agarose backbone; the bead size sets flow velocity and resolution. Not sure which grade? Ask our scientists.</p>
              </div>
              <Link href="/technology" className="text-sm font-semibold text-navy-900 hover:text-teal-600">
                How the particle platform works →
              </Link>
            </div>
            <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
              <table className="spec-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    {grades.map((g) => (
                      <th key={g.id}>{g.label || `${product.name} ${GRADE_SHORT[g.grade] ?? g.grade}`}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hasGradeRow('particleSizeRange') ? <GradeRow label="Particle size range" grades={grades} k="particleSizeRange" /> : null}
                  {hasGradeRow('d50') ? <GradeRow label="Particle size, d50V" grades={grades} k="d50" /> : null}
                  {hasGradeRow('maxFlowVelocity') ? <GradeRow label="Max linear flow velocity" grades={grades} k="maxFlowVelocity" /> : null}
                  {hasGradeRow('dynamicBindingCapacity') ? <GradeRow label="Dynamic binding capacity" grades={grades} k="dynamicBindingCapacity" /> : null}
                  {hasGradeRow('pressureFlow') ? <GradeRow label="Pressure / flow specification" grades={grades} k="pressureFlow" /> : null}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}

      {/* Specifications */}
      {product.specs?.length || product.chemistry?.ligand ? (
        <section id="specifications" className="section scroll-mt-32">
          <div className="container-x">
            <h2 className="heading-2">Specifications</h2>
            <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
              <table className="spec-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>{product.name}</th>
                    {product.specs?.some((s) => s.marketSpec) ? <th>Typical market specification</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {product.chemistry?.functionalType ? (
                    <tr>
                      <td>Type</td>
                      <td>{product.chemistry.functionalType}</td>
                      {product.specs?.some((s) => s.marketSpec) ? <td /> : null}
                    </tr>
                  ) : null}
                  {product.chemistry?.ligand ? (
                    <tr>
                      <td>Ligand</td>
                      <td>{product.chemistry.ligand}</td>
                      {product.specs?.some((s) => s.marketSpec) ? <td /> : null}
                    </tr>
                  ) : null}
                  {product.chemistry?.matrix ? (
                    <tr>
                      <td>Matrix</td>
                      <td>{product.chemistry.matrix}</td>
                      {product.specs?.some((s) => s.marketSpec) ? <td /> : null}
                    </tr>
                  ) : null}
                  {product.specs?.map((s) => (
                    <tr key={s.id}>
                      <td>{s.parameter}</td>
                      <td>{s.value}</td>
                      {product.specs?.some((x) => x.marketSpec) ? <td className="text-muted">{s.marketSpec}</td> : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted">Specifications are typical values from our technical datasheets and may be updated as products are revised. Request the current datasheet and certificate of analysis for lot-specific data.</p>
          </div>
        </section>
      ) : null}

      {/* Ordering */}
      <section id="ordering" className="section scroll-mt-32 bg-surface-2">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="heading-2">Ordering</h2>
            <p className="mt-2 text-ink-soft">Pricing is by quotation and depends on grade, volume and destination. Bulk and custom volumes are available{product.bulkAvailable ? '' : ' on request'}.</p>
            {product.packSizes?.length ? (
              <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-2/70 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                      <th className="px-4 py-3">Pack size</th>
                      <th className="px-4 py-3">Grade</th>
                      <th className="px-4 py-3">Catalog no.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.packSizes.map((ps) => (
                      <tr key={ps.id} className="border-t border-line">
                        <td className="px-4 py-2.5 font-medium text-navy-900">{ps.size}</td>
                        <td className="px-4 py-2.5 text-ink-soft">{ps.grade ? GRADE_SHORT[ps.grade] ?? ps.grade : '—'}</td>
                        <td className="px-4 py-2.5 font-mono text-xs text-ink-soft">{ps.catalogNumber || 'On request'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
          <div className="lg:col-span-5">
            <div className="card p-6">
              <h3 className="heading-3">Get a quotation</h3>
              <KeyValue
                className="mt-4"
                items={[
                  { label: 'Lead time', value: product.leadTime || settings.leadTime || '2–3 weeks ex-works' },
                  { label: 'Response', value: settings.responseTime || '1–2 business days' },
                  { label: 'Documentation', value: 'Datasheet, CoA on request' },
                  { label: 'Shipping', value: settings.globalStatement ? 'Worldwide' : 'Worldwide' },
                ]}
              />
              <div className="mt-5 grid gap-2">
                <ButtonLink href={quoteHref}>Request a quote</ButtonLink>
                <ButtonLink href={`/request-quote?type=evaluation&product=${product.id}`} appearance="secondary">
                  Discuss an evaluation
                </ButtonLink>
              </div>
              {settings.email ? (
                <p className="mt-4 text-xs text-muted">
                  Prefer email? Write to{' '}
                  <a href={`mailto:${settings.email}?subject=${encodeURIComponent(`Quote request: ${product.name}`)}`} className="font-medium text-navy-900 hover:underline">
                    {settings.email}
                  </a>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Documents */}
      <section id="documents" className="section scroll-mt-32">
        <div className="container-x">
          <h2 className="heading-2">Documents</h2>
          {docs.length ? (
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {docs.map((d) => (
                <DocumentRow key={d.id} doc={d} />
              ))}
            </div>
          ) : (
            <p className="mt-3 text-ink-soft">
              The technical datasheet for this product is available on request —{' '}
              <Link href={`/request-quote?type=technical&product=${product.id}`} className="font-medium text-navy-900 underline">
                ask our team
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      {/* FAQ */}
      {faqs.length ? (
        <section id="faq" className="section scroll-mt-32 bg-surface-2">
          <div className="container-x grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="heading-2">Questions</h2>
              <p className="mt-2 text-ink-soft">Common questions about {product.name}.</p>
            </div>
            <div className="lg:col-span-8">
              <FaqList faqs={faqs} />
            </div>
          </div>
        </section>
      ) : null}

      {/* Related */}
      {related.length ? (
        <section className="section">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="heading-2">Related products</h2>
              <Link href={`/compare?p=${[product.slug, ...related.map((r) => r.slug)].join('&p=')}`} className="inline-flex items-center gap-1 text-sm font-semibold text-navy-900 hover:text-teal-600">
                Compare side by side <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <ProductCard key={r.id} product={r} compact />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <JsonLd data={[productJsonLd(product), breadcrumbJsonLd(crumbs.map((c) => ({ name: c.label, href: c.href ?? `/products/${slug}` }))), ...(faqs.length ? [faqJsonLd(faqs)] : [])]} />
    </>
  )
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-white/50">{k}</dt>
      <dd className="mt-0.5 font-medium text-white">{v}</dd>
    </div>
  )
}

function GradeRow({ label, grades, k }: { label: string; grades: NonNullable<Product['grades']>; k: keyof NonNullable<Product['grades']>[number] }) {
  return (
    <tr>
      <td>{label}</td>
      {grades.map((g) => (
        <td key={g.id}>{(g[k] as string) || '—'}</td>
      ))}
    </tr>
  )
}

