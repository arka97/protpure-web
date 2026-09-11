import type { CollectionConfig } from 'payload'
import { anyone, editors } from '@/access'
import { revalidateAll, revalidateAllDelete } from '@/hooks/revalidate'

export const CUSTOMER_SECTORS = [
  { label: 'Biopharma', value: 'biopharma' },
  { label: 'Vaccines', value: 'vaccines' },
  { label: 'Diagnostics', value: 'diagnostics' },
  { label: 'CDMO', value: 'cdmo' },
  { label: 'Research / academia', value: 'research' },
  { label: 'Distributor', value: 'distributor' },
] as const

/**
 * Customer references for the logo wall. A customer only appears on the site when "Show logo" is
 * ticked and a logo is uploaded; otherwise the anonymised label can be used in copy ("an Indian
 * vaccine manufacturer"). Nothing is seeded — add real customers with their permission.
 */
export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: { singular: 'Customer', plural: 'Customers' },
  admin: {
    useAsTitle: 'name',
    group: 'Sales',
    defaultColumns: ['name', 'sector', 'country', 'showLogo', 'order'],
    description: 'Customer references for the logo wall. Only tick "Show logo" with the customer’s permission.',
  },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  hooks: { afterChange: [revalidateAll], afterDelete: [revalidateAllDelete] },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media', admin: { description: 'Transparent PNG or SVG, ideally wider than tall.' } },
    { name: 'website', type: 'text' },
    {
      type: 'row',
      fields: [
        { name: 'sector', type: 'select', options: [...CUSTOMER_SECTORS], admin: { width: '50%' } },
        { name: 'country', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      name: 'anonymisedLabel',
      type: 'text',
      label: 'Anonymised label',
      admin: { description: 'How to refer to this customer without naming them, e.g. "Indian vaccine manufacturer". Used when the logo cannot be shown.' },
    },
    { name: 'showLogo', type: 'checkbox', defaultValue: false, label: 'Show logo on the site', admin: { position: 'sidebar', description: 'Requires the customer’s permission and an uploaded logo.' } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
