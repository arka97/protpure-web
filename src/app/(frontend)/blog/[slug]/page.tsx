import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@/components/RichText'
import { LivePreview } from '@/components/LivePreview'
import { ProductCard } from '@/components/product/cards'
import { POST_TAGS } from '@/components/PostCard'
import { Breadcrumbs, CmsImage } from '@/components/ui'
import { getPost } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { articleJsonLd, breadcrumbJsonLd, JsonLd } from '@/lib/jsonld'
import { formatDate } from '@/lib/utils'
import type { Product, Team } from '@/payload-types'



export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return buildMetadata({ meta: post.meta, title: post.title, description: post.excerpt, path: `/blog/${slug}`, image: post.heroImage, type: 'article' })
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()
  const author = post.author as Team | null
  const related = (post.relatedProducts ?? []).filter((p): p is Product => typeof p === 'object')
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.title }]
  return (
    <>
      <LivePreview />
      <article>
        <header className="border-b border-line bg-surface-2">
          <div className="container-x max-w-4xl py-12 sm:py-16">
            <Breadcrumbs items={crumbs} />
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags?.map((t) => (
                <Link key={t} href={`/blog?tag=${t}`} className="chip hover:border-teal-400 hover:text-teal-600">
                  {POST_TAGS[t] ?? t}
                </Link>
              ))}
            </div>
            <h1 className="heading-1 mt-4 text-4xl sm:text-5xl">{post.title}</h1>
            <p className="lede mt-4">{post.excerpt}</p>
            <div className="mt-6 flex items-center gap-3 text-sm text-muted">
              {author?.photo && typeof author.photo === 'object' ? <CmsImage media={author.photo} size="thumbnail" className="h-10 w-10 rounded-full object-cover" /> : null}
              <div>
                {author ? <p className="font-medium text-ink">{author.name}{author.role ? <span className="font-normal text-muted"> · {author.role}</span> : null}</p> : null}
                <p>
                  <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
                </p>
              </div>
            </div>
          </div>
        </header>
        {post.heroImage && typeof post.heroImage === 'object' ? (
          <div className="container-x max-w-5xl py-8">
            <CmsImage media={post.heroImage} size="large" className="w-full rounded-2xl object-cover" sizes="(min-width: 1024px) 60vw, 100vw" priority />
          </div>
        ) : null}
        <div className="container-x max-w-3xl py-10">
          <RichText data={post.content} />
        </div>
      </article>
      {related.length ? (
        <section className="section bg-surface-2">
          <div className="container-x">
            <h2 className="heading-2">Products mentioned</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <JsonLd data={[articleJsonLd(post), breadcrumbJsonLd(crumbs.map((c) => ({ name: c.label, href: c.href ?? `/blog/${slug}` })))]} />
    </>
  )
}
