import { getSiteSettings } from '@/lib/data'
import { proofItems } from '@/lib/trust'
import { cn } from '@/lib/utils'
import type { TrustBlock } from './types'

const LABELS: Record<string, string> = { founded: 'Founded', team: 'Team', capacity: 'Capacity', customers: 'Customers', linkedin: 'LinkedIn' }

/**
 * One line of company facts from Site settings → Proof points (founded, team size, capacity,
 * customers statement, LinkedIn followers). Fields left empty are skipped; nothing set → nothing rendered.
 */
export async function ProofBar({ block }: { block: TrustBlock<'proofBar'> }) {
  const settings = await getSiteSettings()
  const items = proofItems(settings.proof, { includeStatement: block.showStatement !== false })
  if (!items.length) return null
  const dark = block.style === 'dark'
  return (
    <section className={cn('py-8', dark ? 'bg-navy-900 text-white' : 'bg-surface-2')} data-block="proofBar">
      <div className="container-x">
        <dl className="flex flex-wrap items-baseline justify-center gap-x-10 gap-y-4 text-center sm:text-left">
          {items.map((it) => (
            <div key={it.key} className={cn('flex flex-col gap-0.5', it.key === 'customers' && 'basis-full sm:basis-auto')}>
              <dt className={cn('eyebrow', dark && 'text-teal-300')}>{LABELS[it.key] ?? it.key}</dt>
              <dd className={cn('text-sm font-medium', dark ? 'text-white/90' : 'text-ink')}>{it.value.replace(/^Founded\s+/i, '')}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
