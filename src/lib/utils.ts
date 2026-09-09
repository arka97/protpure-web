import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Media, Page, Product, ProductCategory, Application, Post } from '@/payload-types'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const SITE_URL = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function formatDate(value?: string | null, opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }) {
  if (!value) return ''
  return new Intl.DateTimeFormat('en-GB', opts).format(new Date(value))
}

type RelDoc = Page | Product | ProductCategory | Application | Post

/** Build the public path for a related document. */
export function docPath(relationTo: string, doc: RelDoc | number | string | null | undefined): string {
  if (!doc || typeof doc !== 'object') return '/'
  const slug = (doc as { slug?: string }).slug ?? ''
  switch (relationTo) {
    case 'pages':
      return slug === 'home' ? '/' : `/${slug}`
    case 'products':
      return `/products/${slug}`
    case 'product-categories':
      return `/products/category/${slug}`
    case 'applications':
      return `/applications/${slug}`
    case 'posts':
      return `/blog/${slug}`
    default:
      return `/${slug}`
  }
}

export type LinkValue = {
  type?: 'internal' | 'custom' | null
  newTab?: boolean | null
  reference?: { relationTo: string; value: RelDoc | number | string } | null
  url?: string | null
  label?: string | null
  appearance?: 'primary' | 'secondary' | 'ghost' | null
}

export function resolveLink(link?: LinkValue | null): { href: string; label: string; newTab: boolean; appearance: string } | null {
  if (!link) return null
  const href = link.type === 'custom' ? link.url || '#' : link.reference ? docPath(link.reference.relationTo, link.reference.value) : '#'
  const fallbackLabel = link.reference && typeof link.reference.value === 'object' ? ((link.reference.value as { title?: string; name?: string }).title ?? (link.reference.value as { name?: string }).name ?? '') : ''
  return { href, label: link.label || fallbackLabel || 'Learn more', newTab: Boolean(link.newTab), appearance: link.appearance || 'primary' }
}

/** Same-origin path for a media file (Payload emits absolute URLs when `serverURL` is set). */
const relative = (url?: string | null) => (url ? url.replace(/^https?:\/\/[^/]+/, '') : null)

export function mediaUrl(media: Media | number | string | null | undefined, size?: 'thumbnail' | 'card' | 'large' | 'og'): string | null {
  if (!media || typeof media !== 'object') return null
  if (size && media.sizes?.[size]?.url) return relative(media.sizes[size]!.url)
  return relative(media.url)
}

export function mediaAlt(media: Media | number | string | null | undefined, fallback = '') {
  return media && typeof media === 'object' ? media.alt || fallback : fallback
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function truncate(text: string, n = 160) {
  if (text.length <= n) return text
  return `${text.slice(0, n - 1).trimEnd()}…`
}
