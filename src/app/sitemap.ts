import type { MetadataRoute } from 'next'
import { getAllPageSlugs, getApplications, getCategories, getPosts, getProducts } from '@/lib/data'
import { SITE_URL } from '@/lib/utils'

export const dynamic = 'force-dynamic'


const RESERVED = new Set(['home', 'products', 'applications', 'services', 'resources', 'blog', 'updates', 'contact', 'request-quote', 'faq', 'compare', 'newsletter'])

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, products, categories, apps, posts] = await Promise.all([getAllPageSlugs(), getProducts(), getCategories(), getApplications(), getPosts({ limit: 500 })])
  const fixed = ['', '/products', '/applications', '/services', '/resources', '/blog', '/updates', '/contact', '/request-quote', '/faq'].map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.8 }))
  return [
    ...fixed,
    ...pages.filter((p) => !RESERVED.has(p.slug)).map((p) => ({ url: `${SITE_URL}/${p.slug}`, lastModified: p.updatedAt, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...categories.map((c) => ({ url: `${SITE_URL}/products/category/${c.slug}`, lastModified: c.updatedAt, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${SITE_URL}/products/${p.slug}`, lastModified: p.updatedAt, changeFrequency: 'monthly' as const, priority: 0.9 })),
    ...apps.map((a) => ({ url: `${SITE_URL}/applications/${a.slug}`, lastModified: a.updatedAt, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...posts.docs.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.updatedAt, changeFrequency: 'yearly' as const, priority: 0.5 })),
  ]
}
