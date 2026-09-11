import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { getPayload, type Payload, type Where } from 'payload'
import config from '@payload-config'
import { publishedWhere } from './catalog'
import type { Application, Faq, Header, Footer, Page, Post, Product, ProductCategory, Service, SiteSetting, Team, Testimonial, Update, Document } from '@/payload-types'

export const getPayloadClient = (): Promise<Payload> => getPayload({ config })

/**
 * Cached read helpers. Every hook in `src/hooks/revalidate.ts` busts the `content` tag plus the
 * collection tag, so cached data never outlives an edit. Draft mode bypasses the cache so editors
 * see unpublished changes in live preview.
 *
 * The local API bypasses access control, so every read of a versioned collection (pages, posts,
 * products) goes through `publishedWhere()` to keep unpublished drafts off the public site, the
 * Markdown/JSON surfaces and the MCP server.
 */
async function isDraft() {
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
}

function cached<T extends unknown[], R>(fn: (...args: T) => Promise<R>, key: string, tags: string[]) {
  return async (...args: T): Promise<R> => {
    if (await isDraft()) return fn(...args)
    return unstable_cache(fn, [key, JSON.stringify(args)], { tags: ['content', ...tags], revalidate: 3600 })(...args)
  }
}

// ---------- Globals ----------
export const getSiteSettings = cached(
  async () => (await getPayloadClient()).findGlobal({ slug: 'site-settings', depth: 1 }) as Promise<SiteSetting>,
  'site-settings',
  ['global:site-settings'],
)
export const getHeader = cached(async () => (await getPayloadClient()).findGlobal({ slug: 'header', depth: 2 }) as Promise<Header>, 'header', ['global:header'])
export const getFooter = cached(async () => (await getPayloadClient()).findGlobal({ slug: 'footer', depth: 2 }) as Promise<Footer>, 'footer', ['global:footer'])

// ---------- Pages ----------
export const getPage = cached(
  async (slug: string) => {
    const payload = await getPayloadClient()
    const draft = await isDraft()
    const res = await payload.find({ collection: 'pages', where: publishedWhere(draft, { slug: { equals: slug } }), limit: 1, depth: 2, draft, overrideAccess: draft, pagination: false })
    return (res.docs[0] as Page | undefined) ?? null
  },
  'page',
  ['pages'],
)

export const getAllPageSlugs = cached(
  async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'pages', where: publishedWhere(false), limit: 500, select: { slug: true, updatedAt: true }, pagination: false })
    return res.docs.map((d) => ({ slug: d.slug as string, updatedAt: d.updatedAt }))
  },
  'page-slugs',
  ['pages'],
)

// ---------- Catalog ----------
export const getCategories = cached(
  async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'product-categories', sort: 'order', limit: 100, depth: 1, pagination: false })
    return res.docs as ProductCategory[]
  },
  'categories',
  ['product-categories'],
)

export const getCategory = cached(
  async (slug: string) => {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'product-categories', where: { slug: { equals: slug } }, limit: 1, depth: 1, pagination: false })
    return (res.docs[0] as ProductCategory | undefined) ?? null
  },
  'category',
  ['product-categories'],
)

export const getProducts = cached(
  async (opts?: { category?: string; featured?: boolean; availability?: string; search?: string; limit?: number }) => {
    const payload = await getPayloadClient()
    const and: Where[] = []
    if (opts?.category) and.push({ 'category.slug': { equals: opts.category } })
    if (opts?.featured) and.push({ featured: { equals: true } })
    if (opts?.availability) and.push({ availability: { equals: opts.availability } })
    if (opts?.search) {
      const s = opts.search
      and.push({ or: [{ name: { like: s } }, { summary: { like: s } }, { subtitle: { like: s } }, { 'chemistry.ligand': { like: s } }] })
    }
    // List query: shallow depth and no heavy detail-only fields, so the cached payload stays small.
    const draft = await isDraft()
    const res = await payload.find({
      collection: 'products',
      where: publishedWhere(draft, ...and),
      sort: ['category', 'order', 'name'],
      limit: opts?.limit ?? 200,
      depth: 1,
      select: { description: false, gallery: false, relatedProducts: false, documents: false, meta: false },
      draft,
      pagination: false,
    })
    return res.docs as Product[]
  },
  'products',
  ['products', 'product-categories', 'documents'],
)

export const getProduct = cached(
  async (slug: string) => {
    const payload = await getPayloadClient()
    const draft = await isDraft()
    const res = await payload.find({ collection: 'products', where: publishedWhere(draft, { slug: { equals: slug } }), limit: 1, depth: 2, draft, overrideAccess: draft, pagination: false })
    return (res.docs[0] as Product | undefined) ?? null
  },
  'product',
  ['products', 'documents', 'faqs'],
)

export const getApplications = cached(
  async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'applications', sort: 'order', limit: 100, depth: 2, pagination: false })
    return res.docs as Application[]
  },
  'applications',
  ['applications', 'products'],
)

export const getApplication = cached(
  async (slug: string) => {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'applications', where: { slug: { equals: slug } }, limit: 1, depth: 2, pagination: false })
    return (res.docs[0] as Application | undefined) ?? null
  },
  'application',
  ['applications', 'products'],
)

export const getServices = cached(
  async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'services', sort: 'order', limit: 100, depth: 1, pagination: false })
    return res.docs as Service[]
  },
  'services',
  ['services'],
)

export const getDocuments = cached(
  async (opts?: { types?: string[]; product?: number; limit?: number; featured?: boolean }) => {
    const payload = await getPayloadClient()
    const and: Where[] = []
    if (opts?.types?.length) and.push({ type: { in: opts.types } })
    if (opts?.product) and.push({ products: { contains: opts.product } })
    if (opts?.featured) and.push({ featured: { equals: true } })
    const res = await payload.find({ collection: 'documents', where: and.length ? { and } : undefined, sort: ['-featured', '-documentDate'], limit: opts?.limit ?? 200, depth: 1, pagination: false })
    return res.docs as Document[]
  },
  'documents',
  ['documents', 'products'],
)

// ---------- Content ----------
export const getPosts = cached(
  async (opts?: { limit?: number; page?: number; tag?: string }) => {
    const payload = await getPayloadClient()
    const draft = await isDraft()
    const where = publishedWhere(draft, opts?.tag ? { tags: { contains: opts.tag } } : undefined)
    const res = await payload.find({ collection: 'posts', where, sort: '-publishedAt', limit: opts?.limit ?? 12, page: opts?.page ?? 1, depth: 2, draft })
    return res
  },
  'posts',
  ['posts', 'team'],
)

export const getPost = cached(
  async (slug: string) => {
    const payload = await getPayloadClient()
    const draft = await isDraft()
    const res = await payload.find({ collection: 'posts', where: publishedWhere(draft, { slug: { equals: slug } }), limit: 1, depth: 2, draft, overrideAccess: draft, pagination: false })
    return (res.docs[0] as Post | undefined) ?? null
  },
  'post',
  ['posts', 'team', 'products'],
)

export const getUpdates = cached(
  async (limit: number = 12) => {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'updates', sort: ['-pinned', '-publishedAt'], limit, depth: 1, pagination: false })
    return res.docs as Update[]
  },
  'updates',
  ['updates'],
)

export const getFaqs = cached(
  async (opts?: { category?: string; product?: number; ids?: number[] }) => {
    const payload = await getPayloadClient()
    const and: Where[] = []
    if (opts?.category && opts.category !== 'all') and.push({ category: { equals: opts.category } })
    if (opts?.product) and.push({ products: { contains: opts.product } })
    if (opts?.ids?.length) and.push({ id: { in: opts.ids } })
    const res = await payload.find({ collection: 'faqs', where: and.length ? { and } : undefined, sort: 'order', limit: 200, depth: 0, pagination: false })
    return res.docs as Faq[]
  },
  'faqs',
  ['faqs'],
)

export const getTeam = cached(
  async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'team', sort: 'order', limit: 50, depth: 1, pagination: false })
    return res.docs as Team[]
  },
  'team',
  ['team'],
)

export const getTestimonials = cached(
  async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'testimonials', sort: 'order', limit: 50, depth: 1, pagination: false })
    return res.docs as Testimonial[]
  },
  'testimonials',
  ['testimonials'],
)
