import { getApplication, getPage, getPost, getProduct, getCategory, getProducts, getServices } from '@/lib/data'
import { applicationToMarkdown, companyMarkdown, faqMarkdown, pageToMarkdown, postToMarkdown, productToMarkdown, serviceToMarkdown } from '@/lib/markdown'
import { SITE_URL } from '@/lib/utils'

export const dynamic = 'force-dynamic'


const md = (body: string, status = 200) => new Response(body, { status, headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'public, max-age=3600', 'X-Robots-Tag': 'noindex' } })

/**
 * Markdown twin of every content page: /md/products/sp-agarose, /md/about, /md/blog/<slug>…
 * Also reachable by requesting the HTML URL with `Accept: text/markdown` (see src/proxy.ts).
 */
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const [head, second, third] = path
  try {
    if (head === 'company') return md(await companyMarkdown())
    if (head === 'faq') return md(await faqMarkdown())
    if (head === 'services' && !second) {
      const services = await getServices()
      return md(['# Downstream bioprocessing services', '', ...services.map(serviceToMarkdown)].join('\n\n'))
    }
    if (head === 'products' && second === 'category' && third) {
      const [cat, products] = await Promise.all([getCategory(third), getProducts({ category: third })])
      if (!cat) return md('Not found', 404)
      return md([`# ${cat.name}`, cat.tagline ?? '', '', ...products.map((p) => productToMarkdown(p, { brief: true }))].join('\n\n'))
    }
    if (head === 'products' && second) {
      const p = await getProduct(second)
      return p ? md(productToMarkdown(p)) : md('Not found', 404)
    }
    if (head === 'products') {
      const products = await getProducts()
      return md(['# Products', `Full catalog: ${SITE_URL}/products`, '', ...products.map((p) => productToMarkdown(p, { brief: true }))].join('\n\n'))
    }
    if (head === 'applications' && second) {
      const a = await getApplication(second)
      return a ? md(applicationToMarkdown(a)) : md('Not found', 404)
    }
    if (head === 'blog' && second) {
      const post = await getPost(second)
      return post ? md(postToMarkdown(post)) : md('Not found', 404)
    }
    const page = await getPage(head === 'index' ? 'home' : head)
    if (page && !second) return md(pageToMarkdown(page))
  } catch (err) {
    console.error('[md] failed', err)
  }
  return md('Not found', 404)
}
