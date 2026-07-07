'use client'

import { Loader2, SearchX } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { resolveImage } from '@/lib/media'
import { formatPrice, getProductHref } from '@/lib/utils'
import type { Product } from '@/payload-types'

export function SearchSuggestions({ query, onNavigate }: { query: string; onNavigate: () => void }) {
  const trimmed = query.trim()
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (trimmed.length < 2) {
      setResults([])
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams()
        params.set('where[title][like]', trimmed)
        params.set('where[status][not_equals]', 'draft')
        params.set('limit', '6')
        params.set('depth', '1')
        const res = await fetch(`/api/products?${params.toString()}`)
        const data = await res.json()
        if (active) setResults(data?.docs ?? [])
      } catch {
        if (active) setResults([])
      } finally {
        if (active) setLoading(false)
      }
    }, 300)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [trimmed])

  if (trimmed.length < 2) return null

  return (
    <div className="mt-2 overflow-hidden rounded-2xl border border-surface-300 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
      {loading ? (
        <div className="flex items-center justify-center gap-2 px-5 py-8 text-sm text-ink-400">
          <Loader2 size={16} className="animate-spin" />
          Searching…
        </div>
      ) : results.length > 0 ? (
        <>
          <ul className="max-h-[360px] overflow-y-auto py-2">
            {results.map((product) => {
              const image = resolveImage(
                typeof product.images?.[0]?.image === 'object' ? product.images[0].image : null,
                'thumbnail',
              )
              return (
                <li key={product.id}>
                  <Link
                    href={getProductHref(product)}
                    onClick={onNavigate}
                    className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-surface-100"
                  >
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-100">
                      <Image src={image.url} alt={image.alt || product.title} fill sizes="44px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-sm font-semibold text-ink-900">{product.title}</span>
                      <span className="block text-xs text-ink-400">{formatPrice(product.price)}</span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
          <Link
            href={`/shop?q=${encodeURIComponent(trimmed)}`}
            onClick={onNavigate}
            className="block border-t border-surface-200 px-4 py-3 text-center font-display text-xs font-bold uppercase tracking-wider text-violet-glow transition-colors hover:bg-violet-glow/5"
          >
            View all results for &ldquo;{trimmed}&rdquo;
          </Link>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 px-5 py-8 text-center text-sm text-ink-400">
          <SearchX size={20} className="text-ink-300" />
          No products found for &ldquo;{trimmed}&rdquo;
        </div>
      )}
    </div>
  )
}
