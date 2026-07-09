import type { Media } from '@/payload-types'

type Size = 'thumbnail' | 'card' | 'large' | 'hero'

/** Resolves a Payload upload relation (which may be an id, populated doc, or null) to a usable image. */
export function resolveImage(
  value: number | Media | null | undefined,
  size?: Size,
): { url: string; alt: string } {
  if (value && typeof value === 'object') {
    const sized = size ? value.sizes?.[size]?.url : undefined
    return {
      url: sized || value.url || '/placeholder.svg',
      alt: value.alt || '',
    }
  }
  return { url: '/placeholder.svg', alt: '' }
}
