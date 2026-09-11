'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowIcon, CloseIcon } from '@/components/visual/icons'
import { useDockOffset } from './useDockOffset'
import { cn } from '@/lib/utils'

/**
 * "Compare" selection for the catalogue: up to three product slugs in localStorage, shared by every
 * card's checkbox and the floating bar through one external store. Nothing is sent anywhere — the
 * bar links to /compare?ids=… which the server renders.
 */
export const COMPARE_STORAGE_KEY = 'protpure.compare.v1'
export const COMPARE_MAX = 3
const EVENT = 'protpure:compare'
const EMPTY: string[] = []

let cache: string[] = EMPTY
let cacheRaw: string | null = null

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(COMPARE_STORAGE_KEY)
    if (raw === cacheRaw) return cache
    cacheRaw = raw
    const parsed: unknown = raw ? JSON.parse(raw) : []
    cache = Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === 'string').slice(0, COMPARE_MAX) : EMPTY
    return cache
  } catch {
    return cache
  }
}

function write(list: string[]) {
  try {
    if (list.length) window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(list))
    else window.localStorage.removeItem(COMPARE_STORAGE_KEY)
  } catch {
    // Storage unavailable: the selection still lives in `cache` for this page view.
    cacheRaw = list.length ? JSON.stringify(list) : null
    cache = list
  }
  window.dispatchEvent(new Event(EVENT))
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener(EVENT, cb)
    window.removeEventListener('storage', cb)
  }
}

export function useCompare() {
  const list = React.useSyncExternalStore(subscribe, read, () => EMPTY)
  const toggle = React.useCallback((slug: string) => {
    const cur = read()
    if (cur.includes(slug)) write(cur.filter((s) => s !== slug))
    else if (cur.length < COMPARE_MAX) write([...cur, slug])
  }, [])
  const clear = React.useCallback(() => write([]), [])
  return { list, toggle, clear, full: list.length >= COMPARE_MAX }
}

export function CompareCheckbox({ slug, name, className }: { slug: string; name: string; className?: string }) {
  const { list, toggle, full } = useCompare()
  const checked = list.includes(slug)
  const disabled = !checked && full
  return (
    <label className={cn('inline-flex min-h-11 cursor-pointer select-none items-center gap-2 text-[11px] text-ink sm:min-h-0', disabled && 'cursor-not-allowed text-text-2', className)} title={disabled ? `Up to ${COMPARE_MAX} products can be compared` : undefined}>
      <input type="checkbox" className="h-[15px] w-[15px]" checked={checked} disabled={disabled} onChange={() => toggle(slug)} aria-label={`Compare ${name}`} />
      Compare
    </label>
  )
}

/**
 * Floating bar once a product is ticked: count, the compare link (enabled from two products) and a
 * clear action. Sits above the bottom edge with room for the WhatsApp button on the right.
 */
export function CompareBar({ names }: { names: Record<string, string> }) {
  const { list, clear } = useCompare()
  const ref = React.useRef<HTMLDivElement>(null)
  useDockOffset(ref, list.length > 0)
  if (!list.length) return null
  const ready = list.length >= 2
  const picked = list.map((s) => names[s] ?? s)
  return (
    <div ref={ref} className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-4 sm:px-6 lg:pb-6" role="region" aria-label="Product comparison" aria-live="polite" style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
      <div className="pointer-events-auto flex w-full max-w-[720px] flex-wrap items-center justify-between gap-x-5 gap-y-2 border border-rule-dark bg-ink px-4 py-3 text-[12px] text-surface shadow-bar sm:px-5">
        <div className="min-w-0 flex-1">
          <p className="font-medium">
            Compare <span className="mono">({list.length})</span>
            <span className="hidden text-text-2-dark sm:inline"> · {ready ? picked.join(' · ') : `${picked[0]} — pick one more to compare`}</span>
            {!ready ? <span className="block text-[11px] font-normal text-text-2-dark sm:hidden">Pick one more to compare</span> : null}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={ready ? `/compare?ids=${list.join(',')}` : '#'} aria-disabled={!ready} className={cn('btn-xs inline-flex min-h-11 items-center border border-teal-lum px-3 text-[12px] font-medium text-teal-lum hover:bg-teal-lum hover:text-field sm:min-h-9', !ready && 'pointer-events-none opacity-50')}>
            Compare selected <ArrowIcon />
          </Link>
          <button type="button" onClick={clear} className="icon-button min-h-11 text-text-2-dark hover:bg-white/10 hover:text-surface sm:min-h-9 sm:min-w-9" aria-label="Clear comparison">
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
