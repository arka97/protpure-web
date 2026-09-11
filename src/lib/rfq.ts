/**
 * RFQ (request-for-quote) basket: shared types, constants and pure state logic.
 *
 * This module is imported by client components, server code and the Payload collection, so it
 * must stay free of server-only imports (no `payload`, `next/cache`, collections…).
 */
import type { Product, ProductCategory } from '@/payload-types'

export const BASKET_STORAGE_KEY = 'protpure.rfq.v1'
export const MAX_BASKET_ITEMS = 50
export const MAX_ITEM_QUANTITY = 10000

/** Particle-size grades. Kept in sync with `GRADE_OPTIONS` in `src/collections/Products.ts` (checked by a unit test). */
export const GRADE_VALUES = ['faster', 'fast-flow', 'precise', 'hr'] as const
export type GradeValue = (typeof GRADE_VALUES)[number]
export const GRADE_LABELS: Record<GradeValue, string> = { faster: 'Faster', 'fast-flow': 'Fast Flow', precise: 'Precise', hr: 'HR' }

/**
 * Why a line is requested. Protpure sells paid sample kits (5–25 mL packs or a 1 mL pre-packed
 * column, credited against the first bulk order) — there are no free samples.
 */
export const ITEM_PURPOSES = [
  { label: 'Sample kit (paid, credited against first bulk order)', value: 'sample-kit', short: 'Sample kit' },
  { label: 'Evaluation / pilot quantity', value: 'evaluation', short: 'Evaluation' },
  { label: 'Bulk / production quantity', value: 'production', short: 'Bulk / production' },
  { label: 'Other', value: 'other', short: 'Other' },
] as const
export type PurposeValue = (typeof ITEM_PURPOSES)[number]['value']
export const PURPOSE_VALUES = ITEM_PURPOSES.map((p) => p.value) as [PurposeValue, ...PurposeValue[]]
export const purposeLabel = (v: string | null | undefined, short = false) => {
  const p = ITEM_PURPOSES.find((x) => x.value === v)
  return p ? (short ? p.short : p.label) : ''
}

export const SAMPLE_KIT_POLICY = 'Sample kits are paid (5–25 mL packs or a 1 mL pre-packed column) and the cost is credited against your first bulk order. We do not ship free samples.'

/** The slice of a product the basket needs so lines can be edited offline. */
export type BasketProduct = {
  id: number
  slug: string
  name: string
  category?: string | null
  grades: GradeValue[]
  packSizes: { size: string; grade?: GradeValue | null; catalogNumber?: string | null }[]
}

export type BasketItem = {
  /** Stable line id (client-generated). */
  key: string
  product: BasketProduct
  grade: GradeValue | null
  packSize: string | null
  catalogNumber: string | null
  quantity: number
  purpose: PurposeValue
  notes: string
}

/** Shape sent to the server (and accepted by the API / MCP). */
export type InquiryItemInput = {
  productId?: number
  productName: string
  grade?: GradeValue | ''
  packSize?: string
  catalogNumber?: string
  quantity: number
  purpose: PurposeValue
  notes?: string
}

export function toBasketProduct(p: Product): BasketProduct {
  const cat = p.category && typeof p.category === 'object' ? (p.category as ProductCategory) : null
  return {
    id: p.id,
    slug: p.slug ?? '',
    name: p.name,
    category: cat?.name ?? null,
    grades: (p.grades ?? []).map((g) => g.grade).filter((g): g is GradeValue => (GRADE_VALUES as readonly string[]).includes(g)),
    packSizes: (p.packSizes ?? []).map((ps) => ({ size: ps.size, grade: ps.grade ?? null, catalogNumber: ps.catalogNumber ?? null })),
  }
}

export function toInquiryItem(item: BasketItem): InquiryItemInput {
  return {
    productId: item.product.id,
    productName: item.product.name,
    grade: item.grade ?? '',
    packSize: item.packSize ?? '',
    catalogNumber: item.catalogNumber ?? '',
    quantity: item.quantity,
    purpose: item.purpose,
    notes: item.notes,
  }
}

/** Human-readable one-liner, e.g. "SP Agarose — Precise · 1 L (SP05) × 2 · sample kit". */
export function describeItem(item: { productName: string; grade?: string | null; packSize?: string | null; catalogNumber?: string | null; quantity?: number | null; purpose?: string | null; notes?: string | null }) {
  const spec = [item.grade ? GRADE_LABELS[item.grade as GradeValue] ?? item.grade : null, item.packSize ? `${item.packSize}${item.catalogNumber ? ` (${item.catalogNumber})` : ''}` : item.catalogNumber || null].filter(Boolean).join(' · ')
  const qty = item.quantity && item.quantity > 1 ? ` × ${item.quantity}` : ''
  const purpose = purposeLabel(item.purpose, true)
  return `${item.productName}${spec ? ` — ${spec}` : ''}${qty}${purpose ? ` · ${purpose.toLowerCase()}` : ''}${item.notes ? ` (${item.notes})` : ''}`
}

/** Lines with the same product / grade / pack / purpose merge into one (quantities add up). */
export const lineKey = (i: Pick<BasketItem, 'product' | 'grade' | 'packSize' | 'purpose'>) => `${i.product.id}|${i.grade ?? ''}|${i.packSize ?? ''}|${i.purpose}`

export const newKey = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`)

export type AddInput = {
  product: BasketProduct
  grade?: GradeValue | null
  packSize?: string | null
  catalogNumber?: string | null
  quantity?: number
  purpose?: PurposeValue
  notes?: string
}

export type BasketAction =
  | { type: 'hydrate'; items: BasketItem[] }
  | { type: 'add'; input: AddInput; key?: string }
  | { type: 'update'; key: string; patch: Partial<Omit<BasketItem, 'key' | 'product'>> }
  | { type: 'remove'; key: string }
  | { type: 'clear' }

const clampQty = (q: unknown) => {
  const n = Math.floor(Number(q))
  return Number.isFinite(n) && n >= 1 ? Math.min(n, MAX_ITEM_QUANTITY) : 1
}

/** Pick the catalogue number for a pack size (and its grade, if the pack row defines one). */
export function matchPackSize(product: BasketProduct, packSize: string | null | undefined, grade?: GradeValue | null) {
  if (!packSize) return null
  return product.packSizes.find((ps) => ps.size === packSize && (!ps.grade || !grade || ps.grade === grade)) ?? product.packSizes.find((ps) => ps.size === packSize) ?? null
}

export function makeItem(input: AddInput, key = newKey()): BasketItem {
  const grade = input.grade && input.product.grades.includes(input.grade) ? input.grade : input.product.grades.length === 1 ? input.product.grades[0] : null
  const packSize = input.packSize ?? (input.product.packSizes.length === 1 ? input.product.packSizes[0].size : null)
  const pack = matchPackSize(input.product, packSize, grade)
  return {
    key,
    product: input.product,
    grade: pack?.grade ?? grade,
    packSize,
    catalogNumber: input.catalogNumber ?? pack?.catalogNumber ?? null,
    quantity: clampQty(input.quantity ?? 1),
    purpose: input.purpose && (PURPOSE_VALUES as string[]).includes(input.purpose) ? input.purpose : 'production',
    notes: (input.notes ?? '').slice(0, 300),
  }
}

function mergeDuplicates(items: BasketItem[]): BasketItem[] {
  const seen = new Map<string, BasketItem>()
  for (const it of items) {
    const k = lineKey(it)
    const prev = seen.get(k)
    if (prev) seen.set(k, { ...prev, quantity: clampQty(prev.quantity + it.quantity), notes: prev.notes || it.notes })
    else seen.set(k, it)
  }
  return Array.from(seen.values())
}

export function basketReducer(state: BasketItem[], action: BasketAction): BasketItem[] {
  switch (action.type) {
    case 'hydrate':
      return action.items
    case 'add': {
      const item = makeItem(action.input, action.key)
      const k = lineKey(item)
      const idx = state.findIndex((i) => lineKey(i) === k)
      if (idx >= 0) return state.map((i, j) => (j === idx ? { ...i, quantity: clampQty(i.quantity + item.quantity), notes: i.notes || item.notes } : i))
      if (state.length >= MAX_BASKET_ITEMS) return state
      return [...state, item]
    }
    case 'update': {
      const idx = state.findIndex((i) => i.key === action.key)
      if (idx < 0) return state
      const cur = state[idx]
      const next: BasketItem = { ...cur, ...action.patch, key: cur.key, product: cur.product }
      if (action.patch.quantity !== undefined) next.quantity = clampQty(action.patch.quantity)
      if (action.patch.grade !== undefined && next.grade && !cur.product.grades.includes(next.grade)) next.grade = null
      if (action.patch.packSize !== undefined && action.patch.catalogNumber === undefined) {
        const pack = matchPackSize(cur.product, next.packSize, next.grade)
        next.catalogNumber = pack?.catalogNumber ?? null
        if (pack?.grade) next.grade = pack.grade
      }
      if (action.patch.notes !== undefined) next.notes = (action.patch.notes ?? '').slice(0, 300)
      // Editing a line into an existing identical one merges them.
      return mergeDuplicates(state.map((i, j) => (j === idx ? next : i)))
    }
    case 'remove':
      return state.filter((i) => i.key !== action.key)
    case 'clear':
      return []
    default:
      return state
  }
}

/** Validate whatever came out of localStorage; drops anything that does not look like a line. */
export function normalizeBasket(raw: unknown): BasketItem[] {
  const list = Array.isArray(raw) ? raw : raw && typeof raw === 'object' && Array.isArray((raw as { items?: unknown }).items) ? (raw as { items: unknown[] }).items : []
  const out: BasketItem[] = []
  for (const x of list) {
    if (!x || typeof x !== 'object') continue
    const r = x as Record<string, unknown>
    const p = r.product as Record<string, unknown> | undefined
    if (!p || typeof p !== 'object' || typeof p.id !== 'number' || typeof p.name !== 'string') continue
    const product: BasketProduct = {
      id: p.id,
      slug: typeof p.slug === 'string' ? p.slug : '',
      name: p.name,
      category: typeof p.category === 'string' ? p.category : null,
      grades: Array.isArray(p.grades) ? p.grades.filter((g): g is GradeValue => (GRADE_VALUES as readonly string[]).includes(g as string)) : [],
      packSizes: Array.isArray(p.packSizes) ? p.packSizes.filter((ps) => ps && typeof ps === 'object' && typeof (ps as { size?: unknown }).size === 'string').map((ps) => ({ size: String((ps as { size: string }).size), grade: ((ps as { grade?: unknown }).grade as GradeValue) ?? null, catalogNumber: ((ps as { catalogNumber?: unknown }).catalogNumber as string) ?? null })) : [],
    }
    const grade = typeof r.grade === 'string' && (GRADE_VALUES as readonly string[]).includes(r.grade) ? (r.grade as GradeValue) : null
    out.push({
      key: typeof r.key === 'string' && r.key ? r.key : newKey(),
      product,
      grade,
      packSize: typeof r.packSize === 'string' && r.packSize ? r.packSize : null,
      catalogNumber: typeof r.catalogNumber === 'string' && r.catalogNumber ? r.catalogNumber : null,
      quantity: clampQty(r.quantity),
      purpose: typeof r.purpose === 'string' && (PURPOSE_VALUES as string[]).includes(r.purpose) ? (r.purpose as PurposeValue) : 'production',
      notes: typeof r.notes === 'string' ? r.notes.slice(0, 300) : '',
    })
    if (out.length >= MAX_BASKET_ITEMS) break
  }
  return mergeDuplicates(out)
}
