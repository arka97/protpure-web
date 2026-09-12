'use client'

import * as React from 'react'
import Link from 'next/link'
import { useBasket } from './BasketProvider'
import { TrashIcon } from '@/components/visual/icons'
import { GRADE_LABELS, ITEM_PURPOSES, SAMPLE_KIT_POLICY, type BasketItem, type GradeValue, type PurposeValue } from '@/lib/rfq'
import { cn } from '@/lib/utils'

/** Shared control styling: 44 px targets on touch screens, denser on desktop. */
export const controlClass = 'field-control text-[13px] sm:min-h-10 sm:py-2'

export const OTHER_PACK = '__other__'

/** Grade / pack size / quantity / purpose / notes controls for one basket line. */
export function LineFields({ item, layout = 'stack', idPrefix }: { item: BasketItem; layout?: 'stack' | 'row'; idPrefix: string }) {
  const { update } = useBasket()
  const { product } = item
  const packOptions = product.packSizes.filter((ps) => !ps.grade || !item.grade || ps.grade === item.grade)
  const packValue = item.packSize ? (packOptions.some((ps) => ps.size === item.packSize) ? item.packSize : OTHER_PACK) : ''
  const label = (text: string, htmlFor: string) => (
    <label htmlFor={htmlFor} className={cn('mb-1.5 block text-[11px] font-medium text-text-2', layout === 'row' && 'sm:sr-only')}>
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
    <Link href={`/products/${product.slug}`} onClick={onNavigate} className="text-[17px] font-medium leading-tight text-ink hover:text-teal-deep">
      {product.name}
    </Link>
  ) : (
    <span className="text-[17px] font-medium leading-tight text-ink">{product.name}</span>
  )
  return (
    <div className="min-w-0">
      {title}
      <p className="mt-1 text-[11px] text-text-2">
        {product.category ? <span>{product.category}</span> : null}
        {product.category && item.catalogNumber ? ' · ' : null}
        {item.catalogNumber ? <span className="mono">Cat. {item.catalogNumber}</span> : null}
        {!product.category && !item.catalogNumber ? 'Protpure resin' : null}
      </p>
    </div>
  )
}

export function RemoveLineButton({ item, className }: { item: BasketItem; className?: string }) {
  const { remove } = useBasket()
  return (
    <button type="button" onClick={() => remove(item.key)} className={cn('icon-button -mr-2 shrink-0 text-text-2 hover:text-error', className)} aria-label={`Remove ${item.product.name} from basket`}>
      <TrashIcon className="h-4 w-4" />
    </button>
  )
}

/** Stacked list of lines (drawer). */
export function BasketLineList({ onNavigate }: { onNavigate?: () => void }) {
  const { items } = useBasket()
  return (
    <ul className="divide-y divide-rule">
      {items.map((item, i) => (
        <li key={item.key} className="py-5">
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
    <div className="border border-rule bg-white">
      <div className="hidden grid-cols-[minmax(0,1.4fr)_1fr_1fr_5rem_1fr_2.25rem] gap-3 border-b border-rule-strong bg-surface-recessed px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-text-2 sm:grid" aria-hidden>
        <span>Product</span>
        <span>Grade</span>
        <span>Pack size</span>
        <span>Qty</span>
        <span>Purpose</span>
        <span />
      </div>
      <ul className="divide-y divide-rule">
        {items.map((item, i) => (
          <li key={item.key} className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1.4fr)_1fr_1fr_5rem_1fr_2.25rem] sm:items-start">
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
      {hasSampleKit ? <p className="border-t border-rule bg-surface px-4 py-3 text-[12px] leading-[1.6] text-text-2">{SAMPLE_KIT_POLICY}</p> : null}
    </div>
  )
}
