'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type NavItem = { href: string; label: string; newTab?: boolean; children?: { href: string; label: string; description?: string | null }[] }

export function Header({ items, cta, logoUrl, siteName, announcement }: { items: NavItem[]; cta?: { href: string; label: string } | null; logoUrl?: string | null; siteName: string; announcement?: { text: string; href?: string | null } | null }) {
  const [open, setOpen] = React.useState(false)
  const [openIdx, setOpenIdx] = React.useState<number | null>(null)
  const pathname = usePathname()
  const [scrolled, setScrolled] = React.useState(false)

  // Close menus when the route changes (state adjustment during render, per React docs).
  const [lastPath, setLastPath] = React.useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
    setOpenIdx(null)
  }

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header className={cn('sticky top-0 z-50 w-full border-b transition-colors', scrolled ? 'border-line bg-white/90 backdrop-blur-md' : 'border-transparent bg-white')}>
      {announcement?.text ? (
        <div className="bg-navy-900 text-white">
          <div className="container-x flex items-center justify-center gap-2 py-2 text-center text-xs sm:text-sm">
            <span>{announcement.text}</span>
            {announcement.href ? (
              <Link href={announcement.href} className="inline-flex items-center gap-1 font-semibold text-teal-300 hover:text-white">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
      <div className="container-x flex h-16 items-center justify-between gap-6 lg:h-[72px]">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${siteName} home`}>
          {logoUrl ? (
            <Image src={logoUrl} alt={siteName} width={140} height={36} className="h-8 w-auto lg:h-9" priority unoptimized />
          ) : (
            <span className="font-display text-xl font-bold tracking-tight text-navy-900">{siteName}</span>
          )}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {items.map((item, i) => {
            const hasChildren = Boolean(item.children?.length)
            return (
              <div
                key={i}
                className="relative"
                onMouseEnter={() => hasChildren && setOpenIdx(i)}
                onMouseLeave={() => hasChildren && setOpenIdx(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-navy-50 hover:text-navy-900',
                    isActive(item.href) && 'text-navy-900',
                  )}
                  aria-expanded={hasChildren ? openIdx === i : undefined}
                  onFocus={() => hasChildren && setOpenIdx(i)}
                >
                  {item.label}
                  {hasChildren ? <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden /> : null}
                </Link>
                {hasChildren && openIdx === i ? (
                  <div className="absolute left-0 top-full pt-2">
                    <div className="w-72 rounded-xl border border-line bg-white p-2 shadow-card-hover">
                      {item.children!.map((c, j) => (
                        <Link key={j} href={c.href} className="block rounded-lg px-3 py-2.5 hover:bg-navy-50">
                          <span className="block text-sm font-medium text-navy-900">{c.label}</span>
                          {c.description ? <span className="mt-0.5 block text-xs text-muted">{c.description}</span> : null}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          {cta ? (
            <Link href={cta.href} className="btn-primary btn-sm hidden sm:inline-flex">
              {cta.label}
            </Link>
          ) : null}
          <button type="button" className="btn-ghost btn-sm -mr-2 lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-line bg-white lg:hidden">
          <nav className="container-x py-4" aria-label="Mobile">
            {items.map((item, i) => (
              <div key={i} className="border-b border-line py-2">
                <Link href={item.href} className="block py-2 text-base font-semibold text-navy-900">
                  {item.label}
                </Link>
                {item.children?.length ? (
                  <div className="mb-2 grid gap-1 pl-3">
                    {item.children.map((c, j) => (
                      <Link key={j} href={c.href} className="py-1.5 text-sm text-ink-soft">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {cta ? (
              <Link href={cta.href} className="btn-primary mt-6 w-full">
                {cta.label}
              </Link>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
