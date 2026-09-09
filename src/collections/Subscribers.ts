import type { CollectionConfig } from 'payload'
import { editors } from '@/access'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: 'Newsletter subscriber', plural: 'Newsletter subscribers' },
  admin: {
    useAsTitle: 'email',
    group: 'Sales',
    defaultColumns: ['email', 'status', 'createdAt'],
    description: 'Double opt-in list. Export confirmed subscribers to your email tool when sending a newsletter.',
  },
  access: { create: () => false, read: editors, update: editors, delete: editors },
  timestamps: true,
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    { name: 'name', type: 'text' },
    { name: 'organization', type: 'text' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending confirmation', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
    },
    { name: 'token', type: 'text', index: true, admin: { hidden: true } },
    { name: 'confirmedAt', type: 'date', admin: { readOnly: true } },
    { name: 'source', type: 'text', admin: { readOnly: true } },
  ],
}
