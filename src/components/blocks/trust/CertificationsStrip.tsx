import { FileText } from 'lucide-react'
import { CmsImage, SectionHeader } from '@/components/ui'
import { getCertifications } from '@/lib/data'
import { formatDate } from '@/lib/utils'
import type { TrustBlock } from './types'

/**
 * Certifications strip: name, issuer and the certificate PDF for each entry in
 * Company → Certifications & claims (filtered by kind). Hidden while the collection is empty.
 */
export async function CertificationsStrip({ block }: { block: TrustBlock<'certificationsStrip'> }) {
  const certs = await getCertifications({ kinds: block.kinds, limit: block.limit })
  if (!certs.length) return null
  return (
    <section className="section-tight" data-block="certificationsStrip">
      <div className="container-x">
        <SectionHeader heading={block.heading} />
        <ul className={block.heading ? 'mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'}>
          {certs.map((c) => {
            const doc = c.document && typeof c.document === 'object' ? c.document : null
            const docUrl = doc?.url ?? null
            return (
              <li key={c.id} className="card flex gap-4 p-5">
                {c.logo && typeof c.logo === 'object' ? (
                  <CmsImage media={c.logo} size="thumbnail" className="h-12 w-12 shrink-0 object-contain" fallbackAlt={c.issuer || c.name} />
                ) : null}
                <div className="min-w-0">
                  <h3 className="font-semibold text-navy-900">{c.name}</h3>
                  <p className="mt-0.5 text-sm text-muted">
                    {[c.issuer, c.validUntil ? `valid until ${formatDate(c.validUntil)}` : null].filter(Boolean).join(' · ') || kindLabel(c.kind)}
                  </p>
                  {c.statement ? <p className="mt-2 text-sm text-ink-soft">{c.statement}</p> : null}
                  {doc && docUrl ? (
                    <a href={docUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-teal-600">
                      <FileText className="h-4 w-4" aria-hidden /> {doc.title}
                    </a>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

const KIND_LABELS: Record<string, string> = { 'quality-system': 'Quality system', 'product-claim': 'Product claim', regulatory: 'Regulatory', membership: 'Membership', award: 'Award' }
const kindLabel = (kind: string) => KIND_LABELS[kind] ?? kind
