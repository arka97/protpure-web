import { CmsImage } from '@/components/ui'
import { Chapter, type ChapterTone } from '@/components/visual/Chapter'
import { DocumentIcon } from '@/components/visual/icons'
import { getCertifications } from '@/lib/data'
import { formatDate } from '@/lib/utils'
import type { TrustBlock, TrustMeta } from './types'

const KIND_LABELS: Record<string, string> = { 'quality-system': 'Quality system', 'product-claim': 'Product claim', regulatory: 'Regulatory', membership: 'Membership', award: 'Award' }
const kindLabel = (kind: string) => KIND_LABELS[kind] ?? kind

const RAIL = 'grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-[75px]'

/**
 * Certifications strip: one hairline-separated row per entry in Company → Certifications & claims
 * (filtered by kind) — kind label in the eyebrow style, name and statement, issuer / validity in
 * mono and the certificate PDF when there is one. Hidden while the collection is empty. It has no
 * eyebrow of its own, so it never takes a chapter number; the heading sits in the left rail.
 */
export async function CertificationsStrip({ block, meta }: { block: TrustBlock<'certificationsStrip'>; meta?: TrustMeta }) {
  const certs = await getCertifications({ kinds: block.kinds, limit: block.limit })
  if (!certs.length) return null
  const tone: ChapterTone = meta?.tone ?? 'light'
  return (
    <Chapter tone={tone} attached={meta?.attached} tight={meta?.tight} data-block="certificationsStrip" id="certifications">
      <div className={RAIL}>
        <div>{block.heading ? <h2 className="serif-md max-w-[320px]">{block.heading}</h2> : null}</div>
        <ul className="border-t border-(--rule-current)">
          {certs.map((c) => {
            const doc = c.document && typeof c.document === 'object' ? c.document : null
            const docUrl = doc?.url ?? null
            const meta = [c.issuer, c.validUntil ? `valid until ${formatDate(c.validUntil)}` : null].filter(Boolean).join(' · ')
            return (
              <li key={c.id} className="grid gap-x-6 gap-y-2 border-b border-(--rule-current) py-5 sm:grid-cols-[130px_minmax(0,1fr)] lg:grid-cols-[150px_minmax(0,1fr)_auto] lg:items-start">
                <span className="eyebrow text-[10px] tracking-[0.12em] sm:pt-[3px]">{kindLabel(c.kind)}</span>
                <div className="flex min-w-0 gap-4">
                  {c.logo && typeof c.logo === 'object' ? <CmsImage media={c.logo} size="thumbnail" className="h-10 w-10 shrink-0 object-contain" fallbackAlt={c.issuer || c.name} /> : null}
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-medium leading-[1.35] lg:text-[16px]">{c.name}</h3>
                    {c.statement ? <p className="mt-1.5 max-w-[560px] text-[12px] leading-[1.6] text-secondary lg:text-[13px]">{c.statement}</p> : null}
                    {meta ? <p className="mono mt-2 text-[11px] text-secondary">{meta}</p> : null}
                  </div>
                </div>
                {doc && docUrl ? (
                  <a href={docUrl} target="_blank" rel="noopener noreferrer" className="text-link self-start text-[12px] sm:col-start-2 lg:col-start-3 lg:mt-[3px]">
                    <DocumentIcon /> {doc.title}
                  </a>
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>
    </Chapter>
  )
}
