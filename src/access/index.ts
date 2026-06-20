import type { Access, FieldAccess } from 'payload'

/** Staff/admin users authenticated against the `users` collection. */
export const isAdmin: Access = ({ req: { user } }) => {
  return Boolean(user && user.collection === 'users')
}

export const isAdminFieldAccess: FieldAccess = ({ req: { user } }) => {
  return Boolean(user && user.collection === 'users')
}

/** Anyone can read; only staff can write. */
export const adminsCanMutate = {
  create: isAdmin,
  delete: isAdmin,
  read: () => true,
  update: isAdmin,
}

/** Staff can do anything; signed-in customers may read/update only their own record. */
export const isAdminOrSelf: Access = ({ req: { user }, id }) => {
  if (user?.collection === 'users') return true
  if (user?.collection === 'customers') {
    if (id) return { id: { equals: user.id } }
    return { id: { equals: user.id } }
  }
  return false
}

export const isAdminOrSelfField = ({ req: { user } }: { req: { user: any } }) => {
  if (user?.collection === 'users') return true
  if (user?.collection === 'customers') return { customer: { equals: user.id } }
  return false
}
