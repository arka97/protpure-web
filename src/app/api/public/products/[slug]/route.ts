import { getProduct } from '@/lib/data'
import { json, options, publicProduct } from '@/lib/public-api'

export const dynamic = 'force-dynamic'

export const OPTIONS = options

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await getProduct(slug)
  if (!p) return json({ error: 'Product not found' }, 404)
  return json(publicProduct(p, { full: true }))
}
