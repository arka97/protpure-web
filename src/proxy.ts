import { NextResponse, type NextRequest } from 'next/server'

/**
 * Content negotiation for AI agents: an HTML content URL requested with `Accept: text/markdown`
 * is served from the markdown twin at /md/<path>. Everything else passes through untouched.
 */
export function proxy(req: NextRequest) {
  const accept = req.headers.get('accept') ?? ''
  if (!accept.includes('text/markdown')) return NextResponse.next()
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/md/') || pathname.startsWith('/api') || pathname.startsWith('/admin') || pathname.startsWith('/_next') || pathname.startsWith('/mcp') || /\.[a-z0-9]+$/i.test(pathname)) return NextResponse.next()
  const url = req.nextUrl.clone()
  url.pathname = pathname === '/' ? '/md/home' : `/md${pathname}`
  return NextResponse.rewrite(url)
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
