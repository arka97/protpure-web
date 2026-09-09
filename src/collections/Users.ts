import type { CollectionConfig } from 'payload'
import { admins, adminsFieldLevel } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    group: 'Admin',
    hidden: ({ user }) => !(user as { roles?: string[] } | null)?.roles?.includes('admin'),
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  access: {
    // Only admins manage users; every user can read/update their own record.
    read: ({ req: { user } }) => {
      if ((user as { roles?: string[] } | null)?.roles?.includes('admin')) return true
      return user ? { id: { equals: user.id } } : false
    },
    create: admins,
    update: ({ req: { user } }) => {
      if ((user as { roles?: string[] } | null)?.roles?.includes('admin')) return true
      return user ? { id: { equals: user.id } } : false
    },
    delete: admins,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: { update: adminsFieldLevel },
      admin: { description: 'Editors manage content. Admins also manage users and site settings.' },
    },
  ],
}
