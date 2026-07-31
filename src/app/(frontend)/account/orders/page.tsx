'use client'

import { ArrowRight, LogIn, Package, Search, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Badge, type BadgeProps } from '@/components/ui/badge'
import { Reveal } from '@/components/ui/reveal'
import { PAYMENT_METHOD_LABELS } from '@/lib/payment-methods'
import { cn, formatPrice } from '@/lib/utils'
import type { Order } from '@/payload-types'
import { useAuth } from '@/providers/auth-provider'

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const STATUS_VARIANT: Record<string, BadgeProps['variant']> = {
  pending: 'warning',
  processing: 'new',
  shipped: 'hot',
  delivered: 'success',
  cancelled: 'soldout',
}

const INPUT_CLS = cn(
  'w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-sm text-ink-900 outline-none',
  'placeholder:text-ink-300 transition-all focus:border-violet-glow/50 focus:ring-2 focus:ring-violet-glow/15',
)

function OrderCard({ order }: { order: Order }) {
  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-sm font-bold text-ink-900">{order.orderNumber}</p>
          <p className="mt-0.5 text-xs text-ink-400">
            {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
            {' · '}
            {PAYMENT_METHOD_LABELS[order.paymentMethod ?? 'cod'] ?? 'Cash on Delivery'}
          </p>
        </div>
        <Badge variant={STATUS_VARIANT[order.status ?? 'pending']}>
          {STATUS_LABEL[order.status ?? 'pending']}
        </Badge>
      </div>

      <div className="mt-4 flex flex-col gap-1.5 border-t border-surface-100 pt-4">
        {order.items.map((item, i) => (
          <div key={item.id ?? i} className="flex items-center justify-between gap-3 text-xs text-ink-500">
            <span className="line-clamp-1">
              {item.titleSnapshot}
              {item.variantLabel ? ` (${item.variantLabel})` : ''} × {item.quantity}
            </span>
            <span className="shrink-0 font-semibold text-ink-700">{formatPrice(item.lineTotal)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-surface-100 pt-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">Total</span>
        <span className="font-display text-lg font-extrabold text-violet-glow">{formatPrice(order.total)}</span>
      </div>
    </div>
  )
}

function GuestTrackForm() {
  const [orderNumber, setOrderNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<Order | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderNumber.trim() || !phone.trim()) {
      setError('Enter your Order ID and the phone number used at checkout.')
      return
    }
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: orderNumber.trim(), phone: phone.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.message ?? 'No order found matching that Order ID and phone number.')
        return
      }
      setOrder(data.doc)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
      <h2 className="flex items-center gap-2.5 font-display text-base font-bold text-ink-900">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-glow/10 text-violet-glow">
          <Search size={15} />
        </span>
        Track an order without signing in
      </h2>
      <p className="mt-1.5 text-xs text-ink-500">Enter the Order ID and the phone number you used at checkout.</p>

      <form onSubmit={submit} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1.5 block font-display text-xs font-bold uppercase tracking-wider text-ink-500">Order ID</label>
          <input
            value={orderNumber}
            onChange={(e) => { setOrderNumber(e.target.value); setError('') }}
            placeholder="NEX-…"
            className={INPUT_CLS}
          />
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block font-display text-xs font-bold uppercase tracking-wider text-ink-500">Phone number</label>
          <input
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setError('') }}
            placeholder="+92 300 1234567"
            type="tel"
            className={INPUT_CLS}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex h-[46px] shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-glow px-6 font-display text-sm font-bold text-white transition-all hover:brightness-105 disabled:cursor-wait disabled:opacity-70"
        >
          {loading ? 'Searching…' : 'Track order'}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      {order && (
        <div className="mt-6">
          <OrderCard order={order} />
        </div>
      )}
    </div>
  )
}

export default function OrdersPage() {
  const { customer, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!customer) { setLoading(false); return }
    setLoading(true)
    fetch(`/api/orders?where[customer][equals]=${customer.id}&sort=-createdAt&depth=1&limit=50`)
      .then((r) => r.json())
      .then((data) => setOrders(data?.docs ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [customer])

  if (authLoading) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto h-40 max-w-lg animate-pulse rounded-2xl bg-surface-200" />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-14 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-100 text-ink-400">
              <Package size={28} />
            </span>
            <h1 className="mt-6 font-display text-2xl font-bold text-ink-900">Track your order</h1>
            <p className="mt-2 max-w-sm text-sm text-ink-500">
              Sign in to see your full order history, or look up a single order below.
            </p>
            <Link
              href="/login?redirect=/account/orders"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-violet-glow px-6 py-3 font-display text-sm font-bold text-white shadow-[0_4px_20px_rgba(124,58,237,0.3)] transition-all hover:brightness-105"
            >
              <LogIn size={15} /> Sign in
            </Link>
          </div>
        </Reveal>

        <div className="my-10 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-ink-300">
          <span className="h-px flex-1 bg-surface-200" />
          Or
          <span className="h-px flex-1 bg-surface-200" />
        </div>

        <Reveal>
          <GuestTrackForm />
        </Reveal>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <Reveal>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">Your orders</h1>
        <p className="mt-2 text-sm text-ink-500">Track the status of everything you&apos;ve ordered from The Games Ocean.</p>
      </Reveal>

      {loading && (
        <div className="mt-8 flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-surface-200" />
          ))}
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="mt-14 flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-100 text-ink-400">
            <ShoppingBag size={28} />
          </span>
          <h2 className="mt-6 font-display text-xl font-bold text-ink-900">No orders yet</h2>
          <p className="mt-2 max-w-sm text-sm text-ink-500">Once you place an order, you&apos;ll be able to track it here.</p>
          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-violet-glow px-6 py-3 font-display text-sm font-bold text-white shadow-[0_4px_20px_rgba(124,58,237,0.3)] transition-all hover:brightness-105"
          >
            Start shopping <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="mt-8 flex flex-col gap-4">
          {orders.map((order) => (
            <Reveal key={order.id}>
              <OrderCard order={order} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
