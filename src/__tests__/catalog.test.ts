import { describe, expect, it } from 'vitest'
import { buildFilterGroups, cardSpecs, catalogueSearch, categoryOf, filterProducts, leadTimeWeeks, parseCatalogueQuery, pickCompared, pressureOnly, publishedWhere, shortType, sortProducts, typeSlug } from '@/lib/catalog'
import type { Product, ProductCategory } from '@/payload-types'

describe('publishedWhere', () => {
  it('restricts public reads to published docs', () => {
    expect(publishedWhere(false)).toEqual({ _status: { equals: 'published' } })
  })
  it('combines the status filter with other clauses', () => {
    expect(publishedWhere(false, { slug: { equals: 'sp-agarose' } })).toEqual({ and: [{ _status: { equals: 'published' } }, { slug: { equals: 'sp-agarose' } }] })
  })
  it('drops undefined clauses', () => {
    expect(publishedWhere(false, undefined, { featured: { equals: true } }, undefined)).toEqual({ and: [{ _status: { equals: 'published' } }, { featured: { equals: true } }] })
  })
  it('does not filter in draft mode', () => {
    expect(publishedWhere(true)).toBeUndefined()
    expect(publishedWhere(true, { slug: { equals: 'x' } })).toEqual({ slug: { equals: 'x' } })
    expect(publishedWhere(true, { a: { equals: 1 } }, { b: { equals: 2 } })).toEqual({ and: [{ a: { equals: 1 } }, { b: { equals: 2 } }] })
  })
})

describe('categoryOf', () => {
  const cat = { id: 1, name: 'Ion exchange', slug: 'ion-exchange' } as ProductCategory
  it('returns the populated category', () => {
    expect(categoryOf({ category: cat })).toBe(cat)
  })
  it('is null for unpopulated ids and empty drafts', () => {
    expect(categoryOf({ category: 3 })).toBeNull()
    expect(categoryOf({ category: null as unknown as Product['category'] })).toBeNull()
    expect(categoryOf({} as Pick<Product, 'category'>)).toBeNull()
    expect(categoryOf(null)).toBeNull()
    expect(categoryOf(undefined)).toBeNull()
  })
})

/* ---------- catalogue helpers ---------- */
const iex = { id: 1, name: 'Ion Exchange', slug: 'ion-exchange', order: 1 } as ProductCategory
const imac = { id: 2, name: 'Affinity (IMAC)', slug: 'affinity', order: 2 } as ProductCategory

const sp = {
  id: 10,
  name: 'SP Agarose',
  slug: 'sp-agarose',
  subtitle: 'Strong cation exchanger',
  summary: 'Sulfopropyl strong cation exchanger.',
  category: iex,
  availability: 'available',
  order: 1,
  leadTime: '2–3 weeks ex-works',
  chemistry: { ligand: 'Sulfopropyl', functionalType: 'Strong cation exchanger' },
  grades: [
    { grade: 'faster', d50: '~150 µm', maxFlowVelocity: '800–1000 cm/h', dynamicBindingCapacity: '≥120 mg lysozyme/mL' },
    { grade: 'fast-flow', d50: '~90 µm', maxFlowVelocity: '250–450 cm/h', dynamicBindingCapacity: '≈100 mg lysozyme/mL' },
    { grade: 'hr', d50: '~35 µm', maxFlowVelocity: '70–120 cm/h', dynamicBindingCapacity: '≈130 mg lysozyme/mL' },
  ],
  specs: [{ parameter: 'BioProcess resin', value: 'Yes' }],
} as unknown as Product

const cnbr = {
  id: 11,
  name: 'CNBr-Activated Agarose',
  slug: 'cnbr-activated-agarose',
  category: imac,
  availability: 'available',
  order: 1,
  leadTime: '2–3 weeks ex-works',
  chemistry: { functionalType: 'Activated support for ligand immobilisation' },
  grades: [{ grade: 'fast-flow', d50: '~90 µm', dynamicBindingCapacity: '> 85 µmol cyanate ester/mL resin' }],
  specs: [],
} as unknown as Product

const proteinA = {
  id: 12,
  name: 'Protein A Agarose',
  slug: 'protein-a-agarose',
  category: imac,
  availability: 'made-to-order',
  order: 5,
  leadTime: 'On request',
  chemistry: { functionalType: 'Affinity' },
  grades: [{ grade: 'fast-flow', d50: '~90 µm', dynamicBindingCapacity: 'Up to 20 mg human IgG/mL resin' }],
  specs: [],
} as unknown as Product

const magnetic = {
  id: 13,
  name: 'Ni-NTA Magnetic Agarose',
  slug: 'ni-nta-magnetic-agarose',
  category: imac,
  availability: 'available',
  order: 9,
  leadTime: '2–3 weeks ex-works',
  chemistry: { functionalType: 'Magnetic affinity beads' },
  grades: [],
  specs: [{ parameter: 'Format', value: 'Magnetic agarose beads, 25% slurry' }],
} as unknown as Product

const all = [sp, cnbr, proteinA, magnetic]

describe('cardSpecs', () => {
  it('quotes the Fast Flow DBC, the highest flow and the grade list with d50 values', () => {
    expect(cardSpecs(sp)).toEqual([
      { label: 'DBC', value: '≈100 mg lysozyme/mL', note: 'Fast Flow' },
      { label: 'Max flow', value: '800–1000 cm/h', note: 'Faster' },
      { label: 'Grades / d50V', value: 'Faster\u00a0/ Fast Flow\u00a0/ HR', note: 'd50V 150 / 90 / 35 µm' },
    ])
  })
  it('keeps missing figures bracketed and uses the specs for products without grades', () => {
    expect(cardSpecs(cnbr)[0]).toEqual({ label: 'DBC', value: '> 85 µmol cyanate ester/mL resin', note: null })
    expect(cardSpecs(cnbr)[1]).toEqual({ label: 'Max flow', value: 'On request', missing: true })
    expect(cardSpecs(magnetic)).toEqual([
      { label: 'DBC', value: 'On request', missing: true },
      { label: 'Max flow', value: 'On request', missing: true },
      { label: 'Format', value: 'Magnetic agarose beads, 25% slurry' },
    ])
  })
})

describe('catalogue query, filters and sort', () => {
  it('parses repeated and comma-separated params and ignores unknown grades / sorts', () => {
    expect(parseCatalogueQuery({ category: ['ion-exchange', 'affinity'], grade: 'fast-flow,xyz', sort: 'bogus', q: '  his ' })).toEqual({ category: ['ion-exchange', 'affinity'], type: [], grade: ['fast-flow'], availability: [], q: 'his', sort: 'catalogue' })
    expect(catalogueSearch({ category: ['affinity'], grade: ['hr'], sort: 'name', q: 'ni' })).toBe('?category=affinity&grade=hr&q=ni&sort=name')
    expect(catalogueSearch({ sort: 'catalogue' })).toBe('')
  })
  it('ORs within a group and ANDs across groups', () => {
    const q = parseCatalogueQuery({ category: 'affinity', grade: 'fast-flow' })
    expect(filterProducts(all, q).map((p) => p.slug)).toEqual(['cnbr-activated-agarose', 'protein-a-agarose'])
    expect(filterProducts(all, parseCatalogueQuery({ availability: 'made-to-order' })).map((p) => p.slug)).toEqual(['protein-a-agarose'])
    expect(filterProducts(all, parseCatalogueQuery({ type: typeSlug('Strong cation exchanger') })).map((p) => p.slug)).toEqual(['sp-agarose'])
    expect(filterProducts(all, parseCatalogueQuery({ q: 'magnetic beads' })).map((p) => p.slug)).toEqual(['ni-nta-magnetic-agarose'])
  })
  it('sorts by catalogue order, name and lead time', () => {
    expect(sortProducts([proteinA, magnetic, sp, cnbr], 'catalogue', [iex, imac]).map((p) => p.slug)).toEqual(['sp-agarose', 'cnbr-activated-agarose', 'protein-a-agarose', 'ni-nta-magnetic-agarose'])
    expect(sortProducts(all, 'name', [iex, imac])[0].slug).toBe('cnbr-activated-agarose')
    expect(sortProducts(all, 'lead-time', [iex, imac]).at(-1)?.slug).toBe('protein-a-agarose')
    expect(leadTimeWeeks('2–3 weeks ex-works')).toBe(3)
    expect(leadTimeWeeks('On request')).toBe(Infinity)
  })
  it('builds sidebar groups with absolute counts', () => {
    const groups = buildFilterGroups(all, [iex, imac], parseCatalogueQuery({ grade: 'hr' }))
    expect(groups.map((g) => g.name)).toEqual(['category', 'type', 'grade', 'availability'])
    expect(groups[0].options).toEqual([
      { value: 'ion-exchange', label: 'Ion Exchange', count: 1 },
      { value: 'affinity', label: 'Affinity (IMAC)', count: 3 },
    ])
    // A functional type only discriminates inside a mode with several types: the lone IEX type is not repeated.
    expect(groups[1].options.map((o) => o.value)).toEqual(['activated-support-for-ligand-immobilisation', 'affinity', 'magnetic-affinity-beads'])
    expect(groups[2].selected).toEqual(['hr'])
    expect(groups[2].options.find((o) => o.value === 'fast-flow')).toEqual({ value: 'fast-flow', label: 'Fast Flow / Standard', count: 3, note: '~90 µm' })
    expect(groups[3].options).toEqual([
      { value: 'available', label: 'Available', count: 3 },
      { value: 'made-to-order', label: 'Made to order', count: 1 },
    ])
    expect(buildFilterGroups(all, [iex, imac], parseCatalogueQuery({}), { scoped: true }).map((g) => g.name)).toEqual(['type', 'grade', 'availability'])
  })
  it('shortens long functional types for the sidebar', () => {
    expect(shortType('Immobilised metal affinity (IMAC)')).toBe('Immobilised metal affinity (IMAC)')
    expect(shortType('Mixed-mode (anion exchange / hydrophobic interaction)')).toBe('Mixed-mode')
    expect(shortType('Activated support for ligand immobilisation')).toBe('Activated support')
  })
  it('strips the flow that has its own column from the pressure specification', () => {
    expect(pressureOnly({ pressureFlow: '800–1000 cm/h, 0.1 MPa, 20 cm bed height', maxFlowVelocity: '800–1000 cm/h' })).toBe('0.1 MPa, 20 cm bed height')
    expect(pressureOnly({ pressureFlow: '0.3 MPa', maxFlowVelocity: '~700 cm/h' })).toBe('0.3 MPa')
    expect(pressureOnly(null)).toBe('')
  })
  it('picks compared products from ids or slugs, capped at three', () => {
    expect(pickCompared(all, { ids: '10,protein-a-agarose,10' }).map((p) => p.id)).toEqual([10, 12])
    expect(pickCompared(all, { p: ['sp-agarose', 'cnbr-activated-agarose', 'protein-a-agarose', 'ni-nta-magnetic-agarose'] }).length).toBe(3)
    expect(pickCompared(all, {})).toEqual([])
  })
})
