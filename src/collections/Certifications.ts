import type { CollectionConfig } from 'payload'
import { anyone, editors } from '@/access'
import { revalidateAll, revalidateAllDelete } from '@/hooks/revalidate'

export const CERTIFICATION_KINDS = [
  { label: 'Quality system (e.g. ISO 9001)', value: 'quality-system' },
  { label: 'Product claim (e.g. CoA with every lot)', value: 'product-claim' },
  { label: 'Regulatory (licence, registration)', value: 'regulatory' },
  { label: 'Membership / association', value: 'membership' },
  { label: 'Award / recognition', value: 'award' },
] as const

export type CertificationKind = (typeof CERTIFICATION_KINDS)[number]['value']

/**
 * Certifications, registrations and quality claims. Product claims are statements Protpure makes
 * about its resins; the other kinds are issued by a third party and should carry an issuer and,
 * where possible, the certificate PDF (Content → Documents, type "Certificate").
 */
export const Certifications: CollectionConfig = {
  slug: 'certifications',
  labels: { singular: 'Certification / claim', plural: 'Certifications & claims' },
  admin: {
    useAsTitle: 'name',
    group: 'Company',
    defaultColumns: ['name', 'kind', 'issuer', 'validUntil', 'order'],
    description: 'Certifications, registrations and quality claims shown in the certifications strip and given to AI assistants. Upload the certificate PDF under Content → Documents and link it here.',
  },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  hooks: { afterChange: [revalidateAll], afterDelete: [revalidateAllDelete] },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'e.g. "ISO 9001:2015" or "Certificate of analysis with every lot".' } },
    {
      type: 'row',
      fields: [
        { name: 'kind', type: 'select', required: true, defaultValue: 'product-claim', options: [...CERTIFICATION_KINDS], admin: { width: '50%' } },
        { name: 'issuer', type: 'text', admin: { width: '50%', description: 'Certifying body or authority. Leave empty for Protpure’s own claims.' } },
      ],
    },
    { name: 'statement', type: 'text', admin: { description: 'One sentence explaining what this means for a buyer.' } },
    { name: 'validUntil', type: 'date', admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' }, description: 'Expiry date of the certificate, if any.' } },
    { name: 'document', type: 'relationship', relationTo: 'documents', admin: { description: 'The certificate PDF (Content → Documents).' } },
    { name: 'logo', type: 'upload', relationTo: 'media', admin: { description: 'Badge or issuer logo (optional).' } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
