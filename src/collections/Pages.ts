import type { CollectionConfig } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { adminsCanMutate } from '@/access'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: adminsCanMutate,
  admin: {
    useAsTitle: 'title',
    group: 'Storefront',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
    },
  ],
}
