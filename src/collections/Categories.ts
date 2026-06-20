import type { CollectionConfig } from 'payload'

import { adminsCanMutate } from '@/access'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: adminsCanMutate,
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    defaultColumns: ['name', 'platform', 'parent', 'showInNav'],
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
      name: 'platform',
      type: 'select',
      admin: { position: 'sidebar' },
      options: [
        { label: 'PlayStation', value: 'playstation' },
        { label: 'Xbox', value: 'xbox' },
        { label: 'Nintendo Switch', value: 'switch' },
        { label: 'PC', value: 'pc' },
        { label: 'Universal', value: 'universal' },
      ],
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      admin: { position: 'sidebar' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'showInNav',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'navOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
