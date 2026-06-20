import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'staff',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Staff', value: 'staff' },
      ],
      required: true,
    },
  ],
}
