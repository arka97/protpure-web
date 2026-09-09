import Link from 'next/link'
import { CmsImage } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import type { Post, Team } from '@/payload-types'

const TAG: Record<string, string> = { science: 'Chromatography science', 'application-note': 'Application note', 'case-study': 'Case study', news: 'Company news', events: 'Events', india: 'Manufacturing in India' }

export function PostCard({ post }: { post: Post }) {
  const author = post.author as Team | null
  return (
    <Link href={`/blog/${post.slug}`} className="card-hover group flex h-full flex-col overflow-hidden">
      {post.heroImage && typeof post.heroImage === 'object' ? (
        <div className="relative aspect-[16/9]">
          <CmsImage media={post.heroImage} size="card" fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
        </div>
      ) : (
        <div className="hex-bg aspect-[16/9]" />
      )}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">{post.tags?.[0] ? TAG[post.tags[0]] : 'Article'}</p>
        <h3 className="mt-1.5 font-display text-lg font-bold leading-snug text-navy-900 group-hover:text-teal-600">{post.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{post.excerpt}</p>
        <p className="mt-auto pt-4 text-xs text-muted">
          {formatDate(post.publishedAt)}
          {author ? ` · ${author.name}` : ''}
        </p>
      </div>
    </Link>
  )
}

export { TAG as POST_TAGS }
