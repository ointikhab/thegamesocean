const SMS_API_URL = process.env.SMS_API_URL || 'https://sandbox-api.veevotech.com/v3/sendsms'
const SMS_API_HASH = process.env.SMS_API_HASH
const ADMIN_PHONE = process.env.ADMIN_PHONE

export async function sendAdminSms(message: string) {
  if (!SMS_API_HASH || !ADMIN_PHONE) {
    console.warn('[sms] SMS_API_HASH / ADMIN_PHONE not configured — skipping send')
    return
  }

  const res = await fetch(SMS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hash: SMS_API_HASH,
      receivernum: ADMIN_PHONE,
      textmessage: message,
    }),
  })

  if (!res.ok) {
    throw new Error(`[sms] API returned ${res.status}: ${await res.text()}`)
  }
}
