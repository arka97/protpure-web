'use client'

import * as React from 'react'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { useBasket } from './BasketProvider'
import { GRADE_LABELS, ITEM_PURPOSES, SAMPLE_KIT_POLICY, type BasketItem, type GradeValue, type PurposeValue } from '@/lib/rfq'
import { cn } from '@/lib/utils'

/** Shared control styling: 44 px targets on touch screens, denser on desktop. */
export const controlClass = 'min-h-11 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 sm:min-h-9 sm:py-1.5'

export const OTHER_PACK = '__other__'

/** Grade / pack size / quantity / purpose / notes controls for one basket line. */
export function LineFields({ item, layout = 'stack', idPrefix }: { item: BasketItem; layout?: 'stack' | 'row'; idPrefix: string }) {
  const { update } = useBasket()
  const { product } = item
  const packOptions = product.packSizes.filter((ps) => !ps.grade || !item.grade || ps.grade === item.grade)
  const packValue = item.packSize ? (packOptions.some((ps) => ps.size === item.packSize) ? item.packSize : OTHER_PACK) : ''
  const label = (text: string, htmlFor: string) => (
    <label htmlFor={htmlFor} className={cn('mb-1 block text-xs font-medium text-muted', layout === 'row' && 'sm:sr-only')}>
      {text}
    </label>
  )
  return (
    <div className={cn('grid gap-3', layout === 'row' ? 'sm:grid-cols-[1fr_1fr_5rem_1fr] sm:items-end' : 'grid-cols-2')}>
      <div>
        {label('Grade', `${idPrefix}-grade`)}
        <select id={`${idPrefix}-grade`} className={controlClass} value={item.grade ?? ''} onChange={(e) => update(item.key, { grade: (e.target.value || null) as GradeValue | null })} disabled={!product.grades.length}>
          <option value="">{product.grades.length ? 'Any / advise me' : 'n/a'}</option>
          {product.grades.map((g) => (
            <option key={g} value={g}>
              {GRADE_LABELS[g]}
            </option>
          ))}
        </select>
      </div>
      <div>
        {label('Pack size', `${idPrefix}-pack`)}
        {product.packSizes.length ? (
          <select
            id={`${idPrefix}-pack`}
            className={controlClass}
            value={packValue}
            onChange={(e) => {
              const v = e.target.value
              if (v === OTHER_PACK) update(item.key, { packSize: 'Other / custom', catalogNumber: null })
              else update(item.key, { packSize: v || null })
            }}
          >
            <option value="">Not sure yet</option>
            {packOptions.map((ps) => (
              <option key={ps.size} value={ps.size}>
                {ps.size}
                {ps.catalogNumber ? ` · ${ps.catalogNumber}` : ''}
              </option>
            ))}
            <option value={OTHER_PACK}>Other / custom volume</option>
          </select>
        ) : (
          <input id={`${idPrefix}-pack`} className={controlClass} value={item.packSize ?? ''} placeholder="e.g. 1 L" onChange={(e) => update(item.key, { packSize: e.target.value || null, catalogNumber: null })} />
        )}
      </div>
      <div>
        {label('Qty', `${idPrefix}-qty`)}
        <input id={`${idPrefix}-qty`} type="number" inputMode="numeric" min={1} max={10000} className={controlClass} value={item.quantity} onChange={(e) => update(item.key, { quantity: Number(e.target.value) })} aria-label="Quantity" />
      </div>
      <div>
        {label('Purpose', `${idPrefix}-purpose`)}
        <select id={`${idPrefix}-purpose`} className={controlClass} value={item.purpose} onChange={(e) => update(item.key, { purpose: e.target.value as PurposeValue })}>
          {ITEM_PURPOSES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.short}
            </option>
          ))}
        </select>
      </div>
      <div className={cn('col-span-2', layout === 'row' && 'sm:col-span-4')}>
        <label htmlFor={`${idPrefix}-notes`} className="sr-only">
          Line note
        </label>
        <input id={`${idPrefix}-notes`} className={controlClass} value={item.notes} maxLength={300} placeholder={item.packSize === 'Other / custom' ? 'Volume needed, e.g. 20 L bulk' : 'Note (optional): column size, target volume…'} onChange={(e) => update(item.key, { notes: e.target.value })} />
      </div>
    </div>
  )
}

export function LineTitle({ item, link = true, onNavigate }: { item: BasketItem; link?: boolean; onNavigate?: () => void }) {
  const { product } = item
  const title = link && product.slug ? (
    <Link href={`/products/${product.slug}`} onClick={onNavigate} className="font-semibold text-navy-900 hover:text-teal-600">
      {product.name}
    </Link>
  ) : (
    <span className="font-semibold text-navy-900">{product.name}</span>
  )
  return (
    <div className="min-w-0">
      {title}
      <p className="text-xs text-muted">
        {[product.category, item.catalogNumber ? `Cat. ${item.catalogNumber}` : null].filter(Boolean).join(' · ') || 'Protpure resin'}
      </p>
    </div>
  )
}

export function RemoveLineButton({ item, className }: { item: BasketItem; className?: string }) {
  const { remove } = useBasket()
  return (
    <button type="button" onClick={() => remove(item.key)} className={cn('inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-red-50 hover:text-red-600 sm:h-9 sm:w-9', className)} aria-label={`Remove ${item.product.name} from basket`}>
      <Trash2 className="h-4 w-4" aria-hidden />
    </button>
  )
}

/** Stacked list of lines (drawer). */
export function BasketLineList({ onNavigate }: { onNavigate?: () => void }) {
  const { items } = useBasket()
  return (
    <ul className="divide-y divide-line">
      {items.map((item, i) => (
        <li key={item.key} className="py-4">
          <div className="flex items-start justify-between gap-3">
            <LineTitle item={item} onNavigate={onNavigate} />
            <RemoveLineButton item={item} />
          </div>
          <div className="mt-3">
            <LineFields item={item} idPrefix={`drawer-${i}`} />
          </div>
        </li>
      ))}
    </ul>
  )
}

/** Table-like editable list (request-quote form). */
export function BasketTable() {
  const { items } = useBasket()
  const hasSampleKit = items.some((i) => i.purpose === 'sample-kit')
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface-2/50">
      <div className="hidden grid-cols-[minmax(0,1.4fr)_1fr_1fr_5rem_1fr_2.25rem] gap-3 border-b border-line bg-surface-2 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted sm:grid" aria-hidden>
        <span>Product</span>
        <span>Grade</span>
        <span>Pack size</span>
        <span>Qty</span>
        <span>Purpose</span>
        <span />
      </div>
      <ul className="divide-y divide-line">
        {items.map((item, i) => (
          <li key={item.key} className="grid gap-3 px-4 py-3 sm:grid-cols-[minmax(0,1.4fr)_1fr_1fr_5rem_1fr_2.25rem] sm:items-start">
            <div className="flex items-start justify-between gap-2 sm:block">
              <LineTitle item={item} />
              <RemoveLineButton item={item} className="sm:hidden" />
            </div>
            <div className="sm:col-span-4">
              <LineFields item={item} layout="row" idPrefix={`table-${i}`} />
            </div>
            <div className="hidden sm:block">
              <RemoveLineButton item={item} />
            </div>
          </li>
        ))}
      </ul>
      {hasSampleKit ? <p className="border-t border-line px-4 py-2.5 text-xs text-ink-soft">{SAMPLE_KIT_POLICY}</p> : null}
    </div>
  )
}
