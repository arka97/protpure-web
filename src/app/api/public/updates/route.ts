import { UPDATE_KINDS } from '@/collections/Updates'
import { getUpdates } from '@/lib/data'
import { json, options, publicUpdate } from '@/lib/public-api'

export const dynamic = 'force-dynamic'

export const OPTIONS = options

const KINDS = new Set<string>(UPDATE_KINDS.map((k) => k.value))

/** GET /api/public/updates?kind=product-launch&limit=10 — published LinkedIn updates (drafts never appear). */
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams
  const kind = params.get('kind')
  if (kind && !KINDS.has(kind)) return json({ error: `Unknown kind "${kind}". Valid: ${[...KINDS].join(', ')}` }, 400)
  const limit = Math.min(Math.max(Number(params.get('limit')) || 20, 1), 100)
  const updates = await getUpdates(limit, { kind })
  return json({ count: updates.length, updates: updates.map(publicUpdate) })
}
