import type { Metadata } from 'next'

import { BrandStrip } from '@/components/home/brand-strip'
import { HeroCarousel } from '@/components/home/hero-carousel'
import type { PlatformCard, PlatformSectionData } from '@/components/home/platform-grid'
import { PlatformGrid } from '@/components/home/platform-grid'
import { ProductRail } from '@/components/home/product-rail'
import { PromoBand } from '@/components/home/promo-band'
import type { ValuePropItem } from '@/components/home/value-props'
import { ValueProps } from '@/components/home/value-props'
import { getPayloadClient } from '@/lib/payload'
import type { HomePage, Product } from '@/payload-types'

export const metadata: Metadata = {
  title: 'The Games Ocean — Next-Level Gaming Gear',
}

export const revalidate = 60

/** Narrow resolved relationship objects from the array Payload returns at depth ≥ 1. */
function toProducts(raw: (number | Product)[] | null | undefined): Product[] {
  if (!raw) return []
  return raw.filter((p): p is Product => typeof p === 'object' && p !== null)
}

export default async function HomePageRoute() {
  const payload = await getPayloadClient()

  // Fetch the CMS-controlled homepage global (depth 2 resolves product relationships)
  const homePage = (await payload.findGlobal({
    slug: 'home-page',
    depth: 2,
  })) as HomePage

  const brands = await payload.find({ collection: 'brands', limit: 20 })

  const heroSlides = (homePage.heroSlides ?? []).filter(
    (s): s is typeof s & { image: NonNullable<typeof s['image']> } =>
      typeof s.image === 'object' && s.image !== null,
  )

  // ── Section data ──────────────────────────────────────────────────
  const valueProps: ValuePropItem[] = (homePage.valueProps ?? []).map((v) => ({
    icon: v.icon,
    title: v.title,
    description: v.description,
    accent: v.accent,
  }))

  const la = homePage.latestArrivals ?? {}
  const latestProducts = toProducts(la.products)

  const platformSection: PlatformSectionData = {
    eyebrow: homePage.platformSection?.eyebrow,
    title: homePage.platformSection?.title,
    description: homePage.platformSection?.description,
    cards: (homePage.platformSection?.cards ?? []) as PlatformCard[],
  }

  const platformRails = (homePage.platformRails ?? []).map((r) => ({
    eyebrow: r.eyebrow,
    title: r.title,
    description: r.description ?? undefined,
    href: r.href ?? undefined,
    products: toProducts(r.products),
  }))

  const categoryRails = (homePage.categoryRails ?? []).map((r) => ({
    eyebrow: r.eyebrow,
    title: r.title,
    description: r.description ?? undefined,
    href: r.href ?? undefined,
    products: toProducts(r.products),
  }))

  // ── Layout ────────────────────────────────────────────────────────
  // Structure: Hero → ValueProps → Latest Arrivals → Platform Grid →
  //   platformRails[0] → Brand Strip → platformRails[1] → Promo Band →
  //   platformRails[2…] → Category Rails
  return (
    <>
      <HeroCarousel slides={heroSlides} />

      <ValueProps items={valueProps} />

      {latestProducts.length > 0 && (
        <ProductRail
          eyebrow={la.eyebrow ?? 'Just dropped'}
          title={la.title ?? 'Latest arrivals'}
          description={la.description ?? undefined}
          href={la.href ?? '/shop?sort=newest'}
          products={latestProducts}
        />
      )}

      <PlatformGrid section={platformSection} />

      {/* Platform rail 0 — sits above the Brand Strip */}
      {platformRails[0] && (
        <ProductRail
          eyebrow={platformRails[0].eyebrow}
          title={platformRails[0].title}
          description={platformRails[0].description}
          href={platformRails[0].href}
          products={platformRails[0].products}
        />
      )}

      <BrandStrip brands={brands.docs} heading={homePage.brandStripHeading} />


      {/* Platform rail 1 — sits above the Promo Band */}
      {platformRails[1] && (
        <ProductRail
          eyebrow={platformRails[1].eyebrow}
          title={platformRails[1].title}
          description={platformRails[1].description}
          href={platformRails[1].href}
          products={platformRails[1].products}
        />
      )}

      <PromoBand data={homePage.promoBand} />

      {/* Any additional platform rails (3rd, 4th…) */}
      {platformRails.slice(2).map((rail, i) => (
        <ProductRail
          key={i}
          eyebrow={rail.eyebrow}
          title={rail.title}
          description={rail.description}
          href={rail.href}
          products={rail.products}
        />
      ))}

      {/* Category rails */}
      {categoryRails.map((rail, i) => (
        <ProductRail
          key={i}
          eyebrow={rail.eyebrow}
          title={rail.title}
          description={rail.description}
          href={rail.href}
          products={rail.products}
        />
      ))}
    </>
  )
}
