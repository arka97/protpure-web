import { getPayloadClient } from '@/lib/data'
import { createInquiry, inquirySchema, rateLimit } from '@/lib/inquiries'
import { json, options } from '@/lib/public-api'

export const OPTIONS = options

/**
 * POST /api/public/inquiries — file a quote/contact request from an integration or agent.
 * Body: JSON matching `inquirySchema`:
 *   { type, name, email, organization?, jobTitle?, phone?, country?, application?, message?,
 *     items?: [{ productId? | productSlug? | productName?, grade?, packSize?, catalogNumber?, quantity?, purpose?, notes? }],
 *     productIds?: number[] (legacy), requestedItems?: string (legacy free text) }
 * `purpose` is one of sample-kit | evaluation | production | other. Sample kits are paid and credited
 * against the first bulk order — Protpure does not ship free samples.
 */
export async function POST(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || null
  if (!rateLimit(`api-inquiry:${ip ?? 'anon'}`, 10)) return json({ error: 'Rate limit exceeded. Try again later.' }, 429)
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }
  const parsed = inquirySchema.safeParse({ consent: true, ...(body as object) })
  if (!parsed.success) return json({ error: 'Validation failed', issues: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })) }, 422)
  const payload = await getPayloadClient()
  const doc = await createInquiry(payload, parsed.data, { source: 'api', ip, userAgent: req.headers.get('user-agent') })
  return json({ ok: true, id: doc.id, itemCount: doc.items?.length ?? 0, message: `Inquiry #${doc.id} received. A confirmation has been emailed to ${doc.email}.` }, 201)
}
