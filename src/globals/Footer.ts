import type { GlobalConfig } from 'payload'
import { anyone, editors } from '@/access'
import { linkField } from '@/fields/link'
import { revalidateGlobal } from '@/hooks/revalidate'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: { group: 'Settings' },
  access: { read: anyone, update: editors },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: 'tagline', type: 'textarea', admin: { description: 'Short text under the logo.' } },
    {
      name: 'columns',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'links', type: 'array', fields: [linkField()] },
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Notes from the bench' },
        { name: 'text', type: 'text', defaultValue: 'Product updates, data and technical notes.', admin: { description: 'Label above the email field.' } },
        { name: 'note', type: 'textarea', admin: { description: 'Consent line under the field.' } },
      ],
    },
    { name: 'legalLinks', type: 'array', fields: [linkField()] },
    { name: 'bottomText', type: 'text', admin: { description: 'e.g. Registered in India · CIN …' } },
  ],
}
