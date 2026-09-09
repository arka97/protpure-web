import type { CollectionConfig } from 'payload'
import { anyone, editors } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateAll, revalidateAllDelete } from '@/hooks/revalidate'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    defaultColumns: ['name', 'order', 'updatedAt'],
    description: 'Downstream bioprocessing services (column packing, resin screening, method development, purification service).',
  },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  hooks: { afterChange: [revalidateAll], afterDelete: [revalidateAllDelete] },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    { name: 'tagline', type: 'text' },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'description', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'deliverables',
      type: 'array',
      labels: { singular: 'Deliverable', plural: 'What you receive' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'idealFor',
      type: 'array',
      labels: { singular: 'Audience', plural: 'Ideal for' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
