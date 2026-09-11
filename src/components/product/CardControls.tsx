'use client'

import * as React from 'react'
import { AddToBasketButton } from '@/components/rfq/AddToBasketButton'
import { CompareCheckbox } from './CompareToggle'
import { GRADE_LABELS, matchPackSize, type BasketProduct, type GradeValue } from '@/lib/rfq'
import { cn } from '@/lib/utils'

const selectClass = 'field-control mt-1 min-h-11 bg-surface px-2 py-1.5 text-[11px] leading-tight sm:min-h-9'

/**
 * The orderable part of a product card: grade and pack-size selects feeding one Add to RFQ action,
 * plus the Compare checkbox. The selects default to the reference grade (Fast Flow when the product
 * ships it) and the first pack; the chosen catalogue number travels with the basket line.
 */
export function CardControls({ product, defaultGrade }: { product: BasketProduct; defaultGrade?: GradeValue | null }) {
  const id = React.useId()
  const [grade, setGrade] = React.useState<GradeValue | ''>(defaultGrade && product.grades.includes(defaultGrade) ? defaultGrade : (product.grades[0] ?? ''))
  const packOptions = product.packSizes.filter((ps) => !ps.grade || !grade || ps.grade === grade)
  const [pack, setPack] = React.useState(packOptions[0]?.size ?? '')
  const packValue = packOptions.some((ps) => ps.size === pack) ? pack : (packOptions[0]?.size ?? '')
  const matched = matchPackSize(product, packValue || null, grade || null)
  const hasSelects = product.grades.length > 0 || product.packSizes.length > 0

  return (
    <div className="relative z-10 mt-auto border-t border-rule pt-3.5">
      {hasSelects ? (
        <div className={cn('mb-3 grid gap-2.5', product.grades.length && product.packSizes.length ? 'grid-cols-2' : 'grid-cols-1')}>
          {product.grades.length ? (
            <label htmlFor={`${id}-grade`} className="block text-[9px] uppercase tracking-[0.08em] text-text-2">
              Grade
              <select id={`${id}-grade`} className={selectClass} value={grade} onChange={(e) => setGrade(e.target.value as GradeValue | '')}>
                {product.grades.map((g) => (
                  <option key={g} value={g}>
                    {GRADE_LABELS[g]}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {product.packSizes.length ? (
            <label htmlFor={`${id}-pack`} className="block text-[9px] uppercase tracking-[0.08em] text-text-2">
              Pack size
              <select id={`${id}-pack`} className={selectClass} value={packValue} onChange={(e) => setPack(e.target.value)}>
                {packOptions.map((ps) => (
                  <option key={ps.size} value={ps.size}>
                    {ps.size}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      ) : null}
      <div className="flex items-center justify-between gap-2">
        <CompareCheckbox slug={product.slug} name={product.name} />
        <AddToBasketButton product={product} preset={{ grade: grade || null, packSize: packValue || null, catalogNumber: matched?.catalogNumber ?? null }} appearance="teal" size="xs" className="min-h-11 sm:min-h-[35px]" />
      </div>
    </div>
  )
}
