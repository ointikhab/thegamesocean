'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Minus, Plus, RotateCcw, ShieldCheck, ShoppingCart, Truck, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RatingStars } from '@/components/ui/rating-stars'
import { resolveImage } from '@/lib/media'
import { cn, discountPercent, formatPrice } from '@/lib/utils'
import type { Product } from '@/payload-types'
import { useCart } from '@/providers/cart-provider'
import { useToast } from '@/providers/toast-provider'
import { useWishlist } from '@/providers/wishlist-provider'

/* ─────────────────────────────────────────────────────────────
   Colour swatch detection
───────────────────────────────────────────────────────────── */
const COLOR_TOKENS: Record<string, string> = {
  'midnight black': '#111111', 'jet black': '#0d0d0d', 'black': '#1a1a1a',
  'glacier white': '#e8f2f8', 'robot white': '#f0f0f0', 'white': '#f5f5f5',
  'cosmic red': '#c0392b', 'volcanic red': '#9b1c1c', 'magma red': '#b91c1c', 'red': '#dc2626',
  'starlight blue': '#60a5fa', 'cobalt blue': '#1d4ed8', 'shock blue': '#3b82f6', 'blue': '#2563eb',
  'galactic purple': '#8b5cf6', 'purple': '#7c3aed',
  'nova pink': '#ec4899', 'pink': '#db2777',
  'gray camouflage': '#78716c', 'sterling silver': '#9ca3af', 'silver': '#c0c0c0',
  'gray': '#6b7280', 'grey': '#6b7280',
  'velocity green': '#22c55e', 'green': '#16a34a',
  'neon red': '#ef4444', 'neon blue': '#60a5fa',
  'gold': '#d97706', 'amber': '#f59e0b',
  'teal': '#0d9488', 'indigo': '#4f46e5',
  'coral': '#f97316', 'orange': '#ea580c',
  'cobalt': '#1d4ed8', 'steel': '#9ca3af',
}

function getSwatchColor(label: string): string | null {
  const l = label.toLowerCase()
  // longest match wins
  let best: [string, string] | null = null
  for (const [key, val] of Object.entries(COLOR_TOKENS)) {
    if (l.includes(key)) {
      if (!best || key.length > best[0].length) best = [key, val]
    }
  }
  return best ? best[1] : null
}

function isColorLabel(label: string) { return getSwatchColor(label) !== null }

/* ─────────────────────────────────────────────────────────────
   Perks
───────────────────────────────────────────────────────── */
const PERKS = [
  { icon: Truck,       label: 'Fast nationwide delivery', detail: '2–5 business days' },
  { icon: Zap,         label: 'Cash on delivery',         detail: 'Pay when it arrives' },
  { icon: RotateCcw,   label: '7-day easy returns',       detail: 'No questions asked' },
  { icon: ShieldCheck, label: 'Genuine & sealed',         detail: '100% authentic gear' },
]

const PLATFORM_ACCENT: Record<string, string> = {
  playstation: 'text-violet-glow',
  xbox:        'text-emerald-glow',
  switch:      'text-magenta-glow',
  universal:   'text-violet-glow',
}

const PLATFORM_BTN: Record<string, string> = {
  playstation: 'bg-violet-glow hover:bg-violet-glow/90 shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:shadow-[0_6px_28px_rgba(124,58,237,0.5)]',
  xbox:        'bg-emerald-glow hover:bg-emerald-glow/90 shadow-[0_4px_20px_rgba(5,150,105,0.35)]',
  switch:      'bg-magenta-glow hover:bg-magenta-glow/90 shadow-[0_4px_20px_rgba(219,39,119,0.35)]',
  universal:   'bg-violet-glow hover:bg-violet-glow/90 shadow-[0_4px_20px_rgba(124,58,237,0.35)]',
}

const PLATFORM_RING: Record<string, string> = {
  playstation: 'ring-violet-glow/50 border-violet-glow/60 bg-violet-glow/8',
  xbox:        'ring-emerald-glow/50 border-emerald-glow/60 bg-emerald-glow/8',
  switch:      'ring-magenta-glow/50 border-magenta-glow/60 bg-magenta-glow/8',
  universal:   'ring-violet-glow/50 border-violet-glow/60 bg-violet-glow/8',
}

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────── */
import type { GalleryImage } from '@/components/product/product-gallery'

export function ProductPurchasePanel({
  product,
  fallbackImage,
  onVariantImage,
}: {
  product: Product
  fallbackImage: string
  onVariantImage?: (img: GalleryImage | null) => void
}) {
  const router = useRouter()
  const { addItem } = useCart()
  const { show } = useToast()
  const { has, toggle } = useWishlist()

  const variants = product.variants ?? []
  const [variantIdx, setVariantIdx] = useState(variants.length > 0 ? 0 : -1)
  const [quantity, setQuantity] = useState(1)
  const [selectedCondition, setSelectedCondition] = useState<'new' | 'used'>('new')

  const activeVariant = variantIdx >= 0 ? variants[variantIdx] : null

  // A standalone New/Used toggle only makes sense when there's no variant to
  // carry its own condition tag — once variants exist, each one is tagged individually.
  const showConditionToggle = product.condition === 'both' && variants.length === 0
  const effectiveCondition: 'new' | 'used' = activeVariant?.condition ?? (showConditionToggle ? selectedCondition : 'new')

  const selectVariant = (i: number) => {
    setVariantIdx(i)
    setQuantity(1)
    if (onVariantImage) {
      const v = variants[i]
      if (v?.image && typeof v.image === 'object') {
        const resolved = resolveImage(v.image, 'large')
        onVariantImage({ url: resolved.url, alt: `${product.title} — ${v.label}` })
      } else {
        onVariantImage(null)
      }
    }
  }

  // price = variant price if set, else the base price for whichever condition is in effect
  const price =
    activeVariant?.price ??
    (effectiveCondition === 'used' ? (product.usedPrice ?? product.price) : product.price)
  const compareAt =
    activeVariant?.compareAtPrice ??
    (effectiveCondition === 'used' ? product.usedCompareAtPrice : product.compareAtPrice)
  const discount      = discountPercent(price, compareAt)
  const stock         = activeVariant ? (activeVariant.stock ?? 0) : (product.stock ?? 0)
  const soldOut       = product.status === 'sold-out' || stock <= 0
  const lowStock      = !soldOut && stock > 0 && stock <= 5
  const wishlisted    = has(product.id)

  const platform  = (typeof product.platform === 'object' ? product.platform?.slug : null) ?? 'universal'
  const accentCls = PLATFORM_ACCENT[platform] ?? PLATFORM_ACCENT.universal
  const btnCls    = PLATFORM_BTN[platform]    ?? PLATFORM_BTN.universal
  const ringCls   = PLATFORM_RING[platform]   ?? PLATFORM_RING.universal

  // detect if all variants are colour-based
  const allAreColors = variants.length > 0 && variants.every(v => isColorLabel(v.label))

  const variantImage = useMemo(() => {
    if (activeVariant?.image && typeof activeVariant.image === 'object') {
      return resolveImage(activeVariant.image, 'card').url
    }
    return fallbackImage
  }, [activeVariant, fallbackImage])

  // disambiguate which condition was bought when it isn't obvious from the variant itself
  const conditionSuffix = showConditionToggle ? ` (${selectedCondition === 'used' ? 'Used' : 'New'})` : ''
  const cartLineLabel = activeVariant
    ? `${activeVariant.label}${activeVariant.condition ? ` (${activeVariant.condition === 'used' ? 'Used' : 'New'})` : ''}`
    : (conditionSuffix ? conditionSuffix.trim().replace(/[()]/g, '') : undefined)

  const buildCartItem = () => ({
    productId: product.id,
    slug: product.slug,
    title: product.title,
    image: variantImage,
    price,
    compareAtPrice: compareAt ?? undefined,
    variantLabel: cartLineLabel,
    quantity,
    maxQuantity: stock > 0 ? stock : 10,
  })

  const handleAddToCart = () => {
    if (soldOut) return
    addItem(buildCartItem())
    show({
      title: 'Added to cart',
      description: `${product.title}${cartLineLabel ? ` — ${cartLineLabel}` : ''}`,
      variant: 'success',
    })
  }

  const handleBuyNow = () => {
    if (soldOut) return
    addItem(buildCartItem())
    router.push('/checkout')
  }

  const handleWishlist = () => {
    toggle(product.id)
    show({ title: wishlisted ? 'Removed from wishlist' : 'Added to wishlist', description: product.title, variant: 'info' })
  }

  return (
    <div className="flex flex-col gap-7">

      {/* ── Brand + Title ── */}
      <div>
        {product.brand && typeof product.brand === 'object' && (
          <p className={cn('mb-2 text-[11px] font-bold uppercase tracking-[0.28em]', accentCls)}>
            {product.brand.name}
          </p>
        )}
        <h1 className="text-balance font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          {product.title}
        </h1>

        {(product.rating ?? 0) > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <RatingStars rating={product.rating ?? 0} size={15} />
              <span className="text-sm text-ink-400">
                {(product.rating ?? 0).toFixed(1)} · {product.reviewCount ?? 0} review{(product.reviewCount ?? 0) === 1 ? '' : 's'}
              </span>
            </div>
            {product.sku && <span className="text-xs text-ink-300">SKU: {product.sku}</span>}
          </div>
        )}
      </div>

      {/* ── Price (animated on variant change) ── */}
      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${price}-${compareAt}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-end gap-3"
          >
            <span className={cn('font-display text-4xl font-extrabold tracking-tight', accentCls)}>
              {formatPrice(price)}
            </span>
            {compareAt && compareAt > price && (
              <span className="mb-1 text-base text-ink-300 line-through">{formatPrice(compareAt)}</span>
            )}
            {discount && (
              <span className="mb-1">
                <Badge variant="sale">Save {discount}%</Badge>
              </span>
            )}
          </motion.div>
        </AnimatePresence>

        {/* stock + condition badges */}
        <div className="mt-3 flex flex-wrap gap-2">
          {soldOut ? (
            <Badge variant="soldout">Currently sold out</Badge>
          ) : lowStock ? (
            <Badge variant="warning">Only {stock} left in stock</Badge>
          ) : (
            <Badge variant="success">In stock &amp; ready to ship</Badge>
          )}
          {product.condition === 'used' && <Badge variant="warning">Used</Badge>}
          {product.condition === 'both' && !activeVariant && (
            <Badge variant={effectiveCondition === 'used' ? 'warning' : 'outline'}>
              {effectiveCondition === 'used' ? 'Used' : 'New'}
            </Badge>
          )}
        </div>
      </div>

      {/* ── New / Used toggle (single-SKU products that sell both) ── */}
      {showConditionToggle && (
        <div>
          <p className="mb-3 font-display text-[11px] font-bold uppercase tracking-[0.22em] text-ink-500">
            Condition
          </p>
          <div className="flex flex-wrap gap-2">
            {(['new', 'used'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCondition(c)}
                className={cn(
                  'rounded-xl border px-4 py-2.5 font-display text-sm font-semibold capitalize transition-all duration-200',
                  selectedCondition === c
                    ? `border-transparent ${ringCls} ring-1 text-ink-900`
                    : 'border-surface-300 bg-white text-ink-600 hover:border-surface-400 hover:text-ink-900',
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Short description ── */}
      {product.shortDescription && (
        <p className="max-w-xl text-sm leading-relaxed text-ink-500">{product.shortDescription}</p>
      )}

      {/* ── Product note callout ── */}
      {product.note && (
        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm9-1v4.5H7V7h2Zm-1-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/>
          </svg>
          <p className="text-sm leading-relaxed text-amber-800">{product.note}</p>
        </div>
      )}

      {/* ── Variant picker ── */}
      {variants.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-ink-500">
              {allAreColors ? 'Colour' : 'Choose an option'}
            </p>
            {allAreColors && activeVariant && (
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeVariant.label}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18 }}
                  className="text-sm font-semibold text-ink-700"
                >
                  {activeVariant.label}
                  {activeVariant.condition && (
                    <span className={cn('ml-1.5 font-normal', activeVariant.condition === 'used' ? 'text-amber-600' : 'text-emerald-glow')}>
                      · {activeVariant.condition === 'used' ? 'Used' : 'New'}
                    </span>
                  )}
                </motion.p>
              </AnimatePresence>
            )}
          </div>

          {allAreColors ? (
            /* ── Colour swatches ── */
            <div className="flex flex-wrap gap-3">
              {variants.map((v, i) => {
                const swatchColor = getSwatchColor(v.label) ?? '#999'
                const isSelected = i === variantIdx
                const isOut = (v.stock ?? 0) <= 0
                const conditionTag = v.condition ? ` — ${v.condition === 'used' ? 'Used' : 'New'}` : ''
                return (
                  <div key={v.id ?? i} className="flex flex-col items-center gap-1.5">
                    <button
                      type="button"
                      disabled={isOut}
                      title={`${v.label}${conditionTag}${v.price && v.price !== product.price ? ` — ${formatPrice(v.price)}` : ''}`}
                      onClick={() => selectVariant(i)}
                      className={cn(
                        'group relative h-10 w-10 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2',
                        isSelected
                          ? `ring-2 ring-offset-2 ${ringCls} scale-110`
                          : 'ring-1 ring-surface-300 hover:ring-surface-400 hover:scale-110',
                        isOut && 'cursor-not-allowed opacity-40',
                      )}
                      style={{ backgroundColor: swatchColor }}
                    >
                      {/* sold-out diagonal slash */}
                      {isOut && (
                        <span className="absolute inset-0 flex items-center justify-center rounded-full">
                          <span className="block h-[1.5px] w-8 rotate-45 bg-white/70" />
                        </span>
                      )}
                      {/* selected checkmark */}
                      {isSelected && !isOut && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.span>
                      )}
                      {/* white swatch needs a dark check */}
                      {isSelected && !isOut && swatchColor.startsWith('#f') && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2.5 7L5.5 10L11.5 4" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.span>
                      )}
                    </button>
                    {/* condition label — only shown when the product sells both new & used */}
                    {v.condition && (
                      <span
                        className={cn(
                          'font-display text-[9px] font-bold uppercase tracking-wide',
                          v.condition === 'used' ? 'text-amber-600' : 'text-emerald-glow',
                        )}
                      >
                        {v.condition === 'used' ? 'Used' : 'New'}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            /* ── Text pills (sizes / denominations / editions) ── */
            <div className="flex flex-wrap gap-2">
              {variants.map((v, i) => {
                const isSelected = i === variantIdx
                const isOut = (v.stock ?? 0) <= 0
                const variantBasePrice = v.condition === 'used' ? (product.usedPrice ?? product.price) : product.price
                const variantPrice = v.price ?? variantBasePrice
                return (
                  <button
                    key={v.id ?? i}
                    type="button"
                    disabled={isOut}
                    onClick={() => selectVariant(i)}
                    className={cn(
                      'relative rounded-xl border px-4 py-2.5 font-display text-sm font-semibold transition-all duration-200',
                      isSelected
                        ? `border-transparent ${ringCls} ring-1 text-ink-900`
                        : 'border-surface-300 bg-white text-ink-600 hover:border-surface-400 hover:text-ink-900',
                      isOut && 'cursor-not-allowed opacity-40 line-through',
                    )}
                  >
                    {v.label}
                    {v.condition && (
                      <span
                        className={cn(
                          'ml-1.5 rounded px-1 py-0.5 align-middle text-[9px] font-bold uppercase tracking-wide',
                          v.condition === 'used' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-glow/10 text-emerald-glow',
                        )}
                      >
                        {v.condition}
                      </span>
                    )}
                    {variantPrice !== product.price && (
                      <span className={cn('ml-2 text-xs font-medium', isSelected ? accentCls : 'text-ink-400')}>
                        {formatPrice(variantPrice)}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Quantity + Actions ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

        {/* Quantity stepper */}
        <div className="flex items-center gap-2 rounded-2xl border border-surface-300 bg-white px-2 py-2 shadow-sm">
          <button
            type="button"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            disabled={soldOut}
            aria-label="Decrease quantity"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-500 transition-colors hover:bg-surface-100 hover:text-ink-900 disabled:opacity-30"
          >
            <Minus size={15} />
          </button>
          <span className="w-7 text-center font-display text-sm font-bold text-ink-900">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(q => Math.min(stock > 0 ? stock : 10, q + 1))}
            disabled={soldOut}
            aria-label="Increase quantity"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-500 transition-colors hover:bg-surface-100 hover:text-ink-900 disabled:opacity-30"
          >
            <Plus size={15} />
          </button>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-1 gap-2.5">
          <button
            onClick={handleAddToCart}
            disabled={soldOut}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-surface-300 bg-white px-5 py-3.5 font-display text-sm font-bold text-ink-700 shadow-sm transition-all hover:border-surface-400 hover:shadow-md hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingCart size={16} />
            {soldOut ? 'Unavailable' : 'Add to cart'}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={soldOut}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-display text-sm font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-40',
              btnCls,
            )}
          >
            <Zap size={16} />
            Buy now
          </button>

          <button
            type="button"
            onClick={handleWishlist}
            aria-label="Toggle wishlist"
            className={cn(
              'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border transition-all',
              wishlisted
                ? 'border-magenta-glow/40 bg-magenta-glow/10 text-magenta-glow shadow-[0_4px_16px_rgba(219,39,119,0.2)]'
                : 'border-surface-300 bg-white text-ink-400 shadow-sm hover:border-magenta-glow/40 hover:bg-magenta-glow/8 hover:text-magenta-glow',
            )}
          >
            <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* ── Perks grid ── */}
      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-surface-200 bg-surface-50 p-5 sm:grid-cols-2">
        {PERKS.map((perk) => (
          <div key={perk.label} className="flex items-center gap-3">
            <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm', accentCls)}>
              <perk.icon size={16} />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink-800">{perk.label}</p>
              <p className="text-xs text-ink-400">{perk.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
