import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@/components/RichText'
import { LivePreview } from '@/components/LivePreview'
import { PostCard, POST_TAGS } from '@/components/PostCard'
import { ProductCard } from '@/components/product/cards'
import { Breadcrumbs, ButtonLink, CmsImage } from '@/components/ui'
import { Chapter } from '@/components/visual/Chapter'
import { ArrowIcon } from '@/components/visual/icons'
import { getPost, getPosts } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { articleJsonLd, breadcrumbJsonLd, JsonLd } from '@/lib/jsonld'
import { formatDate, mediaAlt } from '@/lib/utils'
import type { Product, Team } from '@/payload-types'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return buildMetadata({ meta: post.meta, title: post.title, description: post.excerpt, path: `/blog/${slug}`, image: post.heroImage, type: 'article' })
}

const initials = (name: string) =>
  name
    .replace(/^(Dr|Mr|Mrs|Ms|Prof)\.?\s+/i, '')
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w) && !/\.$/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()
  const author = post.author && typeof post.author === 'object' ? (post.author as Team) : null
  const related = (post.relatedProducts ?? []).filter((p): p is Product => typeof p === 'object')
  const more = (await getPosts({ limit: 4 })).docs.filter((p) => p.id !== post.id).slice(0, 3)
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.title }]
  const heroImage = post.heroImage && typeof post.heroImage === 'object' ? post.heroImage : null
  return (
    <>
      <LivePreview />
      <article>
        {/* Title block: serif display, tag chips, mono dateline — a 900 px column on the light surface. */}
        <header className="border-b border-rule bg-surface">
          <div className="container-x pb-9 pt-7 lg:pb-12 lg:pt-10">
            <div className="max-w-[900px]">
              <Breadcrumbs items={crumbs} />
              {post.tags?.length ? (
                <ul className="mt-7 flex flex-wrap gap-2 lg:mt-9">
                  {post.tags.map((t) => (
                    <li key={t}>
                      <Link href={`/blog?tag=${t}`} className="chip text-ink hover:border-rule-strong">
                        {POST_TAGS[t] ?? t}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
              <h1 className="heading-2 mt-5">{post.title}</h1>
              {post.excerpt ? <p className="lede mt-5 max-w-[680px] lg:mt-6">{post.excerpt}</p> : null}
              <div className="mt-7 flex items-center gap-4 border-t border-rule pt-5 lg:mt-8">
                {author?.photo && typeof author.photo === 'object' ? (
                  <CmsImage media={author.photo} size="thumbnail" className="h-11 w-11 rounded-full object-cover" fallbackAlt={author.name} />
                ) : author ? (
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dce5df] font-display text-[18px] text-ink" aria-hidden>
                    {initials(author.name)}
                  </span>
                ) : null}
                <p className="mono text-[11px] leading-[1.6] text-text-2 lg:text-[12px]">
                  <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
                  {author ? (
                    <span className="block font-sans text-[13px] text-ink lg:inline lg:text-[12px]">
                      <span className="hidden lg:inline"> · </span>
                      {author.name}
                      {author.role ? <span className="text-text-2"> · {author.role}</span> : null}
                    </span>
                  ) : null}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="container-x">
          {heroImage ? (
            <figure className="max-w-[900px] pt-8 lg:pt-12">
              {/* Landscape photographs fill the column; a portrait one keeps its whole frame at reading height. */}
              {heroImage.height && heroImage.width && heroImage.height > heroImage.width ? (
                <CmsImage media={heroImage} size="large" className="h-auto max-h-[560px] w-auto rounded-[2px] object-contain" sizes="(min-width: 1024px) 400px, 100vw" priority fallbackAlt={post.title} />
              ) : (
                <div className="relative aspect-[16/9] overflow-hidden rounded-[2px] bg-surface-recessed">
                  <CmsImage media={heroImage} size="large" fill className="object-cover" sizes="(min-width: 1024px) 900px, 100vw" priority fallbackAlt={post.title} />
                </div>
              )}
              {heroImage.caption || heroImage.alt ? <figcaption className="mono mt-3 text-[11px] leading-[1.5] text-text-2">{heroImage.caption || mediaAlt(heroImage)}</figcaption> : null}
            </figure>
          ) : null}
          {/* Reading column: 680 px measure, serif h2 / h3, mono captions, tables on .spec-table. */}
          <div className="max-w-[680px] py-10 lg:py-14">
            <RichText data={post.content} />
            <p className="mt-10 border-t border-rule pt-5">
              <Link href="/blog" className="text-link text-[13px]">
                <ArrowIcon className="rotate-180" /> All articles
              </Link>
            </p>
          </div>
        </div>
      </article>

      {related.length ? (
        <Chapter
          id="products"
          tone="recessed"
          eyebrow="Products mentioned"
          heading={related.length === 1 ? 'The resin in this article' : 'The resins in this article'}
          intro="Add the grades and pack sizes you want to evaluate to the RFQ basket; one request covers the whole set."
          aside={
            <ButtonLink href={`/request-quote?${related.map((p) => `product=${p.id}`).join('&')}`} appearance="link">
              Quote these resins <ArrowIcon />
            </ButtonLink>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} compact />
            ))}
          </div>
        </Chapter>
      ) : null}

      {more.length ? (
        <Chapter
          id="more"
          eyebrow="More from the bench"
          heading="Further reading"
          aside={
            <ButtonLink href="/blog" appearance="link">
              All articles <ArrowIcon />
            </ButtonLink>
          }
        >
          <div className="grid gap-4 md:grid-cols-3">
            {more.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </Chapter>
      ) : null}
      <JsonLd data={[articleJsonLd(post), breadcrumbJsonLd(crumbs.map((c) => ({ name: c.label, href: c.href ?? `/blog/${slug}` })))]} />
    </>
  )
}
