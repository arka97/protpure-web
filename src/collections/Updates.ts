import type { CollectionConfig } from 'payload'
import { editors, publishedOrEditor } from '@/access'
import { revalidateAll, revalidateAllDelete } from '@/hooks/revalidate'

export const UPDATE_KINDS = [
  { label: 'Product launch', value: 'product-launch' },
  { label: 'Data / performance', value: 'data' },
  { label: 'Milestone', value: 'milestone' },
  { label: 'Services', value: 'services' },
  { label: 'Perspective', value: 'perspective' },
] as const

export type UpdateKind = (typeof UPDATE_KINDS)[number]['value']

/**
 * Extracts the activity/share id from a public LinkedIn post URL.
 * Accepts:
 *   https://www.linkedin.com/posts/protpure-tech-pvt-ltd_xxx-activity-7300000000000000000-abcd
 *   https://www.linkedin.com/feed/update/urn:li:activity:7300000000000000000/
 *   https://www.linkedin.com/feed/update/urn:li:share:7300000000000000000
 */
export function linkedInUrn(url: string): string | null {
  const activity = url.match(/activity[-:](\d{15,})/)
  if (activity) return `urn:li:activity:${activity[1]}`
  const share = url.match(/urn:li:share:(\d{15,})/)
  if (share) return `urn:li:share:${share[1]}`
  const ugc = url.match(/urn:li:ugcPost:(\d{15,})/)
  if (ugc) return `urn:li:ugcPost:${ugc[1]}`
  return null
}

/**
 * LinkedIn updates. Drafts are enabled so summaries can be prepared ahead of the post (the seed
 * ships five drafts without a URL); only published updates reach the site, the Markdown/JSON
 * surfaces and the MCP server (see `getUpdates` in src/lib/data.ts).
 */
export const Updates: CollectionConfig = {
  slug: 'updates',
  labels: { singular: 'LinkedIn update', plural: 'LinkedIn updates' },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'kind', 'publishedAt', '_status', 'pinned'],
    description:
      'Paste the URL of a public LinkedIn post. The site embeds it automatically and shows your summary as a fallback for readers without LinkedIn. Drafts are hidden from the site until you publish.',
  },
  versions: { drafts: true, maxPerDoc: 10 },
  access: { read: publishedOrEditor, create: editors, update: editors, delete: editors, readVersions: editors },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.url && !data.urn) data.urn = linkedInUrn(data.url)
        return data
      },
    ],
    afterChange: [revalidateAll],
    afterDelete: [revalidateAllDelete],
  },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true, admin: { description: 'Short headline for the update.' } },
    { name: 'url', type: 'text', required: true, label: 'LinkedIn post URL', admin: { description: 'Required to publish. Drafts can be saved without it.' } },
    { name: 'urn', type: 'text', admin: { description: 'Auto-filled from the URL. Only edit if the embed does not load.' } },
    { name: 'summary', type: 'textarea', required: true, admin: { description: 'Two or three sentences. Shown as the card text and used by AI assistants.' } },
    { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Optional: the post image, so the card looks good without loading LinkedIn.' } },
    { name: 'relatedProducts', type: 'relationship', relationTo: 'products', hasMany: true },
    { name: 'kind', type: 'select', options: [...UPDATE_KINDS], admin: { position: 'sidebar', description: 'Lets page blocks show only one type of update, e.g. product launches.' } },
    { name: 'publishedAt', type: 'date', required: true, defaultValue: () => new Date().toISOString(), admin: { position: 'sidebar' } },
    { name: 'pinned', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Pinned updates are listed first.' } },
  ],
}
