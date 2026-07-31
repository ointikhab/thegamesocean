'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, ChevronRight, MapPin, Phone, ShoppingBag, Truck, User, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { Reveal } from '@/components/ui/reveal'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/lib/constants'
import {
  EASYPAISA_NUMBER,
  MEEZAN_ACCOUNT_NUMBER,
  MEEZAN_ACCOUNT_TITLE,
  MEEZAN_IBAN,
  PAYMENT_WHATSAPP_DISPLAY,
  type PaymentMethodValue,
  paymentWhatsAppLink,
} from '@/lib/payment-methods'
import { cn, formatPrice } from '@/lib/utils'
import { useAuth } from '@/providers/auth-provider'
import { useCart } from '@/providers/cart-provider'
import { useToast } from '@/providers/toast-provider'

const PAYMENT_OPTIONS: { value: PaymentMethodValue; title: string; desc: string }[] = [
  { value: 'cod', title: 'Cash on Delivery (COD)', desc: 'Pay when your order arrives at your door.' },
  { value: 'easypaisa', title: 'EasyPaisa', desc: 'Transfer to our EasyPaisa account, then confirm via WhatsApp.' },
  { value: 'meezan_bank', title: 'Meezan Bank Transfer', desc: 'Bank transfer to our Meezan Bank account.' },
]

type FormData = {
  firstName: string
  lastName: string
  phone: string
  email: string
  address: string
  city: string
  province: string
  postalCode: string
  notes: string
}

const PROVINCES = [
  'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan',
  'Islamabad Capital Territory', 'Azad Jammu & Kashmir', 'Gilgit-Baltistan',
]

const INPUT_CLS = cn(
  'w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-sm text-ink-900 outline-none',
  'placeholder:text-ink-300 transition-all',
  'focus:border-violet-glow/50 focus:ring-2 focus:ring-violet-glow/15',
)

const LABEL_CLS = 'mb-1.5 block font-display text-xs font-bold uppercase tracking-wider text-ink-500'

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const { customer } = useAuth()
  const { show } = useToast()

  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', phone: '', email: '',
    address: '', city: '', province: '', postalCode: '', notes: '',
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodValue>('cod')
  const [placing, setPlacing] = useState(false)
  const [placed, setPlaced] = useState(false)
  const [placedOrderNumber, setPlacedOrderNumber] = useState('')
  const [placedTotal, setPlacedTotal] = useState(0)

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : SHIPPING_FEE
  const total = subtotal + shipping

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: undefined }))
  }

  const validate = (): boolean => {
    const e: Partial<FormData> = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.phone.trim()) e.phone = 'Required'
    if (!form.address.trim()) e.address = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.province) e.province = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const placeOrder = async () => {
    if (!validate()) return
    setPlacing(true)

    const orderNumber = `NEX-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`

    const payload = {
      orderNumber,
      status: 'pending',
      paymentMethod,
      customer: customer?.id,
      items: items.map((item) => ({
        product: item.productId,
        titleSnapshot: item.title,
        variantLabel: item.variantLabel ?? undefined,
        imageUrl: item.image,
        quantity: item.quantity,
        unitPrice: item.price,
        lineTotal: item.price * item.quantity,
      })),
      subtotal,
      shippingCost: shipping,
      total,
      shippingAddress: {
        fullName: `${form.firstName} ${form.lastName}`.trim(),
        phone: form.phone,
        email: form.email || undefined,
        line1: form.address,
        city: form.city,
        province: form.province,
        postalCode: form.postalCode || undefined,
        country: 'Pakistan',
      },
      notes: form.notes || undefined,
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.message ?? `HTTP ${res.status}`)
      }

      setPlacedOrderNumber(orderNumber)
      setPlacedTotal(total)
      clearCart()
      setPlaced(true)
      show({
        title: 'Order placed!',
        description:
          paymentMethod === 'cod'
            ? "We'll contact you to confirm your COD delivery."
            : 'Please complete your transfer and send us the screenshot on WhatsApp.',
        variant: 'success',
      })
    } catch (err) {
      show({ title: 'Something went wrong', description: String(err), variant: 'info' })
    } finally {
      setPlacing(false)
    }
  }

  if (items.length === 0 && !placed) {
    return (
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-center px-4 py-28 text-center sm:px-6 lg:px-8">
        <Reveal>
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-100 text-ink-400">
            <ShoppingBag size={28} />
          </span>
          <h1 className="mt-6 font-display text-2xl font-bold text-ink-900">Your cart is empty</h1>
          <p className="mt-2 text-sm text-ink-500">Add some products before checking out.</p>
          <Link href="/shop" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-violet-glow px-6 py-3 font-display text-sm font-bold text-white shadow-[0_4px_20px_rgba(124,58,237,0.3)] transition-all hover:brightness-105">
            Continue shopping
          </Link>
        </Reveal>
      </div>
    )
  }

  if (placed) {
    const isTransfer = paymentMethod === 'easypaisa' || paymentMethod === 'meezan_bank'
    return (
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-center px-4 py-28 text-center sm:px-6 lg:px-8">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 0.6 }}>
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-glow/10 text-emerald-glow">
            <CheckCircle size={40} />
          </span>
          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Order confirmed!
          </h1>
          <p className="mt-3 font-display text-sm font-bold uppercase tracking-wider text-violet-glow">
            Order ID: {placedOrderNumber}
          </p>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-500">
            {paymentMethod === 'cod' ? (
              <>
                Thank you, <strong className="text-ink-800">{form.firstName}</strong>! Your order will be delivered to{' '}
                <strong className="text-ink-800">{form.city}</strong> via Cash on Delivery. We'll call to confirm.
              </>
            ) : (
              <>
                Thank you, <strong className="text-ink-800">{form.firstName}</strong>! Please complete your{' '}
                {paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'Meezan Bank'} transfer of{' '}
                <strong className="text-ink-800">{formatPrice(placedTotal)}</strong> and send the payment screenshot
                along with your Order ID on WhatsApp to confirm it.
              </>
            )}
          </p>

          {isTransfer && (
            <div className="mx-auto mt-5 max-w-sm rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left text-xs leading-relaxed text-amber-900">
              {paymentMethod === 'easypaisa' ? (
                <p>
                  EasyPaisa account: <strong>{EASYPAISA_NUMBER}</strong>
                </p>
              ) : (
                <div className="space-y-1">
                  <p>
                    Account title: <strong>{MEEZAN_ACCOUNT_TITLE}</strong>
                  </p>
                  <p>
                    Account number: <strong>{MEEZAN_ACCOUNT_NUMBER}</strong>
                  </p>
                  <p>
                    IBAN: <strong>{MEEZAN_IBAN}</strong>
                  </p>
                </div>
              )}
              <p className="mt-3">
                Send the screenshot + Order ID to WhatsApp <strong>{PAYMENT_WHATSAPP_DISPLAY}</strong>:
              </p>
              <a
                href={paymentWhatsAppLink(placedOrderNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 font-display text-xs font-bold text-white transition-all hover:bg-emerald-600"
              >
                Send screenshot on WhatsApp
              </a>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 rounded-2xl border border-surface-300 bg-white px-6 py-3 font-display text-sm font-bold text-ink-700 shadow-sm transition-all hover:shadow-md">
              Back to home
            </Link>
            <Link href="/shop" className="inline-flex items-center gap-2 rounded-2xl bg-violet-glow px-6 py-3 font-display text-sm font-bold text-white shadow-[0_4px_20px_rgba(124,58,237,0.3)] transition-all hover:brightness-105">
              Keep shopping
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-xs text-ink-400">
        <Link href="/cart" className="hover:text-ink-900 transition-colors">Cart</Link>
        <ChevronRight size={12} className="text-ink-300" />
        <span className="font-medium text-ink-700">Checkout</span>
      </nav>

      <h1 className="mb-10 font-display text-3xl font-bold tracking-tight text-ink-900">Checkout</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">

        {/* ── Shipping form ── */}
        <div className="flex flex-col gap-8">

          {/* Contact */}
          <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2.5 font-display text-base font-bold text-ink-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-glow/10 text-violet-glow"><User size={15} /></span>
              Contact details
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={LABEL_CLS}>First name *</label>
                <input value={form.firstName} onChange={set('firstName')} placeholder="Ayesha" className={cn(INPUT_CLS, errors.firstName && 'border-red-400 ring-2 ring-red-100')} />
                {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
              </div>
              <div>
                <label className={LABEL_CLS}>Last name *</label>
                <input value={form.lastName} onChange={set('lastName')} placeholder="Khan" className={cn(INPUT_CLS, errors.lastName && 'border-red-400 ring-2 ring-red-100')} />
                {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
              </div>
              <div>
                <label className={LABEL_CLS}>Phone number *</label>
                <input value={form.phone} onChange={set('phone')} placeholder="+92 300 1234567" type="tel" className={cn(INPUT_CLS, errors.phone && 'border-red-400 ring-2 ring-red-100')} />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>
              <div>
                <label className={LABEL_CLS}>Email (optional)</label>
                <input value={form.email} onChange={set('email')} placeholder="ayesha@example.com" type="email" className={INPUT_CLS} />
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2.5 font-display text-base font-bold text-ink-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-glow/10 text-violet-glow"><MapPin size={15} /></span>
              Delivery address
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className={LABEL_CLS}>Street address *</label>
                <input value={form.address} onChange={set('address')} placeholder="House 12, Street 4, DHA Phase 6" className={cn(INPUT_CLS, errors.address && 'border-red-400 ring-2 ring-red-100')} />
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className={LABEL_CLS}>City *</label>
                  <input value={form.city} onChange={set('city')} placeholder="Lahore" className={cn(INPUT_CLS, errors.city && 'border-red-400 ring-2 ring-red-100')} />
                  {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                </div>
                <div>
                  <label className={LABEL_CLS}>Province *</label>
                  <select value={form.province} onChange={set('province')} className={cn(INPUT_CLS, 'cursor-pointer', errors.province && 'border-red-400 ring-2 ring-red-100')}>
                    <option value="">Select…</option>
                    {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                  {errors.province && <p className="mt-1 text-xs text-red-500">{errors.province}</p>}
                </div>
                <div>
                  <label className={LABEL_CLS}>Postal code</label>
                  <input value={form.postalCode} onChange={set('postalCode')} placeholder="54000" className={INPUT_CLS} />
                </div>
              </div>
              <div>
                <label className={LABEL_CLS}>Order notes (optional)</label>
                <textarea value={form.notes} onChange={set('notes')} rows={2} placeholder="Special instructions for delivery…" className={cn(INPUT_CLS, 'resize-none')} />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2.5 font-display text-base font-bold text-ink-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-glow/10 text-violet-glow"><Phone size={15} /></span>
              Payment method
            </h2>
            <div className="flex flex-col gap-2.5">
              {PAYMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPaymentMethod(opt.value)}
                  className={cn(
                    'flex items-start gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-all',
                    paymentMethod === opt.value
                      ? 'border-violet-glow/40 bg-violet-glow/5'
                      : 'border-surface-200 hover:border-surface-300',
                  )}
                >
                  <div
                    className={cn(
                      'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                      paymentMethod === opt.value ? 'border-violet-glow' : 'border-surface-300',
                    )}
                  >
                    {paymentMethod === opt.value && <div className="h-2.5 w-2.5 rounded-full bg-violet-glow" />}
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold text-ink-900">{opt.title}</p>
                    <p className="text-xs text-ink-500">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {paymentMethod !== 'cod' && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
                {paymentMethod === 'easypaisa' ? (
                  <p>
                    Send <strong>{formatPrice(total)}</strong> to EasyPaisa account <strong>{EASYPAISA_NUMBER}</strong>.
                  </p>
                ) : (
                  <div className="space-y-0.5">
                    <p>
                      Transfer <strong>{formatPrice(total)}</strong> to:
                    </p>
                    <p>
                      Account title: <strong>{MEEZAN_ACCOUNT_TITLE}</strong>
                    </p>
                    <p>
                      Account number: <strong>{MEEZAN_ACCOUNT_NUMBER}</strong>
                    </p>
                    <p>
                      IBAN: <strong>{MEEZAN_IBAN}</strong>
                    </p>
                  </div>
                )}
                <p className="mt-2">
                  After placing your order, send the payment screenshot along with your Order ID on WhatsApp to{' '}
                  <strong>{PAYMENT_WHATSAPP_DISPLAY}</strong> so we can confirm it.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Order summary ── */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-surface-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-surface-200 px-6 py-4">
              <h2 className="font-display text-base font-bold text-ink-900">Order summary</h2>
            </div>

            {/* Items */}
            <ul className="max-h-72 overflow-y-auto divide-y divide-surface-100 px-6">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-3.5">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-100">
                    <Image src={item.image} alt={item.title} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="line-clamp-1 font-display text-xs font-semibold text-ink-800">{item.title}</p>
                    {item.variantLabel && <p className="text-[10px] text-ink-400">{item.variantLabel}</p>}
                    <p className="text-[10px] text-ink-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="shrink-0 font-display text-sm font-bold text-ink-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Totals */}
            <div className="border-t border-surface-200 px-6 py-5 space-y-3">
              <div className="flex justify-between text-sm text-ink-500">
                <span>Subtotal</span>
                <span className="font-semibold text-ink-800">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-ink-500">
                <span>Shipping</span>
                {shipping === 0 ? (
                  <span className="font-semibold text-emerald-glow">Free</span>
                ) : (
                  <span className="font-semibold text-ink-800">{formatPrice(shipping)}</span>
                )}
              </div>
              {shipping > 0 && (
                <div className="flex items-start gap-2 rounded-xl bg-surface-50 px-3 py-2.5 text-xs text-ink-500">
                  <Truck size={13} className="mt-0.5 shrink-0 text-violet-glow" />
                  Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free delivery
                </div>
              )}
              <div className="flex justify-between border-t border-surface-200 pt-3">
                <span className="font-display font-bold text-ink-900">Total</span>
                <span className="font-display text-xl font-extrabold text-violet-glow">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={placeOrder}
                disabled={placing}
                className="relative flex w-full items-center justify-center gap-2.5 rounded-2xl bg-violet-glow py-4 font-display text-sm font-bold uppercase tracking-wider text-white shadow-[0_4px_20px_rgba(124,58,237,0.35)] transition-all hover:shadow-[0_6px_28px_rgba(124,58,237,0.5)] hover:brightness-105 disabled:cursor-wait disabled:opacity-70"
              >
                <AnimatePresence mode="wait">
                  {placing ? (
                    <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Placing order…
                    </motion.span>
                  ) : (
                    <motion.span key="place" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <Zap size={15} />
                      Place order — {formatPrice(total)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <p className="mt-3 text-center text-[11px] text-ink-400">
                {paymentMethod === 'cod' ? 'Cash on delivery' : paymentMethod === 'easypaisa' ? 'EasyPaisa transfer' : 'Bank transfer'} · Taxes included · 7-day returns
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
