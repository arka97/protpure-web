import Link from 'next/link'
import * as React from 'react'
import { ArrowRight, Quote } from 'lucide-react'
import { RichText } from '@/components/RichText'
import { Badge, ButtonLink, CmsImage, CmsLinks, Icon, SectionHeader } from '@/components/ui'
import { ApplicationCard, CategoryCard, DocumentRow, ProductCard, ServiceCard } from '@/components/product/cards'
import { FaqList } from '@/components/FaqList'
import { UpdateCard } from '@/components/UpdateCard'
import { PostCard } from '@/components/PostCard'
import { ResinSelector } from '@/components/product/ResinSelector'
import { InquiryForm } from '@/components/forms/InquiryForm'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { getApplications, getCategories, getDocuments, getFaqs, getPosts, getProducts, getServices, getSiteSettings, getTeam, getTestimonials, getUpdates } from '@/lib/data'
import { cn, resolveLink } from '@/lib/utils'
import type { Page, Product, ProductCategory, Team, Testimonial } from '@/payload-types'

type Block = NonNullable<Page['layout']>[number]

export async function RenderBlocks({ blocks }: { blocks?: Page['layout'] | null }) {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((b, i) => (
        <React.Fragment key={b.id ?? i}>
          <RenderBlock block={b} index={i} />
        </React.Fragment>
      ))}
    </>
  )
}

async function RenderBlock({ block }: { block: Block; index: number }) {
  switch (block.blockType) {
    case 'richText':
      return (
        <section className="section-tight">
          <div className={cn('container-x', block.width === 'narrow' && 'max-w-3xl')}>
            <RichText data={block.content} />
          </div>
        </section>
      )

    case 'stats': {
      const dark = block.style === 'dark'
      return (
        <section className={cn(dark ? 'bg-navy-900 text-white' : 'bg-surface-2', 'py-12')}>
          <div className="container-x">
            {block.heading ? <h2 className={cn('heading-3 mb-8', dark && 'text-white')}>{block.heading}</h2> : null}
            <dl className={cn('grid gap-6 sm:grid-cols-2', (block.items?.length ?? 0) >= 3 && 'lg:grid-cols-3', (block.items?.length ?? 0) >= 4 && 'lg:grid-cols-4')}>
              {block.items?.map((it) => (
                <div key={it.id} className={cn('rounded-xl border p-5', dark ? 'border-white/10 bg-white/5' : 'border-line bg-white')}>
                  <dd className={cn('font-display text-3xl font-bold', dark ? 'text-teal-300' : 'text-navy-900')}>{it.value}</dd>
                  <dt className={cn('mt-1 text-sm font-medium', dark ? 'text-white/85' : 'text-ink')}>{it.label}</dt>
                  {it.note ? <p className={cn('mt-1 text-xs', dark ? 'text-white/55' : 'text-muted')}>{it.note}</p> : null}
                </div>
              ))}
            </dl>
          </div>
        </section>
      )
    }

    case 'featureGrid': {
      const cols = { '2': 'sm:grid-cols-2', '3': 'sm:grid-cols-2 lg:grid-cols-3', '4': 'sm:grid-cols-2 lg:grid-cols-4' }[block.columns ?? '3']
      return (
        <section className="section">
          <div className="container-x">
            <SectionHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
            <div className={cn('mt-10 grid gap-5', cols)}>
              {block.items?.map((it, i) => {
                const link = resolveLink(it.link)
                const body = (
                  <>
                    {block.numbered ? (
                      <span className="font-display text-2xl font-bold text-teal-500">{String(i + 1).padStart(2, '0')}</span>
                    ) : (
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                        <Icon name={it.icon} className="h-5.5 w-5.5" />
                      </span>
                    )}
                    <h3 className="mt-4 font-display text-lg font-bold text-navy-900">{it.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{it.text}</p>
                    {link && link.href !== '#' ? (
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-600">
                        {link.label} <ArrowRight className="h-4 w-4" />
                      </span>
                    ) : null}
                  </>
                )
                return link && link.href !== '#' ? (
                  <Link key={it.id} href={link.href} className="card-hover flex flex-col p-6">
                    {body}
                  </Link>
                ) : (
                  <div key={it.id} className="card flex flex-col p-6">
                    {body}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )
    }

    case 'twoColumn': {
      const left = block.imagePosition === 'left'
      return (
        <section className="section">
          <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className={cn(left && 'lg:order-2')}>
              <SectionHeader eyebrow={block.eyebrow} heading={block.heading} />
              <RichText data={block.content} className="mt-5" />
              {block.facts?.length ? (
                <dl className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  {block.facts.map((f) => (
                    <div key={f.id} className="border-l-2 border-teal-400 pl-3">
                      <dt className="text-xs uppercase tracking-wide text-muted">{f.label}</dt>
                      <dd className="text-sm font-medium text-ink">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              <CmsLinks links={block.links} className="mt-8" />
            </div>
            <div className={cn(left && 'lg:order-1')}>
              {block.image && typeof block.image === 'object' ? (
                <div className="overflow-hidden rounded-2xl shadow-card">
                  <CmsImage media={block.image} size="large" className="h-auto w-full object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )
    }

    case 'comparisonTable':
      return (
        <section className="section bg-surface-2">
          <div className="container-x">
            <SectionHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
            <div className="mt-10 overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-surface-2/70 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                    <th className="px-5 py-4">Parameter</th>
                    <th className="px-5 py-4">{block.columnA}</th>
                    <th className="px-5 py-4 text-teal-600">{block.columnB}</th>
                  </tr>
                </thead>
                <tbody>
                  {block.rows?.map((r) => (
                    <tr key={r.id} className="border-b border-line last:border-0">
                      <td className="px-5 py-3.5 font-medium text-navy-900">{r.parameter}</td>
                      <td className="px-5 py-3.5 text-ink-soft">{r.a}</td>
                      <td className="px-5 py-3.5 font-medium text-ink">{r.b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {block.note ? <p className="mt-4 text-xs text-muted">{block.note}</p> : null}
          </div>
        </section>
      )

    case 'gradesPlatform':
      return (
        <section className="section hex-bg text-white">
          <div className="container-x">
            <SectionHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} onDark />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {block.grades?.map((g, i) => (
                <div key={g.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold">{g.name}</h3>
                    {g.badge ? <Badge tone="onDark">{g.badge}</Badge> : null}
                  </div>
                  <BeadVisual index={i} total={block.grades?.length ?? 4} />
                  <dl className="mt-4 space-y-2 text-sm">
                    {g.d50 ? <Row k="Bead d50V" v={g.d50} /> : null}
                    {g.sizeRange ? <Row k="Size range" v={g.sizeRange} /> : null}
                    {g.maxFlow ? <Row k="Linear flow" v={g.maxFlow} /> : null}
                    {g.pressure ? <Row k="Pressure" v={g.pressure} /> : null}
                  </dl>
                  {g.text ? <p className="mt-4 text-sm leading-relaxed text-white/70">{g.text}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      )

    case 'resinSelector': {
      const [cats, products] = await Promise.all([getCategories(), getProducts()])
      return (
        <section className="section">
          <div className="container-x">
            <SectionHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
            <div className="mt-10">
              <ResinSelector categories={cats.map((c) => ({ slug: c.slug!, name: c.name, mode: c.mode ?? null }))} products={products.map(slimProduct)} />
            </div>
          </div>
        </section>
      )
    }

    case 'productCategories': {
      const [cats, products] = await Promise.all([getCategories(), getProducts()])
      const counts = new Map<number, number>()
      for (const p of products) counts.set((p.category as ProductCategory).id, (counts.get((p.category as ProductCategory).id) ?? 0) + 1)
      return (
        <section className="section">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
              <ButtonLink href="/products" appearance="secondary">
                View full catalog <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
            <div className={cn('mt-10 grid gap-5 sm:grid-cols-2', cats.length % 4 === 0 ? 'lg:grid-cols-4' : 'lg:grid-cols-3')}>
              {cats.map((c) => (
                <CategoryCard key={c.id} category={c} count={counts.get(c.id) ?? 0} />
              ))}
            </div>
          </div>
        </section>
      )
    }

    case 'featuredProducts': {
      const picked = (block.products ?? []).filter((p): p is Product => typeof p === 'object')
      const products = picked.length ? picked : await getProducts({ featured: true, limit: 8 })
      if (!products.length) return null
      return (
        <section className="section bg-surface-2">
          <div className="container-x">
            <SectionHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          </div>
        </section>
      )
    }

    case 'applicationsGrid': {
      const apps = await getApplications()
      return (
        <section className="section">
          <div className="container-x">
            <SectionHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {apps.map((a) => (
                <ApplicationCard key={a.id} application={a} />
              ))}
            </div>
          </div>
        </section>
      )
    }

    case 'servicesGrid': {
      const services = await getServices()
      return (
        <section className="section bg-surface-2">
          <div className="container-x">
            <SectionHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i} />
              ))}
            </div>
          </div>
        </section>
      )
    }

    case 'documentList': {
      const docs = await getDocuments({ types: block.types ?? undefined, limit: block.limit ?? 12 })
      return (
        <section className="section-tight">
          <div className="container-x">
            <SectionHeader heading={block.heading} intro={block.intro} />
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {docs.map((d) => (
                <DocumentRow key={d.id} doc={d} />
              ))}
            </div>
            <Link href="/resources" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-navy-900 hover:text-teal-600">
              All resources <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )
    }

    case 'latestPosts': {
      const posts = await getPosts({ limit: block.limit ?? 3 })
      if (!posts.docs.length) return null
      return (
        <section className="section">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeader eyebrow={block.eyebrow} heading={block.heading} />
              <ButtonLink href="/blog" appearance="secondary">
                All articles <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {posts.docs.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )
    }

    case 'linkedInFeed': {
      const updates = await getUpdates(block.limit ?? 3)
      const settings = await getSiteSettings()
      if (!updates.length) return null
      return (
        <section className="section bg-surface-2">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
              <div className="flex gap-3">
                <ButtonLink href="/updates" appearance="secondary">
                  All updates
                </ButtonLink>
                {settings.social?.linkedin ? (
                  <ButtonLink href={settings.social.linkedin} appearance="secondary" newTab>
                    Follow on LinkedIn
                  </ButtonLink>
                ) : null}
              </div>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {updates.map((u) => (
                <UpdateCard key={u.id} update={u} />
              ))}
            </div>
          </div>
        </section>
      )
    }

    case 'testimonials': {
      const picked = (block.items ?? []).filter((t): t is Testimonial => typeof t === 'object')
      const items = picked.length ? picked : await getTestimonials()
      if (!items.length) return null
      return (
        <section className="section">
          <div className="container-x">
            <SectionHeader eyebrow={block.eyebrow} heading={block.heading} />
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {items.map((t) => (
                <figure key={t.id} className="card flex h-full flex-col p-6">
                  <Quote className="h-6 w-6 text-teal-400" />
                  <blockquote className="mt-4 flex-1 text-ink-soft">“{t.quote}”</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 text-sm">
                    {t.logo && typeof t.logo === 'object' ? <CmsImage media={t.logo} size="thumbnail" className="h-8 w-auto" /> : null}
                    <div>
                      <p className="font-semibold text-navy-900">{t.person || t.organization}</p>
                      <p className="text-muted">{[t.role, t.person ? t.organization : null, t.country].filter(Boolean).join(' · ')}</p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )
    }

    case 'teamGrid': {
      const picked = (block.members ?? []).filter((t): t is Team => typeof t === 'object')
      const members = picked.length ? picked : await getTeam()
      return (
        <section className="section">
          <div className="container-x">
            <SectionHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {members.map((m) => (
                <div key={m.id} className="card flex gap-5 p-6">
                  {m.photo && typeof m.photo === 'object' ? (
                    <CmsImage media={m.photo} size="thumbnail" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-navy-50 font-display text-2xl font-bold text-navy-800">{m.name.slice(0, 1)}</div>
                  )}
                  <div>
                    <h3 className="font-display text-lg font-bold text-navy-900">{m.name}</h3>
                    <p className="text-sm font-medium text-teal-600">{m.role}</p>
                    <RichText data={m.bio} className="mt-3 text-sm" />
                    {m.linkedinUrl ? (
                      <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-sm font-semibold text-navy-900 hover:text-teal-600">
                        LinkedIn ↗
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    }

    case 'timeline':
      return (
        <section className="section bg-surface-2">
          <div className="container-x">
            <SectionHeader eyebrow={block.eyebrow} heading={block.heading} />
            <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {block.items?.map((it) => (
                <li key={it.id} className="relative border-l-2 border-teal-400 pl-5 md:border-l-0 md:border-t-2 md:pl-0 md:pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">{it.date}</p>
                  <h3 className="mt-1 font-display text-base font-bold text-navy-900">{it.title}</h3>
                  {it.text ? <p className="mt-1.5 text-sm text-ink-soft">{it.text}</p> : null}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )

    case 'faqBlock': {
      const ids = (block.faqs ?? []).map((f) => (typeof f === 'object' ? f.id : f))
      const faqs = await getFaqs(ids.length ? { ids } : { category: block.category ?? 'all' })
      if (!faqs.length) return null
      return (
        <section className="section">
          <div className="container-x grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeader heading={block.heading ?? 'Frequently asked questions'} intro={block.intro} />
            </div>
            <div className="lg:col-span-8">
              <FaqList faqs={faqs} />
            </div>
          </div>
        </section>
      )
    }

    case 'mediaBlock':
      return (
        <section className={cn(block.size === 'full' ? '' : 'section-tight')}>
          <figure className={cn(block.size === 'full' ? '' : 'container-x', block.size === 'narrow' && 'max-w-3xl')}>
            <CmsImage media={block.image} size="large" className={cn('w-full object-cover', block.size !== 'full' && 'rounded-2xl')} sizes="100vw" />
            {block.caption ? <figcaption className="mt-3 text-center text-sm text-muted">{block.caption}</figcaption> : null}
          </figure>
        </section>
      )

    case 'formBlock': {
      const settings = await getSiteSettings()
      const products = block.form === 'newsletter' ? [] : await getProducts()
      return (
        <section className="section" id={block.form === 'newsletter' ? 'newsletter' : 'form'}>
          <div className="container-x grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeader heading={block.heading} intro={block.intro} />
              {block.sidebar ? <RichText data={block.sidebar} className="mt-6 text-sm" /> : null}
            </div>
            <div className="lg:col-span-8">
              {block.form === 'newsletter' ? (
                <div className="card p-6">
                  <NewsletterForm />
                </div>
              ) : (
                <div className="card p-6 sm:p-8">
                  <React.Suspense>
                    <InquiryForm type={block.form} products={products.map((p) => ({ id: p.id, name: p.name, category: (p.category as ProductCategory)?.name ?? 'Products' }))} responseTime={settings.responseTime} allowTypeChange={block.form === 'contact'} />
                  </React.Suspense>
                </div>
              )}
            </div>
          </div>
        </section>
      )
    }

    case 'cta': {
      const style = block.style ?? 'dark'
      return (
        <section className={cn('py-16', style === 'dark' && 'hex-bg text-white', style === 'accent' && 'bg-teal-500 text-white', style === 'light' && 'bg-surface-2')}>
          <div className="container-x flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className={cn('heading-2', style !== 'light' && 'text-white')}>{block.heading}</h2>
              {block.text ? <p className={cn('mt-3 text-lg', style === 'light' ? 'text-ink-soft' : 'text-white/80')}>{block.text}</p> : null}
            </div>
            <CmsLinks links={block.links} onDark={style !== 'light'} />
          </div>
        </section>
      )
    }

    default:
      return null
  }
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-white/10 pb-2">
      <dt className="text-white/60">{k}</dt>
      <dd className="font-medium text-white">{v}</dd>
    </div>
  )
}

/** Decorative bead-size comparison: the further down the list, the smaller the bead. */
function BeadVisual({ index, total }: { index: number; total: number }) {
  const size = 44 - (index * 26) / Math.max(total - 1, 1)
  return (
    <div className="mt-5 flex h-14 items-center justify-center rounded-lg bg-white/5">
      <span className="rounded-full bg-gradient-to-br from-teal-300 to-teal-500 shadow-[0_0_24px_rgba(46,196,182,0.35)]" style={{ width: size, height: size }} aria-hidden />
    </div>
  )
}

export function slimProduct(p: Product) {
  const cat = p.category as ProductCategory
  return { id: p.id, slug: p.slug!, name: p.name, subtitle: p.subtitle ?? null, category: cat?.slug ?? '', categoryName: cat?.name ?? '', ligand: p.chemistry?.ligand ?? null, functionalType: p.chemistry?.functionalType ?? null, grades: (p.grades ?? []).map((g) => g.grade) }
}
