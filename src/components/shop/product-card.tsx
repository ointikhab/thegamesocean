'use client'

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Heart, ShoppingCart, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { RatingStars } from '@/components/ui/rating-stars'
import { resolveImage } from '@/lib/media'
import { cn, discountPercent, formatPrice, getProductHref } from '@/lib/utils'
import type { Product } from '@/payload-types'
import { useCart } from '@/providers/cart-provider'
import { useToast } from '@/providers/toast-provider'
import { useWishlist } from '@/providers/wishlist-provider'

const platformCfg: Record<string, {
  bar: string
  accent: string
  accentRgb: string
  accentLight: string
  priceCls: string
  ctaBg: string
  label: string
  labelCls: string
}> = {
  playstation: {
    bar: 'accent-ps',
    accent: '#7c3aed',
    accentRgb: '124,58,237',
    accentLight: 'rgba(124,58,237,0.07)',
    priceCls: 'text-violet-glow',
    ctaBg: 'bg-violet-glow hover:bg-violet-glow/90',
    label: 'PlayStation',
    labelCls: 'text-violet-glow bg-violet-glow/10',
  },
  xbox: {
    bar: 'accent-xbox',
    accent: '#059669',
    accentRgb: '5,150,105',
    accentLight: 'rgba(5,150,105,0.06)',
    priceCls: 'text-emerald-glow',
    ctaBg: 'bg-emerald-glow hover:bg-emerald-glow/90',
    label: 'Xbox',
    labelCls: 'text-emerald-glow bg-emerald-glow/10',
  },
  switch: {
    bar: 'accent-switch',
    accent: '#db2777',
    accentRgb: '219,39,119',
    accentLight: 'rgba(219,39,119,0.06)',
    priceCls: 'text-magenta-glow',
    ctaBg: 'bg-magenta-glow hover:bg-magenta-glow/90',
    label: 'Nintendo Switch',
    labelCls: 'text-magenta-glow bg-magenta-glow/10',
  },
  pc: {
    bar: 'accent-pc',
    accent: '#0891b2',
    accentRgb: '8,145,178',
    accentLight: 'rgba(8,145,178,0.06)',
    priceCls: 'text-cyan-glow',
    ctaBg: 'bg-cyan-glow hover:bg-cyan-glow/90',
    label: 'PC',
    labelCls: 'text-cyan-glow bg-cyan-glow/10',
  },
  universal: {
    bar: 'accent-universal',
    accent: '#7c3aed',
    accentRgb: '124,58,237',
    accentLight: 'rgba(124,58,237,0.06)',
    priceCls: 'text-violet-glow',
    ctaBg: 'bg-violet-glow hover:bg-violet-glow/90',
    label: 'Universal',
    labelCls: 'text-violet-glow bg-violet-glow/10',
  },
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [added, setAdded] = useState(false)

  /* subtle 3-D tilt */
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sp = { stiffness: 300, damping: 30 }
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [3, -3]), sp)
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-3, 3]), sp)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left - r.width / 2) / r.width)
    my.set((e.clientY - r.top - r.height / 2) / r.height)
    if (!hovered) setHovered(true)
  }
  const onLeave = () => { mx.set(0); my.set(0); setHovered(false) }

  const primary = resolveImage(
    typeof product.images?.[0]?.image === 'object' ? product.images[0].image : null, 'card',
  )
  const secondary =
    product.images && product.images.length > 1 && typeof product.images[1].image === 'object'
      ? resolveImage(product.images[1].image, 'card')
      : null

  const discount = discountPercent(product.price, product.compareAtPrice)
  const soldOut = product.status === 'sold-out' || (product.stock ?? 0) <= 0
  const lowStock = !soldOut && (product.stock ?? 0) > 0 && (product.stock ?? 0) < 5

  const { addItem } = useCart()
  const { show } = useToast()
  const { has, toggle } = useWishlist()
  const wishlisted = has(product.id)

  const platform = product.platform || 'universal'
  const c = platformCfg[platform] ?? platformCfg.universal

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (soldOut) return
    addItem({
      productId: product.id, slug: product.slug, title: product.title,
      image: primary.url, price: product.price, compareAtPrice: product.compareAtPrice,
      maxQuantity: product.stock || 10,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
    show({ title: 'Added to cart', description: product.title, variant: 'success' })
  }

  const wishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    toggle(product.id)
    show({ title: wishlisted ? 'Removed from wishlist' : 'Added to wishlist', description: product.title, variant: 'info' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.065, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1100 }}
      className="h-full"
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="h-full"
      >
        <Link
          href={getProductHref(product)}
          className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white"
          style={{
            /* no border — shape defined purely by shadow */
            boxShadow: hovered && !soldOut
              ? `0 0 0 1.5px ${c.accent}33, 0 8px 16px rgba(0,0,0,0.06), 0 24px 64px -12px rgba(${c.accentRgb},0.22)`
              : '0 2px 4px rgba(0,0,0,0.04), 0 8px 24px -6px rgba(0,0,0,0.10)',
            transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
            transition: 'box-shadow 0.35s ease, transform 0.35s ease',
          }}
        >
          {/* ── Platform accent bar ── */}
          <div className="relative h-1 w-full shrink-0 overflow-hidden">
            <div className={cn('h-full w-full', c.bar)} />
            <AnimatePresence>
              {hovered && (
                <motion.div
                  key="sparkle"
                  className="absolute inset-y-0 w-20 blur-sm"
                  initial={{ left: '-80px' }}
                  animate={{ left: '110%' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.65, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.7 }}
                  style={{ background: `linear-gradient(90deg, transparent, ${c.accent}dd, transparent)` }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* ── IMAGE — square, wide, fills the card ── */}
          <div className="relative aspect-square overflow-hidden bg-surface-100">

            <Image
              src={primary.url}
              alt={primary.alt || product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className={cn(
                'object-cover transition-all duration-700 ease-out',
                hovered ? 'scale-[1.06]' : 'scale-100',
                secondary && hovered ? 'opacity-0' : 'opacity-100',
              )}
            />

            {secondary && (
              <Image
                src={secondary.url}
                alt={secondary.alt || product.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className={cn(
                  'absolute inset-0 object-cover transition-all duration-700 ease-out',
                  hovered ? 'opacity-100 scale-[1.06]' : 'opacity-0 scale-100',
                )}
              />
            )}

            {/* bottom vignette */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />

            {/* shine sweep */}
            <motion.div
              className="pointer-events-none absolute inset-y-0 w-2/5"
              initial={{ x: '-100%' }}
              animate={hovered ? { x: '320%' } : { x: '-100%' }}
              transition={hovered ? { duration: 0.55, ease: [0.4, 0, 0.2, 1] } : { duration: 0 }}
              style={{ background: 'linear-gradient(105deg, transparent, rgba(255,255,255,0.42), transparent)' }}
            />

            {/* badges — top left */}
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              {discount && !soldOut && <Badge variant="sale">-{discount}%</Badge>}
              {product.featured && !soldOut && <Badge variant="featured">Featured</Badge>}
              {soldOut && <Badge variant="soldout">Sold out</Badge>}
            </div>

            {/* wishlist — top right */}
            <motion.button
              onClick={wishlistToggle}
              aria-label="Toggle wishlist"
              whileTap={{ scale: 0.72 }}
              animate={{ scale: wishlisted ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl backdrop-blur-md transition-all duration-200',
                wishlisted
                  ? 'bg-magenta-glow text-white shadow-[0_4px_16px_rgba(219,39,119,0.5)]'
                  : 'bg-white/85 text-ink-400 shadow-sm hover:bg-white hover:text-magenta-glow hover:shadow-md',
              )}
            >
              <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
            </motion.button>

            {/* platform chip — bottom left */}
            <span className={cn(
              'absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[9px] font-bold uppercase tracking-widest backdrop-blur-sm',
              c.labelCls,
            )}>
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />
              {c.label}
            </span>
          </div>

          {/* ── INFO ZONE ── */}
          <div className="flex flex-1 flex-col gap-2.5 p-5">

            {/* brand */}
            {product.brand && typeof product.brand === 'object' && (
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-300">
                {product.brand.name}
              </p>
            )}

            {/* title */}
            <h3 className="line-clamp-2 font-display text-[15px] font-bold leading-snug text-ink-800 transition-colors duration-200 group-hover:text-ink-950">
              {product.title}
            </h3>

            {/* short description */}
            {product.shortDescription && (
              <p className="line-clamp-2 text-[12px] leading-relaxed text-ink-400">
                {product.shortDescription}
              </p>
            )}

            {/* rating */}
            {(product.rating ?? 0) > 0 && (
              <div className="flex items-center gap-1.5">
                <RatingStars rating={product.rating ?? 0} size={12} />
                <span className="text-[11px] font-medium text-ink-300">({product.reviewCount ?? 0})</span>
              </div>
            )}

            {/* price + stock */}
            <div className="mt-auto flex items-end justify-between pt-1">
              <div className="flex flex-col gap-0.5">
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-[11px] text-ink-300 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                <motion.span
                  animate={hovered ? { scale: 1.04 } : { scale: 1 }}
                  transition={{ duration: 0.18 }}
                  className={cn('font-display text-[19px] font-extrabold leading-none tracking-tight', c.priceCls)}
                >
                  {formatPrice(product.price)}
                </motion.span>
              </div>

              <div className="mb-0.5 flex items-center gap-1.5">
                <span className={cn(
                  'h-2 w-2 rounded-full',
                  soldOut ? 'bg-ink-200'
                  : lowStock ? 'bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.65)]'
                  : 'bg-emerald-glow shadow-[0_0_5px_rgba(5,150,105,0.65)]',
                )} />
                <span className="text-[10px] font-semibold text-ink-400">
                  {soldOut ? 'Out of stock' : lowStock ? 'Low stock' : 'In stock'}
                </span>
              </div>
            </div>

            {/* ── Add to Cart ── */}
            <motion.button
              onClick={quickAdd}
              disabled={soldOut}
              whileTap={!soldOut ? { scale: 0.97 } : {}}
              className={cn(
                'mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl font-display text-[12px] font-bold uppercase tracking-wider text-white transition-all duration-200',
                soldOut
                  ? 'cursor-not-allowed bg-surface-200 text-ink-300'
                  : added
                  ? 'bg-emerald-glow shadow-[0_4px_20px_rgba(5,150,105,0.4)]'
                  : `${c.ctaBg} shadow-[0_4px_14px_rgba(${c.accentRgb},0.28)] hover:shadow-[0_6px_20px_rgba(${c.accentRgb},0.4)]`,
              )}
            >
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center gap-2"
                  >
                    <Zap size={13} />
                    Added to cart!
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart size={13} />
                    {soldOut ? 'Unavailable' : 'Add to Cart'}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}
