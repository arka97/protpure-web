import Link from 'next/link'
import { AddToBasketButton } from '@/components/rfq/AddToBasketButton'
import { CardControls } from './CardControls'
import { CmsImage, StatusBadge } from '@/components/ui'
import { ArrowIcon, DocumentIcon, DownloadIcon, ModeEmblem } from '@/components/visual/icons'
import { GRADE_LABELS, toBasketProduct, type GradeValue } from '@/lib/rfq'
import { cn, formatDate } from '@/lib/utils'
import { cardSpecs, categoryOf, referenceGrade, type CardSpec } from '@/lib/catalog'
import { splitFigure } from '@/lib/figures'
import type { Application, Document, Product, ProductCategory, Service } from '@/payload-types'

const GRADE_SHORT: Record<string, string> = GRADE_LABELS

/** Split a value for the "mono number, sans unit" treatment; text values stay whole and in sans. */
export function figureParts(v: string) {
  const [head, tail] = splitFigure(v)
  const isFigure = Boolean(tail) || /^[\d≈~≥≤<>±]/.test(head)
  return isFigure ? { head, tail, isFigure } : { head: v, tail: '', isFigure }
}

/**
 * Table value: a figure ("≈100 mg lysozyme/mL", "45–165 µm") is set as a mono number with the unit
 * in sans beneath it; text ("Yes", "Stable in 1.0 M NaOH…") stays in sans with tabular numerals.
 */
export function TableFigure({ value, className }: { value?: string | null; className?: string }) {
  if (!value) return <span className="text-text-2">—</span>
  const { head, tail, isFigure } = figureParts(value)
  if (!isFigure) return <span className={cn('num block text-[13px] leading-[1.5] text-inherit', className)}>{value}</span>
  return (
    <span className={cn('block', className)}>
      <span className="mono text-[13px] text-inherit">{head}</span>
      {tail ? <small className="mt-1 block text-[10px] leading-[1.4] text-text-2">{tail}</small> : null}
    </span>
  )
}

/** A scanned figure: the number in mono, the unit / grade qualifier in sans beneath it. */
export function SpecFigure({ spec, className }: { spec: CardSpec; className?: string }) {
  if (spec.missing) return <span className={cn('mono text-[12px] leading-[1.5] text-text-2', className)}>{spec.value}</span>
  const [head, tail] = splitFigure(spec.value)
  const small = [tail, spec.note].filter(Boolean).join(' · ')
  return (
    <span className={className}>
      <span className="mono block text-[12px] font-medium leading-[1.5] text-ink [text-wrap:balance]">{head}</span>
      {small ? <small className="block font-sans text-[10px] font-normal leading-[1.45] text-text-2">{small}</small> : null}
    </span>
  )
}

/** "Sulfopropyl · Strong cation exchanger": a short ligand name in front of the subtitle when it adds something. */
function cardLine(p: Product) {
  const subtitle = p.subtitle || p.chemistry?.functionalType || p.summary || ''
  const ligand = (p.chemistry?.ligand ?? '').replace(/\s*\(.*\)\s*$/, '').trim()
  if (!ligand || ligand.length > 24 || /^none\b/i.test(ligand) || subtitle.toLowerCase().includes(ligand.toLowerCase())) return subtitle
  return `${ligand} · ${subtitle}`
}

/**
 * Product card in the Deep Field system: white card, 2 px corners, category eyebrow + availability
 * word-and-dot, serif title, the two or three scanned specs in mono (DBC, max flow, grades + d50),
 * then grade / pack-size selects, a Compare checkbox and Add to RFQ. `compact` (homepage, blog,
 * application pages) drops the selects and the compare checkbox and keeps one Add to RFQ action.
 */
export function ProductCard({ product, compact }: { product: Product; compact?: boolean }) {
  const cat = categoryOf(product)
  const specs = cardSpecs(product)
  const href = `/products/${product.slug}`
  const basketProduct = toBasketProduct(product)
  // The card is an <article> with a stretched title link (a button cannot live inside an <a>);
  // the controls sit above the stretched link via `relative z-10`.
  return (
    <article className={cn('card-hover group relative flex h-full flex-col px-5 pb-[18px] pt-[22px] focus-within:border-rule-strong', !compact && 'lg:min-h-[393px]')}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="eyebrow truncate text-[9px] tracking-[0.08em]">{cat?.name}</p>
        <StatusBadge status={product.availability} className="text-[10px]" />
      </div>
      <h3 className="font-display text-[29px] leading-[1.08] tracking-[-0.03em] text-ink group-hover:text-teal-deep">
        <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
          {product.name}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-2 min-h-[35px] text-[12px] leading-[1.45] text-text-2">{cardLine(product)}</p>
      <dl className="mb-4 mt-4 grid gap-2.5">
        {specs.map((spec) => (
          <div key={spec.label} className="grid grid-cols-[72px_1fr] gap-2">
            <dt className="text-[10px] leading-[1.5] text-text-2">{spec.label}</dt>
            <dd className="m-0 min-w-0">
              <SpecFigure spec={spec} />
            </dd>
          </div>
        ))}
      </dl>
      {compact ? (
        <div className="relative z-10 mt-auto flex items-center justify-between gap-3 border-t border-rule pt-3.5">
          <span className="inline-flex items-center gap-2 text-[12px] font-medium text-ink">
            Details <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
          <AddToBasketButton product={basketProduct} appearance="teal" size="xs" />
        </div>
      ) : (
        <CardControls product={basketProduct} defaultGrade={(referenceGrade(product.grades)?.grade as GradeValue | undefined) ?? null} />
      )}
    </article>
  )
}

/** Category as a "mode" cell: number + short name, serif title, product line, bead emblem. */
export function CategoryCard({ category, count, index, products }: { category: ProductCategory; count?: number; index?: number; products?: string[] }) {
  const line = products?.length ? products.join(' · ') : category.tagline
  return (
    <Link href={`/products/category/${category.slug}`} className="group grid min-h-[115px] grid-cols-[1fr_44px] gap-x-3 gap-y-1.5 border-b border-r border-rule bg-surface px-[18px] py-[19px] transition-colors hover:bg-surface-recessed lg:min-h-[170px] lg:grid-cols-[1fr_60px] lg:px-[27px] lg:pb-[22px] lg:pt-[25px]">
      <span className="num col-start-1 text-[9px] uppercase tracking-[0.12em] text-teal-deep lg:text-[11px]">
        {typeof index === 'number' ? `${String(index + 1).padStart(2, '0')} / ` : null}
        {category.shortName || category.name}
      </span>
      <h3 className="serif-md col-start-1 text-ink">{category.name}</h3>
      <p className="col-start-1 max-w-[310px] text-[12px] leading-[1.5] text-text-2 lg:text-[13px]">
        {line}
        {typeof count === 'number' && !products?.length ? (
          <>
            {line ? ' · ' : null}
            <span className="num">
              {count} product{count === 1 ? '' : 's'}
            </span>
          </>
        ) : null}
      </p>
      <ModeEmblem icon={category.icon} className="col-start-2 row-span-3 row-start-1 h-[42px] w-[42px] self-center text-teal-deep lg:h-[58px] lg:w-[58px]" />
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
        <h3 className="serif-md text-ink group-hover:text-teal-deep">{application.name}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-text-2">{application.summary}</p>
        {application.workflows?.length ? (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {application.workflows.slice(0, 4).map((w) => (
              <li key={w.id} className="chip text-text-2">
                {w.text}
              </li>
            ))}
          </ul>
        ) : null}
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[13px] font-medium text-ink">
          Explore <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <div className="card flex h-full flex-col p-6">
      <span className="mono block text-[12px] text-teal-deep">{String(index + 1).padStart(2, '0')}</span>
      <h3 className="serif-md mt-3 text-ink">{service.name}</h3>
      {service.tagline ? <p className="mt-1 text-[13px] font-medium text-teal-deep">{service.tagline}</p> : null}
      <p className="mt-3 text-[14px] leading-relaxed text-text-2">{service.summary}</p>
      {service.deliverables?.length ? (
        <ul className="mt-4 space-y-1.5 text-[13px] text-text-2">
          {service.deliverables.map((d) => (
            <li key={d.id} className="flex gap-2.5">
              <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-teal-deep" aria-hidden />
              {d.text}
            </li>
          ))}
        </ul>
      ) : null}
      <Link href={`/services#${service.slug}`} className="text-link mt-auto self-start pt-5 text-[13px]">
        Learn more <ArrowIcon />
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
    <a href={doc.url ?? '#'} target="_blank" rel="noopener noreferrer" className={cn('group flex items-start gap-4 border-b border-t border-rule border-t-rule-strong bg-transparent py-5 transition-colors hover:border-t-ink', className)}>
      <DocumentIcon className="mt-1 h-5 w-5 shrink-0 text-teal-deep" />
      <div className="min-w-0 flex-1">
        <p className="text-[17px] font-medium leading-tight text-ink group-hover:text-teal-deep">{doc.title}</p>
        <p className="mono mt-1.5 text-[11px] text-text-2">
          {DOC_LABEL[doc.type] ?? 'Document'}
          {doc.revision ? ` · ${doc.revision}` : ''}
          {doc.documentDate ? ` · ${formatDate(doc.documentDate, { month: 'short', year: 'numeric' })}` : ''}
          {size ? ` · PDF, ${size}` : ' · PDF'}
        </p>
        {doc.summary ? <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-text-2">{doc.summary}</p> : null}
      </div>
      <DownloadIcon className="mt-1 h-4 w-4 shrink-0 text-text-2 group-hover:text-teal-deep" />
    </a>
  )
}

export { DOC_LABEL, GRADE_SHORT }
