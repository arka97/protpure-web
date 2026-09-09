import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Content on this site is small and heavily cross-referenced (a product change touches the
 * homepage, category counts, sitemap, llms.txt, MCP…). Rather than tracking every dependency we
 * bust the collection's cache tag and re-render the whole route tree. Cheap at this scale and
 * guarantees editors never see stale pages.
 */
function bust(collection: string) {
  try {
    revalidateTag(collection, 'max')
    revalidateTag('content', 'max')
    revalidatePath('/', 'layout')
  } catch {
    // Called outside a request scope (e.g. seed script) — nothing to revalidate.
  }
}

export const revalidateAll: CollectionAfterChangeHook = ({ doc, collection, req: { context } }) => {
  if (!context.disableRevalidate) bust(collection.slug)
  return doc
}

export const revalidateAllDelete: CollectionAfterDeleteHook = ({ doc, collection, req: { context } }) => {
  if (!context.disableRevalidate) bust(collection.slug)
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, global, req: { context } }) => {
  if (!context.disableRevalidate) bust(`global:${global.slug}`)
  return doc
}
