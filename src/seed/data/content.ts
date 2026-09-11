import { rt } from '../richtext'

export const categories = [
  { slug: 'ion-exchange', name: 'Ion Exchange', shortName: 'IEX', icon: 'ion-exchange', mode: 'ion-exchange', order: 1, tagline: 'SP, CM, Q and DEAE agarose — strong and weak cation/anion exchangers for capture, intermediate purification and polishing.', description: rt(`Ion exchange is the core step in most biopharma purification processes: capture, intermediate and polishing stages all depend on it, and it has a high impact on yield, purity and robustness.

Protpure's design focus is a controlled bead-size distribution, stable ligand attachment and reproducible batch characteristics. All four chemistries share the same 6% spherical cross-linked agarose backbone and come in Fast Flow, Precise and HR grades (Faster for industrial capture).`) },
  { slug: 'affinity', name: 'Affinity (IMAC)', shortName: 'IMAC', icon: 'affinity', mode: 'affinity', order: 2, tagline: 'Ni-, Co-, Cu- and Zn-NTA resins for single-step capture of His-tagged proteins, plus Protein A.', description: rt(`Immobilised metal affinity chromatography gives the highest purity in a single step. Protpure's NTA resins deliver high binding capacity, excellent chemical stability and consistent performance from research to large-scale processing. Ni-NTA Agarose is our most established product, supplied commercially with repeat usage in GMP facilities.`) },
  { slug: 'size-exclusion', name: 'Size Exclusion & Desalting', shortName: 'SEC', icon: 'sec', mode: 'size-exclusion', order: 3, tagline: 'Plain and cross-linked agarose for molecular sieving, aggregate analysis, desalting and buffer exchange.', description: rt(`Pore size on the agarose bead separates molecules by size and shape. Larger proteins and extracellular vesicles elute first; smaller molecules that enter the pores elute later. Choose 2%, 4% or 6% agarose to set the fractionation range and back-pressure.`) },
  { slug: 'hydrophobic-interaction', name: 'Hydrophobic Interaction', shortName: 'HIC', icon: 'hic', mode: 'hydrophobic-interaction', order: 4, tagline: 'Phenyl Agarose for mild, orthogonal purification and aggregate removal.', description: rt(`Hydrophobic interaction chromatography separates on surface hydrophobicity under mild, non-denaturing conditions — an ideal orthogonal step after ion exchange or affinity capture, and a strong tool for aggregate removal.`) },
  { slug: 'mixed-mode', name: 'Mixed-Mode', shortName: 'Mixed-mode', icon: 'mixed-mode', mode: 'mixed-mode', order: 5, tagline: 'Hy-Ionic™ DP: DEAE and phenyl functionality on one matrix, two independently addressable modes.', description: rt(`Mixed-mode resins combine ionic and hydrophobic interactions on a single bead, giving selectivities that neither mode delivers alone and letting you switch mode on the same packed column.`) },
  { slug: 'activated', name: 'Activated & Coupling', shortName: 'Activated', icon: 'activated', mode: 'affinity', order: 6, tagline: 'CNBr-activated agarose for immobilising your own ligands; custom coupling on request.', description: rt(`Activated supports let you build custom affinity resins by coupling antibodies, antigens, enzymes or peptides. Protpure also offers custom ligand coupling as a service.`) },
  { slug: 'columns', name: 'Pre-packed Columns', shortName: 'Columns', icon: 'column', mode: 'formats', order: 7, tagline: 'Ready-to-use 1 mL to 20 mL FPLC columns for screening and pilot work.', description: rt(`Pre-packed columns remove packing variability from screening and small-scale purification. Every column is packed and tested in our facility.`) },
  { slug: 'kits', name: 'Kits & Tools', shortName: 'Kits', icon: 'kit', mode: 'kits', order: 8, tagline: 'Evaluation kits such as the MR Agarose transition-metal-removal kit.', description: rt(`Evaluation kits let you validate a resin in your own process before committing to bulk volumes.`) },
  { slug: 'magnetic', name: 'Magnetic Beads', shortName: 'Magnetic', icon: 'magnetic', mode: 'affinity', order: 9, tagline: 'Ni-NTA magnetic agarose for column-free, high-throughput screening.', description: rt(`Magnetic agarose beads bring affinity purification to the microplate and microtube: no column, no pump, separation on a magnetic stand in minutes.`) },
]

export const applications = [
  { slug: 'biologics-biosimilars', name: 'Biologics & Biosimilars', order: 1, summary: 'Recombinant proteins, monoclonal antibodies and fusion proteins from capture to polishing, with HCP, DNA and aggregate clearance.', workflows: ['Recombinant proteins', 'Monoclonal antibodies', 'Fusion proteins', 'Host cell protein removal'], products: ['sp-agarose', 'q-agarose', 'hy-ionic-dp', 'phenyl-agarose', 'agarose-sec-resin'], description: rt(`Biologics manufacturers need resins that scale from process development to commercial batches without surprises. Protpure's ion exchange, mixed-mode and HIC resins share one cross-linked agarose backbone, so pressure–flow behaviour and cleaning regimes stay predictable from a 1 mL screening column to a BPG 200 process column.

For teams currently using non-agarose resins under moderate to low pressure, Protpure's agarose-based resins offer a compatible, high-resolution alternative with GMP familiarity, reproducible performance and scalable throughput.`) },
  { slug: 'vaccines', name: 'Vaccines', order: 2, summary: 'Recombinant antigens, protein vaccines and viral vector downstream processing at manufacturing-scale flow rates.', workflows: ['Recombinant antigens', 'Protein vaccines', 'Viral vector purification', 'Purification workflows'], products: ['q-agarose', 'sp-agarose', 'deae-agarose', 'agarose-sec-resin'], description: rt(`Vaccine downstream processing rewards resins with high flow velocity and robust cleaning. Q and SP Agarose Faster grades run to 1000 cm/h for capture, while DEAE and SEC resins polish antigens and exchange buffers ahead of formulation.`) },
  { slug: 'diagnostics', name: 'Diagnostics', order: 3, summary: 'Diagnostic proteins, enzymes and biomarkers purified reproducibly, batch after batch.', workflows: ['Diagnostic proteins', 'Enzymes', 'Biomarkers', 'Antibody reagents'], products: ['ni-nta-agarose', 'ni-nta-prepacked-columns', 'deae-agarose', 'cnbr-activated-agarose'], description: rt(`Diagnostic reagent producers need consistent purity at moderate scale and short lead times. Ni-NTA Agarose and pre-packed columns deliver His-tagged enzymes and antigens in one step; CNBr-activated agarose lets you build immunoaffinity resins around your own antibodies.`) },
  { slug: 'research-academia', name: 'Research & Academia', order: 4, summary: 'Protein purification, method development and life-science research with small packs, pre-packed columns and direct scientist support.', workflows: ['Protein purification', 'Method development', 'Expression screening', 'Life sciences research'], products: ['ni-nta-agarose', 'ni-nta-prepacked-columns', 'ni-nta-magnetic-agarose', 'sp-agarose', 'agarose-sec-resin'], description: rt(`Academic and CRO labs get the same BioProcess-grade resins as manufacturers, in 5 mL to 100 mL packs, with a scientist on the other end of the email. Pre-packed 1 mL columns and magnetic beads make construct screening fast.`) },
  { slug: 'industrial-biotechnology', name: 'Industrial Biotechnology', order: 5, summary: 'Enzymes, fermentation products and speciality proteins purified at high throughput and competitive cost.', workflows: ['Enzymes', 'Fermentation products', 'Speciality proteins', 'Partial purification of insulin'], products: ['q-agarose', 'sp-agarose', 'deae-agarose', 'phenyl-agarose', 'mr-agarose-kit'], description: rt(`Industrial biotech runs on cost per gram. Agarose Faster grades (163 µm mean bead size, up to 1000 cm/h) were developed for exactly this: high throughput capture of large proteins such as recombinant enzymes and partial purification of insulin, with resin that cleans in 1 M NaOH and reuses cycle after cycle.`) },
  { slug: 'gene-editing-advanced-therapies', name: 'Gene Editing & Advanced Therapies', order: 6, summary: 'CRISPR proteins, nucleases and gene-editing workflow reagents, plus plasmid DNA purification.', workflows: ['CRISPR proteins', 'Nucleases', 'Plasmid DNA', 'Gene editing workflows'], products: ['ni-nta-agarose', 'sp-agarose', 'q-agarose', 'hy-ionic-dp'], description: rt(`Nucleases and Cas proteins are typically His-tagged and strongly basic: Ni-NTA capture followed by SP polishing is a natural fit, while Q Agarose and Hy-Ionic DP handle plasmid DNA and host impurity clearance.`) },
]

export const services = [
  { slug: 'precision-column-packing', name: 'Precision Column Packing', order: 1, tagline: 'Reproducible columns. Reliable performance.', summary: 'We pack and qualify columns from 5 mL to 1 L (10, 16, 26 and 50 mm diameters) and deliver a column performance report: asymmetry factor, HETP, number of theoretical plates and reduced plate height.', deliverables: ['Packed column at your specified bed height', 'Column performance report (As, HETP, N, h)', 'Packing protocol for reproduction on site'], idealFor: ['Labs without packing skids', 'Process development groups', 'Reproducibility troubleshooting'], description: rt(`Reproducibility does not start with sample loading — it starts with column packing. Even with the same resin, column, buffer and packing velocity, small variations in bed consolidation change efficiency, peak symmetry and scale-up consistency. We pack every column under a controlled protocol and evaluate it with an acetone pulse test before it leaves the lab.`) },
  { slug: 'resin-screening', name: 'Chromatography Resin Screening & Selection', order: 2, tagline: 'Identify the most suitable resin for your purification objective.', summary: 'Screen multiple chromatography resins against your feedstock to identify the best purification route for your target protein — binding, recovery, selectivity, resolution and capacity compared side by side.', deliverables: ['Screening on 1 mL pre-packed columns', 'Comparison of binding, recovery, selectivity, resolution and capacity', 'Recommended resin and grade with rationale'], idealFor: ['New molecules entering process development', 'Second-sourcing an imported resin', 'Evaluating agarose alternatives to non-agarose media'], description: rt(`Bring your clarified feed; we run it across our IEX, IMAC, HIC and mixed-mode resins on pre-packed columns and report what bound, what eluted and how clean it was. Outcome: technical data only — you decide.`) },
  { slug: 'method-development', name: 'Method Development', order: 3, tagline: 'Optimise chromatographic conditions for purity, recovery and reproducibility.', summary: 'From sample to optimised purification method: buffer pH and composition, loading (sample load and flow rate), wash and elution conditions (gradient and step), evaluated on DBC, recovery, selectivity, pressure–flow and resolution.', deliverables: ['Optimised buffers and gradient program', 'Loading study and dynamic binding capacity', 'Method report with chromatograms and evaluation parameters'], idealFor: ['Teams under timeline pressure', 'Transferring a method to a new resin', 'Scale-up preparation'], description: rt(`Method development is iterative and resin-specific. Because we make the resin, we can also adjust it — bead size, ligand density — when the method calls for it. Every study is documented so it transfers to your site.`) },
  { slug: 'protein-purification-service', name: 'Protein Purification Service', order: 4, tagline: 'From clarified sample to purified protein.', summary: 'We don’t just purify your protein: we select the resin, develop the method, pack the column and demonstrate performance across the workflow — clarification, capture, intermediate purification, polishing and analytical assessment.', deliverables: ['Purified protein with CoA-style characterisation', 'Documented process (resin, column, method)', 'Transferable protocol for in-house runs'], idealFor: ['Academic and research laboratories', 'Research centres and CROs', 'Biotech start-ups without downstream capacity', 'Industry pilot batches'], description: rt(`Chromatography platforms available: affinity, ion exchange, HIC and SEC, on FPLC systems with columns from 5 mL to 1 L. Evaluation parameters reported: dynamic binding capacity, recovery, selectivity, pressure–flow and resolution.`) },
]

export const faqs = [
  { category: 'ordering', order: 1, question: 'Do you offer sample kits?', answer: rt(`Yes — paid sample kits (5–25 mL packs or a 1 mL pre-packed column), credited against your first bulk order. There are no free samples: the nominal price means every evaluation gets scientist support and documentation. Use the quote form and choose “Evaluation”.`) },
  { category: 'ordering', order: 2, question: 'How is pricing determined?', answer: rt(`Pricing is by quotation and depends on product, grade, pack size, quantity and destination. Bulk volumes (5 L and above) and custom pack sizes are priced individually. We reply within 1–2 business days with pricing, lead time and shipping options.`) },
  { category: 'ordering', order: 3, question: 'What is the typical lead time?', answer: rt(`Standard products ship in 2–3 weeks ex-works from Anand, Gujarat, compared with 8–12 weeks typical for imported resins. Made-to-order products (e.g. Protein A Agarose) and custom chemistries are quoted case by case.`) },
  { category: 'ordering', order: 4, question: 'What pack sizes are available?', answer: rt(`Resins: 5 mL to 25 L standard packs and bulk in custom volumes. Pre-packed columns: 1 mL (packs of 5), 5 mL, 10 mL and 20 mL. See each product’s Ordering section for the current list and catalog numbers.`) },
  { category: 'shipping', order: 1, question: 'Do you ship internationally?', answer: rt(`Yes. We supply worldwide ex-works or via your preferred forwarder, with commercial invoice, packing list and technical documentation for customs. Resins ship in 20% ethanol at ambient temperature; no cold chain is required. Tell us the destination in your quote request and we will include shipping options.`) },
  { category: 'shipping', order: 2, question: 'How are resins packaged and stored?', answer: rt(`Resins are supplied as a slurry in 20% ethanol in sealed HDPE containers. Store at 4–30 °C, away from freezing. Shelf life is stated on the certificate of analysis.`) },
  { category: 'shipping', order: 3, question: 'Are you looking for distributors?', answer: rt(`Yes — we are building distribution partnerships outside India. If you serve biopharma, research or diagnostic customers in your region, use the contact form and choose “Distribution / partnership”.`) },
  { category: 'quality', order: 1, question: 'What documentation do you provide?', answer: rt(`Technical datasheet, certificate of analysis per lot, and on request: extractables information, cleaning validation support and product-change notification. Our resins are used in GMP facilities by Indian biopharma companies with repeat orders.`) },
  { category: 'quality', order: 2, question: 'Are your resins BioProcess grade?', answer: rt(`Yes. SP, Q, DEAE, Phenyl and Ni-NTA Agarose are specified as BioProcess resins: stable in 1.0 M NaOH, 8 M urea, 6 M guanidine hydrochloride and 70% ethanol, with a CIP pH range of 2–14 and operational range of 2–12.`) },
  { category: 'products', order: 1, question: 'What is the difference between Faster, Fast Flow, Precise and HR grades?', answer: rt(`They are the same ligand chemistry on the same 6% cross-linked agarose backbone, with different bead sizes. Faster (~150–163 µm) runs up to 1000 cm/h for industrial capture; Fast Flow (~90 µm) balances flow and capacity at up to 700 cm/h; Precise (~60–65 µm) favours resolution at up to 380 cm/h; HR (~35–40 µm) gives the highest resolution for polishing at up to 120 cm/h. The resin selector on the homepage suggests a grade for your workflow.`) },
  { category: 'products', order: 2, question: 'Can you make custom resins?', answer: rt(`Yes. We control bead synthesis, cross-linking and ligand chemistry in-house, so custom bead sizes, ligand densities and coupled ligands (on CNBr-activated agarose) are possible. Describe the target and scale in a technical inquiry.`) },
  { category: 'products', order: 3, question: 'Are Protpure resins drop-in replacements for imported agarose resins?', answer: rt(`Our specifications are benchmarked against typical market specifications (see the comparison tables on each product page), and customers have qualified them in place of imported resins. We recommend a side-by-side evaluation under your existing SOPs; our resin screening service can run it for you.`) },
  { category: 'technical', order: 1, question: 'How do I get technical support?', answer: rt(`Write to us through the contact form or email — every request is answered by a scientist, not a call centre. For method development, column packing and resin screening we offer paid services with documented reports.`) },
  { category: 'technical', order: 2, question: 'Can I use your data in regulatory filings?', answer: rt(`Datasheet values and certificates of analysis can be referenced; for filings we provide additional documentation under a confidentiality agreement. Contact us early in your qualification so we can align on what you need.`) },
]

export const team = [
  {
    name: 'Dr. Rucha P. Desai',
    role: 'Founding Director',
    tagline: 'Materials scientist · bead synthesis, cross-linking and ligand chemistry',
    order: 1,
    featured: true,
    linkedinUrl: 'https://www.linkedin.com/in/rucha-desai-b326003/',
    bio: rt(`Scientist and founder of Protpure Tech. After academic research in materials science, nanoparticle synthesis and magnetic fluids, Dr. Desai established Protpure in 2023 to build an indigenous agarose chromatography resin platform for India’s biopharma industry — from bead synthesis and cross-linking to ligand chemistry, process evaluation and customer deployment.`),
    credentials: ['M.Sc., Ph.D. (Physics)'],
    expertise: ['Bead polymerisation', 'Ligand coupling', 'Magnetic fluids and nanoparticle synthesis', 'Downstream process development'],
    // From public ResearchGate / Springer / IOP listings. The admin field is marked "verify before publishing".
    publications: [
      { title: 'Structural and magnetic properties of size-controlled Mn0.5Zn0.5Fe2O4 nanoparticles and magnetic fluids', journal: 'Pramana – J. Phys. 73, 765–780', year: 2009, url: 'https://link.springer.com/article/10.1007/s12043-009-0144-2' },
      { title: 'Tunable birefringence in silica mediated magnetic fluid', journal: 'Materials Research Express', year: 2019, url: 'https://iopscience.iop.org/article/10.1088/2053-1591/ab4eb2' },
    ],
  },
]

/**
 * Certifications & claims (Company → Certifications & claims). Only the three claims Protpure already
 * makes on the site are seeded, as "product claim" entries. Third-party certifications (ISO, licences)
 * are added by the editor with issuer, expiry and the certificate PDF once they exist.
 */
export const certifications = [
  { name: 'BioProcess-grade resins used in GMP facilities', kind: 'product-claim', order: 1, statement: 'SP, Q, DEAE, Phenyl and Ni-NTA Agarose are specified as BioProcess resins (1 M NaOH, 8 M urea, 6 M GuHCl, 70% ethanol; CIP pH 2–14) and are in use at GMP facilities of Indian biopharma companies.' },
  { name: 'Certificate of analysis with every lot', kind: 'product-claim', order: 2, statement: 'Every shipment carries a lot-specific certificate of analysis; datasheet values can be referenced in qualification and regulatory documentation.' },
  { name: 'Made in India — developed, manufactured and supported in Anand, Gujarat', kind: 'product-claim', order: 3, statement: 'Bead synthesis, cross-linking, ligand chemistry, QC and customer support all happen at one site — 2–3 weeks ex-works instead of 8–12 weeks for imported resins.' },
]

/**
 * LinkedIn updates seeded as DRAFTS (no URL): summaries written from Protpure's public posts so the
 * editor only has to paste the post URL and publish. Drafts never reach the site or the AI surfaces.
 */
export const updates = [
  {
    title: 'Hy-Ionic™ DP: DEAE–phenyl mixed-mode resin launched',
    kind: 'product-launch',
    publishedAt: '2026-08-20',
    image: 'poster-consistency.webp',
    relatedProducts: ['hy-ionic-dp'],
    summary: 'Hy-Ionic™ DP puts DEAE anion-exchange and phenyl hydrophobic-interaction ligands on one cross-linked agarose matrix, so a single packed column can run in either mode. Dynamic binding capacity: 30 mg BSA/mL in HIC mode and 100 mg BSA/mL in IEX mode.',
  },
  {
    title: 'MR Agarose: transition-metal removal resin and evaluation kit',
    kind: 'product-launch',
    publishedAt: '2026-07-15',
    image: 'poster-mr-agarose.webp',
    relatedProducts: ['mr-agarose-kit'],
    summary: 'MR Agarose binds 15–18 µmol of transition metal ions per mL of resin — Fe²⁺/Fe³⁺, Ni²⁺, Co²⁺, Cu²⁺ and Zn²⁺ — for removing leached or process-derived metals from protein streams. The evaluation kit ships as a 1 mL gravity column with buffers.',
  },
  {
    title: 'Downstream bioprocessing services: packing, screening, method development',
    kind: 'services',
    publishedAt: '2026-06-10',
    image: 'poster-downstream-services.webp',
    relatedProducts: [],
    summary: 'Protpure now offers downstream services alongside its resins: precision column packing with performance reports (asymmetry, HETP, plates), resin screening on 1 mL pre-packed columns, method development and a full protein purification service on FPLC systems up to 1 L columns.',
  },
  {
    title: 'Independence Day: scientific self-reliance in bioprocessing',
    kind: 'perspective',
    publishedAt: '2026-08-15',
    image: 'poster-upstream-downstream.webp',
    relatedProducts: [],
    summary: 'More than 90% of the chromatography media used in India is imported. On Independence Day, a note on why indigenous resin manufacturing — bead synthesis, cross-linking and ligand chemistry done at home — matters for the resilience of India’s biopharma supply chain.',
  },
  {
    title: 'His-tag accessibility: when Ni-NTA binding is weaker than expected',
    kind: 'data',
    publishedAt: '2026-05-05',
    image: undefined,
    relatedProducts: ['ni-nta-agarose', 'ni-nta-prepacked-columns'],
    summary: 'Troubleshooting notes from the bench: a His-tag buried by folding, a short linker or a crowded terminus can leave a protein flowing through an IMAC column. What to check — tag position and linker length, denaturing vs native binding, imidazole in the load — before blaming the resin.',
  },
]

export const siteSettings = {
  name: 'Protpure',
  legalName: 'Protpure Tech Pvt. Ltd.',
  tagline: 'Purity. Performance. Reliability.',
  description: 'Protpure Tech manufactures agarose-based chromatography resins — ion exchange, IMAC, size exclusion, hydrophobic interaction and mixed-mode — in Anand, Gujarat, India and supplies biopharma, vaccine, diagnostic and research customers worldwide.',
  foundedYear: 2023,
  certifications: [{ text: 'BioProcess-grade resins used in GMP facilities' }, { text: 'Certificate of analysis with every lot' }, { text: 'Made in India — developed, manufactured and supported in Anand, Gujarat' }],
  proof: {
    foundedText: 'Founded May 2023',
    teamSize: '8–10 person team',
    capacity: '600 L / month',
    customersStatement: 'Used in GMP facilities. Repeat orders from Indian biopharma.',
  },
  email: 'info@protpure.com',
  phone: '+91 94265 96644',
  whatsapp: '+919426596644',
  address: 'Protpure Tech Pvt. Ltd.\nA2, Plot No. A2/440/2, PKY 425 Sq. Mtr.\nOpp. Paragon Paints, GIDC V.U. Nagar\nAnand – 388121, Gujarat, India',
  city: 'Anand',
  region: 'Gujarat',
  country: 'India',
  mapUrl: 'https://maps.google.com/?q=GIDC+V.U.+Nagar+Anand+388121',
  hours: 'Mon–Sat, 9:30–18:00 IST',
  social: { linkedin: 'https://www.linkedin.com/company/protpure-tech-pvt-ltd/' },
  notificationEmails: [{ email: 'info@protpure.com' }],
  fromName: 'Protpure Tech',
  replyTo: 'info@protpure.com',
  responseTime: 'within 1–2 business days',
  leadTime: '2–3 weeks ex-works',
  globalStatement: 'We ship worldwide ex-works Anand (India) or via your forwarder, with commercial invoice, packing list, datasheet and certificate of analysis. Resins travel at ambient temperature in 20% ethanol — no cold chain. Quotes in USD, EUR or INR.',
  regions: [
    { name: 'India', status: 'direct', note: 'GST invoicing, domestic dispatch' },
    { name: 'Middle East & Africa', status: 'direct', note: 'Direct export' },
    { name: 'South-East Asia', status: 'direct', note: 'Direct export' },
    { name: 'Europe', status: 'seeking', note: 'Direct export; distributor wanted' },
    { name: 'North America', status: 'seeking', note: 'Direct export; distributor wanted' },
    { name: 'Latin America', status: 'seeking', note: 'Distributor wanted' },
  ],
  exportNotes: [{ text: 'HS code and MSDS supplied with every export shipment' }, { text: 'Incoterms EXW by default; FOB/CIF on request' }, { text: 'Non-hazardous for transport (20% ethanol slurry)' }],
  titleSuffix: 'Protpure — Agarose Chromatography Resins, Made in India for the World',
  aiSummary: 'Protpure Tech Pvt. Ltd. (Anand, Gujarat, India; founded May 2023) manufactures agarose-based chromatography resins for biopharmaceutical purification: SP/CM/Q/DEAE ion exchangers, Ni/Co/Cu/Zn-NTA IMAC resins, cross-linked agarose SEC resin, Phenyl Agarose (HIC), Hy-Ionic DP mixed-mode resin, CNBr-activated agarose, pre-packed columns, magnetic beads and the MR Agarose metal-removal kit, plus downstream services (column packing, resin screening, method development, purification). Resins come in Faster, Fast Flow, Precise and HR particle-size grades on one 6% cross-linked backbone. Pricing is by quotation; there are no free samples, but paid sample kits (5–25 mL packs or a 1 mL pre-packed column), credited against your first bulk order. Lead time 2–3 weeks ex-works; worldwide shipping. Contact info@protpure.com or file a quote through the website form, the public API or the MCP server.',
}

export const header = {
  tagline: 'Chromatography resins · Made in Anand, India',
  items: [
    { label: 'Products', href: '/products', children: [
      { label: 'All products', href: '/products', description: 'Full catalog with filters' },
      { label: 'Ion Exchange', href: '/products/category/ion-exchange', description: 'SP, CM, Q, DEAE Agarose' },
      { label: 'Affinity (IMAC)', href: '/products/category/affinity', description: 'Ni-, Co-, Cu-, Zn-NTA' },
      { label: 'Size Exclusion', href: '/products/category/size-exclusion', description: 'SEC & desalting' },
      { label: 'HIC & Mixed-Mode', href: '/products/category/hydrophobic-interaction', description: 'Phenyl Agarose, Hy-Ionic DP' },
      { label: 'Columns, Kits & Beads', href: '/products/category/columns', description: 'Pre-packed columns, MR kit, magnetic' },
      { label: 'Compare resins', href: '/compare', description: 'Side-by-side specifications' },
    ] },
    { label: 'Technology', slug: 'technology' },
    { label: 'Applications', href: '/applications' },
    { label: 'Services', href: '/services' },
    { label: 'Resources', href: '/resources', children: [
      { label: 'Technical library', href: '/resources', description: 'Datasheets, brochures, data' },
      { label: 'Blog', href: '/blog', description: 'Notes from the bench' },
      { label: 'LinkedIn updates', href: '/updates', description: 'Posters and news' },
      { label: 'FAQ', href: '/faq', description: 'Ordering, shipping, quality' },
    ] },
    { label: 'Company', slug: 'about', children: [
      { label: 'About Protpure', slug: 'about', description: 'Facility, team, milestones' },
      { label: 'Global supply', slug: 'global-supply', description: 'Export, regions, distributors' },
      { label: 'Contact', href: '/contact', description: 'Talk to a scientist' },
    ] },
  ],
  cta: { label: 'Request a quote', href: '/request-quote' },
}

export const footer = {
  tagline: 'Agarose chromatography resins. Developed, manufactured and supported in Anand, Gujarat, India.',
  columns: [
    { title: 'Explore', links: [{ label: 'Product catalogue', href: '/products' }, { label: 'Particle platform', slug: 'technology' }, { label: 'Applications', href: '/applications' }, { label: 'Services', href: '/services' }, { label: 'Compare resins', href: '/compare' }] },
    { title: 'Connect', links: [{ label: 'Our company', slug: 'about' }, { label: 'Technical documents', href: '/resources' }, { label: 'Blog', href: '/blog' }, { label: 'Become a distributor', slug: 'global-supply' }, { label: 'Request a quote', href: '/request-quote' }, { label: 'FAQ', href: '/faq' }] },
  ],
  newsletter: { heading: 'Notes from the bench', text: 'Product updates, data and technical notes.', note: 'By subscribing, you agree to receive Protpure updates. You can unsubscribe at any time.' },
  legalLinks: [{ label: 'Privacy policy', slug: 'privacy' }, { label: 'Terms of sale', slug: 'terms' }],
  bottomText: 'All rights reserved. Hy-Ionic™ is a trademark of Protpure Tech Pvt. Ltd.',
}
