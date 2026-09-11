import { z } from 'zod'
import type { Payload } from 'payload'
import { INQUIRY_TYPES } from '@/collections/Inquiries'
import { GRADE_VALUES, MAX_BASKET_ITEMS, MAX_ITEM_QUANTITY, PURPOSE_VALUES } from '@/lib/rfq'

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(''))

/**
 * One requested line. Website callers send `productId` + `productName` (basket snapshot); API and
 * MCP callers may send `productId`, `productSlug` and/or a free-text `productName`. At least one
 * of the three is required; the server resolves the product and takes its current name.
 */
export const inquiryItemSchema = z
  .object({
    productId: z.coerce.number().int().positive().optional(),
    productSlug: optionalText(120),
    productName: optionalText(200),
    grade: z.enum(GRADE_VALUES).optional().or(z.literal('')),
    packSize: optionalText(80),
    catalogNumber: optionalText(80),
    quantity: z.coerce.number().int().min(1).max(MAX_ITEM_QUANTITY).default(1),
    purpose: z.enum(PURPOSE_VALUES).default('production'),
    notes: optionalText(300),
  })
  .refine((i) => i.productId || i.productSlug || i.productName, { message: 'Each item needs a productId, productSlug or productName', path: ['productName'] })

export type InquiryItemInput = z.infer<typeof inquiryItemSchema>

export const inquirySchema = z.object({
  type: z.enum(INQUIRY_TYPES.map((t) => t.value) as [string, ...string[]]),
  name: z.string().trim().min(2, 'Please enter your name').max(120),
  email: z.string().trim().email('Please enter a valid email address').max(200),
  organization: optionalText(200),
  jobTitle: optionalText(120),
  phone: optionalText(40),
  country: optionalText(80),
  /** Structured line items (preferred). */
  items: z.array(inquiryItemSchema).max(MAX_BASKET_ITEMS, `At most ${MAX_BASKET_ITEMS} items per request`).optional(),
  /** Legacy: bare product ids without grade/pack/quantity. Still accepted; merged into `products`. */
  productIds: z.array(z.coerce.number().int().positive()).max(30).optional(),
  requestedItems: optionalText(2000),
  application: optionalText(500),
  message: optionalText(5000),
  consent: z.boolean().optional(),
  pageUrl: z.string().max(500).optional().or(z.literal('')),
})

export type InquiryInput = z.infer<typeof inquirySchema>

/** Small in-memory limiter: N submissions per key per window. Good enough for a single-node deploy. */
const buckets = new Map<string, number[]>()
export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now()
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs)
  if (hits.length >= limit) return false
  hits.push(now)
  buckets.set(key, hits)
  if (buckets.size > 5000) buckets.clear()
  return true
}

type ResolvedItem = {
  product?: number
  productName: string
  grade?: (typeof GRADE_VALUES)[number]
  packSize?: string
  catalogNumber?: string
  quantity: number
  purpose: (typeof PURPOSE_VALUES)[number]
  notes?: string
}

/**
 * Turn submitted items into stored lines: look the products up by id or slug (published only), use
 * the catalogue name as the snapshot, and keep unknown products as free-text lines.
 */
export async function resolveItems(payload: Payload, items: InquiryItemInput[] | undefined): Promise<ResolvedItem[]> {
  if (!items?.length) return []
  const ids = Array.from(new Set(items.map((i) => i.productId).filter((x): x is number => typeof x === 'number')))
  const slugs = Array.from(new Set(items.map((i) => i.productSlug).filter((x): x is string => Boolean(x))))
  type Found = { id: number; name: string; slug: string; packSizes: { size: string; grade?: string | null; catalogNumber?: string | null }[] }
  const found = new Map<number, Found>()
  const bySlug = new Map<string, Found>()
  if (ids.length || slugs.length) {
    const or = []
    if (ids.length) or.push({ id: { in: ids } })
    if (slugs.length) or.push({ slug: { in: slugs } })
    const res = await payload.find({ collection: 'products', where: { or }, limit: ids.length + slugs.length, depth: 0, pagination: false, select: { name: true, slug: true, packSizes: true }, overrideAccess: false })
    for (const p of res.docs) {
      const rec: Found = { id: p.id, name: p.name, slug: p.slug ?? '', packSizes: p.packSizes ?? [] }
      found.set(p.id, rec)
      if (rec.slug) bySlug.set(rec.slug, rec)
    }
  }
  const out: ResolvedItem[] = []
  for (const i of items) {
    const p = (i.productId && found.get(i.productId)) || (i.productSlug && bySlug.get(i.productSlug)) || undefined
    const productName = p?.name || i.productName || i.productSlug || ''
    if (!productName) continue
    // API / MCP callers usually know the pack size but not the catalogue number; fill it from the product.
    const pack = p && i.packSize ? (p.packSizes.find((ps) => ps.size === i.packSize && (!ps.grade || !i.grade || ps.grade === i.grade)) ?? p.packSizes.find((ps) => ps.size === i.packSize)) : undefined
    out.push({
      product: p?.id,
      productName,
      grade: i.grade || (pack?.grade as ResolvedItem['grade']) || undefined,
      packSize: i.packSize || undefined,
      catalogNumber: i.catalogNumber || pack?.catalogNumber || undefined,
      quantity: i.quantity,
      purpose: i.purpose,
      notes: i.notes || undefined,
    })
  }
  return out
}

export async function createInquiry(payload: Payload, input: InquiryInput, meta: { source: 'website' | 'mcp' | 'api'; ip?: string | null; userAgent?: string | null }) {
  const items = await resolveItems(payload, input.items)
  const productIds = Array.from(new Set([...items.map((i) => i.product).filter((x): x is number => typeof x === 'number'), ...(input.productIds ?? [])]))
  const doc = await payload.create({
    collection: 'inquiries',
    overrideAccess: true,
    data: {
      type: input.type as never,
      name: input.name,
      email: input.email,
      organization: input.organization || undefined,
      jobTitle: input.jobTitle || undefined,
      phone: input.phone || undefined,
      country: input.country || undefined,
      items: items.length ? items : undefined,
      products: productIds.length ? productIds : undefined,
      requestedItems: input.requestedItems || undefined,
      application: input.application || undefined,
      message: input.message || undefined,
      status: 'new',
      meta: { source: meta.source, pageUrl: input.pageUrl || undefined, ip: meta.ip || undefined, userAgent: meta.userAgent?.slice(0, 300) || undefined, consent: Boolean(input.consent) },
    },
  })
  return doc
}
