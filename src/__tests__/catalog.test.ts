import { describe, expect, it } from 'vitest'
import { categoryOf, publishedWhere } from '@/lib/catalog'
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
