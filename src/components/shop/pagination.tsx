import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

function hrefFor(searchParams: Record<string, string | undefined>, page: number) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(searchParams)) {
    if (value && key !== 'page') params.set(key, value)
  }
  if (page > 1) params.set('page', String(page))
  const qs = params.toString()
  return qs ? `/shop?${qs}` : '/shop'
}

function pageList(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set<number>([1, 2, total - 1, total, current - 1, current, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const result: (number | 'ellipsis')[] = []
  let prev = 0
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push('ellipsis')
    result.push(p)
    prev = p
  }
  return result
}

export function ShopPagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number
  totalPages: number
  searchParams: Record<string, string | undefined>
}) {
  if (totalPages <= 1) return null

  const items = pageList(page, totalPages)

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1.5">
      <Link
        href={hrefFor(searchParams, Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ink-300 transition-colors hover:border-violet-glow/40 hover:text-white',
          page <= 1 && 'pointer-events-none opacity-30',
        )}
      >
        <ChevronLeft size={16} />
      </Link>

      {items.map((item, i) =>
        item === 'ellipsis' ? (
          <span key={`e-${i}`} className="flex h-10 w-8 items-center justify-center text-ink-700">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(searchParams, item)}
            className={cn(
              'flex h-10 min-w-10 items-center justify-center rounded-full px-3 font-display text-sm font-medium transition-colors',
              item === page
                ? 'bg-gradient-to-r from-violet-glow to-cyan-glow text-base-950'
                : 'border border-white/10 text-ink-300 hover:border-violet-glow/40 hover:text-white',
            )}
          >
            {item}
          </Link>
        ),
      )}

      <Link
        href={hrefFor(searchParams, Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ink-300 transition-colors hover:border-violet-glow/40 hover:text-white',
          page >= totalPages && 'pointer-events-none opacity-30',
        )}
      >
        <ChevronRight size={16} />
      </Link>
    </nav>
  )
}
