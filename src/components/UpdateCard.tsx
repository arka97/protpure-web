'use client'

import * as React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { CmsImage } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import type { Update } from '@/payload-types'

/**
 * Shows the editor-written summary card by default; switches to LinkedIn's official embed on demand
 * so the page loads fast and never depends on LinkedIn being reachable.
 */
export function UpdateCard({ update, embedByDefault }: { update: Update; embedByDefault?: boolean }) {
  const [embed, setEmbed] = React.useState(Boolean(embedByDefault))
  const embedUrl = update.urn ? `https://www.linkedin.com/embed/feed/update/${update.urn}` : null

  return (
    <article className="card flex h-full flex-col overflow-hidden">
      {embed && embedUrl ? (
        <iframe src={embedUrl} title={update.title} className="h-[560px] w-full" loading="lazy" allowFullScreen />
      ) : (
        <>
          {update.image && typeof update.image === 'object' ? (
            <div className="relative aspect-[16/9]">
              <CmsImage media={update.image} size="card" fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
            </div>
          ) : null}
          <div className="flex flex-1 flex-col p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0a66c2]">LinkedIn · {formatDate(update.publishedAt)}</p>
            <h3 className="mt-1.5 font-display text-lg font-bold leading-snug text-navy-900">{update.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{update.summary}</p>
            <div className="mt-auto flex items-center gap-4 pt-4 text-sm font-semibold">
              <a href={update.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-navy-900 hover:text-teal-600">
                View on LinkedIn <ArrowUpRight className="h-4 w-4" />
              </a>
              {embedUrl ? (
                <button type="button" onClick={() => setEmbed(true)} className="text-muted hover:text-navy-900">
                  Show post
                </button>
              ) : null}
            </div>
          </div>
        </>
      )}
    </article>
  )
}
