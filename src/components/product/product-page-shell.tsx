'use client'

import { useState } from 'react'

import { ProductGallery, type GalleryImage } from '@/components/product/product-gallery'
import { ProductPurchasePanel } from '@/components/product/product-purchase-panel'
import type { Product } from '@/payload-types'

interface Props {
  product: Product
  staticImages: GalleryImage[]
  fallbackImage: string
}

/**
 * Holds variant selection state so the gallery and purchase panel
 * stay in sync — when a colour is picked the gallery jumps to that variant's image.
 */
export function ProductPageShell({ product, staticImages, fallbackImage }: Props) {
  const [variantImage, setVariantImage] = useState<GalleryImage | null>(null)

  // Prepend the variant image when one is selected, so it becomes the active slide
  const galleryImages: GalleryImage[] =
    variantImage
      ? [variantImage, ...staticImages.filter((img) => img.url !== variantImage.url)]
      : staticImages

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
      <ProductGallery images={galleryImages} title={product.title} />
      <ProductPurchasePanel
        product={product}
        fallbackImage={fallbackImage}
        onVariantImage={setVariantImage}
      />
    </div>
  )
}
