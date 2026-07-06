'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Heart, ShoppingCart, Trash2, ArrowRight, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/ui/reveal'
import { discountPercent, formatPrice, getProductHref } from '@/lib/utils'
import { useCart } from '@/providers/cart-provider'
import { useToast } from '@/providers/toast-provider'
import { useWishlist } from '@/providers/wishlist-provider'

type WishlistProduct = {
  id: number
  title: string
  slug: string
  price: number
  compareAtPrice?: number | null
  rating?: number | null
  reviewCount?: number | null
  status?: string | null
  platform?: { slug?: string | null; name?: string | null } | number | null
  featured?: boolean | null
  category?: Array<{ slug?: string; name?: string } | number> | null
  brand?: { name: string } | number | null
  images?: Array<{ image: { url?: string; alt?: string } | number }> | null
  shortDescription?: string | null
}

const PLATFORM_COLOR: Record<string, string> = {
  playstation: 'text-violet-glow bg-violet-glow/10',
  xbox:        'text-emerald-glow bg-emerald-glow/10',
  switch:      'text-magenta-glow bg-magenta-glow/10',
  universal:   'text-violet-glow bg-violet-glow/10',
}
const PRICE_COLOR: Record<string, string> = {
  playstation: 'text-violet-glow',
  xbox:        'text-emerald-glow',
  switch:      'text-magenta-glow',
  universal:   'text-violet-glow',
}
const BTN_COLOR: Record<string, string> = {
  playstation: 'bg-violet-glow hover:bg-violet-glow/90 shadow-[0_4px_14px_rgba(124,58,237,0.3)]',
  xbox:        'bg-emerald-glow hover:bg-emerald-glow/90 shadow-[0_4px_14px_rgba(5,150,105,0.3)]',
  switch:      'bg-magenta-glow hover:bg-magenta-glow/90 shadow-[0_4px_14px_rgba(219,39,119,0.3)]',
  universal:   'bg-violet-glow hover:bg-violet-glow/90 shadow-[0_4px_14px_rgba(124,58,237,0.3)]',
}

export default function WishlistPage() {
  const { ids, toggle } = useWishlist()
  const { addItem } = useCart()
  const { show } = useToast()
  const [products, setProducts] = useState<WishlistProduct[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (ids.length === 0) { setProducts([]); return }
    setLoading(true)
    fetch(`/api/products?where[id][in]=${ids.join(',')}&depth=2&limit=50`)
      .then((r) => r.json())
      .then((data) => setProducts(data?.docs ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(',')])

  const remove = (id: number, title: string) => {
    toggle(id)
    show({ title: 'Removed from wishlist', description: title, variant: 'info' })
  }

  const addToCart = (p: WishlistProduct) => {
    const imgEntry = p.images?.[0]?.image
    const imgUrl = typeof imgEntry === 'object' && imgEntry?.url ? imgEntry.url : '/placeholder.svg'
    addItem({ productId: p.id, slug: p.slug, title: p.title, image: imgUrl, price: p.price, compareAtPrice: p.compareAtPrice, maxQuantity: 10 })
    show({ title: 'Added to cart', description: p.title, variant: 'success' })
  }

  /* ── Empty state ── */
  if (ids.length === 0) {
    return (
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-center px-4 py-28 text-center sm:px-6 lg:px-8">
        <Reveal>
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-magenta-glow/15 to-violet-glow/10"
          >
            <Heart size={40} className="text-magenta-glow" fill="currentColor" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Your wishlist is empty
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-500">
            Tap the <Heart size={12} className="mx-1 inline text-magenta-glow" fill="currentColor" /> on any product to save it here for later.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-violet-glow px-8 py-4 font-display text-sm font-bold text-white shadow-[0_4px_20px_rgba(124,58,237,0.3)] transition-all hover:brightness-105"
          >
            Browse catalog <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <Reveal>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.25em] text-magenta-glow">
              {ids.length} saved item{ids.length !== 1 ? 's' : ''}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Your wishlist
            </h1>
          </div>
          <Link href="/shop" className="hidden items-center gap-1.5 font-display text-sm font-semibold text-ink-500 transition-colors hover:text-ink-900 sm:flex">
            Keep browsing <ArrowRight size={14} />
          </Link>
        </div>
      </Reveal>

      {/* ── Loading skeletons ── */}
      {loading && (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ids.map((id) => (
            <div key={id} className="h-48 animate-pulse rounded-2xl bg-surface-200" />
          ))}
        </div>
      )}

      {/* ── Product grid ── */}
      {!loading && (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false}>
            {products.map((p, i) => {
              const imgEntry = p.images?.[0]?.image
              const imgUrl = typeof imgEntry === 'object' && imgEntry?.url ? imgEntry.url : '/placeholder.svg'
              const imgAlt = typeof imgEntry === 'object' && imgEntry?.alt ? imgEntry.alt : p.title
              const soldOut = p.status === 'sold-out'
              const href = getProductHref(p)
              const platformObj = typeof p.platform === 'object' ? p.platform : null
              const platform = platformObj?.slug ?? 'universal'
              const discount = discountPercent(p.price, p.compareAtPrice)
              const priceCls = PRICE_COLOR[platform] ?? PRICE_COLOR.universal
              const btnCls = BTN_COLOR[platform] ?? BTN_COLOR.universal
              const platCls = PLATFORM_COLOR[platform] ?? PLATFORM_COLOR.universal

              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.35, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
                >
                  {/* Image */}
                  <Link href={href} className="relative aspect-[16/9] overflow-hidden bg-surface-100">
                    <Image
                      src={imgUrl}
                      alt={imgAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Badges */}
                    <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                      {discount && !soldOut && <Badge variant="sale">-{discount}%</Badge>}
                      {soldOut && <Badge variant="soldout">Sold out</Badge>}
                    </div>
                    {/* Remove button */}
                    <button
                      onClick={() => remove(p.id, p.title)}
                      title="Remove from wishlist"
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-magenta-glow shadow-sm backdrop-blur-sm transition-all hover:bg-magenta-glow hover:text-white"
                    >
                      <Trash2 size={15} />
                    </button>
                  </Link>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    {/* Platform + brand */}
                    <div className="flex items-center justify-between gap-2">
                      {platformObj?.name && platform !== 'universal' && (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-display text-[9px] font-bold uppercase tracking-widest ${platCls}`}>
                          <span className="h-1 w-1 rounded-full bg-current" />
                          {platformObj.name}
                        </span>
                      )}
                      {p.brand && typeof p.brand === 'object' && (
                        <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-ink-300">{p.brand.name}</span>
                      )}
                    </div>

                    {/* Title */}
                    <Link href={href} className="font-display text-[15px] font-bold leading-snug text-ink-800 line-clamp-2 hover:text-ink-950 transition-colors">
                      {p.title}
                    </Link>

                    {/* Short description */}
                    {p.shortDescription && (
                      <p className="line-clamp-2 text-xs leading-relaxed text-ink-400">{p.shortDescription}</p>
                    )}

                    {/* Rating */}
                    {(p.rating ?? 0) > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              size={11}
                              className={idx < Math.round(p.rating ?? 0) ? 'fill-amber-400 text-amber-400' : 'fill-surface-300 text-surface-300'}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-ink-400">({p.reviewCount ?? 0})</span>
                      </div>
                    )}

                    {/* Price + actions */}
                    <div className="mt-auto flex items-center justify-between gap-3 pt-2 border-t border-surface-100">
                      <div className="flex flex-col">
                        {p.compareAtPrice && p.compareAtPrice > p.price && (
                          <span className="text-[11px] text-ink-300 line-through">{formatPrice(p.compareAtPrice)}</span>
                        )}
                        <span className={`font-display text-lg font-extrabold leading-none ${priceCls}`}>
                          {formatPrice(p.price)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={href}
                          className="flex h-10 items-center gap-1.5 rounded-xl border border-surface-300 bg-white px-4 font-display text-xs font-bold text-ink-600 shadow-sm transition-all hover:border-surface-400 hover:text-ink-900"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => addToCart(p)}
                          disabled={soldOut}
                          title="Add to cart"
                          className={`flex h-10 w-10 items-center justify-center rounded-xl text-white transition-all disabled:cursor-not-allowed disabled:opacity-40 ${btnCls}`}
                        >
                          <ShoppingCart size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
