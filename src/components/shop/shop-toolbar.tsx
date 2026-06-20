'use client'

import * as Dialog from '@radix-ui/react-dialog'
import * as Select from '@radix-ui/react-select'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { ShopFilters } from '@/components/shop/shop-filters'
import { cn } from '@/lib/utils'
import type { Brand, Category } from '@/payload-types'

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest arrivals' },
  { value: 'price-asc', label: 'Price: Low to high' },
  { value: 'price-desc', label: 'Price: High to low' },
  { value: 'rating', label: 'Top rated' },
  { value: 'deals', label: 'Biggest deals' },
]

export function ShopToolbar({
  totalDocs,
  categories,
  brands,
}: {
  totalDocs: number
  categories: Category[]
  brands: Brand[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const sort = searchParams.get('sort') ?? 'featured'
  const activeSort = SORT_OPTIONS.find((s) => s.value === sort) ?? SORT_OPTIONS[0]

  const setSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'featured') params.delete('sort')
    else params.set('sort', value)
    params.delete('page')
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname, { scroll: false })
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-ink-500">
        <span className="font-display font-semibold text-ink-100">{totalDocs}</span>{' '}
        {totalDocs === 1 ? 'product' : 'products'} found
      </p>

      <div className="flex items-center gap-2.5">
        <Dialog.Root open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="glass inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-ink-100 transition-colors hover:border-white/20 lg:hidden"
            >
              <SlidersHorizontal size={15} />
              Filters
            </button>
          </Dialog.Trigger>
          <AnimatePresence>
            {mobileFiltersOpen && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild forceMount>
                  <motion.div
                    className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                </Dialog.Overlay>
                <Dialog.Content asChild forceMount>
                  <motion.div
                    className="fixed inset-y-0 left-0 z-[71] flex w-full max-w-sm flex-col overflow-y-auto border-r border-white/10 bg-base-900 p-6"
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <Dialog.Title className="font-display text-lg font-semibold text-ink-100">Filter products</Dialog.Title>
                      <Dialog.Close asChild>
                        <button
                          aria-label="Close filters"
                          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-white/5 hover:text-white"
                        >
                          <X size={18} />
                        </button>
                      </Dialog.Close>
                    </div>
                    <ShopFilters categories={categories} brands={brands} onNavigate={() => setMobileFiltersOpen(false)} />
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>

        <Select.Root value={activeSort.value} onValueChange={setSort}>
          <Select.Trigger className="glass inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-ink-100 outline-none transition-colors hover:border-white/20 focus-visible:ring-2 focus-visible:ring-violet-glow/50">
            <span className="text-ink-500">Sort:</span>
            <Select.Value />
            <Select.Icon>
              <ChevronDown size={15} className="text-ink-400" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content
              position="popper"
              sideOffset={8}
              className="z-[80] overflow-hidden rounded-2xl border border-white/10 bg-base-850/95 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl"
            >
              <Select.Viewport>
                {SORT_OPTIONS.map((opt) => (
                  <Select.Item
                    key={opt.value}
                    value={opt.value}
                    className={cn(
                      'flex cursor-pointer items-center justify-between gap-6 rounded-xl px-3.5 py-2.5 text-sm text-ink-300 outline-none transition-colors',
                      'data-[highlighted]:bg-white/[0.06] data-[highlighted]:text-white data-[state=checked]:text-white',
                    )}
                  >
                    <Select.ItemText>{opt.label}</Select.ItemText>
                    <Select.ItemIndicator>
                      <Check size={14} className="text-cyan-glow" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    </div>
  )
}
