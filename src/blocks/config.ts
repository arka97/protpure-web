import type { Block, Field } from 'payload'
import { linkField } from '@/fields/link'
import { DOCUMENT_TYPES } from '@/collections/Documents'
import { FAQ_CATEGORIES } from '@/collections/Faqs'

const heading = (required = false): Field => ({ name: 'heading', type: 'text', required })
const eyebrow: Field = { name: 'eyebrow', type: 'text', admin: { description: 'Small label above the heading.' } }
const intro: Field = { name: 'intro', type: 'textarea' }
const links = (max = 2): Field => ({ name: 'links', type: 'array', maxRows: max, fields: [linkField({ appearance: true })] })

export const ICON_OPTIONS = [
  'purity', 'reproducible', 'flow', 'delivery', 'factory', 'cost', 'globe', 'shield', 'support', 'scale', 'beaker', 'document', 'microscope', 'chart', 'handshake', 'clock',
].map((v) => ({ label: v, value: v }))

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Rich text', plural: 'Rich text' },
  fields: [
    { name: 'content', type: 'richText', required: true },
    { name: 'width', type: 'select', defaultValue: 'narrow', options: [{ label: 'Narrow (reading width)', value: 'narrow' }, { label: 'Wide', value: 'wide' }] },
  ],
}

export const StatsBlock: Block = {
  slug: 'stats',
  labels: { singular: 'Stats row', plural: 'Stats rows' },
  fields: [
    heading(),
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      fields: [
        { type: 'row', fields: [
          { name: 'value', type: 'text', required: true, admin: { width: '33%', description: 'e.g. 600 L' } },
          { name: 'label', type: 'text', required: true, admin: { width: '67%' } },
        ] },
        { name: 'note', type: 'text' },
      ],
    },
    { name: 'style', type: 'select', defaultValue: 'light', options: [{ label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' }] },
  ],
}

export const FeatureGridBlock: Block = {
  slug: 'featureGrid',
  labels: { singular: 'Feature grid', plural: 'Feature grids' },
  fields: [
    eyebrow,
    heading(),
    intro,
    { name: 'columns', type: 'select', defaultValue: '3', options: ['2', '3', '4'].map((v) => ({ label: v, value: v })) },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { type: 'row', fields: [
          { name: 'icon', type: 'select', options: ICON_OPTIONS, admin: { width: '30%' } },
          { name: 'title', type: 'text', required: true, admin: { width: '70%' } },
        ] },
        { name: 'text', type: 'textarea', required: true },
        linkField({ labelRequired: false }),
      ],
    },
    { name: 'numbered', type: 'checkbox', defaultValue: false, admin: { description: 'Show 01, 02, 03… instead of icons.' } },
  ],
}

export const ComparisonTableBlock: Block = {
  slug: 'comparisonTable',
  labels: { singular: 'Comparison table', plural: 'Comparison tables' },
  fields: [
    eyebrow,
    heading(),
    intro,
    { type: 'row', fields: [
      { name: 'columnA', type: 'text', required: true, defaultValue: 'Typical imported supplier', admin: { width: '50%' } },
      { name: 'columnB', type: 'text', required: true, defaultValue: 'Protpure', admin: { width: '50%' } },
    ] },
    {
      name: 'rows',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'parameter', type: 'text', required: true },
        { type: 'row', fields: [
          { name: 'a', type: 'text', required: true, admin: { width: '50%' } },
          { name: 'b', type: 'text', required: true, admin: { width: '50%' } },
        ] },
      ],
    },
    { name: 'note', type: 'text' },
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'Call to action', plural: 'Calls to action' },
  fields: [
    heading(true),
    { name: 'text', type: 'textarea' },
    links(2),
    { name: 'style', type: 'select', defaultValue: 'dark', options: [{ label: 'Dark', value: 'dark' }, { label: 'Accent', value: 'accent' }, { label: 'Light', value: 'light' }] },
  ],
}

export const ProductCategoriesBlock: Block = {
  slug: 'productCategories',
  labels: { singular: 'Product categories', plural: 'Product categories' },
  fields: [eyebrow, heading(), intro],
}

export const FeaturedProductsBlock: Block = {
  slug: 'featuredProducts',
  labels: { singular: 'Featured products', plural: 'Featured products' },
  fields: [
    eyebrow,
    heading(),
    intro,
    { name: 'products', type: 'relationship', relationTo: 'products', hasMany: true, admin: { description: 'Leave empty to show products marked "featured".' } },
  ],
}

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  labels: { singular: 'Image', plural: 'Images' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text' },
    { name: 'size', type: 'select', defaultValue: 'wide', options: [{ label: 'Wide', value: 'wide' }, { label: 'Reading width', value: 'narrow' }, { label: 'Full bleed', value: 'full' }] },
  ],
}

export const TwoColumnBlock: Block = {
  slug: 'twoColumn',
  labels: { singular: 'Text + image', plural: 'Text + image' },
  fields: [
    eyebrow,
    heading(),
    { name: 'content', type: 'richText' },
    links(2),
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'imagePosition', type: 'select', defaultValue: 'right', options: [{ label: 'Right', value: 'right' }, { label: 'Left', value: 'left' }] },
    {
      name: 'facts',
      type: 'array',
      labels: { singular: 'Fact', plural: 'Fact list (optional)' },
      admin: { description: 'Key/value list shown under the text, e.g. Location → Anand, Gujarat.' },
      fields: [{ type: 'row', fields: [
        { name: 'label', type: 'text', required: true, admin: { width: '40%' } },
        { name: 'value', type: 'text', required: true, admin: { width: '60%' } },
      ] }],
    },
  ],
}

export const FaqBlock: Block = {
  slug: 'faqBlock',
  labels: { singular: 'FAQ list', plural: 'FAQ lists' },
  fields: [
    heading(),
    intro,
    { name: 'category', type: 'select', options: [{ label: 'All categories', value: 'all' }, ...FAQ_CATEGORIES], defaultValue: 'all' },
    { name: 'faqs', type: 'relationship', relationTo: 'faqs', hasMany: true, admin: { description: 'Optional: pick specific questions instead of a category.' } },
  ],
}

export const TeamGridBlock: Block = {
  slug: 'teamGrid',
  labels: { singular: 'Team grid', plural: 'Team grids' },
  fields: [eyebrow, heading(), intro, { name: 'members', type: 'relationship', relationTo: 'team', hasMany: true, admin: { description: 'Leave empty to show everyone.' } }],
}

export const TimelineBlock: Block = {
  slug: 'timeline',
  labels: { singular: 'Timeline', plural: 'Timelines' },
  fields: [
    eyebrow,
    heading(),
    { name: 'items', type: 'array', minRows: 1, fields: [
      { type: 'row', fields: [
        { name: 'date', type: 'text', required: true, admin: { width: '30%', description: 'e.g. May 2023' } },
        { name: 'title', type: 'text', required: true, admin: { width: '70%' } },
      ] },
      { name: 'text', type: 'textarea' },
    ] },
  ],
}

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: { singular: 'Testimonials', plural: 'Testimonials' },
  fields: [eyebrow, heading(), { name: 'items', type: 'relationship', relationTo: 'testimonials', hasMany: true, admin: { description: 'Leave empty to show all.' } }],
}

export const DocumentListBlock: Block = {
  slug: 'documentList',
  labels: { singular: 'Document list', plural: 'Document lists' },
  fields: [
    heading(),
    intro,
    { name: 'types', type: 'select', hasMany: true, options: [...DOCUMENT_TYPES], admin: { description: 'Leave empty for all types.' } },
    { name: 'limit', type: 'number', defaultValue: 12 },
  ],
}

export const ApplicationsGridBlock: Block = { slug: 'applicationsGrid', labels: { singular: 'Applications grid', plural: 'Applications grids' }, fields: [eyebrow, heading(), intro] }
export const ServicesGridBlock: Block = { slug: 'servicesGrid', labels: { singular: 'Services grid', plural: 'Services grids' }, fields: [eyebrow, heading(), intro] }

export const LatestPostsBlock: Block = {
  slug: 'latestPosts',
  labels: { singular: 'Latest blog posts', plural: 'Latest blog posts' },
  fields: [eyebrow, heading(), { name: 'limit', type: 'number', defaultValue: 3 }],
}

export const LinkedInFeedBlock: Block = {
  slug: 'linkedInFeed',
  labels: { singular: 'LinkedIn feed', plural: 'LinkedIn feeds' },
  fields: [eyebrow, heading(), intro, { name: 'limit', type: 'number', defaultValue: 3 }],
}

export const FormBlock: Block = {
  slug: 'formBlock',
  labels: { singular: 'Form', plural: 'Forms' },
  fields: [
    { name: 'form', type: 'select', required: true, defaultValue: 'quote', options: [
      { label: 'Request a quote', value: 'quote' },
      { label: 'Contact us', value: 'contact' },
      { label: 'Distribution / partnership', value: 'partnership' },
      { label: 'Newsletter signup', value: 'newsletter' },
    ] },
    heading(),
    intro,
    {
      name: 'sidebar',
      type: 'richText',
      admin: { description: 'Optional text shown next to the form (what happens next, response times…).' },
    },
  ],
}

export const GradesPlatformBlock: Block = {
  slug: 'gradesPlatform',
  labels: { singular: 'Particle-size platform', plural: 'Particle-size platforms' },
  fields: [
    eyebrow,
    heading(),
    intro,
    {
      name: 'grades',
      type: 'array',
      minRows: 1,
      fields: [
        { type: 'row', fields: [
          { name: 'name', type: 'text', required: true, admin: { width: '40%', description: 'e.g. Agarose Precise' } },
          { name: 'badge', type: 'text', admin: { width: '30%', description: 'e.g. High resolution' } },
          { name: 'd50', type: 'text', admin: { width: '30%', description: 'e.g. ~60 µm' } },
        ] },
        { type: 'row', fields: [
          { name: 'sizeRange', type: 'text', admin: { width: '33%', description: 'e.g. 25–110 µm' } },
          { name: 'maxFlow', type: 'text', admin: { width: '33%', description: 'e.g. up to 380 cm/h' } },
          { name: 'pressure', type: 'text', admin: { width: '33%', description: 'e.g. < 0.12 MPa' } },
        ] },
        { name: 'text', type: 'textarea' },
      ],
    },
  ],
}

export const ResinSelectorBlock: Block = {
  slug: 'resinSelector',
  labels: { singular: 'Resin selector', plural: 'Resin selectors' },
  fields: [eyebrow, heading(), intro],
}

export const pageBlocks: Block[] = [
  RichTextBlock,
  StatsBlock,
  FeatureGridBlock,
  TwoColumnBlock,
  ComparisonTableBlock,
  GradesPlatformBlock,
  ResinSelectorBlock,
  ProductCategoriesBlock,
  FeaturedProductsBlock,
  ApplicationsGridBlock,
  ServicesGridBlock,
  DocumentListBlock,
  LatestPostsBlock,
  LinkedInFeedBlock,
  TestimonialsBlock,
  TeamGridBlock,
  TimelineBlock,
  FaqBlock,
  MediaBlock,
  FormBlock,
  CtaBlock,
]
