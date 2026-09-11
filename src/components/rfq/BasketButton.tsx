'use client'

import * as React from 'react'
import Link from 'next/link'
import { ShoppingBasket } from 'lucide-react'
import { useBasket } from './BasketProvider'
import { cn } from '@/lib/utils'

/** Header icon with a line-count badge; opens the basket drawer. */
export function BasketButton({ className }: { className?: string }) {
  const { count, ready, open, isOpen } = useBasket()
  const n = ready ? count : 0
  return (
    <button
      type="button"
      onClick={open}
      className={cn('relative inline-flex h-11 w-11 items-center justify-center rounded-lg text-navy-900 transition hover:bg-navy-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 lg:h-10 lg:w-10', className)}
      aria-label={n ? `Open RFQ basket, ${n} item${n === 1 ? '' : 's'}` : 'Open RFQ basket'}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
    >
      <ShoppingBasket className="h-5 w-5" aria-hidden />
      {n ? (
        <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-500 px-1 text-[11px] font-bold leading-none text-white" aria-hidden>
          {n > 99 ? '99+' : n}
        </span>
      ) : null}
    </button>
  )
}

/**
 * "Request a quote" call-to-action: when it points at the quote page and the basket has items it
 * opens the drawer (so the buyer reviews before submitting); otherwise it is a plain link.
 */
export function QuoteCta({ href, label, className }: { href: string; label: string; className?: string }) {
  const { count, ready, open } = useBasket()
  const hasItems = ready && count > 0 && href.startsWith('/request-quote')
  if (hasItems) {
    return (
      <button type="button" onClick={open} className={className}>
        {label}
        <span className="sr-only"> ({count} item{count === 1 ? '' : 's'} in basket)</span>
      </button>
    )
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  )
}
