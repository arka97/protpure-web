import type { CollectionConfig } from 'payload'
import { anyone, editors } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateAll, revalidateAllDelete } from '@/hooks/revalidate'

export const Applications: CollectionConfig = {
  slug: 'applications',
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    defaultColumns: ['name', 'order', 'updatedAt'],
    description: 'Industries and workflows Protpure serves (biologics, vaccines, diagnostics…). Each gets a landing page.',
  },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  hooks: { afterChange: [revalidateAll], afterDelete: [revalidateAllDelete] },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    { name: 'summary', type: 'textarea', required: true },
    { name: 'description', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'workflows',
      type: 'array',
      labels: { singular: 'Workflow example', plural: 'Workflow examples' },
      admin: { description: 'Short bullets, e.g. "Recombinant proteins", "Monoclonal antibodies".' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'recommendedProducts', type: 'relationship', relationTo: 'products', hasMany: true },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
