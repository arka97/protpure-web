'use client'

import * as React from 'react'
import { CmsImage } from '@/components/ui'
import { ArrowUpRightIcon } from '@/components/visual/icons'
import { formatDate } from '@/lib/utils'
import type { Update } from '@/payload-types'

export const UPDATE_KIND_LABELS: Record<string, string> = { 'product-launch': 'Product launch', data: 'Data / performance', milestone: 'Milestone', services: 'Services', perspective: 'Perspective' }

/**
 * LinkedIn update: kind eyebrow, mono dateline, title and the editor's summary. The official
 * LinkedIn embed loads only on request, so the page stays fast and never depends on LinkedIn.
 */
export function UpdateCard({ update, embedByDefault }: { update: Update; embedByDefault?: boolean }) {
  const [embed, setEmbed] = React.useState(Boolean(embedByDefault))
  const embedUrl = update.urn ? `https://www.linkedin.com/embed/feed/update/${update.urn}` : null
  const hasImage = update.image && typeof update.image === 'object'

  return (
    <article className="card flex h-full flex-col" data-block="update">
      {embed && embedUrl ? (
        <iframe src={embedUrl} title={update.title} className="h-[560px] w-full" loading="lazy" allowFullScreen />
      ) : (
        <>
          {hasImage ? (
            <div className="relative m-4 mb-0 aspect-[16/10] overflow-hidden rounded-[2px] bg-surface-recessed">
              <CmsImage media={update.image} size="card" fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" fallbackAlt={update.title} />
            </div>
          ) : null}
          <div className="flex flex-1 flex-col p-5 lg:p-6">
            <p className="flex items-center justify-between gap-3">
              <span className="eyebrow text-[9px] tracking-[0.1em]">{update.kind ? UPDATE_KIND_LABELS[update.kind] ?? update.kind : 'LinkedIn'}</span>
              <time dateTime={update.publishedAt} className="mono text-[11px] text-text-2">
                {formatDate(update.publishedAt)}
              </time>
            </p>
            <h3 className="mt-3 font-display text-[24px] leading-[1.15] tracking-[-0.03em] text-ink lg:text-[27px]">{update.title}</h3>
            <p className="mt-3 text-[13px] leading-[1.6] text-text-2 lg:text-[14px]">{update.summary}</p>
            <div className="mt-auto flex items-center justify-between gap-4 border-t border-rule pt-3.5 text-[12px] font-medium">
              <a href={update.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-1.5 text-ink hover:text-teal-deep">
                View on LinkedIn <ArrowUpRightIcon className="h-4 w-4" />
              </a>
              {embedUrl ? (
                <button type="button" onClick={() => setEmbed(true)} className="min-h-8 text-text-2 hover:text-ink">
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
