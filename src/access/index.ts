import type { Access, FieldAccess } from 'payload'

export type Role = 'admin' | 'editor'

const hasRole = (user: unknown, roles: Role[]) => {
  const u = user as { roles?: Role[] } | null | undefined
  return Boolean(u?.roles?.some((r) => roles.includes(r)))
}

export const anyone: Access = () => true

export const authenticated: Access = ({ req: { user } }) => Boolean(user)

export const admins: Access = ({ req: { user } }) => hasRole(user, ['admin'])

export const adminsFieldLevel: FieldAccess = ({ req: { user } }) => hasRole(user, ['admin'])

export const editors: Access = ({ req: { user } }) => hasRole(user, ['admin', 'editor'])

/** Public sees only published docs; logged-in editors see everything (drafts included). */
export const publishedOrEditor: Access = ({ req: { user } }) => {
  if (hasRole(user, ['admin', 'editor'])) return true
  return { _status: { equals: 'published' } }
}

/** For collections without drafts: public read always, no need to check status. */
export const isAdmin = (user: unknown) => hasRole(user, ['admin'])
