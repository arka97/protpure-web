import type { CollectionConfig } from 'payload'
import { editors, publishedOrEditor } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateAll, revalidateAllDelete } from '@/hooks/revalidate'
import { EVALUATION_NOTE_DEFAULT } from '@/lib/rfq'

export const PRODUCT_STATUS = [
  { label: 'Available', value: 'available' },
  { label: 'Made to order', value: 'made-to-order' },
  { label: 'In development', value: 'in-development' },
] as const

export const GRADE_OPTIONS = [
  { label: 'Faster (high throughput)', value: 'faster' },
  { label: 'Fast Flow / Standard', value: 'fast-flow' },
  { label: 'Precise (high resolution)', value: 'precise' },
  { label: 'HR (gentle elution)', value: 'hr' },
] as const

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    defaultColumns: ['name', 'category', 'availability', '_status', 'updatedAt'],
    livePreview: {
      url: ({ data }) => `${process.env.NEXT_PUBLIC_SERVER_URL}/next/preview?collection=products&slug=${data?.slug}`,
    },
    preview: (data) => `${process.env.NEXT_PUBLIC_SERVER_URL}/next/preview?collection=products&slug=${data?.slug}`,
    description: 'One entry per product family (e.g. "SP Agarose"). Add grades, specifications, pack sizes and documents.',
  },
  versions: { drafts: { autosave: { interval: 800 } }, maxPerDoc: 20 },
  access: { read: publishedOrEditor, create: editors, update: editors, delete: editors, readVersions: editors },
  hooks: { afterChange: [revalidateAll], afterDelete: [revalidateAllDelete] },
  defaultSort: 'order',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'subtitle', type: 'text', admin: { description: 'e.g. "Strong cation exchanger" or "Transition metal removal evaluation kit"' } },
            {
              type: 'row',
              fields: [
                { name: 'category', type: 'relationship', relationTo: 'product-categories', required: true, admin: { width: '50%' } },
                { name: 'availability', type: 'select', options: [...PRODUCT_STATUS], defaultValue: 'available', required: true, admin: { width: '50%' } },
              ],
            },
            { name: 'summary', type: 'textarea', required: true, admin: { description: 'Two to three sentences. Shown on cards, search results and given to AI assistants.' } },
            { name: 'description', type: 'richText', admin: { description: 'Full product overview.' } },
            { name: 'keyFeatures', type: 'array', labels: { singular: 'Feature', plural: 'Key features' }, fields: [{ name: 'text', type: 'text', required: true }] },
            { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Main product image.' } },
            { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
          ],
        },
        {
          label: 'Specifications',
          fields: [
            {
              name: 'chemistry',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'ligand', type: 'text', admin: { width: '33%' } },
                    { name: 'matrix', type: 'text', defaultValue: '6% spherical cross-linked agarose', admin: { width: '33%' } },
                    { name: 'functionalType', type: 'text', label: 'Functional type', admin: { width: '33%', description: 'e.g. Strong cation exchanger, IMAC, HIC' } },
                  ],
                },
              ],
            },
            {
              name: 'grades',
              type: 'array',
              labels: { singular: 'Grade', plural: 'Grades' },
              admin: { description: 'Particle-size grades this product ships in. Each grade gets its own column on the comparison table.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'grade', type: 'select', options: [...GRADE_OPTIONS], required: true, admin: { width: '34%' } },
                    { name: 'label', type: 'text', admin: { width: '33%', description: 'Display name, e.g. "SP Agarose Fast Flow"' } },
                    { name: 'particleSizeRange', type: 'text', admin: { width: '33%', description: 'e.g. 45–165 µm' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'd50', type: 'text', label: 'Particle size d50V', admin: { width: '33%', description: 'e.g. ~90 µm' } },
                    { name: 'maxFlowVelocity', type: 'text', label: 'Max linear flow velocity', admin: { width: '33%', description: 'e.g. 700 cm/h' } },
                    { name: 'dynamicBindingCapacity', type: 'text', label: 'Dynamic binding capacity', admin: { width: '33%', description: 'e.g. ≥100 mg lysozyme/mL' } },
                  ],
                },
                { name: 'pressureFlow', type: 'text', label: 'Pressure / flow specification', admin: { description: 'e.g. 250–450 cm/h, 0.1 MPa, 15 cm bed height' } },
              ],
            },
            {
              name: 'specs',
              type: 'array',
              labels: { singular: 'Specification', plural: 'Specifications' },
              admin: { description: 'Shared parameters (ionic capacity, pH stability, chemical stability, storage…). Optionally add the typical market specification for benchmarking.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'parameter', type: 'text', required: true, admin: { width: '30%' } },
                    { name: 'value', type: 'text', required: true, admin: { width: '40%' } },
                    { name: 'marketSpec', type: 'text', label: 'Typical market spec', admin: { width: '30%' } },
                  ],
                },
              ],
            },
            {
              name: 'applications',
              type: 'relationship',
              relationTo: 'applications',
              hasMany: true,
            },
            {
              name: 'useCases',
              type: 'array',
              labels: { singular: 'Use case', plural: 'Typical use cases' },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'Ordering',
          fields: [
            {
              name: 'packSizes',
              type: 'array',
              labels: { singular: 'Pack size', plural: 'Pack sizes' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'size', type: 'text', required: true, admin: { width: '40%', description: 'e.g. 100 mL, 1 L, 10 L' } },
                    { name: 'catalogNumber', type: 'text', admin: { width: '40%' } },
                    { name: 'grade', type: 'select', options: [...GRADE_OPTIONS], admin: { width: '20%' } },
                  ],
                },
              ],
            },
            { name: 'leadTime', type: 'text', defaultValue: '2–3 weeks ex-works', admin: { description: 'Shown on the product page next to the quote button.' } },
            { name: 'bulkAvailable', type: 'checkbox', defaultValue: true, label: 'Bulk / custom volumes available' },
            {
              name: 'evaluationNote',
              type: 'textarea',
              label: 'Evaluation packs note',
              defaultValue: EVALUATION_NOTE_DEFAULT,
              admin: { description: 'Copy for the "Paid evaluation packs — qualify before you scale" callout under the ordering table. State the pack sizes and how the cost is credited; evaluation packs are paid, never free samples.' },
            },
            { name: 'documents', type: 'relationship', relationTo: 'documents', hasMany: true, admin: { description: 'Datasheets and other PDFs for this product.' } },
            { name: 'relatedProducts', type: 'relationship', relationTo: 'products', hasMany: true, filterOptions: ({ id }) => ({ id: { not_equals: id } }) },
          ],
        },
      ],
    },
    slugField('name'),
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Show on the homepage.' } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar', description: 'Sort order within its category.' } },
  ],
}
