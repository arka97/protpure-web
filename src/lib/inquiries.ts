import { z } from 'zod'
import type { Payload } from 'payload'
import { INQUIRY_TYPES } from '@/collections/Inquiries'

export const inquirySchema = z.object({
  type: z.enum(INQUIRY_TYPES.map((t) => t.value) as [string, ...string[]]),
  name: z.string().trim().min(2, 'Please enter your name').max(120),
  email: z.string().trim().email('Please enter a valid email address').max(200),
  organization: z.string().trim().max(200).optional().or(z.literal('')),
  jobTitle: z.string().trim().max(120).optional().or(z.literal('')),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  country: z.string().trim().max(80).optional().or(z.literal('')),
  productIds: z.array(z.coerce.number().int().positive()).max(30).optional(),
  requestedItems: z.string().trim().max(2000).optional().or(z.literal('')),
  application: z.string().trim().max(500).optional().or(z.literal('')),
  message: z.string().trim().max(5000).optional().or(z.literal('')),
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

export async function createInquiry(payload: Payload, input: InquiryInput, meta: { source: 'website' | 'mcp' | 'api'; ip?: string | null; userAgent?: string | null }) {
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
      products: input.productIds?.length ? input.productIds : undefined,
      requestedItems: input.requestedItems || undefined,
      application: input.application || undefined,
      message: input.message || undefined,
      status: 'new',
      meta: { source: meta.source, pageUrl: input.pageUrl || undefined, ip: meta.ip || undefined, userAgent: meta.userAgent?.slice(0, 300) || undefined, consent: Boolean(input.consent) },
    },
  })
  return doc
}
