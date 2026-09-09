import type { CollectionConfig } from 'payload'
import path from 'path'
import { anyone, editors } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content' },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  fields: [
    { name: 'alt', type: 'text', required: true, admin: { description: 'Describe the image for accessibility and search engines.' } },
    { name: 'caption', type: 'text' },
  ],
  upload: {
    staticDir: path.resolve(process.cwd(), 'media'),
    mimeTypes: ['image/*'],
    focalPoint: true,
    formatOptions: { format: 'webp', options: { quality: 82 } },
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 400, position: 'centre', formatOptions: { format: 'webp' } },
      { name: 'card', width: 800, formatOptions: { format: 'webp' } },
      { name: 'large', width: 1600, formatOptions: { format: 'webp' } },
      { name: 'og', width: 1200, height: 630, position: 'centre', formatOptions: { format: 'jpeg' } },
    ],
    adminThumbnail: 'thumbnail',
  },
}
