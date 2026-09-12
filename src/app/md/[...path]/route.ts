import { getApplication, getApplications, getDocuments, getPage, getPost, getPosts, getProduct, getCategory, getProducts, getServices, getUpdates } from '@/lib/data'
import { applicationToMarkdown, companyMarkdown, faqMarkdown, pageToMarkdown, postToMarkdown, productToMarkdown, serviceToMarkdown, updateToMarkdown } from '@/lib/markdown'
import { absoluteUrl } from '@/lib/utils'
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
    // Listing routes: the CMS page supplies the hero copy, the collection supplies the list.
    if (!second && ['applications', 'blog', 'resources', 'updates'].includes(head)) {
      const page = await getPage(head)
      const intro = page ? pageToMarkdown(page, 'hero') : `# ${head[0].toUpperCase()}${head.slice(1)}`
      const tail = page?.layout?.length ? ['', pageToMarkdown(page, 'layout')] : []
      let list: string[]
      if (head === 'applications') list = (await getApplications()).map((a) => `- [${a.name}](${SITE_URL}/md/applications/${a.slug}): ${a.summary}`)
      else if (head === 'blog') list = (await getPosts({ limit: 100 })).docs.map((p) => `- [${p.title}](${SITE_URL}/md/blog/${p.slug}): ${p.excerpt}`)
      else if (head === 'resources') list = (await getDocuments()).map((d) => `- [${d.title}](${absoluteUrl(d.url ?? '')}): ${d.type}${d.revision ? `, ${d.revision}` : ''}${d.summary ? ` — ${d.summary}` : ''}`)
      else list = (await getUpdates(60)).map(updateToMarkdown)
      return md([intro, '', ...list, ...tail].join('\n'))
    }
    const page = await getPage(head === 'index' ? 'home' : head)
    if (page && !second) return md(pageToMarkdown(page))
  } catch (err) {
    console.error('[md] failed', err)
  }
  return md('Not found', 404)
}
