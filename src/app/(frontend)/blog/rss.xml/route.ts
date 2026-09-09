import { getPosts, getSiteSettings } from '@/lib/data'
import { SITE_URL } from '@/lib/utils'

export const dynamic = 'force-dynamic'


const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function GET() {
  const [posts, settings] = await Promise.all([getPosts({ limit: 50 }), getSiteSettings()])
  const items = posts.docs
    .map(
      (p) => `<item>
  <title>${esc(p.title)}</title>
  <link>${SITE_URL}/blog/${p.slug}</link>
  <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
  <pubDate>${new Date(p.publishedAt ?? p.createdAt).toUTCString()}</pubDate>
  <description>${esc(p.excerpt)}</description>
</item>`,
    )
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(settings.name || 'Protpure')} — Blog</title>
  <link>${SITE_URL}/blog</link>
  <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
  <description>${esc(settings.description || 'Chromatography science and company news from Protpure.')}</description>
  <language>en</language>
${items}
</channel>
</rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } })
}
