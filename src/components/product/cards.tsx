import Link from 'next/link'
import { ArrowRight, Download, FileText } from 'lucide-react'
import { AddToBasketButton } from '@/components/rfq/AddToBasketButton'
import { Badge, CmsImage, Icon, StatusBadge } from '@/components/ui'
import { GRADE_LABELS, toBasketProduct } from '@/lib/rfq'
import { cn, formatDate } from '@/lib/utils'
import { categoryOf } from '@/lib/catalog'
import type { Application, Document, Product, ProductCategory, Service } from '@/payload-types'

const GRADE_SHORT: Record<string, string> = GRADE_LABELS

export function ProductCard({ product, compact }: { product: Product; compact?: boolean }) {
  const cat = categoryOf(product)
  const grades = (product.grades ?? []).map((g) => GRADE_SHORT[g.grade] ?? g.grade)
  const href = `/products/${product.slug}`
  // The card is an <article> with a stretched title link (a button cannot live inside an <a>);
  // the basket button sits above the stretched link via `relative z-10`.
  return (
    <article className="card-hover group relative flex h-full flex-col overflow-hidden focus-within:shadow-card-hover">
      <Link href={href} className="relative block aspect-[4/3] w-full bg-gradient-to-b from-surface-2 to-white p-6" tabIndex={-1} aria-hidden>
        {product.image && typeof product.image === 'object' ? (
          <CmsImage media={product.image} size="card" className="mx-auto h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
        ) : (
          <div className="flex h-full items-center justify-center text-navy-100">
            <Icon name={cat?.icon} className="h-16 w-16" />
          </div>
        )}
        <div className="absolute left-4 top-4">
          <StatusBadge status={product.availability} />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">{cat?.name}</p>
        <h3 className="mt-1.5 font-display text-lg font-bold text-navy-900 group-hover:text-teal-600">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        {product.subtitle ? <p className="text-sm text-muted">{product.subtitle}</p> : null}
        {!compact ? <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-soft">{product.summary}</p> : null}
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-4">
          {grades.map((g) => (
            <Badge key={g}>{g}</Badge>
          ))}
          <span className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-navy-900">
            Details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
        <div className="relative z-10 mt-4">
          <AddToBasketButton product={toBasketProduct(product)} className="w-full" />
        </div>
      </div>
    </article>
  )
}

export function CategoryCard({ category, count }: { category: ProductCategory; count?: number }) {
  return (
    <Link href={`/products/category/${category.slug}`} className="card-hover group flex h-full flex-col p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
        <Icon name={category.icon} className="h-6 w-6" />
      </div>
      <h3 className="mt-5 font-display text-lg font-bold text-navy-900 group-hover:text-teal-600">{category.name}</h3>
      {category.tagline ? <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{category.tagline}</p> : null}
      <div className="mt-auto flex items-center justify-between pt-5 text-sm">
        {typeof count === 'number' ? <span className="text-muted">{count} product{count === 1 ? '' : 's'}</span> : <span />}
        <span className="inline-flex items-center gap-1 font-semibold text-navy-900">
          Browse <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

export function ApplicationCard({ application }: { application: Application }) {
  return (
    <Link href={`/applications/${application.slug}`} className="card-hover group flex h-full flex-col overflow-hidden">
      {application.image && typeof application.image === 'object' ? (
        <div className="relative aspect-[16/9]">
          <CmsImage media={application.image} size="card" fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-bold text-navy-900 group-hover:text-teal-600">{application.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{application.summary}</p>
        {application.workflows?.length ? (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {application.workflows.slice(0, 4).map((w) => (
              <li key={w.id} className="chip">
                {w.text}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Link>
  )
}

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <div className="card flex h-full flex-col p-6">
      <div className="flex items-center gap-3">
        <span className="font-display text-3xl font-bold text-teal-500/60">{String(index + 1).padStart(2, '0')}</span>
        <h3 className="font-display text-lg font-bold text-navy-900">{service.name}</h3>
      </div>
      {service.tagline ? <p className="mt-1 text-sm font-medium text-teal-600">{service.tagline}</p> : null}
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{service.summary}</p>
      {service.deliverables?.length ? (
        <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
          {service.deliverables.map((d) => (
            <li key={d.id} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
              {d.text}
            </li>
          ))}
        </ul>
      ) : null}
      <Link href={`/services#${service.slug}`} className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-navy-900 hover:text-teal-600">
        Learn more <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

const DOC_LABEL: Record<string, string> = {
  datasheet: 'Datasheet',
  brochure: 'Brochure',
  catalog: 'Catalog',
  'case-study': 'Case study',
  'application-note': 'Application note',
  'performance-data': 'Performance data',
  poster: 'Poster',
  presentation: 'Presentation',
  certificate: 'Certificate',
  other: 'Document',
}

export function DocumentRow({ doc, className }: { doc: Document; className?: string }) {
  const size = doc.filesize ? `${(doc.filesize / 1024 / 1024).toFixed(1)} MB` : ''
  return (
    <a href={doc.url ?? '#'} target="_blank" rel="noopener noreferrer" className={cn('group flex items-start gap-4 rounded-xl border border-line bg-white p-4 transition hover:border-teal-400 hover:shadow-card', className)}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-800">
        <FileText className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-navy-900 group-hover:text-teal-600">{doc.title}</p>
        <p className="mt-0.5 text-xs text-muted">
          {DOC_LABEL[doc.type] ?? 'Document'}
          {doc.revision ? ` · ${doc.revision}` : ''}
          {doc.documentDate ? ` · ${formatDate(doc.documentDate, { month: 'short', year: 'numeric' })}` : ''}
          {size ? ` · PDF, ${size}` : ' · PDF'}
        </p>
        {doc.summary ? <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">{doc.summary}</p> : null}
      </div>
      <Download className="mt-2 h-4 w-4 shrink-0 text-muted group-hover:text-teal-600" />
    </a>
  )
}

export { DOC_LABEL, GRADE_SHORT }
