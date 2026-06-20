import type { Metadata } from 'next'

import { BrandStrip } from '@/components/home/brand-strip'
import { HeroCarousel } from '@/components/home/hero-carousel'
import { PlatformGrid } from '@/components/home/platform-grid'
import { ProductRail } from '@/components/home/product-rail'
import { PromoBand } from '@/components/home/promo-band'
import { ValueProps } from '@/components/home/value-props'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'NEXORA — Next-Level Gaming Gear',
}

export const revalidate = 60

export default async function HomePage() {
  const payload = await getPayloadClient()

  const [banners, latest, playstation, xbox, switchGames, accessories, brands] = await Promise.all([
    payload.find({ collection: 'banners', where: { active: { equals: true } }, sort: 'order', limit: 5 }),
    payload.find({ collection: 'products', where: { status: { not_equals: 'draft' } }, sort: '-createdAt', limit: 10, depth: 2 }),
    payload.find({
      collection: 'products',
      where: { and: [{ platform: { equals: 'playstation' } }, { status: { not_equals: 'draft' } }] },
      sort: '-featured',
      limit: 10,
      depth: 2,
    }),
    payload.find({
      collection: 'products',
      where: { and: [{ platform: { equals: 'xbox' } }, { status: { not_equals: 'draft' } }] },
      sort: '-featured',
      limit: 10,
      depth: 2,
    }),
    payload.find({
      collection: 'products',
      where: { and: [{ platform: { equals: 'switch' } }, { status: { not_equals: 'draft' } }] },
      sort: '-featured',
      limit: 10,
      depth: 2,
    }),
    payload.find({
      collection: 'products',
      where: {
        and: [
          { 'category.slug': { equals: 'accessories' } },
          { status: { not_equals: 'draft' } },
        ],
      },
      sort: '-featured',
      limit: 10,
      depth: 2,
    }),
    payload.find({ collection: 'brands', limit: 14 }),
  ])

  return (
    <>
      <HeroCarousel banners={banners.docs} />
      <ValueProps />
      <ProductRail
        eyebrow="Just dropped"
        title="Latest arrivals"
        description="Fresh off the shelves — the newest consoles, accessories and titles to land at NEXORA."
        href="/shop?sort=newest"
        products={latest.docs}
      />
      <PlatformGrid />
      <ProductRail
        eyebrow="PlayStation"
        title="For your PS5 & PS4 setup"
        href="/shop?platform=playstation"
        products={playstation.docs}
      />
      <BrandStrip brands={brands.docs} />
      <ProductRail eyebrow="Xbox" title="Series X|S essentials" href="/shop?platform=xbox" products={xbox.docs} />
      <PromoBand />
      <ProductRail
        eyebrow="Nintendo Switch"
        title="Handheld & party favourites"
        href="/shop?platform=switch"
        products={switchGames.docs}
      />
      <ProductRail
        eyebrow="Accessories"
        title="Level up your loadout"
        description="Controllers, headsets, racing wheels and more — engineered for competitive edge."
        href="/shop?category=accessories"
        products={accessories.docs}
      />
    </>
  )
}
