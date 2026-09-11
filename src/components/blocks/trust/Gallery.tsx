import { CmsImage, SectionHeader } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Media } from '@/payload-types'
import type { TrustBlock } from './types'

/**
 * Facility / lab / team photo gallery. Renders nothing until the editor adds at least one photo,
 * so the seeded (empty) block on the About page is an invisible slot rather than a placeholder.
 */
export function Gallery({ block }: { block: TrustBlock<'gallery'> }) {
  const items = (block.items ?? []).filter((it): it is typeof it & { image: Media } => Boolean(it.image) && typeof it.image === 'object')
  if (!items.length) return null
  const layout = block.layout ?? 'grid'
  return (
    <section className="section" data-block="gallery">
      <div className="container-x">
        <SectionHeader eyebrow={block.eyebrow} heading={block.heading} />
        <ul
          className={cn(
            'mt-10',
            layout === 'grid' && 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3',
            layout === 'strip' && 'flex snap-x gap-5 overflow-x-auto pb-2',
            layout === 'spread' && 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {items.map((it, i) => (
            <li
              key={it.id ?? i}
              className={cn(
                layout === 'strip' && 'w-[min(80vw,28rem)] shrink-0 snap-start',
                layout === 'spread' && i === 0 && 'sm:col-span-2 sm:row-span-2',
              )}
            >
              <figure className="card overflow-hidden">
                <div className={cn('relative', layout === 'spread' && i === 0 ? 'aspect-[4/3]' : 'aspect-[3/2]')}>
                  <CmsImage media={it.image} size={layout === 'spread' && i === 0 ? 'large' : 'card'} fill className="object-cover" sizes={layout === 'spread' && i === 0 ? '(min-width: 1024px) 66vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'} fallbackAlt={it.caption ?? ''} />
                </div>
                {it.caption || it.label ? (
                  <figcaption className="flex items-start gap-3 p-4 text-sm">
                    {it.label ? <span className="chip shrink-0">{it.label}</span> : null}
                    {it.caption ? <span className="text-ink-soft">{it.caption}</span> : null}
                  </figcaption>
                ) : null}
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
