import type { CollectionConfig } from 'payload'

import { adminsCanMutate } from '@/access'

export const Platforms: CollectionConfig = {
  slug: 'platforms',
  access: adminsCanMutate,
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    defaultColumns: ['name', 'slug', 'order'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Controls display order in filters and menus.' },
    },
  ],
  defaultSort: 'order',
}
