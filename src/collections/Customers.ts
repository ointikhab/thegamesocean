import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access'

const isAdminOrSelfRecord = ({ req: { user }, id }: { req: { user: any }; id?: unknown }) => {
  if (user?.collection === 'users') return true
  if (user?.collection === 'customers') return { id: { equals: user.id } }
  return false
}

export const Customers: CollectionConfig = {
  slug: 'customers',
  access: {
    create: () => true,
    delete: isAdmin,
    read: isAdminOrSelfRecord,
    update: isAdminOrSelfRecord,
  },
  admin: {
    useAsTitle: 'email',
    group: 'Storefront',
    defaultColumns: ['email', 'firstName', 'lastName', 'createdAt'],
  },
  auth: {
    cookies: {
      sameSite: 'Lax',
    },
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'addresses',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'Home' },
        { name: 'fullName', type: 'text', required: true },
        { name: 'phone', type: 'text', required: true },
        { name: 'line1', type: 'text', required: true },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text', required: true },
        { name: 'province', type: 'text' },
        { name: 'postalCode', type: 'text' },
        { name: 'country', type: 'text', defaultValue: 'Pakistan' },
        { name: 'isDefault', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'wishlist',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
  ],
}
