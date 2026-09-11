'use client'

import * as React from 'react'
import Link from 'next/link'
import { useBasket } from './BasketProvider'
import { ArrowIcon, BasketIcon } from '@/components/visual/icons'
import { cn } from '@/lib/utils'

/** Header basket: icon plus a line-count mark; opens the drawer. */
export function BasketButton({ className, label }: { className?: string; label?: string }) {
  const { count, ready, open, isOpen } = useBasket()
  const n = ready ? count : 0
  return (
    <button
      type="button"
      onClick={open}
      className={cn('inline-flex min-h-11 items-center gap-2.5 px-1 text-[13px] text-ink hover:text-teal-deep', className)}
      aria-label={n ? `Open RFQ basket, ${n} line${n === 1 ? '' : 's'}` : 'Open RFQ basket'}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
    >
      <BasketIcon />
      {label ? <span className="hidden md:inline">{label}</span> : null}
      <span className={cn('num inline-grid h-[22px] w-[22px] place-items-center rounded-full text-[11px] leading-none', n ? 'bg-ink text-white' : 'border border-rule text-text-2')} aria-hidden>
        {n > 99 ? '99+' : n}
      </span>
    </button>
  )
}

/**
 * "Request a quote" call-to-action: when it points at the quote page and the basket has items it
 * opens the drawer (so the buyer reviews before submitting); otherwise it is a plain link.
 */
export function QuoteCta({ href, label, className, withArrow }: { href: string; label: string; className?: string; withArrow?: boolean }) {
  const { count, ready, open } = useBasket()
  const hasItems = ready && count > 0 && href.startsWith('/request-quote')
  const arrow = withArrow ? <ArrowIcon className="h-4 w-4" /> : null
  if (hasItems) {
    return (
      <button type="button" onClick={open} className={className}>
        {label}
        <span className="sr-only"> ({count} line{count === 1 ? '' : 's'} in basket)</span>
        {arrow}
      </button>
    )
  }
  return (
    <Link href={href} className={className}>
      {label}
      {arrow}
    </Link>
  )
}
