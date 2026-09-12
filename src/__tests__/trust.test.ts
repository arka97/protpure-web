import { describe, expect, it } from 'vitest'
import { displayableCustomers, extraClaims, founderOf, parseFoundedDate, parseTeamSize, proofItems, publicationCitation } from '@/lib/trust'
import { certificationsToMarkdown, pageToMarkdown, proofToMarkdown, teamMemberToMarkdown, updateToMarkdown } from '@/lib/markdown'
import { organizationJsonLd, personJsonLd } from '@/lib/jsonld'
import { rt } from '@/seed/richtext'
import type { Certification, Customer, Media, Page, SiteSetting, Team, Update } from '@/payload-types'

const desai = {
  id: 1,
  name: 'Dr. Rucha P. Desai',
  role: 'Founding Director',
  featured: true,
  linkedinUrl: 'https://www.linkedin.com/in/rucha-desai-b326003/',
  bio: rt('Scientist and founder of Protpure Tech.'),
  credentials: [{ text: 'M.Sc., Ph.D. (Physics)' }],
  expertise: [{ text: 'Bead polymerisation' }, { text: 'Ligand coupling' }],
  publications: [
    { title: 'Tunable birefringence in silica mediated magnetic fluid', journal: 'Materials Research Express', year: 2019, url: 'https://iopscience.iop.org/article/10.1088/2053-1591/ab4eb2' },
    { title: 'Unlinked paper', journal: null, year: null, url: null },
  ],
} as unknown as Team

const claim = (id: number, name: string, extra: Partial<Certification> = {}): Certification => ({ id, name, kind: 'product-claim', updatedAt: '', createdAt: '', ...extra })

describe('proof parsing', () => {
  it('parses "Founded May 2023" to a month precision date', () => {
    expect(parseFoundedDate('Founded May 2023')).toBe('2023-05')
    expect(parseFoundedDate('Est. September 2021')).toBe('2021-09')
  })
  it('falls back to a bare year, then to the numeric founded year', () => {
    expect(parseFoundedDate('Since 2023')).toBe('2023')
    expect(parseFoundedDate('', 2023)).toBe('2023')
    expect(parseFoundedDate(null, null)).toBeUndefined()
  })
  it('parses team-size ranges and single values', () => {
    expect(parseTeamSize('8–10 person team')).toEqual({ minValue: 8, maxValue: 10 })
    expect(parseTeamSize('8-10')).toEqual({ minValue: 8, maxValue: 10 })
    expect(parseTeamSize('10 to 8 people')).toEqual({ minValue: 8, maxValue: 10 })
    expect(parseTeamSize('12 people')).toEqual({ value: 12 })
    expect(parseTeamSize('a small team')).toBeUndefined()
  })
  it('lists only the proof points that are set', () => {
    expect(proofItems({ foundedText: 'Founded May 2023', capacity: '600 L / month', customersStatement: '' })).toEqual([
      { key: 'founded', value: 'Founded May 2023' },
      { key: 'capacity', value: '600 L / month' },
    ])
    expect(proofItems({ customersStatement: 'Used in GMP facilities.', linkedinFollowers: 1200 }, { includeStatement: false })).toEqual([{ key: 'linkedin', value: '1,200 LinkedIn followers' }])
    expect(proofItems(null)).toEqual([])
  })
})

describe('team and claims helpers', () => {
  it('picks the founder by role, preferring featured members', () => {
    const other = { id: 2, name: 'X', role: 'Co-founder', featured: false } as Team
    expect(founderOf([other, desai])?.name).toBe('Dr. Rucha P. Desai')
    expect(founderOf([{ id: 3, name: 'Y', role: 'Process scientist' } as Team])).toBeNull()
    expect(founderOf(undefined)).toBeNull()
  })
  it('de-duplicates site-settings claims against certification entries', () => {
    const certs = [claim(1, 'Certificate of analysis with every lot')]
    expect(extraClaims([{ text: 'Certificate of Analysis with every lot.' }, { text: 'Made in India' }], certs)).toEqual(['Made in India'])
    expect(extraClaims(null, certs)).toEqual([])
  })
  it('only shows customers that are cleared and have a logo uploaded', () => {
    const logo = { id: 9, url: '/media/x.png', alt: 'x' } as Media
    const list = [
      { id: 1, name: 'A', showLogo: true, logo },
      { id: 2, name: 'B', showLogo: true, logo: 9 },
      { id: 3, name: 'C', showLogo: false, logo },
    ] as Customer[]
    expect(displayableCustomers(list).map((c) => c.name)).toEqual(['A'])
  })
  it('formats citations', () => {
    expect(publicationCitation({ title: 'T', journal: 'J. Phys. 73', year: 2009 })).toBe('T — J. Phys. 73 (2009)')
    expect(publicationCitation({ title: 'T' })).toBe('T')
  })
})

describe('markdown renderers', () => {
  it('renders proof points as list lines', () => {
    expect(proofToMarkdown({ foundedText: 'Founded May 2023', teamSize: '8–10 person team', capacity: '600 L / month', customersStatement: 'Used in GMP facilities.' })).toEqual([
      '- Founded: May 2023',
      '- Team: 8–10 person team',
      '- Manufacturing capacity: 600 L / month',
      '- Customers: Used in GMP facilities.',
    ])
    expect(proofToMarkdown(undefined)).toEqual([])
  })
  it('renders certifications with issuer, statement, certificate link and leftover claims', () => {
    const certs = [
      claim(1, 'ISO 9001:2015', { kind: 'quality-system', issuer: 'TÜV', statement: 'Quality management system.', document: { id: 5, title: 'ISO cert', url: '/media/documents/iso.pdf', type: 'certificate', updatedAt: '', createdAt: '' } as never }),
      claim(2, 'Certificate of analysis with every lot'),
    ]
    const md = certificationsToMarkdown(certs, [{ text: 'Certificate of analysis with every lot' }, { text: 'Made in India' }])
    expect(md).toContain('## Quality & claims')
    expect(md).toContain('- ISO 9001:2015 (issued by TÜV) — Quality management system. [certificate](')
    expect(md).toContain('/media/documents/iso.pdf)')
    expect(md).toContain('- Certificate of analysis with every lot')
    expect(md).toContain('- Made in India')
    expect(md.match(/Certificate of analysis/g)).toHaveLength(1)
    expect(certificationsToMarkdown([], [])).toBe('')
  })
  it('renders a team member with credentials, expertise and linked publications', () => {
    const md = teamMemberToMarkdown(desai)
    expect(md).toContain('### Dr. Rucha P. Desai, M.Sc., Ph.D. (Physics)')
    expect(md).toContain('Founding Director')
    expect(md).toContain('Expertise: Bead polymerisation; Ligand coupling')
    expect(md).toContain('- [Tunable birefringence in silica mediated magnetic fluid — Materials Research Express (2019)](https://iopscience.iop.org/article/10.1088/2053-1591/ab4eb2)')
    expect(md).toContain('- Unlinked paper')
    expect(md).toContain('LinkedIn: https://www.linkedin.com/in/rucha-desai-b326003/')
  })
  it('renders an update line with kind and URL', () => {
    const u = { id: 1, title: 'Hy-Ionic DP launched', kind: 'product-launch', summary: 'Two modes.', publishedAt: '2026-08-20T00:00:00.000Z', url: 'https://www.linkedin.com/posts/x' } as Update
    expect(updateToMarkdown(u)).toMatch(/^- .*2026 — \*\*Hy-Ionic DP launched\*\* \[product-launch\]: Two modes\. \(https:\/\/www\.linkedin\.com\/posts\/x\)$/)
    expect(updateToMarkdown({ ...u, kind: null, url: undefined as unknown as string })).toMatch(/\*\*Hy-Ionic DP launched\*\*: Two modes\.$/)
  })
  it('renders the trust blocks in page markdown without leaking empty placeholders', () => {
    const page = {
      id: 1,
      title: 'About',
      hero: { heading: 'About Protpure' },
      layout: [
        { blockType: 'logoWall', heading: 'Who uses Protpure resins', fallbackStatement: 'Used in GMP facilities.', source: 'all' },
        { blockType: 'gallery', heading: 'Inside the Anand facility', items: [] },
        { blockType: 'publications', heading: 'Peer-reviewed work' },
        { blockType: 'certificationsStrip', heading: 'Quality & documentation' },
        { blockType: 'proofBar', style: 'light' },
      ],
    } as unknown as Page
    const md = pageToMarkdown(page)
    expect(md).toContain('## Who uses Protpure resins\nUsed in GMP facilities.')
    expect(md).not.toContain('Inside the Anand facility')
    expect(md).toContain('## Peer-reviewed work')
    expect(md).toContain('## Quality & documentation')
  })
})

describe('structured data', () => {
  const settings = {
    name: 'Protpure',
    legalName: 'Protpure Tech Pvt. Ltd.',
    foundedYear: 2023,
    proof: { foundedText: 'Founded May 2023', teamSize: '8–10 person team' },
    social: { linkedin: 'https://www.linkedin.com/company/protpure-tech-pvt-ltd/' },
  } as unknown as SiteSetting

  it('emits founder, founding date and head-count from proof points', () => {
    const [org] = organizationJsonLd(settings, { team: [desai] }) as Record<string, unknown>[]
    expect(org.foundingDate).toBe('2023-05')
    expect(org.numberOfEmployees).toEqual({ '@type': 'QuantitativeValue', minValue: 8, maxValue: 10 })
    const founder = org.founder as Record<string, unknown>
    expect(founder['@type']).toBe('Person')
    expect(founder.sameAs).toEqual(['https://www.linkedin.com/in/rucha-desai-b326003/'])
    expect(founder.hasCredential).toEqual([{ '@type': 'EducationalOccupationalCredential', name: 'M.Sc., Ph.D. (Physics)' }])
  })
  it('only counts third-party certifications as credentials and omits unknowns', () => {
    const certs = [claim(1, 'Certificate of analysis with every lot'), claim(2, 'ISO 9001:2015', { kind: 'quality-system', issuer: 'TÜV' })]
    const [org] = organizationJsonLd(settings, { certifications: certs }) as Record<string, unknown>[]
    expect(org.hasCredential).toEqual([{ '@type': 'EducationalOccupationalCredential', name: 'ISO 9001:2015', credentialCategory: 'quality-system', description: undefined, recognizedBy: { '@type': 'Organization', name: 'TÜV' }, url: undefined }])
    expect(org.founder).toBeUndefined()
    const [bare] = organizationJsonLd({ name: 'Protpure' } as SiteSetting) as Record<string, unknown>[]
    expect(bare.foundingDate).toBeUndefined()
    expect(bare.numberOfEmployees).toBeUndefined()
    expect(bare.hasCredential).toBeUndefined()
  })
  it('renders a person without empty arrays', () => {
    const p = personJsonLd({ id: 5, name: 'Y', role: 'Scientist' } as Team)
    expect(p.sameAs).toBeUndefined()
    expect(p.hasCredential).toBeUndefined()
    expect(p.knowsAbout).toBeUndefined()
  })
})
