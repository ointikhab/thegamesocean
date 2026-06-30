'use client'

import * as Tabs from '@radix-ui/react-tabs'
import { MessageSquareText, Star } from 'lucide-react'

import { RatingStars } from '@/components/ui/rating-stars'
import { cn } from '@/lib/utils'
import type { Customer, Product, Review } from '@/payload-types'

function reviewerName(customer: Review['customer']): string {
  if (typeof customer !== 'object') return 'The Games Ocean customer'
  const c = customer as Customer
  const last = c.lastName ? ` ${c.lastName.charAt(0)}.` : ''
  return `${c.firstName}${last}`
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days <= 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`
  const years = Math.floor(months / 12)
  return `${years} year${years > 1 ? 's' : ''} ago`
}

const TRIGGER = cn(
  'rounded-xl px-6 py-2.5 font-display text-sm font-semibold text-ink-500 transition-all',
  'data-[state=active]:bg-white data-[state=active]:text-ink-900 data-[state=active]:shadow-sm',
  'data-[state=inactive]:hover:text-ink-700',
)

export function ProductTabs({ product, reviews }: { product: Product; reviews: Review[] }) {
  const specs = product.specs ?? []
  const rating = product.rating ?? 0
  const reviewCount = product.reviewCount ?? reviews.length

  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length
    const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
    return { star, count, pct }
  })

  return (
    <Tabs.Root defaultValue="specs">
      {/* Tab bar */}
      <Tabs.List className="inline-flex gap-1 rounded-2xl bg-surface-200 p-1.5">
        <Tabs.Trigger value="specs" className={TRIGGER}>
          Specifications
        </Tabs.Trigger>
        <Tabs.Trigger value="reviews" className={TRIGGER}>
          Reviews ({reviewCount})
        </Tabs.Trigger>
      </Tabs.List>

      {/* ── Specs ── */}
      <Tabs.Content value="specs" className="mt-5">
        <div className="max-w-3xl rounded-2xl border border-surface-200 bg-white shadow-sm overflow-hidden">
          {specs.length > 0 ? (
            <dl>
              {specs.map((spec, i) => (
                <div
                  key={spec.id ?? i}
                  className={cn(
                    'flex items-center justify-between gap-8 px-6 py-4 text-sm',
                    i % 2 === 0 ? 'bg-white' : 'bg-surface-50',
                    i < specs.length - 1 && 'border-b border-surface-100',
                  )}
                >
                  <dt className="font-medium text-ink-500">{spec.label}</dt>
                  <dd className="text-right font-semibold text-ink-900">{spec.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="px-6 py-10 text-center text-sm text-ink-400">
              No specifications listed for this product.
            </p>
          )}
        </div>
      </Tabs.Content>

      {/* ── Reviews ── */}
      <Tabs.Content value="reviews" className="mt-5">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">

          {/* Rating summary */}
          <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
            <div className="text-center">
              <p className="font-display text-6xl font-extrabold tracking-tight text-ink-900">
                {rating.toFixed(1)}
              </p>
              <div className="mt-2 flex justify-center">
                <RatingStars rating={rating} size={18} />
              </div>
              <p className="mt-2 text-sm text-ink-400">
                {reviewCount} review{reviewCount === 1 ? '' : 's'}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              {breakdown.map(({ star, count, pct }) => (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <div className="flex w-10 shrink-0 items-center justify-end gap-0.5 text-ink-400">
                    {star}<Star size={10} className="fill-amber-400 text-amber-400" />
                  </div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-glow to-cyan-glow transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-5 shrink-0 text-right text-ink-400">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review cards */}
          <div className="flex flex-col gap-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-glow/10 font-display text-sm font-bold text-violet-glow">
                        {reviewerName(review.customer).charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink-900">{reviewerName(review.customer)}</p>
                        <p className="text-xs text-ink-400">{timeAgo(review.createdAt)}</p>
                      </div>
                    </div>
                    <RatingStars rating={review.rating} size={14} />
                  </div>
                  <p className="mt-3.5 font-display text-sm font-bold text-ink-800">{review.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-surface-200 bg-white px-6 py-16 text-center shadow-sm">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-100 text-violet-glow">
                  <MessageSquareText size={22} />
                </span>
                <div>
                  <p className="font-display text-base font-bold text-ink-900">No reviews yet</p>
                  <p className="mt-1 text-sm text-ink-400">Be the first to share what you think about this product.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  )
}
