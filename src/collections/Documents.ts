import type { CollectionConfig } from 'payload'
import path from 'path'
import { anyone, editors } from '@/access'
import { revalidateAll, revalidateAllDelete } from '@/hooks/revalidate'

export const DOCUMENT_TYPES = [
  { label: 'Technical datasheet', value: 'datasheet' },
  { label: 'Brochure', value: 'brochure' },
  { label: 'Product catalog', value: 'catalog' },
  { label: 'Case study', value: 'case-study' },
  { label: 'Application note', value: 'application-note' },
  { label: 'Performance data', value: 'performance-data' },
  { label: 'Poster', value: 'poster' },
  { label: 'Presentation', value: 'presentation' },
  { label: 'Certificate / quality document', value: 'certificate' },
  { label: 'Other', value: 'other' },
] as const

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'type', 'products', 'updatedAt'],
    description: 'PDF downloads: datasheets, brochures, case studies. Link them to products so they appear on product pages.',
  },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  hooks: { afterChange: [revalidateAll], afterDelete: [revalidateAllDelete] },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'type', type: 'select', required: true, options: [...DOCUMENT_TYPES], admin: { width: '50%' } },
        { name: 'documentDate', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' } }, label: 'Document date / revision' },
      ],
    },
    { name: 'revision', type: 'text', admin: { description: 'e.g. Rev 1.0' } },
    { name: 'summary', type: 'textarea', admin: { description: 'One or two sentences shown in the resource library and used by AI assistants.' } },
    { name: 'products', type: 'relationship', relationTo: 'products', hasMany: true },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
  upload: {
    staticDir: path.resolve(process.cwd(), 'media/documents'),
    mimeTypes: ['application/pdf'],
  },
}
