import type { CollectionConfig } from 'payload'
import { anyone, editors } from '@/access'
import { revalidateAll, revalidateAllDelete } from '@/hooks/revalidate'

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

export const Updates: CollectionConfig = {
  slug: 'updates',
  labels: { singular: 'LinkedIn update', plural: 'LinkedIn updates' },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'publishedAt', 'pinned'],
    description:
      'Paste the URL of a public LinkedIn post. The site embeds it automatically and shows your summary as a fallback for readers without LinkedIn.',
  },
  access: { read: anyone, create: editors, update: editors, delete: editors },
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
    { name: 'url', type: 'text', required: true, label: 'LinkedIn post URL' },
    { name: 'urn', type: 'text', admin: { description: 'Auto-filled from the URL. Only edit if the embed does not load.' } },
    { name: 'summary', type: 'textarea', required: true, admin: { description: 'Two or three sentences. Shown as the card text and used by AI assistants.' } },
    { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Optional: the post image, so the card looks good without loading LinkedIn.' } },
    { name: 'relatedProducts', type: 'relationship', relationTo: 'products', hasMany: true },
    { name: 'publishedAt', type: 'date', required: true, defaultValue: () => new Date().toISOString(), admin: { position: 'sidebar' } },
    { name: 'pinned', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
