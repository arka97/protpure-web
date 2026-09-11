/**
 * Markdown renderings of site content for AI assistants and crawlers.
 * Served at /md/<path>, via `Accept: text/markdown`, in /llms-full.txt and through the MCP server.
 */
import { getApplications, getCategories, getCertifications, getDocuments, getFaqs, getPage, getPosts, getProducts, getServices, getSiteSettings, getTeam, getUpdates } from './data'
import { categoryOf } from './catalog'
import { lexicalToMarkdown } from './lexical-md'
import { GRADE_LABELS as GRADE_SHORT, SAMPLE_KIT_POLICY, type GradeValue } from './rfq'
import { extraClaims, proofItems, publicationCitation, type Proof } from './trust'
import { SITE_URL, absoluteUrl, formatDate } from './utils'
import type { Application, Certification, Document, Page, Post, Product, Service, Team, Update } from '@/payload-types'

const table = (headers: string[], rows: string[][]) => [`| ${headers.join(' | ')} |`, `| ${headers.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.map((c) => (c ?? '').replace(/\|/g, '\\|')).join(' | ')} |`)].join('\n')

export function productToMarkdown(p: Product, opts?: { brief?: boolean }): string {
  const cat = categoryOf(p)
  const out: string[] = []
  out.push(`# ${p.name}${p.subtitle ? ` — ${p.subtitle}` : ''}`)
  out.push(`Category: ${cat?.name ?? ''} · Availability: ${p.availability ?? 'available'} · URL: ${SITE_URL}/products/${p.slug}`)
  out.push('')
  out.push(p.summary)
  if (opts?.brief) return out.join('\n')
  if (p.description) out.push('', lexicalToMarkdown(p.description as never))
  if (p.keyFeatures?.length) out.push('', '## Key features', ...p.keyFeatures.map((f) => `- ${f.text}`))
  if (p.chemistry?.ligand || p.chemistry?.matrix || p.chemistry?.functionalType) {
    out.push('', '## Chemistry')
    if (p.chemistry.functionalType) out.push(`- Type: ${p.chemistry.functionalType}`)
    if (p.chemistry.ligand) out.push(`- Ligand: ${p.chemistry.ligand}`)
    if (p.chemistry.matrix) out.push(`- Matrix: ${p.chemistry.matrix}`)
  }
  if (p.grades?.length) {
    out.push('', '## Grades')
    out.push(
      table(
        ['Grade', 'Particle size range', 'd50V', 'Max linear flow velocity', 'Dynamic binding capacity', 'Pressure / flow'],
        p.grades.map((g) => [g.label || `${p.name} ${GRADE_SHORT[g.grade as GradeValue] ?? g.grade}`, g.particleSizeRange ?? '', g.d50 ?? '', g.maxFlowVelocity ?? '', g.dynamicBindingCapacity ?? '', g.pressureFlow ?? '']),
      ),
    )
  }
  if (p.specs?.length) {
    out.push('', '## Specifications')
    const hasMarket = p.specs.some((s) => s.marketSpec)
    out.push(table(hasMarket ? ['Parameter', p.name, 'Typical market spec'] : ['Parameter', p.name], p.specs.map((s) => (hasMarket ? [s.parameter, s.value, s.marketSpec ?? ''] : [s.parameter, s.value]))))
  }
  if (p.useCases?.length) out.push('', '## Typical use cases', ...p.useCases.map((u) => `- ${u.text}`))
  const apps = (p.applications ?? []).filter((a): a is Application => typeof a === 'object')
  if (apps.length) out.push('', '## Applications', ...apps.map((a) => `- [${a.name}](${SITE_URL}/applications/${a.slug})`))
  out.push('', '## Ordering')
  out.push(`- Pricing: by quotation — add this product to the RFQ basket at ${SITE_URL}/request-quote?product=${p.id} (one request can cover several products, grades and pack sizes)`)
  out.push(`- Samples: ${SAMPLE_KIT_POLICY} Mark the basket line "sample kit" (or send \`purpose: "sample-kit"\` via the API / MCP).`)
  out.push(`- Lead time: ${p.leadTime || '2–3 weeks ex-works'}`)
  if (p.bulkAvailable) out.push('- Bulk and custom volumes available')
  if (p.packSizes?.length) out.push('', table(['Pack size', 'Grade', 'Catalog no.'], p.packSizes.map((ps) => [ps.size, ps.grade ? GRADE_SHORT[ps.grade as GradeValue] ?? ps.grade : '', ps.catalogNumber ?? 'on request'])))
  const docs = (p.documents ?? []).filter((d): d is Document => typeof d === 'object')
  if (docs.length) out.push('', '## Documents', ...docs.map((d) => `- [${d.title}](${absoluteUrl(d.url ?? "")}) (${d.type}${d.revision ? `, ${d.revision}` : ''})`))
  const related = (p.relatedProducts ?? []).filter((r): r is Product => typeof r === 'object')
  if (related.length) out.push('', '## Related products', ...related.map((r) => `- [${r.name}](${SITE_URL}/products/${r.slug})`))
  return out.join('\n')
}

export function pageToMarkdown(page: Page): string {
  const out: string[] = [`# ${page.hero?.heading || page.title}`]
  if (page.hero?.text) out.push('', page.hero.text)
  for (const b of page.layout ?? []) {
    switch (b.blockType) {
      case 'richText':
        out.push('', lexicalToMarkdown(b.content as never))
        break
      case 'trustStrip':
        if (b.source === 'custom' && b.items?.length) out.push('', b.items.map((i) => i.text).join(' · '))
        break
      case 'stats':
        out.push('', b.heading ? `## ${b.heading}` : '', ...(b.items ?? []).map((i) => `- **${i.value}${i.unit ? ` ${i.unit}` : ''}** ${i.label}${i.note ? ` (${i.note})` : ''}`))
        break
      case 'featureGrid':
        out.push('', b.heading ? `## ${b.heading}` : '', b.intro ?? '', ...(b.items ?? []).map((i) => `- **${i.title}** — ${i.text}`))
        break
      case 'twoColumn':
        out.push('', b.heading ? `## ${b.heading}` : '', lexicalToMarkdown(b.content as never), b.quote ? `> ${b.quote}` : '', b.secondImageText ?? '', ...(b.facts ?? []).map((f) => `- ${f.label}: ${f.value}`))
        break
      case 'comparisonTable':
        out.push('', b.heading ? `## ${b.heading}` : '', b.intro ?? '', table(['Parameter', b.columnA, b.columnB], (b.rows ?? []).map((r) => [r.parameter, r.a, r.b])), b.note ?? '')
        break
      case 'gradesPlatform':
        out.push('', b.heading ? `## ${b.heading}` : '', b.intro ?? '', table(['Grade', 'Application', 'd50V', 'Size range', 'Max linear flow', 'Pressure', 'Notes'], (b.grades ?? []).map((g) => [g.name, g.badge ?? '', g.d50 ?? '', g.sizeRange ?? '', g.maxFlow ?? '', g.pressure ?? '', g.text ?? ''])), b.note ?? '')
        break
      case 'timeline':
        out.push('', b.heading ? `## ${b.heading}` : '', ...(b.items ?? []).map((i) => `- **${i.date}** — ${i.title}${i.text ? `: ${i.text}` : ''}`))
        break
      case 'cta':
        out.push('', `## ${b.heading}`, b.text ?? '', b.note ? `**${b.note}**` : '')
        break
      case 'gallery':
        // Photos only render once the editor adds them; captions are the useful text for an agent.
        if (b.items?.length) out.push('', b.heading ? `## ${b.heading}` : '', ...b.items.map((i) => `- ${[i.label, i.caption].filter(Boolean).join(': ') || 'Photo'}`))
        break
      case 'logoWall':
        if (b.heading || b.fallbackStatement) out.push('', b.heading ? `## ${b.heading}` : '', b.fallbackStatement ?? '')
        break
      case 'proofBar':
        break
      case 'publications':
      case 'certificationsStrip':
      case 'productCategories':
      case 'featuredProducts':
      case 'applicationsGrid':
      case 'servicesGrid':
      case 'faqBlock':
      case 'documentList':
      case 'latestPosts':
      case 'linkedInFeed':
      case 'teamGrid':
      case 'testimonials':
      case 'resinSelector':
      case 'formBlock':
        if (b.heading) out.push('', `## ${b.heading}`, 'intro' in b ? (b.intro ?? '') : '')
        break
      default:
        break
    }
  }
  return out.filter((l, i, arr) => !(l === '' && arr[i - 1] === '')).join('\n')
}

export function postToMarkdown(post: Post): string {
  return [`# ${post.title}`, `Published: ${formatDate(post.publishedAt)} · URL: ${SITE_URL}/blog/${post.slug}`, '', post.excerpt, '', lexicalToMarkdown(post.content as never)].join('\n')
}

export function applicationToMarkdown(a: Application): string {
  const products = (a.recommendedProducts ?? []).filter((p): p is Product => typeof p === 'object')
  return [
    `# ${a.name}`,
    `URL: ${SITE_URL}/applications/${a.slug}`,
    '',
    a.summary,
    '',
    lexicalToMarkdown(a.description as never),
    ...(a.workflows?.length ? ['', '## Typical workflows', ...a.workflows.map((w) => `- ${w.text}`)] : []),
    ...(products.length ? ['', '## Recommended resins', ...products.map((p) => `- [${p.name}](${SITE_URL}/products/${p.slug}) — ${p.summary}`)] : []),
  ].join('\n')
}

export function serviceToMarkdown(s: Service): string {
  return [`## ${s.name}${s.tagline ? ` — ${s.tagline}` : ''}`, '', s.summary, '', lexicalToMarkdown(s.description as never), ...(s.deliverables?.length ? ['', 'Deliverables:', ...s.deliverables.map((d) => `- ${d.text}`)] : [])].join('\n')
}

/** "- **Founded:** May 2023" style lines for the proof points; empty array when nothing is set. */
export function proofToMarkdown(proof?: Proof | null): string[] {
  const labels: Record<string, string> = { founded: 'Founded', team: 'Team', capacity: 'Manufacturing capacity', customers: 'Customers', linkedin: 'LinkedIn' }
  return proofItems(proof).map((it) => `- ${labels[it.key] ?? it.key}: ${it.key === 'founded' ? it.value.replace(/^Founded\s+/i, '') : it.value}`)
}

/**
 * "## Quality & claims" list: entries from the Certifications collection (with issuer, validity and
 * certificate link) followed by any site-settings claims not already covered. Empty string when both are empty.
 */
export function certificationsToMarkdown(certs: Certification[], claims?: { text: string }[] | null): string {
  const lines = certs.map((c) => {
    const doc = c.document && typeof c.document === 'object' ? c.document : null
    const meta = [c.issuer ? `issued by ${c.issuer}` : null, c.validUntil ? `valid until ${formatDate(c.validUntil)}` : null].filter(Boolean).join(', ')
    const tail = [c.statement, doc?.url ? `[certificate](${absoluteUrl(doc.url)})` : null].filter(Boolean).join(' ')
    return `- ${c.name}${meta ? ` (${meta})` : ''}${tail ? ` — ${tail}` : ''}`
  })
  for (const t of extraClaims(claims, certs)) lines.push(`- ${t}`)
  return lines.length ? ['## Quality & claims', ...lines].join('\n') : ''
}

/** One team member: name, role, credentials, expertise, publications with links. */
export function teamMemberToMarkdown(m: Team): string {
  const out = [`### ${m.name}${m.credentials?.length ? `, ${m.credentials.map((c) => c.text).join(', ')}` : ''}`, m.role]
  if (m.bio) out.push('', lexicalToMarkdown(m.bio as never))
  if (m.expertise?.length) out.push('', `Expertise: ${m.expertise.map((e) => e.text).join('; ')}`)
  if (m.publications?.length) out.push('', 'Publications:', ...m.publications.map((p) => `- ${p.url ? `[${publicationCitation(p)}](${p.url})` : publicationCitation(p)}`))
  if (m.linkedinUrl) out.push('', `LinkedIn: ${m.linkedinUrl}`)
  return out.join('\n')
}

/** One LinkedIn update as a list line (published updates only reach this). */
export function updateToMarkdown(u: Update): string {
  return `- ${formatDate(u.publishedAt)} — **${u.title}**${u.kind ? ` [${u.kind}]` : ''}: ${u.summary}${u.url ? ` (${u.url})` : ''}`
}

export async function companyMarkdown(): Promise<string> {
  const [s, certs, team] = await Promise.all([getSiteSettings(), getCertifications(), getTeam()])
  const out = [`# ${s.legalName || s.name || 'Protpure'}`, '', s.aiSummary || s.description || '']
  const proof = proofToMarkdown(s.proof)
  if (proof.length) out.push('', '## Company facts', ...proof)
  out.push('', '## Contact')
  if (s.email) out.push(`- Email: ${s.email}`)
  if (s.phone) out.push(`- Phone: ${s.phone}`)
  if (s.address) out.push(`- Address: ${s.address.replace(/\n/g, ', ')}`)
  if (s.social?.linkedin) out.push(`- LinkedIn: ${s.social.linkedin}`)
  out.push(`- Request a quote: ${SITE_URL}/request-quote (RFQ basket: several products, grades and pack sizes in one request)`)
  out.push(`- Samples: ${SAMPLE_KIT_POLICY}`)
  if (s.responseTime) out.push(`- Response time: ${s.responseTime}`)
  if (s.leadTime) out.push(`- Typical lead time: ${s.leadTime}`)
  if (s.globalStatement || s.regions?.length) {
    out.push('', '## International supply')
    if (s.globalStatement) out.push(s.globalStatement)
    for (const r of s.regions ?? []) out.push(`- ${r.name}: ${r.status}${r.note ? ` (${r.note})` : ''}`)
    for (const n of s.exportNotes ?? []) out.push(`- ${n.text}`)
  }
  const quality = certificationsToMarkdown(certs, s.certifications)
  if (quality) out.push('', quality)
  if (team.length) out.push('', '## Team', ...team.map((m) => `\n${teamMemberToMarkdown(m)}`))
  return out.join('\n')
}

export async function llmsTxt(): Promise<string> {
  const [s, categories, products, apps, services, docs, posts, faqs] = await Promise.all([getSiteSettings(), getCategories(), getProducts(), getApplications(), getServices(), getDocuments({ limit: 50 }), getPosts({ limit: 20 }), getFaqs()])
  const out: string[] = []
  out.push(`# ${s.name || 'Protpure'}`, '')
  out.push(`> ${s.aiSummary || s.description || 'Indian manufacturer of agarose-based chromatography resins for biopharmaceutical purification, supplying worldwide.'}`, '')
  out.push(`Pricing is by quotation. ${SAMPLE_KIT_POLICY} Buyers use the RFQ basket on the website (add products with grade, pack size, quantity and purpose, then submit one request); agents can file the same request with \`items[]\` via the MCP \`request_quote\` tool or \`POST /api/public/inquiries\`. Every request is confirmed by email and handled by a scientist.`, '')
  out.push('## Machine-readable access', '')
  out.push(`- MCP server (Streamable HTTP): ${SITE_URL}/mcp — tools: list_products, get_product, compare_products, search_documents, list_applications, get_company_info, list_updates, request_quote`)
  out.push(`- Public JSON API: ${SITE_URL}/api/public/products, ${SITE_URL}/api/public/products/{slug}, ${SITE_URL}/api/public/documents, ${SITE_URL}/api/public/company`)
  out.push(`- Markdown for any page: ${SITE_URL}/md/<path> or send \`Accept: text/markdown\` to the HTML URL`)
  out.push(`- Full site as one Markdown file: ${SITE_URL}/llms-full.txt`)
  out.push(`- Blog RSS: ${SITE_URL}/blog/rss.xml`, '')
  out.push('## Company', '', `- [About](${SITE_URL}/md/about): who we are, facility, team`, `- [Company info](${SITE_URL}/md/company): contact, company facts, quality claims and certifications, team credentials and publications, regions served, export notes`, `- [Technology](${SITE_URL}/md/technology): the particle-size platform (Faster / Fast Flow / Precise / HR grades)`, `- [Request a quote](${SITE_URL}/request-quote)`, `- [Contact](${SITE_URL}/contact)`, '')
  out.push('## Product categories', '', ...categories.map((c) => `- [${c.name}](${SITE_URL}/products/category/${c.slug}): ${c.tagline ?? ''}`), '')
  out.push('## Products', '', ...products.map((p) => `- [${p.name}](${SITE_URL}/md/products/${p.slug}): ${p.subtitle ? `${p.subtitle}. ` : ''}${p.summary}`), '')
  out.push('## Applications', '', ...apps.map((a) => `- [${a.name}](${SITE_URL}/md/applications/${a.slug}): ${a.summary}`), '')
  out.push('## Services', '', ...services.map((sv) => `- [${sv.name}](${SITE_URL}/services#${sv.slug}): ${sv.summary}`), '')
  if (docs.length) out.push('## Documents (PDF)', '', ...docs.map((d) => `- [${d.title}](${absoluteUrl(d.url ?? "")}): ${d.type}${d.summary ? ` — ${d.summary}` : ''}`), '')
  if (posts.docs.length) out.push('## Blog', '', ...posts.docs.map((p) => `- [${p.title}](${SITE_URL}/md/blog/${p.slug}): ${p.excerpt}`), '')
  if (faqs.length) out.push('## FAQ', '', `- [All questions](${SITE_URL}/md/faq)`, '')
  return out.join('\n')
}

export async function llmsFullTxt(): Promise<string> {
  const [company, products, apps, services, faqs, updates, posts] = await Promise.all([companyMarkdown(), getProducts(), getApplications(), getServices(), getFaqs(), getUpdates(20), getPosts({ limit: 50 })])
  const pages = await Promise.all(['home', 'about', 'technology', 'quality'].map((s) => getPage(s)))
  const out: string[] = [company]
  for (const page of pages) if (page) out.push('', '---', '', pageToMarkdown(page))
  out.push('', '---', '', '# Products')
  for (const p of products) out.push('', '---', '', productToMarkdown(p))
  out.push('', '---', '', '# Applications')
  for (const a of apps) out.push('', applicationToMarkdown(a))
  out.push('', '---', '', '# Services')
  for (const s of services) out.push('', serviceToMarkdown(s))
  if (faqs.length) out.push('', '---', '', '# FAQ', ...faqs.map((f) => `\n### ${f.question}\n${lexicalToMarkdown(f.answer as never)}`))
  if (updates.length) out.push('', '---', '', '# Recent LinkedIn updates', ...updates.map(updateToMarkdown))
  for (const post of posts.docs) out.push('', '---', '', postToMarkdown(post))
  return out.join('\n')
}

export async function faqMarkdown(): Promise<string> {
  const faqs = await getFaqs()
  return ['# Frequently asked questions', ...faqs.map((f) => `\n## ${f.question}\n${lexicalToMarkdown(f.answer as never)}`)].join('\n')
}
