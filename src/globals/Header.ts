import type { GlobalConfig } from 'payload'
import { anyone, editors } from '@/access'
import { linkField } from '@/fields/link'
import { revalidateGlobal } from '@/hooks/revalidate'

export const Header: GlobalConfig = {
  slug: 'header',
  admin: { group: 'Settings' },
  access: { read: anyone, update: editors },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Menu item', plural: 'Menu items' },
      maxRows: 7,
      fields: [
        linkField(),
        {
          name: 'children',
          type: 'array',
          labels: { singular: 'Sub-item', plural: 'Dropdown items' },
          fields: [linkField(), { name: 'description', type: 'text' }],
        },
      ],
    },
    { name: 'cta', type: 'group', label: 'Header button', fields: [linkField({ labelRequired: false })] },
  ],
}
