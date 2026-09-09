import type { CollectionConfig } from 'payload'
import { editors, publishedOrEditor } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateAll, revalidateAllDelete } from '@/hooks/revalidate'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Blog post', plural: 'Blog posts' },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'author', 'publishedAt', '_status'],
    livePreview: {
      url: ({ data }) => `${process.env.NEXT_PUBLIC_SERVER_URL}/next/preview?collection=posts&slug=${data?.slug}`,
    },
    preview: (data) => `${process.env.NEXT_PUBLIC_SERVER_URL}/next/preview?collection=posts&slug=${data?.slug}`,
  },
  versions: { drafts: { autosave: { interval: 800 } }, maxPerDoc: 20 },
  access: { read: publishedOrEditor, create: editors, update: editors, delete: editors, readVersions: editors },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' || operation === 'update') {
          if (data._status === 'published' && !data.publishedAt) data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
    afterChange: [revalidateAll],
    afterDelete: [revalidateAllDelete],
  },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    { name: 'excerpt', type: 'textarea', required: true, admin: { description: 'Shown in listings, social previews and the RSS feed.' } },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText', required: true },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Chromatography science', value: 'science' },
        { label: 'Application note', value: 'application-note' },
        { label: 'Case study', value: 'case-study' },
        { label: 'Company news', value: 'news' },
        { label: 'Events', value: 'events' },
        { label: 'Manufacturing in India', value: 'india' },
      ],
    },
    { name: 'relatedProducts', type: 'relationship', relationTo: 'products', hasMany: true },
    { name: 'author', type: 'relationship', relationTo: 'team', admin: { position: 'sidebar' } },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } } },
  ],
}
