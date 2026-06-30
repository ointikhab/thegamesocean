import type { GlobalConfig } from 'payload'

import { isAdmin } from '@/access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: isAdmin,
  },
  admin: { group: 'Site' },
  fields: [
    { name: 'storeName', type: 'text', defaultValue: 'THE GAMES OCEAN' },
    { name: 'tagline', type: 'text', defaultValue: 'Next-Level Gear' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'currency', type: 'text', defaultValue: 'PKR' },
    { name: 'announcementText', type: 'text', defaultValue: 'Free express delivery across Pakistan on orders over Rs. 15,000' },
    {
      name: 'tickerItems',
      type: 'array',
      label: 'Scrolling Ticker Items',
      admin: { description: 'Messages shown in the scrolling banner below the header.' },
      fields: [
        { name: 'text', type: 'text', required: true },
      ],
    },
    { name: 'contactEmail', type: 'email', defaultValue: 'support@thegamesocean.com' },
    { name: 'contactPhone', type: 'text', defaultValue: '+92 300 1234567' },
    { name: 'address', type: 'text', defaultValue: 'Gulberg III, Lahore, Pakistan' },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: ['facebook', 'instagram', 'twitter', 'youtube', 'tiktok', 'discord'],
          required: true,
        },
        { name: 'href', type: 'text', required: true },
      ],
    },
  ],
}
