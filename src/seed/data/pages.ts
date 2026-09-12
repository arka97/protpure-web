import { rt } from '../richtext'
import { siteSettings } from './content'

/**
 * Page definitions. `link` values use { slug } for internal pages, { href } for custom URLs;
 * the seeder resolves them to Payload link groups. `image` values are seed/media filenames.
 */
export const pages = [
  {
    slug: 'home',
    title: 'Home',
    // Deep Field homepage: hero → trust strip → three supply figures → five numbered chapters →
    // closing quotation invitation. Numbers and claims are the ones already published on the site.
    hero: {
      style: 'standard',
      eyebrow: 'Indian science. Worldwide supply.',
      heading: 'Purification\nat scale.\nFrom the bead up.',
      highlight: 'From the bead up.',
      text: 'Agarose chromatography resins engineered in India. One cross-linked backbone, from high-throughput capture to high-resolution polishing.',
      image: 'bpg200-column-client-site.webp',
      imageMarker: 'BPG 200',
      imageMarkerNote: 'Client deployment',
      imageCaption: 'Ni-NTA Agarose in a process column',
      imageCaptionNote: 'At a client site',
      links: [{ label: 'Request a quote', href: '/request-quote', appearance: 'primary' }],
    },
    layout: [
      { blockType: 'trustStrip', source: 'custom', items: [{ text: 'BioProcess grade' }, { text: 'Used in GMP facilities' }, { text: 'CoA with every lot' }, { text: 'Made in India' }] },
      { blockType: 'stats', style: 'light', items: [
        { value: '600', unit: 'L / month', label: 'Semi-automated manufacturing capacity' },
        { value: '2–3', unit: 'weeks', label: 'Standard lead time, ex-works Anand' },
        { value: '1000', unit: 'cm/h', label: 'Maximum linear flow, Faster grade' },
      ] },
      // 01 / The catalogue
      { blockType: 'productCategories', eyebrow: 'The catalogue', heading: 'Every stage.\nThe right chemistry.', intro: 'From capture to polishing, choose your chromatography mode. Evaluation packs to manufacturing volumes.', categories: ['ion-exchange', 'affinity', 'size-exclusion', 'hydrophobic-interaction', 'mixed-mode', 'activated'], footnote: 'Also available: pre-packed columns, magnetic beads & evaluation kits.' },
      // 02 / The particle platform
      { blockType: 'gradesPlatform', eyebrow: 'The particle platform', heading: 'Four bead sizes.\n*One chemistry.*', intro: 'The same 6% cross-linked agarose backbone, tuned for different velocity and resolution profiles.', grades: [
        { name: 'Faster', badge: 'Industrial capture', d50: '~163 µm', sizeRange: '100–240 µm', maxFlow: 'up to 1000 cm/h', pressure: '< 0.15 MPa', text: 'Rapid processing without compromising resolution. Developed for industrial capture of large proteins.' },
        { name: 'Fast Flow', badge: 'Capture & intermediate', d50: '~96 µm', sizeRange: '45–165 µm', maxFlow: 'up to 700 cm/h', pressure: '< 0.15 MPa', text: 'Balance of efficiency and separation clarity for most downstream processes.' },
        { name: 'Precise', badge: 'High-resolution separation', d50: '~60 µm', sizeRange: '25–110 µm', maxFlow: 'up to 380 cm/h', pressure: '< 0.12 MPa', text: 'Flow conditions that favour high-resolution separation of sensitive biomolecules and complex matrices.' },
        { name: 'HR', badge: 'Polishing & small proteins', d50: '~40 µm', sizeRange: '15–75 µm', maxFlow: 'up to 120 cm/h', pressure: '< 0.1 MPa', text: 'Gentle handling of fragile proteins and peptides with minimal shear — for polishing and small proteins.' },
      ], note: 'Bars show size range; dots show d50V.\nPlatform values. Product-specific specifications and conditions apply.', link: { label: 'See SP Agarose grade data', href: '/products/sp-agarose#grades' } },
      // 03 / A closer source — reasons, imported comparison and application links compose one chapter
      { blockType: 'featureGrid', eyebrow: 'A closer source', heading: 'Qualify the resin.\nKnow the maker.', intro: 'What changes when your chromatography media comes directly from the scientists who make it.', columns: '2', numbered: true, items: [
        { icon: 'reproducible', title: 'Reproducible batch quality', text: 'Controlled bead-size distribution and stable ligand attachment give lot-to-lot consistency with minimal re-optimisation; validated in GMP environments.' },
        { icon: 'flow', title: 'Optimised flow velocity', text: 'Up to 1000 cm/h on the Faster grade. Faster purification and higher throughput without sacrificing resolution.' },
        { icon: 'globe', title: 'Made in India, shipped worldwide', text: 'Developed, manufactured and supported in Anand, Gujarat. Direct export with full documentation and no cold chain.' },
        { icon: 'support', title: 'Scientist-to-scientist support', text: 'Every inquiry is answered by the team that makes the resin. Method development and column packing available as services.' },
      ] },
      { blockType: 'comparisonTable', heading: 'Imported resins vs Protpure', columnA: 'Typical imported supplier', columnB: 'Protpure', rows: [
        { parameter: 'Lead time', a: '8–12 weeks (typical)', b: '2–3 weeks ex-works' },
        { parameter: 'Technical support', a: 'Via distributors, indirect', b: 'Direct scientist-to-scientist' },
        { parameter: 'Evaluation', a: 'Rigid MOQs, formal sampling', b: 'Paid sample kits (5–25 mL packs or a 1 mL pre-packed column), credited against your first bulk order' },
        { parameter: 'Custom pack sizes', a: 'Standard catalogue only', b: '5 mL to 25 L, bulk and custom volumes' },
        { parameter: 'Documentation', a: 'Standard', b: 'Datasheet + CoA per lot; filing support under NDA' },
      ], note: 'Typical values; imported-supplier figures reflect customer-reported experience in India.' },
      { blockType: 'applicationsGrid', layout: 'list', eyebrow: 'Applications', heading: 'Purification workflows we support' },
      // 04 / The people behind the platform — lab photograph, facility slot, founder, team line, services row, logo slot
      { blockType: 'twoColumn', background: 'recessed', eyebrow: 'The people behind the platform', heading: 'Built for scale.\nGrounded in science.', image: 'fplc-system.webp', imagePosition: 'left', imageCaption: 'Process evaluation in the Protpure lab', imageCaptionNote: 'Anand, Gujarat', secondImageText: 'In-house bead synthesis, ligand functionalisation and process evaluation.\n\nSemi-automated manufacturing + R&D.', content: rt(`Protpure started in May 2023 with a semi-automated manufacturing and R&D facility in Anand, Gujarat, and in-house capability across bead synthesis, ligand functionalisation, chromatography media development, process evaluation and customer deployment.`), quote: 'We are a humble start-up in the niche technology of protein purification. With proven academic research backed by our kilo-lab success, we are entering the market to provide a wide range of resins and nanoparticle-based purification solutions.', links: [{ label: 'About Protpure', slug: 'about', appearance: 'secondary' }] },
      { blockType: 'teamGrid', layout: 'spread' },
      { blockType: 'servicesGrid', layout: 'row', heading: 'We don’t just supply resin.' },
      { blockType: 'logoWall', source: 'all', fallbackStatement: 'Used in GMP facilities.\nRepeat orders from Indian biopharma.' },
      // 05 / Start with an evaluation — paid packs, then the FAQ teaser
      { blockType: 'cta', style: 'evaluation', eyebrow: 'Start with an evaluation', heading: 'Your process.\nOur resin.\nLet the data decide.', text: 'Paid evaluation packs: 5–25 mL or a 1 mL pre-packed column, with scientist support and documentation.', note: 'The cost is credited against your first bulk order.', links: [{ label: 'Request an evaluation quote', href: '/request-quote?type=evaluation', appearance: 'primary' }] },
      { blockType: 'faqBlock', eyebrow: 'Before you order', heading: 'Questions from the bench.', faqs: ['Do you offer sample kits?', 'What documentation do you provide?', 'What is the typical lead time?', 'Are Protpure resins drop-in replacements for imported agarose resins?'] },
      { blockType: 'cta', style: 'accent', heading: 'Ready to qualify Protpure\nin your process?', text: 'Choose your products, grades and volumes. A scientist replies within 1–2 business days with pricing, lead time and evaluation options.', links: [{ label: 'Request a quote', href: '/request-quote', appearance: 'primary' }] },
    ],
  },
  {
    slug: 'about',
    title: 'About Protpure',
    // Company page as numbered chapters: why indigenous media → milestones → capabilities → founder
    // spread → customers → publications → facility gallery slot → how we work. Facts are the ones
    // already published (proof points come from Site settings → Proof points).
    hero: { style: 'standard', eyebrow: 'Company', heading: 'Building India’s indigenous chromatography resin platform', highlight: 'indigenous chromatography resin platform', text: 'Protpure Tech Pvt. Ltd. develops and manufactures agarose-based chromatography media in Anand, Gujarat — reducing dependence on imported resins for India’s biopharma industry and supplying the same media to customers worldwide.', image: 'fplc-system-1l-column.webp', imageCaption: 'FPLC system with a 1 L column', imageCaptionNote: 'Protpure laboratory, Anand', links: [{ label: 'Request a quote', href: '/request-quote', appearance: 'primary' }, { label: 'Contact us', href: '/contact', appearance: 'secondary' }] },
    layout: [
      { blockType: 'proofBar', showStatement: true, style: 'light' },
      // 01 / Why indigenous media
      { blockType: 'twoColumn', eyebrow: 'Why indigenous media', heading: 'More than 90% of the chromatography media used in India *is imported.*', image: 'bpg200-column-client-site.webp', imagePosition: 'left', imageCaption: 'Ni-NTA Agarose in a BPG 200 process column', imageCaptionNote: 'At a client site', content: rt(`Chromatography resins are critical to biopharmaceutical manufacturing yet largely import-dependent, with long lead times and limited flexibility during R&D iterations. Protpure exists to change that: an Indian manufacturer with core expertise in bead synthesis, cross-linking and ligand chemistry, building a resin platform that scales from R&D to commercial manufacturing.

### Vision

A globally competitive indigenous chromatography resin platform supporting India’s growing biotechnology and biopharmaceutical ecosystem.

### Mission

Affordable, reliable and scalable chromatography media for protein purification, diagnostics and advanced biotechnology — democratising access to high-quality agarose resins while reducing import dependency and foreign-exchange outflow.`), facts: [
        { label: 'Facility', value: 'Semi-automated manufacturing + R&D' },
        { label: 'Capacity', value: '600 L/month of agarose-based resins' },
        { label: 'Validation', value: 'Used in GMP facilities; repeat orders from Indian biopharma' },
        { label: 'Ownership', value: 'Bootstrapped, founder-led' },
        { label: 'Expansion', value: 'Large-scale production plant in active planning' },
      ] },
      // 02 / Milestones
      { blockType: 'timeline', eyebrow: 'Milestones', heading: 'Commercial progress, *year by year.*', items: [
        { date: 'May 2023', title: 'Protpure Tech founded in Anand, Gujarat', text: 'Scientist-led start-up with exclusive manufacturing of agarose- and dextran-based matrices.' },
        { date: '2024', title: 'First Indian manufacturer of Ni-NTA Agarose', text: 'Commercial supply of Ni-NTA Agarose executed; repeat usage established.' },
        { date: '2025', title: 'Indigenous IEC media and BPG 200 deployment', text: 'SP, Q and DEAE Agarose developed and evaluated in industry-relevant workflows; Ni-NTA Agarose packed in a BPG 200 process column at a client site.' },
        { date: '2026', title: 'Expanding the portfolio', text: 'Technical datasheets Rev 1.0, Hy-Ionic™ DP mixed-mode resin, MR Agarose kit, Phenyl Agarose and SEC resin; downstream bioprocessing services launched.' },
      ] },
      // 03 / Capabilities
      { blockType: 'featureGrid', eyebrow: 'Capabilities', heading: 'From resin development to *customer deployment.*', intro: 'Everything between bead synthesis and a packed process column happens at one site.', columns: '3', numbered: true, items: [
        { icon: 'beaker', title: 'Bead synthesis & cross-linking', text: 'Controlled bead-size distribution and cross-linking chemistry give the pressure–flow behaviour each grade is specified for.' },
        { icon: 'microscope', title: 'Ligand chemistry', text: 'Sulfopropyl, carboxymethyl, quaternary amine, DEAE, NTA, phenyl and mixed-mode functionalisation, plus custom coupling.' },
        { icon: 'chart', title: 'Process evaluation', text: 'Column packing, efficiency testing (HETP, asymmetry), DBC studies and pressure–flow characterisation on FPLC systems up to 1 L columns.' },
        { icon: 'factory', title: 'Manufacturing', text: '600 L/month semi-automated production with lot-level certificates of analysis.' },
        { icon: 'handshake', title: 'Customer deployment', text: 'Commercial implementation of Protpure media in customer processes, including BPG 200 process columns.' },
        { icon: 'shield', title: 'Alignment to GMP', text: 'Reproducibility over aggressive customisation; long-term view toward GMP-compliant production.' },
      ] },
      // 04 / Leadership — founder spread: lab photograph, facility slot, founder text, then the team line
      { blockType: 'twoColumn', background: 'recessed', eyebrow: 'Leadership', heading: 'Founder-led. *Grounded in science.*', image: 'fplc-system.webp', imagePosition: 'left', imageCaption: 'Process evaluation in the Protpure lab', imageCaptionNote: 'Anand, Gujarat', secondImageText: 'Semi-automated manufacturing + R&D facility.\n\nLarge-scale production plant in active planning.', content: rt(`Protpure was established in 2023 by Dr. Rucha P. Desai, a materials scientist whose academic work in nanoparticle synthesis and magnetic fluids led to the bead synthesis, cross-linking and ligand chemistry behind the platform. The company is bootstrapped and founder-led, with an 8–10 person team spanning chemistry, process evaluation and customer deployment.`), quote: 'We are a humble start-up in the niche technology of protein purification. With proven academic research backed by our kilo-lab success, we are entering the market to provide a wide range of resins and nanoparticle-based purification solutions.' },
      { blockType: 'teamGrid', layout: 'spread' },
      // 05 / Customers
      { blockType: 'logoWall', eyebrow: 'Customers', heading: 'In customer processes *today.*', source: 'all', fallbackStatement: siteSettings.proof.customersStatement },
      // 06 / Publications
      { blockType: 'publications', eyebrow: 'Publications', heading: 'Peer-reviewed work behind the platform' },
      // Facility gallery: a CMS slot; visitors see it once photos are added (editors see the dashed slot in preview).
      { blockType: 'gallery', eyebrow: 'Facility', heading: 'Inside the Anand facility', layout: 'grid', items: [] },
      // 07 / How we work
      { blockType: 'featureGrid', eyebrow: 'How we work', heading: 'Evaluation data first. *You decide.*', intro: 'What we look for in a customer relationship, and what you can expect from us.', columns: '3', numbered: true, items: [
        { icon: 'scale', title: 'Evaluation under your SOPs', text: 'Lab- or bench-scale evaluation, side-by-side comparison if desired, feedback-driven iteration. Outcome: technical data only — you decide.' },
        { icon: 'globe', title: 'Second sourcing', text: 'Process development teams evaluating alternatives and organisations seeking India-based or non-traditional second sourcing.' },
        { icon: 'support', title: 'Open to critique', text: 'We appreciate technical discussion and realistic assessment. Let evaluation data guide decisions.' },
      ] },
      { blockType: 'cta', style: 'accent', heading: 'Let’s build the next generation of purification together', text: 'Distributors, process development teams and researchers — we would like to hear from you.', links: [{ label: 'Contact us', href: '/contact', appearance: 'primary' }, { label: 'Global supply & distribution', slug: 'global-supply', appearance: 'secondary' }] },
    ],
  },
  {
    slug: 'technology',
    title: 'Technology',
    // Light hero with the annotated bead cross-section (BUILD-BRIEF item 1), then the dark particle
    // platform, bead size vs resolution, cross-linking, ligand chemistry, column efficiency, the
    // benchmark table and technical documents. Values are the published platform figures.
    hero: { style: 'schematic', eyebrow: 'Technology platform', heading: 'One backbone, four bead sizes, every chemistry', highlight: 'four bead sizes', text: 'Linear flow velocity is a key parameter in chromatographic purification — governing binding efficiency, resolution and process scalability. Protpure’s particle platform lets you choose the flow–resolution balance without changing chemistry.', imageMarker: 'Particle architecture', imageMarkerNote: 'Fig. 01 / Schematic', imageCaption: 'Open pore structure', imageCaptionNote: 'Low non-specific binding', links: [{ label: 'Request a quote', href: '/request-quote', appearance: 'primary' }, { label: 'Browse the catalogue', href: '/products', appearance: 'secondary' }] },
    layout: [
      // 01 / The particle platform
      { blockType: 'gradesPlatform', eyebrow: 'The particle platform', heading: 'Four bead sizes, tested under *one pressure limit.*', intro: 'Every grade is characterised in a 26/20 column at 20 cm bed height (106 mL bed volume) under 0.1 MPa pre-column pressure, so the numbers are directly comparable.', grades: [
        { name: 'Agarose Faster', badge: 'High throughput', d50: '163 µm', sizeRange: '100–240 µm', maxFlow: 'up to 1000 cm/h', pressure: '< 0.15 MPa', text: 'Ideal for rapid processing workflows without compromising resolution. Specially developed for industrial requirements — large proteins, recombinant enzymes, partial purification of insulin.' },
        { name: 'Agarose Fast Flow', badge: 'Balanced', d50: '96 µm', sizeRange: '45–165 µm', maxFlow: 'up to 700 cm/h', pressure: '< 0.15 MPa', text: 'Harmonious balance of efficiency and separation clarity, suitable for most downstream processes and large-to-medium proteins.' },
        { name: 'Agarose Precise', badge: 'Precise optimisation', d50: '60 µm', sizeRange: '25–110 µm', maxFlow: 'up to 380 cm/h', pressure: '< 0.12 MPa', text: 'Flow conditions favour high-resolution separation for sensitive biomolecules and complex matrices; medium to small proteins.' },
        { name: 'Agarose HR', badge: 'Gentle elution', d50: '40 µm', sizeRange: '15–75 µm', maxFlow: 'up to 120 cm/h', pressure: '< 0.1 MPa', text: 'Gentle handling of fragile proteins, minimising shear — perfect for delicate purification steps, small proteins and peptides.' },
      ], note: 'Bars show size range; dots show d50V.\nPlatform values. Product-specific specifications and conditions apply.', link: { label: 'See SP Agarose grade data', href: '/products/sp-agarose#grades' } },
      // 02 / Bead size vs resolution
      { blockType: 'featureGrid', eyebrow: 'Bead size vs resolution', heading: 'The purification stage sets *the bead size.*', intro: 'Capture, intermediate purification and polishing each call for a different bead size — and three other parameters interact with the choice.', columns: '2', numbered: true, items: [
        { icon: 'flow', title: 'Capture · 100–300 µm', text: 'Initial steps from crude feedstock — mAbs, plasma proteins, vaccines. Low resolution, high flow: binding and isolating large proteins or complexes.' },
        { icon: 'scale', title: 'Intermediate purification · 45–165 µm', text: 'Recombinant proteins, enzymes and hormones: bulk impurities removed at moderate resolution.' },
        { icon: 'microscope', title: 'Polishing · 20–100 µm', text: 'Isoform separation, aggregate removal and analytical SEC: high-resolution separation of closely related species.' },
        { icon: 'chart', title: 'Column dimension, bed volume, pressure', text: 'The other parameters that interact with bead size. Our resin screening and column packing services help you choose.', link: { label: 'Resin screening service', href: '/services#resin-screening' } },
      ] },
      // 03 / Cross-linked agarose
      { blockType: 'twoColumn', eyebrow: 'Cross-linked agarose', heading: 'Why cross-linked *agarose.*', image: 'ni-nta-packed-column-lab.webp', imagePosition: 'right', imageCaption: 'Ni-NTA Agarose packed in a glass process column', imageCaptionNote: 'Protpure laboratory', content: rt(`Agarose beads are hydrophilic, low in non-specific binding and have an open pore structure that lets large biomolecules reach the ligands. Cross-linking adds the mechanical rigidity needed for high flow rates and repeated cleaning in 1 M NaOH.

Protpure controls bead synthesis, cross-linking and ligand chemistry in-house, which is what makes the four grades consistent across every chemistry.`), facts: [
        { label: 'Matrix', value: '6% spherical cross-linked agarose' },
        { label: 'CIP', value: '1 M NaOH' },
        { label: 'pH stability', value: '2–14 CIP / 2–12 operational' },
        { label: 'Chemical stability', value: '8 M urea, 6 M GuHCl, 70% ethanol' },
      ] },
      // 04 / Ligand chemistry
      { blockType: 'featureGrid', eyebrow: 'Ligand chemistry', heading: 'Every chemistry on the *same backbone.*', intro: 'The same 6% cross-linked agarose carries each ligand, so pressure–flow behaviour and cleaning regimes stay familiar from one mode to the next.', columns: '3', numbered: true, items: [
        { icon: 'beaker', title: 'Ion exchange', text: 'SP, CM, Q and DEAE agarose — strong and weak cation/anion exchangers for capture, intermediate purification and polishing.', link: { label: 'Ion exchange resins', href: '/products/category/ion-exchange' } },
        { icon: 'beaker', title: 'Affinity (IMAC)', text: 'Ni-, Co-, Cu- and Zn-NTA resins for single-step capture of His-tagged proteins, plus Protein A.', link: { label: 'IMAC resins', href: '/products/category/affinity' } },
        { icon: 'beaker', title: 'Size exclusion & desalting', text: 'Plain and cross-linked agarose (2%, 4%, 6%) for molecular sieving, aggregate analysis, desalting and buffer exchange.', link: { label: 'SEC resins', href: '/products/category/size-exclusion' } },
        { icon: 'beaker', title: 'Hydrophobic interaction', text: 'Phenyl Agarose for mild, orthogonal purification and aggregate removal.', link: { label: 'HIC resins', href: '/products/category/hydrophobic-interaction' } },
        { icon: 'beaker', title: 'Mixed-mode', text: 'Hy-Ionic™ DP: DEAE and phenyl functionality on one matrix, two independently addressable modes.', link: { label: 'Mixed-mode resins', href: '/products/category/mixed-mode' } },
        { icon: 'beaker', title: 'Activated & coupling', text: 'CNBr-activated agarose for immobilising your own ligands; custom coupling on request.', link: { label: 'Activated supports', href: '/products/category/activated' } },
      ] },
      // 05 / Column efficiency
      { blockType: 'twoColumn', background: 'recessed', eyebrow: 'Column efficiency', heading: 'Column efficiency is *part of the product.*', image: 'fplc-system.webp', imagePosition: 'left', imageCaption: 'Process evaluation in the Protpure lab', imageCaptionNote: 'Anand, Gujarat', content: rt(`Reproducibility often begins during column packing itself. We evaluate every resin with an acetone pulse test and report HETP, asymmetry, plate height and plates per metre — the same parameters we recommend you track.

Read the [column packing case study](/blog/how-column-packing-protocol-influences-iec-column-efficiency) and the [DEAE Agarose Precise performance data](/blog/deae-agarose-precise-pressure-flow-and-dynamic-binding-capacity).`), links: [{ label: 'Precision column packing', href: '/services#precision-column-packing', appearance: 'secondary' }] },
      // 06 / Benchmark
      { blockType: 'comparisonTable', eyebrow: 'Benchmark', heading: 'Protpure vs typical *market specification.*', intro: 'Ion exchange resins, standard grade. Full three-column comparisons are on each product page.', columnA: 'Typical market specification', columnB: 'Protpure (Fast Flow)', rows: [
        { parameter: 'Matrix', a: '6% cross-linked agarose, spherical', b: '6% spherical cross-linked agarose' },
        { parameter: 'Particle size range / d50V', a: '45–165 µm / 90 µm', b: '45–165 µm / ~90 µm' },
        { parameter: 'Ionic capacity (SP)', a: '0.18–0.25 mmol H⁺/mL', b: '0.18–0.25 mmol H⁺/mL' },
        { parameter: 'Dynamic binding capacity (SP)', a: '≥100 mg lysozyme/mL', b: '≈100 mg lysozyme/mL (HR ≈130)' },
        { parameter: 'Dynamic binding capacity (Q)', a: '40–70 mg BSA/mL (Fast Flow)', b: '≈80 mg BSA/mL (HR ≈120)' },
        { parameter: 'pH stability (CIP / operational)', a: '2–14 / 2–12', b: '2–14 / 2–12' },
        { parameter: 'Chemical stability', a: '1 M NaOH, 8 M urea, 6 M GuHCl, 70% ethanol', b: '1 M NaOH, 8 M urea, 6 M GuHCl, 70% ethanol' },
      ], note: 'Typical market specification as published in Protpure datasheets Rev 1.0; product-specific tables are on each product page.' },
      // 07 / Documents
      { blockType: 'documentList', eyebrow: 'Documents', heading: 'Technical data', intro: 'Datasheets, performance data, case studies and posters.', types: ['datasheet', 'performance-data', 'case-study', 'poster'], limit: 8 },
      { blockType: 'cta', style: 'dark', heading: 'Not sure which grade fits your column?', text: 'Send us your column geometry, feed and target and we will recommend a grade — or screen it for you.', links: [{ label: 'Ask a scientist', href: '/request-quote?type=technical', appearance: 'primary' }, { label: 'Resin screening service', href: '/services', appearance: 'secondary' }] },
    ],
  },
  {
    slug: 'global-supply',
    title: 'Global supply & distribution',
    // Proof bar under the hero, then how we ship, where we ship, the certifications strip, the
    // shipping FAQ and the distributor call to action (the partnership form lives on /request-quote).
    hero: { style: 'standard', eyebrow: 'International', heading: 'Made in India. Supplied worldwide.', highlight: 'Supplied worldwide.', text: 'Protpure resins ship ex-works Anand to customers on every continent, with full technical and customs documentation. We are actively appointing distributors in Europe, the Americas and beyond.', image: 'product-portfolio.webp', imageCaption: 'Resin packs and pre-packed columns', imageCaptionNote: '5 mL to 25 L, bulk on request', links: [{ label: 'Request a quote', href: '/request-quote', appearance: 'primary' }, { label: 'Become a distributor', href: '#form', appearance: 'secondary' }] },
    layout: [
      { blockType: 'proofBar', showStatement: true, style: 'light' },
      // 01 / How we ship
      { blockType: 'featureGrid', eyebrow: 'How we ship', heading: 'Simple to *import.*', intro: 'Four things procurement asks first — answered before the quote.', columns: '4', items: [
        { icon: 'globe', title: 'Worldwide, ex-works or delivered', text: 'EXW Anand by default; FOB and CIF on request. We work with your forwarder or ours.' },
        { icon: 'document', title: 'Full documentation', text: 'Commercial invoice, packing list, HS code, MSDS, technical datasheet and certificate of analysis with every shipment.' },
        { icon: 'shield', title: 'No cold chain', text: 'Resins travel as a 20% ethanol slurry at ambient temperature and are non-hazardous for transport.' },
        { icon: 'cost', title: 'Quotes in your currency', text: 'USD, EUR or INR invoicing; bank transfer and letters of credit for larger orders.' },
      ] },
      // 02 / Where we ship
      { blockType: 'twoColumn', eyebrow: 'Where we ship', heading: 'Direct supply today. *Distributors next.*', image: 'fplc-prepacked-1ml-columns.webp', imagePosition: 'right', imageCaption: 'Pre-packed 1 mL FPLC columns in their retail box', imageCaptionNote: 'Ships at ambient temperature', content: rt(`- **India** — direct supply, GST invoicing, domestic dispatch from Gujarat.
- **Middle East, Africa and South-East Asia** — direct export.
- **Europe and North America** — direct export today; distribution partners wanted.
- **Latin America** — distribution partners wanted.`), facts: [
        { label: 'Lead time', value: '2–3 weeks ex-works Anand' },
        { label: 'Incoterms', value: 'EXW by default; FOB / CIF on request' },
        { label: 'Transport', value: '20% ethanol slurry, ambient, non-hazardous' },
        { label: 'Invoicing', value: 'USD, EUR or INR' },
      ] },
      { blockType: 'certificationsStrip', heading: 'Quality & documentation you can reference', limit: 8 },
      // 03 / Shipping & export questions
      { blockType: 'faqBlock', eyebrow: 'Shipping & export', heading: 'Questions from *procurement.*', category: 'shipping' },
      // Distributor call to action, then the partnership form (id="form").
      { blockType: 'cta', style: 'dark', eyebrow: 'Distribution', heading: 'Become a Protpure distributor', text: 'We are looking for partners who serve biopharma process development, research and diagnostic customers and can hold evaluation stock. We offer technical training, co-marketing, protected territories and direct scientist support for your customers.', links: [{ label: 'Apply for distribution', href: '#form', appearance: 'primary' }, { label: 'Request a quote', href: '/request-quote', appearance: 'secondary' }] },
      { blockType: 'formBlock', form: 'partnership', heading: 'Partner with Protpure', intro: 'Distributors, CDMOs and procurement teams outside India — tell us how you would like to work together.', sidebar: rt(`We reply within 1–2 business days. Include your territory, customer segments and any resins you already represent.`) },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy policy',
    hero: { style: 'compact', eyebrow: 'Legal', text: 'How Protpure Tech Pvt. Ltd. handles the personal data you share with us through this website.' },
    layout: [
      { blockType: 'richText', width: 'narrow', numbered: true, content: rt(`## What we collect

When you request a quote, contact us or subscribe to updates we store the details you enter (name, work email, organisation, country, phone, message) together with technical metadata (IP address, browser, page) needed to prevent abuse. Website analytics, where enabled, are aggregated and cookie-free.

## How we use it

To answer your request, prepare quotations, ship goods and provide technical support; to send transactional emails confirming your request; and, only if you opted in and confirmed, to send occasional product updates. We do not sell personal data.

## Where it is stored

On servers operated for Protpure and with the email service provider used to deliver our messages. Data is retained for as long as needed to fulfil the purpose above and to meet legal obligations.

## Your rights

You may request access to, correction or deletion of your data, or withdraw newsletter consent at any time, by emailing info@protpure.com. Newsletter emails include an unsubscribe link.

## Contact

Protpure Tech Pvt. Ltd., A2, Plot No. A2/440/2, PKY 425 Sq. Mtr., Opp. Paragon Paints, GIDC V.U. Nagar, Anand – 388121, Gujarat, India · info@protpure.com`) },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms of sale',
    hero: { style: 'compact', eyebrow: 'Legal', text: 'Standard terms that apply to quotations and orders unless a separate agreement is in place.' },
    layout: [
      { blockType: 'richText', width: 'narrow', numbered: true, content: rt(`## Quotations and orders

Prices are quoted per request and are valid for the period stated on the quotation. Orders are confirmed in writing. Product specifications are those on the current technical datasheet and certificate of analysis; the website is for information and does not constitute a specification.

## Delivery

Standard lead time is 2–3 weeks ex-works Anand unless otherwise agreed. Incoterms EXW apply by default; FOB/CIF by agreement. Risk passes according to the agreed Incoterm.

## Payment

As stated on the quotation. Larger and export orders may require advance payment or a letter of credit.

## Use of products

Products are intended for research, process development and manufacturing use by qualified personnel. Suitability for a specific application, including regulated manufacturing, must be validated by the customer.

## Warranty and liability

Products are warranted to meet their certificate of analysis at the time of shipment. Liability is limited to replacement of non-conforming product. Consequential losses are excluded to the extent permitted by law.

## Governing law

The laws of India; courts at Anand, Gujarat have jurisdiction.`) },
    ],
  },
  // ---------- Listing routes ----------
  // These slugs are reserved by their own route files (src/app/(frontend)/<slug>/page.tsx): the CMS
  // page supplies the hero copy and any blocks rendered after the listing, never the listing itself.
  {
    slug: 'applications',
    title: 'Applications',
    hero: { style: 'standard', eyebrow: 'Applications', heading: 'Purification workflows\n*we support.*', highlight: 'we support.', text: 'From capture to polishing, our resins are used across biologics, vaccines, diagnostics and research. Explore typical workflows and the resins we recommend for each.' },
    layout: [
      { blockType: 'cta', style: 'dark', eyebrow: 'Your process', heading: 'Not sure which resin fits your workflow?', text: 'Send us your target, feedstock and scale. A scientist replies with a recommended chemistry and grade — or screens it for you.', links: [{ label: 'Discuss your process', href: '/request-quote?type=technical', appearance: 'primary' }, { label: 'Resin screening service', href: '/services#resin-screening', appearance: 'secondary' }] },
    ],
  },
  {
    slug: 'services',
    title: 'Downstream bioprocessing services',
    hero: { style: 'standard', eyebrow: 'Services', heading: 'We don’t just\n*supply resin.*', highlight: 'supply resin.', text: 'Our scientists pack columns, screen resins against your feedstock, develop methods and purify proteins for you — from 5 mL to 1 L columns, with a documented report every time.' },
    layout: [
      { blockType: 'cta', style: 'dark', eyebrow: 'Scope a service', heading: 'Tell us about the protein and the scale.', text: 'Every service is quoted individually after a short technical discussion. Share your target, feedstock and timeline and we will propose a scope and a report format.', links: [{ label: 'Discuss a service', href: '/request-quote?type=technical', appearance: 'primary' }, { label: 'Technical documents', href: '/resources', appearance: 'secondary' }] },
    ],
  },
  {
    slug: 'resources',
    title: 'Technical library',
    hero: { style: 'standard', eyebrow: 'Resources', heading: 'The technical\n*library.*', highlight: 'library.', text: 'Datasheets, performance data, case studies and posters — everything you need to evaluate and qualify Protpure resins. Certificates of analysis ship with every lot.' },
    layout: [
      { blockType: 'cta', style: 'dark', eyebrow: 'Qualification documents', heading: 'Need a document that is not here?', text: 'Extractables information, cleaning validation support and product-change notification are available on request; regulatory documentation under a confidentiality agreement.', links: [{ label: 'Request documents', href: '/request-quote?type=technical', appearance: 'primary' }] },
    ],
  },
  {
    slug: 'blog',
    title: 'Blog',
    hero: { style: 'standard', eyebrow: 'Blog', heading: 'Notes from\n*the bench.*', highlight: 'the bench.', text: 'Chromatography science, performance data and company news from Dr. Rucha Desai and the Protpure team.' },
    layout: [],
  },
  {
    slug: 'updates',
    title: 'Updates',
    hero: { style: 'standard', eyebrow: 'Updates', heading: 'Latest from\n*Protpure.*', highlight: 'Protpure.', text: 'Posters, performance data, product launches and company milestones as we share them on LinkedIn.' },
    layout: [],
  },
  {
    slug: 'faq',
    title: 'Frequently asked questions',
    hero: { style: 'standard', eyebrow: 'FAQ', heading: 'Questions from\n*the bench.*', highlight: 'the bench.', text: 'Straight answers on products, ordering, export and documentation. Not covered? Ask a scientist directly.' },
    layout: [
      { blockType: 'cta', style: 'dark', eyebrow: 'Still a question?', heading: 'Ask a scientist, not a call centre.', text: 'Technical, ordering and documentation questions are answered by the people who make the resin — within 1–2 business days.', links: [{ label: 'Ask a question', href: '/contact', appearance: 'primary' }, { label: 'Request a quote', href: '/request-quote', appearance: 'secondary' }] },
    ],
  },
  {
    slug: 'contact',
    title: 'Contact',
    hero: { style: 'standard', eyebrow: 'Contact', heading: 'Talk to a scientist,\n*not a call centre.*', highlight: 'not a call centre.', text: 'Questions about a resin, an evaluation, documentation or distribution — write to us and a member of the technical team replies within 1–2 business days. For pricing, use the RFQ basket.' },
    layout: [
      { blockType: 'faqBlock', eyebrow: 'Before you write', heading: 'Answered already?', category: 'technical' },
    ],
  },
]

export const posts = [
  {
    slug: 'how-column-packing-protocol-influences-iec-column-efficiency',
    title: 'Same resin, same column, same packing velocity — different outcome: how packing protocol influences IEC column efficiency',
    excerpt: 'A case study in a 50/300 mm column shows that a 1.2 cm difference in compressed bed height changed peak symmetry, plates per metre and plate height — before any sample was loaded.',
    tags: ['case-study', 'science'],
    publishedAt: '2026-05-14T09:00:00.000Z',
    heroImage: 'ni-nta-packed-column-lab.webp',
    relatedProducts: ['deae-agarose', 'sp-agarose', 'q-agarose'],
    content: rt(`## Why column packing matters

In chromatography, reproducibility does not start with sample loading. It starts with column packing. Even when using the same resin, the same column, the same buffer system and similar packing velocities, small variations in packing workflow and bed consolidation can significantly influence column efficiency, peak symmetry, process reproducibility and scale-up consistency.

## Experimental conditions

- Column: 50/300 mm, 5 cm diameter; resin volume 353 mL; slurry height 25 cm
- Packing buffer: 20 mM Tris, 50 mM NaCl, pH 7.5
- Column evaluation: 2 mL injection of 1% acetone, UV monitoring at 280 nm
- Objective: evaluate how compressed bed height influences chromatography efficiency

## Case 1 — compressed bed height 18.2 cm

Evaluated at linear flow velocities of 50, 100, 150 and 200 cm/h. Observations: improved peak symmetry, better asymmetry values, higher plates per metre, lower plate height, and more consistent performance across flow velocities. Improved bed consolidation resulted in better peak symmetry and higher column efficiency.

## Case 2 — compressed bed height 17 cm

Evaluated at 150 cm/h. Observations: broader peak profile, higher asymmetry, lower plates per metre, increased plate height, reduced overall column efficiency. Even a relatively small difference in bed consolidation influenced chromatography performance significantly.

## Key learning

Column packing quality can strongly influence chromatography reproducibility — even when using the same resin, column and packing conditions. Careful optimisation of packing protocol, bed consolidation, flow conditions and column-efficiency evaluation can significantly improve process consistency and purification performance. HETP, asymmetry, plate height and plates per metre are valuable tools for evaluating packed-bed quality.

Do you routinely evaluate HETP and asymmetry during column packing studies? Our [precision column packing service](/services#precision-column-packing) delivers every column with that report.`),
  },
  {
    slug: 'deae-agarose-precise-pressure-flow-and-dynamic-binding-capacity',
    title: 'DEAE Agarose Precise: pressure–flow, column efficiency and dynamic binding capacity',
    excerpt: 'Packing factors, pressure–flow curves at 18 cm and 45 cm bed heights, plates per metre from 50 to 200 cm/h and a measured DBC of 128 mg BSA/mL — the data behind the datasheet.',
    tags: ['science', 'application-note'],
    publishedAt: '2026-05-26T09:00:00.000Z',
    heroImage: 'fplc-system.webp',
    relatedProducts: ['deae-agarose'],
    content: rt(`## Column packing

Settled bed height 53 cm compressed to a packed bed of 45 cm in a 50 mm column: compression ratio 15.1%, packing factor 1.18, packing velocity 350 cm/h.

## Pressure–flow characteristics

Pressure–flow measurements in a 50 mm i.d. column at bed heights of 18 cm and 45 cm gave nearly overlapping profiles — uniform packing quality at both bed heights, good mechanical rigidity of the beads, and predictable scale-up because pressure drop is approximately proportional to bed height. No evidence of bed compression or channelling over the tested flow range. Linear velocities exceeding 350 cm/h were achieved at pressure drops below 0.25 MPa (~0.20 MPa at 300 cm/h, ~0.25 MPa at 360 cm/h, 45 cm bed).

## Column efficiency (acetone pulse, 20 mM Tris, 50 mM NaCl, pH 7.5)

| Velocity (cm/h) | Plates/m | HETP (mm) | Asymmetry |
| --- | --- | --- | --- |
| 50 | 1,277 | 0.783 | 1.30 |
| 100 | 7,159 | 0.140 | 1.19 |
| 150 | 11,935 | 0.084 | 1.09 |
| 200 | 14,898 | 0.067 | 1.16 |

Typical values: HETP ≤ 0.02 cm, asymmetry 0.8–1.3.

## Dynamic binding capacity

Functional group DEAE on cross-linked agarose. Dynamic binding capacity at 10% breakthrough with BSA as the model protein: 128 mg BSA/mL resin measured; guaranteed specification ≥ 120 mg/mL under the study conditions (the Rev 1.0 datasheet states ≈110 mg BSA/mL as the typical value across lots).

## Why DEAE Agarose Precise

- Indigenous Indian manufacturing
- Consistent pressure–flow performance and excellent mechanical stability
- Scalable packing behaviour demonstrated at 18 and 45 cm beds
- Suitable for laboratory and pilot-scale chromatography
- Opportunity for cost-effective domestic and international supply

The full study is available as a PDF in the [technical library](/resources?type=performance-data).`),
  },
  {
    slug: 'upstream-to-downstream-building-indias-bioprocessing-ecosystem',
    title: 'Upstream to downstream: building India’s bioprocessing ecosystem',
    excerpt: 'The bioprocessing journey has two critical phases. India has invested heavily in the first. Protpure is building capability for the second.',
    tags: ['india', 'news'],
    publishedAt: '2026-05-20T09:00:00.000Z',
    heroImage: 'poster-upstream-downstream.webp',
    relatedProducts: ['ni-nta-agarose', 'sp-agarose'],
    content: rt(`## Two phases, one product

**Upstream processing** builds the product: cell culture under controlled conditions, fermentation to scale up production in bioreactors, expression of the target biomolecule. **Downstream processing** purifies it: capture to isolate the target from the complex mix, purification to remove impurities and enrich the product, polishing for final quality and consistency.

## Where the bottleneck is

Every downstream step depends on chromatography media, and more than 90% of the media used in India is imported — with 8–12 week lead times, indirect technical support and currency exposure. Purification is not just about performance; it is about consistency. In downstream processing, reproducibility across runs is what ensures reliable, scalable and cost-effective protein purification: bead uniformity, flow properties, ligand stability, low non-specific interactions and pressure stability.

## What Protpure is doing about it

We manufacture agarose-based resins in Anand, Gujarat — ion exchange, IMAC, SEC, HIC and mixed-mode — on one cross-linked backbone, ship in 2–3 weeks, and support every customer scientist-to-scientist. The same media is available to customers worldwide.

Where do you see the biggest bottleneck? We would like to hear from you on [LinkedIn](https://www.linkedin.com/company/protpure-tech-pvt-ltd/).`),
  },
]

export const documents = [
  { file: 'sp-agarose-technical-datasheet-v1.pdf', title: 'SP Agarose — Technical Datasheet', type: 'datasheet', revision: 'Rev 1.0', documentDate: '2026-05-01', featured: true, summary: 'Strong cation exchanger: comparative performance of Fast Flow, Precise and HR grades vs typical market specification; applications and key benefits.', products: ['sp-agarose'] },
  { file: 'q-agarose-technical-datasheet-v1.pdf', title: 'Q Agarose — Technical Datasheet', type: 'datasheet', revision: 'Rev 1.0', documentDate: '2026-05-01', featured: true, summary: 'Strong anion exchanger: comparative performance of Fast Flow, Precise and HR grades vs typical market specification.', products: ['q-agarose'] },
  { file: 'deae-agarose-technical-datasheet-v1.pdf', title: 'DEAE Agarose — Technical Datasheet', type: 'datasheet', revision: 'Rev 1.0', documentDate: '2026-05-01', featured: true, summary: 'Weak anion exchanger: comparative performance of Fast Flow, Precise and HR grades vs typical market specification.', products: ['deae-agarose'] },
  { file: 'sp-agarose-hr-datasheet.pdf', title: 'SP Agarose HR — Datasheet', type: 'datasheet', documentDate: '2026-06-01', summary: 'High-resolution strong cation exchange resin (25–45 µm) vs industry standard; applications and technical support.', products: ['sp-agarose'] },
  { file: 'sec-precise-calibration-poster.pdf', title: 'SEC Precise — Molecular-weight calibration & column performance', type: 'poster', documentDate: '2026-04-01', summary: 'Kav vs MW calibration (R² = 0.9888), separation profile, column performance and resin specifications for Protpure Agarose SEC Precise.', products: ['agarose-sec-resin'] },
  { file: 'iec-resins-overview-poster.pdf', title: 'Ion Exchange Resins — Overview poster', type: 'poster', documentDate: '2026-05-01', summary: 'SP, Q and DEAE Agarose at a glance: binding capacities, typical specifications and applications.', products: ['sp-agarose', 'q-agarose', 'deae-agarose'] },
  { file: 'deae-agarose-precise-performance-data.pdf', title: 'DEAE Agarose Precise — Performance data', type: 'performance-data', documentDate: '2026-05-01', featured: true, summary: 'Packing factors, pressure–flow at 18/45 cm beds, column efficiency vs velocity, DBC 128 mg BSA/mL and technical performance summary.', products: ['deae-agarose'] },
  { file: 'iec-column-efficiency-case-study.pdf', title: 'How column packing protocol influences IEC column efficiency — Case study', type: 'case-study', documentDate: '2026-05-01', summary: 'Same resin, column and packing velocity, different bed consolidation: effect on peak symmetry, plates per metre and plate height.', products: ['sp-agarose', 'q-agarose', 'deae-agarose'] },
  { file: 'indigenous-chromatography-resins-intro-deck.pdf', title: 'Indigenous Chromatography Resins for Biopharmaceuticals — Introduction', type: 'presentation', documentDate: '2026-02-01', summary: 'Company introduction by Dr. Rucha P. Desai: facility, product scope, full spec tables for SP/Q/DEAE/Ni-NTA vs industry standard, particle-size grades, evaluation strategy.', products: ['sp-agarose', 'q-agarose', 'deae-agarose', 'ni-nta-agarose'] },
  { file: 'protpure-executive-brochure-2026.pdf', title: 'Protpure Executive Brochure', type: 'brochure', documentDate: '2026-06-01', summary: 'Company overview: about Protpure, affinity and ion exchange platforms, SEC and HIC, capabilities and commercial deployment.', products: [] },
  { file: 'protpure-product-brochure-2026-08.pdf', title: 'Protpure Product Brochure 2026', type: 'brochure', documentDate: '2026-08-01', featured: true, summary: 'Current product brochure: SEC resin, ion exchange resins and grades, Hy-Ionic DP, Phenyl Agarose, MR Agarose kit, metal affinity resins and downstream bioprocessing services.', products: ['agarose-sec-resin', 'hy-ionic-dp', 'phenyl-agarose', 'mr-agarose-kit', 'ni-nta-agarose'] },
]

export const mediaAlts: Record<string, string> = {
  '01_sp-agarose.webp': 'Protpure SP Agarose resin, 500 mL bottle',
  '02_cm-agarose.webp': 'Protpure CM Agarose resin, 500 mL bottle',
  '03_q-agarose.webp': 'Protpure Q Agarose resin, 500 mL bottle',
  '04_deae-agarose.webp': 'Protpure DEAE Agarose resin, 500 mL bottle',
  '05_4pct-agarose.webp': 'Protpure 4% agarose resin, 500 mL bottle',
  '06_6pct-agarose.webp': 'Protpure 6% agarose resin, 500 mL bottle',
  '07_2pct-crosslinked-agarose.webp': 'Protpure 2% cross-linked agarose resin, 500 mL bottle',
  '08_4pct-crosslinked-agarose.webp': 'Protpure 4% cross-linked agarose resin, 500 mL bottle',
  '09_6pct-crosslinked-agarose.webp': 'Protpure 6% cross-linked agarose resin, 500 mL bottle',
  '10_ni-nta-agarose.webp': 'Protpure Ni-NTA Agarose resin, 500 mL bottle',
  '12_co-nta-agarose.webp': 'Protpure Co-NTA Agarose resin, 500 mL bottle',
  '14_zn-nta-agarose.webp': 'Protpure Zn-NTA Agarose resin, 500 mL bottle',
  '16_cu-nta-agarose.webp': 'Protpure Cu-NTA Agarose resin, 500 mL bottle',
  '18_cnbr-activated-agarose.webp': 'Protpure CNBr-activated agarose resin, 500 mL bottle',
  '19_phenyl-agarose.webp': 'Protpure Phenyl Agarose resin, 500 mL bottle',
  '20_ni-nta-magnetic-agarose.webp': 'Protpure Ni-NTA Magnetic Agarose beads',
  'ni-nta-1ml-columns.webp': 'Protpure Ni-NTA Agarose 1 mL pre-packed FPLC columns',
  'fplc-prepacked-1ml-columns.webp': 'Protpure FPLC pre-packed 1 mL columns in retail box',
  'fplc-prepacked-1ml-columns-2.webp': 'Protpure pre-packed 1 mL columns, SP, Q, DEAE and Ni-NTA',
  'product-portfolio.webp': 'Protpure product portfolio: resin jerrycans and pre-packed columns',
  'bpg200-column-client-site.webp': 'BPG 200 process column packed with Protpure Ni-NTA Agarose at a customer site',
  'ni-nta-packed-column-lab.webp': 'Glass process column packed with Protpure Ni-NTA Agarose in the laboratory',
  'fplc-system.webp': 'FPLC system in the Protpure application laboratory',
  'fplc-system-1l-column.webp': 'FPLC system with a 1 L column at Protpure',
  'poster-downstream-services.webp': 'Downstream bioprocessing services poster',
  'poster-upstream-downstream.webp': 'Upstream to downstream: building India’s bioprocessing ecosystem',
  'poster-consistency.webp': 'Purification is not just about performance — it is about consistency',
  'mr-agarose-kit.webp': 'Protpure MR Agarose transition metal removal evaluation kit',
  'poster-mr-agarose.webp': 'ProtPure MR Agarose LinkedIn poster',
  'hero-resins-concept.webp': 'High-performance chromatography resins — concept visual',
  'protpure-logo.png': 'Protpure logo',
  'protpure-logo.svg': 'Protpure logo',
}
