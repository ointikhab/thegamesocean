import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access'
import { ADMIN_EMAIL, orderAdminEmailHtml, sendEmail } from '@/lib/email'
import { sendAdminSms } from '@/lib/sms'

const isAdminOrOwner = ({ req: { user } }: { req: { user: any } }) => {
  if (user?.collection === 'users') return true
  if (user?.collection === 'customers') return { customer: { equals: user.id } }
  return false
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    create: () => true,
    delete: isAdmin,
    read: isAdminOrOwner,
    update: isAdmin,
  },
  admin: {
    useAsTitle: 'orderNumber',
    group: 'Storefront',
    defaultColumns: ['orderNumber', 'customer', 'total', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'paymentMethod',
      type: 'select',
      defaultValue: 'cod',
      admin: { position: 'sidebar' },
      options: [{ label: 'Cash on Delivery', value: 'cod' }],
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      admin: { position: 'sidebar' },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products' },
        { name: 'titleSnapshot', type: 'text', required: true },
        { name: 'variantLabel', type: 'text' },
        { name: 'imageUrl', type: 'text' },
        { name: 'quantity', type: 'number', required: true, min: 1 },
        { name: 'unitPrice', type: 'number', required: true, min: 0 },
        { name: 'lineTotal', type: 'number', required: true, min: 0 },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'shippingCost',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'fullName', type: 'text', required: true },
        { name: 'phone', type: 'text', required: true },
        { name: 'email', type: 'email' },
        { name: 'line1', type: 'text', required: true },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text', required: true },
        { name: 'province', type: 'text' },
        { name: 'postalCode', type: 'text' },
        { name: 'country', type: 'text', defaultValue: 'Pakistan' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation !== 'create') return doc
        try {
          await sendEmail({
            to: ADMIN_EMAIL,
            subject: `[The Games Ocean] New Order ${doc.orderNumber} — Rs.${doc.total?.toLocaleString()}`,
            html: orderAdminEmailHtml({
              orderNumber: doc.orderNumber,
              total: doc.total,
              shippingAddress: doc.shippingAddress,
              items: doc.items ?? [],
              notes: doc.notes,
            }),
          })
          await sendAdminSms(
            `Hi Mohsin, new order with order id: ${doc.orderNumber} has fallen, please contact customer`,
          )
        } catch (err) {
          console.error('[Orders] admin notification error:', err)
        }
        return doc
      },
    ],
  },
}
