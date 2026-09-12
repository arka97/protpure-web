'use client'

import * as React from 'react'
import { BASKET_STORAGE_KEY, basketReducer, normalizeBasket, type AddInput, type BasketAction, type BasketItem } from '@/lib/rfq'

type BasketContextValue = {
  items: BasketItem[]
  /** Number of lines (not the summed quantity). */
  count: number
  /** False until the basket has been read from localStorage — render counts only when true to avoid hydration mismatches. */
  ready: boolean
  add: (input: AddInput) => void
  update: (key: string, patch: Partial<Omit<BasketItem, 'key' | 'product'>>) => void
  remove: (key: string) => void
  clear: () => void
  has: (productId: number) => boolean
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const BasketContext = React.createContext<BasketContextValue | null>(null)

/** Last value read from / written to storage, so re-hydrating from another tab never writes it back (no cross-tab ping-pong). */
let lastRaw: string | null = null

function readStorage(): BasketItem[] {
  try {
    const raw = window.localStorage.getItem(BASKET_STORAGE_KEY)
    lastRaw = raw
    return raw ? normalizeBasket(JSON.parse(raw)) : []
  } catch {
    return []
  }
}

function writeStorage(items: BasketItem[]) {
  const raw = items.length ? JSON.stringify({ v: 1, items }) : null
  if (raw === lastRaw) return
  lastRaw = raw
  try {
    if (raw) window.localStorage.setItem(BASKET_STORAGE_KEY, raw)
    else window.localStorage.removeItem(BASKET_STORAGE_KEY)
  } catch {
    // Private mode / quota / disabled storage: the basket still works for this page view.
  }
}

type State = { ready: boolean; items: BasketItem[] }

/** `basketReducer` (pure, unit-tested) plus a hydration flag flipped by the first `hydrate`. */
function providerReducer(state: State, action: BasketAction): State {
  const items = basketReducer(state.items, action)
  const ready = action.type === 'hydrate' ? true : state.ready
  return items === state.items && ready === state.ready ? state : { ready, items }
}

/**
 * Client-side RFQ basket. State lives in React (reducer in `src/lib/rfq.ts`), is persisted to
 * localStorage under `protpure.rfq.v1`, and follows changes made in other tabs.
 */
export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [{ items, ready }, dispatch] = React.useReducer(providerReducer, { ready: false, items: [] })
  const [isOpen, setOpen] = React.useState(false)

  // Hydrate after mount (server renders an empty basket).
  React.useEffect(() => {
    dispatch({ type: 'hydrate', items: readStorage() })
    const onStorage = (e: StorageEvent) => {
      if (e.key === BASKET_STORAGE_KEY || e.key === null) dispatch({ type: 'hydrate', items: readStorage() })
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Persist every change once hydrated.
  React.useEffect(() => {
    if (ready) writeStorage(items)
  }, [items, ready])

  const value = React.useMemo<BasketContextValue>(
    () => ({
      items,
      count: items.length,
      ready,
      add: (input) => dispatch({ type: 'add', input }),
      update: (key, patch) => dispatch({ type: 'update', key, patch }),
      remove: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
      has: (productId) => items.some((i) => i.product.id === productId),
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      toggle: () => setOpen((o) => !o),
    }),
    [items, ready, isOpen],
  )

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>
}

export function useBasket(): BasketContextValue {
  const ctx = React.useContext(BasketContext)
  if (!ctx) throw new Error('useBasket must be used inside <BasketProvider>')
  return ctx
}
