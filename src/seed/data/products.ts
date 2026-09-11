import { rt } from '../richtext'

/**
 * Product catalogue seeded from Protpure's own materials:
 *  - Technical datasheets Rev 1.0 (May 2026): SP, Q, DEAE Agarose
 *  - SP Agarose HR datasheet (Jun 2026)
 *  - Product brochure (Aug 2026): SEC resin, Hy-Ionic DP, Phenyl Agarose, MR Agarose, IMAC family
 *  - Benchmarking sheet (Jul 2025) and intro deck (Feb 2026): Faster grades, Ni-NTA data
 *  - Product catalog R1 (Jul 2025): catalog numbers and pack sizes
 * Values are typical specifications; editors should keep them in sync with the current datasheets.
 */

const STABILITY = 'Stable in 1.0 M NaOH, 8 M urea, 6 M guanidine hydrochloride, 70% ethanol'
const STORAGE = '4–30 °C, 20% ethanol'

const iexCommon = (ionic: string, market: string) => [
  { parameter: 'BioProcess resin', value: 'Yes', marketSpec: 'Yes' },
  { parameter: 'Ionic capacity', value: ionic, marketSpec: market },
  { parameter: 'pH stability, CIP', value: '2–14', marketSpec: '2–14' },
  { parameter: 'pH stability, operational', value: '2–12', marketSpec: '2–12' },
  { parameter: 'Chemical stability', value: STABILITY, marketSpec: STABILITY },
  { parameter: 'Storage conditions', value: STORAGE, marketSpec: STORAGE },
  { parameter: 'Column efficiency (acetone pulse)', value: 'Asymmetry 1.63; reduced plate height 1.04', marketSpec: '0.8 < As < 1.8; h ≤ 3' },
]

const imacCommon = [
  { parameter: 'BioProcess resin', value: 'Yes', marketSpec: 'Yes' },
  { parameter: 'pH stability, CIP', value: '2–14', marketSpec: '2–14' },
  { parameter: 'pH stability, operational', value: '2–12', marketSpec: '2–12' },
  { parameter: 'Chemical stability', value: 'Stable in 1.0 M NaOH, 8 M urea, 6 M guanidine hydrochloride', marketSpec: 'Stable in 1.0 M NaOH, 8 M urea, 6 M guanidine hydrochloride' },
  { parameter: 'Storage conditions', value: STORAGE, marketSpec: STORAGE },
]

export type SeedProduct = {
  slug: string
  name: string
  subtitle: string
  category: string
  status?: 'available' | 'made-to-order' | 'in-development'
  featured?: boolean
  order: number
  image?: string
  summary: string
  description: ReturnType<typeof rt>
  keyFeatures: string[]
  chemistry: { ligand?: string; matrix?: string; functionalType?: string }
  grades?: { grade: 'faster' | 'fast-flow' | 'precise' | 'hr'; label?: string; particleSizeRange?: string; d50?: string; maxFlowVelocity?: string; dynamicBindingCapacity?: string; pressureFlow?: string }[]
  specs?: { parameter: string; value: string; marketSpec?: string }[]
  useCases?: string[]
  applications?: string[]
  packSizes?: { size: string; catalogNumber?: string; grade?: 'faster' | 'fast-flow' | 'precise' | 'hr' }[]
  leadTime?: string
  /** Copy for the paid-evaluation callout under the ordering table; defaults to EVALUATION_NOTE_DEFAULT. */
  evaluationNote?: string
  documents?: string[]
  related?: string[]
}

const packs = (prefix: string, sizes: string[]) => sizes.map((s, i) => ({ size: s, catalogNumber: `${prefix}${String(i + 1).padStart(2, '0')}` }))
const STANDARD_PACKS = ['50 mL', '100 mL', '250 mL', '500 mL', '1 L', '5 L', '10 L', '25 L', 'Bulk (custom)']

export const products: SeedProduct[] = [
  // ---------------- Ion exchange ----------------
  {
    slug: 'sp-agarose',
    name: 'SP Agarose',
    subtitle: 'Strong cation exchanger',
    category: 'ion-exchange',
    featured: true,
    order: 1,
    image: '01_sp-agarose.webp',
    summary: 'Sulfopropyl strong cation exchanger on a 6% highly cross-linked spherical agarose matrix. Available in Fast Flow, Precise and HR grades for high-throughput capture through high-resolution polishing.',
    description: rt(`Protpure SP Agarose resins are strong cation exchangers based on a 6% highly cross-linked spherical agarose matrix. Available in Fast Flow, Precise and High Resolution grades, they provide a range of performance options from high-throughput capture and intermediate purification to high-resolution polishing applications.

They are designed for high-resolution purification of proteins and other biomolecules, offering high binding capacity, excellent selectivity, robust chemical stability, reproducibility and scalability for bioprocess development and manufacturing.

## Which grade?

- **Fast Flow** (45–165 µm) — capture from clarified feed at 250–450 cm/h with low back-pressure.
- **Precise** (45–105 µm) — intermediate purification where resolution matters at 100–300 cm/h.
- **HR** (25–55 µm) — polishing and isoform separation at 70–120 cm/h.
- **Faster** (100–200 µm) — industrial high-throughput capture up to 1000 cm/h, developed for an industrial collaborator.`),
    keyFeatures: ['High binding capacity, consistent and reproducible', 'Robust chemical stability across a wide pH and CIP range', 'Scalable performance from lab to manufacturing', 'Excellent flow properties for high-resolution separations', 'Agarose-based bioprocess platform'],
    chemistry: { ligand: 'Sulfopropyl', matrix: '6% spherical cross-linked agarose', functionalType: 'Strong cation exchanger' },
    grades: [
      { grade: 'faster', label: 'SP Agarose Faster', particleSizeRange: '100–200 µm', d50: '~150 µm', maxFlowVelocity: '800–1000 cm/h', dynamicBindingCapacity: '≥120 mg lysozyme/mL', pressureFlow: '800–1000 cm/h, 0.1 MPa, 20 cm bed height' },
      { grade: 'fast-flow', label: 'SP Agarose Fast Flow', particleSizeRange: '45–165 µm', d50: '~90 µm', maxFlowVelocity: '250–450 cm/h', dynamicBindingCapacity: '≈100 mg lysozyme/mL', pressureFlow: '250–450 cm/h, 0.1 MPa, 15 cm bed height' },
      { grade: 'precise', label: 'SP Agarose Precise', particleSizeRange: '45–105 µm', d50: '~65 µm', maxFlowVelocity: '100–300 cm/h', dynamicBindingCapacity: '≈120 mg lysozyme/mL', pressureFlow: '100–300 cm/h, 0.1 MPa, 15 cm bed height' },
      { grade: 'hr', label: 'SP Agarose HR', particleSizeRange: '25–55 µm', d50: '~35 µm', maxFlowVelocity: '70–120 cm/h', dynamicBindingCapacity: '≈130 mg lysozyme/mL', pressureFlow: '70–120 cm/h, 0.1 MPa, 15 cm bed height' },
    ],
    specs: iexCommon('0.18–0.25 mmol (H⁺)/mL settled resin', '0.18–0.25 mmol (H⁺)/mL settled resin'),
    useCases: ['Monoclonal antibody purification', 'Recombinant protein purification', 'Enzyme purification', 'Vaccine and viral vector downstream processing', 'Host cell protein (HCP) removal', 'Intermediate purification and polishing', 'Purification of positively charged biomolecules', 'Process development and manufacturing-scale chromatography'],
    applications: ['biologics-biosimilars', 'vaccines', 'industrial-biotechnology', 'research-academia'],
    packSizes: packs('SP', STANDARD_PACKS),
    documents: ['sp-agarose-technical-datasheet-v1.pdf', 'sp-agarose-hr-datasheet.pdf', 'iec-resins-overview-poster.pdf', 'iec-column-efficiency-case-study.pdf'],
    related: ['cm-agarose', 'q-agarose', 'deae-agarose'],
  },
  {
    slug: 'cm-agarose',
    name: 'CM Agarose',
    subtitle: 'Weak cation exchanger',
    category: 'ion-exchange',
    order: 2,
    image: '02_cm-agarose.webp',
    summary: 'Carboxymethyl weak cation exchanger on 6% cross-linked agarose. Gentle binding for proteins with lower positive charge and for mild elution conditions in capture and polishing.',
    description: rt(`Carboxymethyl (CM) Agarose is a weak cation exchange resin used in intermediate and finished-product separation and purification steps. The carboxymethyl group on activated agarose gives a weak cation exchanger with high pH stability that withstands sodium hydroxide cleaning protocols.

CM Agarose is the right choice where SP is too strong: proteins with a low positive charge, or when the target must elute under mild conditions to preserve activity.`),
    keyFeatures: ['Weak cation exchanger for mild elution', 'High pH stability; NaOH cleaning compatible', 'Same 6% cross-linked agarose backbone as SP Agarose', 'Available in Fast Flow and Faster grades'],
    chemistry: { ligand: 'Carboxymethyl', matrix: '6% spherical cross-linked agarose', functionalType: 'Weak cation exchanger' },
    grades: [
      { grade: 'faster', label: 'CM Agarose Faster', particleSizeRange: '100–200 µm', d50: '~150 µm', maxFlowVelocity: '800–1000 cm/h', pressureFlow: '800–1000 cm/h, 0.1 MPa, 20 cm bed height' },
      { grade: 'fast-flow', label: 'CM Agarose', particleSizeRange: '45–165 µm', d50: '~90 µm', maxFlowVelocity: '400–700 cm/h', pressureFlow: '400–700 cm/h, 0.1 MPa, 20 cm bed height' },
    ],
    specs: [
      { parameter: 'BioProcess resin', value: 'Yes' },
      { parameter: 'Ionic capacity', value: '0.09–0.13 mmol (H⁺)/mL medium' },
      { parameter: 'pH stability, CIP', value: '2–14' },
      { parameter: 'pH stability, operational', value: '2–12' },
      { parameter: 'Chemical stability', value: STABILITY },
      { parameter: 'Storage conditions', value: STORAGE },
    ],
    useCases: ['Proteins with low positive surface charge', 'Mild-elution capture and polishing', 'Enzyme purification'],
    applications: ['research-academia', 'industrial-biotechnology'],
    packSizes: packs('CM', STANDARD_PACKS),
    related: ['sp-agarose', 'deae-agarose'],
  },
  {
    slug: 'q-agarose',
    name: 'Q Agarose',
    subtitle: 'Strong anion exchanger',
    category: 'ion-exchange',
    featured: true,
    order: 3,
    image: '03_q-agarose.webp',
    summary: 'Quaternary amine strong anion exchanger on 6% cross-linked agarose. Capture and polishing of acidic proteins, plasmid DNA and viral vectors, with host cell protein and endotoxin clearance.',
    description: rt(`Protpure Q Agarose resins are strong anion exchangers based on a 6% highly cross-linked agarose matrix. They are designed for high-resolution purification of proteins and other biomolecules, offering excellent chemical stability, reproducibility and scalability for process development and manufacturing.

Q Agarose keeps its charge across the full operating pH range, which makes it the workhorse for capture of acidic proteins, plasmid DNA and viral vectors, and for flow-through polishing where host cell proteins, DNA and endotoxins bind while the product passes.`),
    keyFeatures: ['High binding capacity, consistent and reproducible', 'Robust chemical stability across a wide pH and CIP range', 'Scalable performance from lab to manufacturing', 'Agarose-based bioprocess platform'],
    chemistry: { ligand: 'Quaternary amine', matrix: '6% spherical cross-linked agarose', functionalType: 'Strong anion exchanger' },
    grades: [
      { grade: 'faster', label: 'Q Agarose Faster', particleSizeRange: '100–200 µm', d50: '~150 µm', maxFlowVelocity: '800–1000 cm/h', dynamicBindingCapacity: '≥110 mg BSA/mL', pressureFlow: '800–1000 cm/h, 0.1 MPa, 20 cm bed height' },
      { grade: 'fast-flow', label: 'Q Agarose Fast Flow', particleSizeRange: '45–165 µm', d50: '~90 µm', maxFlowVelocity: '250–450 cm/h', dynamicBindingCapacity: '≈80 mg BSA/mL', pressureFlow: '250–450 cm/h, 0.1 MPa, 15 cm bed height' },
      { grade: 'precise', label: 'Q Agarose Precise', particleSizeRange: '45–105 µm', d50: '~65 µm', maxFlowVelocity: '100–300 cm/h', dynamicBindingCapacity: '≈100 mg BSA/mL', pressureFlow: '100–300 cm/h, 0.1 MPa, 15 cm bed height' },
      { grade: 'hr', label: 'Q Agarose HR', particleSizeRange: '25–55 µm', d50: '~35 µm', maxFlowVelocity: '80–150 cm/h', dynamicBindingCapacity: '≈120 mg BSA/mL', pressureFlow: '80–150 cm/h, 0.1 MPa, 15 cm bed height' },
    ],
    specs: iexCommon('0.18–0.25 mmol (Cl⁻)/mL resin', '0.18–0.25 mmol (Cl⁻)/mL resin'),
    useCases: ['Capture and purification of proteins with basic isoelectric points', 'Purification of monoclonal antibodies and recombinant proteins', 'Viral and plasmid DNA purification', 'Separation of host cell proteins and impurities', 'Polishing steps in multi-step purification', 'Process development and scale-up'],
    applications: ['biologics-biosimilars', 'vaccines', 'gene-editing-advanced-therapies', 'industrial-biotechnology'],
    packSizes: packs('QA', STANDARD_PACKS),
    documents: ['q-agarose-technical-datasheet-v1.pdf', 'iec-resins-overview-poster.pdf'],
    related: ['deae-agarose', 'sp-agarose', 'hy-ionic-dp'],
  },
  {
    slug: 'deae-agarose',
    name: 'DEAE Agarose',
    subtitle: 'Weak anion exchanger',
    category: 'ion-exchange',
    featured: true,
    order: 4,
    image: '04_deae-agarose.webp',
    summary: 'Diethylaminoethyl weak anion exchanger on 6% cross-linked agarose. Excellent flow properties and selectivity for proteins that need mild elution; validated packing and DBC data available for the Precise grade.',
    description: rt(`Protpure DEAE Agarose resins are weak anion exchangers based on a 6% highly cross-linked agarose matrix. They are designed for high-resolution purification of proteins and other biomolecules, offering excellent chemical stability, reproducibility and scalability for process development and manufacturing.

DEAE Agarose Precise has been characterised in a 50 mm column at 18 cm and 45 cm bed heights: near-identical pressure–flow profiles at both heights (predictable scale-up), linear velocities above 350 cm/h at pressure drops below 0.25 MPa, 14,898 plates/m at 200 cm/h with an asymmetry factor of 1.16, and a measured dynamic binding capacity of 128 mg BSA/mL (10% breakthrough). The full study is in the performance-data document below.`),
    keyFeatures: ['Optimised weak anion exchange for high selectivity and yield', 'Excellent flow properties for faster process development', 'Robust across a wide range of pH and CIP conditions', 'Reliable performance with lot-to-lot consistency', 'Suitable for scale-up from R&D to commercial manufacturing'],
    chemistry: { ligand: 'Diethylaminoethyl', matrix: '6% spherical cross-linked agarose', functionalType: 'Weak anion exchanger' },
    grades: [
      { grade: 'faster', label: 'DEAE Agarose Faster', particleSizeRange: '100–200 µm', d50: '~150 µm', maxFlowVelocity: '800–1000 cm/h', dynamicBindingCapacity: '≥70 mg BSA/mL', pressureFlow: '800–1000 cm/h, 0.1 MPa, 20 cm bed height' },
      { grade: 'fast-flow', label: 'DEAE Agarose Fast Flow', particleSizeRange: '45–165 µm', d50: '~90 µm', maxFlowVelocity: '250–450 cm/h', dynamicBindingCapacity: '≈90 mg BSA/mL', pressureFlow: '250–450 cm/h, 0.1 MPa, 15 cm bed height' },
      { grade: 'precise', label: 'DEAE Agarose Precise', particleSizeRange: '45–105 µm', d50: '~65 µm', maxFlowVelocity: '100–300 cm/h', dynamicBindingCapacity: '≈110 mg BSA/mL (128 mg/mL measured)', pressureFlow: '100–300 cm/h, 0.1 MPa, 15 cm bed height' },
      { grade: 'hr', label: 'DEAE Agarose HR', particleSizeRange: '25–55 µm', d50: '~35 µm', maxFlowVelocity: '80–150 cm/h', dynamicBindingCapacity: '≈120 mg BSA/mL', pressureFlow: '80–150 cm/h, 0.1 MPa, 15 cm bed height' },
    ],
    specs: iexCommon('0.12–0.15 mmol (Cl⁻)/mL resin', '0.88–1.08 mmol (Cl⁻)/mL resin or /mg dry material'),
    useCases: ['Protein purification and intermediate polishing', 'Enzyme and peptide purification', 'Vaccine and recombinant protein downstream processing', 'Separation of biomolecules with weak anionic nature'],
    applications: ['biologics-biosimilars', 'vaccines', 'diagnostics', 'industrial-biotechnology'],
    packSizes: packs('DE', STANDARD_PACKS),
    documents: ['deae-agarose-technical-datasheet-v1.pdf', 'deae-agarose-precise-performance-data.pdf', 'iec-resins-overview-poster.pdf'],
    related: ['q-agarose', 'hy-ionic-dp', 'cm-agarose'],
  },

  // ---------------- Affinity / IMAC ----------------
  {
    slug: 'ni-nta-agarose',
    name: 'Ni-NTA Agarose',
    subtitle: 'IMAC resin for His-tagged proteins',
    category: 'affinity',
    featured: true,
    order: 1,
    image: '10_ni-nta-agarose.webp',
    summary: 'High-capacity Ni²⁺-NTA affinity resin on 6% agarose for single-step capture of His-tagged recombinant proteins. Protpure’s first commercial product, supplied to Indian biopharma with repeat orders and used in GMP facilities.',
    description: rt(`Protpure Ni-NTA Agarose is a 6% agarose resin chelated with nitrilotriacetic acid (NTA) and charged with nickel. His-tagged recombinant proteins bind through the affinity between Ni²⁺ ions and the imidazole nitrogen of histidine residues, in native or denaturing conditions, and are eluted with imidazole or by lowering the pH.

It is optimised for efficient capture of His-tagged proteins directly from bacterial lysates and cell-free extracts, reducing additional processing steps, with excellent flow properties and chemical stability for R&D through production scale.

## Faster grade

Ni-NTA Agarose Faster (100–200 µm) was developed with an industrial collaborator for downstream processing at up to 1000 cm/h without compromising resolution.`),
    keyFeatures: ['High binding capacity — up to ~40 mg His-tagged protein/mL', 'Excellent flow properties; Faster grade to 1000 cm/h', 'Suitable for R&D to production scale', 'Compatible with standard buffers, detergents and denaturants', 'Excellent chemical stability and reusability'],
    chemistry: { ligand: 'Ni²⁺-NTA (nitrilotriacetic acid)', matrix: '6% spherical cross-linked agarose', functionalType: 'Immobilised metal affinity (IMAC)' },
    grades: [
      { grade: 'faster', label: 'Ni-NTA Agarose Faster', particleSizeRange: '100–200 µm', d50: '~150 µm', maxFlowVelocity: '~1000 cm/h @ 0.12 MPa', dynamicBindingCapacity: '>20 mg His-tagged protein/mL', pressureFlow: '800–1000 cm/h, 0.15 MPa, 20 cm bed height' },
      { grade: 'fast-flow', label: 'Ni-NTA Agarose', particleSizeRange: '45–165 µm', d50: '~90 µm', maxFlowVelocity: '~700 cm/h @ 0.1 MPa', dynamicBindingCapacity: '~40 mg His-tagged protein/mL', pressureFlow: '500–700 cm/h, 0.15 MPa, 20 cm bed height' },
    ],
    specs: [
      { parameter: 'Metal ion capacity', value: '~2 mmol Ni²⁺/mL', marketSpec: '~1.8–2.0 mmol Ni²⁺/mL' },
      ...imacCommon,
    ],
    useCases: ['Recombinant protein purification', 'Construct and expression screening', 'Tool protein purification', 'Antibody and fusion protein purification', 'Benchmarking downstream behaviour', 'Process development and scale-up'],
    applications: ['research-academia', 'diagnostics', 'biologics-biosimilars', 'industrial-biotechnology'],
    packSizes: packs('NN', ['5 mL', '10 mL', '25 mL', '50 mL', '100 mL', '250 mL', '500 mL', '1 L', '5 L', '10 L', 'Bulk (custom)']),
    documents: ['indigenous-chromatography-resins-intro-deck.pdf', 'protpure-product-brochure-2026-08.pdf'],
    related: ['ni-nta-prepacked-columns', 'co-nta-agarose', 'ni-nta-magnetic-agarose', 'mr-agarose-kit'],
  },
  {
    slug: 'co-nta-agarose',
    name: 'Co-NTA Agarose',
    subtitle: 'Cobalt IMAC resin — higher selectivity',
    category: 'affinity',
    order: 2,
    image: '12_co-nta-agarose.webp',
    summary: 'Co²⁺-NTA affinity resin offering enhanced selectivity and reduced non-specific binding for challenging His-tagged proteins.',
    description: rt(`Co-NTA Agarose is an alternative to Ni-NTA for the purification of His-tagged recombinant proteins. Cobalt binds histidine tags with higher selectivity and lower non-specific binding than nickel, which gives cleaner eluates for challenging targets at the cost of some capacity. Bound protein is eluted with imidazole or at low pH.`),
    keyFeatures: ['Higher selectivity than Ni-NTA', 'Reduced non-specific binding', 'Ideal for challenging proteins', 'Stable and reusable', 'High chemical stability'],
    chemistry: { ligand: 'Co²⁺-NTA', matrix: '6% spherical cross-linked agarose', functionalType: 'Immobilised metal affinity (IMAC)' },
    grades: [{ grade: 'fast-flow', label: 'Co-NTA Agarose', particleSizeRange: '45–165 µm', d50: '~90 µm', maxFlowVelocity: '~700 cm/h', dynamicBindingCapacity: 'Up to 20 mg His-tagged protein/mL' }],
    specs: imacCommon,
    useCases: ['His-tagged proteins where purity matters more than capacity', 'Targets with high background binding on Ni-NTA'],
    applications: ['research-academia', 'diagnostics'],
    packSizes: packs('CN', ['5 mL', '10 mL', '25 mL', '50 mL', '100 mL', '250 mL', '500 mL', '1 L', 'Bulk (custom)']),
    related: ['ni-nta-agarose', 'cu-nta-agarose', 'zn-nta-agarose'],
  },
  {
    slug: 'cu-nta-agarose',
    name: 'Cu-NTA Agarose',
    subtitle: 'Copper IMAC resin — strongest binding',
    category: 'affinity',
    order: 3,
    image: '16_cu-nta-agarose.webp',
    summary: 'Cu²⁺-NTA affinity resin for strong binding and efficient purification of low-abundance His-tagged proteins, with fast binding kinetics and low metal leaching.',
    description: rt(`Cu-NTA Agarose is charged with copper for the strongest metal–histidine interaction in the NTA family. It is effective for low-abundance His-tagged proteins and for enrichment of histidine-rich proteins, with fast binding kinetics and reliable performance.`),
    keyFeatures: ['High binding strength', 'Effective for low-abundance proteins', 'Fast binding kinetics', 'Reliable performance', 'Low metal leaching'],
    chemistry: { ligand: 'Cu²⁺-NTA', matrix: '6% spherical cross-linked agarose', functionalType: 'Immobilised metal affinity (IMAC)' },
    grades: [{ grade: 'fast-flow', label: 'Cu-NTA Agarose', particleSizeRange: '45–165 µm', d50: '~90 µm', maxFlowVelocity: '~700 cm/h', dynamicBindingCapacity: 'Up to 20 mg His-tagged protein/mL' }],
    specs: imacCommon,
    useCases: ['Low-abundance His-tagged proteins', 'Enrichment of histidine-rich proteins'],
    applications: ['research-academia'],
    packSizes: packs('CU', ['5 mL', '10 mL', '25 mL', '50 mL', '100 mL', '250 mL', '500 mL', '1 L', 'Bulk (custom)']),
    related: ['ni-nta-agarose', 'co-nta-agarose', 'zn-nta-agarose'],
  },
  {
    slug: 'zn-nta-agarose',
    name: 'Zn-NTA Agarose',
    subtitle: 'Zinc IMAC resin — His-tags and zinc-binding proteins',
    category: 'affinity',
    order: 4,
    image: '14_zn-nta-agarose.webp',
    summary: 'Zn²⁺-NTA affinity resin with high chemical stability, low metal leaching and broad pH and buffer compatibility. Binds His-tagged proteins and zinc-binding proteins such as zinc fingers.',
    description: rt(`Zn-NTA Agarose effectively binds His-tagged and zinc-binding proteins. The 6% agarose beads chelated with zinc are useful for purification of recombinant proteins and for enrichment of zinc-finger proteins, with broad pH and buffer compatibility.`),
    keyFeatures: ['High chemical stability', 'Low metal leaching', 'Broad pH and buffer compatibility', 'Ideal for diverse applications', 'Robust and reproducible'],
    chemistry: { ligand: 'Zn²⁺-NTA', matrix: '6% spherical cross-linked agarose', functionalType: 'Immobilised metal affinity (IMAC)' },
    grades: [{ grade: 'fast-flow', label: 'Zn-NTA Agarose', particleSizeRange: '45–165 µm', d50: '~90 µm', maxFlowVelocity: '~700 cm/h', dynamicBindingCapacity: 'Up to 20 mg His-tagged protein/mL' }],
    specs: imacCommon,
    useCases: ['His-tagged recombinant proteins', 'Zinc-finger and zinc-binding protein enrichment'],
    applications: ['research-academia'],
    packSizes: packs('ZN', ['5 mL', '10 mL', '25 mL', '50 mL', '100 mL', '250 mL', '500 mL', '1 L', 'Bulk (custom)']),
    related: ['ni-nta-agarose', 'co-nta-agarose', 'cu-nta-agarose'],
  },
  {
    slug: 'cnbr-activated-agarose',
    name: 'CNBr-Activated Agarose',
    subtitle: 'Activated resin for custom ligand coupling',
    category: 'activated',
    order: 1,
    image: '18_cnbr-activated-agarose.webp',
    summary: 'Cyanogen-bromide-activated 4% agarose for immobilising your own protein or peptide ligand — immunoaffinity, Protein A coupling and custom affinity resins.',
    description: rt(`CNBr-activated agarose beads offer numerous protein–ligand binding sites, making them the standard support for immunoaffinity chromatography and custom affinity resins. Couple antibodies, antigens, lectins, enzymes or peptides through primary amines in a simple overnight reaction, then block and wash.

Protpure also couples ligands for you: ask about custom affinity resins on this or other activated chemistries.`),
    keyFeatures: ['> 85 µmol cyanate ester/mL resin', 'Couples through primary amines', 'Immunosorbent for immunoglobulin purification', 'Custom coupling service available'],
    chemistry: { ligand: 'Cyanogen bromide (activated)', matrix: '4% spherical agarose', functionalType: 'Activated support for ligand immobilisation' },
    grades: [{ grade: 'fast-flow', label: 'CNBr-Activated Agarose', particleSizeRange: '45–165 µm', d50: '~90 µm', dynamicBindingCapacity: '> 85 µmol cyanate ester/mL resin' }],
    specs: [
      { parameter: 'pH stability, CIP', value: '3–14' },
      { parameter: 'pH stability, operational', value: '4–13' },
      { parameter: 'Storage conditions', value: STORAGE },
    ],
    useCases: ['Immunoaffinity chromatography', 'Antibody and antigen immobilisation', 'Custom affinity resin development'],
    applications: ['research-academia', 'diagnostics'],
    packSizes: packs('BR', ['25 g', '100 g', '500 g', 'Bulk (custom)']),
    related: ['protein-a-agarose'],
  },
  {
    slug: 'protein-a-agarose',
    name: 'Protein A Agarose',
    subtitle: 'Antibody capture resin',
    category: 'affinity',
    status: 'made-to-order',
    order: 5,
    summary: 'Recombinant Protein A coupled to 4% agarose for one-step capture of IgG and monoclonal antibodies. Made to order.',
    description: rt(`Protein A Agarose carries the immunoglobulin-binding surface protein of *Staphylococcus aureus* coupled to 4% agarose via cyanogen bromide. It binds IgG (and IgM) efficiently for one-step purification of monoclonal antibodies. Manufactured to order; contact us for lead time and evaluation quantities.`),
    keyFeatures: ['One-step monoclonal antibody purification', 'Binds up to ~20 mg human IgG/mL resin', 'Cyanogen bromide coupling on 4% agarose'],
    chemistry: { ligand: 'Protein A', matrix: '4% spherical agarose', functionalType: 'Affinity' },
    grades: [{ grade: 'fast-flow', label: 'Protein A Agarose', particleSizeRange: '45–165 µm', d50: '~90 µm', dynamicBindingCapacity: 'Up to 20 mg human IgG/mL resin' }],
    specs: [
      { parameter: 'Ligand coupling method', value: 'Cyanogen bromide' },
      { parameter: 'pH stability, CIP', value: '3–14' },
      { parameter: 'Storage conditions', value: STORAGE },
    ],
    useCases: ['Monoclonal antibody capture', 'Immunoglobulin purification'],
    applications: ['biologics-biosimilars', 'diagnostics'],
    packSizes: [{ size: '5 mL' }, { size: '25 mL' }, { size: '100 mL' }, { size: 'Bulk (custom)' }],
    leadTime: 'On request',
    related: ['cnbr-activated-agarose', 'sp-agarose'],
  },

  // ---------------- SEC ----------------
  {
    slug: 'agarose-sec-resin',
    name: 'Agarose SEC Resin',
    subtitle: 'Cross-linked agarose for size exclusion and desalting',
    category: 'size-exclusion',
    featured: true,
    order: 1,
    image: '09_6pct-crosslinked-agarose.webp',
    summary: 'Cross-linked 2%, 4% and 6% agarose resins for high-resolution molecular-weight separation, aggregate analysis, desalting and buffer exchange. Validated calibration: R² = 0.9888 across 13–2000 kDa.',
    description: rt(`Protpure Agarose SEC Resin delivers high-resolution, size-dependent separation across a wide molecular-weight range. Larger molecules and extracellular vesicles elute first; smaller molecules that enter the pores elute later. Choose the agarose concentration to control the fractionation range and back-pressure.

## Two applications, one resin

- **Size exclusion chromatography** — molecular-weight estimation, aggregate/monomer analysis, purity assessment. A 50/600 column (40 cm bed, 785 mL) showed high efficiency with low HETP and a linear calibration (Kav vs log MW, R² = 0.9888) from ribonuclease A (13.7 kDa) to blue dextran (2000 kDa).
- **Desalting and buffer exchange** — protein elutes before salt with clear UV/conductivity separation and reproducible performance run after run (26/400 column, 16 cm bed, 85 mL).

Plain (non-cross-linked) 4% and 6% agarose are also available for gentle, low-pressure work.`),
    keyFeatures: ['High resolution with minimal peak overlap', 'Accurate MW estimation — excellent linearity (R² = 0.9888)', 'High efficiency, low HETP', 'Reproducible and reliable run after run', 'Cross-linked matrix with high physical and chemical stability'],
    chemistry: { ligand: 'None (molecular sieving)', matrix: 'Cross-linked agarose, 2%, 4% or 6%', functionalType: 'Size exclusion / desalting' },
    grades: [
      { grade: 'fast-flow', label: 'Agarose SEC (standard)', particleSizeRange: '45–165 µm', d50: '~90 µm', maxFlowVelocity: 'up to 700 cm/h (6%)', pressureFlow: '< 0.15 MPa, 20 cm bed' },
      { grade: 'precise', label: 'Agarose SEC Precise', particleSizeRange: '25–110 µm', d50: '~60 µm', maxFlowVelocity: 'up to 380 cm/h', pressureFlow: '< 0.12 MPa, 20 cm bed' },
      { grade: 'hr', label: 'Agarose SEC HR', particleSizeRange: '15–75 µm', d50: '~40 µm', maxFlowVelocity: 'up to 120 cm/h', pressureFlow: '< 0.1 MPa, 20 cm bed' },
    ],
    specs: [
      { parameter: 'Agarose concentrations', value: '2%, 4%, 6% cross-linked; 4%, 6% plain' },
      { parameter: 'Fractionation range (6%, cross-linked)', value: '~15–150 kDa globular proteins (working range in calibration)' },
      { parameter: 'Calibration linearity', value: 'Kav = −0.229 ln(MW) + 1.4306, R² = 0.9888' },
      { parameter: 'pH stability, CIP', value: '2–14' },
      { parameter: 'pH stability, operational', value: '2–12' },
      { parameter: 'Storage conditions', value: STORAGE },
    ],
    useCases: ['Molecular weight estimation', 'Aggregate / monomer analysis', 'Desalting and buffer exchange', 'Purity assessment and process development', 'QC and lot-release testing'],
    applications: ['biologics-biosimilars', 'research-academia', 'industrial-biotechnology'],
    packSizes: packs('AC', STANDARD_PACKS),
    documents: ['sec-precise-calibration-poster.pdf', 'protpure-product-brochure-2026-08.pdf'],
    related: ['phenyl-agarose', 'q-agarose'],
  },

  // ---------------- HIC ----------------
  {
    slug: 'phenyl-agarose',
    name: 'Phenyl Agarose',
    subtitle: 'Hydrophobic interaction chromatography resin',
    category: 'hydrophobic-interaction',
    featured: true,
    order: 1,
    image: '19_phenyl-agarose.webp',
    summary: 'High-performance HIC resin: phenyl ligands on 6% cross-linked spherical agarose, 25–30 mg BSA/mL dynamic binding capacity, 200–300 cm/h at < 0.1 MPa, operational pH 3–13.',
    description: rt(`Protpure Phenyl Agarose is a hydrophobic interaction chromatography resin based on a 6% cross-linked spherical agarose matrix with phenyl ligands. The resin is specified for protein and biomolecule purification applications requiring hydrophobic interaction selectivity, binding capacity, chemical stability and scalable flow performance.

Typical HIC purification shows high binding capacity and a sharp elution profile as the ammonium sulphate gradient decreases — an efficient orthogonal step after ion exchange or affinity capture.`),
    keyFeatures: ['Phenyl ligand for hydrophobic interaction selectivity', 'High BSA dynamic binding capacity', 'Robust chemical stability', 'Wide CIP and operational pH range', 'BioProcess-ready resin platform'],
    chemistry: { ligand: 'Phenyl (~20–25 µmol phenyl/mL resin)', matrix: '6% spherical cross-linked agarose', functionalType: 'Hydrophobic interaction (HIC)' },
    grades: [{ grade: 'precise', label: 'Phenyl Agarose', particleSizeRange: '45–105 µm', d50: '~65 µm', maxFlowVelocity: '200–300 cm/h at < 0.1 MPa', dynamicBindingCapacity: '25–30 mg BSA/mL', pressureFlow: '200–300 cm/h at < 0.1 MPa in an XK 50/60 column, 5 cm diameter, 25 cm bed, 20 °C' }],
    specs: [
      { parameter: 'BioProcess resin', value: 'Yes' },
      { parameter: 'Certificate of analysis', value: 'Yes' },
      { parameter: 'Ligand concentration', value: '~20–25 µmol phenyl/mL resin' },
      { parameter: 'pH stability, CIP', value: '2–14' },
      { parameter: 'pH stability, operational', value: '3–13' },
      { parameter: 'Chemical stability', value: 'Stable in 1.0 M NaOH, 3 M ammonium sulphate, 30% isopropanol, 70% ethanol, 10% ethylene glycol, 0.5% SDS, 6 M guanidine hydrochloride, 8 M urea' },
      { parameter: 'Storage conditions', value: STORAGE },
    ],
    useCases: ['Protein purification and intermediate polishing', 'Aggregate removal', 'Process development and scale-up', 'Orthogonal step after IEX or affinity capture'],
    applications: ['biologics-biosimilars', 'industrial-biotechnology', 'research-academia'],
    packSizes: packs('PH', STANDARD_PACKS),
    documents: ['protpure-product-brochure-2026-08.pdf'],
    related: ['hy-ionic-dp', 'agarose-sec-resin'],
  },

  // ---------------- Mixed-mode ----------------
  {
    slug: 'hy-ionic-dp',
    name: 'Hy-Ionic™ DP',
    subtitle: 'DEAE–phenyl mixed-mode chromatography resin',
    category: 'mixed-mode',
    featured: true,
    order: 1,
    summary: 'Mixed-mode agarose resin combining DEAE anion exchange and phenyl hydrophobic interaction on a single matrix — two independently addressable modes on one column for enhanced selectivity and process flexibility.',
    description: rt(`Hy-Ionic™ DP is a mixed-mode agarose chromatography resin combining DEAE and phenyl functionalities on a single matrix, providing complementary ionic and hydrophobic interaction modes for enhanced chromatographic selectivity and process flexibility.

## Two modes, one column

- **DEAE mode (anion exchange):** bind in 20 mM Tris, elute with 20 mM Tris + 1 M NaCl — DBC 100 mg BSA/mL resin (5 mg/mL BSA, 4 min residence time, 10% breakthrough).
- **Phenyl mode (hydrophobic interaction):** bind in 2 M ammonium sulphate, elute in 20 mM Tris — DBC 30 mg BSA/mL resin.

The same packed column (0.7 cm i.d. × 2.5 cm bed) stored in 0.1 M NaOH for 10 days retained its DBC in repeat experiments — chemically stable under prolonged alkaline exposure. Study continuing.`),
    keyFeatures: ['Dual functionality: DEAE and phenyl on the same agarose matrix', 'Two independently addressable interaction modes', 'High dynamic binding capacity in both modes', 'Retains performance after 10 days in 0.1 M NaOH', 'Mode switching on the same column without changing resin', 'Suitable for antibodies, proteins and other biotherapeutics'],
    chemistry: { ligand: 'DEAE + phenyl', matrix: 'Cross-linked agarose', functionalType: 'Mixed-mode (anion exchange / hydrophobic interaction)' },
    grades: [{ grade: 'fast-flow', label: 'Hy-Ionic DP', particleSizeRange: '~60–150 µm (typical)', dynamicBindingCapacity: 'DEAE mode 100 mg BSA/mL; phenyl mode 30 mg BSA/mL' }],
    specs: [
      { parameter: 'Application range', value: 'Capture, intermediate purification and polishing' },
      { parameter: 'pH stability, operational', value: '3–12 (typical)' },
      { parameter: 'Chemical stability', value: 'DBC retained after 10 days in 0.1 M NaOH (same packed column)' },
      { parameter: 'Storage conditions', value: '20% ethanol or as recommended' },
    ],
    useCases: ['Antibody and Fc-protein purification', 'Recombinant protein purification', 'Host cell protein (HCP) removal', 'Plasmid DNA purification', 'Biopharma process development'],
    applications: ['biologics-biosimilars', 'gene-editing-advanced-therapies', 'industrial-biotechnology'],
    packSizes: [{ size: '5 mL', catalogNumber: 'HY01' }, { size: '25 mL', catalogNumber: 'HY02' }, { size: '100 mL', catalogNumber: 'HY03' }, { size: '1 L', catalogNumber: 'HY04' }, { size: 'Custom packs' }],
    documents: ['protpure-product-brochure-2026-08.pdf'],
    related: ['deae-agarose', 'phenyl-agarose'],
  },

  // ---------------- Columns ----------------
  {
    slug: 'ni-nta-prepacked-columns',
    name: 'Ni-NTA Pre-packed Columns',
    subtitle: 'Ready-to-use FPLC columns, 1 mL to 20 mL',
    category: 'columns',
    featured: true,
    order: 1,
    image: 'fplc-prepacked-1ml-columns.webp',
    summary: 'Columns pre-packed with Protpure Ni-NTA Agarose for fast, reproducible His-tag purification on any FPLC or syringe. 1 mL, 5 mL, 10 mL and 20 mL; SP, Q and DEAE pre-packed columns on request.',
    description: rt(`Nickel immobilised on agarose beads in pre-filled columns for FPLC purification — ready to use, binding up to 40 mg of His-tagged recombinant protein per 1 mL of settled resin. Compatible with detergents and denaturing reagents.

Pre-packed columns save time, reduce set-up and give consistent performance and reproducibility for screening, tool-protein production and pilot work. Ion-exchange pre-packed columns (SP, Q, DEAE, 1 mL) are available for resin screening.`),
    keyFeatures: ['Consistent performance and reproducibility', 'Saves time and reduces set-up', 'Available in multiple sizes for lab and pilot use', 'Compatible with detergents and denaturants'],
    chemistry: { ligand: 'Ni²⁺-NTA', matrix: 'Ni-NTA Agarose (6% cross-linked)', functionalType: 'Pre-packed affinity column' },
    specs: [
      { parameter: 'Bed dimensions', value: '7 × 37 mm (1 mL); 12 × 40 mm (5 mL)' },
      { parameter: 'Bed height', value: '28 mm' },
      { parameter: 'Binding capacity', value: 'Up to 40 mg His-tagged protein per 1 mL' },
      { parameter: 'Sample preparation', value: 'Binding buffer with up to 40 mM imidazole' },
      { parameter: 'Flow rate', value: '< 4 mL/min (1 mL column)' },
      { parameter: 'Maximum pressure', value: 'Up to 70 psi (0.5 MPa)' },
      { parameter: 'Storage conditions', value: STORAGE },
    ],
    useCases: ['Recombinant protein purification', 'Protein expression screening', 'Antibody and fusion protein purification', 'Process development and scale-up', 'Research, biotech and biopharma workflows'],
    applications: ['research-academia', 'diagnostics'],
    packSizes: [
      { size: '1 mL × 5 columns', catalogNumber: 'LN01' },
      { size: '5 mL × 1 column', catalogNumber: 'LN05' },
      { size: '10 mL × 1 column', catalogNumber: 'LN10' },
      { size: '20 mL × 1 column', catalogNumber: 'LN20' },
    ],
    related: ['ni-nta-agarose', 'mr-agarose-kit'],
  },

  // ---------------- Kits ----------------
  {
    slug: 'mr-agarose-kit',
    name: 'MR Agarose Evaluation Kit',
    subtitle: 'Transition metal removal evaluation kit',
    category: 'kits',
    order: 1,
    image: 'mr-agarose-kit.webp',
    summary: 'Validated metal-removing resin for bioprocessing: a gravity column with 1 mL MR Agarose plus buffers to evaluate removal of Fe²⁺/Fe³⁺, Ni²⁺, Co²⁺, Cu²⁺ and Zn²⁺ — 15–18 µmol transition metal ions bound per mL.',
    description: rt(`ProtPure MR Agarose removes transition metal ions that leach from IMAC resins or enter from process streams. Metal binding performance was evaluated on an FPLC system with sequential injection of transition metal salts under controlled experimental conditions: dynamic capacity of 15–18 µmol transition metal ions per 1 mL of MR Agarose, validated for Fe²⁺, Fe³⁺, Ni²⁺, Co²⁺, Cu²⁺ and Zn²⁺.

## Kit contents

- Gravity column with 1 mL MR Agarose (1 pc)
- Wash buffer (30 mL)
- MR Buffer 1 (30 mL) and MR Buffer 2 (200 mL)
- Regeneration Buffer 1 (10 mL) and Regeneration Buffer 2 (200 mL)
- Storage buffer (10 mL)
- Reaction number: 10

## Five-step protocol

1. Sample — load 1 mL sample with metal concentration 10–15 µmol; incubate 5 min.
2. Washing — 3 mL wash buffer suitable to your sample, or 3 mL MR Buffer 1.
3. Metal removal — 3 mL MR Buffer 1, incubate 5 min, then 20 mL MR Buffer 2.
4. Regeneration — 1 mL Regeneration Buffer 1, then 20 mL Regeneration Buffer 2.
5. Storage — 1 mL storage buffer; store at 4–30 °C (up to 10 mL water wash before next use).

Regeneration efficiency depends on metal species, metal concentration and operating conditions.`),
    keyFeatures: ['Efficient removal of transition metal ions', 'High binding capacity and reproducibility', 'Easy-to-use protocol for evaluation', 'Ideal for rapid assessment and method development'],
    chemistry: { ligand: 'Metal-chelating', matrix: 'Cross-linked agarose', functionalType: 'Transition metal removal' },
    specs: [
      { parameter: 'Dynamic metal binding capacity', value: '15–18 µmol transition metal ions per 1 mL MR Agarose' },
      { parameter: 'Validated for', value: 'Fe²⁺, Fe³⁺, Ni²⁺, Co²⁺, Cu²⁺, Zn²⁺' },
      { parameter: 'Reactions per kit', value: '10' },
    ],
    useCases: ['Removal of leached nickel after IMAC', 'Metal clearance in bioprocess streams', 'Method development before bulk purchase'],
    applications: ['biologics-biosimilars', 'research-academia', 'industrial-biotechnology'],
    packSizes: [{ size: 'Evaluation kit (10 reactions)', catalogNumber: 'MRK01' }, { size: 'MR Agarose bulk resin', catalogNumber: 'MR01' }],
    documents: ['protpure-product-brochure-2026-08.pdf'],
    related: ['ni-nta-agarose', 'ni-nta-prepacked-columns'],
  },

  // ---------------- Magnetic ----------------
  {
    slug: 'ni-nta-magnetic-agarose',
    name: 'Ni-NTA Magnetic Agarose',
    subtitle: 'Magnetic beads for batch His-tag screening',
    category: 'magnetic',
    order: 1,
    image: '20_ni-nta-magnetic-agarose.webp',
    summary: 'Ni-NTA magnetic agarose beads for fast, column-free screening of His-tagged protein expression from small culture volumes — pull down with a magnet, wash, elute.',
    description: rt(`Ni-NTA Magnetic Agarose provides fast screening of His-tagged recombinant proteins from various sources. The magnetic bead-based agarose matrix has affinity towards the histidine tag, and the tagged protein can be easily separated from the mixture by placing the tube in a magnetic stand.

- Purification of His-tagged recombinant protein without a column
- Separation on a magnetic stand in minutes
- The protein can be directly used for downstream analysis
- Suitable for high-throughput screening of expression constructs`),
    keyFeatures: ['Column-free His-tag purification', 'Separation in minutes on a magnetic stand', 'Suited to high-throughput expression screening'],
    chemistry: { ligand: 'Ni²⁺-NTA', matrix: 'Magnetic agarose beads', functionalType: 'Magnetic affinity beads' },
    specs: [
      { parameter: 'Format', value: 'Magnetic agarose beads, 25% slurry' },
      { parameter: 'Storage conditions', value: STORAGE },
    ],
    useCases: ['Expression screening', 'Small-scale His-tag pull-downs', 'Sample preparation for analytics'],
    applications: ['research-academia', 'diagnostics'],
    packSizes: [{ size: '1 mL', catalogNumber: 'MG01' }, { size: '5 mL', catalogNumber: 'MG02' }, { size: '10 mL', catalogNumber: 'MG03' }],
    related: ['ni-nta-agarose', 'ni-nta-prepacked-columns'],
  },
]
