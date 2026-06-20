import { Star } from 'lucide-react'

import { cn } from '@/lib/utils'

export function RatingStars({
  rating,
  size = 14,
  className,
}: {
  rating: number
  size?: number
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = rating >= i + 1
        const half = !filled && rating > i && rating < i + 1
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-ink-700" strokeWidth={1.5} />
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: half ? '50%' : '100%' }}
              >
                <Star size={size} className="text-amber-400" fill="currentColor" strokeWidth={1.5} />
              </span>
            )}
          </span>
        )
      })}
    </span>
  )
}
