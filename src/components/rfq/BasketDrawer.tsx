'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowRight, ShoppingBasket, X } from 'lucide-react'
import { useBasket } from './BasketProvider'
import { BasketLineList } from './BasketLines'
import { Modal } from './Modal'
import { SAMPLE_KIT_POLICY } from '@/lib/rfq'

/** Slide-over listing the basket lines with inline editing; leads to /request-quote. */
export function BasketDrawer() {
  const { items, count, isOpen, close, clear } = useBasket()
  const router = useRouter()
  const pathname = usePathname()
  const titleId = React.useId()

  // Safety net: close when the route changes underneath an open drawer.
  const lastPath = React.useRef(pathname)
  React.useEffect(() => {
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    close()
  }, [pathname, close])

  const goToQuote = () => {
    close()
    if (pathname === '/request-quote') return
    router.push('/request-quote')
  }

  return (
    <Modal open={isOpen} onClose={close} labelledBy={titleId} panelClassName="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-card-hover">
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <div className="flex items-center gap-2">
          <ShoppingBasket className="h-5 w-5 text-teal-600" aria-hidden />
          <h2 id={titleId} className="font-display text-lg font-bold text-navy-900">
            RFQ basket
          </h2>
          <span className="chip">{count} item{count === 1 ? '' : 's'}</span>
        </div>
        <button type="button" onClick={close} className="btn-ghost -mr-2 h-11 w-11 p-0 sm:h-9 sm:w-9" aria-label="Close basket">
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5">
        {items.length ? (
          <BasketLineList onNavigate={close} />
        ) : (
          <div className="py-16 text-center">
            <ShoppingBasket className="mx-auto h-10 w-10 text-navy-100" aria-hidden />
            <p className="heading-3 mt-4">Your basket is empty</p>
            <p className="mx-auto mt-2 max-w-xs text-sm text-ink-soft">Add resins, columns or sample kits from any product card or pack-size table, then request one quotation for all of them.</p>
            <Link href="/products" onClick={close} className="btn-primary mt-6">
              Browse products
            </Link>
          </div>
        )}
      </div>

      {items.length ? (
        <div className="border-t border-line bg-surface-2/60 px-5 py-4">
          <p className="text-xs text-ink-soft">{SAMPLE_KIT_POLICY}</p>
          <div className="mt-3 grid gap-2">
            <button type="button" onClick={goToQuote} className="btn-primary w-full min-h-11">
              Request quote for {count === 1 ? 'this item' : `these ${count} items`} <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <div className="flex items-center justify-between text-sm">
              <Link href="/products" onClick={close} className="font-medium text-navy-900 hover:text-teal-600">
                Add more products
              </Link>
              <button type="button" onClick={clear} className="min-h-11 text-muted hover:text-red-600 sm:min-h-0">
                Clear basket
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
