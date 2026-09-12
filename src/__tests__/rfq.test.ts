import { describe, expect, it } from 'vitest'
import { basketReducer, describeItem, GRADE_VALUES, ITEM_PURPOSES, lineKey, makeItem, MAX_BASKET_ITEMS, normalizeBasket, toInquiryItem, type BasketItem, type BasketProduct } from '@/lib/rfq'
import { inquiryItemSchema, inquirySchema } from '@/lib/inquiries'
import { GRADE_OPTIONS } from '@/collections/Products'

const sp: BasketProduct = {
  id: 1,
  slug: 'sp-agarose',
  name: 'SP Agarose',
  category: 'Ion exchange',
  grades: ['faster', 'fast-flow', 'precise', 'hr'],
  packSizes: [
    { size: '50 mL', catalogNumber: 'SP01' },
    { size: '1 L', catalogNumber: 'SP05' },
    { size: 'Bulk (custom)', catalogNumber: 'SP09' },
  ],
}
const columns: BasketProduct = { id: 14, slug: 'ni-nta-prepacked-columns', name: 'Ni-NTA Pre-packed Columns', grades: [], packSizes: [{ size: '1 mL × 5 columns', catalogNumber: 'LN01' }] }
const single: BasketProduct = { id: 99, slug: 'single', name: 'Single option', grades: ['fast-flow'], packSizes: [{ size: '100 mL', catalogNumber: 'X1', grade: 'fast-flow' }] }

describe('grade constants', () => {
  it('match the Products collection GRADE_OPTIONS', () => {
    expect([...GRADE_VALUES]).toEqual(GRADE_OPTIONS.map((g) => g.value))
  })
  it('include the paid sample kit purpose', () => {
    expect(ITEM_PURPOSES.map((p) => p.value)).toEqual(['sample-kit', 'evaluation', 'production', 'other'])
  })
})

describe('makeItem', () => {
  it('fills catalog number from the pack size and defaults purpose/quantity', () => {
    const item = makeItem({ product: sp, packSize: '1 L', grade: 'precise' }, 'k1')
    expect(item).toMatchObject({ key: 'k1', grade: 'precise', packSize: '1 L', catalogNumber: 'SP05', quantity: 1, purpose: 'production', notes: '' })
  })
  it('auto-selects the only grade / pack size and takes the grade from the pack row', () => {
    const item = makeItem({ product: single })
    expect(item.grade).toBe('fast-flow')
    expect(item.packSize).toBe('100 mL')
    expect(item.catalogNumber).toBe('X1')
  })
  it('drops grades the product does not offer and clamps quantity', () => {
    const item = makeItem({ product: columns, grade: 'hr', quantity: 0 })
    expect(item.grade).toBeNull()
    expect(item.quantity).toBe(1)
    expect(makeItem({ product: sp, quantity: 1e9 }).quantity).toBe(10000)
  })
})

describe('basketReducer', () => {
  const add = (state: BasketItem[], input: Parameters<typeof makeItem>[0], key?: string) => basketReducer(state, { type: 'add', input, key })

  it('adds lines and merges identical product/grade/pack/purpose', () => {
    let s = add([], { product: sp, grade: 'precise', packSize: '1 L' }, 'a')
    s = add(s, { product: columns }, 'b')
    expect(s).toHaveLength(2)
    s = add(s, { product: sp, grade: 'precise', packSize: '1 L', quantity: 2 }, 'c')
    expect(s).toHaveLength(2)
    expect(s[0]).toMatchObject({ key: 'a', quantity: 3 })
    // a different purpose is a separate line
    s = add(s, { product: sp, grade: 'precise', packSize: '1 L', purpose: 'sample-kit' }, 'd')
    expect(s).toHaveLength(3)
    expect(new Set(s.map(lineKey)).size).toBe(3)
  })

  it('updates a line, re-deriving the catalog number from the pack size', () => {
    let s = add([], { product: sp, packSize: '50 mL' }, 'a')
    s = basketReducer(s, { type: 'update', key: 'a', patch: { packSize: '1 L', quantity: 4 } })
    expect(s[0]).toMatchObject({ packSize: '1 L', catalogNumber: 'SP05', quantity: 4 })
    s = basketReducer(s, { type: 'update', key: 'a', patch: { grade: 'hr', notes: 'for a 5 cm column' } })
    expect(s[0]).toMatchObject({ grade: 'hr', notes: 'for a 5 cm column' })
    s = basketReducer(s, { type: 'update', key: 'a', patch: { quantity: -3 } })
    expect(s[0].quantity).toBe(1)
    expect(basketReducer(s, { type: 'update', key: 'nope', patch: { quantity: 2 } })).toBe(s)
  })

  it('merges two lines when an edit makes them identical', () => {
    let s = add([], { product: sp, grade: 'precise', packSize: '1 L', quantity: 2 }, 'a')
    s = add(s, { product: sp, grade: 'hr', packSize: '1 L', quantity: 3 }, 'b')
    s = basketReducer(s, { type: 'update', key: 'b', patch: { grade: 'precise' } })
    expect(s).toHaveLength(1)
    expect(s[0]).toMatchObject({ key: 'a', quantity: 5 })
  })

  it('removes, clears and caps the number of lines', () => {
    let s = add([], { product: sp }, 'a')
    s = add(s, { product: columns }, 'b')
    expect(basketReducer(s, { type: 'remove', key: 'a' }).map((i) => i.key)).toEqual(['b'])
    expect(basketReducer(s, { type: 'clear' })).toEqual([])
    let big: BasketItem[] = []
    for (let i = 0; i < MAX_BASKET_ITEMS + 5; i++) big = add(big, { product: { ...sp, id: 1000 + i } }, `k${i}`)
    expect(big).toHaveLength(MAX_BASKET_ITEMS)
  })
})

describe('normalizeBasket', () => {
  it('accepts the persisted shape and drops garbage', () => {
    const stored = { v: 1, items: [{ key: 'a', product: sp, grade: 'precise', packSize: '1 L', catalogNumber: 'SP05', quantity: '2', purpose: 'sample-kit', notes: 'x' }, { key: 'bad' }, { product: { id: 'nope' } }, null, { product: { id: 7, name: 'Loose' }, quantity: 'many', purpose: 'free-sample', grade: 'ultra' }] }
    const items = normalizeBasket(stored)
    expect(items).toHaveLength(2)
    expect(items[0]).toMatchObject({ key: 'a', grade: 'precise', quantity: 2, purpose: 'sample-kit' })
    expect(items[1]).toMatchObject({ product: { id: 7, name: 'Loose', grades: [], packSizes: [] }, quantity: 1, purpose: 'production', grade: null })
    expect(items[1].key).toBeTruthy()
  })
  it('handles non-objects and bare arrays', () => {
    expect(normalizeBasket('nope')).toEqual([])
    expect(normalizeBasket(null)).toEqual([])
    expect(normalizeBasket([{ key: 'a', product: columns, quantity: 1, purpose: 'other' }])).toHaveLength(1)
  })
})

describe('toInquiryItem / describeItem', () => {
  it('serialises a line for the server and describes it for humans', () => {
    const item = makeItem({ product: sp, grade: 'precise', packSize: '1 L', quantity: 2, purpose: 'sample-kit' }, 'a')
    expect(toInquiryItem(item)).toEqual({ productId: 1, productName: 'SP Agarose', grade: 'precise', packSize: '1 L', catalogNumber: 'SP05', quantity: 2, purpose: 'sample-kit', notes: '' })
    expect(describeItem(toInquiryItem(item))).toBe('SP Agarose — Precise · 1 L (SP05) × 2 · sample kit')
    expect(describeItem({ productName: 'Custom ligand' })).toBe('Custom ligand')
  })
})

describe('inquirySchema items', () => {
  it('accepts structured items with defaults', () => {
    const r = inquirySchema.safeParse({ type: 'quote', name: 'Ada', email: 'ada@example.com', items: [{ productId: '1', productName: 'SP Agarose', grade: 'precise', packSize: '1 L', quantity: '2', purpose: 'sample-kit' }, { productSlug: 'ni-nta-agarose' }] })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.items?.[0]).toMatchObject({ productId: 1, quantity: 2, purpose: 'sample-kit' })
      expect(r.data.items?.[1]).toMatchObject({ productSlug: 'ni-nta-agarose', quantity: 1, purpose: 'production' })
    }
  })
  it('rejects items without any product reference, bad grades/purposes and oversized baskets', () => {
    expect(inquiryItemSchema.safeParse({ quantity: 1 }).success).toBe(false)
    expect(inquiryItemSchema.safeParse({ productName: 'X', grade: 'ultra' }).success).toBe(false)
    expect(inquiryItemSchema.safeParse({ productName: 'X', purpose: 'free-sample' }).success).toBe(false)
    expect(inquiryItemSchema.safeParse({ productName: 'X', quantity: 0 }).success).toBe(false)
    const tooMany = Array.from({ length: MAX_BASKET_ITEMS + 1 }, (_, i) => ({ productName: `P${i}` }))
    expect(inquirySchema.safeParse({ type: 'quote', name: 'Ada', email: 'ada@example.com', items: tooMany }).success).toBe(false)
  })
  it('still accepts the legacy productIds / requestedItems form', () => {
    const r = inquirySchema.safeParse({ type: 'quote', name: 'Ada', email: 'ada@example.com', productIds: ['3', 4], requestedItems: 'SP Agarose Precise 2 × 1 L' })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.productIds).toEqual([3, 4])
      expect(r.data.items).toBeUndefined()
    }
  })
})
