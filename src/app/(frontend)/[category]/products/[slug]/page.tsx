import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProductRail } from '@/components/home/product-rail'
import type { GalleryImage } from '@/components/product/product-gallery'
import { ProductPageShell } from '@/components/product/product-page-shell'
import { ProductDescription } from '@/components/product/prose'
import { ProductTabs } from '@/components/product/product-tabs'
import { YouTubeEmbed } from '@/components/product/youtube-embed'
import { Reveal } from '@/components/ui/reveal'
import { resolveImage } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'
import type { Media } from '@/payload-types'

export const revalidate = 60

async function getProduct(slug: string) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'products',
    where: { and: [{ slug: { equals: slug } }, { status: { not_equals: 'draft' } }] },
    limit: 1,
    depth: 2,
  })
  return res.docs[0] ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Product not found — The Games Ocean' }
  return {
    title: `${product.title} — The Games Ocean`,
    description: product.shortDescription || `Shop ${product.title} at The Games Ocean.`,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const payload = await getPayloadClient()
  const categoryIds = (product.category ?? [])
    .map((c) => (typeof c === 'object' ? c.id : c))
    .filter((id): id is number => typeof id === 'number')

  const [reviewsRes, relatedRes] = await Promise.all([
    payload.find({
      collection: 'reviews',
      where: { and: [{ product: { equals: product.id } }, { approved: { equals: true } }] },
      sort: '-createdAt',
      limit: 20,
      depth: 1,
      overrideAccess: true,
    }),
    categoryIds.length > 0
      ? payload.find({
          collection: 'products',
          where: {
            and: [
              { category: { in: categoryIds } },
              { status: { not_equals: 'draft' } },
              { id: { not_equals: product.id } },
            ],
          },
          sort: '-featured',
          limit: 4,
          depth: 2,
        })
      : Promise.resolve(null),
  ])

  const images: GalleryImage[] = (product.images ?? [])
    .map((entry) => (typeof entry.image === 'object' ? (entry.image as Media) : null))
    .filter((media): media is Media => Boolean(media))
    .map((media) => resolveImage(media, 'large'))

  const fallbackImage = images[0]?.url ?? resolveImage(null).url

  // Find the matching category object for breadcrumb label
  const categoryObj = (product.category ?? []).find(
    (c) => typeof c === 'object' && 'slug' in c && c.slug === category,
  )
  const categoryLabel =
    typeof categoryObj === 'object' && 'name' in categoryObj
      ? categoryObj.name
      : category.replace(/-/g, ' ')

  return (
    <div className="relative">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] opacity-25" />

      <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Reveal>
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-ink-400">
            <Link href="/" className="capitalize transition-colors hover:text-ink-900">Home</Link>
            <ChevronRight size={12} className="text-ink-300" />
            <Link href="/shop" className="transition-colors hover:text-ink-900">Shop</Link>
            <ChevronRight size={12} className="text-ink-300" />
            <Link
              href={`/shop?category=${category}`}
              className="capitalize transition-colors hover:text-ink-900"
            >
              {categoryLabel}
            </Link>
            <ChevronRight size={12} className="text-ink-300" />
            <span className="font-medium text-ink-700">{product.title}</span>
          </nav>
        </Reveal>

        {/* Gallery + Purchase panel */}
        <div className="mt-8">
          <ProductPageShell
            product={product}
            staticImages={images}
            fallbackImage={fallbackImage}
          />
        </div>

        {/* Description + YouTube */}
        <Reveal>
          <div className="mt-14 max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <h2 className="font-display text-xl font-bold text-ink-900">About this product</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-surface-300 to-transparent" />
            </div>

            {/* YouTube embed — shown above description when available */}
            {product.youtubeUrl && (
              <div className="mb-6">
                <YouTubeEmbed url={product.youtubeUrl} />
              </div>
            )}

            <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm sm:p-8">
              {product.note && (
                <div className="mb-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
                  <span className="mt-0.5 shrink-0 text-amber-500">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm9-1v4.5H7V7h2Zm-1-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/>
                    </svg>
                  </span>
                  <p className="text-sm leading-relaxed text-amber-800">{product.note}</p>
                </div>
              )}
              <ProductDescription description={product.description} />
            </div>
          </div>
        </Reveal>

        {/* Specs + Reviews */}
        <Reveal>
          <div className="mt-10">
            <ProductTabs product={product} reviews={reviewsRes.docs} />
          </div>
        </Reveal>
      </div>

      {relatedRes && relatedRes.docs.length > 0 && (
        <ProductRail
          eyebrow="You might also like"
          title="Complete the setup"
          products={relatedRes.docs}
        />
      )}
    </div>
  )
}
