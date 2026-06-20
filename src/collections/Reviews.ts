import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  access: {
    create: ({ req: { user } }) => Boolean(user && user.collection === 'customers'),
    delete: isAdmin,
    read: ({ req: { user } }) => {
      if (user?.collection === 'users') return true
      return { approved: { equals: true } }
    },
    update: isAdmin,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Storefront',
    defaultColumns: ['product', 'customer', 'rating', 'approved', 'createdAt'],
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      index: true,
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'comment',
      type: 'textarea',
      required: true,
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
