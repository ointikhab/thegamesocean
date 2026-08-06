import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access'
import { ADMIN_EMAIL, orderAdminEmailHtml, sendEmail } from '@/lib/email'
import { PAYMENT_METHODS } from '@/lib/payment-methods'
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
  endpoints: [
    {
      path: '/track',
      method: 'post',
      // Public guest lookup: an order number alone isn't secret enough to gate on
      // (they're time+random based but not cryptographically private), so we also
      // require the phone number used at checkout to match before returning anything.
      handler: async (req) => {
        let body: { orderNumber?: string; phone?: string } = {}
        try {
          body = (await req.json?.()) ?? {}
        } catch {
          body = {}
        }

        const orderNumber = String(body.orderNumber ?? '').trim()
        const phoneDigits = String(body.phone ?? '').replace(/\D/g, '')

        if (!orderNumber || phoneDigits.length < 7) {
          return Response.json(
            { message: 'Enter your Order ID and the phone number used at checkout.' },
            { status: 400 },
          )
        }

        const result = await req.payload.find({
          collection: 'orders',
          where: { orderNumber: { equals: orderNumber } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })

        const order = result.docs[0]
        const orderPhoneDigits = order?.shippingAddress?.phone
          ? String(order.shippingAddress.phone).replace(/\D/g, '')
          : ''
        const matches = Boolean(order) && orderPhoneDigits.length >= 7 && orderPhoneDigits.slice(-10) === phoneDigits.slice(-10)

        if (!matches) {
          return Response.json(
            { message: 'No order found matching that Order ID and phone number.' },
            { status: 404 },
          )
        }

        return Response.json({ doc: order })
      },
    },
  ],
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
      options: PAYMENT_METHODS.map((m) => ({ label: m.label, value: m.value })),
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
      name: 'codTax',
      label: 'COD Tax (4%)',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
      admin: { description: 'Government-mandated 4% tax applied to Cash on Delivery orders.' },
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

        // Fire-and-forget: admin notifications must never block the customer's
        // checkout response. A slow/unreachable SMTP or SMS provider previously
        // hung the order-create request for minutes (ETIMEDOUT on SMTP CONN).
        void sendEmail({
          to: ADMIN_EMAIL,
          subject: `[The Games Ocean] New Order ${doc.orderNumber} — Rs.${doc.total?.toLocaleString()}`,
          html: orderAdminEmailHtml({
            orderNumber: doc.orderNumber,
            total: doc.total,
            paymentMethod: doc.paymentMethod,
            shippingAddress: doc.shippingAddress,
            items: doc.items ?? [],
            notes: doc.notes,
          }),
        }).catch((err) => console.error('[Orders] admin email error:', err))

        void sendAdminSms(
          `Hi Mohsin, new order with order id: ${doc.orderNumber} has fallen, please contact customer`,
        ).catch((err) => console.error('[Orders] admin sms error:', err))

        return doc
      },
    ],
  },
}
