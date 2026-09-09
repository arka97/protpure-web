import { getSiteSettings } from '@/lib/data'
import { json, options } from '@/lib/public-api'
import { SITE_URL } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const OPTIONS = options

export async function GET() {
  const s = await getSiteSettings()
  return json({
    name: s.name,
    legalName: s.legalName,
    tagline: s.tagline,
    description: s.aiSummary || s.description,
    foundedYear: s.foundedYear,
    contact: { email: s.email, phone: s.phone, whatsapp: s.whatsapp, address: s.address, city: s.city, region: s.region, country: s.country, hours: s.hours },
    social: s.social,
    pricing: 'By quotation. No free samples; evaluation packs are quoted on request.',
    responseTime: s.responseTime,
    leadTime: s.leadTime,
    international: { statement: s.globalStatement, regions: (s.regions ?? []).map((r) => ({ name: r.name, status: r.status, note: r.note })), notes: (s.exportNotes ?? []).map((n) => n.text) },
    certifications: (s.certifications ?? []).map((c) => c.text),
    links: { website: SITE_URL, quote: `${SITE_URL}/request-quote`, products: `${SITE_URL}/api/public/products`, documents: `${SITE_URL}/api/public/documents`, mcp: `${SITE_URL}/mcp`, llms: `${SITE_URL}/llms.txt` },
  })
}
