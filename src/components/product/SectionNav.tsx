'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export type Section = { id: string; label: string }

/** The section whose heading is nearest below the sticky bars is "current" (IntersectionObserver, no scroll handler). */
export function useCurrentSection(ids: string[], topOffset = 160) {
  const [current, setCurrent] = React.useState<string | null>(null)
  React.useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el))
    if (!els.length || typeof IntersectionObserver === 'undefined') return
    const visible = new Map<string, number>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.boundingClientRect.top)
          else visible.delete(e.target.id)
        }
        // Topmost visible section wins; nothing is current while the hero is on screen.
        const top = Array.from(visible.entries()).sort((a, b) => a[1] - b[1])[0]
        setCurrent(top ? top[0] : null)
      },
      { rootMargin: `-${topOffset}px 0px -55% 0px`, threshold: [0, 0.1] },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids, topOffset])
  return current
}

/**
 * Sticky in-page navigation for the product page: 65 px light bar under the masthead with the
 * six anchors (Overview · Grades · Specifications · Ordering · Documents · FAQ) and one action
 * slot on the right. `aria-current` follows the section in view.
 */
export function SectionNav({ sections, children, className }: { sections: Section[]; children?: React.ReactNode; className?: string }) {
  const ids = React.useMemo(() => sections.map((s) => s.id), [sections])
  const current = useCurrentSection(ids)
  return (
    <div className={cn('sticky top-[76px] z-30 border-b border-[#b5c5bc] bg-surface lg:top-[72px]', className)}>
      <div className="container-x flex min-h-[56px] items-center justify-between gap-4 lg:min-h-[65px]">
        <nav aria-label="Product sections" className="-mx-1 flex min-w-0 gap-1 overflow-x-auto py-1 text-[12px] lg:gap-[22px]">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={current === s.id ? 'location' : undefined}
              className={cn('inline-flex min-h-11 shrink-0 items-center border-b-2 px-1 font-medium transition-colors', current === s.id ? 'border-teal-deep text-ink' : 'border-transparent text-text-2 hover:text-ink')}
            >
              {s.label}
            </a>
          ))}
        </nav>
        {children ? <div className="hidden shrink-0 sm:block">{children}</div> : null}
      </div>
    </div>
  )
}
