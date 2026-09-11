import type { GlobalConfig } from 'payload'
import { anyone, editors } from '@/access'
import { linkField } from '@/fields/link'
import { revalidateGlobal } from '@/hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: editors },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Company',
          fields: [
            { type: 'row', fields: [
              { name: 'name', type: 'text', required: true, defaultValue: 'Protpure', admin: { width: '50%' } },
              { name: 'legalName', type: 'text', defaultValue: 'Protpure Tech Pvt. Ltd.', admin: { width: '50%' } },
            ] },
            { name: 'tagline', type: 'text', defaultValue: 'Purity. Performance. Reliability.' },
            { name: 'description', type: 'textarea', admin: { description: 'One paragraph about the company. Used as the default meta description and given to AI assistants.' } },
            { name: 'foundedYear', type: 'number' },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            { name: 'logoDark', type: 'upload', relationTo: 'media', admin: { description: 'Variant for dark backgrounds (optional).' } },
            {
              name: 'certifications',
              type: 'array',
              labels: { singular: 'Certification / claim', plural: 'Certifications & claims' },
              admin: { description: 'Short claims for the trust strip under the hero. Detailed certifications with issuer and certificate PDF live under Company → Certifications & claims.' },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              name: 'proof',
              type: 'group',
              label: 'Proof points',
              admin: { description: 'Facts about the company shown in the proof bar and given to AI assistants and search engines. Leave a field empty to hide it.' },
              fields: [
                { type: 'row', fields: [
                  { name: 'foundedText', type: 'text', label: 'Founded', admin: { width: '33%', description: 'e.g. Founded May 2023' } },
                  { name: 'teamSize', type: 'text', label: 'Team size', admin: { width: '33%', description: 'e.g. 8–10 person team' } },
                  { name: 'capacity', type: 'text', label: 'Capacity', admin: { width: '33%', description: 'e.g. 600 L / month' } },
                ] },
                {
                  name: 'customersStatement',
                  type: 'textarea',
                  label: 'Customers statement',
                  defaultValue: 'Used in GMP facilities. Repeat orders from Indian biopharma.',
                  admin: { description: 'One or two sentences about who uses Protpure resins. Shown where customer logos would go until logos can be published.' },
                },
                { name: 'linkedinFollowers', type: 'number', min: 0, label: 'LinkedIn followers', admin: { description: 'Optional. Update occasionally; shown next to the LinkedIn link.' } },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { type: 'row', fields: [
              { name: 'email', type: 'email', admin: { width: '50%', description: 'Public contact email.' } },
              { name: 'phone', type: 'text', admin: { width: '50%' } },
            ] },
            { name: 'whatsapp', type: 'text', admin: { description: 'International format without spaces, e.g. +919426596644. Leave empty to hide the WhatsApp button.' } },
            { name: 'address', type: 'textarea' },
            { type: 'row', fields: [
              { name: 'city', type: 'text', admin: { width: '33%' } },
              { name: 'region', type: 'text', admin: { width: '33%' } },
              { name: 'country', type: 'text', defaultValue: 'India', admin: { width: '33%' } },
            ] },
            { name: 'mapUrl', type: 'text', label: 'Google Maps link' },
            { name: 'hours', type: 'text', admin: { description: 'e.g. Mon–Sat, 9:30–18:00 IST' } },
            {
              name: 'social',
              type: 'group',
              fields: [
                { name: 'linkedin', type: 'text', label: 'LinkedIn company page URL' },
                { name: 'youtube', type: 'text' },
                { name: 'x', type: 'text', label: 'X / Twitter' },
              ],
            },
          ],
        },
        {
          label: 'Sales & email',
          fields: [
            {
              name: 'notificationEmails',
              type: 'array',
              labels: { singular: 'Email', plural: 'Inquiry notification emails' },
              admin: { description: 'Every new quote/contact request is sent to these addresses.' },
              fields: [{ name: 'email', type: 'email', required: true }],
            },
            { name: 'fromName', type: 'text', defaultValue: 'Protpure Tech', admin: { description: 'Sender name for automated emails.' } },
            { name: 'replyTo', type: 'email', admin: { description: 'Reply-to address for automated emails.' } },
            { name: 'responseTime', type: 'text', defaultValue: 'within 1–2 business days', admin: { description: 'Promised response time shown on forms and in confirmation emails.' } },
            { name: 'leadTime', type: 'text', defaultValue: '2–3 weeks ex-works', admin: { description: 'Default lead time claim.' } },
          ],
        },
        {
          label: 'Global reach',
          fields: [
            { name: 'globalStatement', type: 'textarea', admin: { description: 'Short statement about international supply, e.g. shipping, Incoterms, documentation.' } },
            {
              name: 'regions',
              type: 'array',
              labels: { singular: 'Region', plural: 'Regions served' },
              fields: [
                { type: 'row', fields: [
                  { name: 'name', type: 'text', required: true, admin: { width: '40%' } },
                  { name: 'status', type: 'select', defaultValue: 'direct', admin: { width: '30%' }, options: [
                    { label: 'Direct supply', value: 'direct' },
                    { label: 'Via distributor', value: 'distributor' },
                    { label: 'Seeking distributor', value: 'seeking' },
                  ] },
                  { name: 'note', type: 'text', admin: { width: '30%' } },
                ] },
              ],
            },
            {
              name: 'exportNotes',
              type: 'array',
              labels: { singular: 'Note', plural: 'Export & logistics notes' },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'SEO & site',
          fields: [
            { name: 'titleSuffix', type: 'text', defaultValue: 'Protpure — Agarose Chromatography Resins' },
            { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'Default social share image' },
            {
              name: 'announcement',
              type: 'group',
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: false },
                { name: 'text', type: 'text', admin: { condition: (_, s) => s?.enabled } },
                linkField({ labelRequired: false }),
              ],
            },
            { name: 'analyticsId', type: 'text', admin: { description: 'Plausible domain or GA4 measurement ID (optional).' } },
            { name: 'aiSummary', type: 'textarea', label: 'Summary for AI assistants', admin: { description: 'Plain-language paragraph served at /llms.txt describing what Protpure offers and how to buy.' } },
          ],
        },
      ],
    },
  ],
}
