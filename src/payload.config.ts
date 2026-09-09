import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Documents } from './collections/Documents'
import { ProductCategories } from './collections/ProductCategories'
import { Products } from './collections/Products'
import { Applications } from './collections/Applications'
import { Services } from './collections/Services'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Updates } from './collections/Updates'
import { Team } from './collections/Team'
import { Testimonials } from './collections/Testimonials'
import { Faqs } from './collections/Faqs'
import { Inquiries } from './collections/Inquiries'
import { Subscribers } from './collections/Subscribers'
import { SiteSettings } from './globals/SiteSettings'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · Protpure admin' },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 834, height: 1194 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [
    // Catalog
    Products,
    ProductCategories,
    Applications,
    Services,
    // Content
    Pages,
    Posts,
    Updates,
    Documents,
    Media,
    Faqs,
    // Company
    Team,
    Testimonials,
    // Sales
    Inquiries,
    Subscribers,
    // Admin
    Users,
  ],
  globals: [SiteSettings, Header, Footer],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    // Dev: schema changes are pushed automatically. Prod: pending migrations in src/migrations run on startup.
    push: process.env.NODE_ENV !== 'production',
    prodMigrations: migrations,
  }),
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.EMAIL_FROM || 'no-reply@protpure.com',
        defaultFromName: process.env.EMAIL_FROM_NAME || 'Protpure Tech',
        overrideRecipientAddress: process.env.EMAIL_OVERRIDE_TO || undefined,
      })
    : undefined,
  sharp,
  cors: [serverURL],
  csrf: [serverURL],
  plugins: [
    seoPlugin({
      collections: ['pages', 'products', 'posts', 'applications', 'product-categories'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => {
        const d = doc as { title?: string; name?: string }
        return `${d.title || d.name || ''} | Protpure`
      },
      generateDescription: ({ doc }) => {
        const d = doc as { summary?: string; excerpt?: string; tagline?: string }
        return d.summary || d.excerpt || d.tagline || ''
      },
      generateURL: ({ doc, collectionSlug }) => {
        const d = doc as { slug?: string }
        const map: Record<string, string> = { pages: '', products: '/products', posts: '/blog', applications: '/applications', 'product-categories': '/products/category' }
        const base = map[collectionSlug ?? ''] ?? ''
        return `${serverURL}${base}/${d.slug === 'home' ? '' : d.slug ?? ''}`
      },
    }),
  ],
})
