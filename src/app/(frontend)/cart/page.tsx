'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Reveal } from '@/components/ui/reveal'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/providers/cart-provider'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart()

  const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const total = subtotal + shipping
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-center px-4 py-28 text-center sm:px-6 lg:px-8">
        <Reveal>
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-100 text-violet-glow">
            <ShoppingBag size={28} />
          </span>
          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Your cart is empty
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-500">
            Looks like you haven&apos;t added any gear yet. Browse the catalog and find your next upgrade.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-violet-glow px-8 py-4 font-display text-sm font-bold text-white shadow-[0_4px_20px_rgba(124,58,237,0.3)] transition-all hover:brightness-105"
          >
            Start shopping <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <Reveal>
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.25em] text-violet-glow">
          {items.reduce((s, i) => s + i.quantity, 0)} item{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          Your cart
        </h1>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">

        {/* Items */}
        <div className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3 }}
                className="flex gap-4 rounded-2xl border border-surface-200 bg-white p-4 shadow-sm sm:gap-5 sm:p-5"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-100 sm:h-32 sm:w-32">
                  <Image src={item.image} alt={item.title} fill sizes="128px" className="object-cover" />
                </div>

                <div className="flex flex-1 flex-col min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="line-clamp-2 font-display text-sm font-semibold text-ink-800 sm:text-base">
                        {item.title}
                      </p>
                      {item.variantLabel && (
                        <p className="mt-0.5 text-xs text-ink-400">{item.variantLabel}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                      className="shrink-0 text-ink-300 transition-colors hover:text-magenta-glow"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
                    {/* Qty stepper */}
                    <div className="flex items-center gap-2 rounded-xl border border-surface-200 bg-surface-50 px-1 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-white hover:text-ink-900"
                        aria-label="Decrease"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-6 text-center font-display text-sm font-bold text-ink-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-white hover:text-ink-900"
                        aria-label="Increase"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      {item.compareAtPrice && item.compareAtPrice > item.price && (
                        <span className="text-xs text-ink-300 line-through">
                          {formatPrice(item.compareAtPrice * item.quantity)}
                        </span>
                      )}
                      <span className="font-display text-base font-extrabold text-violet-glow">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Link
            href="/shop"
            className="group mt-2 inline-flex items-center gap-1.5 self-start font-display text-sm font-medium text-ink-500 transition-colors hover:text-ink-900"
          >
            <ArrowRight size={15} className="rotate-180 transition-transform group-hover:-translate-x-1" />
            Continue shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm">
            <div className="border-b border-surface-100 px-6 py-4">
              <h2 className="font-display text-base font-bold text-ink-900">Order summary</h2>
            </div>

            <div className="px-6 py-5 space-y-3">
              <div className="flex items-center justify-between text-sm text-ink-500">
                <span>Subtotal</span>
                <span className="font-semibold text-ink-800">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-ink-500">
                <span>Shipping</span>
                {shipping === 0 ? (
                  <span className="font-semibold text-emerald-glow">Free</span>
                ) : (
                  <span className="font-semibold text-ink-800">{formatPrice(shipping)}</span>
                )}
              </div>

              {remaining > 0 ? (
                <div className="flex items-start gap-2.5 rounded-xl bg-surface-50 p-3 text-xs text-ink-500">
                  <Truck size={14} className="mt-0.5 shrink-0 text-violet-glow" />
                  Add <strong className="mx-1 text-ink-800">{formatPrice(remaining)}</strong> more for free delivery.
                </div>
              ) : (
                <div className="flex items-start gap-2.5 rounded-xl bg-emerald-glow/8 p-3 text-xs text-emerald-glow">
                  <Truck size={14} className="mt-0.5 shrink-0" />
                  You&apos;ve unlocked free delivery!
                </div>
              )}

              <div className="flex items-center justify-between border-t border-surface-100 pt-3">
                <span className="font-display font-bold text-ink-900">Total</span>
                <span className="font-display text-xl font-extrabold text-violet-glow">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="px-6 pb-6">
              <Link
                href="/checkout"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-glow py-4 font-display text-sm font-bold uppercase tracking-wider text-white shadow-[0_4px_20px_rgba(124,58,237,0.3)] transition-all hover:brightness-105 hover:shadow-[0_6px_28px_rgba(124,58,237,0.45)]"
              >
                Proceed to checkout
                <ArrowRight size={16} />
              </Link>
              <p className="mt-3 text-center text-xs text-ink-400">
                Cash on delivery available nationwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
