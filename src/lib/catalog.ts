import type { Where } from 'payload'
import type { Product, ProductCategory } from '@/payload-types'

/**
 * Pure helpers shared by the data layer and every renderer of product data (pages, Markdown, JSON
 * API, MCP). Kept free of Next/Payload runtime imports so they can be unit-tested.
 */

/** Collections with `versions.drafts` enabled (see `src/collections/*`). Public reads must exclude drafts. */
export const DRAFT_COLLECTIONS = ['pages', 'posts', 'products', 'updates'] as const

/**
 * Query constraint for a public read of a versioned collection: only published docs, unless draft
 * mode (admin preview / live preview) is on. The local API bypasses access control, so this is the
 * only thing keeping never-published rows (e.g. an empty "Create new" draft) out of the site.
 */
export function publishedWhere(draft: boolean, ...clauses: (Where | undefined)[]): Where | undefined {
  const and = clauses.filter((c): c is Where => Boolean(c))
  if (!draft) and.unshift({ _status: { equals: 'published' } })
  if (!and.length) return undefined
  return and.length === 1 ? and[0] : { and }
}

/** The populated category of a product, or null when unset (draft rows) or not populated (depth 0). */
export function categoryOf(p: Pick<Product, 'category'> | null | undefined): ProductCategory | null {
  const c = p?.category
  return c && typeof c === 'object' ? c : null
}
