import type { CollectionConfig } from 'payload'

import { adminsCanMutate } from '@/access'

export const Brands: CollectionConfig = {
  slug: 'brands',
  access: adminsCanMutate,
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
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
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
