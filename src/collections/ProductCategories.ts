import type { CollectionConfig } from 'payload'
import { anyone, editors } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateAll, revalidateAllDelete } from '@/hooks/revalidate'

export const CATEGORY_ICONS = [
  { label: 'Ion exchange (± charges)', value: 'ion-exchange' },
  { label: 'Affinity (metal / ligand)', value: 'affinity' },
  { label: 'Size exclusion (sieve)', value: 'sec' },
  { label: 'Hydrophobic interaction', value: 'hic' },
  { label: 'Mixed-mode', value: 'mixed-mode' },
  { label: 'Activated / coupling', value: 'activated' },
  { label: 'Pre-packed column', value: 'column' },
  { label: 'Kit', value: 'kit' },
  { label: 'Magnetic beads', value: 'magnetic' },
] as const

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  labels: { singular: 'Product category', plural: 'Product categories' },
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    defaultColumns: ['name', 'order', 'updatedAt'],
    description: 'Chromatography modes and product families. Order controls the sequence on the site.',
  },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  hooks: { afterChange: [revalidateAll], afterDelete: [revalidateAllDelete] },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    { name: 'shortName', type: 'text', admin: { description: 'Used in tight spaces, e.g. "IEX", "IMAC".' } },
    { name: 'tagline', type: 'text', admin: { description: 'One line under the category name, e.g. "Capture, intermediate and polishing".' } },
    { name: 'description', type: 'richText' },
    {
      type: 'row',
      fields: [
        { name: 'icon', type: 'select', options: [...CATEGORY_ICONS], admin: { width: '50%' } },
        { name: 'order', type: 'number', defaultValue: 0, admin: { width: '50%', position: 'sidebar' } },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'mode',
      type: 'select',
      admin: { description: 'The purification mode this category belongs to; used for filters and structured data.' },
      options: [
        { label: 'Ion exchange', value: 'ion-exchange' },
        { label: 'Affinity', value: 'affinity' },
        { label: 'Size exclusion', value: 'size-exclusion' },
        { label: 'Hydrophobic interaction', value: 'hydrophobic-interaction' },
        { label: 'Mixed-mode', value: 'mixed-mode' },
        { label: 'Columns & formats', value: 'formats' },
        { label: 'Kits & tools', value: 'kits' },
      ],
    },
  ],
}
