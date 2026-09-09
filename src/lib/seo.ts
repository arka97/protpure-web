import type { Metadata } from 'next'
import type { Media } from '@/payload-types'
import { absoluteUrl, mediaUrl, truncate } from './utils'

type Meta = { title?: string | null; description?: string | null; image?: Media | number | string | null } | null | undefined

export function buildMetadata({ meta, title, description, path, image, type = 'website', noIndex }: { meta?: Meta; title: string; description?: string | null; path: string; image?: Media | number | string | null; type?: 'website' | 'article'; noIndex?: boolean }): Metadata {
  const t = meta?.title || title
  const d = meta?.description || (description ? truncate(description, 160) : undefined)
  const img = mediaUrl(meta?.image, 'og') ?? mediaUrl(image, 'og') ?? mediaUrl(image, 'large')
  const url = absoluteUrl(path)
  return {
    title: t,
    description: d,
    alternates: { canonical: url, types: { 'text/markdown': absoluteUrl(`/md${path === '/' ? '/home' : path}`) } },
    openGraph: { title: t, description: d, url, type, images: img ? [{ url: absoluteUrl(img) }] : undefined },
    twitter: { card: 'summary_large_image', title: t, description: d },
    robots: noIndex ? { index: false, follow: false } : undefined,
  }
}
