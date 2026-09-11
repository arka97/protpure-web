'use client'

import * as React from 'react'
import { Check, Plus, ShoppingBasket, X } from 'lucide-react'
import { useBasket } from './BasketProvider'
import { Modal } from './Modal'
import { controlClass } from './BasketLines'
import { GRADE_LABELS, ITEM_PURPOSES, SAMPLE_KIT_POLICY, matchPackSize, type BasketProduct, type GradeValue, type PurposeValue } from '@/lib/rfq'
import { cn } from '@/lib/utils'

export type AddPreset = { grade?: GradeValue | null; packSize?: string | null; catalogNumber?: string | null; purpose?: PurposeValue; quantity?: number }

/**
 * "Add to RFQ basket" button. With a `preset` (pack-size table rows) it adds immediately; otherwise
 * it opens a small picker for grade, pack size, quantity and purpose when the product offers a choice.
 */
export function AddToBasketButton({
  product,
  preset,
  label = 'Add to RFQ basket',
  addedLabel = 'Added',
  appearance = 'secondary',
  size = 'sm',
  className,
  iconOnly,
}: {
  product: BasketProduct
  preset?: AddPreset
  label?: string
  addedLabel?: string
  appearance?: 'primary' | 'secondary' | 'ghost' | 'onDark'
  size?: 'sm' | 'md'
  className?: string
  iconOnly?: boolean
}) {
  const { add, open } = useBasket()
  const [picker, setPicker] = React.useState(false)
  const [added, setAdded] = React.useState(false)
  const timer = React.useRef<number | null>(null)

  React.useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current)
  }, [])

  const flash = () => {
    setAdded(true)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setAdded(false), 2000)
  }

  const needsChoice = !preset && (product.grades.length > 1 || product.packSizes.length > 1)

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (added) {
      open()
      return
    }
    if (needsChoice) {
      setPicker(true)
      return
    }
    add({ product, ...(preset ?? {}) })
    flash()
  }

  const appearanceClass = { primary: 'btn-primary', secondary: 'btn-secondary', ghost: 'btn-ghost', onDark: 'btn-on-dark' }[appearance]

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={cn(appearanceClass, size === 'sm' && 'btn-sm', 'min-h-11 sm:min-h-0', iconOnly && 'px-2.5', added && 'border-teal-500 text-teal-600', className)}
        aria-label={iconOnly ? `${label}: ${product.name}` : undefined}
        aria-live="polite"
      >
        {added ? <Check className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
        {iconOnly ? null : added ? `${addedLabel} · View basket` : label}
      </button>
      {needsChoice ? (
        <AddToBasketDialog
          product={product}
          open={picker}
          onClose={() => setPicker(false)}
          onAdd={(input) => {
            add({ product, ...input })
            setPicker(false)
            flash()
          }}
        />
      ) : null}
    </>
  )
}

function AddToBasketDialog({ product, open, onClose, onAdd }: { product: BasketProduct; open: boolean; onClose: () => void; onAdd: (input: AddPreset) => void }) {
  const id = React.useId()
  return (
    <Modal open={open} onClose={onClose} labelledBy={`${id}-title`} panelClassName="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-6">
      <AddToBasketForm product={product} titleId={`${id}-title`} onClose={onClose} onAdd={onAdd} />
    </Modal>
  )
}

function AddToBasketForm({ product, titleId, onClose, onAdd }: { product: BasketProduct; titleId: string; onClose: () => void; onAdd: (input: AddPreset) => void }) {
  const [grade, setGrade] = React.useState<GradeValue | ''>(product.grades.length === 1 ? product.grades[0] : '')
  const [packSize, setPackSize] = React.useState(product.packSizes.length === 1 ? product.packSizes[0].size : '')
  const [quantity, setQuantity] = React.useState(1)
  const [purpose, setPurpose] = React.useState<PurposeValue>('production')
  const packOptions = product.packSizes.filter((ps) => !ps.grade || !grade || ps.grade === grade)
  const pack = matchPackSize(product, packSize, grade || null)

  return (
    <form
      className="card w-full max-w-md rounded-b-none p-5 sm:rounded-b-2xl sm:p-6"
      onSubmit={(e) => {
        e.preventDefault()
        onAdd({ grade: grade || null, packSize: packSize || null, catalogNumber: pack?.catalogNumber ?? null, quantity, purpose })
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Add to RFQ basket</p>
          <h2 id={titleId} className="heading-3 mt-1">
            {product.name}
          </h2>
        </div>
        <button type="button" onClick={onClose} className="btn-ghost -mr-2 -mt-2 h-11 w-11 p-0 sm:h-9 sm:w-9" aria-label="Close">
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>
      <div className="mt-5 grid gap-4">
        {product.grades.length ? (
          <div>
            <label htmlFor={`${titleId}-grade`} className="mb-1.5 block text-sm font-medium text-ink">
              Grade
            </label>
            <select id={`${titleId}-grade`} className={controlClass} value={grade} onChange={(e) => setGrade(e.target.value as GradeValue | '')}>
              <option value="">Any / advise me</option>
              {product.grades.map((g) => (
                <option key={g} value={g}>
                  {GRADE_LABELS[g]}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div className="grid grid-cols-[1fr_5.5rem] gap-3">
          <div>
            <label htmlFor={`${titleId}-pack`} className="mb-1.5 block text-sm font-medium text-ink">
              Pack size
            </label>
            {product.packSizes.length ? (
              <select id={`${titleId}-pack`} className={controlClass} value={packSize} onChange={(e) => setPackSize(e.target.value)}>
                <option value="">Not sure yet</option>
                {packOptions.map((ps) => (
                  <option key={ps.size} value={ps.size}>
                    {ps.size}
                    {ps.catalogNumber ? ` · ${ps.catalogNumber}` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <input id={`${titleId}-pack`} className={controlClass} value={packSize} onChange={(e) => setPackSize(e.target.value)} placeholder="e.g. 1 L" />
            )}
          </div>
          <div>
            <label htmlFor={`${titleId}-qty`} className="mb-1.5 block text-sm font-medium text-ink">
              Qty
            </label>
            <input id={`${titleId}-qty`} type="number" inputMode="numeric" min={1} max={10000} className={controlClass} value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.floor(Number(e.target.value) || 1)))} />
          </div>
        </div>
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-ink">What is this for?</legend>
          <div className="grid gap-1.5">
            {ITEM_PURPOSES.map((p) => (
              <label key={p.value} className={cn('flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition', purpose === p.value ? 'border-teal-500 bg-teal-50 text-teal-600' : 'border-line bg-white text-ink-soft hover:border-navy-900/30')}>
                <input type="radio" name="purpose" value={p.value} checked={purpose === p.value} onChange={() => setPurpose(p.value)} className="accent-teal-500" />
                {p.label}
              </label>
            ))}
          </div>
          {purpose === 'sample-kit' ? <p className="mt-2 text-xs text-ink-soft">{SAMPLE_KIT_POLICY}</p> : null}
        </fieldset>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
        <button type="button" onClick={onClose} className="btn-secondary btn-sm min-h-11 sm:min-h-0">
          Cancel
        </button>
        <button type="submit" className="btn-primary btn-sm min-h-11 sm:min-h-0">
          <ShoppingBasket className="h-4 w-4" aria-hidden /> Add to basket
        </button>
      </div>
    </form>
  )
}
