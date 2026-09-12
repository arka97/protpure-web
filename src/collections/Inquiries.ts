import type { CollectionConfig } from 'payload'
import { editors } from '@/access'
import { GRADE_OPTIONS } from '@/collections/Products'
import { sendInquiryEmails } from '@/emails/send'
import { ITEM_PURPOSES } from '@/lib/rfq'

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
    defaultColumns: ['subjectLine', 'type', 'items', 'status', 'country', 'createdAt'],
    description: 'Quote and contact requests from the website (RFQ basket), the public API and AI assistants. Update the status as you work them.',
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
        const n = Array.isArray(data?.items) ? data.items.length : 0
        data.subjectLine = `${typeLabel}${n ? ` (${n} item${n === 1 ? '' : 's'})` : ''} — ${who || data?.email || 'unknown'}`
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
    {
      name: 'items',
      type: 'array',
      label: 'Requested items',
      labels: { singular: 'item', plural: 'items' },
      admin: { description: 'Line items from the RFQ basket (or from an API / MCP caller). Sample kits are paid and credited against the first bulk order.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'product', type: 'relationship', relationTo: 'products', admin: { width: '50%' } },
            { name: 'productName', type: 'text', required: true, admin: { width: '50%', description: 'Name at the time of the request (kept even if the product is renamed or removed).' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'grade', type: 'select', options: [...GRADE_OPTIONS], admin: { width: '25%' } },
            { name: 'packSize', type: 'text', admin: { width: '25%', description: 'e.g. 1 L, 5 mL, Bulk (custom)' } },
            { name: 'catalogNumber', type: 'text', admin: { width: '25%' } },
            { name: 'quantity', type: 'number', defaultValue: 1, min: 1, admin: { width: '25%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'purpose', type: 'select', options: ITEM_PURPOSES.map((p) => ({ label: p.label, value: p.value })), defaultValue: 'production', admin: { width: '34%' } },
            { name: 'notes', type: 'text', admin: { width: '66%', description: 'Line note from the requester, e.g. column geometry or target volume.' } },
          ],
        },
      ],
    },
    { name: 'products', type: 'relationship', relationTo: 'products', hasMany: true, label: 'Products of interest', admin: { description: 'All products referenced by this inquiry (filled automatically from the items; also used by legacy API callers).' } },
    { name: 'requestedItems', type: 'textarea', label: 'Requested items (free text)', admin: { description: 'Free text as entered by the requester or an AI assistant, e.g. "SP Agarose Precise, 2 × 1 L".' } },
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
