import { Compass } from 'lucide-react'
import type { Metadata } from 'next'

import { ShopPagination } from '@/components/shop/pagination'
import { ShopFilters } from '@/components/shop/shop-filters'
import { ShopToolbar } from '@/components/shop/shop-toolbar'
import { ProductCard } from '@/components/shop/product-card'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { getPayloadClient } from '@/lib/payload'
import type { Where } from 'payload'

export const metadata: Metadata = {
  title: 'Shop All — NEXORA',
  description: 'Browse the full NEXORA catalog — consoles, controllers, headsets, racing wheels and the latest titles across every platform.',
}

export const revalidate = 60

const PAGE_SIZE = 12

const SORT_MAP: Record<string, string> = {
  featured: '-featured',
  newest: '-createdAt',
  'price-asc': 'price',
  'price-desc': '-price',
  rating: '-rating',
  deals: '-compareAtPrice',
}

const PLATFORM_LABELS: Record<string, string> = {
  playstation: 'PlayStation',
  xbox: 'Xbox',
  switch: 'Nintendo Switch',
  pc: 'PC',
  universal: 'Universal',
}

type SearchParams = Record<string, string | string[] | undefined>

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const payload = await getPayloadClient()

  const platform = first(params.platform) || ''
  const category = first(params.category) || ''
  const brand = first(params.brand) || ''
  const q = first(params.q) || ''
  const sort = first(params.sort) || 'featured'
  const minPrice = Number(first(params.minPrice) || 0)
  const maxPrice = Number(first(params.maxPrice) || 0)
  const rating = Number(first(params.rating) || 0)
  const page = Math.max(1, Number(first(params.page) || 1))

  const and: Where[] = [{ status: { not_equals: 'draft' } }]
  if (platform) and.push({ platform: { equals: platform } })
  if (category) and.push({ 'category.slug': { equals: category } })
  if (brand) and.push({ 'brand.slug': { equals: brand } })
  if (q) and.push({ title: { like: q } })
  if (minPrice > 0) and.push({ price: { greater_than_equal: minPrice } })
  if (maxPrice > 0) and.push({ price: { less_than_equal: maxPrice } })
  if (rating > 0) and.push({ rating: { greater_than_equal: rating } })
  if (sort === 'deals') and.push({ compareAtPrice: { greater_than: 0 } })

  const where: Where = and.length > 1 ? { and } : and[0]
  const sortValue = SORT_MAP[sort] ?? SORT_MAP.featured

  const [productsRes, categoriesRes, brandsRes] = await Promise.all([
    payload.find({ collection: 'products', where, sort: sortValue, limit: PAGE_SIZE, page, depth: 2 }),
    payload.find({ collection: 'categories', sort: 'navOrder', limit: 100 }),
    payload.find({ collection: 'brands', sort: 'name', limit: 100 }),
  ])

  const activeCategory = category ? categoriesRes.docs.find((c) => c.slug === category) : null
  const activeBrand = brand ? brandsRes.docs.find((b) => b.slug === brand) : null

  let heading = 'Shop all gear'
  let eyebrow = 'NEXORA catalog'
  if (q) {
    heading = `Results for “${q}”`
    eyebrow = 'Search'
  } else if (activeCategory) {
    heading = activeCategory.name
    eyebrow = platform ? PLATFORM_LABELS[platform] : 'Category'
  } else if (activeBrand) {
    heading = activeBrand.name
    eyebrow = 'Brand'
  } else if (platform) {
    heading = PLATFORM_LABELS[platform] ?? 'Shop'
    eyebrow = 'Platform'
  } else if (sort === 'deals') {
    heading = 'Best deals right now'
    eyebrow = 'Deals'
  }

  const plainSearchParams: Record<string, string | undefined> = {
    platform: platform || undefined,
    category: category || undefined,
    brand: brand || undefined,
    q: q || undefined,
    sort: sort !== 'featured' ? sort : undefined,
    minPrice: minPrice > 0 ? String(minPrice) : undefined,
    maxPrice: maxPrice > 0 ? String(maxPrice) : undefined,
    rating: rating > 0 ? String(rating) : undefined,
  }

  return (
    <div className="relative">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] opacity-30" />

      <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-3 inline-flex items-center gap-2 rounded-sm border border-cyan-glow/35 bg-cyan-glow/10 px-3 py-1 font-display text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-glow">
            <span className="h-1 w-1 rounded-full bg-cyan-glow shadow-[0_0_4px_rgba(0,229,255,0.9)]" />
            {eyebrow}
          </div>
          <h1 className="text-balance font-display text-3xl font-extrabold tracking-tight text-ink-100 sm:text-4xl lg:text-5xl">
            {heading}
          </h1>
          {activeCategory?.description && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500">{activeCategory.description}</p>
          )}
          <div className="divider-glow mt-6" />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="glass-panel sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl p-5">
              <ShopFilters categories={categoriesRes.docs} brands={brandsRes.docs} />
            </div>
          </aside>

          <div className="min-w-0">
            <ShopToolbar totalDocs={productsRes.totalDocs} categories={categoriesRes.docs} brands={brandsRes.docs} />

            {productsRes.docs.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4">
                  {productsRes.docs.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
                <ShopPagination page={productsRes.page ?? 1} totalPages={productsRes.totalPages ?? 1} searchParams={plainSearchParams} />
              </>
            ) : (
              <div className="glass-panel flex flex-col items-center gap-4 rounded-3xl px-6 py-20 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-violet-glow">
                  <Compass size={24} />
                </span>
                <div>
                  <p className="font-display text-lg font-semibold text-ink-100">No products match these filters</p>
                  <p className="mt-1.5 text-sm text-ink-500">Try widening your search or clearing a few filters to see more gear.</p>
                </div>
                <Button href="/shop" variant="secondary" size="md">
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
