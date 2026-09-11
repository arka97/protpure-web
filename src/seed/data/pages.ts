import { rt } from '../richtext'

/**
 * Page definitions. `link` values use { slug } for internal pages, { href } for custom URLs;
 * the seeder resolves them to Payload link groups. `image` values are seed/media filenames.
 */
export const pages = [
  {
    slug: 'home',
    title: 'Home',
    hero: {
      style: 'standard',
      eyebrow: 'Manufactured in India · Supplied worldwide',
      heading: 'Agarose chromatography resins engineered for purification at scale',
      highlight: 'engineered for purification at scale',
      text: 'Ion exchange, IMAC, size exclusion, HIC and mixed-mode resins on one cross-linked agarose backbone — BioProcess grade, benchmarked against imported media, shipped in 2–3 weeks.',
      image: 'bpg200-column-client-site.webp',
      links: [
        { label: 'Browse products', href: '/products', appearance: 'primary' },
        { label: 'Request a quote', href: '/request-quote', appearance: 'secondary' },
      ],
      badges: [{ text: 'BioProcess grade' }, { text: 'Used in GMP facilities' }, { text: 'R&D to commercial scale' }],
    },
    layout: [
      { blockType: 'stats', style: 'light', items: [
        { value: '600 L', label: 'Monthly production capacity', note: 'Agarose-based resins, semi-automated plant' },
        { value: '16', label: 'Products across six chromatography modes' },
        { value: '2–3 wk', label: 'Standard lead time ex-works', note: 'vs 8–12 weeks typical for imports' },
        { value: '1000 cm/h', label: 'Max linear flow, Faster grade', note: 'Fast Flow 700 · Precise 380 · HR 120' },
      ] },
      { blockType: 'productCategories', eyebrow: 'Catalog', heading: 'Resins for every purification stage', intro: 'Browse by chromatography mode. Each family ships in pack sizes from 5 mL sample kits to 25 L and bulk volumes.' },
      { blockType: 'gradesPlatform', eyebrow: 'Particle platform', heading: 'Four bead sizes, one chemistry', intro: 'The same 6% cross-linked agarose backbone tuned for different velocity and resolution profiles. Pick the grade that matches your column geometry and workflow.', grades: [
        { name: 'Agarose Faster', badge: 'High throughput', d50: '~163 µm', sizeRange: '100–240 µm', maxFlow: 'up to 1000 cm/h', pressure: '< 0.15 MPa', text: 'Rapid processing without compromising resolution. Developed for industrial capture of large proteins.' },
        { name: 'Agarose Fast Flow', badge: 'Balanced', d50: '~96 µm', sizeRange: '45–165 µm', maxFlow: 'up to 700 cm/h', pressure: '< 0.15 MPa', text: 'Balance of efficiency and separation clarity for most downstream processes.' },
        { name: 'Agarose Precise', badge: 'High resolution', d50: '~60 µm', sizeRange: '25–110 µm', maxFlow: 'up to 380 cm/h', pressure: '< 0.12 MPa', text: 'Flow conditions that favour high-resolution separation of sensitive biomolecules and complex matrices.' },
        { name: 'Agarose HR', badge: 'Gentle elution', d50: '~40 µm', sizeRange: '15–75 µm', maxFlow: 'up to 120 cm/h', pressure: '< 0.1 MPa', text: 'Gentle handling of fragile proteins and peptides with minimal shear — for polishing and small proteins.' },
      ] },
      { blockType: 'resinSelector', eyebrow: 'Resin selector', heading: 'Find the right chemistry in three steps', intro: 'Tell us what you are purifying and we will suggest the matching resin family and grade.' },
      { blockType: 'featuredProducts', eyebrow: 'Featured', heading: 'Most requested resins', intro: 'Benchmarked against typical market specifications on every product page.' },
      { blockType: 'featureGrid', eyebrow: 'Why Protpure', heading: 'Six reasons scientists and procurement teams switch', columns: '3', numbered: true, items: [
        { icon: 'purity', title: 'High purity & superior yield', text: 'Engineered for exceptional purity and high protein recovery across research and production workflows.' },
        { icon: 'reproducible', title: 'Reproducible batch quality', text: 'Controlled bead-size distribution and stable ligand attachment give lot-to-lot consistency with minimal re-optimisation; validated in GMP environments.' },
        { icon: 'flow', title: 'Optimised flow velocity', text: 'Up to 1000 cm/h on the Faster grade. Faster purification and higher throughput without sacrificing resolution.' },
        { icon: 'delivery', title: '2–3 week delivery', text: 'Compared with 8–12 weeks for imported alternatives — faster R&D iterations and fewer production delays.' },
        { icon: 'globe', title: 'Made in India, shipped worldwide', text: 'Developed, manufactured and supported in Anand, Gujarat. Direct export with full documentation and no cold chain.' },
        { icon: 'support', title: 'Scientist-to-scientist support', text: 'Every inquiry is answered by the team that makes the resin. Method development and column packing available as services.' },
      ] },
      { blockType: 'comparisonTable', eyebrow: 'Comparison', heading: 'Imported resins vs Protpure', intro: 'What changes when you source chromatography media directly from the manufacturer.', columnA: 'Typical imported supplier', columnB: 'Protpure', rows: [
        { parameter: 'Lead time', a: '8–12 weeks (typical)', b: '2–3 weeks ex-works' },
        { parameter: 'Technical support', a: 'Via distributors, indirect', b: 'Direct scientist-to-scientist' },
        { parameter: 'Evaluation', a: 'Rigid MOQs, formal sampling', b: 'Paid sample kits (5–25 mL packs or a 1 mL pre-packed column), credited against your first bulk order' },
        { parameter: 'Method development', a: 'Application notes only', b: 'Hands-on collaboration; paid services with reports' },
        { parameter: 'Custom pack sizes', a: 'Standard catalogue only', b: '5 mL to 25 L, bulk and custom volumes' },
        { parameter: 'Custom chemistry', a: 'Rarely', b: 'Bead size, ligand density and coupled ligands to order' },
        { parameter: 'Documentation', a: 'Standard', b: 'Datasheet + CoA per lot; filing support under NDA' },
      ], note: 'Typical values; imported-supplier figures reflect customer-reported experience in India.' },
      { blockType: 'applicationsGrid', eyebrow: 'Applications', heading: 'Purification workflows we support', intro: 'From biologics and vaccines to diagnostics, research and industrial biotechnology.' },
      { blockType: 'twoColumn', eyebrow: 'Facility', heading: 'Built for scale, grounded in science', image: 'fplc-system.webp', imagePosition: 'right', content: rt(`Protpure started in May 2023 with a semi-automated manufacturing and R&D facility in Anand, Gujarat, and in-house capability across bead synthesis, ligand functionalisation, chromatography media development, process evaluation and customer deployment.

> “We are a humble start-up in the niche technology of protein purification. With proven academic research backed by our kilo-lab success, we are entering the market to provide a wide range of resins and nanoparticle-based purification solutions.” — Dr. Rucha P. Desai, Founding Director`), facts: [
        { label: 'Location', value: 'Anand, Gujarat, India' },
        { label: 'Established', value: 'May 2023' },
        { label: 'Capacity', value: '600 L/month, expansion in planning' },
        { label: 'Validation', value: 'Used in GMP facilities; repeat orders' },
      ], links: [{ label: 'About Protpure', slug: 'about', appearance: 'secondary' }, { label: 'Technology', slug: 'technology', appearance: 'ghost' }] },
      { blockType: 'servicesGrid', eyebrow: 'Services', heading: 'We don’t just supply resin', intro: 'Column packing, resin screening, method development and purification services from the scientists who make the media.' },
      { blockType: 'linkedInFeed', eyebrow: 'Updates', heading: 'Latest from Protpure', intro: 'Posters, data and milestones as we share them on LinkedIn.', limit: 3 },
      { blockType: 'latestPosts', eyebrow: 'Blog', heading: 'Notes from the bench', limit: 3 },
      { blockType: 'faqBlock', heading: 'Questions buyers ask first', intro: 'Ordering, evaluation, shipping and documentation.', category: 'ordering' },
      { blockType: 'cta', style: 'dark', heading: 'Ready to qualify Protpure resins in your process?', text: 'Send us the products, grades and volumes you have in mind. A scientist replies within 1–2 business days with pricing, lead time and evaluation options.', links: [{ label: 'Request a quote', href: '/request-quote', appearance: 'primary' }, { label: 'Talk to a scientist', href: '/contact', appearance: 'secondary' }] },
    ],
  },
  {
    slug: 'about',
    title: 'About Protpure',
    hero: { style: 'standard', eyebrow: 'Company', heading: 'Building India’s indigenous chromatography resin platform', highlight: 'indigenous chromatography resin platform', text: 'Protpure Tech Pvt. Ltd. develops and manufactures agarose-based chromatography media in Anand, Gujarat — reducing dependence on imported resins for India’s biopharma industry and supplying the same media to customers worldwide.', image: 'fplc-system-1l-column.webp', badges: [{ text: 'Founded May 2023' }, { text: 'Bootstrapped, founder-led' }, { text: '8–10 person team' }] },
    layout: [
      { blockType: 'twoColumn', eyebrow: 'Why indigenous media', heading: 'More than 90% of the chromatography media used in India is imported', image: 'bpg200-column-client-site.webp', imagePosition: 'left', content: rt(`Chromatography resins are critical to biopharmaceutical manufacturing yet largely import-dependent, with long lead times and limited flexibility during R&D iterations. Protpure exists to change that: an Indian manufacturer with core expertise in bead synthesis, cross-linking and ligand chemistry, building a resin platform that scales from R&D to commercial manufacturing.

## Vision

To establish a globally competitive indigenous chromatography resin platform supporting India’s growing biotechnology and biopharmaceutical ecosystem.

## Mission

To develop and manufacture affordable, reliable and scalable chromatography media for protein purification, diagnostics and advanced biotechnology applications — and to democratise access to high-quality agarose resins while reducing import dependency and foreign-exchange outflow.`), facts: [
        { label: 'Facility', value: 'Semi-automated manufacturing + R&D' },
        { label: 'Capacity', value: '600 L/month of agarose-based resins' },
        { label: 'Validation', value: 'Used in GMP facilities; repeat orders from Indian biopharma' },
        { label: 'Expansion', value: 'Large-scale production plant in active planning' },
      ] },
      { blockType: 'timeline', eyebrow: 'Milestones', heading: 'Commercial progress', items: [
        { date: 'May 2023', title: 'Protpure Tech founded in Anand, Gujarat', text: 'Scientist-led start-up with exclusive manufacturing of agarose- and dextran-based matrices.' },
        { date: '2024', title: 'First Indian manufacturer of Ni-NTA Agarose', text: 'Commercial supply of Ni-NTA Agarose executed; repeat usage established.' },
        { date: '2025', title: 'Indigenous IEC media and BPG 200 deployment', text: 'SP, Q and DEAE Agarose developed and evaluated in industry-relevant workflows; Ni-NTA Agarose packed in a BPG 200 process column at a client site.' },
        { date: '2026', title: 'Expanding the portfolio', text: 'Technical datasheets Rev 1.0, Hy-Ionic™ DP mixed-mode resin, MR Agarose kit, Phenyl Agarose and SEC resin; downstream bioprocessing services launched.' },
      ] },
      { blockType: 'featureGrid', eyebrow: 'Capabilities', heading: 'From resin development to customer deployment', columns: '3', items: [
        { icon: 'beaker', title: 'Bead synthesis & cross-linking', text: 'Controlled bead-size distribution and cross-linking chemistry give the pressure–flow behaviour each grade is specified for.' },
        { icon: 'microscope', title: 'Ligand chemistry', text: 'Sulfopropyl, carboxymethyl, quaternary amine, DEAE, NTA, phenyl and mixed-mode functionalisation, plus custom coupling.' },
        { icon: 'chart', title: 'Process evaluation', text: 'Column packing, efficiency testing (HETP, asymmetry), DBC studies and pressure–flow characterisation on FPLC systems up to 1 L columns.' },
        { icon: 'factory', title: 'Manufacturing', text: '600 L/month semi-automated production with lot-level certificates of analysis.' },
        { icon: 'handshake', title: 'Customer deployment', text: 'Commercial implementation of Protpure media in customer processes, including BPG 200 process columns.' },
        { icon: 'shield', title: 'Alignment to GMP', text: 'Reproducibility over aggressive customisation; long-term view toward GMP-compliant production.' },
      ] },
      { blockType: 'teamGrid', eyebrow: 'Leadership', heading: 'Founder-led innovation' },
      { blockType: 'featureGrid', eyebrow: 'What we look for', heading: 'How we work with customers', columns: '3', items: [
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
    hero: { style: 'standard', eyebrow: 'Technology platform', heading: 'One backbone, four bead sizes, every chemistry', highlight: 'four bead sizes', text: 'Linear flow velocity is a key parameter in chromatographic purification — governing binding efficiency, resolution and process scalability. Protpure’s particle platform lets you choose the flow–resolution balance without changing chemistry.', image: 'ni-nta-packed-column-lab.webp' },
    layout: [
      { blockType: 'gradesPlatform', eyebrow: 'Linear flow velocity highlights', heading: 'Tested under 0.1 MPa pre-column pressure for optimum consistency', intro: 'Every grade is characterised in a 26/20 column at 20 cm bed height (106 mL bed volume) under the same pressure limit, so the numbers are directly comparable.', grades: [
        { name: 'Agarose Faster', badge: 'High throughput', d50: '163 µm', sizeRange: '100–240 µm', maxFlow: 'up to 1000 cm/h', pressure: '< 0.15 MPa', text: 'Ideal for rapid processing workflows without compromising resolution. Specially developed for industrial requirements — large proteins, recombinant enzymes, partial purification of insulin.' },
        { name: 'Agarose', badge: 'Balanced', d50: '96 µm', sizeRange: '45–165 µm', maxFlow: 'up to 700 cm/h', pressure: '< 0.15 MPa', text: 'Harmonious balance of efficiency and separation clarity, suitable for most downstream processes and large-to-medium proteins.' },
        { name: 'Agarose Precise', badge: 'Precise optimisation', d50: '60 µm', sizeRange: '25–110 µm', maxFlow: 'up to 380 cm/h', pressure: '< 0.12 MPa', text: 'Flow conditions favour high-resolution separation for sensitive biomolecules and complex matrices; medium to small proteins.' },
        { name: 'Agarose HR', badge: 'Gentle elution', d50: '40 µm', sizeRange: '15–75 µm', maxFlow: 'up to 120 cm/h', pressure: '< 0.1 MPa', text: 'Gentle handling of fragile proteins, minimising shear — perfect for delicate purification steps, small proteins and peptides.' },
      ] },
      { blockType: 'richText', width: 'narrow', content: rt(`## Bead size vs resolution: why it matters

The purification stage sets the bead size you want. **Capture** from crude feedstock — initial steps for mAbs, plasma proteins, vaccines — uses 100–300 µm beads: low resolution, high flow, binding and isolating large proteins or complexes. **Intermediate purification** of recombinant proteins, enzymes and hormones uses 45–165 µm beads to remove bulk impurities at moderate resolution. **Polishing** — isoform separation, aggregate removal, analytical SEC — uses 20–100 µm beads to achieve high-resolution separation of closely related species.

Other parameters that interact with bead size: column dimension, bed volume and column pressure. Our resin screening and column packing services help you choose.

## Why cross-linked agarose

Agarose beads are hydrophilic, low in non-specific binding and have an open pore structure that lets large biomolecules reach the ligands. Cross-linking adds the mechanical rigidity needed for high flow rates and repeated cleaning in 1 M NaOH. Protpure controls bead synthesis, cross-linking and ligand chemistry in-house, which is what makes the four grades consistent across every chemistry.

## Column efficiency is part of the product

Reproducibility often begins during column packing itself. We evaluate every resin with an acetone pulse test and report HETP, asymmetry, plate height and plates per metre — the same parameters we recommend you track. Read the [column packing case study](/blog/how-column-packing-protocol-influences-iec-column-efficiency) and the [DEAE Agarose Precise performance data](/blog/deae-agarose-precise-pressure-flow-and-dynamic-binding-capacity).`) },
      { blockType: 'comparisonTable', eyebrow: 'Benchmark', heading: 'Protpure vs typical market specification', intro: 'Ion exchange resins, standard grade. Full three-column comparisons are on each product page.', columnA: 'Typical market specification', columnB: 'Protpure (Fast Flow)', rows: [
        { parameter: 'Matrix', a: '6% cross-linked agarose, spherical', b: '6% spherical cross-linked agarose' },
        { parameter: 'Particle size range / d50V', a: '45–165 µm / 90 µm', b: '45–165 µm / ~90 µm' },
        { parameter: 'Ionic capacity (SP)', a: '0.18–0.25 mmol H⁺/mL', b: '0.18–0.25 mmol H⁺/mL' },
        { parameter: 'Dynamic binding capacity (SP)', a: '≥100 mg lysozyme/mL', b: '≈100 mg lysozyme/mL (HR ≈130)' },
        { parameter: 'Dynamic binding capacity (Q)', a: '40–70 mg BSA/mL (Fast Flow)', b: '≈80 mg BSA/mL (HR ≈120)' },
        { parameter: 'pH stability (CIP / operational)', a: '2–14 / 2–12', b: '2–14 / 2–12' },
        { parameter: 'Chemical stability', a: '1 M NaOH, 8 M urea, 6 M GuHCl, 70% ethanol', b: '1 M NaOH, 8 M urea, 6 M GuHCl, 70% ethanol' },
      ] },
      { blockType: 'documentList', heading: 'Technical data', intro: 'Datasheets, performance data and case studies.', types: ['datasheet', 'performance-data', 'case-study', 'poster'], limit: 8 },
      { blockType: 'cta', style: 'dark', heading: 'Not sure which grade fits your column?', text: 'Send us your column geometry, feed and target and we will recommend a grade — or screen it for you.', links: [{ label: 'Ask a scientist', href: '/request-quote?type=technical', appearance: 'primary' }, { label: 'Resin screening service', href: '/services', appearance: 'secondary' }] },
    ],
  },
  {
    slug: 'global-supply',
    title: 'Global supply & distribution',
    hero: { style: 'standard', eyebrow: 'International', heading: 'Made in India. Supplied worldwide.', highlight: 'Supplied worldwide.', text: 'Protpure resins ship ex-works Anand to customers on every continent, with full technical and customs documentation. We are actively appointing distributors in Europe, the Americas and beyond.', image: 'product-portfolio.webp', links: [{ label: 'Request a quote', href: '/request-quote', appearance: 'primary' }, { label: 'Become a distributor', href: '/request-quote?type=partnership', appearance: 'secondary' }] },
    layout: [
      { blockType: 'featureGrid', eyebrow: 'How we ship', heading: 'Simple to import', columns: '4', items: [
        { icon: 'globe', title: 'Worldwide, ex-works or delivered', text: 'EXW Anand by default; FOB and CIF on request. We work with your forwarder or ours.' },
        { icon: 'document', title: 'Full documentation', text: 'Commercial invoice, packing list, HS code, MSDS, technical datasheet and certificate of analysis with every shipment.' },
        { icon: 'shield', title: 'No cold chain', text: 'Resins travel as a 20% ethanol slurry at ambient temperature and are non-hazardous for transport.' },
        { icon: 'cost', title: 'Quotes in your currency', text: 'USD, EUR or INR invoicing; bank transfer and letters of credit for larger orders.' },
      ] },
      { blockType: 'richText', width: 'narrow', content: rt(`## Regions

- **India** — direct supply, GST invoicing, domestic dispatch from Gujarat.
- **Middle East, Africa and South-East Asia** — direct export.
- **Europe and North America** — direct export today; distribution partners wanted.
- **Latin America** — distribution partners wanted.

## Distributors

We are looking for partners who serve biopharma process development, research and diagnostic customers and can hold evaluation stock. We offer technical training, co-marketing, protected territories and direct scientist support for your customers. Tell us about your company and territory through the partnership form.`) },
      { blockType: 'faqBlock', heading: 'Shipping & export questions', category: 'shipping' },
      { blockType: 'formBlock', form: 'partnership', heading: 'Partner with Protpure', intro: 'Distributors, CDMOs and procurement teams outside India — tell us how you would like to work together.', sidebar: rt(`We reply within 1–2 business days. Include your territory, customer segments and any resins you already represent.`) },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy policy',
    hero: { style: 'compact', text: 'How Protpure Tech Pvt. Ltd. handles the personal data you share with us through this website.' },
    layout: [
      { blockType: 'richText', width: 'narrow', content: rt(`## What we collect

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
    hero: { style: 'compact', text: 'Standard terms that apply to quotations and orders unless a separate agreement is in place.' },
    layout: [
      { blockType: 'richText', width: 'narrow', content: rt(`## Quotations and orders

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
