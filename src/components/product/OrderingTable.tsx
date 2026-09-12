'use client'

import * as React from 'react'
import { AddToBasketButton } from '@/components/rfq/AddToBasketButton'
import { GRADE_LABELS, type BasketProduct, type GradeValue } from '@/lib/rfq'

/**
 * Pack-size table for the product page: one grade select for the whole table (catalogue numbers
 * identify pack sizes; the grade travels as its own RFQ line field — no grade suffix is invented),
 * then a row per pack with the catalogue number in mono, a quantity input and one Add to RFQ.
 * On phones the same rows render as a stacked list so the action never hides behind a scroll.
 */
export function OrderingTable({ product, defaultGrade, className }: { product: BasketProduct; defaultGrade?: GradeValue | null; className?: string }) {
  const id = React.useId()
  const [grade, setGrade] = React.useState<GradeValue | ''>(defaultGrade && product.grades.includes(defaultGrade) ? defaultGrade : (product.grades[0] ?? ''))
  const [qty, setQty] = React.useState<Record<string, number>>({})
  const rows = product.packSizes.filter((ps) => !ps.grade || !grade || ps.grade === grade)
  const anyCode = rows.some((r) => r.catalogNumber)
  const quantity = (size: string) => qty[size] ?? 1
  const setQuantity = (size: string, v: string) => setQty((q) => ({ ...q, [size]: Math.max(1, Math.floor(Number(v) || 1)) }))
  const addLabel = grade ? `Add ${GRADE_LABELS[grade]} to RFQ` : 'Add to RFQ'

  const qtyInput = (ps: (typeof rows)[number], suffix: string) => (
    <>
      <label className="sr-only" htmlFor={`${id}-${suffix}-${ps.size}`}>
        Quantity for {ps.size}
      </label>
      <input id={`${id}-${suffix}-${ps.size}`} type="number" inputMode="numeric" min={1} max={10000} value={quantity(ps.size)} onChange={(e) => setQuantity(ps.size, e.target.value)} className="field-control mono w-[5.5rem] px-2.5 py-1.5 text-[13px] lg:min-h-9" />
    </>
  )
  const addButton = (ps: (typeof rows)[number]) => (
    <AddToBasketButton product={product} preset={{ grade: grade || ps.grade || null, packSize: ps.size, catalogNumber: ps.catalogNumber ?? null, quantity: quantity(ps.size) }} appearance="teal" size="xs" className="min-h-11 whitespace-nowrap lg:min-h-8" addedLabel="Added" />
  )

  return (
    <div className={className}>
      {product.grades.length > 1 ? (
        <label htmlFor={`${id}-grade`} className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-ink">
          <span className="font-medium">Your grade</span>
          <span className="block w-full max-w-[240px]">
            <select id={`${id}-grade`} value={grade} onChange={(e) => setGrade(e.target.value as GradeValue | '')} className="field-control py-2.5 pr-9">
              {product.grades.map((g) => (
                <option key={g} value={g}>
                  {GRADE_LABELS[g]}
                </option>
              ))}
            </select>
          </span>
        </label>
      ) : null}

      {/* ≥ 640 px: the table */}
      <div className="hidden overflow-x-auto sm:block" role="region" aria-label="Pack sizes" tabIndex={0}>
        <table className="spec-table ordering-table">
          <thead>
            <tr>
              <th scope="col">Pack size</th>
              {anyCode ? <th scope="col">Catalogue no.</th> : null}
              <th scope="col" className="w-[6.5rem]">
                Qty
              </th>
              <th scope="col" className="text-right">
                {addLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((ps) => (
              <tr key={`${ps.size}-${ps.catalogNumber ?? ''}`}>
                <th scope="row" className="mono whitespace-nowrap font-medium text-ink">
                  {ps.size}
                </th>
                {anyCode ? <td className="mono whitespace-nowrap">{ps.catalogNumber || 'On request'}</td> : null}
                <td>{qtyInput(ps, 't')}</td>
                <td className="text-right">{addButton(ps)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* < 640 px: stacked rows, one action each */}
      <ul className="divide-y divide-rule border-y border-rule sm:hidden" aria-label="Pack sizes">
        {rows.map((ps) => (
          <li key={`${ps.size}-${ps.catalogNumber ?? ''}`} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 py-3">
            <div className="min-w-0">
              <p className="mono text-[14px] font-medium text-ink">{ps.size}</p>
              {anyCode ? <p className="mono text-[11px] text-text-2">{ps.catalogNumber || 'On request'}</p> : null}
            </div>
            <div className="flex items-center gap-3">
              <div>{qtyInput(ps, 'l')}</div>
              {addButton(ps)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
