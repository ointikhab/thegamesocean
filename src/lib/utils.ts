import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`
}

export function discountPercent(price: number, compareAtPrice?: number | null): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}

/**
 * Returns the canonical product URL: /{primaryCategorySlug}/products/{productSlug}
 * Falls back to /{platform}/products/{slug} when categories aren't loaded.
 */
export function getProductHref(product: {
  slug: string
  platform?: string | null
  category?: Array<{ slug?: string } | number> | null
}): string {
  const cats = product.category ?? []
  for (const c of cats) {
    if (typeof c === 'object' && 'slug' in c && c.slug) {
      return `/${c.slug}/products/${product.slug}`
    }
  }
  return `/${product.platform ?? 'products'}/products/${product.slug}`
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}
