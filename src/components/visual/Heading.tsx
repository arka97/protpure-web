import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * CMS heading text: `*asterisks*` italicise a short proposition in the accent shade ("Four bead
 * sizes. *One chemistry.*") and typed line breaks are deliberate breaks (segments still wrap
 * naturally when narrow). Used by the page blocks, listing chapters and status pages alike.
 */
export function Heading({ text, dark }: { text?: string | null; dark?: boolean }) {
  if (!text) return null
  const parts = text.trim().split(/(\*[^*]+\*|\n)/g).filter(Boolean)
  return (
    <>
      {parts.map((p, i) =>
        p === '\n' ? (
          <br key={i} />
        ) : p.startsWith('*') && p.endsWith('*') ? (
          <em key={i} className={cn('italic', dark ? 'text-teal-lum' : 'text-teal-deep')}>
            {p.slice(1, -1)}
          </em>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        ),
      )}
    </>
  )
}
