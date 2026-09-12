import type { Certification, Customer, SiteSetting, Team } from '@/payload-types'

/**
 * Pure helpers for the trust/proof content (team credentials, certifications, proof points,
 * customers). Shared by the block renderers, the Markdown/JSON surfaces and structured data; kept
 * free of Next/Payload runtime imports so they can be unit-tested.
 */

export type Proof = NonNullable<SiteSetting['proof']>

/** Certifications the site should treat as third-party credentials (schema.org `hasCredential`). Product claims are Protpure's own statements. */
export const CREDENTIAL_KINDS: ReadonlySet<Certification['kind']> = new Set(['quality-system', 'regulatory', 'membership', 'award'])

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

/**
 * "Founded May 2023" → "2023-05"; "Est. 2023" → "2023"; anything without a year → the numeric
 * fallback (Site settings → Founded year) as a string, or undefined.
 */
export function parseFoundedDate(text?: string | null, fallbackYear?: number | null): string | undefined {
  const t = (text ?? '').trim()
  const my = t.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{4})\b/i)
  if (my) return `${my[2]}-${String(MONTHS.indexOf(my[1].toLowerCase()) + 1).padStart(2, '0')}`
  const y = t.match(/\b((?:19|20)\d{2})\b/)
  if (y) return y[1]
  return fallbackYear ? String(fallbackYear) : undefined
}

/**
 * "8–10 person team" → { minValue: 8, maxValue: 10 }; "12 people" → { value: 12 }; no digits → undefined.
 * Accepts hyphen, en dash, em dash and "to" as range separators.
 */
export function parseTeamSize(text?: string | null): { minValue: number; maxValue: number } | { value: number } | undefined {
  const t = (text ?? '').trim()
  const range = t.match(/(\d+)\s*(?:[-–—]|to)\s*(\d+)/)
  if (range) {
    const a = Number(range[1])
    const b = Number(range[2])
    return { minValue: Math.min(a, b), maxValue: Math.max(a, b) }
  }
  const single = t.match(/\d+/)
  return single ? { value: Number(single[0]) } : undefined
}

/** The proof points that are set, in display order, as label/value pairs. */
export function proofItems(proof?: Proof | null, opts?: { includeStatement?: boolean }): { key: string; value: string }[] {
  const out: { key: string; value: string }[] = []
  if (proof?.foundedText) out.push({ key: 'founded', value: proof.foundedText })
  if (proof?.teamSize) out.push({ key: 'team', value: proof.teamSize })
  if (proof?.capacity) out.push({ key: 'capacity', value: proof.capacity })
  if (opts?.includeStatement !== false && proof?.customersStatement) out.push({ key: 'customers', value: proof.customersStatement })
  if (proof?.linkedinFollowers) out.push({ key: 'linkedin', value: `${proof.linkedinFollowers.toLocaleString('en-IN')} LinkedIn followers` })
  return out
}

/** The first team member whose role mentions founding (Founder, Founding Director, Co-founder…), preferring featured members. */
export function founderOf(team: Team[] | null | undefined): Team | null {
  const list = (team ?? []).filter((m) => /found/i.test(m.role ?? ''))
  return list.find((m) => m.featured) ?? list[0] ?? null
}

/** Case- and punctuation-insensitive key for de-duplicating claims between Site settings and the Certifications collection. */
const claimKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

/**
 * Site-settings claims that are not already present as a Certification entry (so the Markdown and
 * JSON surfaces list each claim once even while both places are filled in).
 */
export function extraClaims(claims: { text: string }[] | null | undefined, certifications: Certification[] | null | undefined): string[] {
  const seen = new Set((certifications ?? []).map((c) => claimKey(c.name)))
  return (claims ?? []).map((c) => c.text).filter((t) => t && !seen.has(claimKey(t)))
}

/** Customers that may actually be shown: cleared by the editor and carrying an uploaded logo. */
export function displayableCustomers(customers: Customer[] | null | undefined): Customer[] {
  return (customers ?? []).filter((c) => c.showLogo && c.logo && typeof c.logo === 'object')
}

/** One-line citation: "Title — Journal (2009)". */
export function publicationCitation(p: { title: string; journal?: string | null; year?: number | null }): string {
  const tail = [p.journal, p.year ? `(${p.year})` : null].filter(Boolean).join(' ')
  return tail ? `${p.title} — ${tail}` : p.title
}
