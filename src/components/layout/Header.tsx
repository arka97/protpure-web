'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { BasketButton, QuoteCta } from '@/components/rfq/BasketButton'
import { ArrowIcon, ChevronDownIcon, CloseIcon, MenuIcon } from '@/components/visual/icons'
import { cn } from '@/lib/utils'

export type NavItem = { href: string; label: string; newTab?: boolean; children?: { href: string; label: string; description?: string | null }[] }

export type Logo = { url: string; width: number; height: number }

/**
 * Deep Field masthead: 96 px on desktop (72 px once scrolled), 76 px on phones. Logo + provenance
 * note, navigation with dropdowns, RFQ basket with count and the one conversion action.
 */
export function Header({ items, cta, logo, siteName, tagline, announcement }: { items: NavItem[]; cta?: { href: string; label: string } | null; logo?: Logo | null; siteName: string; tagline?: string | null; announcement?: { text: string; href?: string | null } | null }) {
  const [open, setOpen] = React.useState(false)
  const [openIdx, setOpenIdx] = React.useState<number | null>(null)
  const pathname = usePathname()
  const [scrolled, setScrolled] = React.useState(false)
  const navRef = React.useRef<HTMLElement>(null)

  // Close menus when the route changes (state adjustment during render, per React docs).
  const [lastPath, setLastPath] = React.useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
    setOpenIdx(null)
  }

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
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

  // Escape closes an open dropdown; focus leaving the nav closes it too.
  React.useEffect(() => {
    if (openIdx === null) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenIdx(null)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [openIdx])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))
  const taglineLines = (tagline ?? '').split(/\s+·\s+/).filter(Boolean)

  return (
    <header className={cn('sticky top-0 z-50 w-full border-b bg-surface transition-[border-color,box-shadow] duration-200', scrolled ? 'border-rule shadow-[0_1px_0_0_var(--color-rule)]' : 'border-rule')}>
      {announcement?.text ? (
        <div className="surface-raised">
          <div className="container-x flex items-center justify-center gap-3 py-2 text-center text-[12px]">
            <span>{announcement.text}</span>
            {announcement.href ? (
              <Link href={announcement.href} className="inline-flex items-center gap-1.5 font-medium text-teal-lum hover:text-surface">
                Learn more <ArrowIcon className="h-3.5 w-3.5" />
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className={cn('container-x flex items-center justify-between gap-6 transition-[height] duration-200', 'h-[76px]', scrolled ? 'lg:h-[72px]' : 'lg:h-[96px]')}>
        <Link href="/" className="flex shrink-0 items-center gap-6" aria-label={`${siteName} home`}>
          {logo ? (
            <Image src={logo.url} alt={siteName} width={logo.width} height={logo.height} className={cn('h-auto w-[114px] transition-[width] duration-200', scrolled ? 'lg:w-[120px]' : 'lg:w-[134px]')} priority unoptimized />
          ) : (
            <span className="font-display text-[28px] tracking-[-0.03em] text-ink">{siteName}</span>
          )}
          {taglineLines.length ? (
            <span className="hidden border-l border-rule pl-6 text-[10px] uppercase leading-[1.6] tracking-[0.1em] text-text-2 xl:block">
              {taglineLines.map((l, i) => (
                <React.Fragment key={i}>
                  {l}
                  {i < taglineLines.length - 1 ? <br /> : null}
                </React.Fragment>
              ))}
            </span>
          ) : null}
        </Link>

        <nav ref={navRef} className="hidden items-center gap-7 text-[14px] lg:flex" aria-label="Main navigation" onBlur={(e) => !navRef.current?.contains(e.relatedTarget as Node) && setOpenIdx(null)}>
          {items.map((item, i) => {
            const hasChildren = Boolean(item.children?.length)
            const active = isActive(item.href)
            return (
              <div key={i} className="relative" onMouseEnter={() => hasChildren && setOpenIdx(i)} onMouseLeave={() => hasChildren && setOpenIdx(null)}>
                <Link
                  href={item.href}
                  className={cn('inline-flex min-h-11 items-center gap-1.5 border-b py-2 text-ink transition-colors hover:text-teal-deep', active ? 'border-teal-deep text-teal-deep' : 'border-transparent')}
                  aria-current={active ? 'page' : undefined}
                  aria-expanded={hasChildren ? openIdx === i : undefined}
                  aria-haspopup={hasChildren ? 'menu' : undefined}
                  onFocus={() => hasChildren && setOpenIdx(i)}
                  target={item.newTab ? '_blank' : undefined}
                >
                  {item.label}
                  {hasChildren ? <ChevronDownIcon className="h-3.5 w-3.5 opacity-70" /> : null}
                </Link>
                {hasChildren && openIdx === i ? (
                  <div className="absolute left-0 top-full pt-3">
                    <div className="w-72 border border-rule bg-white p-2 shadow-panel">
                      {item.children!.map((c, j) => (
                        <Link key={j} href={c.href} className="block px-3 py-2.5 hover:bg-surface-recessed" onClick={() => setOpenIdx(null)}>
                          <span className="block text-[14px] font-medium text-ink">{c.label}</span>
                          {c.description ? <span className="mt-0.5 block text-[12px] text-text-2">{c.description}</span> : null}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <BasketButton />
          {cta ? <QuoteCta href={cta.href} label={cta.label} className="btn-primary hidden min-h-[42px] px-4 py-2.5 text-[13px] sm:inline-flex" withArrow /> : null}
          <button type="button" className="icon-button -mr-2 lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-menu" className="surface-recessed absolute inset-x-0 top-full max-h-[calc(100dvh-76px)] overflow-y-auto border-t border-rule lg:hidden" aria-label="Mobile navigation">
          <div className="container-x grid gap-1 py-4 text-[14px]">
            {items.map((item, i) => (
              <div key={i} className="border-b border-rule py-2 last:border-0">
                <Link href={item.href} className={cn('flex min-h-11 items-center justify-between py-2 font-medium text-ink', isActive(item.href) && 'text-teal-deep')} aria-current={isActive(item.href) ? 'page' : undefined}>
                  {item.label}
                  <ArrowIcon className="h-4 w-4 text-text-2" />
                </Link>
                {item.children?.length ? (
                  <div className="mb-2 grid gap-0.5 pl-4">
                    {item.children.map((c, j) => (
                      <Link key={j} href={c.href} className="flex min-h-10 items-center py-1.5 text-[13px] text-text-2">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {cta ? <QuoteCta href={cta.href} label={cta.label} className="btn-primary mt-4 w-full" withArrow /> : null}
          </div>
        </nav>
      ) : null}
    </header>
  )
}
