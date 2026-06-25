import type { CollectionConfig } from 'payload'

import { ADMIN_EMAIL, sendEmail, supportTicketAckEmailHtml, supportTicketAdminEmailHtml, supportTicketReplyEmailHtml } from '@/lib/email'

export const SupportTickets: CollectionConfig = {
  slug: 'support-tickets',
  access: {
    create: () => true,
    read: ({ req: { user } }) => (user ? true : false),
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.collection === 'users',
  },
  admin: {
    useAsTitle: 'subject',
    group: 'Storefront',
    defaultColumns: ['customerName', 'customerEmail', 'subject', 'status', 'createdAt'],
    description: 'Customer support queries submitted via the chat widget.',
  },
  fields: [
    {
      name: 'customerName',
      type: 'text',
      required: true,
      label: 'Customer Name',
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
      label: 'Customer Email',
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      admin: { rows: 5 },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'open',
      admin: { position: 'sidebar' },
      options: [
        { label: '🟡 Open', value: 'open' },
        { label: '✉️ Replied', value: 'replied' },
        { label: '✅ Closed', value: 'closed' },
      ],
    },
    {
      name: 'reply',
      type: 'textarea',
      label: 'Reply to Customer',
      admin: {
        rows: 6,
        description: 'Write your reply here — saving will automatically email the customer.',
      },
    },
    {
      name: 'repliedAt',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [
      async ({ doc, operation, previousDoc }) => {
        try {
          if (operation === 'create') {
            // Notify admin of new ticket
            await sendEmail({
              to: ADMIN_EMAIL,
              subject: `[NEXORA Support] New query from ${doc.customerName}: ${doc.subject}`,
              html: supportTicketAdminEmailHtml({
                id: doc.id,
                customerName: doc.customerName,
                customerEmail: doc.customerEmail,
                subject: doc.subject,
                message: doc.message,
              }),
            })

            // Acknowledge customer
            await sendEmail({
              to: doc.customerEmail,
              subject: `We received your message — NEXORA Gaming`,
              html: supportTicketAckEmailHtml({
                customerName: doc.customerName,
                subject: doc.subject,
                message: doc.message,
              }),
            })
          }

          if (operation === 'update' && doc.reply && doc.reply !== previousDoc?.reply) {
            // Send reply email to customer
            await sendEmail({
              to: doc.customerEmail,
              subject: `Re: ${doc.subject} — NEXORA Gaming Support`,
              html: supportTicketReplyEmailHtml({
                customerName: doc.customerName,
                subject: doc.subject,
                originalMessage: doc.message,
                reply: doc.reply,
              }),
            })
          }
        } catch (err) {
          console.error('[SupportTickets] email error:', err)
        }

        return doc
      },
    ],
  },
}
