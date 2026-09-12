import { categoryOf } from './catalog'
import { GRADE_LABELS, type GradeValue } from './rfq'
import { lexicalToText } from './lexical-md'
import { parseFoundedDate, parseTeamSize, type Proof } from './trust'
import { SITE_URL, absoluteUrl, mediaUrl } from './utils'
import type { Application, Certification, Document, Product, Team, Update } from '@/payload-types'

/** Stable, compact product shape for agents and integrations (independent of the CMS schema). */
export function publicProduct(p: Product, opts?: { full?: boolean }) {
  const cat = categoryOf(p)
  const base = {
    id: p.id,
    slug: p.slug,
    name: p.name,
    subtitle: p.subtitle ?? null,
    category: cat ? { slug: cat.slug, name: cat.name, mode: cat.mode ?? null } : null,
    availability: p.availability ?? 'available',
    summary: p.summary,
    ligand: p.chemistry?.ligand ?? null,
    matrix: p.chemistry?.matrix ?? null,
    functionalType: p.chemistry?.functionalType ?? null,
    grades: (p.grades ?? []).map((g) => ({ grade: g.grade, gradeLabel: GRADE_LABELS[g.grade as GradeValue] ?? g.grade, label: g.label ?? null, particleSizeRange: g.particleSizeRange ?? null, d50: g.d50 ?? null, maxFlowVelocity: g.maxFlowVelocity ?? null, dynamicBindingCapacity: g.dynamicBindingCapacity ?? null, pressureFlow: g.pressureFlow ?? null })),
    url: `${SITE_URL}/products/${p.slug}`,
    markdownUrl: `${SITE_URL}/md/products/${p.slug}`,
    quoteUrl: `${SITE_URL}/request-quote?product=${p.id}`,
  }
  if (!opts?.full) return base
  return {
    ...base,
    keyFeatures: (p.keyFeatures ?? []).map((f) => f.text),
    specifications: (p.specs ?? []).map((s) => ({ parameter: s.parameter, value: s.value, marketSpec: s.marketSpec ?? null })),
    useCases: (p.useCases ?? []).map((u) => u.text),
    applications: (p.applications ?? []).filter((a): a is Application => typeof a === 'object').map((a) => ({ slug: a.slug, name: a.name })),
    packSizes: (p.packSizes ?? []).map((ps) => ({ size: ps.size, grade: ps.grade ?? null, catalogNumber: ps.catalogNumber ?? null })),
    leadTime: p.leadTime ?? null,
    bulkAvailable: Boolean(p.bulkAvailable),
    evaluationNote: p.evaluationNote ?? null,
    documents: (p.documents ?? []).filter((d): d is Document => typeof d === 'object').map(publicDocument),
    relatedProducts: (p.relatedProducts ?? []).filter((r): r is Product => typeof r === 'object').map((r) => ({ slug: r.slug, name: r.name })),
  }
}

export function publicDocument(d: Document) {
  return {
    id: d.id,
    title: d.title,
    type: d.type,
    revision: d.revision ?? null,
    documentDate: d.documentDate ?? null,
    summary: d.summary ?? null,
    url: d.url ? absoluteUrl(d.url) : null,
    filesize: d.filesize ?? null,
    products: (d.products ?? []).filter((p): p is Product => typeof p === 'object').map((p) => ({ slug: p.slug, name: p.name })),
  }
}

/** Certification / claim for agents: name, kind, issuer, validity, statement and certificate PDF link. */
export function publicCertification(c: Certification) {
  const doc = c.document && typeof c.document === 'object' ? c.document : null
  return {
    id: c.id,
    name: c.name,
    kind: c.kind,
    issuer: c.issuer ?? null,
    statement: c.statement ?? null,
    validUntil: c.validUntil ?? null,
    document: doc ? { title: doc.title, url: doc.url ? absoluteUrl(doc.url) : null } : null,
  }
}

/** Team member for agents: role, credentials, expertise, publications (no email). */
export function publicTeamMember(m: Team) {
  const photo = mediaUrl(m.photo, 'thumbnail')
  return {
    id: m.id,
    name: m.name,
    role: m.role,
    credentials: (m.credentials ?? []).map((c) => c.text),
    expertise: (m.expertise ?? []).map((e) => e.text),
    bio: m.bio ? lexicalToText(m.bio as never) : null,
    publications: (m.publications ?? []).map((p) => ({ title: p.title, journal: p.journal ?? null, year: p.year ?? null, url: p.url ?? null })),
    linkedin: m.linkedinUrl ?? null,
    photo: photo ? absoluteUrl(photo) : null,
    featured: Boolean(m.featured),
  }
}

/** Proof points as text plus the parsed values agents and structured data can use. */
export function publicProof(proof?: Proof | null, foundedYear?: number | null) {
  return {
    founded: proof?.foundedText ?? null,
    foundingDate: parseFoundedDate(proof?.foundedText, foundedYear) ?? null,
    teamSize: proof?.teamSize ?? null,
    employees: parseTeamSize(proof?.teamSize) ?? null,
    capacity: proof?.capacity ?? null,
    customersStatement: proof?.customersStatement ?? null,
    linkedinFollowers: proof?.linkedinFollowers ?? null,
  }
}

/** Published LinkedIn update for agents. */
export function publicUpdate(u: Update) {
  const image = mediaUrl(u.image, 'card')
  return {
    id: u.id,
    title: u.title,
    kind: u.kind ?? null,
    summary: u.summary,
    publishedAt: u.publishedAt,
    url: u.url ?? null,
    image: image ? absoluteUrl(image) : null,
    pinned: Boolean(u.pinned),
    relatedProducts: (u.relatedProducts ?? []).filter((p): p is Product => typeof p === 'object').map((p) => ({ slug: p.slug, name: p.name })),
  }
}

export const publicHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'public, max-age=300, s-maxage=3600',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export const json = (data: unknown, status = 200) => new Response(JSON.stringify(data, null, 2), { status, headers: publicHeaders })
export const options = () => new Response(null, { status: 204, headers: publicHeaders })
