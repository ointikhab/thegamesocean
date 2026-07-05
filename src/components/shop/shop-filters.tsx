'use client'

import * as Slider from '@radix-ui/react-slider'
import { Check, RotateCcw, Star } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { cn, formatPrice } from '@/lib/utils'
import type { Brand, Category } from '@/payload-types'

const PLATFORMS = [
  { value: 'playstation', label: 'PlayStation' },
  { value: 'xbox', label: 'Xbox' },
  { value: 'switch', label: 'Nintendo Switch' },
  { value: 'pc', label: 'PC' },
  { value: 'universal', label: 'Universal' },
]

const CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'used', label: 'Used' },
  { value: 'both', label: 'Both (new & used)' },
]

const RATINGS = [4, 3, 2]

export const PRICE_MIN = 0
export const PRICE_MAX = 300000
export const PRICE_STEP = 5000

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-white/8 py-5 first:pt-0 last:border-b-0">
      <h3 className="mb-3.5 font-display text-xs font-semibold uppercase tracking-[0.2em] text-ink-300">{title}</h3>
      {children}
    </div>
  )
}

function PillToggle({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all',
        active
          ? 'bg-gradient-to-r from-violet-glow/20 to-cyan-glow/10 text-white ring-1 ring-inset ring-violet-glow/40'
          : 'text-ink-400 hover:bg-white/[0.04] hover:text-ink-100',
      )}
    >
      <span>{children}</span>
      {active && (
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-glow text-base-950">
          <Check size={11} strokeWidth={3} />
        </span>
      )}
    </button>
  )
}

export function ShopFilters({
  categories,
  brands,
  className,
  onNavigate,
}: {
  categories: Category[]
  brands: Brand[]
  className?: string
  onNavigate?: () => void
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const platform = searchParams.get('platform') ?? ''
  const condition = searchParams.get('condition') ?? ''
  const category = searchParams.get('category') ?? ''
  const brand = searchParams.get('brand') ?? ''
  const minRating = Number(searchParams.get('rating') ?? 0)
  const minPriceParam = Number(searchParams.get('minPrice') ?? PRICE_MIN)
  const maxPriceParam = Number(searchParams.get('maxPrice') ?? PRICE_MAX)

  const [priceRange, setPriceRange] = useState<[number, number]>([minPriceParam, maxPriceParam])

  useEffect(() => {
    setPriceRange([minPriceParam, maxPriceParam])
  }, [minPriceParam, maxPriceParam])

  const updateParams = (updates: Record<string, string | null>, resetPage = true) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === '') params.delete(key)
      else params.set(key, value)
    }
    if (resetPage) params.delete('page')
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname, { scroll: false })
    onNavigate?.()
  }

  const toggle = (key: string, value: string, current: string) => {
    updateParams({ [key]: current === value ? null : value })
  }

  const navCategories = categories.filter((c) => !c.parent)
  const childCategories = categories.filter((c) => c.parent)

  const hasActiveFilters = Boolean(
    platform ||
      condition ||
      category ||
      brand ||
      minRating ||
      minPriceParam !== PRICE_MIN ||
      maxPriceParam !== PRICE_MAX,
  )

  const clearAll = () => {
    router.push(pathname, { scroll: false })
    setPriceRange([PRICE_MIN, PRICE_MAX])
    onNavigate?.()
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="mb-1 flex items-center justify-between">
        <p className="font-display text-sm font-semibold text-ink-100">Filters</p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-500 transition-colors hover:text-magenta-glow"
          >
            <RotateCcw size={12} />
            Clear all
          </button>
        )}
      </div>

      <FilterSection title="Platform">
        <div className="flex flex-col gap-1">
          {PLATFORMS.map((p) => (
            <PillToggle key={p.value} active={platform === p.value} onClick={() => toggle('platform', p.value, platform)}>
              {p.label}
            </PillToggle>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Condition">
        <div className="flex flex-col gap-1">
          {CONDITIONS.map((c) => (
            <PillToggle key={c.value} active={condition === c.value} onClick={() => toggle('condition', c.value, condition)}>
              {c.label}
            </PillToggle>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Category">
        <div className="flex flex-col gap-1">
          {navCategories.map((c) => (
            <PillToggle key={c.id} active={category === c.slug} onClick={() => toggle('category', c.slug, category)}>
              {c.name}
            </PillToggle>
          ))}
          {childCategories.length > 0 && (
            <div className="mt-1.5 flex flex-col gap-1 border-t border-white/5 pt-2">
              {childCategories.map((c) => (
                <PillToggle key={c.id} active={category === c.slug} onClick={() => toggle('category', c.slug, category)}>
                  <span className="text-xs text-ink-500">└</span> {c.name}
                </PillToggle>
              ))}
            </div>
          )}
        </div>
      </FilterSection>

      <FilterSection title="Brand">
        <div className="flex max-h-64 flex-col gap-1 overflow-y-auto pr-1">
          {brands.map((b) => (
            <PillToggle key={b.id} active={brand === b.slug} onClick={() => toggle('brand', b.slug, brand)}>
              {b.name}
            </PillToggle>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price range">
        <div className="px-1">
          <Slider.Root
            className="relative flex h-5 w-full touch-none items-center"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            onValueCommit={(value) =>
              updateParams({
                minPrice: value[0] === PRICE_MIN ? null : String(value[0]),
                maxPrice: value[1] === PRICE_MAX ? null : String(value[1]),
              })
            }
          >
            <Slider.Track className="relative h-1 grow rounded-full bg-white/10">
              <Slider.Range className="absolute h-full rounded-full bg-gradient-to-r from-violet-glow to-cyan-glow" />
            </Slider.Track>
            <Slider.Thumb className="block h-4 w-4 rounded-full border-2 border-base-950 bg-white shadow-md transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-glow/60" />
            <Slider.Thumb className="block h-4 w-4 rounded-full border-2 border-base-950 bg-white shadow-md transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-glow/60" />
          </Slider.Root>
          <div className="mt-3 flex items-center justify-between text-xs font-medium text-ink-400">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}{priceRange[1] >= PRICE_MAX ? '+' : ''}</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Customer rating">
        <div className="flex flex-col gap-1">
          {RATINGS.map((r) => (
            <PillToggle key={r} active={minRating === r} onClick={() => toggle('rating', String(r), String(minRating))}>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < r ? 'text-amber-400' : 'text-ink-700'}
                      fill={i < r ? 'currentColor' : 'none'}
                      strokeWidth={1.5}
                    />
                  ))}
                </span>
                <span>& up</span>
              </span>
            </PillToggle>
          ))}
        </div>
      </FilterSection>
    </div>
  )
}
