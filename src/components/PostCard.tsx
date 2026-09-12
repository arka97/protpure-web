import Link from 'next/link'
import { CmsImage } from '@/components/ui'
import { ArrowIcon } from '@/components/visual/icons'
import { formatDate } from '@/lib/utils'
import type { Post, Team } from '@/payload-types'

const TAG: Record<string, string> = { science: 'Chromatography science', 'application-note': 'Application note', 'case-study': 'Case study', news: 'Company news', events: 'Events', india: 'Manufacturing in India' }

/**
 * Article card: tag eyebrow, serif title, excerpt and a mono dateline. The hero image sits in a
 * short arch when there is one; without it the card is text only (no decorative filler).
 */
export function PostCard({ post }: { post: Post }) {
  const author = post.author as Team | null
  const hasImage = post.heroImage && typeof post.heroImage === 'object'
  return (
    <article className="card-hover group relative flex h-full flex-col">
      {hasImage ? (
        <div className="arch relative m-4 mb-0 aspect-[16/10] bg-surface-recessed">
          <CmsImage media={post.heroImage} size="card" fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" fallbackAlt={post.title} />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5 lg:p-6">
        <p className="eyebrow text-[9px] tracking-[0.1em]">{post.tags?.[0] ? TAG[post.tags[0]] : 'Article'}</p>
        <h3 className="mt-3 font-display text-[26px] leading-[1.1] tracking-[-0.03em] text-ink group-hover:text-teal-deep lg:text-[29px]">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-[13px] leading-[1.6] text-text-2 lg:text-[14px]">{post.excerpt}</p>
        <p className="mono mt-auto flex items-center justify-between gap-4 border-t border-rule pt-3.5 text-[11px] text-text-2">
          <span>
            <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
            {author ? <span className="font-sans"> · {author.name}</span> : null}
          </span>
          <ArrowIcon className="h-4 w-4 shrink-0 text-ink transition-transform group-hover:translate-x-0.5" />
        </p>
      </div>
    </article>
  )
}

export { TAG as POST_TAGS }
