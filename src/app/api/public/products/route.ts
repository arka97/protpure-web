import { getProducts } from '@/lib/data'
import { json, options, publicProduct } from '@/lib/public-api'

export const dynamic = 'force-dynamic'

export const OPTIONS = options

/** GET /api/public/products?category=ion-exchange&q=agarose&grade=precise */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const category = url.searchParams.get('category') ?? undefined
  const q = url.searchParams.get('q') ?? undefined
  const grade = url.searchParams.get('grade') ?? undefined
  let products = await getProducts({ category, search: q })
  if (grade) products = products.filter((p) => p.grades?.some((g) => g.grade === grade))
  return json({ count: products.length, products: products.map((p) => publicProduct(p)) })
}
