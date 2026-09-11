'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useBasket } from './BasketProvider'
import { BasketLineList } from './BasketLines'
import { Modal } from './Modal'
import { ArrowIcon, CloseIcon } from '@/components/visual/icons'
import { SAMPLE_KIT_POLICY } from '@/lib/rfq'

/**
 * The RFQ drawer: 445 px white slide-over on the right (full width on phones) with the lines and
 * one path forward — the quote form. No subtotal, no price.
 */
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
    <Modal open={isOpen} onClose={close} labelledBy={titleId} panelClassName="ml-auto flex h-full w-full max-w-[445px] flex-col bg-white text-ink shadow-drawer">
      <div className="flex items-center justify-between gap-4 border-b border-rule px-6 py-5">
        <h2 id={titleId} className="font-display text-[33px] leading-none tracking-[-0.03em]">
          Your RFQ <span className="mono ml-1 align-middle text-[13px] text-text-2">{count}</span>
        </h2>
        <button type="button" onClick={close} className="icon-button -mr-3 text-text-2 hover:text-ink" aria-label="Close basket">
          <CloseIcon />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6">
        {items.length ? (
          <BasketLineList onNavigate={close} />
        ) : (
          <div className="py-8">
            <p className="text-[13px] leading-[1.6] text-text-2">Add products, grades and pack sizes from any product card or ordering table. Send them together as one quote request.</p>
            <Link href="/products" onClick={close} className="text-link mt-5">
              Browse resins <ArrowIcon />
            </Link>
          </div>
        )}
      </div>

      {items.length ? (
        <div className="border-t border-rule bg-surface px-6 py-5">
          <p className="text-[12px] leading-[1.6] text-text-2">{SAMPLE_KIT_POLICY}</p>
          <div className="mt-4 grid gap-3">
            <button type="button" onClick={goToQuote} className="btn-primary w-full">
              Request one quote for {count === 1 ? 'this line' : `these ${count} lines`} <ArrowIcon />
            </button>
            <div className="flex items-center justify-between text-[12px]">
              <Link href="/products" onClick={close} className="font-medium text-ink underline decoration-rule underline-offset-4 hover:text-teal-deep">
                Add more products
              </Link>
              <button type="button" onClick={clear} className="min-h-11 text-text-2 underline decoration-rule underline-offset-4 hover:text-error sm:min-h-0">
                Clear basket
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
