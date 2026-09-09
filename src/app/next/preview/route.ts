import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

const PATHS: Record<string, (slug: string) => string> = {
  pages: (s) => (s === 'home' ? '/' : `/${s}`),
  products: (s) => `/products/${s}`,
  posts: (s) => `/blog/${s}`,
}

/** Entered from the admin "Preview" / live-preview pane. Only logged-in editors may enable draft mode. */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const collection = url.searchParams.get('collection') ?? 'pages'
  const slug = url.searchParams.get('slug') ?? ''
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return new Response('Unauthorized', { status: 401 })
  ;(await draftMode()).enable()
  redirect(PATHS[collection]?.(slug) ?? '/')
}
