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
      admin: { description: 'Background image. Also used as the video poster when a video URL is set.' },
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        description:
          'Optional: paste a direct MP4 URL to play a looping background video instead of the static image. The image above is used as the loading poster.',
      },
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
