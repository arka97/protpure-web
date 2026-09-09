import type { Metadata } from 'next'
import Link from 'next/link'
import { ListingHero } from '@/components/PageHero'
import { PostCard, POST_TAGS } from '@/components/PostCard'
import { EmptyState } from '@/components/ui'
import { getPage, getPosts } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { cn } from '@/lib/utils'


export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('blog')
  return buildMetadata({ meta: page?.meta, title: 'Blog — chromatography science and company news', description: page?.hero?.text || 'Technical notes, case studies and news from the Protpure team.', path: '/blog' })
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams
  const tag = typeof sp.tag === 'string' ? sp.tag : undefined
  const pageNo = Number(sp.page ?? 1) || 1
  const [page, posts] = await Promise.all([getPage('blog'), getPosts({ tag, page: pageNo, limit: 12 })])
  return (
    <>
      <ListingHero page={page} fallback={{ eyebrow: 'Blog', title: 'Notes from the bench', text: 'Chromatography science, performance data and news from Dr. Rucha Desai and the Protpure team.' }} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
      <section className="section-tight">
        <div className="container-x">
          <div className="flex flex-wrap gap-2">
            <Link href="/blog" className={cn('chip', !tag && 'border-navy-900 bg-navy-900 text-white')}>
              All
            </Link>
            {Object.entries(POST_TAGS).map(([v, l]) => (
              <Link key={v} href={`/blog?tag=${v}`} className={cn('chip', tag === v && 'border-navy-900 bg-navy-900 text-white')}>
                {l}
              </Link>
            ))}
            <a href="/blog/rss.xml" className="chip ml-auto">
              RSS
            </a>
          </div>
          {posts.docs.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {posts.docs.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState title="No articles yet" text="Follow us on LinkedIn for the latest updates while we get the first articles ready." />
            </div>
          )}
          {posts.totalPages > 1 ? (
            <nav className="mt-10 flex items-center justify-center gap-2 text-sm" aria-label="Pagination">
              {posts.hasPrevPage ? (
                <Link href={`/blog?${tag ? `tag=${tag}&` : ''}page=${pageNo - 1}`} className="btn-secondary btn-sm">
                  ← Newer
                </Link>
              ) : null}
              <span className="px-3 text-muted">
                Page {posts.page} of {posts.totalPages}
              </span>
              {posts.hasNextPage ? (
                <Link href={`/blog?${tag ? `tag=${tag}&` : ''}page=${pageNo + 1}`} className="btn-secondary btn-sm">
                  Older →
                </Link>
              ) : null}
            </nav>
          ) : null}
        </div>
      </section>
    </>
  )
}
