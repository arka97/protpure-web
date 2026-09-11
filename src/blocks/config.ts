import type { Block, Field } from 'payload'
import { linkField } from '@/fields/link'
import { DOCUMENT_TYPES } from '@/collections/Documents'
import { FAQ_CATEGORIES } from '@/collections/Faqs'
import { CERTIFICATION_KINDS } from '@/collections/Certifications'
import { UPDATE_KINDS } from '@/collections/Updates'

// Textarea (still a varchar column): a line break in the heading is kept as a deliberate break on screen.
const heading = (required = false): Field => ({ name: 'heading', type: 'textarea', required, admin: { rows: 2, description: 'Line breaks are kept. *asterisks* italicise the proposition.' } })
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
    { name: 'numbered', type: 'checkbox', defaultValue: false, admin: { description: 'Number the H2 headings 01, 02, 03… like the site’s chapters (legal pages, long policies).' } },
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
          { name: 'value', type: 'text', required: true, admin: { width: '25%', description: 'The numeral, e.g. 600' } },
          { name: 'unit', type: 'text', admin: { width: '25%', description: 'Shown small next to the numeral, e.g. L / month' } },
          { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
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
    eyebrow,
    heading(true),
    { name: 'text', type: 'textarea', admin: { description: 'Blank lines start new paragraphs.' } },
    { name: 'note', type: 'text', admin: { description: 'Short emphasised line after the text, e.g. the paid-evaluation credit policy.' } },
    links(2),
    {
      name: 'style',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'Dark field', value: 'dark' },
        { label: 'Accent band (luminous teal)', value: 'accent' },
        { label: 'Light', value: 'light' },
        { label: 'Evaluation panel (dark, with bead field)', value: 'evaluation' },
      ],
    },
  ],
}

export const ProductCategoriesBlock: Block = {
  slug: 'productCategories',
  labels: { singular: 'Product categories', plural: 'Product categories' },
  fields: [
    eyebrow,
    heading(),
    intro,
    { name: 'categories', type: 'relationship', relationTo: 'product-categories', hasMany: true, admin: { description: 'Leave empty to show every category. Pick the main chromatography modes and mention the rest in the footnote.' } },
    { name: 'footnote', type: 'text', admin: { description: 'Line under the grid, e.g. "Also available: pre-packed columns, magnetic beads & evaluation kits."' } },
    { name: 'linkLabel', type: 'text', admin: { description: 'Catalogue link label. Defaults to "All N products".' } },
  ],
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
    { type: 'row', fields: [
      { name: 'imageCaption', type: 'text', admin: { width: '60%', description: 'Caption line under the image, e.g. "Process evaluation in the Protpure lab".' } },
      { name: 'imageCaptionNote', type: 'text', admin: { width: '40%', description: 'Right-hand side of the caption, e.g. "Anand, Gujarat".' } },
    ] },
    { name: 'imagePosition', type: 'select', defaultValue: 'right', options: [{ label: 'Right', value: 'right' }, { label: 'Left', value: 'left' }] },
    { name: 'secondImage', type: 'upload', relationTo: 'media', admin: { description: 'Optional smaller image under the main one (e.g. facility exterior). Until it is uploaded, editors see a dashed slot in preview; visitors see only the text.' } },
    { name: 'secondImageText', type: 'textarea', admin: { description: 'Text beside the second image.' } },
    { name: 'quote', type: 'textarea', admin: { description: 'Optional quotation shown after the text (attribution comes from a following Team grid in "spread" layout).' } },
    { name: 'background', type: 'select', defaultValue: 'light', options: [{ label: 'Light', value: 'light' }, { label: 'Recessed (tinted)', value: 'recessed' }] },
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
    eyebrow,
    heading(),
    intro,
    { name: 'category', type: 'select', options: [{ label: 'All categories', value: 'all' }, ...FAQ_CATEGORIES], defaultValue: 'all' },
    { name: 'faqs', type: 'relationship', relationTo: 'faqs', hasMany: true, admin: { description: 'Optional: pick specific questions instead of a category.' } },
  ],
}

export const TeamGridBlock: Block = {
  slug: 'teamGrid',
  labels: { singular: 'Team grid', plural: 'Team grids' },
  fields: [
    eyebrow,
    heading(),
    intro,
    { name: 'members', type: 'relationship', relationTo: 'team', hasMany: true, admin: { description: 'Leave empty to show everyone.' } },
    { name: 'layout', type: 'select', defaultValue: 'grid', options: [{ label: 'Grid of cards', value: 'grid' }, { label: 'Spread (compact line under the previous section)', value: 'spread' }] },
  ],
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
    eyebrow,
    heading(),
    intro,
    { name: 'types', type: 'select', hasMany: true, options: [...DOCUMENT_TYPES], admin: { description: 'Leave empty for all types.' } },
    { name: 'limit', type: 'number', defaultValue: 12 },
  ],
}

export const ApplicationsGridBlock: Block = {
  slug: 'applicationsGrid',
  labels: { singular: 'Applications grid', plural: 'Applications grids' },
  fields: [eyebrow, heading(), intro, { name: 'layout', type: 'select', defaultValue: 'cards', options: [{ label: 'Cards', value: 'cards' }, { label: 'Compact link list', value: 'list' }] }],
}
export const ServicesGridBlock: Block = {
  slug: 'servicesGrid',
  labels: { singular: 'Services grid', plural: 'Services grids' },
  fields: [eyebrow, heading(), intro, { name: 'layout', type: 'select', defaultValue: 'cards', options: [{ label: 'Cards', value: 'cards' }, { label: 'Inline row (heading + links)', value: 'row' }] }],
}

export const TrustStripBlock: Block = {
  slug: 'trustStrip',
  labels: { singular: 'Trust strip', plural: 'Trust strips' },
  fields: [
    {
      name: 'source',
      type: 'select',
      defaultValue: 'settings',
      options: [{ label: 'Site settings → certifications & claims', value: 'settings' }, { label: 'Custom items', value: 'custom' }],
    },
    {
      name: 'items',
      type: 'array',
      maxRows: 6,
      fields: [{ name: 'text', type: 'text', required: true }],
      admin: { condition: (_, s) => s?.source === 'custom', description: 'Short statements, e.g. "CoA with every lot". Claims only, no invented certifications.' },
    },
  ],
}

export const LatestPostsBlock: Block = {
  slug: 'latestPosts',
  labels: { singular: 'Latest blog posts', plural: 'Latest blog posts' },
  fields: [eyebrow, heading(), { name: 'limit', type: 'number', defaultValue: 3 }],
}

export const LinkedInFeedBlock: Block = {
  slug: 'linkedInFeed',
  labels: { singular: 'LinkedIn feed', plural: 'LinkedIn feeds' },
  fields: [
    eyebrow,
    heading(),
    intro,
    { name: 'limit', type: 'number', defaultValue: 3 },
    { name: 'kind', type: 'select', options: [...UPDATE_KINDS], admin: { description: 'Optional: show only updates of this kind (set on each LinkedIn update).' } },
  ],
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
          { name: 'badge', type: 'text', admin: { width: '30%', description: 'Application label, e.g. Industrial capture' } },
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
    { name: 'note', type: 'textarea', admin: { description: 'Footnote under the plot, e.g. "Bars show size range; dots show d50V. Platform values…"' } },
    linkField({ labelRequired: false }),
  ],
}

export const ResinSelectorBlock: Block = {
  slug: 'resinSelector',
  labels: { singular: 'Resin selector', plural: 'Resin selectors' },
  fields: [eyebrow, heading(), intro],
}

/* ---------- Trust & proof blocks (rendered from src/components/blocks/trust/*) ---------- */

export const LogoWallBlock: Block = {
  slug: 'logoWall',
  labels: { singular: 'Customer logo wall', plural: 'Customer logo walls' },
  fields: [
    eyebrow,
    heading(),
    {
      name: 'source',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'All customers with "Show logo" ticked', value: 'all' },
        { label: 'Picked customers', value: 'picked' },
      ],
    },
    { name: 'customers', type: 'relationship', relationTo: 'customers', hasMany: true, admin: { condition: (_, s) => s?.source === 'picked', description: 'Only customers with a logo and "Show logo" ticked are rendered.' } },
    { name: 'fallbackStatement', type: 'text', admin: { description: 'Shown instead of logos while none can be published. Defaults to Site settings → Proof points → Customers statement.' } },
  ],
}

export const CertificationsStripBlock: Block = {
  slug: 'certificationsStrip',
  labels: { singular: 'Certifications strip', plural: 'Certifications strips' },
  fields: [
    heading(),
    { name: 'kinds', type: 'select', hasMany: true, options: [...CERTIFICATION_KINDS], admin: { description: 'Leave empty for all kinds.' } },
    { name: 'limit', type: 'number', defaultValue: 8 },
  ],
}

export const GalleryBlock: Block = {
  slug: 'gallery',
  labels: { singular: 'Photo gallery', plural: 'Photo galleries' },
  fields: [
    eyebrow,
    heading(),
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Photo', plural: 'Photos' },
      admin: { description: 'Facility, lab and team photos. The block is hidden until at least one photo is added.' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { type: 'row', fields: [
          { name: 'label', type: 'text', admin: { width: '35%', description: 'Small tag, e.g. "Production" or "QC lab".' } },
          { name: 'caption', type: 'text', admin: { width: '65%' } },
        ] },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Horizontal strip', value: 'strip' },
        { label: 'Spread (one large + small)', value: 'spread' },
      ],
    },
  ],
}

export const PublicationsBlock: Block = {
  slug: 'publications',
  labels: { singular: 'Publications', plural: 'Publications' },
  fields: [
    eyebrow,
    heading(),
    { name: 'member', type: 'relationship', relationTo: 'team', admin: { description: 'Leave empty to list publications of every team member marked "featured".' } },
  ],
}

export const ProofBarBlock: Block = {
  slug: 'proofBar',
  labels: { singular: 'Proof bar', plural: 'Proof bars' },
  fields: [
    { name: 'showStatement', type: 'checkbox', defaultValue: true, admin: { description: 'Include the customers statement from Site settings → Proof points.' } },
    { name: 'style', type: 'select', defaultValue: 'light', options: [{ label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' }] },
  ],
}

export const pageBlocks: Block[] = [
  RichTextBlock,
  TrustStripBlock,
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
  LogoWallBlock,
  CertificationsStripBlock,
  GalleryBlock,
  PublicationsBlock,
  ProofBarBlock,
]
