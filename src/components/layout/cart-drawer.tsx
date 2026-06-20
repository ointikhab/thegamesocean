'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/providers/cart-provider'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart()

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : SHIPPING_FEE
  const total = subtotal + shipping
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-ink-900/20 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-[81] flex h-full w-full max-w-md flex-col bg-white shadow-[0_0_60px_rgba(0,0,0,0.12)] outline-none">

          {/* Top accent */}
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-violet-glow via-cyan-glow to-magenta-glow rounded-t" />

          <Dialog.Title asChild>
            <div className="flex items-center justify-between border-b border-surface-200 px-6 py-5 mt-0.5">
              <h2 className="flex items-center gap-2.5 font-display text-lg font-bold text-ink-900">
                <ShoppingBag size={20} className="text-violet-glow" />
                Your cart
                {itemCount > 0 && (
                  <span className="rounded-full bg-violet-glow/10 px-2 py-0.5 font-display text-xs font-bold text-violet-glow">
                    {itemCount}
                  </span>
                )}
              </h2>
              <Dialog.Close asChild>
                <button
                  aria-label="Close cart"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-400 transition-colors hover:bg-surface-100 hover:text-ink-900"
                >
                  <X size={20} />
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Title>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-100">
                <ShoppingBag size={32} className="text-ink-300" />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-ink-900">Your cart is empty</p>
                <p className="mt-1 text-sm text-ink-400">Looks like you haven&apos;t added anything yet.</p>
              </div>
              <Dialog.Close asChild>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-2xl bg-violet-glow px-6 py-3 font-display text-sm font-bold text-white shadow-[0_4px_16px_rgba(124,58,237,0.3)] transition-all hover:brightness-105"
                >
                  Browse catalog
                </Link>
              </Dialog.Close>
            </div>
          ) : (
            <>
              {/* Free shipping progress */}
              {remaining > 0 && (
                <div className="flex items-center gap-2.5 border-b border-surface-100 bg-surface-50 px-5 py-3 text-xs text-ink-500">
                  <Truck size={13} className="shrink-0 text-violet-glow" />
                  Add <strong className="mx-1 text-ink-800">{formatPrice(remaining)}</strong> more for free delivery
                </div>
              )}
              {remaining === 0 && items.length > 0 && (
                <div className="flex items-center gap-2.5 border-b border-emerald-glow/20 bg-emerald-glow/5 px-5 py-3 text-xs text-emerald-glow">
                  <Truck size={13} className="shrink-0" />
                  You&apos;ve unlocked free delivery!
                </div>
              )}

              {/* Item list */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <ul className="flex flex-col gap-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20, transition: { duration: 0.18 } }}
                        className="flex gap-4"
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-100">
                          <Image src={item.image} alt={item.title} fill sizes="80px" className="object-cover" />
                        </div>
                        <div className="flex flex-1 flex-col min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <Link
                                href={`/products/${item.slug}`}
                                onClick={closeCart}
                                className="line-clamp-2 font-display text-sm font-semibold text-ink-800 hover:text-ink-950"
                              >
                                {item.title}
                              </Link>
                              {item.variantLabel && (
                                <p className="mt-0.5 text-[11px] text-ink-400">{item.variantLabel}</p>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              aria-label="Remove item"
                              className="shrink-0 text-ink-300 transition-colors hover:text-magenta-glow"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            {/* Qty */}
                            <div className="flex items-center gap-1.5 rounded-xl border border-surface-200 bg-surface-50 px-1 py-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-white hover:text-ink-900"
                                aria-label="Decrease"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-5 text-center font-display text-sm font-bold text-ink-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-white hover:text-ink-900"
                                aria-label="Increase"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="font-display text-sm font-extrabold text-violet-glow">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>

              {/* Footer */}
              <div className="border-t border-surface-200 px-5 py-5 space-y-3">
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
                <div className="flex items-center justify-between border-t border-surface-100 pt-3">
                  <span className="font-display font-bold text-ink-900">Total</span>
                  <span className="font-display text-lg font-extrabold text-violet-glow">{formatPrice(total)}</span>
                </div>

                <div className="flex flex-col gap-2.5 pt-1">
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-violet-glow py-3.5 font-display text-sm font-bold text-white shadow-[0_4px_16px_rgba(124,58,237,0.3)] transition-all hover:brightness-105"
                  >
                    Checkout · {formatPrice(total)}
                    <ArrowRight size={15} />
                  </Link>
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="flex items-center justify-center rounded-2xl border border-surface-300 bg-white py-3.5 font-display text-sm font-semibold text-ink-700 transition-all hover:border-surface-400 hover:text-ink-900"
                  >
                    View full cart
                  </Link>
                </div>
                <p className="text-center text-[11px] text-ink-400">
                  Cash on delivery · Free returns in 7 days
                </p>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
