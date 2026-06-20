import type { CollectionConfig } from 'payload'

import { adminsCanMutate } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: adminsCanMutate,
  admin: {
    group: 'Catalog',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 400, position: 'centre' },
      { name: 'card', width: 640, height: 640, position: 'centre' },
      { name: 'large', width: 1600, height: 1600, position: 'centre', withoutEnlargement: true },
    ],
    mimeTypes: ['image/*'],
  },
}
