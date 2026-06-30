import type { GlobalConfig } from 'payload'

import { isAdmin } from '@/access'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: isAdmin,
  },
  admin: { group: 'Site' },
  fields: [
    {
      name: 'columns',
      type: 'array',
      labels: { singular: 'Link column', plural: 'Link columns' },
      fields: [
        { name: 'heading', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },
    { name: 'bottomText', type: 'text', defaultValue: '© The Games Ocean. All rights reserved.' },
  ],
}
