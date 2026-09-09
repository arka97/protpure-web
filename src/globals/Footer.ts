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
    { name: 'legalLinks', type: 'array', fields: [linkField()] },
    { name: 'bottomText', type: 'text', admin: { description: 'e.g. Registered in India · CIN …' } },
  ],
}
