import type { Field } from 'payload'

/** Reusable link field: internal (pages/products/posts/…) or external URL. */
export const linkField = (opts?: { name?: string; labelRequired?: boolean; appearance?: boolean }): Field => ({
  name: opts?.name ?? 'link',
  type: 'group',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'internal',
          admin: { layout: 'horizontal', width: '50%' },
          options: [
            { label: 'Internal page', value: 'internal' },
            { label: 'Custom URL', value: 'custom' },
          ],
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab',
          admin: { width: '50%', style: { alignSelf: 'flex-end' } },
        },
      ],
    },
    {
      name: 'reference',
      type: 'relationship',
      relationTo: ['pages', 'products', 'product-categories', 'applications', 'posts'],
      admin: { condition: (_, siblingData) => siblingData?.type === 'internal' },
    },
    {
      name: 'url',
      type: 'text',
      admin: { condition: (_, siblingData) => siblingData?.type === 'custom' },
    },
    {
      name: 'label',
      type: 'text',
      required: opts?.labelRequired ?? true,
    },
    ...(opts?.appearance
      ? [
          {
            name: 'appearance',
            type: 'select' as const,
            defaultValue: 'primary',
            options: [
              { label: 'Primary', value: 'primary' },
              { label: 'Secondary', value: 'secondary' },
              { label: 'Ghost', value: 'ghost' },
            ],
          },
        ]
      : []),
  ],
})
