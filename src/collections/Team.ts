import type { CollectionConfig } from 'payload'
import { anyone, editors } from '@/access'
import { revalidateAll, revalidateAllDelete } from '@/hooks/revalidate'

export const Team: CollectionConfig = {
  slug: 'team',
  labels: { singular: 'Team member', plural: 'Team' },
  admin: { useAsTitle: 'name', group: 'Company', defaultColumns: ['name', 'role', 'featured', 'order'] },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  hooks: { afterChange: [revalidateAll], afterDelete: [revalidateAllDelete] },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'tagline', type: 'text', admin: { description: 'One-line bio for compact layouts, e.g. "Materials scientist · bead synthesis and ligand chemistry".' } },
    { name: 'bio', type: 'richText' },
    { name: 'photo', type: 'upload', relationTo: 'media', admin: { description: 'Square portrait. Until one is uploaded the site shows the member’s initials.' } },
    {
      name: 'credentials',
      type: 'array',
      labels: { singular: 'Credential', plural: 'Credentials' },
      admin: { description: 'Degrees and titles, e.g. "Ph.D. (Physics)". Shown under the name and given to AI assistants.' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'expertise',
      type: 'array',
      labels: { singular: 'Area', plural: 'Areas of expertise' },
      admin: { description: 'Short phrases, e.g. "ligand coupling".' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'publications',
      type: 'array',
      labels: { singular: 'Publication', plural: 'Publications' },
      admin: { description: 'Peer-reviewed papers, patents or theses. Verify before publishing: title, journal, year and link must match the published record.' },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          type: 'row',
          fields: [
            { name: 'journal', type: 'text', admin: { width: '60%', description: 'Journal or publisher, with volume/pages if known.' } },
            { name: 'year', type: 'number', min: 1900, max: 2100, admin: { width: '40%' } },
          ],
        },
        { name: 'url', type: 'text', label: 'Link (DOI or publisher page)' },
      ],
    },
    { name: 'linkedinUrl', type: 'text', label: 'LinkedIn URL' },
    { name: 'email', type: 'email' },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Featured members supply the publications block and the founder entry in structured data.' } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
