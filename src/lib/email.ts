import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'omamaintikhab97@gmail.com'

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[]
  subject: string
  html: string
}) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[email] SMTP_USER / SMTP_PASS not configured — skipping send')
    return
  }
  await transporter.sendMail({
    from: `"The Games Ocean" <${process.env.SMTP_USER}>`,
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    html,
  })
}

// ── Templates ─────────────────────────────────────────────────────────────────

export function orderAdminEmailHtml(order: {
  orderNumber: string
  total: number
  shippingAddress: { fullName: string; phone: string; email?: string; line1: string; city: string; province?: string }
  items: { titleSnapshot: string; quantity: number; unitPrice: number; lineTotal: number; variantLabel?: string }[]
  notes?: string
}) {
  const rows = order.items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #2d2d3a;">${i.titleSnapshot}${i.variantLabel ? ` <span style="color:#888;">(${i.variantLabel})</span>` : ''}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #2d2d3a;text-align:center;">${i.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #2d2d3a;text-align:right;">Rs.${i.lineTotal.toLocaleString()}</td>
      </tr>`,
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Order</title></head>
<body style="margin:0;padding:0;background:#0d0d14;font-family:'Segoe UI',Arial,sans-serif;color:#e0e0f0;">
  <div style="max-width:600px;margin:40px auto;background:#16161f;border-radius:16px;overflow:hidden;border:1px solid #2d2d3a;">
    <div style="background:linear-gradient(135deg,#7c3aed,#00e5ff);padding:24px 32px;">
      <h1 style="margin:0;color:#fff;font-size:22px;letter-spacing:0.5px;">🎮 New Order — The Games Ocean</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">${order.orderNumber}</p>
    </div>
    <div style="padding:28px 32px;">
      <h2 style="margin:0 0 16px;font-size:15px;color:#9b5cf6;text-transform:uppercase;letter-spacing:1px;">Customer</h2>
      <p style="margin:4px 0;font-size:14px;"><strong>${order.shippingAddress.fullName}</strong></p>
      <p style="margin:4px 0;font-size:14px;color:#aaa;">${order.shippingAddress.phone}</p>
      ${order.shippingAddress.email ? `<p style="margin:4px 0;font-size:14px;color:#aaa;">${order.shippingAddress.email}</p>` : ''}
      <p style="margin:4px 0;font-size:14px;color:#aaa;">${order.shippingAddress.line1}, ${order.shippingAddress.city}${order.shippingAddress.province ? `, ${order.shippingAddress.province}` : ''}</p>
      ${order.notes ? `<p style="margin:12px 0 0;font-size:13px;color:#888;font-style:italic;">Note: ${order.notes}</p>` : ''}

      <h2 style="margin:28px 0 12px;font-size:15px;color:#9b5cf6;text-transform:uppercase;letter-spacing:1px;">Items</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="color:#666;">
            <th style="padding:8px 12px;text-align:left;border-bottom:1px solid #2d2d3a;">Product</th>
            <th style="padding:8px 12px;text-align:center;border-bottom:1px solid #2d2d3a;">Qty</th>
            <th style="padding:8px 12px;text-align:right;border-bottom:1px solid #2d2d3a;">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <div style="margin-top:20px;text-align:right;">
        <p style="font-size:20px;font-weight:700;color:#7c3aed;margin:0;">Rs.${order.total.toLocaleString()}</p>
        <p style="font-size:12px;color:#666;margin:4px 0 0;">Cash on Delivery</p>
      </div>
    </div>
    <div style="padding:16px 32px;background:#0d0d14;font-size:12px;color:#555;text-align:center;">
      The Games Ocean Admin · <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/orders" style="color:#7c3aed;">View in Admin Panel</a>
    </div>
  </div>
</body>
</html>`
}

export function supportTicketAdminEmailHtml(ticket: {
  id: string
  customerName: string
  customerEmail: string
  subject: string
  message: string
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Support Query</title></head>
<body style="margin:0;padding:0;background:#0d0d14;font-family:'Segoe UI',Arial,sans-serif;color:#e0e0f0;">
  <div style="max-width:600px;margin:40px auto;background:#16161f;border-radius:16px;overflow:hidden;border:1px solid #2d2d3a;">
    <div style="background:linear-gradient(135deg,#00e5ff,#7c3aed);padding:24px 32px;">
      <h1 style="margin:0;color:#fff;font-size:22px;">💬 New Support Query</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">The Games Ocean</p>
    </div>
    <div style="padding:28px 32px;">
      <table style="width:100%;font-size:14px;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#888;width:100px;">From</td><td style="padding:6px 0;"><strong>${ticket.customerName}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#888;">Email</td><td style="padding:6px 0;">${ticket.customerEmail}</td></tr>
        <tr><td style="padding:6px 0;color:#888;">Subject</td><td style="padding:6px 0;">${ticket.subject}</td></tr>
      </table>
      <div style="margin-top:20px;background:#0d0d14;border-radius:10px;padding:16px;border-left:3px solid #00e5ff;">
        <p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap;">${ticket.message}</p>
      </div>
    </div>
    <div style="padding:16px 32px;background:#0d0d14;font-size:12px;color:#555;text-align:center;">
      <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/support-tickets/${ticket.id}" style="color:#7c3aed;">Reply in Admin Panel</a>
    </div>
  </div>
</body>
</html>`
}

export function supportTicketReplyEmailHtml(ticket: {
  customerName: string
  subject: string
  originalMessage: string
  reply: string
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Reply from The Games Ocean</title></head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:'Segoe UI',Arial,sans-serif;color:#1a1a2e;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#7c3aed,#00e5ff);padding:24px 32px;">
      <h1 style="margin:0;color:#fff;font-size:20px;">🎮 The Games Ocean Support</h1>
    </div>
    <div style="padding:28px 32px;">
      <p style="margin:0 0 16px;font-size:15px;">Hi <strong>${ticket.customerName}</strong>,</p>
      <p style="margin:0 0 20px;font-size:14px;color:#555;">We've replied to your query: <strong>${ticket.subject}</strong></p>

      <div style="background:#f8f5ff;border-radius:10px;padding:18px;border-left:4px solid #7c3aed;margin-bottom:20px;">
        <p style="margin:0 0 8px;font-size:11px;color:#7c3aed;text-transform:uppercase;font-weight:700;letter-spacing:1px;">Our reply</p>
        <p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap;">${ticket.reply}</p>
      </div>

      <div style="background:#f5f5f7;border-radius:10px;padding:14px;">
        <p style="margin:0 0 6px;font-size:11px;color:#888;text-transform:uppercase;font-weight:700;letter-spacing:1px;">Your original message</p>
        <p style="margin:0;font-size:13px;color:#888;line-height:1.6;white-space:pre-wrap;">${ticket.originalMessage}</p>
      </div>

      <p style="margin:24px 0 0;font-size:13px;color:#888;">If you have more questions, reply to this email or use the chat widget on our website.</p>
    </div>
    <div style="padding:16px 32px;background:#f5f5f7;font-size:12px;color:#aaa;text-align:center;">
      © The Games Ocean Pakistan · thegamesocean.com
    </div>
  </div>
</body>
</html>`
}

export function supportTicketAckEmailHtml(ticket: { customerName: string; subject: string; message: string }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>We got your message</title></head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:'Segoe UI',Arial,sans-serif;color:#1a1a2e;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#7c3aed,#00e5ff);padding:24px 32px;">
      <h1 style="margin:0;color:#fff;font-size:20px;">🎮 The Games Ocean Support</h1>
    </div>
    <div style="padding:28px 32px;">
      <p style="margin:0 0 12px;font-size:15px;">Hi <strong>${ticket.customerName}</strong>,</p>
      <p style="margin:0 0 20px;font-size:14px;color:#555;">
        Thanks for reaching out! We've received your message and will get back to you within 24 hours.
      </p>
      <div style="background:#f5f5f7;border-radius:10px;padding:14px;margin-bottom:20px;">
        <p style="margin:0 0 4px;font-size:11px;color:#888;text-transform:uppercase;font-weight:700;">Your message</p>
        <p style="margin:0;font-size:13px;color:#666;line-height:1.6;white-space:pre-wrap;">${ticket.message}</p>
      </div>
    </div>
    <div style="padding:16px 32px;background:#f5f5f7;font-size:12px;color:#aaa;text-align:center;">
      © The Games Ocean Pakistan
    </div>
  </div>
</body>
</html>`
}
