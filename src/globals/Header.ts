import type { GlobalConfig } from 'payload'

import { isAdmin } from '@/access'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
    update: isAdmin,
  },
  admin: { group: 'Site' },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      labels: { singular: 'Nav item', plural: 'Nav items' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
        {
          name: 'columns',
          type: 'array',
          labels: { singular: 'Mega-menu column', plural: 'Mega-menu columns' },
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
      ],
    },
  ],
}
