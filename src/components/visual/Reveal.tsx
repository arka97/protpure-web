'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * The one restrained motion in the system: a chapter fades in and rises 12 px (400 ms, ease-out)
 * the first time it enters the viewport. The CSS lives in globals.css (`.reveal` / `.is-visible`) and
 * only hides content when scripting is enabled and the visitor has not asked for reduced motion, so
 * nothing depends on this effect running.
 */
export function Reveal({ children, className, as = 'div', ...rest }: { children: React.ReactNode; className?: string; as?: 'div' | 'section' | 'article' | 'li' } & React.HTMLAttributes<HTMLElement>) {
  const ref = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced || typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('is-visible')
            io.disconnect()
          }
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return React.createElement(as, { ref, className: cn('reveal', className), ...rest }, children)
}
