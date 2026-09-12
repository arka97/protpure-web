'use client'

import * as React from 'react'
import { useBasket } from './BasketProvider'
import { Modal } from './Modal'
import { controlClass } from './BasketLines'
import { BasketIcon, CheckIcon, CloseIcon, PlusIcon } from '@/components/visual/icons'
import { GRADE_LABELS, ITEM_PURPOSES, SAMPLE_KIT_POLICY, matchPackSize, type BasketProduct, type GradeValue, type PurposeValue } from '@/lib/rfq'
import { cn } from '@/lib/utils'

export type AddPreset = { grade?: GradeValue | null; packSize?: string | null; catalogNumber?: string | null; purpose?: PurposeValue; quantity?: number }

/**
 * "Add to RFQ" button. With a `preset` (pack-size table rows) it adds immediately; otherwise
 * it opens a small picker for grade, pack size, quantity and purpose when the product offers a choice.
 * Appearance follows the button system: `teal` is the luminous fill used on white product cards.
 */
export function AddToBasketButton({
  product,
  preset,
  label = 'Add to RFQ',
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
  appearance?: 'primary' | 'secondary' | 'ghost' | 'onDark' | 'teal'
  size?: 'sm' | 'md' | 'xs'
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

  const appearanceClass = { primary: 'btn-primary', secondary: 'btn-secondary', ghost: 'btn-ghost', onDark: 'btn-on-dark', teal: 'btn-teal' }[appearance]

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={cn(appearanceClass, size === 'sm' && 'btn-sm', size === 'xs' && 'btn-xs', 'min-h-11 sm:min-h-0', iconOnly && 'px-2.5', added && 'border-teal-deep text-teal-deep', className)}
        aria-label={iconOnly ? `${label}: ${product.name}` : undefined}
        aria-live="polite"
      >
        {iconOnly ? null : added ? `${addedLabel} · View basket` : label}
        {added ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
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
  const labelClass = 'mb-1.5 block text-[12px] font-medium text-ink'

  return (
    <form
      className="w-full max-w-md border border-rule bg-white p-5 text-ink shadow-panel sm:p-6"
      onSubmit={(e) => {
        e.preventDefault()
        onAdd({ grade: grade || null, packSize: packSize || null, catalogNumber: pack?.catalogNumber ?? null, quantity, purpose })
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Add to RFQ basket</p>
          <h2 id={titleId} className="font-display text-[28px] leading-[1.05] tracking-[-0.03em]">
            {product.name}
          </h2>
        </div>
        <button type="button" onClick={onClose} className="icon-button -mr-3 -mt-2 text-text-2 hover:text-ink" aria-label="Close">
          <CloseIcon />
        </button>
      </div>
      <div className="mt-5 grid gap-4">
        {product.grades.length ? (
          <div>
            <label htmlFor={`${titleId}-grade`} className={labelClass}>
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
            <label htmlFor={`${titleId}-pack`} className={labelClass}>
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
            <label htmlFor={`${titleId}-qty`} className={labelClass}>
              Qty
            </label>
            <input id={`${titleId}-qty`} type="number" inputMode="numeric" min={1} max={10000} className={cn(controlClass, 'num')} value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.floor(Number(e.target.value) || 1)))} />
          </div>
        </div>
        <fieldset>
          <legend className={labelClass}>What is this for?</legend>
          <div className="grid gap-1.5">
            {ITEM_PURPOSES.map((p) => (
              <label key={p.value} className={cn('flex min-h-11 cursor-pointer items-center gap-3 border px-3 py-2 text-[13px] transition-colors', purpose === p.value ? 'border-teal-deep bg-tint text-tint-ink' : 'border-rule bg-white text-text-2 hover:border-rule-strong')}>
                <input type="radio" name="purpose" value={p.value} checked={purpose === p.value} onChange={() => setPurpose(p.value)} />
                {p.label}
              </label>
            ))}
          </div>
          {purpose === 'sample-kit' ? <p className="mt-2 text-[12px] leading-[1.6] text-text-2">{SAMPLE_KIT_POLICY}</p> : null}
        </fieldset>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
        <button type="button" onClick={onClose} className="btn-secondary btn-sm min-h-11">
          Cancel
        </button>
        <button type="submit" className="btn-primary btn-sm min-h-11">
          Add to RFQ <BasketIcon />
        </button>
      </div>
    </form>
  )
}
