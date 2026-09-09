import { getDocuments } from '@/lib/data'
import { json, options, publicDocument } from '@/lib/public-api'

export const dynamic = 'force-dynamic'

export const OPTIONS = options

/** GET /api/public/documents?type=datasheet */
export async function GET(req: Request) {
  const type = new URL(req.url).searchParams.get('type') ?? undefined
  const docs = await getDocuments({ types: type ? [type] : undefined })
  return json({ count: docs.length, documents: docs.map(publicDocument) })
}
