import type { CollectionConfig } from 'payload'
import { editors, publishedOrEditor } from '@/access'
import { slugField } from '@/fields/slug'
import { linkField } from '@/fields/link'
import { pageBlocks } from '@/blocks/config'
import { revalidateAll, revalidateAllDelete } from '@/hooks/revalidate'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    livePreview: {
      url: ({ data }) => `${process.env.NEXT_PUBLIC_SERVER_URL}/next/preview?collection=pages&slug=${data?.slug}`,
    },
    preview: (data) => `${process.env.NEXT_PUBLIC_SERVER_URL}/next/preview?collection=pages&slug=${data?.slug}`,
    description:
      'Build pages from blocks. Special slugs: "home" is the homepage; "products", "applications", "services", "resources", "blog", "updates", "contact", "request-quote", "faq" provide the intro for those listing pages.',
  },
  versions: { drafts: { autosave: { interval: 800 } }, maxPerDoc: 30 },
  access: { read: publishedOrEditor, create: editors, update: editors, delete: editors, readVersions: editors },
  hooks: { afterChange: [revalidateAll], afterDelete: [revalidateAllDelete] },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                {
                  name: 'style',
                  type: 'select',
                  defaultValue: 'standard',
                  options: [
                    { label: 'Standard (dark, with image)', value: 'standard' },
                    { label: 'Schematic (light, with the bead cross-section drawing)', value: 'schematic' },
                    { label: 'Compact (title + intro)', value: 'compact' },
                    { label: 'None', value: 'none' },
                  ],
                },
                { name: 'eyebrow', type: 'text', admin: { condition: (_, s) => s?.style !== 'none' } },
                { name: 'heading', type: 'textarea', admin: { rows: 2, condition: (_, s) => s?.style !== 'none', description: 'Defaults to the page title. Line breaks are kept.' } },
                { name: 'highlight', type: 'text', admin: { condition: (_, s) => s?.style === 'standard' || s?.style === 'schematic', description: 'Optional: words from the heading to colour in the accent shade.' } },
                { name: 'text', type: 'textarea', admin: { condition: (_, s) => s?.style !== 'none' } },
                { name: 'image', type: 'upload', relationTo: 'media', admin: { condition: (_, s) => s?.style === 'standard' } },
                {
                  type: 'row',
                  admin: { condition: (_, s) => s?.style === 'standard' || s?.style === 'schematic' },
                  fields: [
                    { name: 'imageMarker', type: 'text', admin: { width: '50%', description: 'Standard: medallion on the photo, e.g. "BPG 200". Schematic: label above the drawing, e.g. "Particle architecture".' } },
                    { name: 'imageMarkerNote', type: 'text', admin: { width: '50%', description: 'Standard: small line in the medallion, e.g. "Client deployment". Schematic: right-hand label, e.g. "Fig. 01 / Schematic".' } },
                  ],
                },
                {
                  type: 'row',
                  admin: { condition: (_, s) => s?.style === 'standard' || s?.style === 'schematic' },
                  fields: [
                    { name: 'imageCaption', type: 'text', admin: { width: '60%', description: 'Caption under the photo or drawing, e.g. "Ni-NTA Agarose in a process column".' } },
                    { name: 'imageCaptionNote', type: 'text', admin: { width: '40%', description: 'Right-hand caption, e.g. "At a client site".' } },
                  ],
                },
                { name: 'links', type: 'array', maxRows: 2, fields: [linkField({ appearance: true })], admin: { condition: (_, s) => s?.style !== 'none' } },
                {
                  name: 'badges',
                  type: 'array',
                  maxRows: 4,
                  fields: [{ name: 'text', type: 'text', required: true }],
                  admin: { condition: (_, s) => s?.style === 'standard', description: 'Small pills under the buttons, e.g. "BioProcess grade".' },
                },
              ],
            },
          ],
        },
        {
          label: 'Content',
          fields: [{ name: 'layout', type: 'blocks', blocks: pageBlocks }],
        },
      ],
    },
    slugField('title'),
  ],
}
