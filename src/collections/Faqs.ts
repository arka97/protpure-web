import type { CollectionConfig } from 'payload'
import { anyone, editors } from '@/access'
import { revalidateAll, revalidateAllDelete } from '@/hooks/revalidate'

export const FAQ_CATEGORIES = [
  { label: 'Products & specifications', value: 'products' },
  { label: 'Ordering & pricing', value: 'ordering' },
  { label: 'Shipping & export', value: 'shipping' },
  { label: 'Quality & documentation', value: 'quality' },
  { label: 'Technical support', value: 'technical' },
] as const

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: { useAsTitle: 'question', group: 'Content', defaultColumns: ['question', 'category', 'order'] },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  hooks: { afterChange: [revalidateAll], afterDelete: [revalidateAllDelete] },
  defaultSort: 'order',
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'richText', required: true },
    {
      type: 'row',
      fields: [
        { name: 'category', type: 'select', options: [...FAQ_CATEGORIES], required: true, admin: { width: '50%' } },
        { name: 'order', type: 'number', defaultValue: 0, admin: { width: '50%' } },
      ],
    },
    { name: 'products', type: 'relationship', relationTo: 'products', hasMany: true, admin: { description: 'Show this FAQ on these product pages.' } },
  ],
}
