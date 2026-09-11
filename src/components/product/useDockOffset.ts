'use client'

import * as React from 'react'

/**
 * Bars docked to the bottom of the viewport (the product quote bar, the catalogue compare bar)
 * publish their height as `--dock-offset` on the root element so the floating WhatsApp control in
 * the layout can sit above them instead of being covered. Only one bar is docked per page.
 */
export function useDockOffset(ref: React.RefObject<HTMLElement | null>, active: boolean) {
  React.useEffect(() => {
    const root = document.documentElement
    if (!active) {
      root.style.removeProperty('--dock-offset')
      return
    }
    const el = ref.current
    if (!el) return
    const apply = () => root.style.setProperty('--dock-offset', `${Math.ceil(el.getBoundingClientRect().height)}px`)
    apply()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(apply) : null
    ro?.observe(el)
    return () => {
      ro?.disconnect()
      root.style.removeProperty('--dock-offset')
    }
  }, [ref, active])
}
