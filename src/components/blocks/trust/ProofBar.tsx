import { getSiteSettings } from '@/lib/data'
import { proofItems } from '@/lib/trust'
import { cn } from '@/lib/utils'
import type { TrustBlock } from './types'

const LABELS: Record<string, string> = { founded: 'Founded', team: 'Team', capacity: 'Capacity', customers: 'Customers', linkedin: 'LinkedIn' }

/**
 * One row of company facts from Site settings → Proof points (founded, team size, capacity,
 * customers statement, LinkedIn followers): eyebrow label over a mono figure, hairline-separated.
 * Fields left empty are skipped; nothing set → nothing rendered. Light (recessed) or dark (raised).
 */
export async function ProofBar({ block }: { block: TrustBlock<'proofBar'> }) {
  const settings = await getSiteSettings()
  const items = proofItems(settings.proof, { includeStatement: block.showStatement !== false })
  if (!items.length) return null
  const dark = block.style === 'dark'
  return (
    <section className={cn(dark ? 'surface-raised' : 'surface-recessed')} data-block="proofBar" aria-label="Company facts">
      <div className="container-x">
        <dl className="grid grid-cols-2 gap-x-6 py-2 lg:flex lg:items-stretch lg:py-0">
          {items.map((it) => {
            const statement = it.key === 'customers'
            const value = it.key === 'founded' ? it.value.replace(/^Founded\s+/i, '') : it.key === 'linkedin' ? it.value.replace(/\s*LinkedIn followers$/i, '') : it.value
            return (
              <div
                key={it.key}
                className={cn(
                  'flex flex-col justify-center gap-1 border-b border-(--rule-current) py-4 lg:min-h-[86px] lg:border-b-0 lg:border-r lg:py-5 lg:pr-8 lg:pl-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0',
                  statement ? 'col-span-2 lg:flex-1 lg:min-w-[260px]' : 'lg:shrink-0',
                )}
              >
                <dt className="eyebrow text-[10px] tracking-[0.12em]">{LABELS[it.key] ?? it.key}</dt>
                <dd className={cn(statement ? 'text-[12px] leading-[1.55] text-secondary lg:text-[13px]' : 'mono text-[15px] font-medium leading-[1.4] lg:text-[17px]', statement && 'whitespace-pre-line')}>
                  {value}
                  {it.key === 'linkedin' ? <span className="ml-1.5 font-sans text-[11px] font-normal text-secondary">followers</span> : null}
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
