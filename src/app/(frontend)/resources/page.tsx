import type { Metadata } from 'next'
import Link from 'next/link'
import { ListingHero } from '@/components/PageHero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { DocumentRow, DOC_LABEL } from '@/components/product/cards'
import { PostCard } from '@/components/PostCard'
import { UpdateCard } from '@/components/UpdateCard'
import { ButtonLink, EmptyState } from '@/components/ui'
import { getDocuments, getPage, getPosts, getUpdates } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { cn } from '@/lib/utils'


export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('resources')
  return buildMetadata({ meta: page?.meta, title: 'Resources — datasheets, brochures, case studies', description: page?.hero?.text || 'Download technical datasheets, brochures, performance data and case studies for Protpure agarose chromatography resins.', path: '/resources' })
}

export default async function ResourcesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams
  const type = typeof sp.type === 'string' ? sp.type : undefined
  const [page, docs, posts, updates] = await Promise.all([getPage('resources'), getDocuments({ types: type ? [type] : undefined }), getPosts({ limit: 3 }), getUpdates(3)])
  const types = Object.entries(DOC_LABEL)

  return (
    <>
      <ListingHero page={page} fallback={{ eyebrow: 'Resources', title: 'Technical library', text: 'Datasheets, brochures, performance data and case studies — everything you need to evaluate and qualify Protpure resins.' }} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Resources' }]} />
      <section className="section-tight">
        <div className="container-x">
          <div className="flex flex-wrap gap-2">
            <Link href="/resources" className={cn('chip', !type && 'border-navy-900 bg-navy-900 text-white')}>
              All documents
            </Link>
            {types.map(([v, l]) => (
              <Link key={v} href={`/resources?type=${v}`} className={cn('chip', type === v && 'border-navy-900 bg-navy-900 text-white')}>
                {l}
              </Link>
            ))}
          </div>
          {docs.length ? (
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {docs.map((d) => (
                <DocumentRow key={d.id} doc={d} />
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState title="No documents in this category yet" text="Ask our team and we will send you what you need.">
                <ButtonLink href="/request-quote?type=technical">Request documents</ButtonLink>
              </EmptyState>
            </div>
          )}
        </div>
      </section>
      {posts.docs.length ? (
        <section className="section bg-surface-2">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="heading-2">From the blog</h2>
              <Link href="/blog" className="text-sm font-semibold text-navy-900 hover:text-teal-600">
                All articles →
              </Link>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {posts.docs.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      {updates.length ? (
        <section className="section">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="heading-2">Latest on LinkedIn</h2>
              <Link href="/updates" className="text-sm font-semibold text-navy-900 hover:text-teal-600">
                All updates →
              </Link>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {updates.map((u) => (
                <UpdateCard key={u.id} update={u} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <RenderBlocks blocks={page?.layout} />
    </>
  )
}
