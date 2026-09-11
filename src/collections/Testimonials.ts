import type { CollectionConfig } from 'payload'
import { anyone, editors } from '@/access'
import { revalidateAll, revalidateAllDelete } from '@/hooks/revalidate'

export const TESTIMONIAL_CONTEXTS = [
  { label: 'Evaluation / qualification', value: 'evaluation' },
  { label: 'Production use', value: 'production' },
  { label: 'Research', value: 'research' },
  { label: 'Distributor', value: 'distributor' },
] as const

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'organization',
    group: 'Company',
    defaultColumns: ['organization', 'person', 'context', 'consentOnFile', 'featured'],
    description: 'Customer quotes and logos. Only publish with written permission from the customer — tick "Consent on file" once you have it.',
  },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  hooks: { afterChange: [revalidateAll], afterDelete: [revalidateAllDelete] },
  defaultSort: 'order',
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'person', type: 'text', admin: { width: '50%' } },
        { name: 'role', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'organization', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'country', type: 'text', admin: { width: '50%' } },
      ],
    },
    { name: 'context', type: 'select', options: [...TESTIMONIAL_CONTEXTS], admin: { description: 'How the customer uses Protpure resins. Shown as a small label on the quote.' } },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'products', type: 'relationship', relationTo: 'products', hasMany: true },
    {
      name: 'consentOnFile',
      type: 'checkbox',
      defaultValue: false,
      label: 'Consent on file',
      admin: { position: 'sidebar', description: 'Only publish with written permission. Internal note — not shown on the site.' },
    },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
