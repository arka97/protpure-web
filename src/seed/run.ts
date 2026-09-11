/**
 * Seeds the database with Protpure's real catalogue and content. Idempotent: matches existing
 * records by slug / filename / question and updates them. Used by `pnpm seed` (CLI) and by
 * POST /api/seed (production, guarded by SEED_TOKEN).
 *
 * Admin login is created from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD (defaults below — change them!).
 */
import path from 'path'
import fs from 'fs/promises'
import type { Payload } from 'payload'
import { products as seedProducts } from './data/products'
import { applications, categories, faqs, footer, header, services, siteSettings, team } from './data/content'
import { documents, mediaAlts, pages, posts } from './data/pages'

const SEED_DIR = process.env.SEED_DIR || path.resolve(process.cwd(), 'seed')
const ctx = { context: { disableRevalidate: true, skipEmails: true }, overrideAccess: true as const }

type Link = { label: string; slug?: string; href?: string; appearance?: string; description?: string }

export async function runSeed(payload: Payload, opts: { reset?: boolean } = {}) {
  const log = (m: string) => payload.logger.info(`[seed] ${m}`)

  if (opts.reset) {
    for (const c of ['posts', 'pages', 'products', 'documents', 'product-categories', 'applications', 'services', 'faqs', 'team', 'testimonials', 'updates', 'media'] as const) {
      await payload.delete({ collection: c, where: { id: { exists: true } }, ...ctx })
      log(`cleared ${c}`)
    }
  }

  // ---------- Admin user ----------
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@protpure.com'
  const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe-Protpure-2026!'
  const existingUser = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, ...ctx })
  if (!existingUser.docs.length) {
    await payload.create({ collection: 'users', data: { email, password, name: 'Dr. Rucha Desai', roles: ['admin'] }, ...ctx })
    log(`created admin user ${email}`)
  }

  // ---------- Media ----------
  const mediaIds = new Map<string, number>()
  const mediaFiles = (await fs.readdir(path.join(SEED_DIR, 'media'))).filter((f) => /\.(webp|png|jpg|jpeg|svg)$/i.test(f))
  for (const file of mediaFiles) {
    const existing = await payload.find({ collection: 'media', where: { filename: { equals: file } }, limit: 1, ...ctx })
    if (existing.docs[0]) {
      mediaIds.set(file, existing.docs[0].id)
      continue
    }
    const doc = await payload.create({ collection: 'media', data: { alt: mediaAlts[file] ?? file.replace(/[-_]/g, ' ').replace(/\.\w+$/, '') }, filePath: path.join(SEED_DIR, 'media', file), ...ctx })
    mediaIds.set(file, doc.id)
  }
  log(`media: ${mediaIds.size}`)
  const media = (file?: string) => (file ? mediaIds.get(file) : undefined)

  // ---------- Categories ----------
  const categoryIds = new Map<string, number>()
  for (const c of categories) {
    const doc = await upsert(payload, 'product-categories', { slug: { equals: c.slug } }, { ...c, image: undefined })
    categoryIds.set(c.slug, doc.id)
  }
  log(`categories: ${categoryIds.size}`)

  // ---------- Applications (products linked after products exist) ----------
  const applicationIds = new Map<string, number>()
  for (const a of applications) {
    const { products: _p, ...data } = a
    const doc = await upsert(payload, 'applications', { slug: { equals: a.slug } }, { ...data, workflows: a.workflows.map((text) => ({ text })) })
    applicationIds.set(a.slug, doc.id)
  }

  // ---------- Services ----------
  for (const s of services) {
    await upsert(payload, 'services', { slug: { equals: s.slug } }, { ...s, deliverables: s.deliverables.map((text) => ({ text })), idealFor: s.idealFor.map((text) => ({ text })) })
  }
  log(`services: ${services.length}`)

  // ---------- Documents (PDFs) ----------
  const documentIds = new Map<string, number>()
  for (const d of documents) {
    const existing = await payload.find({ collection: 'documents', where: { filename: { equals: d.file } }, limit: 1, ...ctx })
    if (existing.docs[0]) {
      documentIds.set(d.file, existing.docs[0].id)
      continue
    }
    const doc = await payload.create({ collection: 'documents', data: { title: d.title, type: d.type as never, revision: d.revision, documentDate: d.documentDate, featured: Boolean(d.featured), summary: d.summary }, filePath: path.join(SEED_DIR, 'documents', d.file), ...ctx })
    documentIds.set(d.file, doc.id)
  }
  log(`documents: ${documentIds.size}`)

  // ---------- Products (two passes: create, then link related) ----------
  const productIds = new Map<string, number>()
  for (const p of seedProducts) {
    const data = {
      name: p.name,
      slug: p.slug,
      subtitle: p.subtitle,
      category: categoryIds.get(p.category)!,
      availability: p.status ?? 'available',
      featured: Boolean(p.featured),
      order: p.order,
      summary: p.summary,
      description: p.description,
      keyFeatures: p.keyFeatures.map((text) => ({ text })),
      image: media(p.image),
      chemistry: p.chemistry,
      grades: p.grades,
      specs: p.specs,
      useCases: (p.useCases ?? []).map((text) => ({ text })),
      applications: (p.applications ?? []).map((s) => applicationIds.get(s)!).filter(Boolean),
      packSizes: p.packSizes,
      leadTime: p.leadTime ?? '2–3 weeks ex-works',
      bulkAvailable: true,
      documents: (p.documents ?? []).map((f) => documentIds.get(f)!).filter(Boolean),
      _status: 'published',
    }
    const doc = await upsert(payload, 'products', { slug: { equals: p.slug } }, data)
    productIds.set(p.slug, doc.id)
  }
  for (const p of seedProducts) {
    if (!p.related?.length) continue
    await payload.update({ collection: 'products', id: productIds.get(p.slug)!, data: { relatedProducts: p.related.map((s) => productIds.get(s)!).filter(Boolean) }, ...ctx })
  }
  log(`products: ${productIds.size}`)

  // Link documents → products and applications → recommended products
  for (const d of documents) {
    const id = documentIds.get(d.file)
    if (id) await payload.update({ collection: 'documents', id, data: { products: d.products.map((s) => productIds.get(s)!).filter(Boolean) }, ...ctx })
  }
  for (const a of applications) {
    await payload.update({ collection: 'applications', id: applicationIds.get(a.slug)!, data: { recommendedProducts: a.products.map((s) => productIds.get(s)!).filter(Boolean) }, ...ctx })
  }

  // ---------- FAQs ----------
  for (const f of faqs) {
    await upsert(payload, 'faqs', { question: { equals: f.question } }, f)
  }
  // Link a few FAQs to products
  const productFaqs = await payload.find({ collection: 'faqs', where: { category: { in: ['products', 'ordering'] } }, limit: 50, ...ctx })
  for (const f of productFaqs.docs) {
    await payload.update({ collection: 'faqs', id: f.id, data: { products: ['sp-agarose', 'q-agarose', 'deae-agarose', 'ni-nta-agarose'].map((s) => productIds.get(s)!) }, ...ctx })
  }
  log(`faqs: ${faqs.length}`)

  // ---------- Team ----------
  const teamIds = new Map<string, number>()
  for (const t of team) {
    const doc = await upsert(payload, 'team', { name: { equals: t.name } }, t)
    teamIds.set(t.name, doc.id)
  }

  // ---------- Globals ----------
  await payload.updateGlobal({ slug: 'site-settings', data: { ...siteSettings, logo: media('protpure-logo.svg'), ogImage: media('hero-resins-concept.webp') } as never, ...ctx })
  const link = (l: Link) => ({
    type: l.slug ? 'internal' : 'custom',
    label: l.label,
    reference: l.slug ? { relationTo: 'pages', value: 0 } : undefined,
    url: l.href,
    appearance: l.appearance,
    newTab: false,
  })
  log('site settings updated')

  // ---------- Pages ----------
  const pageIds = new Map<string, number>()
  // First pass without links so internal references can resolve to page ids.
  for (const p of pages) {
    const doc = await upsert(payload, 'pages', { slug: { equals: p.slug } }, { title: p.title, slug: p.slug, hero: { style: 'none' }, layout: [], _status: 'published' })
    pageIds.set(p.slug, doc.id)
  }
  const resolveLink = (l: Link) => {
    const base = link(l)
    if (l.slug) base.reference = { relationTo: 'pages', value: pageIds.get(l.slug)! }
    return base
  }
  const resolveLinks = (links?: Link[]) => (links ?? []).map((l) => ({ link: resolveLink(l) }))
  const faqIdByQuestion = new Map((await payload.find({ collection: 'faqs', limit: 200, ...ctx })).docs.map((f) => [f.question, f.id] as const))
  for (const p of pages) {
    const hero = { ...p.hero, image: media((p.hero as { image?: string }).image), links: resolveLinks((p.hero as { links?: Link[] }).links) }
    const layout = p.layout.map((b) => {
      const blk = { ...b } as Record<string, unknown>
      if ('image' in blk && typeof blk.image === 'string') blk.image = media(blk.image)
      if ('secondImage' in blk && typeof blk.secondImage === 'string') blk.secondImage = media(blk.secondImage)
      if ('links' in blk) blk.links = resolveLinks(blk.links as Link[])
      if ('link' in blk && blk.link) blk.link = resolveLink(blk.link as Link)
      if (blk.blockType === 'featureGrid') blk.items = (blk.items as Record<string, unknown>[]).map((it) => ({ ...it, link: it.link ? resolveLink(it.link as Link) : undefined }))
      // Category slugs → ids; FAQ questions → ids (seed data is written by slug / question, not id).
      if (blk.blockType === 'productCategories' && Array.isArray(blk.categories)) blk.categories = (blk.categories as string[]).map((slug) => categoryIds.get(slug)!).filter(Boolean)
      if (blk.blockType === 'faqBlock' && Array.isArray(blk.faqs)) blk.faqs = (blk.faqs as string[]).map((q) => faqIdByQuestion.get(q)!).filter(Boolean)
      return blk
    })
    await payload.update({ collection: 'pages', id: pageIds.get(p.slug)!, data: { hero: hero as never, layout: layout as never, _status: 'published' }, ...ctx })
  }
  log(`pages: ${pages.length}`)

  // Header / footer need page ids
  await payload.updateGlobal({
    slug: 'header',
    data: {
      tagline: header.tagline,
      items: header.items.map((it) => ({ link: resolveLink(it as Link), children: (it.children ?? []).map((c) => ({ link: resolveLink(c as Link), description: c.description })) })),
      cta: { link: resolveLink(header.cta) },
    } as never,
    ...ctx,
  })
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      tagline: footer.tagline,
      columns: footer.columns.map((c) => ({ title: c.title, links: c.links.map((l) => ({ link: resolveLink(l as Link) })) })),
      newsletter: footer.newsletter,
      legalLinks: footer.legalLinks.map((l) => ({ link: resolveLink(l as Link) })),
      bottomText: footer.bottomText,
    } as never,
    ...ctx,
  })
  log('header & footer updated')

  // ---------- Posts ----------
  const author = teamIds.get(team[0].name)
  for (const post of posts) {
    await upsert(payload, 'posts', { slug: { equals: post.slug } }, {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      tags: post.tags,
      publishedAt: post.publishedAt,
      heroImage: media(post.heroImage),
      content: post.content,
      author,
      relatedProducts: post.relatedProducts.map((s) => productIds.get(s)!).filter(Boolean),
      _status: 'published',
    })
  }
  log(`posts: ${posts.length}`)

  log('done ✔')
  return { products: productIds.size, pages: pages.length, media: mediaIds.size, documents: documentIds.size, posts: posts.length }
}

async function upsert(payload: Payload, collection: 'product-categories' | 'applications' | 'services' | 'products' | 'faqs' | 'team' | 'pages' | 'posts', where: Record<string, unknown>, data: Record<string, unknown>) {
  const existing = await payload.find({ collection, where: where as never, limit: 1, ...ctx })
  if (existing.docs[0]) {
    return payload.update({ collection, id: existing.docs[0].id, data: data as never, ...ctx })
  }
  return payload.create({ collection, data: data as never, ...ctx })
}


