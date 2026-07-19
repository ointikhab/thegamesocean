export const PAYMENT_METHODS = [
  { value: 'cod', label: 'Cash on Delivery' },
  { value: 'easypaisa', label: 'EasyPaisa' },
  { value: 'meezan_bank', label: 'Meezan Bank Transfer' },
] as const

export type PaymentMethodValue = (typeof PAYMENT_METHODS)[number]['value']

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodValue, string> = Object.fromEntries(
  PAYMENT_METHODS.map((m) => [m.value, m.label]),
) as Record<PaymentMethodValue, string>

// Number customers should WhatsApp their payment screenshot + order ID to.
export const PAYMENT_WHATSAPP_NUMBER = '923422904189'
export const PAYMENT_WHATSAPP_DISPLAY = '+92 342 2904189'

export const EASYPAISA_NUMBER = '+92 342 2904189'

export const MEEZAN_ACCOUNT_TITLE = 'THE GAMES OCEAN'
export const MEEZAN_ACCOUNT_NUMBER = '99170113115124'
export const MEEZAN_IBAN = 'PK72MEZN0099170113115124'

export function paymentWhatsAppLink(orderNumber: string) {
  const text = `Hi, here is my payment screenshot for Order ID: ${orderNumber}`
  return `https://wa.me/${PAYMENT_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}
