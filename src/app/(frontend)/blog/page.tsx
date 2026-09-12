import type { Metadata } from 'next'
import Link from 'next/link'
import { ListingHero } from '@/components/PageHero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { FilterChips } from '@/components/FilterChips'
import { PostCard, POST_TAGS } from '@/components/PostCard'
import { EmptyState } from '@/components/ui'
import { Chapter } from '@/components/visual/Chapter'
import { ArrowIcon, RssIcon } from '@/components/visual/icons'
import { getPage, getPosts } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbJsonLd, JsonLd } from '@/lib/jsonld'
import { cn } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('blog')
  return buildMetadata({ meta: page?.meta, title: 'Blog — notes from the bench', description: page?.hero?.text || 'Technical notes, case studies and news from the Protpure team.', path: '/blog' })
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams
  const tag = typeof sp.tag === 'string' && sp.tag in POST_TAGS ? sp.tag : undefined
  const pageNo = Number(sp.page ?? 1) || 1
  const [page, posts, all] = await Promise.all([getPage('blog'), getPosts({ tag, page: pageNo, limit: 12 }), getPosts({ limit: 200 })])
  // Only tags that have at least one published article become chips; counts are absolute.
  const tags = Object.entries(POST_TAGS).map(([value, label]) => ({ value, label, count: all.docs.filter((p) => p.tags?.includes(value as never)).length })).filter((t) => t.count)
  const pageHref = (n: number) => `/blog?${tag ? `tag=${tag}&` : ''}page=${n}`
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Blog' }]
  return (
    <>
      <ListingHero page={page} fallback={{ eyebrow: 'Blog', title: 'Notes from the bench.', highlight: 'the bench.', text: 'Chromatography science, performance data and news from Dr. Rucha Desai and the Protpure team.' }} breadcrumbs={crumbs} />
      <Chapter id="articles" aria-label="Articles">
        <FilterChips
          label="Filter by topic"
          chips={[{ href: '/blog', label: 'All articles', count: all.totalDocs, active: !tag }, ...tags.map((t) => ({ href: `/blog?tag=${t.value}`, label: t.label, count: t.count, active: tag === t.value }))]}
          trailing={
            <a href="/blog/rss.xml" className="chip ml-auto min-h-11 px-3 text-[12px] text-ink hover:border-rule-strong sm:min-h-9" aria-label="RSS feed">
              <RssIcon className="h-3.5 w-3.5 text-teal-deep" /> RSS
            </a>
          }
        />
        <p className="mono mt-6 border-b border-rule pb-3 text-[11px] text-text-2 lg:text-[12px]">
          {posts.totalDocs} {posts.totalDocs === 1 ? 'article' : 'articles'}
          {tag ? <span className="font-sans"> / {POST_TAGS[tag]}</span> : null}
          {posts.totalPages > 1 ? <span className="font-sans"> / page {posts.page} of {posts.totalPages}</span> : null}
        </p>
        {posts.docs.length ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          <nav className="mt-10 flex items-center justify-between gap-4 border-t border-rule pt-5 text-[13px]" aria-label="Pagination">
            <Link href={pageHref(pageNo - 1)} className={cn('text-link', !posts.hasPrevPage && 'invisible')} aria-disabled={!posts.hasPrevPage}>
              <ArrowIcon className="rotate-180" /> Newer
            </Link>
            <span className="mono text-[11px] text-text-2">
              {String(posts.page).padStart(2, '0')} / {String(posts.totalPages).padStart(2, '0')}
            </span>
            <Link href={pageHref(pageNo + 1)} className={cn('text-link', !posts.hasNextPage && 'invisible')} aria-disabled={!posts.hasNextPage}>
              Older <ArrowIcon />
            </Link>
          </nav>
        ) : null}
      </Chapter>
      <RenderBlocks blocks={page?.layout} />
      <JsonLd data={breadcrumbJsonLd(crumbs.map((c) => ({ name: c.label, href: c.href ?? '/blog' })))} />
    </>
  )
}
