import { draftMode } from 'next/headers'
import { CmsImage } from '@/components/ui'
import { Chapter, type ChapterTone } from '@/components/visual/Chapter'
import { cn } from '@/lib/utils'
import type { Media } from '@/payload-types'
import type { TrustBlock, TrustMeta } from './types'

/**
 * Facility / lab / team photo gallery in the arch-image treatment. Visitors see nothing until the
 * editor adds at least one photo; in draft mode (admin preview) the empty block shows a dashed
 * placeholder slot so the editor knows where the photos will go.
 */
export async function Gallery({ block, meta }: { block: TrustBlock<'gallery'>; meta?: TrustMeta }) {
  const items = (block.items ?? []).filter((it): it is typeof it & { image: Media } => Boolean(it.image) && typeof it.image === 'object')
  const { isEnabled: isDraft } = await draftMode()
  if (!items.length && !isDraft) return null
  const layout = block.layout ?? 'grid'
  const tone: ChapterTone = meta?.tone ?? 'light'
  return (
    <Chapter tone={tone} number={meta?.number} eyebrow={block.eyebrow} heading={block.heading} attached={meta?.attached} tight={meta?.tight} data-block="gallery" id="gallery">
      {items.length ? (
        <ul
          className={cn(
            layout === 'grid' && 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6',
            layout === 'strip' && 'flex snap-x gap-5 overflow-x-auto pb-2',
            layout === 'spread' && 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6',
          )}
        >
          {items.map((it, i) => {
            const lead = layout === 'spread' && i === 0
            return (
              <li key={it.id ?? i} className={cn(layout === 'strip' && 'w-[min(78vw,24rem)] shrink-0 snap-start', lead && 'sm:col-span-2 sm:row-span-2')}>
                <figure>
                  <div className={cn('arch relative bg-surface-recessed', lead ? 'aspect-[4/3] sm:aspect-[5/4]' : 'aspect-[4/5]')}>
                    <CmsImage
                      media={it.image}
                      size={lead ? 'large' : 'card'}
                      fill
                      className="object-cover"
                      sizes={lead ? '(min-width: 1024px) 66vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
                      fallbackAlt={it.caption ?? ''}
                    />
                  </div>
                  {it.caption || it.label ? (
                    <figcaption className="mt-3 flex items-start justify-between gap-4 text-[11px] leading-[1.5] text-secondary lg:text-[12px]">
                      {it.caption ? <span>{it.caption}</span> : <span />}
                      {it.label ? <span className="eyebrow shrink-0 text-[9px] tracking-[0.12em]">{it.label}</span> : null}
                    </figcaption>
                  ) : null}
                </figure>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="placeholder-slot arch aspect-[4/5] min-h-0 text-[11px]">
              {i === 0 ? '[PHOTO GALLERY — add facility, lab and team photos to this block. Visitors do not see these slots.]' : '[PHOTO SLOT]'}
            </div>
          ))}
        </div>
      )}
    </Chapter>
  )
}
