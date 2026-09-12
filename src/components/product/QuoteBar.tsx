'use client'

import * as React from 'react'
import { AddToBasketButton } from '@/components/rfq/AddToBasketButton'
import { StatusBadge } from '@/components/ui'
import { DownloadIcon } from '@/components/visual/icons'
import { useDockOffset } from './useDockOffset'
import type { BasketProduct } from '@/lib/rfq'
import { cn } from '@/lib/utils'

/**
 * Sticky bottom quote bar on the product page: name · availability · lead time · datasheet ·
 * "Choose grade & add to RFQ". Docked to the bottom edge once the hero (`#heroId`) has scrolled
 * out and until the footer comes into view, sliding in over 160 ms (no motion under
 * `prefers-reduced-motion`). The floating WhatsApp control is lifted above it via `--dock-offset`.
 */
export function QuoteBar({ product, availability, leadTime, datasheetUrl, heroId = 'product-hero' }: { product: BasketProduct; availability?: string | null; leadTime?: string | null; datasheetUrl?: string | null; heroId?: string }) {
  const [shown, setShown] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  useDockOffset(ref, shown)

  // Shown once the hero has scrolled out, hidden again while the footer is on screen so the bar
  // never covers the site footer at the end of the page.
  React.useEffect(() => {
    const hero = document.getElementById(heroId)
    const footer = document.querySelector('footer')
    if (!hero || typeof IntersectionObserver === 'undefined') {
      // No hero to watch (or no observer): show the bar after paint.
      const raf = window.requestAnimationFrame(() => setShown(true))
      return () => window.cancelAnimationFrame(raf)
    }
    let heroOut = false
    let footerIn = false
    const update = () => setShown(heroOut && !footerIn)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === hero) heroOut = !e.isIntersecting && e.boundingClientRect.bottom < 0
          if (e.target === footer) footerIn = e.isIntersecting
        }
        update()
      },
      { threshold: 0 },
    )
    io.observe(hero)
    if (footer) io.observe(footer)
    return () => io.disconnect()
  }, [heroId])

  const needsChoice = product.grades.length > 1 || product.packSizes.length > 1

  return (
    <div
      ref={ref}
      className={cn('surface-raised fixed inset-x-0 bottom-0 z-30 border-t border-rule-dark shadow-bar transition-transform duration-[160ms] ease-out', !shown && 'translate-y-full')}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      inert={!shown || undefined}
    >
      <div className="container-x flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3 lg:py-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium text-surface">{product.name}</p>
          <p className="flex flex-wrap items-center gap-x-2 text-[12px] text-text-2-dark">
            <StatusBadge status={availability} className="text-[12px] font-normal text-teal-lum" />
            {leadTime ? <span className="hidden sm:inline">· {leadTime}</span> : null}
            <span className="hidden lg:inline">· By quotation</span>
          </p>
        </div>
        <div className="flex items-center gap-4 lg:gap-6">
          {datasheetUrl ? (
            <a href={datasheetUrl} target="_blank" rel="noopener noreferrer" className="text-link hidden text-[13px] text-surface sm:inline-flex">
              Datasheet <DownloadIcon />
            </a>
          ) : null}
          <AddToBasketButton product={product} appearance="primary" size="sm" className="min-h-11 lg:min-h-10" label={needsChoice ? 'Choose grade & add to RFQ' : 'Add to RFQ'} />
        </div>
      </div>
    </div>
  )
}
