import { GRADE_SHORT } from '@/components/product/cards'
import { categoryOf } from './catalog'
import { SITE_URL, absoluteUrl } from './utils'
import type { Application, Document, Product } from '@/payload-types'

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
    grades: (p.grades ?? []).map((g) => ({ grade: g.grade, gradeLabel: GRADE_SHORT[g.grade] ?? g.grade, label: g.label ?? null, particleSizeRange: g.particleSizeRange ?? null, d50: g.d50 ?? null, maxFlowVelocity: g.maxFlowVelocity ?? null, dynamicBindingCapacity: g.dynamicBindingCapacity ?? null, pressureFlow: g.pressureFlow ?? null })),
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

export const publicHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'public, max-age=300, s-maxage=3600',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export const json = (data: unknown, status = 200) => new Response(JSON.stringify(data, null, 2), { status, headers: publicHeaders })
export const options = () => new Response(null, { status: 204, headers: publicHeaders })
