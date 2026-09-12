import { getCertifications, getSiteSettings, getTeam } from '@/lib/data'
import { json, options, publicCertification, publicProof, publicTeamMember } from '@/lib/public-api'
import { extraClaims } from '@/lib/trust'
import { SITE_URL } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const OPTIONS = options

export async function GET() {
  const [s, certs, team] = await Promise.all([getSiteSettings(), getCertifications(), getTeam()])
  return json({
    name: s.name,
    legalName: s.legalName,
    tagline: s.tagline,
    description: s.aiSummary || s.description,
    foundedYear: s.foundedYear,
    proof: publicProof(s.proof, s.foundedYear),
    contact: { email: s.email, phone: s.phone, whatsapp: s.whatsapp, address: s.address, city: s.city, region: s.region, country: s.country, hours: s.hours },
    social: s.social,
    pricing: 'By quotation. No free samples; paid sample kits (5–25 mL packs or a 1 mL pre-packed column), credited against your first bulk order.',
    responseTime: s.responseTime,
    leadTime: s.leadTime,
    international: { statement: s.globalStatement, regions: (s.regions ?? []).map((r) => ({ name: r.name, status: r.status, note: r.note })), notes: (s.exportNotes ?? []).map((n) => n.text) },
    // `claims` keeps the flat list of short claims (trust strip); `certifications` is the structured collection.
    claims: (s.certifications ?? []).map((c) => c.text),
    certifications: [...certs.map(publicCertification), ...extraClaims(s.certifications, certs).map((text) => ({ id: null, name: text, kind: 'product-claim' as const, issuer: null, statement: null, validUntil: null, document: null }))],
    team: team.map(publicTeamMember),
    links: { website: SITE_URL, quote: `${SITE_URL}/request-quote`, products: `${SITE_URL}/api/public/products`, documents: `${SITE_URL}/api/public/documents`, updates: `${SITE_URL}/api/public/updates`, mcp: `${SITE_URL}/mcp`, llms: `${SITE_URL}/llms.txt`, markdown: `${SITE_URL}/md/company` },
  })
}
