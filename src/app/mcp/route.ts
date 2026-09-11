import { createMcpHandler } from 'mcp-handler'
import { z } from 'zod'
import { getApplications, getDocuments, getPayloadClient, getProduct, getProducts, getServices, getSiteSettings, getUpdates } from '@/lib/data'
import { createInquiry, inquirySchema, rateLimit } from '@/lib/inquiries'
import { applicationToMarkdown, companyMarkdown, productToMarkdown, serviceToMarkdown } from '@/lib/markdown'
import { publicDocument, publicProduct, publicUpdate } from '@/lib/public-api'
import { UPDATE_KINDS } from '@/collections/Updates'
import { GRADE_VALUES, PURPOSE_VALUES, SAMPLE_KIT_POLICY, describeItem } from '@/lib/rfq'
import { SITE_URL } from '@/lib/utils'
import { categoryOf } from '@/lib/catalog'

const text = (t: string) => ({ content: [{ type: 'text' as const, text: t }] })
const readOnly = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }

/**
 * Model Context Protocol server for Protpure. Streamable HTTP, stateless, no auth: everything it
 * exposes is public catalogue data, plus `request_quote`, which files the same inquiry a website
 * visitor would (rate-limited, confirmed by email, handled by a human).
 *
 * Client config: { "protpure": { "url": "https://protpure.com/mcp" } }
 */
const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      'list_products',
      {
        title: 'List Protpure products',
        description: 'List agarose chromatography resins, pre-packed columns and kits made by Protpure. Filter by category slug (e.g. ion-exchange, affinity, size-exclusion), grade (faster, fast-flow, precise, hr) or a free-text query. Returns compact product records with grades and links.',
        inputSchema: z.object({
          category: z.string().optional().describe('Category slug, e.g. "ion-exchange". Omit for all.'),
          grade: z.enum(['faster', 'fast-flow', 'precise', 'hr']).optional().describe('Only products available in this particle-size grade.'),
          query: z.string().max(100).optional().describe('Free-text search over name, ligand and summary, e.g. "His-tag" or "SP".'),
        }),
        annotations: readOnly,
      },
      async ({ category, grade, query }) => {
        let products = await getProducts({ category, search: query })
        if (grade) products = products.filter((p) => p.grades?.some((g) => g.grade === grade))
        const cats = Array.from(new Set(products.map((p) => categoryOf(p)?.slug))).filter(Boolean)
        return { ...text(JSON.stringify({ count: products.length, categories: cats, products: products.map((p) => publicProduct(p)) }, null, 2)) }
      },
    )

    server.registerTool(
      'get_product',
      {
        title: 'Get product details',
        description: 'Full technical detail for one product as Markdown: overview, grades table (particle size, flow velocity, binding capacity), specifications vs typical market spec, use cases, pack sizes, lead time and datasheet links.',
        inputSchema: z.object({ slug: z.string().describe('Product slug from list_products, e.g. "sp-agarose".') }),
        annotations: readOnly,
      },
      async ({ slug }) => {
        const p = await getProduct(slug)
        if (!p) return { ...text(`No product with slug "${slug}". Call list_products to see available slugs.`), isError: true }
        return text(productToMarkdown(p))
      },
    )

    server.registerTool(
      'compare_products',
      {
        title: 'Compare products',
        description: 'Side-by-side comparison of 2–4 products (chemistry, grades, particle size, flow velocity, binding capacity, shared specifications) as a Markdown table.',
        inputSchema: z.object({ slugs: z.array(z.string()).min(2).max(4).describe('Product slugs to compare.') }),
        annotations: readOnly,
      },
      async ({ slugs }) => {
        const products = (await Promise.all(slugs.map((s) => getProduct(s)))).filter(Boolean) as NonNullable<Awaited<ReturnType<typeof getProduct>>>[]
        if (products.length < 2) return { ...text('Need at least two valid slugs. Call list_products first.'), isError: true }
        const header = `| Parameter | ${products.map((p) => p.name).join(' | ')} |\n| --- | ${products.map(() => '---').join(' | ')} |`
        const row = (label: string, f: (p: (typeof products)[number]) => string) => `| ${label} | ${products.map((p) => (f(p) || '—').replace(/\|/g, '\\|')).join(' | ')} |`
        const gradeStr = (p: (typeof products)[number], k: 'particleSizeRange' | 'maxFlowVelocity' | 'dynamicBindingCapacity') => (p.grades ?? []).map((g) => `${g.grade}: ${g[k] ?? '—'}`).join('; ')
        const lines = [
          header,
          row('Category', (p) => categoryOf(p)?.name ?? ''),
          row('Type', (p) => p.chemistry?.functionalType ?? ''),
          row('Ligand', (p) => p.chemistry?.ligand ?? ''),
          row('Matrix', (p) => p.chemistry?.matrix ?? ''),
          row('Grades', (p) => (p.grades ?? []).map((g) => g.grade).join(', ')),
          row('Particle size', (p) => gradeStr(p, 'particleSizeRange')),
          row('Max flow velocity', (p) => gradeStr(p, 'maxFlowVelocity')),
          row('Dynamic binding capacity', (p) => gradeStr(p, 'dynamicBindingCapacity')),
        ]
        const params = Array.from(new Set(products.flatMap((p) => (p.specs ?? []).map((s) => s.parameter))))
        for (const param of params) lines.push(row(param, (p) => p.specs?.find((s) => s.parameter === param)?.value ?? ''))
        lines.push('', `Compare on the website: ${SITE_URL}/compare?${products.map((p) => `p=${p.slug}`).join('&')}`)
        return text(lines.join('\n'))
      },
    )

    server.registerTool(
      'search_documents',
      {
        title: 'Search documents',
        description: 'Find downloadable PDFs: technical datasheets, brochures, catalogs, case studies, performance data. Optionally filter by type or product slug.',
        inputSchema: z.object({
          type: z.enum(['datasheet', 'brochure', 'catalog', 'case-study', 'application-note', 'performance-data', 'poster', 'presentation', 'certificate', 'other']).optional(),
          product: z.string().optional().describe('Product slug to restrict to.'),
        }),
        annotations: readOnly,
      },
      async ({ type, product }) => {
        let productId: number | undefined
        if (product) {
          const p = await getProduct(product)
          if (!p) return { ...text(`Unknown product slug "${product}".`), isError: true }
          productId = p.id
        }
        const docs = await getDocuments({ types: type ? [type] : undefined, product: productId })
        return text(JSON.stringify({ count: docs.length, documents: docs.map(publicDocument) }, null, 2))
      },
    )

    server.registerTool(
      'list_applications',
      {
        title: 'List applications and services',
        description: 'Purification workflows Protpure supports (biologics, vaccines, diagnostics, research…) with recommended resins, plus downstream bioprocessing services (column packing, resin screening, method development, purification service).',
        inputSchema: z.object({}),
        annotations: readOnly,
      },
      async () => {
        const [apps, services] = await Promise.all([getApplications(), getServices()])
        return text(['# Applications', ...apps.map(applicationToMarkdown), '', '# Services', ...services.map(serviceToMarkdown)].join('\n\n'))
      },
    )

    server.registerTool(
      'get_company_info',
      {
        title: 'Company information',
        description: 'Who Protpure is, where it manufactures, how to buy (quotation only; paid sample kits, no free samples), lead times, regions served, export notes, contact details, company facts (founded, team size, capacity), quality claims and certifications, and the team with credentials and publications.',
        inputSchema: z.object({}),
        annotations: readOnly,
      },
      async () => text(await companyMarkdown()),
    )

    server.registerTool(
      'list_updates',
      {
        title: 'List recent updates',
        description: 'Recent published company updates mirrored from LinkedIn: product launches, performance data, milestones, services and perspectives. Each has a title, summary, date, kind, related products and the LinkedIn post URL.',
        inputSchema: z.object({
          kind: z.enum(UPDATE_KINDS.map((k) => k.value) as [string, ...string[]]).optional().describe('Only updates of this kind.'),
          limit: z.number().int().min(1).max(50).default(10),
        }),
        annotations: readOnly,
      },
      async ({ kind, limit }) => {
        const updates = await getUpdates(limit, { kind })
        return text(JSON.stringify({ count: updates.length, updates: updates.map(publicUpdate) }, null, 2))
      },
    )

    server.registerTool(
      'request_quote',
      {
        title: 'Request a quote or contact Protpure',
        description:
          'File a quotation, evaluation, technical or partnership request on behalf of a user. Only call this after the user has explicitly asked you to contact Protpure and has provided their name, work email and (ideally) organisation and country. ' +
          'List what they want as `items` — one line per product / grade / pack size with a quantity and a purpose (sample-kit, evaluation, production or other). ' +
          `Sample policy: ${SAMPLE_KIT_POLICY} ` +
          'Protpure emails a confirmation to the user and a scientist replies, typically within 1–2 business days. Returns the inquiry reference number.',
        inputSchema: z.object({
          type: z.enum(['quote', 'evaluation', 'technical', 'partnership', 'contact']).default('quote'),
          name: z.string().min(2).max(120).describe("Requester's full name."),
          email: z.string().email().describe("Requester's work email — the confirmation is sent here."),
          organization: z.string().max(200).optional(),
          country: z.string().max(80).optional().describe('Destination country for quoting/shipping.'),
          phone: z.string().max(40).optional(),
          items: z
            .array(
              z.object({
                productSlug: z.string().max(120).optional().describe('Product slug from list_products, e.g. "sp-agarose". Omit for a product not in the catalogue and give productName instead.'),
                productName: z.string().max(200).optional().describe('Free-text product name when there is no slug.'),
                grade: z.enum(GRADE_VALUES).optional().describe('Particle-size grade, if the user has a preference.'),
                packSize: z.string().max(80).optional().describe('Pack size from get_product, e.g. "1 L", "25 mL" or "Bulk (custom)".'),
                catalogNumber: z.string().max(80).optional(),
                quantity: z.number().int().min(1).max(10000).default(1).describe('Number of packs.'),
                purpose: z.enum(PURPOSE_VALUES).default('production').describe('sample-kit = paid sample kit credited against the first bulk order; evaluation = pilot quantity; production = bulk / production quantity.'),
                notes: z.string().max(300).optional().describe('Line note, e.g. column geometry or target volume.'),
              }),
            )
            .max(50)
            .optional()
            .describe('Requested lines. Preferred over productSlugs/requestedItems.'),
          productSlugs: z.array(z.string()).max(30).optional().describe('Legacy: product slugs of interest without quantities. Prefer `items`.'),
          requestedItems: z.string().max(2000).optional().describe('Legacy free text for quantities, grades and pack sizes. Prefer `items`.'),
          application: z.string().max(500).optional().describe('What the user is purifying.'),
          message: z.string().max(5000).optional(),
        }),
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
      },
      async (args, ctx) => {
        const ip = (ctx.http?.req?.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || null
        if (!rateLimit(`mcp-inquiry:${ip ?? 'anon'}`, 5)) return { ...text('Rate limit exceeded for this network. Please try again later or use the website form.'), isError: true }
        const payload = await getPayloadClient()
        let productIds: number[] = []
        if (args.productSlugs?.length) {
          const found = await Promise.all(args.productSlugs.map((s) => getProduct(s)))
          productIds = found.filter(Boolean).map((p) => p!.id)
        }
        const parsed = inquirySchema.safeParse({ ...args, productIds, consent: true, pageUrl: `${SITE_URL}/mcp` })
        if (!parsed.success) return { ...text(`Validation failed: ${parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`), isError: true }
        const doc = await createInquiry(payload, parsed.data, { source: 'mcp', ip, userAgent: 'mcp' })
        const settings = await getSiteSettings()
        const lines = (doc.items ?? []).map((i) => `- ${describeItem(i)}`)
        return text(
          [
            `Inquiry #${doc.id} filed${lines.length ? ` with ${lines.length} item${lines.length === 1 ? '' : 's'}:` : '.'}`,
            ...lines,
            `A confirmation email has been sent to ${doc.email}; Protpure replies ${settings.responseTime || 'within 1–2 business days'}. Reference #${doc.id} when following up${settings.email ? ` at ${settings.email}` : ''}.`,
          ].join('\n'),
        )
      },
    )
  },
  {
    serverInfo: { name: 'protpure', version: '1.0.0' },
    instructions:
      'Protpure Tech Pvt. Ltd. manufactures agarose-based chromatography resins in Anand, India and supplies worldwide. Use list_products/get_product for specifications, compare_products for side-by-side tables, search_documents for datasheets, get_company_info for company facts, certifications and the team, list_updates for recent news, and request_quote only when the user explicitly asks to contact Protpure. Pricing is by quotation. There are no free samples: paid sample kits (5–25 mL packs or a 1 mL pre-packed column) are credited against the first bulk order — file them as request_quote items with purpose "sample-kit".',
  },
)

export { handler as GET, handler as POST, handler as DELETE }
