import { describe, expect, it } from 'vitest'
import { inquirySchema, rateLimit } from '@/lib/inquiries'
import { linkedInUrn } from '@/collections/Updates'

describe('inquirySchema', () => {
  it('accepts a minimal quote request', () => {
    const r = inquirySchema.safeParse({ type: 'quote', name: 'Ada', email: 'ada@example.com', productIds: ['3', 4] })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.productIds).toEqual([3, 4])
  })
  it('rejects bad emails and unknown types', () => {
    expect(inquirySchema.safeParse({ type: 'quote', name: 'Ada', email: 'nope' }).success).toBe(false)
    expect(inquirySchema.safeParse({ type: 'spam', name: 'Ada', email: 'ada@example.com' }).success).toBe(false)
  })
})

describe('rateLimit', () => {
  it('allows N hits per window then blocks', () => {
    const key = `t:${Math.random()}`
    for (let i = 0; i < 3; i++) expect(rateLimit(key, 3, 60_000)).toBe(true)
    expect(rateLimit(key, 3, 60_000)).toBe(false)
  })
})

describe('linkedInUrn', () => {
  it('extracts activity ids from post URLs', () => {
    expect(linkedInUrn('https://www.linkedin.com/posts/protpure-tech-pvt-ltd_resins-activity-7301234567890123456-abcd')).toBe('urn:li:activity:7301234567890123456')
    expect(linkedInUrn('https://www.linkedin.com/feed/update/urn:li:share:7301234567890123456/')).toBe('urn:li:share:7301234567890123456')
    expect(linkedInUrn('https://www.linkedin.com/company/protpure-tech-pvt-ltd/')).toBeNull()
  })
})
