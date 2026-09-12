import Link from 'next/link'
import { cn } from '@/lib/utils'

export type FilterChip = { href: string; label: string; count?: number; active?: boolean }

/**
 * One row of filter chips for listing routes (document type, post tag): the active chip is filled
 * in ink with its count in luminous teal, the others hairline chips; 44 px targets on phones.
 */
export function FilterChips({ chips, label, className, trailing }: { chips: FilterChip[]; label: string; className?: string; trailing?: React.ReactNode }) {
  return (
    <nav className={cn('flex flex-wrap items-center gap-2', className)} aria-label={label}>
      {chips.map((c) => (
        <Link key={c.href} href={c.href} className={cn('chip min-h-11 px-3 text-[12px] sm:min-h-9', c.active ? 'border-ink bg-ink text-white' : 'text-ink hover:border-rule-strong')} aria-current={c.active ? 'page' : undefined}>
          {c.label}
          {c.count != null ? <span className={cn('mono text-[10px]', c.active ? 'text-teal-lum' : 'text-text-2')}>{c.count}</span> : null}
        </Link>
      ))}
      {trailing}
    </nav>
  )
}
