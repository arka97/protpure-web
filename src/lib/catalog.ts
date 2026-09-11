import type { Where } from 'payload'
import type { Product, ProductCategory } from '@/payload-types'
import { GRADE_LABELS, GRADE_VALUES, type GradeValue } from './rfq'
import { parseMax, parseNumber, stripUnit } from './figures'

/**
 * Pure helpers shared by the data layer and every renderer of product data (pages, Markdown, JSON
 * API, MCP). Kept free of Next/Payload runtime imports so they can be unit-tested.
 */

/** Collections with `versions.drafts` enabled (see `src/collections/*`). Public reads must exclude drafts. */
export const DRAFT_COLLECTIONS = ['pages', 'posts', 'products', 'updates'] as const

/**
 * Query constraint for a public read of a versioned collection: only published docs, unless draft
 * mode (admin preview / live preview) is on. The local API bypasses access control, so this is the
 * only thing keeping never-published rows (e.g. an empty "Create new" draft) out of the site.
 */
export function publishedWhere(draft: boolean, ...clauses: (Where | undefined)[]): Where | undefined {
  const and = clauses.filter((c): c is Where => Boolean(c))
  if (!draft) and.unshift({ _status: { equals: 'published' } })
  if (!and.length) return undefined
  return and.length === 1 ? and[0] : { and }
}

/** The populated category of a product, or null when unset (draft rows) or not populated (depth 0). */
export function categoryOf(p: Pick<Product, 'category'> | null | undefined): ProductCategory | null {
  const c = p?.category
  return c && typeof c === 'object' ? c : null
}

/* ------------------------------------------------------------------------------------------------
 * Catalogue: card specs, filters, sorting. Pure functions over the Product rows the data layer
 * returns (depth 1: category populated), shared by /products, category pages and /compare.
 * ---------------------------------------------------------------------------------------------- */

type Grade = NonNullable<Product['grades']>[number]
type Spec = NonNullable<Product['specs']>[number]

export const gradeLabel = (g: string) => GRADE_LABELS[g as GradeValue] ?? g

/** One scanned figure on a product card: value set in mono, `note` (unit / grade) in sans. */
export type CardSpec = { label: string; value: string; note?: string | null; missing?: boolean }

/** "Immobilised metal affinity (IMAC)" stays; "Mixed-mode (anion exchange / hydrophobic interaction)" → "Mixed-mode". */
export function shortType(s: string) {
  const t = s.trim()
  if (t.length <= 34) return t
  return t.replace(/\s*\(.*\)\s*$/, '').replace(/\s+for\s.+$/, '').trim() || t
}

const specLabel = (parameter: string) => shortType(parameter.replace(/\s*\(.*\)\s*$/, '')).replace(/^Dynamic /, '')

/**
 * The two or three figures a buyer scans on a card: a binding / product metric (DBC for the
 * reference grade — Fast Flow when present — or the closest thing the specs offer: metal capacity,
 * cyanate-ester content, fractionation range…), the highest stated flow, and the grade list with
 * d50 values. Figures that are not on file stay visibly bracketed rather than invented.
 */
export function cardSpecs(p: Pick<Product, 'grades' | 'specs'>): CardSpec[] {
  const grades = p.grades ?? []
  const specs = p.specs ?? []
  const many = grades.length > 1
  const out: CardSpec[] = []

  const dbcGrade = grades.find((g) => g.grade === 'fast-flow' && g.dynamicBindingCapacity) ?? grades.find((g) => g.dynamicBindingCapacity)
  if (dbcGrade?.dynamicBindingCapacity) out.push({ label: 'DBC', value: dbcGrade.dynamicBindingCapacity, note: many ? gradeLabel(dbcGrade.grade) : null })
  else {
    const spec = specs.find((s) => /binding|capacity|fractionation|cyanate|activation/i.test(s.parameter))
    out.push(spec ? { label: specLabel(spec.parameter), value: spec.value } : { label: 'DBC', value: '[DBC: to confirm]', missing: true })
  }

  const flowGrades = grades.filter((g) => g.maxFlowVelocity)
  if (flowGrades.length) {
    const best = flowGrades.reduce((a, b) => ((parseMax(b.maxFlowVelocity) ?? 0) > (parseMax(a.maxFlowVelocity) ?? 0) ? b : a))
    out.push({ label: 'Max flow', value: best.maxFlowVelocity!, note: many ? gradeLabel(best.grade) : null })
  } else {
    const spec = specs.find((s) => /flow/i.test(s.parameter))
    out.push(spec ? { label: specLabel(spec.parameter), value: spec.value } : { label: 'Max flow', value: '[Flow: to confirm]', missing: true })
  }

  if (grades.length) {
    const d50s = grades.map((g) => g.d50).filter((d): d is string => Boolean(d))
    const sameUnit = d50s.length > 0 && d50s.every((d) => /µm\s*$/.test(d))
    const note = d50s.length ? `d50V ${sameUnit ? `${d50s.map((d) => stripUnit(d)).join(' / ')} µm` : d50s.join(' / ')}` : null
    out.push({ label: many ? 'Grades / d50V' : 'Grade / d50V', value: grades.map((g) => gradeLabel(g.grade)).join(' / '), note })
  } else {
    const spec = specs.find((s) => /format|bed dimensions|reactions|contents/i.test(s.parameter))
    if (spec) out.push({ label: specLabel(spec.parameter), value: spec.value })
  }
  return out.slice(0, 3)
}

/** Slug for a free-text functional type, used as the filter value: "Strong cation exchanger" → "strong-cation-exchanger". */
export const typeSlug = (s: string) =>
  s
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export type CatalogueQuery = { category: string[]; type: string[]; grade: string[]; availability: string[]; q: string; sort: SortValue }

export const SORT_OPTIONS = [
  { value: 'catalogue', label: 'Catalogue order' },
  { value: 'name', label: 'Name, A–Z' },
  { value: 'category', label: 'Category' },
  { value: 'lead-time', label: 'Lead time' },
] as const
export type SortValue = (typeof SORT_OPTIONS)[number]['value']

type SearchParams = Record<string, string | string[] | undefined>

const list = (v: string | string[] | undefined) =>
  ([] as string[])
    .concat(v ?? [])
    .flatMap((s) => s.split(','))
    .map((s) => s.trim())
    .filter(Boolean)

export function parseCatalogueQuery(sp: SearchParams): CatalogueQuery {
  const sort = typeof sp.sort === 'string' && SORT_OPTIONS.some((o) => o.value === sp.sort) ? (sp.sort as SortValue) : 'catalogue'
  return {
    category: list(sp.category),
    type: list(sp.type),
    grade: list(sp.grade).filter((g) => (GRADE_VALUES as readonly string[]).includes(g)),
    availability: list(sp.availability),
    q: typeof sp.q === 'string' ? sp.q.trim().slice(0, 80) : '',
    sort,
  }
}

export const hasFilters = (q: CatalogueQuery) => Boolean(q.category.length || q.type.length || q.grade.length || q.availability.length || q.q)

/** Query string for a catalogue state (empty lists and the default sort are omitted). */
export function catalogueSearch(q: Partial<CatalogueQuery>): string {
  const params = new URLSearchParams()
  for (const k of ['category', 'type', 'grade', 'availability'] as const) for (const v of q[k] ?? []) params.append(k, v)
  if (q.q) params.set('q', q.q)
  if (q.sort && q.sort !== 'catalogue') params.set('sort', q.sort)
  const s = params.toString()
  return s ? `?${s}` : ''
}

const haystack = (p: Product) =>
  [p.name, p.subtitle, p.summary, p.chemistry?.ligand, p.chemistry?.functionalType, categoryOf(p)?.name, ...(p.grades ?? []).map((g) => g.label)]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

/** Selections within a group are OR-ed; groups are AND-ed; every search term must match. */
export function filterProducts(products: Product[], q: CatalogueQuery): Product[] {
  const terms = q.q ? q.q.toLowerCase().split(/\s+/).filter(Boolean) : []
  return products.filter((p) => {
    if (q.category.length && !q.category.includes(categoryOf(p)?.slug ?? '')) return false
    if (q.type.length && !q.type.includes(typeSlug(p.chemistry?.functionalType ?? ''))) return false
    if (q.grade.length && !(p.grades ?? []).some((g) => q.grade.includes(g.grade))) return false
    if (q.availability.length && !q.availability.includes(p.availability)) return false
    if (terms.length) {
      const h = haystack(p)
      if (!terms.every((t) => h.includes(t))) return false
    }
    return true
  })
}

/** "2–3 weeks ex-works" → 3; "On request" and empty → Infinity (sorted last). */
export function leadTimeWeeks(s?: string | null): number {
  if (!s) return Infinity
  const n = parseMax(s)
  return n == null ? Infinity : /day/i.test(s) ? n / 7 : n
}

export function sortProducts(products: Product[], sort: SortValue, categories: Pick<ProductCategory, 'id' | 'order'>[]): Product[] {
  const catOrder = new Map(categories.map((c, i) => [c.id, c.order ?? i]))
  const byCatalogue = (a: Product, b: Product) =>
    (catOrder.get(categoryOf(a)?.id ?? -1) ?? 99) - (catOrder.get(categoryOf(b)?.id ?? -1) ?? 99) || (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name)
  const out = [...products]
  switch (sort) {
    case 'name':
      return out.sort((a, b) => a.name.localeCompare(b.name))
    case 'lead-time':
      return out.sort((a, b) => {
        const la = leadTimeWeeks(a.leadTime)
        const lb = leadTimeWeeks(b.leadTime)
        return la === lb ? byCatalogue(a, b) : la < lb ? -1 : 1
      })
    case 'category':
    default:
      return out.sort(byCatalogue)
  }
}

export type FilterOption = { value: string; label: string; count: number; note?: string | null }
export type FilterGroup = { name: 'category' | 'type' | 'grade' | 'availability'; legend: string; options: FilterOption[]; selected: string[] }

const AVAILABILITY_LABELS: Record<string, string> = { available: 'Available', 'made-to-order': 'Made to order', 'in-development': 'In development' }

/** Typical d50 across the products that ship a grade: "~60–65 µm". */
function gradeD50Note(products: Product[], grade: string): string | null {
  const values = products.flatMap((p) => (p.grades ?? []).filter((g) => g.grade === grade).map((g) => parseNumber(g.d50))).filter((n): n is number => n != null)
  if (!values.length) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  return min === max ? `~${min} µm` : `~${min}–${max} µm`
}

/**
 * Sidebar groups with absolute counts over the (category-scoped) catalogue — counts are catalogue
 * totals, the result count is what changes with the selection. `scoped` drops the mode group on
 * category pages.
 */
export function buildFilterGroups(products: Product[], categories: ProductCategory[], q: CatalogueQuery, opts?: { scoped?: boolean }): FilterGroup[] {
  const count = (pred: (p: Product) => boolean) => products.filter(pred).length
  const groups: FilterGroup[] = []
  if (!opts?.scoped) {
    groups.push({
      name: 'category',
      legend: 'Chromatography mode',
      selected: q.category,
      options: categories.map((c) => ({ value: c.slug!, label: c.name, count: count((p) => categoryOf(p)?.id === c.id) })).filter((o) => o.count > 0),
    })
  }
  // Functional types only discriminate inside a mode that has more than one (strong / weak cation
  // and anion exchangers; IMAC beside Protein A affinity). A mode with a single type is already
  // the mode filter, so its type is not repeated here.
  const types = new Map<string, { label: string; count: number; category: number | string }>()
  for (const p of products) {
    const t = p.chemistry?.functionalType?.trim()
    if (!t) continue
    const key = typeSlug(t)
    const cur = types.get(key)
    if (cur) cur.count += 1
    else types.set(key, { label: shortType(t), count: 1, category: categoryOf(p)?.id ?? '' })
  }
  const typesPerCategory = new Map<number | string, number>()
  for (const t of types.values()) typesPerCategory.set(t.category, (typesPerCategory.get(t.category) ?? 0) + 1)
  groups.push({
    name: 'type',
    legend: opts?.scoped ? 'Functional type' : 'Exchanger / functional type',
    selected: q.type,
    options: Array.from(types, ([value, t]) => ({ value, label: t.label, count: t.count, category: t.category }))
      .filter((o) => (typesPerCategory.get(o.category) ?? 0) > 1 || q.type.includes(o.value))
      .map(({ value, label, count }) => ({ value, label, count })),
  })
  groups.push({
    name: 'grade',
    legend: 'Grade / bead size',
    selected: q.grade,
    options: GRADE_VALUES.map((g) => ({ value: g, label: GRADE_LABELS[g], count: count((p) => (p.grades ?? []).some((x) => x.grade === g)), note: gradeD50Note(products, g) })).filter((o) => o.count > 0),
  })
  groups.push({
    name: 'availability',
    legend: 'Availability',
    selected: q.availability,
    options: Object.entries(AVAILABILITY_LABELS)
      .map(([value, label]) => ({ value, label, count: count((p) => p.availability === value) }))
      .filter((o) => o.count > 0),
  })
  // A group with one option cannot narrow anything (unless it is the active selection).
  return groups.filter((g) => g.options.length > 1 || g.selected.length)
}

/** Reference grade for a card's selects / compare rows: Fast Flow (Standard) when present, else the first. */
export function referenceGrade(grades: Grade[] | null | undefined): Grade | null {
  return grades?.find((g) => g.grade === 'fast-flow') ?? grades?.[0] ?? null
}

/** Products of a comparison from `?ids=1,2` (ids or slugs, comma-separated) or repeated `?p=slug`. */
export function pickCompared(all: Product[], sp: SearchParams, max = 3): Product[] {
  const keys = [...list(sp.ids), ...list(sp.p)]
  const out: Product[] = []
  for (const k of keys) {
    const p = all.find((x) => x.slug === k || String(x.id) === k)
    if (p && !out.includes(p)) out.push(p)
    if (out.length >= max) break
  }
  return out
}

export const specValue = (p: Pick<Product, 'specs'>, parameter: string): Spec | undefined => p.specs?.find((s) => s.parameter === parameter)

/** The slice of a product the resin selector needs (client component, so keep it small). */
export function slimProduct(p: Product) {
  const cat = categoryOf(p)
  return { id: p.id, slug: p.slug!, name: p.name, subtitle: p.subtitle ?? null, category: cat?.slug ?? '', categoryName: cat?.name ?? '', ligand: p.chemistry?.ligand ?? null, functionalType: p.chemistry?.functionalType ?? null, grades: (p.grades ?? []).map((g) => g.grade) }
}
