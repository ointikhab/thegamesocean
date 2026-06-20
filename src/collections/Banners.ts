import type { CollectionConfig } from 'payload'

import { adminsCanMutate } from '@/access'

export const Banners: CollectionConfig = {
  slug: 'banners',
  access: adminsCanMutate,
  admin: {
    useAsTitle: 'title',
    group: 'Storefront',
    defaultColumns: ['title', 'active', 'order'],
  },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'textarea' },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    { name: 'ctaLabel', type: 'text', defaultValue: 'Shop now' },
    { name: 'ctaHref', type: 'text', defaultValue: '/shop' },
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'violet',
      options: [
        { label: 'Violet → Cyan', value: 'violet' },
        { label: 'Magenta → Violet', value: 'magenta' },
        { label: 'Cyan → Emerald', value: 'cyan' },
      ],
    },
    { name: 'order', type: 'number', defaultValue: 0 },
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
}
