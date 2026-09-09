import type { CollectionConfig } from 'payload'
import { editors } from '@/access'
import { sendInquiryEmails } from '@/emails/send'

export const INQUIRY_TYPES = [
  { label: 'Quote request', value: 'quote' },
  { label: 'Evaluation / sample request', value: 'evaluation' },
  { label: 'Technical question', value: 'technical' },
  { label: 'Distribution / partnership', value: 'partnership' },
  { label: 'General contact', value: 'contact' },
] as const

export const INQUIRY_STATUS = [
  { label: 'New', value: 'new' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Quoted', value: 'quoted' },
  { label: 'Won', value: 'won' },
  { label: 'Closed', value: 'closed' },
] as const

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Inquiry', plural: 'Inquiries' },
  admin: {
    useAsTitle: 'subjectLine',
    group: 'Sales',
    defaultColumns: ['subjectLine', 'type', 'status', 'country', 'createdAt'],
    description: 'Quote and contact requests from the website, email and AI assistants. Update the status as you work them.',
    listSearchableFields: ['name', 'email', 'organization', 'message'],
  },
  access: {
    // Created only through server code (website forms, MCP). Never directly by the public API.
    create: () => false,
    read: editors,
    update: editors,
    delete: editors,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        const who = [data?.name, data?.organization].filter(Boolean).join(' · ')
        const typeLabel = INQUIRY_TYPES.find((t) => t.value === data?.type)?.label ?? 'Inquiry'
        data.subjectLine = `${typeLabel} — ${who || data?.email || 'unknown'}`
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create' && !req.context.skipEmails) {
          await sendInquiryEmails({ payload: req.payload, inquiry: doc })
        }
        return doc
      },
    ],
  },
  defaultSort: '-createdAt',
  timestamps: true,
  fields: [
    { name: 'subjectLine', type: 'text', admin: { hidden: true } },
    {
      type: 'row',
      fields: [
        { name: 'type', type: 'select', options: [...INQUIRY_TYPES], required: true, admin: { width: '50%' } },
        { name: 'status', type: 'select', options: [...INQUIRY_STATUS], defaultValue: 'new', required: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'email', type: 'email', required: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'organization', type: 'text', admin: { width: '34%' } },
        { name: 'jobTitle', type: 'text', admin: { width: '33%' } },
        { name: 'phone', type: 'text', admin: { width: '33%' } },
      ],
    },
    { name: 'country', type: 'text' },
    { name: 'products', type: 'relationship', relationTo: 'products', hasMany: true },
    { name: 'requestedItems', type: 'textarea', label: 'Requested items / quantities', admin: { description: 'Free text as entered by the requester, e.g. "SP Agarose Precise, 2 × 1 L".' } },
    { name: 'application', type: 'text', admin: { description: 'What they are purifying / their process.' } },
    { name: 'message', type: 'textarea' },
    {
      name: 'meta',
      type: 'group',
      admin: { description: 'Captured automatically.' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'source',
              type: 'select',
              defaultValue: 'website',
              options: [
                { label: 'Website form', value: 'website' },
                { label: 'AI assistant (MCP)', value: 'mcp' },
                { label: 'Public API', value: 'api' },
                { label: 'Manual entry', value: 'manual' },
              ],
              admin: { width: '34%' },
            },
            { name: 'pageUrl', type: 'text', admin: { width: '66%' } },
          ],
        },
        { name: 'userAgent', type: 'text', admin: { readOnly: true } },
        { name: 'ip', type: 'text', admin: { readOnly: true } },
        { name: 'consent', type: 'checkbox', label: 'Consented to be contacted', admin: { readOnly: true } },
      ],
    },
    { name: 'internalNotes', type: 'textarea', admin: { position: 'sidebar', description: 'Only visible to your team.' } },
    { name: 'assignedTo', type: 'relationship', relationTo: 'users', admin: { position: 'sidebar' } },
  ],
}
